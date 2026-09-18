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
const rankSrc=functionSource(app,'leastRecentlyUsed');
const startSrc=functionSource(app,'startSkill');
assert.match(rankSrc,/ENGLISH_ENGINE_CORE\?\.rankPracticeQuestions/);
assert.match(rankSrc,/return \[\.\.\.items\]\.sort/,'ranking legacy fallback missing');
assert.match(startSrc,/ENGLISH_ENGINE_CORE\?\.practiceSessionStartDecision/);
assert.match(startSrc,/families\.size<5/,'session readiness legacy family fallback missing');
assert.match(startSrc,/w\.status==="pending"&&w\.next>today\(\)/,'session readiness legacy due-date fallback missing');
assert.match(startSrc,/drillState\?\.key===key&&drillState\.q&&!drillState\.q\.retired/,'same-key resume must remain app-owned');
assert.match(startSrc,/drillState\?\.key&&drillState\.key!==key/,'cross-key blocking must remain app-owned');

{
  const calls=[],useCalls=[];
  const items=[{id:'a'},{id:'b'}],weak={focusTag:'f',examFormat:'choice'},result=[items[1],items[0]];
  const ctx={
    lastDrillUse(key,id){useCalls.push([key,id]);return id==='a'?1:2},
    ENGLISH_ENGINE_CORE:{
      rankPracticeQuestions(got,args){calls.push({got,args});args.lastUse('a');return result}
    }
  };
  ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);
  vm.runInContext(`${rankSrc}\nglobalThis.result=leastRecentlyUsed('wk',globalThis.items,'a',globalThis.weak,true);`,Object.assign(ctx,{items,weak}));
  assert.equal(calls.length,1);assert.equal(calls[0].got,items);assert.equal(calls[0].args.weak,weak);
  assert.equal(calls[0].args.lastId,'a');assert.equal(calls[0].args.confirm,true);
  assert.deepEqual(useCalls,[['wk','a']]);assert.equal(ctx.result,result);
}

function runStart({weak,currentDrill=null,families=5,decision}={}){
  const calls={decision:[],resume:0,pool:0,reserve:0,next:0,goto:[]},alerts=[];
  const pool=Array.from({length:families},(_,i)=>({id:`q${i}`,familyId:`f${i}`}));
  const weakMap={k:weak};
  if(currentDrill?.key&&currentDrill.key!=='k')weakMap[currentDrill.key]={status:'active'};
  const ctx={
    S:{weak:weakMap,currentSkill:null,lastStartedWeakKey:null,currentDrill},
    drillState:currentDrill,
    completedDrillCycle:()=>false,endDrillSession(){},
    resumeCurrentDrill(){calls.resume++},
    poolForWeak(){calls.pool++;return pool},
    today:()=> '2026-09-18',skillName:()=> '理由',
    ensureConfirmationReserve(){calls.reserve++;return []},
    nextDrill(){calls.next++},goto(v){calls.goto.push(v)},alert(m){alerts.push(m)},
    ENGLISH_ENGINE_CORE:{
      practiceSessionStartDecision(args){calls.decision.push(args);return typeof decision==='function'?decision(args):decision}
    }
  };
  ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);
  vm.runInContext(`${startSrc}\nglobalThis.api={startSkill};`,ctx);
  ctx.api.startSkill('k');
  return {ctx,calls,alerts};
}

{
  const r=runStart({weak:{status:'active',skill:'reason'},currentDrill:{key:'k',q:{id:'same'}} ,decision:{kind:'start',mode:'train'}});
  assert.equal(r.calls.resume,1);assert.equal(r.calls.pool,0);assert.equal(r.calls.decision.length,0,'same-key resume must short-circuit before shared readiness');
}
{
  const r=runStart({weak:{status:'active',skill:'reason'},currentDrill:{key:'other',q:{id:'other'}},decision:{kind:'start',mode:'train'}});
  assert.equal(r.calls.pool,0);assert.equal(r.calls.decision.length,0);assert.match(r.alerts[0],/別の克服ドリルが途中/);
}
{
  const r=runStart({weak:{status:'active',skill:'reason'},families:4,decision:args=>({kind:'insufficient-families',familyTotal:args.familyTotal,minFamilies:5})});
  assert.equal(r.calls.pool,1);assert.equal(r.calls.decision.length,1);assert.equal(r.calls.decision[0].familyTotal,4);assert.equal(r.calls.decision[0].today,'2026-09-18');
  assert.match(r.alerts[0],/現在4系統/);assert.equal(r.calls.reserve,0);
}
{
  const r=runStart({weak:{status:'pending',skill:'reason',next:'2026-09-19'},families:5,decision:{kind:'too-early',date:'2026-09-19'}});
  assert.match(r.alerts[0],/2026-09-19/);assert.equal(r.calls.reserve,0);
}
{
  const weak={status:'pending',skill:'reason',targetId:'t',focusTag:'f',next:'2026-09-18'};
  const r=runStart({weak,families:5,decision:{kind:'start',mode:'confirm'}});
  assert.equal(r.calls.reserve,1);assert.equal(r.calls.next,1);assert.deepEqual(r.calls.goto,['drill']);
  assert.equal(r.ctx.drillState.mode,'confirm');assert.equal(r.ctx.S.currentSkill,'k');assert.equal(r.ctx.S.lastStartedWeakKey,'k');
}

console.log('Waseda practice ranking / session readiness runtime delegation: CLEAN');
