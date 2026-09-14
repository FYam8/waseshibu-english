#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { buildPrompt, parsePrediction } from './prompt-candidates.mjs';

const goldDir = process.argv[2] || path.dirname(new URL(import.meta.url).pathname);
const rubrics = JSON.parse(fs.readFileSync(path.join(goldDir,'rubrics.json'),'utf8'));
const shards = fs.readdirSync(goldDir).filter(n=>/^cases-.*\.json$/.test(n)).sort().map(n=>JSON.parse(fs.readFileSync(path.join(goldDir,n),'utf8')));
const cases = shards.flatMap(s=>s.cases||[]).filter(c=>c.ai_call_expected);
if (cases.length !== 50) throw new Error(`expected 50 AI cases, got ${cases.length}`);

let prompts=0;
for (const candidate of ['A','B','C']) {
  for (const mode of ['L1','L2']) {
    for (const c of cases) {
      const r=rubrics[c.question_id];
      if(!r) throw new Error(`missing rubric ${c.question_id}`);
      const p=buildPrompt(candidate,r.compact,c.answer,mode==='L2'?r.level2_context:'');
      if(!p.includes('A_JSON:')) throw new Error(`${candidate}/${mode}/${c.case_id}: missing data boundary`);
      if(!p.includes(JSON.stringify(String(c.answer)))) throw new Error(`${candidate}/${mode}/${c.case_id}: answer not JSON-serialized`);
      if(!/exactly (six|6) bare JSON integers/i.test(p) && !/exactly six unquoted integers/i.test(p)) throw new Error(`${candidate}/${mode}/${c.case_id}: weak output contract`);
      if(!p.includes('[1,1,1,1,0,0]')) throw new Error(`${candidate}/${mode}/${c.case_id}: missing output shape example`);
      prompts++;
    }
  }
}
for (const c of cases) parsePrediction(c.expected_compact);
console.log(JSON.stringify({ok:true,ai_cases:cases.length,prompts_generated:prompts,expected_labels_parsed:cases.length},null,2));
