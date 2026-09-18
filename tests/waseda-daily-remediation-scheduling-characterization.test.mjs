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
function plain(v){return JSON.parse(JSON.stringify(v))}

const app=read('app.js');
const names=['eligibleToday','sortWeakEntries','dailyPlanValid','dailyProgressCount','dailyAnswered','dailyTargetRemaining','dailyTargetReached','availableLearningActions'];
const src=Object.fromEntries(names.map(name=>[name,functionSource(app,name)]));

// Freeze due eligibility and deterministic weak ordering.
{
  const ctx={today:()=> '2026-09-18',priorityOrder:w=>({A:0,B:1,C:2}[w?.priority]??3)};
  ctx.globalThis=ctx;vm.createContext(ctx);
  vm.runInContext(`${src.eligibleToday}\n${src.sortWeakEntries}\nglobalThis.api={eligibleToday,sortWeakEntries};`,ctx);
  const e=ctx.api.eligibleToday;
  assert.equal(e(['a',{status:'active'}]),true);
  assert.equal(e(['p0',{status:'pending'}]),true);
  assert.equal(e(['p1',{status:'pending',next:'2026-09-18'}]),true);
  assert.equal(e(['p2',{status:'pending',next:'2026-09-19'}]),false);
  assert.equal(e(['m',{status:'mastered',next:'2026-09-18'}]),false);

  const rows=[
    ['active-a',{status:'active',priority:'A',next:'2026-09-17',lastAssignedDate:'2026-09-10'}],
    ['pending-c',{status:'pending',priority:'C',next:'2026-09-17',lastAssignedDate:'2026-09-01'}],
    ['pending-b-late',{status:'pending',priority:'B',next:'2026-09-18',lastAssignedDate:'2026-09-01'}],
    ['pending-a-new',{status:'pending',priority:'A',next:'2026-09-17',lastAssignedDate:'2026-09-12'}],
    ['pending-a-old-z',{status:'pending',priority:'A',next:'2026-09-17',lastAssignedDate:'2026-09-01'}],
    ['pending-a-old-a',{status:'pending',priority:'A',next:'2026-09-17',lastAssignedDate:'2026-09-01'}]
  ];
  assert.deepEqual(rows.sort(ctx.api.sortWeakEntries).map(x=>x[0]),[
    'pending-a-old-a','pending-a-old-z','pending-a-new','pending-b-late','pending-c','active-a'
  ]);
}

// Freeze daily target accounting: progress survives regenerated plan counts and date mismatch resets.
{
  const ctx={
    S:{goal:70,dailyPlan:{date:'2026-09-18',goal:70,answeredCount:4},dailyProgress:{date:'2026-09-18',answeredCount:7}},
    DAILY_TASK_TARGET:10,
    today:()=> '2026-09-18'
  };
  ctx.ensureDailyPlan=()=>ctx.S.dailyPlan;ctx.globalThis=ctx;vm.createContext(ctx);
  vm.runInContext(`${src.dailyPlanValid}\n${src.dailyProgressCount}\n${src.dailyAnswered}\n${src.dailyTargetRemaining}\n${src.dailyTargetReached}\nglobalThis.api={dailyPlanValid,dailyProgressCount,dailyAnswered,dailyTargetRemaining,dailyTargetReached};`,ctx);
  assert.equal(ctx.api.dailyPlanValid(),true);
  assert.equal(ctx.api.dailyProgressCount(),7);
  assert.equal(ctx.api.dailyAnswered(),7,'daily progress must win over a lower regenerated plan count');
  assert.equal(ctx.api.dailyTargetRemaining(),3);
  assert.equal(ctx.api.dailyTargetReached(),false);
  ctx.S.dailyPlan.answeredCount=12;
  assert.equal(ctx.api.dailyAnswered(),12);assert.equal(ctx.api.dailyTargetRemaining(),0);assert.equal(ctx.api.dailyTargetReached(),true);
  ctx.S.dailyPlan.date='2026-09-17';
  assert.equal(ctx.api.dailyAnswered(ctx.S.dailyPlan),7,'yesterday plan count must not override today progress');
  ctx.S.dailyProgress={date:'2026-09-17',answeredCount:9};
  assert.equal(ctx.api.dailyProgressCount(),0);
  ctx.S.dailyPlan={date:'2026-09-18',goal:60,answeredCount:0};
  assert.equal(ctx.api.dailyPlanValid(),false,'goal change must invalidate the daily plan');
}

// Freeze Today action ordering independently of labels/rendering.
{
  const entries=[
    ['due-a',{status:'pending',priority:'A',next:'2026-09-18',confirmStreak:1,year:2024,label:'Due'}],
    ['progress-a',{status:'active',priority:'A',streak:2,year:2023,label:'Progress'}],
    ['other-a',{status:'active',priority:'A',streak:0,year:2022,label:'Other'}],
    ['outside-b',{status:'active',priority:'B',streak:0,year:2021,label:'Outside'}]
  ];
  const ctx={
    S:{currentAttempt:{status:'active',year:2025}},
    activeWeak:()=>entries,
    gradeInGoal:p=>p==='A',
    today:()=> '2026-09-18',
    priorityOrder:w=>({A:0,B:1,C:2}[w?.priority]??3),
    nextRouteYear:()=>2026,
    routeRole:()=> '最終判定',
    goalLabel:g=>g===70?'B 70点':g===75?'C 75点':'A 60点'
  };
  ctx.globalThis=ctx;vm.createContext(ctx);
  vm.runInContext(`${src.eligibleToday}\n${src.sortWeakEntries}\n${src.availableLearningActions}\nglobalThis.actions=availableLearningActions();`,ctx);
  const actions=plain(ctx.actions);
  assert.deepEqual(actions.map(x=>[x.kind,x.key||null,x.year||null,x.goal||null]),[
    ['weak','due-a',null,null],
    ['weak','progress-a',null,null],
    ['attempt',null,2025,null],
    ['weak','other-a',null,null],
    ['route',null,2026,null],
    ['goal',null,null,70]
  ]);
  assert.equal(actions[0].label,'今日の定着チェックへ');
  assert.equal(actions[1].label,'この弱点を続ける');
  assert.equal(actions[3].label,'次の弱点へ');
}

console.log('Waseda daily remediation scheduling characterization: CLEAN');
