#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const [goldDir, reviewPath] = process.argv.slice(2);
if (!goldDir || !reviewPath) {
  console.error('Usage: node reconcile-adjudication.mjs <gold-dir> <review.json>');
  process.exit(2);
}
const shardFiles = fs.readdirSync(goldDir).filter(n => /^cases-.*\.json$/.test(n)).sort();
const cases = shardFiles.flatMap(name => JSON.parse(fs.readFileSync(path.join(goldDir, name), 'utf8')).cases || []);
const reviewRaw = JSON.parse(fs.readFileSync(reviewPath, 'utf8'));
const rows = Array.isArray(reviewRaw) ? reviewRaw : reviewRaw.rows;
if (!Array.isArray(rows)) throw new Error('review must be array or {rows:[...]}');

const reviewById = new Map(rows.map(r => [r.case_id, r]));
const diffs = [];
const missing = [];
const invalid = [];
const valid = v => Array.isArray(v) && v.length === 6 && v.slice(0,4).every(x => [0,1,2,3].includes(x)) && [0,1].includes(v[4]) && [0,1,2].includes(v[5]);

for (const c of cases.filter(x => x.ai_call_expected)) {
  const r = reviewById.get(c.case_id);
  if (!r) { missing.push(c.case_id); continue; }
  if (!valid(r.reviewer_label)) { invalid.push(c.case_id); continue; }
  const changed = r.reviewer_label.some((v,i) => v !== c.expected_compact[i]);
  if (changed) diffs.push({case_id:c.case_id, provisional:c.expected_compact, reviewer:r.reviewer_label, note:r.reviewer_note||''});
}

const report = {
  reviewed: cases.filter(c => c.ai_call_expected).length - missing.length - invalid.length,
  total_ai_cases: cases.filter(c => c.ai_call_expected).length,
  missing,
  invalid,
  disagreements: diffs.length,
  disagreement_rate: `${((diffs.length / Math.max(1, cases.filter(c => c.ai_call_expected).length - missing.length - invalid.length))*100).toFixed(2)}%`,
  diffs
};
console.log(JSON.stringify(report, null, 2));
if (missing.length || invalid.length) process.exitCode = 1;
