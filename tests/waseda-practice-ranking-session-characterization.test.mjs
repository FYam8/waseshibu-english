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
const lastSrc=functionSource(app,'lastDrillUse');
const rankSrc=functionSource(app,'leastRecentlyUsed');
const startSrc=functionSource(app,'startSkill');

// Ranking weights/order are frozen before extraction.
{
  const ctx={S:{drillLog:[]}};ctx.globalThis=ctx;vm.createContext(ctx);
  vm.runInContext(`${lastSrc}\n${rankSrc}\nglobalThis.api={leastRecentlyUsed};`,ctx);
  const weak={focusTag:'focus',examFormat:'choice'};
  const items=[
    {id:'neutral',focusTag:'other',examFormat:'other',level:1},
    {id:'format',focusTag:'other',examFormat:'choice',level:1},
    {id:'focus',focusTag:'focus',examFormat:'other',level:1},
    {id:'focus-format',focusTag:'focus',examFormat:'choice',level:1},
    {id:'focus-level3-format',focusTag:'focus',examFormat:'choice',level:3}
  ];
  assert.deepEqual(plain(ctx.api.leastRecentlyUsed('k',items,null,weak,false).map(x=>x.id)),[
    'focus-format','focus-level3-format','focus','format','neutral'
  ],'level 3 bonus must apply only during confirmation');
  assert.deepEqual(plain(ctx.api.leastRecentlyUsed('k',items,null,weak,true).map(x=>x.id)),[
    'focus-level3-format','focus-format','focus','format','neutral'
  ],'confirmation must prefer matching level 3 after focus weight');
}
{
  const ctx={S:{drillLog:[
    {key:'k',q:'old',at:'1'},
    {key:'k',q:'recent',at:'2'},
    {key:'other',q:'ignored',at:'3'}
  ]}};ctx.globalThis=ctx;vm.createContext(ctx);
  vm.runInContext(`${lastSrc}\n${rankSrc}\nglobalThis.api={leastRecentlyUsed};`,ctx);
  const weak={focusTag:'same',examFormat:'same'},items=['old','recent','never','last'].map(id=>({id,focusTag:'same',examFormat:'same',level:1}));
  assert.deepEqual(plain(ctx.api.leastRecentlyUsed('k',items,'last',weak,false).map(x=>x.id)),[
    'never','old','recent','last'
  ],'never-used then least-recently-used then immediate-last penalty ordering changed');
}

// Session-start gates are frozen separately from UI text.
function runStart({weak,currentDrill=null,families=5,completed=false,currentWeakStatus=null}={}){
  const alerts=[],calls={end:0,resume:0,pool:0,reserve:0,next:0,goto:[]};
  const pool=Array.from({length:families},(_,i)=>({id:`q${i}`,familyId:`f${i}`}));
  const stateWeak={k:plain(weak)};
  if(currentDrill?.key&&currentDrill.key!=='k')stateWeak[currentDrill.key]={status:currentWeakStatus||'active'};
  if(currentDrill?.key==='k'&&currentWeakStatus)stateWeak.k.status=currentWeakStatus;
  const ctx={
    S:{weak:stateWeak,currentDrill:currentDrill?plain(currentDrill):null,currentSkill:null,lastStartedWeakKey:null},
    drillState:currentDrill?plain(currentDrill):null,
    completedDrillCycle:()=>completed,
    endDrillSession(){calls.end++;ctx.drillState=null;ctx.S.currentDrill=null;ctx.S.currentSkill=null},
    resumeCurrentDrill(){calls.resume++;return 'resume'},
    poolForWeak(){calls.pool++;return pool},
    skillName:()=> '理由',
    today:()=> '2026-09-18',
    ensureConfirmationReserve(){calls.reserve++;return ['q0','q1']},
    nextDrill(){calls.next++},
    goto(v){calls.goto.push(v)},
    alert(msg){alerts.push(msg)},
    Set
  };
  ctx.globalThis=ctx;ctx.window=ctx;vm.createContext(ctx);
  vm.runInContext(`${startSrc}\nglobalThis.api={startSkill};`,ctx);
  ctx.api.startSkill('k');
  return {ctx,calls,alerts};
}
{
  const r=runStart({weak:{status:'active',skill:'reason'},currentDrill:{key:'k',q:{id:'same'},mode:'train',used:[]}});
  assert.equal(r.calls.resume,1);assert.equal(r.calls.pool,0);assert.equal(r.alerts.length,0);
}
{
  const r=runStart({weak:{status:'active',skill:'reason'},currentDrill:{key:'other',q:{id:'other'},mode:'train',used:[]}});
  assert.equal(r.calls.resume,0);assert.equal(r.calls.pool,0);assert.match(r.alerts[0],/別の克服ドリルが途中/);
}
{
  const r=runStart({weak:{status:'active',skill:'reason'},families:4});
  assert.equal(r.calls.pool,1);assert.equal(r.calls.reserve,0);assert.match(r.alerts[0],/現在4系統/);assert.match(r.alerts[0],/即時3問＋翌日2問/);
}
{
  const r=runStart({weak:{status:'pending',skill:'reason',next:'2026-09-19'},families:5});
  assert.equal(r.calls.reserve,0);assert.match(r.alerts[0],/予定日は 2026-09-19/);assert.match(r.alerts[0],/予定日までは開始できません/);
}
{
  const r=runStart({weak:{status:'active',skill:'reason',targetId:'t',focusTag:'f'},families:5});
  assert.equal(r.calls.reserve,1);assert.equal(r.calls.next,1);assert.deepEqual(r.calls.goto,['drill']);
  assert.equal(r.ctx.S.currentSkill,'k');assert.equal(r.ctx.S.lastStartedWeakKey,'k');assert.equal(r.ctx.drillState.mode,'train');assert.deepEqual(plain(r.ctx.drillState.used),[]);
}
{
  const r=runStart({weak:{status:'pending',skill:'reason',targetId:'t',focusTag:'f',next:'2026-09-18'},families:5});
  assert.equal(r.calls.reserve,1);assert.equal(r.calls.next,1);assert.equal(r.ctx.drillState.mode,'confirm');
}
{
  const r=runStart({weak:{status:'active',skill:'reason'},currentDrill:{key:'old',q:{id:'old'},mode:'train'},families:5,completed:true});
  assert.equal(r.calls.end,1,'completed cycle must be ended before evaluating the new session');
  assert.equal(r.calls.pool,1);assert.equal(r.calls.next,1);
}

console.log('Waseda practice ranking / session-start characterization: CLEAN');
