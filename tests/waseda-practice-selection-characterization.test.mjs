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
const poolSrc=functionSource(app,'poolForWeak');
const lastSrc=functionSource(app,'lastDrillUse');
const lruSrc=functionSource(app,'leastRecentlyUsed');
const reserveSrc=functionSource(app,'ensureConfirmationReserve');
const nextSrc=functionSource(app,'nextDrill');
const startSrc=functionSource(app,'startSkill');

assert.match(startSrc,/families\.size<5/,'five-family start gate changed');
assert.match(startSrc,/w\.status==="pending"&&w\.next>today\(\)/,'future confirmation start gate changed');
assert.match(startSrc,/drillState\?\.key&&drillState\.key!==key/,'cross-weakness unfinished drill guard changed');
assert.match(startSrc,/drillState\?\.key===key&&drillState\.q&&!drillState\.q\.retired/,'same-weakness resume guard changed');
assert.match(nextSrc,/const max=\(w\.streak\|\|0\)>=2\?3:2/,'training level threshold changed');

function familyCount(items){return new Set((items||[]).map(x=>x.familyId)).size}
function baseContext(bank,weak,drillLog=[]){
  const ctx={BANK:plain(bank),S:{weak:{k:plain(weak)},drillLog:plain(drillLog)},familyCount,console};
  ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);
  vm.runInContext(`${poolSrc}\n${lastSrc}\n${lruSrc}\n${reserveSrc}\nglobalThis.api={poolForWeak,leastRecentlyUsed,ensureConfirmationReserve};`,ctx);
  return ctx;
}

// Exact target is used only when it has five distinct families; retired rows never enter the pool.
{
  const bank=[
    ...[1,2,3,4,5].map(i=>({id:`e${i}`,targetId:'t',skill:'s',familyId:`f${i}`})),
    {id:'other',targetId:'x',skill:'s',familyId:'fx'},
    {id:'retired',targetId:'t',skill:'s',familyId:'fr',retired:true}
  ];
  const ctx=baseContext(bank,{targetId:'t',skill:'s'});
  assert.deepEqual(plain(ctx.api.poolForWeak(ctx.S.weak.k).map(x=>x.id)),['e1','e2','e3','e4','e5']);
}
{
  const bank=[
    {id:'e1',targetId:'t',skill:'s',familyId:'f1'},
    {id:'e2',targetId:'t',skill:'s',familyId:'f1'},
    {id:'b2',targetId:'x',skill:'s',familyId:'f2'},
    {id:'b3',targetId:'x',skill:'s',familyId:'f3'},
    {id:'b4',targetId:'x',skill:'s',familyId:'f4'},
    {id:'b5',targetId:'x',skill:'s',familyId:'f5'}
  ];
  const ctx=baseContext(bank,{targetId:'t',skill:'s'});
  assert.deepEqual(plain(ctx.api.poolForWeak(ctx.S.weak.k).map(x=>x.id)),['e1','e2','b2','b3','b4','b5'],'exact target with <5 families must widen to same skill');
}
{
  const bank=[{id:'e1',targetId:'t',skill:'other',familyId:'f1'}];
  const ctx=baseContext(bank,{targetId:'t',skill:'s'});
  assert.deepEqual(plain(ctx.api.poolForWeak(ctx.S.weak.k).map(x=>x.id)),['e1'],'empty broad skill pool must fall back to exact');
}

// Existing confirmation reservations are de-duplicated by ID and family, invalid IDs are dropped,
// and the reservation remains capped at two distinct families.
{
  const pool=[
    {id:'a1',familyId:'fa',focusTag:'f',examFormat:'choice',level:1},
    {id:'a2',familyId:'fa',focusTag:'f',examFormat:'choice',level:3},
    {id:'b1',familyId:'fb',focusTag:'f',examFormat:'choice',level:3},
    {id:'c1',familyId:'fc',focusTag:'other',examFormat:'choice',level:3}
  ];
  const weak={targetId:'t',skill:'s',focusTag:'f',examFormat:'choice',reservedConfirm:['missing','a1','a1','a2','b1','c1'],lastDrillId:null};
  const ctx=baseContext(pool,weak);
  const reserved=plain(ctx.api.ensureConfirmationReserve('k',ctx.S.weak.k,ctx.BANK));
  assert.deepEqual(reserved,['a1','b1']);
  assert.deepEqual(plain(ctx.S.weak.k.reservedConfirm),['a1','b1']);
}

// When filling a reservation, confirmation ranking still prefers matching focus + level 3 + format,
// keeps families distinct, and respects previous-use order as a later tie-break.
{
  const pool=[
    {id:'keep',familyId:'fk',focusTag:'f',examFormat:'choice',level:1},
    {id:'best',familyId:'fb',focusTag:'f',examFormat:'choice',level:3},
    {id:'same-family',familyId:'fk',focusTag:'f',examFormat:'choice',level:3},
    {id:'weaker',familyId:'fw',focusTag:'other',examFormat:'choice',level:3}
  ];
  const weak={targetId:'t',skill:'s',focusTag:'f',examFormat:'choice',reservedConfirm:['keep'],lastDrillId:null};
  const ctx=baseContext(pool,weak);
  assert.deepEqual(plain(ctx.api.ensureConfirmationReserve('k',ctx.S.weak.k,ctx.BANK)),['keep','best']);
}

// Execute nextDrill with deterministic ranking and no choice options so selection semantics are frozen.
function runNext({pool,weak,drillState}){
  let persists=0;
  const ctx={
    S:{weak:{k:plain(weak)},drillLog:[]},
    drillState:plain(drillState),
    poolForWeak:()=>plain(pool),
    ensureConfirmationReserve(_key,w,p){w.reservedConfirm=[...(w.reservedConfirm||[])];return w.reservedConfirm},
    leastRecentlyUsed:(_key,items)=>items,
    persistDrill(){persists++},
    console,Math
  };
  ctx.globalThis=ctx;ctx.window=ctx;vm.createContext(ctx);
  vm.runInContext(`${nextSrc}\nglobalThis.api={nextDrill};`,ctx);
  ctx.api.nextDrill();
  return {state:plain(ctx.drillState),weak:plain(ctx.S.weak.k),persists};
}
{
  const pool=[
    {id:'r1',familyId:'fr1',level:3},{id:'r2',familyId:'fr2',level:3},
    {id:'t1',familyId:'ft1',level:1},{id:'t2',familyId:'ft2',level:2}
  ];
  const r=runNext({pool,weak:{reservedConfirm:['r1','r2'],streak:0,seenDrills:[]},drillState:{key:'k',mode:'confirm',used:['r1']}});
  assert.equal(r.state.q.id,'r2','confirmation must use remaining reserved ID only');
}
{
  const pool=[
    {id:'r1',familyId:'fr',level:3},{id:'same-family',familyId:'fr',level:1},
    {id:'train-low',familyId:'ft',level:2},{id:'train-high',familyId:'fh',level:3}
  ];
  const r=runNext({pool,weak:{reservedConfirm:['r1'],streak:0,seenDrills:[]},drillState:{key:'k',mode:'train',used:[]}});
  assert.equal(r.state.q.id,'train-low','training must exclude reserved family and prefer level <=2 before streak 2');
}
{
  const pool=[
    {id:'r1',familyId:'fr',level:3},{id:'same-family',familyId:'fr',level:1},
    {id:'train',familyId:'ft',level:2}
  ];
  const r=runNext({pool,weak:{reservedConfirm:['r1'],streak:0,seenDrills:['train']},drillState:{key:'k',mode:'train',used:['train']}});
  assert.equal(r.state.q.id,'train','after exhaustion training must still exclude entire reserved families');
  assert.deepEqual(r.state.used,['train']);
}
{
  const pool=[{id:'high',familyId:'fh',level:3}];
  const r=runNext({pool,weak:{reservedConfirm:[],streak:0,seenDrills:[]},drillState:{key:'k',mode:'train',used:[]}});
  assert.equal(r.state.q.id,'high','if no level <=2 candidate exists, training keeps the available higher-level candidate');
}
{
  const pool=[{id:'low',familyId:'fl',level:2},{id:'high',familyId:'fh',level:3}];
  const r=runNext({pool,weak:{reservedConfirm:[],streak:2,seenDrills:[]},drillState:{key:'k',mode:'train',used:[]}});
  assert.equal(r.state.q.id,'low','streak >=2 allows level 3 but does not otherwise change ranking order');
  assert.equal(r.weak.lastDrillId,'low');assert.deepEqual(r.weak.seenDrills,['low']);assert.equal(r.persists,1);
}

console.log('Waseda practice pool / confirmation reservation characterization: CLEAN');
