#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { buildPrompt, parsePrediction } from './prompt-candidates.mjs';

const goldDir = process.argv[2] || path.dirname(new URL(import.meta.url).pathname);
const candidate = String(process.argv[3] || 'B').toUpperCase();
const scope = String(process.argv[4] || process.env.EVAL_SCOPE || 'full').toLowerCase();
if (!['A','B','C'].includes(candidate)) throw new Error('candidate must be A, B, or C');
if (!['pilot','full'].includes(scope)) throw new Error('scope must be pilot or full');

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const token = process.env.CLOUDFLARE_API_TOKEN;
const model = process.env.CF_AI_MODEL || '@cf/openai/gpt-oss-20b';
const maxTokens = Number(process.env.CF_AI_MAX_TOKENS || 512);
const reasoningEffort = String(process.env.CF_AI_REASONING_EFFORT || 'low').toLowerCase();
if (!Number.isInteger(maxTokens) || maxTokens < 16 || maxTokens > 1024) throw new Error('CF_AI_MAX_TOKENS must be an integer from 16 to 1024');
if (!['low','medium','high'].includes(reasoningEffort)) throw new Error('CF_AI_REASONING_EFFORT must be low, medium, or high');
if (!accountId || !token) throw new Error('Set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN. Never commit these values.');

const rubrics = JSON.parse(fs.readFileSync(path.join(goldDir,'rubrics.json'),'utf8'));
const shards = fs.readdirSync(goldDir).filter(n=>/^cases-.*\.json$/.test(n)).sort().map(n=>JSON.parse(fs.readFileSync(path.join(goldDir,n),'utf8')));
let cases = shards.flatMap(s=>s.cases||[]).filter(c=>c.ai_call_expected);
if(scope==='pilot'){
  const pilotPath=path.join(goldDir,'pilot-cases.json');
  const pilot=JSON.parse(fs.readFileSync(pilotPath,'utf8'));
  const ids=new Set(pilot.case_ids||[]);
  cases=cases.filter(c=>ids.has(c.case_id));
  if(cases.length!==ids.size) throw new Error(`pilot case mismatch: requested ${ids.size}, found ${cases.length}`);
}

function needsL2(p){return Array.isArray(p)&&(p.slice(0,4).some(v=>v===3)||p[4]===1||p[5]===2);}
function responsePayload(d){
  return d?.result?.response ?? d?.result ?? d;
}
function extractUsage(d){
  const r=responsePayload(d);
  const u=r?.usage||d?.result?.usage||d?.usage||{};
  const inputTokens=Number(u.prompt_tokens??u.input_tokens??0)||0;
  const outputTokens=Number(u.completion_tokens??u.output_tokens??0)||0;
  const statedTotal=Number(u.total_tokens??0)||0;
  return {
    input_tokens:inputTokens,
    output_tokens:outputTokens,
    total_tokens:statedTotal || (inputTokens + outputTokens)
  };
}
function textFromResponse(d){
  const r=responsePayload(d);
  if(typeof r==='string') return r;
  const choice=r?.choices?.[0] ?? d?.choices?.[0];
  const c=choice?.message?.content;
  if(typeof c==='string') return c;
  if(choice) return '';
  throw new Error(`No text response: ${JSON.stringify(d).slice(0,500)}`);
}
function finishReasonFromResponse(d){
  const r=responsePayload(d);
  return r?.choices?.[0]?.finish_reason ?? d?.choices?.[0]?.finish_reason ?? null;
}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function callAI(prompt){
  const endpoint=`https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/ai/run/${model}`;
  let lastError;
  for(let attempt=1;attempt<=3;attempt++){
    try{
      const res=await fetch(endpoint,{
        method:'POST',
        headers:{authorization:`Bearer ${token}`,'content-type':'application/json'},
        body:JSON.stringify({messages:[{role:'user',content:prompt}],temperature:0,max_tokens:maxTokens,seed:1,reasoning_effort:reasoningEffort})
      });
      const data=await res.json().catch(()=>({}));
      if(!res.ok||data?.success===false){
        const retryable=res.status===429||res.status>=500;
        const err=new Error(`Cloudflare ${res.status}: ${JSON.stringify(data).slice(0,1000)}`);
        if(!retryable) throw err;
        lastError=err;
      }else{
        return {raw:textFromResponse(data),usage:extractUsage(data),attempts:attempt,finish_reason:finishReasonFromResponse(data),provider_response:data};
      }
    }catch(e){
      lastError=e;
      if(attempt===3) break;
    }
    await sleep(500*attempt);
  }
  throw lastError||new Error('Cloudflare request failed');
}
function addUsage(a,b){return {input_tokens:a.input_tokens+b.input_tokens,output_tokens:a.output_tokens+b.output_tokens,total_tokens:a.total_tokens+b.total_tokens};}
const zeroUsage=()=>({input_tokens:0,output_tokens:0,total_tokens:0});

const predictions=[];
let aggregate=zeroUsage();
let escalated=0;
let malformedAfterL2=0;
let lengthFinished=0;
let lengthAfterL2=0;
for (const [i,c] of cases.entries()) {
  const r=rubrics[c.question_id];
  if(!r) throw new Error(`missing rubric ${c.question_id}`);
  const l1Prompt=buildPrompt(candidate,r.compact,c.answer,'');
  const l1=await callAI(l1Prompt);
  if(l1.finish_reason==='length') lengthFinished++;
  let prediction=null;
  let l1Error=null;
  try{prediction=parsePrediction(l1.raw.trim());}catch(e){l1Error=String(e?.message||e);}
  let l2=null,l2Error=null;
  if(l1Error || l1.finish_reason==='length' || needsL2(prediction)){
    escalated++;
    const l2Prompt=buildPrompt(candidate,r.compact,c.answer,r.level2_context);
    l2=await callAI(l2Prompt);
    if(l2.finish_reason==='length'){ lengthFinished++; lengthAfterL2++; }
    try{prediction=parsePrediction(l2.raw.trim());}catch(e){l2Error=String(e?.message||e);prediction=null;malformedAfterL2++;}
  }
  aggregate=addUsage(aggregate,l1.usage);
  if(l2) aggregate=addUsage(aggregate,l2.usage);
  predictions.push({
    case_id:c.case_id,
    prediction,
    l1_raw:l1.raw,
    l1_parse_error:l1Error,
    l1_attempts:l1.attempts,
    l1_finish_reason:l1.finish_reason,
    l1_provider_response:l1.provider_response,
    l2_raw:l2?.raw??null,
    l2_parse_error:l2Error,
    l2_attempts:l2?.attempts??null,
    l2_finish_reason:l2?.finish_reason??null,
    l2_provider_response:l2?.provider_response??null,
    usage:addUsage(l1.usage,l2?.usage||zeroUsage())
  });
  console.error(`[${i+1}/${cases.length}] ${c.case_id} ${l2?'L2':'L1'} -> ${JSON.stringify(prediction)}${l2Error?' MALFORMED':''}`);
}

const evaluatedCaseIds=cases.map(c=>c.case_id);
const report={
  provider:'cloudflare-workers-ai',
  model,
  candidate,
  scope,
  max_tokens:maxTokens,
  reasoning_effort:reasoningEffort,
  evaluated_case_ids:evaluatedCaseIds,
  generated_at:new Date().toISOString(),
  cases:cases.length,
  escalated_to_l2:escalated,
  escalation_rate:escalated/Math.max(1,cases.length),
  malformed_after_l2:malformedAfterL2,
  length_finished_calls:lengthFinished,
  length_after_l2:lengthAfterL2,
  usage:aggregate,
  avg_input_tokens:aggregate.input_tokens/Math.max(1,cases.length),
  avg_output_tokens:aggregate.output_tokens/Math.max(1,cases.length),
  predictions
};
console.log(JSON.stringify(report,null,2));
