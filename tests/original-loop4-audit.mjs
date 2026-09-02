
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const context={window:{},console};
context.window=context;
vm.createContext(context);
for(const name of ['data.js','extra-drills.js','detail-drills-v2.js','learning-model.js','original-drills-loop3.js','original-drills-loop4.js']){
  vm.runInContext(fs.readFileSync(path.join(root,name),'utf8'),context,{filename:name});
}
const B=context.window.DRILLS;
const active=B.filter(q=>!q.retired);
const loop4=context.window.ORIGINAL_DRILLS_LOOP4_AUDIT;
assert.equal(active.length,283);
assert.equal(B.filter(q=>q.retired).length,95);
assert.equal(loop4.retired.length,39);
assert.equal(loop4.added.length,39);
for(const id of loop4.retired){
  const row=B.find(q=>q.id===id);
  assert.ok(row?.retired, `${id} not retired`);
  assert.equal(row.legacyCompletion,true, `${id} legacyCompletion`);
}
for(const id of loop4.added){
  const row=B.find(q=>q.id===id);
  assert.ok(row&&!row.retired, `${id} not active`);
  assert.ok(row.prompt.startsWith('【オリジナル類題'), `${id} prompt mark`);
  assert.ok(row.targetId&&row.focusTag&&row.familyId, `${id} metadata`);
}
const bySkill=Object.groupBy(active,q=>q.skill);
assert.equal(bySkill.content_match.length,16);
assert.equal(bySkill.insertion.length,14);
assert.equal(bySkill.reference.length,9);
assert.equal(bySkill.content_match.every(q=>q.id.startsWith('lcm')),true);
assert.equal(bySkill.insertion.every(q=>q.id.startsWith('lin')&&q.skill==='insertion'&&q.targetId==='insertion-cohesion'),true);
assert.equal(bySkill.reference.every(q=>q.id.startsWith('lrf')),true);
assert.equal(bySkill.content_match.filter(q=>q.type==='multi_choice').length,5);
assert.equal(bySkill.content_match.filter(q=>q.type==='choice').length,11);
for(const q of bySkill.content_match.filter(q=>q.type==='multi_choice')){
  assert.equal(q.answer.length,2, `${q.id} multi answer count`);
  assert.ok(q.options.length>=5, `${q.id} options`);
}
for(const q of [...bySkill.content_match,...bySkill.insertion,...bySkill.reference]){
  for(const label of ['【正解】','【設問和訳】','【根拠英文】','【根拠英文和訳】','【なぜ正解か】','【他選択肢が違う理由】','【弱点】','【戦略】']){
    assert.ok(q.explanation.includes(label), `${q.id} lacks ${label}`);
  }
}
assert.ok(new Set(bySkill.insertion.map(q=>q.answer)).size>=3, 'insertion answers not varied');
assert.ok(new Set(bySkill.reference.map(q=>q.answer)).size>=2, 'reference answers not varied');
assert.ok(bySkill.reference.every(q=>q.prompt.length>140), 'reference prompts too short');
assert.ok(bySkill.content_match.every(q=>q.prompt.length>220), 'content prompts too short');
console.log('loop4 audit ok: content_match/insertion/reference retired 39 + new 39; active 283; UI skills preserved; explanations 8 fields; formats and answer distributions checked');
