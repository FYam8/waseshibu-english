import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

function read(path){return fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8')}
function plain(v){return JSON.parse(JSON.stringify(v))}

const ctx={};ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);vm.runInContext(read('engine/core.js'),ctx,{filename:'engine/core.js'});
const core=ctx.ENGLISH_ENGINE_CORE;
assert.equal(typeof core?.decideDayRollover,'function');
assert.equal(typeof core?.applyDailyRolloverState,'function');

function legacyDecision({renderedDate,currentDate,isDrillView,hasDrill,drillAnswered}){
  if(renderedDate===currentDate)return {kind:'same',notice:false};
  if(isDrillView&&hasDrill&&!drillAnswered)return {kind:'defer',notice:false};
  return {kind:'apply',notice:!!(isDrillView&&hasDrill)};
}
for(const fixture of [
  {renderedDate:'2026-09-18',currentDate:'2026-09-18',isDrillView:false,hasDrill:false,drillAnswered:false},
  {renderedDate:'2026-09-17',currentDate:'2026-09-18',isDrillView:true,hasDrill:true,drillAnswered:false},
  {renderedDate:'2026-09-17',currentDate:'2026-09-18',isDrillView:true,hasDrill:true,drillAnswered:true},
  {renderedDate:'2026-09-17',currentDate:'2026-09-18',isDrillView:true,hasDrill:false,drillAnswered:false},
  {renderedDate:'2026-09-17',currentDate:'2026-09-18',isDrillView:false,hasDrill:true,drillAnswered:false}
]){
  assert.deepEqual(plain(core.decideDayRollover(plain(fixture))),legacyDecision(fixture));
}

function legacyApply(state,currentDate){
  if(state.dailyPlan?.date!==currentDate)state.dailyPlan=null;
  if(state.dailyProgress?.date!==currentDate)state.dailyProgress=null;
  return state;
}
for(const fixture of [
  {dailyPlan:{date:'2026-09-17',x:1},dailyProgress:{date:'2026-09-17',answeredCount:5}},
  {dailyPlan:{date:'2026-09-18',x:1},dailyProgress:{date:'2026-09-18',answeredCount:5}},
  {dailyPlan:null,dailyProgress:null},
  {dailyPlan:{date:'2026-09-18'},dailyProgress:{date:'2026-09-17',answeredCount:5}},
  {dailyPlan:{date:'2026-09-17'},dailyProgress:{date:'2026-09-18',answeredCount:5}}
]){
  const oldState=plain(fixture),newState=plain(fixture);
  const oldResult=legacyApply(oldState,'2026-09-18');
  const newResult=core.applyDailyRolloverState(newState,'2026-09-18');
  assert.equal(newResult,newState);
  assert.deepEqual(plain(newState),oldResult);
}
assert.throws(()=>core.applyDailyRolloverState(null,'2026-09-18'),/state must be an object/);

console.log('shared local-day rollover parity: CLEAN');
