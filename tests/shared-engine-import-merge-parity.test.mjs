import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

function read(path){return fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8')}
function functionSource(source,name){
  let start=source.indexOf(`async function ${name}(`);
  if(start<0)start=source.indexOf(`function ${name}(`);
  assert.ok(start>=0,`missing function ${name}`);
  const candidates=[];
  for(const marker of ['\nfunction ','\nasync function ']){
    const p=source.indexOf(marker,start+10);
    if(p>start)candidates.push(p);
  }
  return source.slice(start,candidates.length?Math.min(...candidates):source.length).trim();
}
function plain(v){return JSON.parse(JSON.stringify(v))}

const app=read('app.js');
const legacyCtx={today:()=> '2026-09-18'};legacyCtx.globalThis=legacyCtx;vm.createContext(legacyCtx);
const legacyNames=['mergeWeak','mergeAnswerMaps','mergeManualMaps','mergeExposure','dedupeBy','mergeDailyProgress'];
vm.runInContext(`${legacyNames.map(n=>functionSource(app,n)).join('\n')}\nglobalThis.api={${legacyNames.join(',')}};`,legacyCtx);

const sharedCtx={};sharedCtx.window=sharedCtx;sharedCtx.globalThis=sharedCtx;vm.createContext(sharedCtx);
vm.runInContext(read('engine/core.js'),sharedCtx,{filename:'engine/core.js'});
const shared=sharedCtx.ENGLISH_ENGINE_CORE;
for(const name of ['mergeImportedWeakState','mergeImportedAnswerMaps','mergeImportedManualMaps','mergeImportedExposure','dedupeImportedRows','mergeImportedDailyProgress']){
  assert.equal(typeof shared?.[name],'function',`missing shared import helper ${name}`);
}

const weakFixtures=[
  [{status:'mastered',streak:0,tag:'a'},{status:'active',streak:9,confirmStreak:9,tag:'b'}],
  [{status:'active',streak:9,confirmStreak:9,tag:'a'},{status:'mastered',streak:0,tag:'b'}],
  [{status:'active',streak:2,confirmStreak:0,tag:'a',keep:'a'},{status:'pending',streak:0,confirmStreak:1,tag:'b',extra:'b'}],
  [{status:'active',streak:2,confirmStreak:0,tag:'a'},{status:'active',streak:2,confirmStreak:0,tag:'b'}],
  [{},{}]
];
for(const [a,b] of weakFixtures){
  const oldA=plain(a),oldB=plain(b),newA=plain(a),newB=plain(b);
  const expected=plain(legacyCtx.api.mergeWeak(oldA,oldB));
  const actual=plain(shared.mergeImportedWeakState(newA,newB));
  assert.deepEqual(actual,expected);
}

const answerFixtures=[
  [{a:'current',b:'',c:'  x  '},{a:'incoming',b:'incoming-b',c:'incoming-c',d:'incoming-d'}],
  [{a:null,b:undefined},{a:'A',b:'B'}],
  [{},{}]
];
for(const [current,incoming] of answerFixtures){
  assert.deepEqual(
    plain(shared.mergeImportedAnswerMaps(plain(current),plain(incoming))),
    plain(legacyCtx.api.mergeAnswerMaps(plain(current),plain(incoming)))
  );
}

const manualFixtures=[
  [
    {a:{score:5,components:['ca'],note:'current'},b:{score:'',components:['cb']}},
    {a:{score:3,components:['ia'],note:'incoming'},b:{score:4,components:['ib']},c:{score:2,components:['ic']}}
  ],
  [{a:{score:0,components:['x']}},{a:{score:'',components:['x','y']}}],
  [{},{}]
];
for(const [current,incoming] of manualFixtures){
  assert.deepEqual(
    plain(shared.mergeImportedManualMaps(plain(current),plain(incoming))),
    plain(legacyCtx.api.mergeManualMaps(plain(current),plain(incoming)))
  );
}

const exposureFixtures=[
  [{2024:'first',2025:'done'},{2024:'partial',2025:'unknown',2026:'done'}],
  [{2024:'unknown'},{2024:'first'}],
  [{},{}]
];
for(const [a,b] of exposureFixtures){
  assert.deepEqual(
    plain(shared.mergeImportedExposure(plain(a),plain(b))),
    plain(legacyCtx.api.mergeExposure(plain(a),plain(b)))
  );
}

const rows=[{id:'a',v:1},{id:'b',v:2},{id:'a',v:3},{id:'c',v:4},{id:'b',v:5}];
assert.deepEqual(
  plain(shared.dedupeImportedRows(plain(rows),x=>x.id)),
  plain(legacyCtx.api.dedupeBy(plain(rows),x=>x.id))
);
assert.throws(()=>shared.dedupeImportedRows(null,x=>x),/rows must be an array/);
assert.throws(()=>shared.dedupeImportedRows([],null),/keyFn must be a function/);

const progressFixtures=[
  [{date:'2026-09-18',answeredCount:4},{date:'2026-09-18',answeredCount:7}],
  [{date:'2026-09-18',answeredCount:'9'},{date:'2026-09-17',answeredCount:100}],
  [{date:'2026-09-17',answeredCount:9},{date:'2026-09-16',answeredCount:8}],
  [null,{date:'2026-09-18',answeredCount:3}],
  [null,null]
];
for(const [a,b] of progressFixtures){
  assert.deepEqual(
    plain(shared.mergeImportedDailyProgress(plain(a),plain(b),'2026-09-18')),
    plain(legacyCtx.api.mergeDailyProgress(plain(a),plain(b)))
  );
}

console.log('shared backup/import merge primitives parity: CLEAN');
