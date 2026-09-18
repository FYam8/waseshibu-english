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
const src=functionSource(app,'mergeImportedState');
assert.match(src,/ENGLISH_ENGINE_CORE\?\.mergeImportedLearningState/);
assert.match(src,/typeof window!=="undefined"/);
assert.match(src,/const attemptMap=new Map/,'legacy composite fallback must remain');

const calls=[];
const fixed='2026-09-18T10:20:00.000Z';
const RealDate=Date;
class FixedDate extends RealDate{
  constructor(...args){super(...(args.length?args:[fixed]))}
  static now(){return new RealDate(fixed).getTime()}
}
const current={marker:'current'},incoming={marker:'incoming'};
const ctx={
  Date:FixedDate,
  today:()=> '2026-09-18',
  ENGLISH_ENGINE_CORE:{
    mergeImportedLearningState(a,b,options){
      calls.push({a,b,options});
      return {marker:'shared-result',schemaVersion:options.schemaVersion,today:options.todayValue,stamp:options.nowIso()};
    }
  }
};
ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);
vm.runInContext(`const SCHEMA_VERSION=8;\n${src}\nglobalThis.f=mergeImportedState;`,ctx);
assert.deepEqual(plain(ctx.f(current,incoming)),{
  marker:'shared-result',schemaVersion:8,today:'2026-09-18',stamp:fixed
});
assert.equal(calls.length,1);
assert.equal(calls[0].a,current);assert.equal(calls[0].b,incoming);
assert.equal(calls[0].options.schemaVersion,8);assert.equal(calls[0].options.todayValue,'2026-09-18');
assert.equal(typeof calls[0].options.nowIso,'function');

// No browser/shared engine still executes the legacy composite path.
const fallbackCtx={Date:FixedDate,today:()=> '2026-09-18'};
fallbackCtx.globalThis=fallbackCtx;vm.createContext(fallbackCtx);
const helperNames=['mergeWeak','mergeAnswerMaps','mergeManualMaps','mergeExposure','dedupeBy','mergeDailyProgress'];
vm.runInContext(`
const SCHEMA_VERSION=8;
${helperNames.map(n=>functionSource(app,n)).join('\n')}
${src}
globalThis.f=mergeImportedState;
`,fallbackCtx);
const fallback=plain(fallbackCtx.f(
  {answers:{a:'current'},manual:{},weak:{},cause:{},exposure:{},attempts:[],history:[],drillLog:[],recoveredDrills:[],currentAttempt:null,currentDrill:null,dailyProgress:null},
  {answers:{a:'incoming',b:'b'},manual:{},weak:{},cause:{},exposure:{},attempts:[],history:[],drillLog:[],recoveredDrills:[],currentAttempt:null,currentDrill:null,dailyProgress:null}
));
assert.deepEqual(fallback.answers,{a:'current',b:'b'});
assert.equal(fallback.schemaVersion,8);assert.equal(fallback.dailyPlan,null);

console.log('Waseda composite backup/import merge runtime delegation: CLEAN');
