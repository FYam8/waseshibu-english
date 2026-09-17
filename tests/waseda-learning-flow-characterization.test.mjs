import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

function read(path){return fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8')}
function functionSource(source,name){
  const marker=`function ${name}(`,start=source.indexOf(marker);
  assert.ok(start>=0,`missing function ${name}`);
  const brace=source.indexOf('{',start);let depth=0;
  for(let i=brace;i<source.length;i++){
    if(source[i]==='{')depth++;
    else if(source[i]==='}'&&--depth===0)return source.slice(start,i+1);
  }
  throw new Error(`unterminated function ${name}`);
}

const app=read('app.js');

function buildTodayHarness(){
  const names=['localDate','today','activeWeak','priorityOrder','eligibleToday','sortWeakEntries','strategyPriority','gradeInGoal','nextRouteYear','routeRole','goalLabel','availableLearningActions'];
  const ctx={
    S:{goal:70,weak:{},attempts:[],currentAttempt:null},
    ROUTE:[2024,2023,2022,2021,2020,2019,2025,2026]
  };
  ctx.globalThis=ctx;vm.createContext(ctx);
  vm.runInContext(`${names.map(n=>functionSource(app,n)).join('\n')}\nglobalThis.api={availableLearningActions,today}`,ctx);
  return ctx;
}

{
  const ctx=buildTodayHarness(),today=ctx.api.today();
  ctx.S.weak={
    due:{status:'pending',next:today,priority:'A',year:2024,label:'due',confirmStreak:1},
    progressed:{status:'active',streak:2,priority:'A',year:2023,label:'progressed'},
    other:{status:'active',streak:0,priority:'B',year:2022,label:'other'},
    outside:{status:'active',streak:0,priority:'C',year:2021,label:'outside'}
  };
  ctx.S.currentAttempt={status:'active',year:2020};
  const actions=ctx.api.availableLearningActions();
  assert.deepEqual(actions.slice(0,4).map(x=>[x.kind,x.key||x.year]),[
    ['weak','due'],['weak','progressed'],['attempt',2020],['weak','other']
  ]);
  assert.equal(actions.at(-1).kind,'goal');
  assert.equal(actions.at(-1).goal,75);
}

{
  const ctx=buildTodayHarness();
  const actions=ctx.api.availableLearningActions();
  assert.equal(actions[0].kind,'route');
  assert.equal(actions[0].year,2024);
  assert.match(actions[0].note,/初見診断/);
}

function buildMasteryHarness(){
  const names=['localDate','today','plusDays','finishDrill'];
  const ctx={
    S:{weak:{},drillLog:[],dailyPlan:{date:null,answeredCount:0},dailyProgress:null},
    drillState:null,
    renderedDate:null,
    dayChangePending:false,
    dayChangeNotice:false,
    dayChangeAnswerMoved:false,
    ensureDailyPlan(){return ctx.S.dailyPlan},
    dailyAnswered(){return Number(ctx.S.dailyProgress?.answeredCount)||0},
    applyDayChange(){throw new Error('unexpected day change in characterization fixture')},
    poolForWeak(){return[]},
    ensureConfirmationReserve(){return[]},
    persistDrill(){},
    render(){},
    revealDrillFeedback(){},
    requestAnimationFrame(fn){fn()}
  };
  ctx.globalThis=ctx;vm.createContext(ctx);
  vm.runInContext(`${names.map(n=>functionSource(app,n)).join('\n')}\nglobalThis.api={today,plusDays,finishDrill}`,ctx);
  ctx.renderedDate=ctx.api.today();ctx.S.dailyPlan.date=ctx.api.today();
  return ctx;
}
function seed(ctx,{status='active',streak=0,confirmStreak=0,mode='train'}={}){
  ctx.S.weak={w:{status,streak,confirmStreak,next:status==='pending'?ctx.api.today():null,targetId:'target',skill:'reason'}};
  ctx.S.drillLog=[];ctx.S.dailyProgress={date:ctx.api.today(),answeredCount:0};ctx.S.dailyPlan={date:ctx.api.today(),answeredCount:0};
  ctx.drillState={key:'w',skill:'reason',targetId:'target',mode,used:['q1'],q:{id:'q1'},answered:false,failedConfirmation:false};
}

{
  const ctx=buildMasteryHarness();seed(ctx,{streak:2});ctx.api.finishDrill(false);
  assert.equal(ctx.S.weak.w.streak,0);assert.equal(ctx.S.weak.w.status,'active');
  assert.equal(ctx.S.dailyProgress.answeredCount,1);assert.equal(ctx.S.drillLog.length,1);assert.equal(ctx.S.drillLog[0].ok,false);
}
{
  const ctx=buildMasteryHarness();seed(ctx,{streak:2});ctx.api.finishDrill(true);
  assert.equal(ctx.S.weak.w.streak,3);assert.equal(ctx.S.weak.w.status,'pending');
  assert.equal(ctx.S.weak.w.confirmStreak,0);assert.equal(ctx.S.weak.w.next,ctx.api.plusDays(1));
}
{
  const ctx=buildMasteryHarness();seed(ctx,{status:'pending',streak:3,confirmStreak:1,mode:'confirm'});ctx.api.finishDrill(false);
  const w=ctx.S.weak.w;
  assert.equal(w.status,'active');assert.equal(w.streak,0);assert.equal(w.confirmStreak,0);assert.equal(w.next,ctx.api.today());
  assert.equal(ctx.drillState.mode,'train');assert.equal(ctx.drillState.failedConfirmation,true);assert.deepEqual(ctx.drillState.used,[]);
}
{
  const ctx=buildMasteryHarness();seed(ctx,{status:'pending',streak:3,confirmStreak:1,mode:'confirm'});ctx.api.finishDrill(true);
  const w=ctx.S.weak.w;
  assert.equal(w.confirmStreak,2);assert.equal(w.status,'mastered');assert.match(w.masteredAt,/^\d{4}-\d{2}-\d{2}T/);
}

console.log('Waseda Today/mastery executable characterization: CLEAN');
