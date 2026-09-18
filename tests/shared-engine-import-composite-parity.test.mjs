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
const legacyNames=['mergeWeak','dedupeBy','mergeExposure','mergeAnswerMaps','mergeManualMaps','mergeDailyProgress','mergeImportedState'];
const RealDate=Date,fixed='2026-09-18T10:15:00.000Z';
class FixedDate extends RealDate{
  constructor(...args){super(...(args.length?args:[fixed]))}
  static now(){return new RealDate(fixed).getTime()}
}
const legacyCtx={Date:FixedDate,today:()=> '2026-09-18'};
legacyCtx.globalThis=legacyCtx;vm.createContext(legacyCtx);
vm.runInContext(`
const SCHEMA_VERSION=8;
${legacyNames.map(n=>functionSource(app,n)).join('\n')}
globalThis.merge=mergeImportedState;
`,legacyCtx);

const sharedCtx={};sharedCtx.window=sharedCtx;sharedCtx.globalThis=sharedCtx;vm.createContext(sharedCtx);
vm.runInContext(read('engine/core.js'),sharedCtx,{filename:'engine/core.js'});
const shared=sharedCtx.ENGLISH_ENGINE_CORE?.mergeImportedLearningState;
assert.equal(typeof shared,'function','shared composite import merge missing');

function run(current,incoming){
  const expected=plain(legacyCtx.merge(plain(current),plain(incoming)));
  const actual=plain(shared(plain(current),plain(incoming),{
    schemaVersion:8,todayValue:'2026-09-18',nowIso:()=>fixed
  }));
  assert.deepEqual(actual,expected);
}

run({
  schemaVersion:8,theme:'dark',
  answers:{a:'current',b:''},
  manual:{m:{score:5,components:['current']}},
  weak:{
    mastered:{status:'mastered',streak:0,tag:'current-mastered'},
    progress:{status:'active',streak:2,confirmStreak:0,tag:'current-progress'}
  },
  cause:{same:'current',onlyCurrent:'c'},
  exposure:{2024:'partial'},
  attempts:[{id:'dup',marker:'current'},{id:'current-only'}],
  history:[{attemptId:'dup',marker:'current-history'},{attemptId:'current-only'}],
  drillLog:[{key:'k',q:'q',at:'t',ok:true,marker:'current-drill'}],
  currentAttempt:{id:'current-live',year:2024,status:'active',mode:'timed'},
  currentDrill:{key:'wk-current',q:{id:'dq-current'},answered:false},
  recoveredDrills:[{key:'existing',q:{id:'e'},recoveredAt:'old'}],
  dailyPlan:{date:'2026-09-18',kind:'weak'},
  dailyProgress:{date:'2026-09-18',answeredCount:4}
},{
  schemaVersion:7,theme:'light',
  answers:{a:'incoming',b:'incoming-b',c:'incoming-c'},
  manual:{m:{score:3,components:['incoming']},n:{score:2,components:['n']}},
  weak:{
    mastered:{status:'active',streak:9,confirmStreak:9,tag:'incoming-active'},
    progress:{status:'pending',streak:0,confirmStreak:1,tag:'incoming-progress'},
    incomingOnly:{status:'active',streak:0}
  },
  cause:{same:'incoming',onlyIncoming:'i'},
  exposure:{2024:'first',2025:'done'},
  attempts:[{id:'dup',marker:'incoming'},{id:'incoming-only'}],
  history:[{attemptId:'dup',marker:'incoming-history'},{attemptId:'incoming-only'}],
  drillLog:[{key:'k',q:'q',at:'t',ok:true,marker:'incoming-drill'},{key:'ki',q:'qi',at:'ti',ok:false}],
  currentAttempt:{id:'incoming-live',year:2025,status:'active',mode:'timed'},
  currentDrill:{key:'wk-incoming',q:{id:'dq-incoming'},answered:false},
  recoveredDrills:[{key:'imported-existing',q:{id:'ie'},recoveredAt:'older'}],
  dailyPlan:{date:'2026-09-18',kind:'route'},
  dailyProgress:{date:'2026-09-18',answeredCount:7}
});

run({
  schemaVersion:8,answers:{},manual:{},weak:{},cause:{},exposure:{},
  attempts:[],history:[],drillLog:[],currentAttempt:null,currentDrill:null,
  recoveredDrills:[],dailyPlan:null,dailyProgress:null
},{
  schemaVersion:8,answers:{x:'1'},manual:{},weak:{},cause:{},exposure:{},
  attempts:[],history:[],drillLog:[],
  currentAttempt:{id:'incoming-live',year:2024},
  currentDrill:{key:'wk',q:{id:'d'}},
  recoveredDrills:[],dailyPlan:{date:'2026-09-17'},dailyProgress:{date:'2026-09-17',answeredCount:8}
});

run({
  schemaVersion:8,answers:{},manual:{},weak:{},cause:{},exposure:{},
  attempts:[],history:[],drillLog:[],
  currentAttempt:{id:'same',year:2024,marker:'current'},
  currentDrill:{key:'same',q:{id:'d'},marker:'current'},
  recoveredDrills:[],dailyProgress:{date:'2026-09-17',answeredCount:5}
},{
  schemaVersion:8,answers:{},manual:{},weak:{},cause:{},exposure:{},
  attempts:[],history:[],drillLog:[],
  currentAttempt:{id:'same',year:2024,marker:'incoming'},
  currentDrill:{key:'same',q:{id:'d'},marker:'incoming'},
  recoveredDrills:[],dailyProgress:{date:'2026-09-18',answeredCount:2}
});

console.log('shared composite backup/import merge parity: CLEAN');
