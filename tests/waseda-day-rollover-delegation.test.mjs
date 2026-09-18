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
assert.match(applySrc,/ENGLISH_ENGINE_CORE\?\.applyDailyRolloverState/);
assert.match(checkSrc,/ENGLISH_ENGINE_CORE\?\.decideDayRollover/);
assert.match(applySrc,/if\(S\.dailyPlan\?\.date!==current\)S\.dailyPlan=null/,'apply fallback missing');
assert.match(checkSrc,/if\(view==="drill"&&drillState&&!drillState\.answered\)/,'check fallback missing');

function make({decision,view='home',drill=null}){
  const calls={decide:[],apply:[],save:0,render:0};
  const state={dailyPlan:{date:'2026-09-17'},dailyProgress:{date:'2026-09-17',answeredCount:5}};
  const ctx={
    S:state,view,drillState:drill,today:()=> '2026-09-18',
    save(){calls.save++},render(){calls.render++},
    ENGLISH_ENGINE_CORE:{
      decideDayRollover(args){calls.decide.push(plain(args));return plain(decision)},
      applyDailyRolloverState(s,current){calls.apply.push({same:s===state,current});s.dailyPlan=null;s.dailyProgress=null;return s}
    }
  };
  ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);
  vm.runInContext(`
let renderedDate='2026-09-17',dayChangePending=false,dayChangeNotice=false,dayChangeAnswerMoved=true;
${applySrc}
${checkSrc}
globalThis.api={checkDayChange,read:()=>({renderedDate,dayChangePending,dayChangeNotice,dayChangeAnswerMoved})};
`,ctx);
  ctx.api.checkDayChange();
  return {ctx,calls,state,flags:plain(ctx.api.read())};
}

{
  const r=make({decision:{kind:'same',notice:false}});
  assert.equal(r.calls.decide.length,1);assert.equal(r.calls.apply.length,0);assert.equal(r.calls.save,0);assert.equal(r.calls.render,0);
  assert.deepEqual(r.calls.decide[0],{renderedDate:'2026-09-17',currentDate:'2026-09-18',isDrillView:false,hasDrill:false,drillAnswered:false});
}
{
  const r=make({decision:{kind:'defer',notice:false},view:'drill',drill:{answered:false}});
  assert.equal(r.flags.dayChangePending,true);assert.equal(r.flags.renderedDate,'2026-09-17');
  assert.equal(r.calls.apply.length,0);assert.equal(r.calls.save,0);assert.equal(r.calls.render,0);
}
{
  const r=make({decision:{kind:'apply',notice:true},view:'drill',drill:{answered:true}});
  assert.equal(r.calls.decide.length,1);assert.equal(r.calls.apply.length,1);
  assert.deepEqual(r.calls.apply[0],{same:true,current:'2026-09-18'});
  assert.equal(r.flags.renderedDate,'2026-09-18');assert.equal(r.flags.dayChangePending,false);
  assert.equal(r.flags.dayChangeNotice,true);assert.equal(r.flags.dayChangeAnswerMoved,false);
  assert.equal(r.state.dailyPlan,null);assert.equal(r.state.dailyProgress,null);
  assert.equal(r.calls.save,1);assert.equal(r.calls.render,1);
}

console.log('Waseda local-day rollover runtime delegation: CLEAN');
