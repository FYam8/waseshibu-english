#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { buildPrompt } from './prompt-candidates.mjs';

const [goldDir, candidate='B', mode='L1'] = process.argv.slice(2);
if (!goldDir) {
  console.error('Usage: node generate-prompts.mjs <gold-dir> [A|B|C] [L1|L2]');
  process.exit(2);
}
if (!['A','B','C'].includes(candidate)) throw new Error('candidate must be A, B, or C');
if (!['L1','L2'].includes(mode)) throw new Error('mode must be L1 or L2');

const rubrics = JSON.parse(fs.readFileSync(path.join(goldDir, 'rubrics.json'), 'utf8'));
const shardFiles = fs.readdirSync(goldDir).filter(n => /^cases-.*\.json$/.test(n)).sort();
const cases = shardFiles.flatMap(name => JSON.parse(fs.readFileSync(path.join(goldDir, name), 'utf8')).cases || []);

const rows = cases.filter(c => c.ai_call_expected).map(c => {
  const r = rubrics[c.question_id];
  if (!r) throw new Error(`Missing rubric for ${c.question_id}`);
  const context = mode === 'L2' ? r.level2_context : '';
  return {
    case_id: c.case_id,
    question_id: c.question_id,
    candidate,
    mode,
    prompt: buildPrompt(candidate, r.compact, c.answer, context),
    expected_compact: c.expected_compact
  };
});

console.log(JSON.stringify({candidate, mode, count: rows.length, rows}, null, 2));
