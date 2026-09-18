import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

function read(path){return fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8')}
function plain(v){return JSON.parse(JSON.stringify(v))}

const ctx={};ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);vm.runInContext(read('engine/core.js'),ctx,{filename:'engine/core.js'});
const core=ctx.ENGLISH_ENGINE_CORE;
for(const name of ['isRemediationEligible','compareRemediationEntries','remediationDailyProgressCount','remediationDailyAnsweredCount','remediationDailyTargetRemaining','remediationDailyTargetReached']){
  assert.equal(typeof core?.[name],'function',`missing shared helper ${name}`);
}

const today='2026-09-18';
const legacyEligible=w=>w.status==='active'||(w.status==='pending'&&(!w.next||w.next<=today));
for(const weak of [
  {status:'active'},
  {status:'pending'},
  {status:'pending',next:'2026-09-18'},
  {status:'pending',next:'2026-09-19'},
  {status:'mastered',next:'2026-09-18'}
]){
  assert.equal(core.isRemediationEligible(plain(weak),today),legacyEligible(weak),`eligibility diverged: ${JSON.stringify(weak)}`);
}

const priorityOrder=w=>({A:0,B:1,C:2}[w.priority]??3);
function legacySort(a,b){
  const aDue=a[1].status==='pending'?0:1,bDue=b[1].status==='pending'?0:1;if(aDue!==bDue)return aDue-bDue;
  const priority=priorityOrder(a[1])-priorityOrder(b[1]);if(priority)return priority;
  const next=(a[1].next||'').localeCompare(b[1].next||'');if(next)return next;
  const assigned=(a[1].lastAssignedDate||'').localeCompare(b[1].lastAssignedDate||'');if(assigned)return assigned;
  return a[0].localeCompare(b[0]);
}
const rows=[
  ['active-a',{status:'active',priority:'A',next:'2026-09-17',lastAssignedDate:'2026-09-10'}],
  ['pending-c',{status:'pending',priority:'C',next:'2026-09-17',lastAssignedDate:'2026-09-01'}],
  ['pending-b-late',{status:'pending',priority:'B',next:'2026-09-18',lastAssignedDate:'2026-09-01'}],
  ['pending-a-new',{status:'pending',priority:'A',next:'2026-09-17',lastAssignedDate:'2026-09-12'}],
  ['pending-a-old-z',{status:'pending',priority:'A',next:'2026-09-17',lastAssignedDate:'2026-09-01'}],
  ['pending-a-old-a',{status:'pending',priority:'A',next:'2026-09-17',lastAssignedDate:'2026-09-01'}]
];
const oldOrder=plain(rows).sort(legacySort).map(x=>x[0]);
const newOrder=plain(rows).sort((a,b)=>core.compareRemediationEntries(a,b,priorityOrder)).map(x=>x[0]);
assert.deepEqual(newOrder,oldOrder);

const countFixtures=[
  {state:{dailyProgress:{date:today,answeredCount:7}},plan:{date:today,answeredCount:4}},
  {state:{dailyProgress:{date:today,answeredCount:2}},plan:{date:today,answeredCount:12}},
  {state:{dailyProgress:{date:'2026-09-17',answeredCount:9}},plan:{date:today,answeredCount:3}},
  {state:{},plan:null},
  {state:{dailyProgress:{date:today,answeredCount:-5}},plan:{date:today,answeredCount:-2}}
];
for(const {state,plan} of countFixtures){
  const legacyProgress=state?.dailyProgress?.date===today?Math.max(0,Number(state.dailyProgress.answeredCount)||0):0;
  const legacyAnswered=Math.max(legacyProgress,plan?.date===today?Number(plan.answeredCount)||0:0);
  assert.equal(core.remediationDailyProgressCount(plain(state),today),legacyProgress);
  assert.equal(core.remediationDailyAnsweredCount(plain(state),plain(plan),today),legacyAnswered);
  for(const target of [1,10,15]){
    assert.equal(core.remediationDailyTargetRemaining(legacyAnswered,target),Math.max(0,target-legacyAnswered));
    assert.equal(core.remediationDailyTargetReached(legacyAnswered,target),legacyAnswered>=target);
  }
}

assert.throws(()=>core.compareRemediationEntries(rows[0],rows[1],null),/priorityOrder/);

console.log('shared daily remediation scheduling parity: CLEAN');
