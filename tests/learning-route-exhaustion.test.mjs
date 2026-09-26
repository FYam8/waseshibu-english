import assert from 'node:assert/strict';
import {context as ctx,data} from './g2-content-audit.mjs';

// Exercise the production pool/reservation/ranking functions with every source item.
// Synthetic answers test routing invariants, not human learning or score gains.
const core=ctx.ENGLISH_ENGINE_CORE;
let routes=0, selections=0, broadFocusRoutes=0;
for(const [year,questions] of Object.entries(data.exams))for(const question of questions){
  const key=`${year}:${question.id}:main`;
  const weak={...question,year:Number(year),status:'active',streak:0,reservedConfirm:[]};
  const pool=ctx.poolForWeak(weak);
  const reserved=ctx.ensureConfirmationReserve(key,weak,pool);
  assert.equal(reserved.length,2,key);
  const families=new Set(pool.filter(q=>reserved.includes(q.id)).map(q=>q.familyId));
  assert.equal(families.size,2,key);
  const uses=new Map();
  let usedIds=[],lastId=null;
  // Force exhaustion twice even for the largest pool, including repeated failures.
  for(let n=0;n<pool.length*2+3;n++){
    const result=core.selectNextPracticeQuestion({pool,reservedIds:reserved,usedIds,mode:'train',streak:n%3,
      rankChoices:items=>core.rankPracticeQuestions(items,{weak,lastId,lastUse:id=>uses.get(id)??-1})});
    assert.ok(result.question,key+' ran out of practice');
    assert.ok(!result.question.retired,key+' selected retired question');
    assert.ok(!families.has(result.question.familyId),key+' exposed a confirmation family');
    usedIds=result.usedIds;lastId=result.question.id;uses.set(lastId,n);selections++;
  }
  if(pool.some(q=>q.focusTag!==weak.focusTag))broadFocusRoutes++;
  // Perfect responses finish training only; tomorrow's two answers finish mastery.
  const drill={mode:'train',used:[]};
  const dates={today:'2026-09-26',nextDay:'2026-09-27',nowIso:'2026-09-26T09:00:00Z'};
  for(let i=0;i<3;i++)core.advanceRemediationMastery(weak,drill,true,dates);
  assert.equal(weak.status,'pending',key);
  assert.equal(core.practiceSessionStartDecision({weak,key,familyTotal:5,today:dates.today}).kind,'too-early');
  drill.mode='confirm';
  for(let i=0;i<2;i++)core.advanceRemediationMastery(weak,drill,true,{...dates,today:dates.nextDay});
  assert.equal(weak.status,'mastered',key);
  routes++;
}

// Multiple IDs can share one family. A loop reset must not leak the reserved sibling.
const pool=[{id:'r',familyId:'reserved',level:3},{id:'sibling',familyId:'reserved',level:1},
  {id:'t1',familyId:'train1',level:1},{id:'t2',familyId:'train2',level:2},
  {id:'t3',familyId:'train3',level:2},{id:'r2',familyId:'reserved2',level:3}];
const result=core.selectNextPracticeQuestion({pool,reservedIds:['r','r2'],usedIds:['t1','t2','t3'],
  mode:'train',streak:0,rankChoices:items=>items});
assert.equal(result.resetUsed,true);
assert.ok(['t1','t2','t3'].includes(result.question.id));
console.log(JSON.stringify({routes,selections,broadFocusRoutes,status:'PASS',
  limitation:'Structure and routing only; focus breadth requires semantic review; no learner outcome measurement'}));
