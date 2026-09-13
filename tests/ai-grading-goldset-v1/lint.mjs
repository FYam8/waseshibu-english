#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const goldDir = process.argv[2] || path.dirname(new URL(import.meta.url).pathname);
const shardFiles = fs.readdirSync(goldDir).filter(n => /^cases-.*\.json$/.test(n)).sort();
if (!shardFiles.length) throw new Error('no case shards found');

const rubrics = JSON.parse(fs.readFileSync(path.join(goldDir, 'rubrics.json'), 'utf8'));
const schema = JSON.parse(fs.readFileSync(path.join(goldDir, 'grader-schema.json'), 'utf8'));
if (!/^1\.1\./.test(String(schema.schema_version))) throw new Error(`unexpected grader schema ${schema.schema_version}`);

const shards = shardFiles.map(name => ({name, data: JSON.parse(fs.readFileSync(path.join(goldDir, name), 'utf8'))}));
const cases = shards.flatMap(x => x.data.cases || []);
const errors = [];

function countWords(text) {
  const s = String(text ?? '').trim();
  return s ? s.split(/\s+/u).length : 0;
}
function validCompact(v) {
  return Array.isArray(v) && v.length === 6 &&
    v.slice(0,4).every(x => [0,1,2,3].includes(x)) &&
    [0,1].includes(v[4]) && [0,1,2].includes(v[5]);
}

const seen = new Set();
for (const c of cases) {
  if (!c.case_id) errors.push('case without case_id');
  else if (seen.has(c.case_id)) errors.push(`duplicate case_id ${c.case_id}`);
  else seen.add(c.case_id);

  if (!rubrics[c.question_id]) errors.push(`${c.case_id}: missing rubric ${c.question_id}`);
  if (!validCompact(c.expected_compact)) errors.push(`${c.case_id}: invalid expected_compact`);

  const actualWords = countWords(c.answer);
  if (actualWords !== Number(c.word_count)) errors.push(`${c.case_id}: word_count=${c.word_count}, actual=${actualWords}`);

  const blank = String(c.answer ?? '').trim() === '';
  if (blank && c.ai_call_expected) errors.push(`${c.case_id}: blank answer should not call AI`);
  if (!blank && !c.ai_call_expected) errors.push(`${c.case_id}: nonblank answer unexpectedly skips AI`);

  if (!['normal','risk_escalate','local_precheck'].includes(c.risk_expectation)) errors.push(`${c.case_id}: invalid risk_expectation`);
  if (blank && c.risk_expectation !== 'local_precheck') errors.push(`${c.case_id}: blank must be local_precheck`);
}

for (const {name,data} of shards) {
  const qid = data.question?.question_id;
  if (!qid) errors.push(`${name}: missing question_id`);
  if (!rubrics[qid]) errors.push(`${name}: no compact rubric for ${qid}`);
  if (!Array.isArray(data.cases) || !data.cases.length) errors.push(`${name}: no cases`);
  if (!/^1\.1\./.test(String(data.schema_version))) errors.push(`${name}: unexpected shard schema ${data.schema_version}`);
  for (const c of data.cases || []) if (c.question_id !== qid) errors.push(`${c.case_id}: question_id does not match shard ${qid}`);
}

const pilotPath=path.join(goldDir,'pilot-cases.json');
let pilotCount=0;
if(fs.existsSync(pilotPath)){
  const pilot=JSON.parse(fs.readFileSync(pilotPath,'utf8'));
  const ids=Array.isArray(pilot.case_ids)?pilot.case_ids:[];
  pilotCount=ids.length;
  if(!ids.length) errors.push('pilot-cases.json: case_ids must be non-empty');
  const dup=ids.filter((id,i,a)=>a.indexOf(id)!==i);
  if(dup.length) errors.push(`pilot-cases.json: duplicate ids ${[...new Set(dup)].join(', ')}`);
  const caseById=new Map(cases.map(c=>[c.case_id,c]));
  for(const id of ids){
    const c=caseById.get(id);
    if(!c) errors.push(`pilot-cases.json: unknown case ${id}`);
    else if(!c.ai_call_expected) errors.push(`pilot-cases.json: ${id} is not an AI-call case`);
  }
}

const byQuestion = Object.fromEntries([...new Set(cases.map(c => c.question_id))].map(q => [q, cases.filter(c => c.question_id === q).length]));
const report = {
  ok: errors.length === 0,
  schema_version: schema.schema_version,
  shards: shardFiles.length,
  total_cases: cases.length,
  cases_by_question: byQuestion,
  ai_cases: cases.filter(c => c.ai_call_expected).length,
  local_cases: cases.filter(c => !c.ai_call_expected).length,
  pilot_cases: pilotCount,
  errors
};
console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exitCode = 1;
