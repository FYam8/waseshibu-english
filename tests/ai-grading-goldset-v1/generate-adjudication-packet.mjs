#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const goldDir = process.argv[2] || path.dirname(new URL(import.meta.url).pathname);
const shardFiles = fs.readdirSync(goldDir).filter(n => /^cases-.*\.json$/.test(n)).sort();
if (!shardFiles.length) throw new Error('no case shards found');

const shards = shardFiles.map(name => JSON.parse(fs.readFileSync(path.join(goldDir, name), 'utf8')));
const rows = [];
for (const shard of shards) {
  const q = shard.question;
  for (const c of shard.cases || []) {
    if (!c.ai_call_expected) continue;
    rows.push({
      case_id: c.case_id,
      question_id: c.question_id,
      instruction_ja: q.instruction_ja,
      opponent_text: q.opponent_text,
      semantic_targets: q.semantic_targets,
      answer: c.answer,
      reviewer_label: null,
      reviewer_note: ''
    });
  }
}

const out = {
  purpose: 'Blind adjudication packet. Do not expose expected_compact or model predictions to reviewer.',
  codebook: {
    S1_S2_R1_R2: {0:'absent',1:'supported',2:'contradicted/materially wrong',3:'unclear/mixed'},
    X: {0:'none',1:'major source distortion or material self-contradiction'},
    G: {0:'English clear enough',1:'minor errors but meaning clear',2:'materially impaired/non-English'}
  },
  rows
};
console.log(JSON.stringify(out, null, 2));
