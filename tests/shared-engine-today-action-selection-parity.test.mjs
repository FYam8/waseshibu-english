import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

function read(path){return fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8')}
function plain(v){return JSON.parse(JSON.stringify(v))}
const ctx={};ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);vm.runInContext(read('engine/core.js'),ctx,{filename:'engine/core.js'});
const select=ctx.ENGLISH_ENGINE_CORE?.selectDailyLearningActionDescriptors;
assert.equal(typeof select,'function','shared Today action selector missing');

const today='2026-09-18';
const entries=[
  ['due-a',{status:'pending',priority:'A',next:today,confirmStreak:1}],
  ['progress-a',{status:'active',priority:'A',streak:2}],
  ['other-a',{status:'active',priority:'A',streak:0}],
  ['outside-b',{status:'active',priority:'B',streak:0}]
];
const isInGoal=w=>w.priority==='A';
const isEligible=([,w])=>w.status==='active'||(w.status==='pending'&&(!w.next||w.next<=today));
const compare=(a,b)=>(a[1].status==='pending'?0:1)-(b[1].status==='pending'?0:1)||a[0].localeCompare(b[0]);

const actions=plain(select({entries:plain(entries),currentAttempt:{status:'active',year:2025},routeYear:2026,isInGoal,isEligible,compareEntries:compare}));
assert.deepEqual(actions,[
  {kind:'weak',stage:'confirm',key:'due-a'},
  {kind:'weak',stage:'continue',key:'progress-a'},
  {kind:'attempt',year:2025},
  {kind:'weak',stage:'new',key:'other-a'},
  {kind:'route',year:2026},
  {kind:'upgrade',key:'outside-b',priority:'B'}
]);

const sameRoute=plain(select({entries:[],currentAttempt:{status:'active',year:2026},routeYear:2026,isInGoal,isEligible,compareEntries:compare}));
assert.deepEqual(sameRoute,[{kind:'attempt',year:2026}],'route action must not duplicate the active attempt year');

const noAttempt=plain(select({entries:[],currentAttempt:null,routeYear:2026,isInGoal,isEligible,compareEntries:compare}));
assert.deepEqual(noAttempt,[{kind:'route',year:2026}]);

const futureOnly=plain(select({
  entries:[['future',{status:'pending',priority:'A',next:'2026-09-19'}]],
  currentAttempt:null,routeYear:null,isInGoal,isEligible,compareEntries:compare
}));
assert.deepEqual(futureOnly,[],'future retention must not become an available Today action');

for(const bad of [
  ()=>select({entries:null,isInGoal,isEligible,compareEntries:compare}),
  ()=>select({entries:[],isInGoal:null,isEligible,compareEntries:compare}),
  ()=>select({entries:[],isInGoal,isEligible:null,compareEntries:compare}),
  ()=>select({entries:[],isInGoal,isEligible,compareEntries:null})
])assert.throws(bad,/entries must be an array|isInGoal must be a function|isEligible must be a function|compareEntries must be a function/);

console.log('shared Today action descriptor selection parity: CLEAN');
