
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const context={window:{},console};
vm.createContext(context);
for(const name of ['data.js','extra-drills.js','detail-drills-v2.js','learning-model.js']){
  vm.runInContext(fs.readFileSync(path.join(root,name),'utf8'),context,{filename:name});
}
const D=context.window.EXAM_DATA,B=context.window.DRILLS,M=context.window.ENGLISH_MODEL;
const source=Object.entries(D).flatMap(([y,rows])=>rows.filter(q=>q.skill==='detail').map(q=>[y,q]));
assert.equal(source.length,50);
const allowed=new Set(['detail-context-evidence','detail-causal-inference','detail-paraphrase-evidence','detail-insertion-cohesion']);
for(const [y,q] of source){
  assert.ok(allowed.has(q.targetId),`${y}:${q.id} target ${q.targetId}`);
  assert.ok(q.focusTag && !['explicit-evidence','inference-evidence'].includes(q.focusTag),`${y}:${q.id} focus`);
}
const retired=['dt01','dt02',...Array.from({length:8},(_,i)=>`xdt${i+1}`),'nd01','nd07','nd09'];
assert.equal(retired.every(id=>B.find(q=>q.id===id)?.retired),true);
const reused=['nd02','nd03','nd04','nd05','nd06','nd08','nd10'];
assert.equal(reused.every(id=>!B.find(q=>q.id===id)?.retired),true);
const active=B.filter(q=>q.skill==='detail'&&!q.retired);
assert.equal(active.length,20);
const groups=Object.groupBy(active,q=>q.targetId);
for(const target of allowed){
  const rows=groups[target]||[];
  assert.equal(rows.length,5,`${target} count`);
  assert.equal(new Set(rows.map(q=>q.familyId)).size,5,`${target} families`);
  assert.ok(rows.filter(q=>q.level===3).length>=2,`${target} level3`);
}
assert.equal(active.every(q=>q.prompt.startsWith('【オリジナル類題】')),true);
assert.equal(active.every(q=>q.options.length===4 && Number.isInteger(q.answer) && q.answer>=0 && q.answer<4),true);
assert.equal(active.every(q=>q.explanation.includes('【正解】')&&q.explanation.includes('【根拠')&&q.explanation.includes('【弱点】')&&q.explanation.includes('【戦略】')),true);

// Non-destructive migration: legacy facts stay unchanged; current mapping is derived separately.
const state={goal:60,currentDrill:null,weak:{'2026:7-3:test':{year:2026,id:'7-3',streak:3,confirmStreak:2,status:'mastered',targetId:'detail-evidence',reservedConfirm:['dt01','xdt1']}},history:[{kind:'drill',q:'dt01',ok:true}],attempts:[{year:2026,totalScore:70}],drillLog:[{q:'dt01',ok:true}]};
const beforeFacts=JSON.stringify({history:state.history,attempts:state.attempts,drillLog:state.drillLog,streak:state.weak['2026:7-3:test'].streak,confirmStreak:state.weak['2026:7-3:test'].confirmStreak,status:state.weak['2026:7-3:test'].status});
M.migrateState(state);
assert.equal(state.weak['2026:7-3:test'].targetId,'detail-causal-inference');
assert.equal(JSON.stringify(state.weak['2026:7-3:test'].reservedConfirm),'[]');
const afterFacts=JSON.stringify({history:state.history,attempts:state.attempts,drillLog:state.drillLog,streak:state.weak['2026:7-3:test'].streak,confirmStreak:state.weak['2026:7-3:test'].confirmStreak,status:state.weak['2026:7-3:test'].status});
assert.equal(afterFacts,beforeFacts);
console.log('detail audit ok: 50 source mappings; 7 reused + 13 new; 4 pools x 5 families; 13 legacy items retired; history/mastery facts preserved');
