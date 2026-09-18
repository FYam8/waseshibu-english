import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

function read(path){return fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8')}
function plain(v){return JSON.parse(JSON.stringify(v))}
const ctx={};ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);vm.runInContext(read('engine/core.js'),ctx,{filename:'engine/core.js'});
const build=ctx.ENGLISH_ENGINE_CORE?.buildRemediationDailyPlan;
assert.equal(typeof build,'function','shared daily plan builder missing');

const today='2026-09-18',nowIso='2026-09-18T06:30:00.000Z';
const isInGoal=w=>w.priority!=='C';
const isEligible=([,w])=>w.status==='active'||(w.status==='pending'&&(!w.next||w.next<=today));
const compare=(a,b)=>(a[1].status==='pending'?0:1)-(b[1].status==='pending'?0:1)||a[0].localeCompare(b[0]);

function legacy(entries,{goal=70,answeredCount=0,routeYear=null}={}){
  const all=entries.filter(([,w])=>isInGoal(w));
  const candidates=all.filter(isEligible).sort(compare);
  if(candidates.length){
    const assignedKeys=candidates.map(([key])=>key);
    return {plan:{date:today,goal,kind:'weak',weakKeys:assignedKeys,answeredCount,createdAt:nowIso},assignedKeys};
  }
  if(all.length)return {plan:{date:today,goal,kind:'waiting',weakKeys:[],createdAt:nowIso},assignedKeys:[]};
  if(routeYear)return {plan:{date:today,goal,kind:'route',weakKeys:[],routeYear,createdAt:nowIso},assignedKeys:[]};
  return {plan:{date:today,goal,kind:'complete',weakKeys:[],createdAt:nowIso},assignedKeys:[]};
}

const fixtures=[
  {entries:[['active',{status:'active',priority:'B'}],['due',{status:'pending',priority:'A',next:today}],['outside',{status:'active',priority:'C'}]],opts:{goal:70,answeredCount:4,routeYear:2026}},
  {entries:[['future',{status:'pending',priority:'A',next:'2026-09-19'}]],opts:{goal:70,answeredCount:0,routeYear:2026}},
  {entries:[['outside',{status:'active',priority:'C'}]],opts:{goal:70,answeredCount:0,routeYear:2026}},
  {entries:[],opts:{goal:70,answeredCount:0,routeYear:null}}
];
for(const fixture of fixtures){
  const expected=legacy(plain(fixture.entries),fixture.opts);
  const actual=plain(build({
    entries:plain(fixture.entries),goal:fixture.opts.goal,today,answeredCount:fixture.opts.answeredCount,
    routeYear:fixture.opts.routeYear,nowIso,isInGoal,isEligible,compareEntries:compare
  }));
  assert.deepEqual(actual,expected);
}

for(const bad of [
  ()=>build({entries:null,isInGoal,isEligible,compareEntries:compare}),
  ()=>build({entries:[],isInGoal:null,isEligible,compareEntries:compare}),
  ()=>build({entries:[],isInGoal,isEligible:null,compareEntries:compare}),
  ()=>build({entries:[],isInGoal,isEligible,compareEntries:null})
])assert.throws(bad,/entries must be an array|isInGoal must be a function|isEligible must be a function|compareEntries must be a function/);

console.log('shared daily plan construction parity: CLEAN');
