import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

function read(path){return fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8')}
function functionSource(source,name){
  const marker=`function ${name}(`,start=source.indexOf(marker);
  assert.ok(start>=0,`missing function ${name}`);
  const brace=source.indexOf('{',start);assert.ok(brace>=0);
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

const app=read('app.js'),ensure=functionSource(app,'ensureDailyPlan');
const RealDate=Date,fixed='2026-09-18T06:30:00.000Z';
class FixedDate extends RealDate{
  constructor(...args){super(...(args.length?args:[fixed]))}
  static now(){return new RealDate(fixed).getTime()}
}

function run({entries=[],goal=70,routeYear=null,progress=0,validPlan=null}={}){
  let saves=0;
  const state={goal,dailyPlan:validPlan?plain(validPlan):null};
  const ctx={
    S:state,Date:FixedDate,
    today:()=> '2026-09-18',
    dailyPlanValid:()=>!!validPlan,
    activeWeak:()=>entries,
    gradeInGoal:p=>p!=='C',
    eligibleToday:([,w])=>w.status==='active'||(w.status==='pending'&&(!w.next||w.next<='2026-09-18')),
    sortWeakEntries:(a,b)=>(a[1].status==='pending'?0:1)-(b[1].status==='pending'?0:1)||a[0].localeCompare(b[0]),
    nextRouteYear:()=>routeYear,
    dailyProgressCount:()=>progress,
    save(){saves++}
  };
  ctx.globalThis=ctx;vm.createContext(ctx);
  vm.runInContext(`${ensure}\nglobalThis.result=ensureDailyPlan();`,ctx);
  return {plan:plain(ctx.result),state,saves};
}

{
  const due={status:'pending',priority:'A',next:'2026-09-18',lastAssignedDate:'old'};
  const active={status:'active',priority:'B'};
  const excluded={status:'active',priority:'C'};
  const r=run({entries:[['active',active],['excluded',excluded],['due',due]],progress:4,routeYear:2026});
  assert.deepEqual(r.plan,{date:'2026-09-18',goal:70,kind:'weak',weakKeys:['due','active'],answeredCount:4,createdAt:fixed});
  assert.equal(due.lastAssignedDate,'2026-09-18');assert.equal(active.lastAssignedDate,'2026-09-18');
  assert.equal(excluded.lastAssignedDate,undefined);
  assert.equal(r.saves,1);
}
{
  const future={status:'pending',priority:'A',next:'2026-09-19'};
  const r=run({entries:[['future',future]],routeYear:2026});
  assert.deepEqual(r.plan,{date:'2026-09-18',goal:70,kind:'waiting',weakKeys:[],createdAt:fixed});
  assert.equal(future.lastAssignedDate,undefined);assert.equal(r.saves,1);
}
{
  const onlyOutside={status:'active',priority:'C'};
  const r=run({entries:[['outside',onlyOutside]],routeYear:2026});
  assert.deepEqual(r.plan,{date:'2026-09-18',goal:70,kind:'route',weakKeys:[],routeYear:2026,createdAt:fixed});
  assert.equal(r.saves,1);
}
{
  const r=run({entries:[],routeYear:null});
  assert.deepEqual(r.plan,{date:'2026-09-18',goal:70,kind:'complete',weakKeys:[],createdAt:fixed});
  assert.equal(r.saves,1);
}
{
  const existing={date:'2026-09-18',goal:70,kind:'weak',weakKeys:['keep'],answeredCount:5,createdAt:'earlier'};
  const weak={status:'active',priority:'A',lastAssignedDate:'unchanged'};
  const r=run({entries:[['new',weak]],validPlan:existing,progress:9,routeYear:2026});
  assert.deepEqual(r.plan,existing);
  assert.equal(weak.lastAssignedDate,'unchanged');
  assert.equal(r.saves,0);
}

console.log('Waseda daily plan construction characterization: CLEAN');
