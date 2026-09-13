#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const goldDir = process.argv[2] || path.dirname(new URL(import.meta.url).pathname);
const shards = fs.readdirSync(goldDir).filter(n=>/^cases-.*\.json$/.test(n)).sort().map(n=>JSON.parse(fs.readFileSync(path.join(goldDir,n),'utf8')));
const allCases = shards.flatMap(s=>s.cases||[]).filter(c=>c.ai_call_expected);
const pilot = JSON.parse(fs.readFileSync(path.join(goldDir,'pilot-cases.json'),'utf8'));
const pilotIds = new Set(pilot.case_ids||[]);
const pilotCases = allCases.filter(c=>pilotIds.has(c.case_id));
const tmp = fs.mkdtempSync(path.join(os.tmpdir(),'ai-grade-compare-'));

function writeReport(candidate,totalTokens,{scope='full',cases=allCases,mutate=null}={}){
  const predictions=cases.map(c=>({case_id:c.case_id,prediction:[...c.expected_compact]}));
  if(mutate) mutate(predictions);
  const report={
    provider:'smoke',
    model:'@cf/openai/gpt-oss-20b',
    candidate,
    scope,
    evaluated_case_ids:cases.map(c=>c.case_id),
    cases:cases.length,
    escalated_to_l2:0,
    escalation_rate:0,
    malformed_after_l2:0,
    usage:{input_tokens:totalTokens-100,output_tokens:100,total_tokens:totalTokens},
    predictions
  };
  const p=path.join(tmp,`eval-${scope}-${candidate}-${Math.random().toString(36).slice(2)}.json`);
  fs.writeFileSync(p,JSON.stringify(report));
  return p;
}
const compare=path.join(goldDir,'compare-evals.mjs');

// Pilot is technical-only: it must never select a development leader.
const pa=writeReport('A',3000,{scope:'pilot',cases:pilotCases});
const pb=writeReport('B',2800,{scope:'pilot',cases:pilotCases});
const pc=writeReport('C',2500,{scope:'pilot',cases:pilotCases});
let run=spawnSync(process.execPath,[compare,goldDir,pa,pb,pc],{encoding:'utf8'});
if(run.status!==0) throw new Error(`pilot comparator smoke failed: ${run.stderr}\n${run.stdout}`);
let result=JSON.parse(run.stdout);
if(result.status!=='technical-pilot'||result.pilot_technical_pass!==true) throw new Error('pilot should pass technical gate');
if(result.development_leader!==null) throw new Error('pilot must not select a development leader');

// A malformed/invalid pilot candidate must fail the technical gate.
const badPilot=writeReport('C',2400,{scope:'pilot',cases:pilotCases,mutate:preds=>{preds[0].prediction=null;}});
run=spawnSync(process.execPath,[compare,goldDir,pa,pb,badPilot],{encoding:'utf8'});
if(run.status===0) throw new Error('pilot with invalid prediction must fail technical gate');
result=JSON.parse(run.stdout);
if(result.pilot_technical_pass!==false) throw new Error('bad pilot must report pilot_technical_pass=false');

// Full development comparison may rank equal-accuracy candidates by token use.
const a=writeReport('A',10000,{scope:'full'});
const b=writeReport('B',9000,{scope:'full'});
const c=writeReport('C',8000,{scope:'full'});
run=spawnSync(process.execPath,[compare,goldDir,a,b,c],{encoding:'utf8'});
if(run.status!==0) throw new Error(`perfect full comparator smoke failed: ${run.stderr}\n${run.stdout}`);
result=JSON.parse(run.stdout);
if(result.status!=='development-full') throw new Error(`expected development-full, got ${result.status}`);
if(result.development_leader!=='C') throw new Error(`expected C as lowest-token equal-accuracy leader, got ${result.development_leader}`);

// A full candidate that misses a major contradiction cannot lead even if cheapest.
const bad=writeReport('C',7000,{scope:'full',mutate:preds=>{const x=preds.find(p=>p.prediction[4]===1);if(x)x.prediction[4]=0;}});
run=spawnSync(process.execPath,[compare,goldDir,a,b,bad],{encoding:'utf8'});
if(run.status!==0) throw new Error(`full disqualification comparator smoke failed: ${run.stderr}\n${run.stdout}`);
result=JSON.parse(run.stdout);
if(result.development_leader==='C') throw new Error('candidate C with major contradiction miss must not lead even if cheapest');

console.log('AI grading comparator smoke: CLEAN');
