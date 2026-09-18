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

const app=read('app.js');
const applySrc=functionSource(app,'applyDayChange');
const checkSrc=functionSource(app,'checkDayChange');

function run({rendered='2026-09-17',current='2026-09-18',view='home',drill=null,planDate='2026-09-17',progressDate='2026-09-17'}={}){
  const calls={save:0,render:0};
  const state={
    dailyPlan:planDate===null?null:{date:planDate,kind:'weak',keep:'plan'},
    dailyProgress:progressDate===null?null:{date:progressDate,answeredCount:6,keep:'progress'}
  };
  const ctx={S:state,view,drillState:drill,today:()=>current,save(){calls.save++},render(){calls.render++}};
  ctx.globalThis=ctx;vm.createContext(ctx);
  vm.runInContext(`
let renderedDate=${JSON.stringify(rendered)},dayChangePending=false,dayChangeNotice=false,dayChangeAnswerMoved=true;
${applySrc}
${checkSrc}
globalThis.api={
  checkDayChange,applyDayChange,
  read:()=>({renderedDate,dayChangePending,dayChangeNotice,dayChangeAnswerMoved})
};
`,ctx);
  ctx.api.checkDayChange();
  return {state:plain(state),flags:plain(ctx.api.read()),calls};
}

// Same local day is a strict no-op.
{
  const r=run({rendered:'2026-09-18',current:'2026-09-18'});
  assert.equal(r.calls.save,0);assert.equal(r.calls.render,0);
  assert.equal(r.flags.renderedDate,'2026-09-18');assert.equal(r.flags.dayChangePending,false);
  assert.equal(r.state.dailyPlan.date,'2026-09-17');assert.equal(r.state.dailyProgress.date,'2026-09-17');
}

// An unanswered drill defers rollover entirely to protect the in-progress answer.
{
  const r=run({view:'drill',drill:{answered:false,q:{id:'d1'}}});
  assert.equal(r.flags.dayChangePending,true);
  assert.equal(r.flags.renderedDate,'2026-09-17');
  assert.equal(r.calls.save,0);assert.equal(r.calls.render,0);
  assert.equal(r.state.dailyPlan.date,'2026-09-17');assert.equal(r.state.dailyProgress.date,'2026-09-17');
}

// An answered drill applies the new day, keeps a drill-view notice, and clears stale daily state.
{
  const r=run({view:'drill',drill:{answered:true,q:{id:'d1'}}});
  assert.equal(r.flags.renderedDate,'2026-09-18');assert.equal(r.flags.dayChangePending,false);
  assert.equal(r.flags.dayChangeNotice,true);assert.equal(r.flags.dayChangeAnswerMoved,false);
  assert.equal(r.state.dailyPlan,null);assert.equal(r.state.dailyProgress,null);
  assert.equal(r.calls.save,1);assert.equal(r.calls.render,1);
}

// Outside the drill view, rollover applies with no drill-specific notice.
{
  const r=run({view:'home',drill:{answered:true}});
  assert.equal(r.flags.renderedDate,'2026-09-18');assert.equal(r.flags.dayChangeNotice,false);assert.equal(r.flags.dayChangeAnswerMoved,false);
  assert.equal(r.state.dailyPlan,null);assert.equal(r.state.dailyProgress,null);
  assert.equal(r.calls.save,1);assert.equal(r.calls.render,1);
}

// Same-day plan/progress survive an applied rollover.
{
  const r=run({view:'home',planDate:'2026-09-18',progressDate:'2026-09-18'});
  assert.deepEqual(r.state.dailyPlan,{date:'2026-09-18',kind:'weak',keep:'plan'});
  assert.deepEqual(r.state.dailyProgress,{date:'2026-09-18',answeredCount:6,keep:'progress'});
  assert.equal(r.calls.save,1);assert.equal(r.calls.render,1);
}

console.log('Waseda local-day rollover characterization: CLEAN');
