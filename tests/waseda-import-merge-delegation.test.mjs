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
    const p=source.indexOf(marker,start+10);if(p>start)candidates.push(p);
  }
  return source.slice(start,candidates.length?Math.min(...candidates):source.length).trim();
}
function plain(v){return JSON.parse(JSON.stringify(v))}

const app=read('app.js');
const names=['mergeWeak','mergeAnswerMaps','mergeManualMaps','mergeExposure','dedupeBy','mergeDailyProgress'];
const src=Object.fromEntries(names.map(n=>[n,functionSource(app,n)]));
for(const [name,helper] of [
  ['mergeWeak','mergeImportedWeakState'],
  ['mergeAnswerMaps','mergeImportedAnswerMaps'],
  ['mergeManualMaps','mergeImportedManualMaps'],
  ['mergeExposure','mergeImportedExposure'],
  ['dedupeBy','dedupeImportedRows'],
  ['mergeDailyProgress','mergeImportedDailyProgress']
]){
  assert.match(src[name],new RegExp(`ENGLISH_ENGINE_CORE\\?\\.${helper}`),`${name} must delegate to ${helper}`);
  assert.match(src[name],/typeof window!=="undefined"/,`${name} must preserve non-browser fallback`);
}

const calls=[];
const ctx={
  today:()=> '2026-09-18',
  ENGLISH_ENGINE_CORE:{
    mergeImportedWeakState(a,b){calls.push(['weak',a,b]);return {kind:'weak-shared'}},
    mergeImportedAnswerMaps(a,b){calls.push(['answers',a,b]);return {kind:'answers-shared'}},
    mergeImportedManualMaps(a,b){calls.push(['manual',a,b]);return {kind:'manual-shared'}},
    mergeImportedExposure(a,b){calls.push(['exposure',a,b]);return {kind:'exposure-shared'}},
    dedupeImportedRows(rows,keyFn){calls.push(['dedupe',rows,keyFn]);return [{kind:'dedupe-shared'}]},
    mergeImportedDailyProgress(a,b,today){calls.push(['daily',a,b,today]);return {kind:'daily-shared'}}
  }
};
ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);
vm.runInContext(`${names.map(n=>src[n]).join('\n')}\nglobalThis.api={${names.join(',')}};`,ctx);

const a={a:1},b={b:2};
assert.deepEqual(plain(ctx.api.mergeWeak(a,b)),{kind:'weak-shared'});
assert.deepEqual(plain(ctx.api.mergeAnswerMaps(a,b)),{kind:'answers-shared'});
assert.deepEqual(plain(ctx.api.mergeManualMaps(a,b)),{kind:'manual-shared'});
assert.deepEqual(plain(ctx.api.mergeExposure(a,b)),{kind:'exposure-shared'});
const keyFn=x=>x.id;
assert.deepEqual(plain(ctx.api.dedupeBy([{id:'x'}],keyFn)),[{kind:'dedupe-shared'}]);
assert.deepEqual(plain(ctx.api.mergeDailyProgress(a,b)),{kind:'daily-shared'});

assert.equal(calls.length,6);
assert.equal(calls[0][1],a);assert.equal(calls[0][2],b);
assert.equal(calls[4][2],keyFn);
assert.equal(calls[5][3],'2026-09-18');

// Without the browser/shared engine, exact legacy fallback behavior remains executable.
const fallbackCtx={today:()=> '2026-09-18'};fallbackCtx.globalThis=fallbackCtx;vm.createContext(fallbackCtx);
vm.runInContext(`${names.map(n=>src[n]).join('\n')}\nglobalThis.api={${names.join(',')}};`,fallbackCtx);
assert.equal(fallbackCtx.api.mergeWeak({status:'active',streak:1,tag:'a'},{status:'active',streak:2,tag:'b'}).tag,'b');
assert.deepEqual(plain(fallbackCtx.api.mergeAnswerMaps({a:'current'},{a:'incoming',b:'b'})),{a:'current',b:'b'});
assert.deepEqual(plain(fallbackCtx.api.mergeDailyProgress({date:'2026-09-18',answeredCount:2},{date:'2026-09-18',answeredCount:5})),{date:'2026-09-18',answeredCount:5});

console.log('Waseda backup/import merge primitive runtime delegation: CLEAN');
