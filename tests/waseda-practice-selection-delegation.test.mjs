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
const reserveSrc=functionSource(app,'ensureConfirmationReserve');
const nextSrc=functionSource(app,'nextDrill');
assert.match(poolSrc,/ENGLISH_ENGINE_CORE\?\.selectPracticePool/);
assert.match(reserveSrc,/ENGLISH_ENGINE_CORE\?\.reserveConfirmationIds/);
assert.match(nextSrc,/ENGLISH_ENGINE_CORE\?\.selectNextPracticeQuestion/);
assert.match(poolSrc,/const active=BANK\.filter/,'pool fallback missing');
assert.match(reserveSrc,/const byId=new Map/,'reservation fallback missing');
assert.match(nextSrc,/const reservedFamilies=new Set/,'next-question fallback missing');

{
  const calls=[];
  const bank=[{id:'a'}],weak={targetId:'t',skill:'s'},sharedResult=[{id:'shared'}];
  const ctx={BANK:bank,familyCount:()=>99,ENGLISH_ENGINE_CORE:{selectPracticePool(...args){calls.push(args);return sharedResult}}};
  ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);
  vm.runInContext(`${poolSrc}\nglobalThis.result=poolForWeak(globalThis.weak);`,Object.assign(ctx,{weak}));
  assert.equal(calls.length,1);assert.equal(calls[0][0],bank);assert.equal(calls[0][1],weak);
  assert.deepEqual(plain(calls[0][2]),{minFamilies:5});assert.equal(ctx.result,sharedResult);
}

{
  const calls=[],rankCalls=[];
  const pool=[{id:'a',familyId:'fa'},{id:'b',familyId:'fb'}];
  const weak={reservedConfirm:['old'],lastDrillId:'last',focusTag:'focus',examFormat:'choice'};
  const ctx={
    leastRecentlyUsed(key,items,lastId,w,confirm){rankCalls.push({key,items:plain(items),lastId,w,confirm});return items},
    ENGLISH_ENGINE_CORE:{
      reserveConfirmationIds(args){calls.push(args);args.rankChoices(pool);return ['a','b']}
    }
  };
  ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);
  vm.runInContext(`${reserveSrc}\nglobalThis.result=ensureConfirmationReserve('k',globalThis.weak,globalThis.pool);`,Object.assign(ctx,{weak,pool}));
  assert.equal(calls.length,1);assert.deepEqual(plain(calls[0].currentReserved),['old']);assert.equal(calls[0].pool,pool);assert.equal(calls[0].limit,2);
  assert.deepEqual(plain(ctx.result),['a','b']);assert.deepEqual(plain(weak.reservedConfirm),['a','b']);
  assert.equal(rankCalls.length,1);assert.equal(rankCalls[0].key,'k');assert.equal(rankCalls[0].lastId,'last');assert.equal(rankCalls[0].w,weak);assert.equal(rankCalls[0].confirm,true);
}

{
  const calls=[],rankCalls=[];
  const q={id:'picked',familyId:'fp',level:2};
  const pool=[q,{id:'r1',familyId:'fr',level:3}];
  const weak={streak:1,lastDrillId:'previous',seenDrills:['seen'],reservedConfirm:['r1']};
  const drillState={key:'k',mode:'train',used:['seen'],q:null,error:'old',answered:true,selected:2,selectedMany:[1],order:['x'],orderIndices:[0],textInputs:['a'],selfText:'x',selfParts:['p'],selfChecks:[true],selfcheck:true,aiFeedback:{x:1},aiFeedbackStale:true};
  let persists=0;
  const ctx={
    S:{weak:{k:weak}},
    drillState,
    poolForWeak:()=>pool,
    ensureConfirmationReserve:()=>['r1'],
    leastRecentlyUsed(key,items,lastId,w,confirm){rankCalls.push({key,items:plain(items),lastId,w,confirm});return items},
    persistDrill(){persists++},
    Math,
    ENGLISH_ENGINE_CORE:{
      selectNextPracticeQuestion(args){calls.push(args);args.rankChoices([q],false);return {question:q,usedIds:['seen','picked'],resetUsed:false}}
    }
  };
  ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);
  vm.runInContext(`${nextSrc}\nglobalThis.nextDrill();`,ctx);
  assert.equal(calls.length,1);
  const args=calls[0];assert.equal(args.pool,pool);assert.deepEqual(plain(args.reservedIds),['r1']);assert.deepEqual(plain(args.usedIds),['seen']);assert.equal(args.mode,'train');assert.equal(args.streak,1);
  assert.equal(rankCalls.length,1);assert.equal(rankCalls[0].key,'k');assert.equal(rankCalls[0].lastId,'previous');assert.equal(rankCalls[0].w,weak);assert.equal(rankCalls[0].confirm,false);
  assert.equal(drillState.q,q);assert.deepEqual(plain(drillState.used),['seen','picked']);assert.equal(drillState.error,null);
  assert.equal(weak.lastDrillId,'picked');assert.deepEqual(plain(weak.seenDrills),['seen','picked']);
  assert.equal(drillState.answered,false);assert.equal(drillState.selected,null);assert.deepEqual(plain(drillState.selectedMany),[]);
  assert.deepEqual(plain(drillState.order),[]);assert.deepEqual(plain(drillState.orderIndices),[]);assert.deepEqual(plain(drillState.textInputs),[]);
  assert.equal(drillState.selfText,'');assert.deepEqual(plain(drillState.selfParts),[]);assert.deepEqual(plain(drillState.selfChecks),[]);
  assert.equal(drillState.selfcheck,false);assert.equal(drillState.aiFeedback,null);assert.equal(drillState.aiFeedbackStale,false);assert.equal(persists,1);
}

console.log('Waseda practice selection runtime delegation: CLEAN');
