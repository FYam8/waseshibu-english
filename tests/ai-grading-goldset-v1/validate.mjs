#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const [goldDir, predPath] = process.argv.slice(2);
if (!goldDir || !predPath) {
  console.error('Usage: node tests/ai-grading-goldset-v1/validate.mjs <gold-dir> <predictions.json>');
  process.exit(2);
}

const shardFiles = fs.readdirSync(goldDir)
  .filter(name => /^cases-.*\.json$/.test(name))
  .sort();
if (!shardFiles.length) throw new Error(`No cases-*.json files found in ${goldDir}`);

const cases = shardFiles.flatMap(name => {
  const shard = JSON.parse(fs.readFileSync(path.join(goldDir, name), 'utf8'));
  return Array.isArray(shard.cases) ? shard.cases : [];
});
const predictionsRaw = JSON.parse(fs.readFileSync(predPath, 'utf8'));
const predictions = Array.isArray(predictionsRaw) ? predictionsRaw : predictionsRaw.predictions;
if (!Array.isArray(predictions)) throw new Error('predictions must be an array or {predictions:[...]}');

const predById = new Map(predictions.map(x => [x.case_id, x.prediction]));
const aiCases = cases.filter(c => c.ai_call_expected);
const missing = aiCases.filter(c => !predById.has(c.case_id)).map(c => c.case_id);

let exact = 0;
let componentOK = 0;
let componentTotal = 0;
let semanticOK = 0;
let semanticTotal = 0;
let expectedX = 0;
let missedX = 0;
let falseComplete = 0;
let nonComplete = 0;
let malformed = 0;

function validPrediction(p) {
  return Array.isArray(p) && p.length === 6 &&
    p.slice(0, 4).every(v => [0,1,2,3].includes(v)) &&
    [0,1].includes(p[4]) && [0,1,2].includes(p[5]);
}
function predictedComplete(p) {
  return p.slice(0,4).every(v => v === 1) && p[4] === 0 && p[5] <= 1;
}
const denom = n => n || 1;
const pct = x => `${(x * 100).toFixed(2)}%`;

for (const c of aiCases) {
  const p = predById.get(c.case_id);
  if (!validPrediction(p)) {
    malformed++;
    continue;
  }
  const e = c.expected_compact;
  if (p.every((v,i) => v === e[i])) exact++;
  for (let i=0; i<6; i++) {
    componentTotal++;
    if (p[i] === e[i]) componentOK++;
  }
  for (let i=0; i<4; i++) {
    semanticTotal++;
    if (p[i] === e[i]) semanticOK++;
  }
  if (e[4] === 1) {
    expectedX++;
    if (p[4] === 0) missedX++;
  }
  if (c.semantic_class !== 'complete') {
    nonComplete++;
    if (predictedComplete(p)) falseComplete++;
  }
}

const report = {
  total_cases: cases.length,
  local_precheck_cases: cases.filter(c => !c.ai_call_expected).length,
  ai_cases: aiCases.length,
  predictions_received: aiCases.length - missing.length,
  missing_case_ids: missing,
  malformed_predictions: malformed,
  exact_case_match: pct(exact / denom(aiCases.length)),
  component_accuracy_all_6: pct(componentOK / denom(componentTotal)),
  semantic_component_accuracy_S1_to_R2: pct(semanticOK / denom(semanticTotal)),
  major_contradiction_miss_rate: pct(missedX / denom(expectedX)),
  false_complete_rate_on_noncomplete_cases: pct(falseComplete / denom(nonComplete))
};

console.log(JSON.stringify(report, null, 2));
if (missing.length || malformed) process.exitCode = 1;
