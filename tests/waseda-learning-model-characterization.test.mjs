import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

function read(path){return fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8')}
function hash(rows){return crypto.createHash('sha256').update(rows.join('\n')).digest('hex')}
function plain(value){return JSON.parse(JSON.stringify(value))}

const index=read('index.html');
const scripts=[...index.matchAll(/<script\s+src="([^"]+)"/g)].map(x=>x[1]);
const preApp=scripts.slice(0,scripts.indexOf('app.js')).filter(x=>!x.startsWith('engine/')&&!x.startsWith('schools/'));
const ctx={console};ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);
for(const script of preApp){
  try{vm.runInContext(read(script),ctx,{filename:script})}catch(error){throw new Error(`learning-model characterization failed in ${script}: ${error.message}`)}
}
const model=ctx.ENGLISH_MODEL;
assert.ok(model,'ENGLISH_MODEL missing');
assert.equal(typeof model.actualMeta,'function');
assert.equal(typeof model.migrateState,'function');
assert.equal(typeof model.activeBank,'function');

const examRows=Object.entries(ctx.EXAM_DATA||{}).flatMap(([year,rows])=>rows.map(q=>({year:Number(year),q})));
assert.ok(examRows.length>0,'exam data missing');
for(const {year,q} of examRows){
  assert.ok(q.targetId,`${year}:${q.id}: targetId missing after learning model`);
  assert.ok(q.focusTag,`${year}:${q.id}: focusTag missing after learning model`);
  assert.ok(q.examFormat,`${year}:${q.id}: examFormat missing after learning model`);
  assert.ok(q.trap,`${year}:${q.id}: trap missing after learning model`);
}

const reorder2024=examRows.find(x=>x.year===2024&&x.q.id==='3-3-1')?.q;
assert.ok(reorder2024,'2024:3-3-1 missing');
assert.equal(reorder2024.targetId,'reorder-effort-into-ing');
assert.equal(reorder2024.focusTag,'effort-into-ing');
const detail2024=examRows.find(x=>x.year===2024&&x.q.id==='6-3')?.q;
assert.ok(detail2024,'2024:6-3 missing');
assert.equal(detail2024.targetId,'detail-paraphrase-evidence');
assert.equal(detail2024.focusTag,'paraphrase-scope');

const active=model.activeBank();
assert.equal(active.length,283,'active practice bank count changed');
for(const q of active){
  assert.ok(q.targetId,`${q.id}: active drill targetId missing`);
  assert.ok(q.focusTag,`${q.id}: active drill focusTag missing`);
  assert.ok(q.examFormat,`${q.id}: active drill examFormat missing`);
  assert.ok(q.familyId,`${q.id}: active drill familyId missing`);
  assert.ok(Number.isFinite(Number(q.level)),`${q.id}: active drill level missing`);
}

// Freeze representative migration behavior without changing any production state.
const source=examRows.find(({q})=>active.filter(x=>x.targetId===q.targetId).length>=3);
assert.ok(source,'no exam weakness with at least three active matching drills');
const matching=active.filter(x=>x.targetId===source.q.targetId).slice(0,3);
const state={goal:999,currentDrill:'legacy-invalid',weak:{w:{year:source.year,id:source.q.id,component:'main',reservedConfirm:[matching[0].id,matching[0].id,'bogus',matching[1].id,matching[2].id]}}};
const migrated=model.migrateState(state);
assert.equal(migrated,state,'migrateState must mutate and return the same state object');
assert.equal(state.goal,60,'invalid Waseda goal must migrate to 60');
assert.equal(state.currentDrill,null,'invalid currentDrill must migrate to null');
assert.equal(state.weak.w.targetId,source.q.targetId);
assert.equal(state.weak.w.focusTag,source.q.focusTag);
assert.equal(state.weak.w.examFormat,source.q.examFormat);
assert.equal(state.weak.w.trap,source.q.trap);
assert.deepEqual(plain(state.weak.w.reservedConfirm),[matching[0].id,matching[1].id],'reserved confirmations must be unique, valid and capped at two');

const manualState={goal:60,currentDrill:null,weak:{w:{year:source.year,id:source.q.id,component:'文法・語彙',reservedConfirm:[]}}};
model.migrateState(manualState);
assert.equal(manualState.weak.w.focusTag,`manual:${source.q.skill}:文法・語彙`);
assert.equal(manualState.weak.w.trap,'文法・語彙');

const examFingerprint=examRows.map(({year,q})=>[year,q.id,q.skill,q.targetId,q.focusTag,q.examFormat,q.trap].join('|')).sort();
const bankFingerprint=active.map(q=>[q.id,q.skill,q.targetId,q.focusTag,q.examFormat,q.familyId,q.level,q.type].join('|')).sort();
console.log(JSON.stringify({
  ok:true,
  examMappingCount:examFingerprint.length,
  examMappingSha256:hash(examFingerprint),
  activeBankCount:bankFingerprint.length,
  activeBankMappingSha256:hash(bankFingerprint)
},null,2));
