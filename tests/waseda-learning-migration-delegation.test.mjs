import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

function read(path){return fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8')}
function plain(value){return JSON.parse(JSON.stringify(value))}

const index=read('index.html');
const scripts=[...index.matchAll(/<script\s+src="([^"]+)"/g)].map(x=>x[1]);
const corePos=scripts.indexOf('engine/core.js'),modelPos=scripts.indexOf('learning-model.js'),appPos=scripts.indexOf('app.js');
assert.ok(corePos>=0&&modelPos>=0&&appPos>=0,'core/model/app scripts missing');
assert.ok(corePos<modelPos&&modelPos<appPos,'candidate runtime must load core before learning-model before app');
assert.equal(scripts.filter(x=>x==='engine/core.js').length,1,'engine/core.js must load exactly once');
assert.match(read('learning-model.js'),/ENGLISH_ENGINE_CORE\?\.migrateLearningState/,'learning-model migration wrapper is not delegated');

function buildContext({withCore}){
  const ctx={console};ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);
  let calls=0;
  for(const script of scripts.slice(0,modelPos+1)){
    if(script.startsWith('schools/'))continue;
    if(script.startsWith('engine/')&&script!=='engine/core.js')continue;
    if(script==='engine/core.js'){
      if(!withCore)continue;
      vm.runInContext(read(script),ctx,{filename:script});
      const original=ctx.ENGLISH_ENGINE_CORE;
      ctx.ENGLISH_ENGINE_CORE={...original,migrateLearningState(...args){calls++;return original.migrateLearningState(...args)}};
      continue;
    }
    vm.runInContext(read(script),ctx,{filename:script});
  }
  return {ctx,getCalls:()=>calls};
}

const shared=buildContext({withCore:true}),fallback=buildContext({withCore:false});
for(const {ctx} of [shared,fallback]){
  assert.ok(ctx.ENGLISH_MODEL,'ENGLISH_MODEL missing');
  assert.equal(typeof ctx.ENGLISH_MODEL.migrateState,'function');
}

const D=shared.ctx.EXAM_DATA,B=shared.ctx.DRILLS;
const examRows=Object.entries(D).flatMap(([year,rows])=>rows.map(q=>({year:Number(year),q})));
const source=examRows.find(({q})=>B.filter(x=>!x.retired&&x.targetId===q.targetId).length>=3);
assert.ok(source,'representative migration target missing');
const rows=B.filter(x=>!x.retired&&x.targetId===source.q.targetId).slice(0,3);
const fixture={goal:999,currentDrill:'legacy-invalid',weak:{w:{year:source.year,id:source.q.id,component:'main',targetId:'stale',reservedConfirm:[rows[0].id,rows[0].id,'bogus',rows[1].id,rows[2].id]}}};

const sharedState=plain(fixture),fallbackState=plain(fixture);
const sharedReturned=shared.ctx.ENGLISH_MODEL.migrateState(sharedState);
const fallbackReturned=fallback.ctx.ENGLISH_MODEL.migrateState(fallbackState);
assert.equal(sharedReturned,sharedState,'delegated migration must return same object');
assert.equal(fallbackReturned,fallbackState,'fallback migration must return same object');
assert.equal(shared.getCalls(),1,'shared migrateLearningState must be called exactly once');
assert.deepEqual(plain(sharedState),plain(fallbackState),'delegated migration diverged from legacy Waseda fallback');
assert.equal(sharedState.goal,60);
assert.equal(sharedState.currentDrill,null);
assert.deepEqual(plain(sharedState.weak.w.reservedConfirm),[rows[0].id,rows[1].id]);

console.log('Waseda learning-state migration delegation: CLEAN');
