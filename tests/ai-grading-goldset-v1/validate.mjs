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

const shards = shardFiles.map(name => JSON.parse(fs.readFileSync(path.join(goldDir, name), 'utf8')));
const cases = shards.flatMap(shard => Array.isArray(shard.cases) ? shard.cases : []);
const questionById = new Map(shards.map(shard => [shard.question?.question_id, shard.question]).filter(([id]) => id));
const predictionsRaw = JSON.parse(fs.readFileSync(predPath, 'utf8'));
const predictions = Array.isArray(predictionsRaw) ? predictionsRaw : predictionsRaw.predictions;
if (!Array.isArray(predictions)) throw new Error('predictions must be an array or {predictions:[...]}');

const duplicateCaseIds = cases.map(c => c.case_id).filter((id,i,a) => a.indexOf(id) !== i);
if (duplicateCaseIds.length) throw new Error(`duplicate case ids: ${[...new Set(duplicateCaseIds)].join(', ')}`);
const duplicatePredictionIds = predictions.map(x => x?.case_id).filter((id,i,a) => id && a.indexOf(id) !== i);
if (duplicatePredictionIds.length) throw new Error(`duplicate prediction ids: ${[...new Set(duplicatePredictionIds)].join(', ')}`);

const allCaseIds = new Set(cases.map(c => c.case_id));
const extraPredictionIds = predictions.map(x => x?.case_id).filter(id => id && !allCaseIds.has(id));
const predById = new Map(predictions.map(x => [x.case_id, x.prediction]));
const aiCases = cases.filter(c => c.ai_call_expected);
const missing = aiCases.filter(c => !predById.has(c.case_id)).map(c => c.case_id);

function validPrediction(p) {
  return Array.isArray(p) && p.length === 6 &&
    p.slice(0, 4).every(v => [0,1,2,3].includes(v)) &&
    [0,1].includes(p[4]) && [0,1,2].includes(p[5]);
}
function semanticComplete(p) {
  return p.slice(0,4).every(v => v === 1) && p[4] === 0 && p[5] <= 1;
}
function escalationNeeded(p) {
  return p.slice(0,4).some(v => v === 3) || p[4] === 1 || p[5] === 2;
}
function countWords(text) {
  const s = String(text ?? '').trim();
  return s ? s.split(/\s+/u).length : 0;
}
const denom = n => n || 1;
const pct = x => `${(x * 100).toFixed(2)}%`;

let exact = 0;
let validCount = 0;
let componentOKValid = 0;
let semanticOKValid = 0;
let componentOKAll = 0;
let semanticOKAll = 0;
let expectedX = 0;
let missedOrUnresolvedX = 0;
let expectedNonComplete = 0;
let falseSemanticComplete = 0;
let expectedEscalate = 0;
let missedOrUnresolvedEscalation = 0;
let malformed = 0;
let declaredWordCountMismatch = 0;
let hardWordLimitViolations = 0;

for (const c of cases) {
  if (countWords(c.answer) !== Number(c.word_count)) declaredWordCountMismatch++;
  const q = questionById.get(c.question_id);
  if (q?.word_rule?.type === 'max_words' && Number(c.word_count) > Number(q.word_rule.max)) hardWordLimitViolations++;
}

for (const c of aiCases) {
  const e = c.expected_compact;
  if (!validPrediction(e)) throw new Error(`invalid expected_compact for ${c.case_id}`);

  const expectedIsComplete = semanticComplete(e);
  if (!expectedIsComplete) expectedNonComplete++;
  if (e[4] === 1) expectedX++;
  if (escalationNeeded(e)) expectedEscalate++;

  if (!predById.has(c.case_id)) {
    if (e[4] === 1) missedOrUnresolvedX++;
    if (escalationNeeded(e)) missedOrUnresolvedEscalation++;
    continue;
  }

  const p = predById.get(c.case_id);
  if (!validPrediction(p)) {
    malformed++;
    if (e[4] === 1) missedOrUnresolvedX++;
    if (escalationNeeded(e)) missedOrUnresolvedEscalation++;
    continue;
  }

  validCount++;
  if (p.every((v,i) => v === e[i])) exact++;

  for (let i=0; i<6; i++) {
    if (p[i] === e[i]) {
      componentOKValid++;
      componentOKAll++;
    }
  }
  for (let i=0; i<4; i++) {
    if (p[i] === e[i]) {
      semanticOKValid++;
      semanticOKAll++;
    }
  }

  if (e[4] === 1 && p[4] === 0) missedOrUnresolvedX++;
  if (!expectedIsComplete && semanticComplete(p)) falseSemanticComplete++;
  if (escalationNeeded(e) && !escalationNeeded(p)) missedOrUnresolvedEscalation++;
}

const report = {
  total_cases: cases.length,
  local_precheck_cases: cases.filter(c => !c.ai_call_expected).length,
  ai_cases: aiCases.length,
  predictions_received: aiCases.length - missing.length,
  valid_predictions: validCount,
  prediction_coverage: pct(validCount / denom(aiCases.length)),
  missing_case_ids: missing,
  malformed_predictions: malformed,
  extra_prediction_ids: extraPredictionIds,
  exact_case_match_all_ai_cases: pct(exact / denom(aiCases.length)),
  component_accuracy_all_6_valid_predictions: pct(componentOKValid / denom(validCount * 6)),
  component_accuracy_all_6_all_ai_cases: pct(componentOKAll / denom(aiCases.length * 6)),
  semantic_accuracy_S1_to_R2_valid_predictions: pct(semanticOKValid / denom(validCount * 4)),
  semantic_accuracy_S1_to_R2_all_ai_cases: pct(semanticOKAll / denom(aiCases.length * 4)),
  expected_major_contradiction_cases: expectedX,
  major_contradiction_miss_or_unresolved_rate: pct(missedOrUnresolvedX / denom(expectedX)),
  false_semantic_complete_rate_on_expected_noncomplete: pct(falseSemanticComplete / denom(expectedNonComplete)),
  expected_level2_escalation_cases: expectedEscalate,
  missed_or_unresolved_escalation_rate: pct(missedOrUnresolvedEscalation / denom(expectedEscalate)),
  declared_word_count_mismatches: declaredWordCountMismatch,
  deterministic_hard_word_limit_violations: hardWordLimitViolations
};

console.log(JSON.stringify(report, null, 2));
if (missing.length || malformed || extraPredictionIds.length || declaredWordCountMismatch) process.exitCode = 1;
