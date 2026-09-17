import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

function read(path){return fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8')}
function plain(value){return JSON.parse(JSON.stringify(value))}

const index=read('index.html');
const scripts=[...index.matchAll(/<script\s+src="([^"]+)"/g)].map(x=>x[1]);
const preApp=scripts.slice(0,scripts.indexOf('engine/contract.js')).filter(x=>!x.startsWith('engine/')&&!x.startsWith('schools/'));
const ctx={console};ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);
for(const script of preApp){
  try{vm.runInContext(read(script),ctx,{filename:script})}catch(error){throw new Error(`migration parity setup failed in ${script}: ${error.message}`)}
}
vm.runInContext(read('engine/core.js'),ctx,{filename:'engine/core.js'});

const model=ctx.ENGLISH_MODEL,core=ctx.ENGLISH_ENGINE_CORE,D=ctx.EXAM_DATA,B=ctx.DRILLS;
assert.ok(model&&core&&D&&B,'migration parity prerequisites missing');
assert.equal(typeof core.migrateLearningState,'function','generic migration helper missing');

const active=model.activeBank();
const source=Object.entries(D).flatMap(([year,rows])=>rows.map(q=>({year:Number(year),q}))).find(({q})=>active.filter(x=>x.targetId===q.targetId).length>=3);
assert.ok(source,'could not find representative weakness target');
const targetRows=active.filter(x=>x.targetId===source.q.targetId).slice(0,4);
assert.ok(targetRows.length>=3,'representative target lacks practice rows');
const otherTarget=active.find(x=>x.targetId!==source.q.targetId)?.targetId;
assert.ok(otherTarget,'secondary target missing');
const otherRows=active.filter(x=>x.targetId===otherTarget).slice(0,3);

const fixture={
  goal:999,
  currentDrill:'legacy-invalid',
  weak:{
    main:{year:source.year,id:source.q.id,component:'main',targetId:'stale-target',focusTag:'stale-focus',examFormat:'stale-format',trap:'stale-trap',reservedConfirm:[targetRows[0].id,targetRows[0].id,'bogus',targetRows[1].id,targetRows[2].id]},
    manual:{year:source.year,id:source.q.id,component:'文法・語彙',targetId:'stale-target',reservedConfirm:[targetRows[2].id,targetRows[1].id,targetRows[0].id]},
    orphan:{year:9999,id:'missing',component:'main',targetId:otherTarget,reservedConfirm:[otherRows[0]?.id,'bogus',otherRows[1]?.id,otherRows[1]?.id,otherRows[2]?.id].filter(Boolean)}
  }
};

function resolveWeakMeta(w){
  const q=(D[w.year]||[]).find(x=>x.id===w.id),meta=q?model.actualMeta(w.year,q):null;
  if(!meta)return null;
  return {
    targetId:meta.targetId,
    focusTag:w.component&&w.component!=='main'?`manual:${q.skill}:${w.component}`:meta.focusTag,
    examFormat:meta.examFormat,
    trap:w.component&&w.component!=='main'?w.component:meta.trap
  };
}
function validDrillIdsForTarget(targetId){return B.filter(x=>!x.retired&&x.targetId===targetId).map(x=>x.id)}
const options={goalTiers:[60,70,75],defaultGoal:60,resolveWeakMeta,validDrillIdsForTarget};

const legacy=plain(fixture),shared=plain(fixture);
const legacyReturned=model.migrateState(legacy);
const sharedReturned=core.migrateLearningState(shared,options);
assert.equal(legacyReturned,legacy,'legacy migration must return the same object');
assert.equal(sharedReturned,shared,'shared migration must return the same object');
assert.deepEqual(plain(shared),plain(legacy),'generic migration result diverged from Waseda migration');

// Valid goals and object currentDrill must be preserved exactly.
const preserved={goal:'70',currentDrill:{key:'w',q:{id:'q1'}},weak:{}};
core.migrateLearningState(preserved,options);
assert.equal(preserved.goal,70);assert.deepEqual(preserved.currentDrill,{key:'w',q:{id:'q1'}});

// Generic helper must require explicit school decisions instead of embedding Waseda defaults.
assert.throws(()=>core.migrateLearningState({},{}),/goalTiers\/defaultGoal/);
assert.throws(()=>core.migrateLearningState({}, {goalTiers:[60],defaultGoal:60,resolveWeakMeta(){}}),/validDrillIdsForTarget/);
assert.throws(()=>core.migrateLearningState(null,options),/state must be an object/);

console.log('shared generic learning-state migration parity: CLEAN');
