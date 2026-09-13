#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const goldDir = process.argv[2] || path.dirname(new URL(import.meta.url).pathname);
const shards = fs.readdirSync(goldDir).filter(n=>/^cases-.*\.json$/.test(n)).sort().map(n=>JSON.parse(fs.readFileSync(path.join(goldDir,n),'utf8')));
const cases = shards.flatMap(s=>s.cases||[]).filter(c=>c.ai_call_expected);
const tmp = fs.mkdtempSync(path.join(os.tmpdir(),'ai-grade-compare-'));

function writeReport(candidate,totalTokens,mutate=null){
  const predictions=cases.map(c=>({case_id:c.case_id,prediction:[...c.expected_compact]}));
  if(mutate) mutate(predictions);
  const report={provider:'smoke',model:'@cf/openai/gpt-oss-20b',candidate,cases:cases.length,escalated_to_l2:0,escalation_rate:0,usage:{input_tokens:totalTokens-100,output_tokens:100,total_tokens:totalTokens},predictions};
  const p=path.join(tmp,`eval-${candidate}.json`);fs.writeFileSync(p,JSON.stringify(report));return p;
}
const a=writeReport('A',10000);
const b=writeReport('B',9000);
const c=writeReport('C',8000);
const compare=path.join(goldDir,'compare-evals.mjs');
let run=spawnSync(process.execPath,[compare,goldDir,a,b,c],{encoding:'utf8'});
if(run.status!==0) throw new Error(`perfect comparator smoke failed: ${run.stderr}\n${run.stdout}`);
let result=JSON.parse(run.stdout);
if(result.development_leader!=='C') throw new Error(`expected C as lowest-token equal-accuracy leader, got ${result.development_leader}`);

const bad=writeReport('C',7000,preds=>{const x=preds.find(p=>p.prediction[4]===1);if(x)x.prediction[4]=0;});
run=spawnSync(process.execPath,[compare,goldDir,a,b,bad],{encoding:'utf8'});
if(run.status!==0) throw new Error(`disqualification comparator smoke failed: ${run.stderr}\n${run.stdout}`);
result=JSON.parse(run.stdout);
if(result.development_leader==='C') throw new Error('candidate C with major contradiction miss must not lead even if cheapest');

console.log('AI grading comparator smoke: CLEAN');
