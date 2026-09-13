#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { buildPrompt, parsePrediction } from './prompt-candidates.mjs';

const goldDir = process.argv[2] || path.dirname(new URL(import.meta.url).pathname);
const candidate = String(process.argv[3] || 'B').toUpperCase();
if (!['A','B','C'].includes(candidate)) throw new Error('candidate must be A, B, or C');

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const token = process.env.CLOUDFLARE_API_TOKEN;
const model = process.env.CF_AI_MODEL || '@cf/openai/gpt-oss-20b';
if (!accountId || !token) throw new Error('Set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN. Never commit these values.');

const rubrics = JSON.parse(fs.readFileSync(path.join(goldDir,'rubrics.json'),'utf8'));
const shards = fs.readdirSync(goldDir).filter(n=>/^cases-.*\.json$/.test(n)).sort().map(n=>JSON.parse(fs.readFileSync(path.join(goldDir,n),'utf8')));
const cases = shards.flatMap(s=>s.cases||[]).filter(c=>c.ai_call_expected);

function needsL2(p){return p.slice(0,4).some(v=>v===3)||p[4]===1||p[5]===2;}
function extractUsage(d){
  const u=d?.result?.usage||d?.usage||{};
  return {
    input_tokens:Number(u.prompt_tokens??u.input_tokens??0)||0,
    output_tokens:Number(u.completion_tokens??u.output_tokens??0)||0,
    total_tokens:Number(u.total_tokens??0)||0
  };
}
function textFromResponse(d){
  const r=d?.result;
  if(typeof r?.response==='string') return r.response;
  if(typeof r==='string') return r;
  const c=r?.choices?.[0]?.message?.content ?? d?.choices?.[0]?.message?.content;
  if(typeof c==='string') return c;
  throw new Error(`No text response: ${JSON.stringify(d).slice(0,500)}`);
}
async function callAI(prompt){
  const endpoint=`https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/ai/run/${model}`;
  const res=await fetch(endpoint,{
    method:'POST',
    headers:{authorization:`Bearer ${token}`,'content-type':'application/json'},
    body:JSON.stringify({
      messages:[{role:'user',content:prompt}],
      temperature:0,
      max_tokens:24,
      seed:1
    })
  });
  const data=await res.json().catch(()=>({}));
  if(!res.ok||data?.success===false) throw new Error(`Cloudflare ${res.status}: ${JSON.stringify(data).slice(0,1000)}`);
  return {raw:textFromResponse(data),usage:extractUsage(data)};
}
function addUsage(a,b){return {input_tokens:a.input_tokens+b.input_tokens,output_tokens:a.output_tokens+b.output_tokens,total_tokens:a.total_tokens+b.total_tokens};}

const predictions=[];
let aggregate={input_tokens:0,output_tokens:0,total_tokens:0};
let escalated=0;
for (const [i,c] of cases.entries()) {
  const r=rubrics[c.question_id];
  if(!r) throw new Error(`missing rubric ${c.question_id}`);
  const l1Prompt=buildPrompt(candidate,r.compact,c.answer,'');
  const l1=await callAI(l1Prompt);
  let prediction;
  let l1Error=null;
  try{prediction=parsePrediction(l1.raw.trim());}catch(e){l1Error=String(e?.message||e);}
  let l2=null;
  if(l1Error || needsL2(prediction)){
    escalated++;
    const l2Prompt=buildPrompt(candidate,r.compact,c.answer,r.level2_context);
    l2=await callAI(l2Prompt);
    prediction=parsePrediction(l2.raw.trim());
  }
  aggregate=addUsage(aggregate,l1.usage);
  if(l2) aggregate=addUsage(aggregate,l2.usage);
  predictions.push({case_id:c.case_id,prediction,l1_raw:l1.raw,l1_parse_error:l1Error,l2_raw:l2?.raw??null,usage:addUsage(l1.usage,l2?.usage||{input_tokens:0,output_tokens:0,total_tokens:0})});
  console.error(`[${i+1}/${cases.length}] ${c.case_id} ${l2?'L2':'L1'} -> ${JSON.stringify(prediction)}`);
}

const report={
  provider:'cloudflare-workers-ai',
  model,
  candidate,
  generated_at:new Date().toISOString(),
  cases:cases.length,
  escalated_to_l2:escalated,
  escalation_rate:escalated/Math.max(1,cases.length),
  usage:aggregate,
  avg_input_tokens:aggregate.input_tokens/Math.max(1,cases.length),
  avg_output_tokens:aggregate.output_tokens/Math.max(1,cases.length),
  predictions
};
console.log(JSON.stringify(report,null,2));
