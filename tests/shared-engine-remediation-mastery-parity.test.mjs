import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

function read(path){return fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8')}
function plain(value){return JSON.parse(JSON.stringify(value))}

const ctx={};ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);vm.runInContext(read('engine/core.js'),ctx,{filename:'engine/core.js'});
const shared=ctx.ENGLISH_ENGINE_CORE?.advanceRemediationMastery;
assert.equal(typeof shared,'function','shared remediation mastery transition missing');

function legacy(weak,drill,correct,{today,nextDay,nowIso,trainTarget=3,confirmTarget=2}){
  const result={needsConfirmationReserve:false,completedTraining:false,mastered:false};
  if(drill.mode==='train'){
    if(correct)weak.streak=(weak.streak||0)+1;else weak.streak=0;
    if(weak.streak>=trainTarget){weak.status='pending';weak.next=nextDay;weak.confirmStreak=0;result.completedTraining=true}
  }else{
    if(correct)weak.confirmStreak=(weak.confirmStreak||0)+1;
    else{
      weak.confirmStreak=0;weak.status='active';weak.streak=0;weak.next=today;weak.reservedConfirm=[];
      drill.mode='train';drill.used=[];drill.failedConfirmation=true;result.needsConfirmationReserve=true;
    }
    if(weak.confirmStreak>=confirmTarget){weak.status='mastered';weak.masteredAt=nowIso;weak.last='correct';result.mastered=true}
  }
  return result;
}

const clock={today:'2026-09-17',nextDay:'2026-09-18',nowIso:'2026-09-17T12:34:56.000Z',trainTarget:3,confirmTarget:2};
const fixtures=[
  {name:'train first correct',correct:true,weak:{status:'active',streak:0,confirmStreak:0,next:'2026-09-17',reservedConfirm:['r1']},drill:{mode:'train',used:['q1'],failedConfirmation:false}},
  {name:'train wrong resets streak',correct:false,weak:{status:'active',streak:2,confirmStreak:0,next:'2026-09-17',reservedConfirm:['r1']},drill:{mode:'train',used:['q1'],failedConfirmation:false}},
  {name:'train third correct schedules next-day confirmation',correct:true,weak:{status:'active',streak:2,confirmStreak:9,next:'2026-09-17',reservedConfirm:['r1','r2']},drill:{mode:'train',used:['q1'],failedConfirmation:false}},
  {name:'confirm first correct stays pending',correct:true,weak:{status:'pending',streak:3,confirmStreak:0,next:'2026-09-17',reservedConfirm:['r1','r2']},drill:{mode:'confirm',used:['r1'],failedConfirmation:false}},
  {name:'confirm second correct masters',correct:true,weak:{status:'pending',streak:3,confirmStreak:1,next:'2026-09-17',reservedConfirm:['r1','r2'],last:'wrong'},drill:{mode:'confirm',used:['r1','r2'],failedConfirmation:false}},
  {name:'confirm wrong returns to training',correct:false,weak:{status:'pending',streak:3,confirmStreak:1,next:'2026-09-17',reservedConfirm:['r1','r2'],last:'wrong'},drill:{mode:'confirm',used:['r1'],failedConfirmation:false}}
];

for(const fixture of fixtures){
  const oldWeak=plain(fixture.weak),oldDrill=plain(fixture.drill),newWeak=plain(fixture.weak),newDrill=plain(fixture.drill);
  const oldResult=legacy(oldWeak,oldDrill,fixture.correct,clock);
  const newResult=shared(newWeak,newDrill,fixture.correct,clock);
  assert.deepEqual(plain(newWeak),plain(oldWeak),`${fixture.name}: weak state diverged`);
  assert.deepEqual(plain(newDrill),plain(oldDrill),`${fixture.name}: drill state diverged`);
  assert.deepEqual(plain(newResult),plain(oldResult),`${fixture.name}: transition flags diverged`);
}

const training={status:'active',streak:2,confirmStreak:5,next:'old',reservedConfirm:['r1']},trainDrill={mode:'train',used:['q']};
const trainResult=shared(training,trainDrill,true,clock);
assert.equal(training.status,'pending');assert.equal(training.streak,3);assert.equal(training.confirmStreak,0);assert.equal(training.next,clock.nextDay);assert.equal(trainResult.completedTraining,true);

const failed={status:'pending',streak:3,confirmStreak:1,next:clock.today,reservedConfirm:['r1','r2']},failedDrill={mode:'confirm',used:['r1']};
const failResult=shared(failed,failedDrill,false,clock);
assert.deepEqual(plain(failed),{status:'active',streak:0,confirmStreak:0,next:clock.today,reservedConfirm:[]});
assert.deepEqual(plain(failedDrill),{mode:'train',used:[],failedConfirmation:true});
assert.equal(failResult.needsConfirmationReserve,true);

const mastered={status:'pending',streak:3,confirmStreak:1,next:clock.today,reservedConfirm:['r1','r2'],last:'wrong'},masterDrill={mode:'confirm',used:['r1','r2']};
const masterResult=shared(mastered,masterDrill,true,clock);
assert.equal(mastered.status,'mastered');assert.equal(mastered.confirmStreak,2);assert.equal(mastered.masteredAt,clock.nowIso);assert.equal(mastered.last,'correct');assert.equal(masterResult.mastered,true);

console.log('shared remediation mastery transition parity: CLEAN');
