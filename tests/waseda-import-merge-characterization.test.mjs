import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

function read(path){return fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8')}
function functionSource(source,name){
  let start=source.indexOf(`async function ${name}(`);
  if(start<0)start=source.indexOf(`function ${name}(`);
  assert.ok(start>=0,`missing function ${name}`);
  const brace=source.indexOf('{',start);assert.ok(brace>=0);
  let depth=0,inSingle=false,inDouble=false,inTemplate=false,escaped=false;
  for(let i=brace;i<source.length;i++){
    const ch=source[i];
    if(escaped){escaped=false;continue}
    if(ch==='\\'){escaped=true;continue}
    if(!inDouble&&!inTemplate&&ch==="'"){inSingle=!inSingle;continue}
    if(!inSingle&&!inTemplate&&ch==='"'){inDouble=!inDouble;continue}
    if(!inSingle&&!inDouble&&ch==='`'){inTemplate=!inTemplate;continue}
    if(inSingle||inDouble||inTemplate)continue;
    if(ch==='{')depth++;
    else if(ch==='}'&&--depth===0)return source.slice(start,i+1);
  }
  throw new Error(`unterminated function ${name}`);
}
function plain(v){return JSON.parse(JSON.stringify(v))}

const app=read('app.js');
const names=['mergeWeak','mergeAnswerMaps','mergeManualMaps','mergeExposure','dedupeBy','mergeDailyProgress','mergeImportedState'];
const src=Object.fromEntries(names.map(n=>[n,functionSource(app,n)]));

const RealDate=Date,fixed='2026-09-18T10:00:00.000Z';
class FixedDate extends RealDate{
  constructor(...args){super(...(args.length?args:[fixed]))}
  static now(){return new RealDate(fixed).getTime()}
}
const ctx={Date:FixedDate,today:()=> '2026-09-18'};
ctx.globalThis=ctx;vm.createContext(ctx);
vm.runInContext(`
const SCHEMA_VERSION=8;
${names.map(n=>src[n]).join('\n')}
globalThis.api={${names.join(',')}};
`,ctx);
const api=ctx.api;

// Weak-state merge: mastered always wins; otherwise larger confirmation/streak progress wins; incoming wins ties.
{
  const mastered={status:'mastered',streak:0,tag:'current-mastered'};
  const active={status:'active',streak:99,confirmStreak:9,tag:'incoming-active'};
  assert.equal(api.mergeWeak(mastered,active),mastered);
  assert.equal(api.mergeWeak(active,mastered),mastered);

  const current={status:'active',streak:2,confirmStreak:0,tag:'current',keep:'c'};
  const incoming={status:'active',streak:0,confirmStreak:1,tag:'incoming',extra:'i'};
  assert.deepEqual(plain(api.mergeWeak(current,incoming)),{status:'active',streak:0,confirmStreak:1,tag:'incoming',keep:'c',extra:'i'});

  const tieCurrent={status:'active',streak:2,confirmStreak:0,tag:'current'};
  const tieIncoming={status:'active',streak:2,confirmStreak:0,tag:'incoming'};
  assert.equal(api.mergeWeak(tieCurrent,tieIncoming).tag,'incoming');
}

// Answer merge preserves a nonblank current answer; otherwise incoming survives.
{
  const out=plain(api.mergeAnswerMaps(
    {a:'current',b:'',c:' current-space ',d:''},
    {a:'incoming',b:'incoming-b',c:'incoming-c',d:'',e:'incoming-e'}
  ));
  assert.deepEqual(out,{a:'current',b:'incoming-b',c:' current-space ',d:'',e:'incoming-e'});
}

// Manual merge chooses the side with a score, prefers current when both have scores, and unions component tags.
{
  const out=plain(api.mergeManualMaps(
    {
      a:{score:5,components:['current-a'],note:'current'},
      b:{score:'',components:['current-b'],note:'current-b'},
      c:{score:'',components:['current-c'],note:'current-c'}
    },
    {
      a:{score:3,components:['incoming-a'],note:'incoming'},
      b:{score:4,components:['incoming-b'],note:'incoming-b'},
      c:{score:'',components:['incoming-c'],note:'incoming-c'},
      d:{score:2,components:['incoming-d']}
    }
  ));
  assert.equal(out.a.score,5);assert.equal(out.a.note,'current');
  assert.deepEqual(out.a.components,['incoming-a','current-a']);
  assert.equal(out.b.score,4);assert.equal(out.b.note,'incoming-b');
  assert.deepEqual(out.b.components,['incoming-b','current-b']);
  assert.equal(out.c.score,'');assert.equal(out.c.note,'current-c');
  assert.deepEqual(out.c.components,['incoming-c','current-c']);
  assert.deepEqual(out.d,{score:2,components:['incoming-d']});
}

// Exposure merge preserves the more exposed state by rank.
assert.deepEqual(plain(api.mergeExposure(
  {2024:'first',2025:'done',2026:'partial'},
  {2024:'partial',2025:'unknown',2026:'done',2023:'first'}
)),{2023:'first',2024:'partial',2025:'done',2026:'done'});

// Dedupe keeps the last record for a key while preserving first-key insertion order.
assert.deepEqual(plain(api.dedupeBy(
  [{id:'a',v:1},{id:'b',v:2},{id:'a',v:3}],
  x=>x.id
)),[{id:'a',v:3},{id:'b',v:2}]);

// Same-day daily progress keeps the highest answered count; off-day data prefers the current side.
assert.deepEqual(plain(api.mergeDailyProgress(
  {date:'2026-09-18',answeredCount:4},
  {date:'2026-09-18',answeredCount:7}
)),{date:'2026-09-18',answeredCount:7});
assert.deepEqual(plain(api.mergeDailyProgress(
  {date:'2026-09-17',answeredCount:9},
  {date:'2026-09-16',answeredCount:8}
)),{date:'2026-09-17',answeredCount:9});
assert.deepEqual(plain(api.mergeDailyProgress(
  null,{date:'2026-09-18',answeredCount:3}
)),{date:'2026-09-18',answeredCount:3});

// Composite import merge: current live state wins ordinary conflicts, while history is preserved/deduped.
{
  const current={
    schemaVersion:8,theme:'dark',
    answers:{a:'current',b:''},
    manual:{m:{score:5,components:['current']}},
    weak:{
      mastered:{status:'mastered',streak:0,tag:'current-mastered'},
      progress:{status:'active',streak:2,confirmStreak:0,tag:'current-progress'}
    },
    cause:{same:'current',onlyCurrent:'c'},
    exposure:{2024:'partial'},
    attempts:[{id:'dup',marker:'current'},{id:'current-only',marker:'current-only'}],
    history:[{attemptId:'dup',marker:'current-history'},{attemptId:'current-only',marker:'current-only-history'}],
    drillLog:[{key:'k',q:'q',at:'t',ok:true,marker:'current-drill'}],
    currentAttempt:{id:'current-live',year:2024,status:'active',mode:'timed'},
    currentDrill:{key:'wk-current',q:{id:'dq-current'},answered:false},
    recoveredDrills:[{key:'existing',q:{id:'e'},recoveredAt:'old'}],
    dailyPlan:{date:'2026-09-18',kind:'weak'},
    dailyProgress:{date:'2026-09-18',answeredCount:4}
  };
  const incoming={
    schemaVersion:7,theme:'light',
    answers:{a:'incoming',b:'incoming-b',c:'incoming-c'},
    manual:{m:{score:3,components:['incoming']},n:{score:2,components:['n']}},
    weak:{
      mastered:{status:'active',streak:9,confirmStreak:9,tag:'incoming-active'},
      progress:{status:'pending',streak:0,confirmStreak:1,tag:'incoming-progress'},
      incomingOnly:{status:'active',streak:0,tag:'incoming-only'}
    },
    cause:{same:'incoming',onlyIncoming:'i'},
    exposure:{2024:'first',2025:'done'},
    attempts:[{id:'dup',marker:'incoming'},{id:'incoming-only',marker:'incoming-only'}],
    history:[{attemptId:'dup',marker:'incoming-history'},{attemptId:'incoming-only',marker:'incoming-only-history'}],
    drillLog:[{key:'k',q:'q',at:'t',ok:true,marker:'incoming-drill'},{key:'ki',q:'qi',at:'ti',ok:false,marker:'incoming-only-drill'}],
    currentAttempt:{id:'incoming-live',year:2025,status:'active',mode:'timed',custom:'incoming-live'},
    currentDrill:{key:'wk-incoming',q:{id:'dq-incoming'},answered:false,custom:'incoming-drill-live'},
    recoveredDrills:[{key:'imported-existing',q:{id:'ie'},recoveredAt:'older'}],
    dailyPlan:{date:'2026-09-18',kind:'route'},
    dailyProgress:{date:'2026-09-18',answeredCount:7}
  };
  const merged=plain(api.mergeImportedState(plain(current),plain(incoming)));

  assert.equal(merged.schemaVersion,8);
  assert.equal(merged.theme,'dark');
  assert.deepEqual(merged.answers,{a:'current',b:'incoming-b',c:'incoming-c'});
  assert.equal(merged.manual.m.score,5);assert.deepEqual(merged.manual.m.components,['incoming','current']);
  assert.equal(merged.manual.n.score,2);
  assert.equal(merged.weak.mastered.tag,'current-mastered');
  assert.equal(merged.weak.progress.tag,'incoming-progress');
  assert.equal(merged.weak.incomingOnly.tag,'incoming-only');
  assert.deepEqual(merged.cause,{same:'current',onlyIncoming:'i',onlyCurrent:'c'});
  assert.deepEqual(merged.exposure,{2024:'partial',2025:'done'});

  const attempts=Object.fromEntries(merged.attempts.map(x=>[x.id,x]));
  assert.equal(attempts.dup.marker,'current');
  assert.equal(attempts['current-only'].marker,'current-only');
  assert.equal(attempts['incoming-only'].marker,'incoming-only');
  assert.equal(attempts['incoming-live'].status,'interrupted');
  assert.equal(attempts['incoming-live'].interrupted,true);
  assert.equal(attempts['incoming-live'].endedAt,fixed);
  assert.equal(attempts['incoming-live'].recoveredFromImport,true);

  const history=Object.fromEntries(merged.history.map(x=>[x.attemptId,x]));
  assert.equal(history.dup.marker,'current-history');
  assert.equal(history['incoming-only'].marker,'incoming-only-history');
  assert.equal(history['current-only'].marker,'current-only-history');

  const drillByMarker=Object.fromEntries(merged.drillLog.map(x=>[x.marker,x]));
  assert.ok(drillByMarker['current-drill']);
  assert.ok(drillByMarker['incoming-only-drill']);
  assert.ok(!drillByMarker['incoming-drill']);

  assert.equal(merged.currentAttempt.id,'current-live');
  assert.equal(merged.currentDrill.key,'wk-current');
  assert.ok(merged.recoveredDrills.some(x=>x.key==='wk-incoming'&&x.q.id==='dq-incoming'&&x.recoveredAt===fixed));
  assert.ok(merged.recoveredDrills.some(x=>x.key==='existing'));
  assert.ok(merged.recoveredDrills.some(x=>x.key==='imported-existing'));
  assert.equal(merged.dailyPlan,null);
  assert.deepEqual(merged.dailyProgress,{date:'2026-09-18',answeredCount:7});
}

// If there is no current live attempt/drill, incoming live state becomes active rather than archived.
{
  const current={attempts:[],history:[],drillLog:[],weak:{},answers:{},manual:{},cause:{},exposure:{},recoveredDrills:[],currentAttempt:null,currentDrill:null,dailyProgress:null};
  const incoming={attempts:[],history:[],drillLog:[],weak:{},answers:{},manual:{},cause:{},exposure:{},recoveredDrills:[],currentAttempt:{id:'incoming-live',year:2024},currentDrill:{key:'wk',q:{id:'d'}},dailyProgress:null};
  const merged=plain(api.mergeImportedState(current,incoming));
  assert.equal(merged.currentAttempt.id,'incoming-live');
  assert.equal(merged.currentDrill.key,'wk');
  assert.equal(merged.attempts.length,0);
  assert.equal(merged.recoveredDrills.length,0);
}

console.log('Waseda backup/import merge characterization: CLEAN');
