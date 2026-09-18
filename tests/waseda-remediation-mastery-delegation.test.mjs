import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

function read(path){return fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8')}
function functionSource(source,name){
  const marker=`function ${name}(`,start=source.indexOf(marker);
  assert.ok(start>=0,`missing function ${name}`);
  const brace=source.indexOf('{',start);assert.ok(brace>=0,`missing body for ${name}`);
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
function plain(value){return JSON.parse(JSON.stringify(value))}

const app=read('app.js');
const finish=functionSource(app,'finishDrill');
assert.match(finish,/window\.ENGLISH_ENGINE_CORE\?\.advanceRemediationMastery/);
assert.match(finish,/transition\?\.needsConfirmationReserve/);
assert.match(finish,/ensureConfirmationReserve\(drillState\.key,w,poolForWeak\(w\)\)/);
assert.match(finish,/else if\(drillState\.mode==="train"\)/,'legacy no-core fallback must remain');

function makeContext({mode='confirm',correct=false,shared=true}={}){
  const calls={advance:[],reserve:0,persist:0,render:0,reveal:0};
  const weak=mode==='confirm'
    ?{status:'pending',streak:3,confirmStreak:1,next:'2026-09-17',reservedConfirm:['r1','r2'],targetId:'reason-evidence'}
    :{status:'active',streak:2,confirmStreak:0,next:'2026-09-17',reservedConfirm:[],targetId:'reason-evidence'};
  const drill={key:'k',answered:false,correct:null,mode,used:['r1'],failedConfirmation:false,skill:'reason',q:{id:'q1'}};
  const ctx={
    console,
    renderedDate:'2026-09-17',dayChangePending:false,dayChangeNotice:false,dayChangeAnswerMoved:false,
    drillState:drill,
    S:{weak:{k:weak},dailyPlan:{date:'2026-09-17',answeredCount:0},dailyProgress:null,drillLog:[]},
    today:()=> '2026-09-17',
    plusDays:()=> '2026-09-18',
    applyDayChange(){throw new Error('unexpected day change')},
    ensureDailyPlan(){},
    dailyAnswered:()=>0,
    ensureConfirmationReserve(){calls.reserve++},
    poolForWeak:()=>[],
    persistDrill(){calls.persist++},
    render(){calls.render++},
    requestAnimationFrame(fn){fn()},
    revealDrillFeedback(){calls.reveal++},
    Date
  };
  ctx.window=ctx;ctx.globalThis=ctx;
  vm.createContext(ctx);
  vm.runInContext(read('engine/core.js'),ctx,{filename:'engine/core.js'});
  if(shared){
    const real=ctx.ENGLISH_ENGINE_CORE.advanceRemediationMastery;
    ctx.ENGLISH_ENGINE_CORE={...ctx.ENGLISH_ENGINE_CORE,advanceRemediationMastery(...args){calls.advance.push(args);return real(...args)}};
  }else ctx.ENGLISH_ENGINE_CORE={};
  vm.runInContext(`${finish}\nglobalThis.__finishDrill=finishDrill;`,ctx,{filename:'finishDrill.js'});
  ctx.__finishDrill(correct);
  return {ctx,calls,weak,drill};
}

{
  const {ctx,calls,weak,drill}=makeContext({mode:'confirm',correct:false,shared:true});
  assert.equal(calls.advance.length,1,'shared transition must be called exactly once');
  assert.equal(calls.advance[0][0],weak);assert.equal(calls.advance[0][1],drill);assert.equal(calls.advance[0][2],false);
  assert.deepEqual(plain(calls.advance[0][3]),{today:'2026-09-17',nextDay:'2026-09-18',nowIso:calls.advance[0][3].nowIso,trainTarget:3,confirmTarget:2});
  assert.match(calls.advance[0][3].nowIso,/^\d{4}-\d{2}-\d{2}T/);
  assert.equal(calls.reserve,1,'failed confirmation must reserve a new confirmation set through app side effect');
  assert.equal(weak.status,'active');assert.equal(weak.streak,0);assert.equal(weak.confirmStreak,0);assert.deepEqual(plain(weak.reservedConfirm),[]);
  assert.equal(drill.mode,'train');assert.deepEqual(plain(drill.used),[]);assert.equal(drill.failedConfirmation,true);
  assert.equal(drill.answered,true);assert.equal(drill.correct,false);
  assert.equal(ctx.S.dailyProgress.answeredCount,1);assert.equal(ctx.S.dailyPlan.answeredCount,1);
  assert.equal(ctx.S.drillLog.length,1);assert.equal(ctx.S.drillLog[0].ok,false);
  assert.equal(calls.persist,1);assert.equal(calls.render,1);assert.equal(calls.reveal,1);
}
{
  const {calls,weak}=makeContext({mode:'train',correct:true,shared:true});
  assert.equal(calls.advance.length,1);assert.equal(calls.reserve,0);
  assert.equal(weak.status,'pending');assert.equal(weak.streak,3);assert.equal(weak.confirmStreak,0);assert.equal(weak.next,'2026-09-18');
}
{
  const {calls,weak}=makeContext({mode:'train',correct:true,shared:false});
  assert.equal(calls.advance.length,0);assert.equal(calls.reserve,0);
  assert.equal(weak.status,'pending');assert.equal(weak.streak,3);assert.equal(weak.confirmStreak,0);assert.equal(weak.next,'2026-09-18');
}

console.log('Waseda remediation mastery runtime delegation: CLEAN');
