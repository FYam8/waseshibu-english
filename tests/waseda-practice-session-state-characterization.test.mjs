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

const app=read('app.js'),startSrc=functionSource(app,'startSkill'),nextSrc=functionSource(app,'nextDrill');

// Capture the exact new-session state before nextDrill mutates it.
function captureStart(mode){
  const weak={status:mode==='confirm'?'pending':'active',skill:'reason',targetId:'target',focusTag:'focus',next:'2026-09-18'};
  let captured=null;
  const pool=Array.from({length:5},(_,i)=>({id:`q${i}`,familyId:`f${i}`}));
  const ctx={
    S:{weak:{k:weak},currentSkill:null,lastStartedWeakKey:null},
    drillState:null,
    completedDrillCycle:()=>false,endDrillSession(){},resumeCurrentDrill(){},
    poolForWeak:()=>pool,today:()=> '2026-09-18',skillName:()=> '理由',
    ensureConfirmationReserve(){return []},
    nextDrill(){captured=plain(ctx.drillState)},
    goto(){},alert(){throw new Error('unexpected alert')},
    ENGLISH_ENGINE_CORE:{practiceSessionStartDecision:()=>({kind:'start',mode})}
  };
  ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);
  vm.runInContext(`${startSrc}\nglobalThis.api={startSkill};`,ctx);ctx.api.startSkill('k');
  return {captured,ctx};
}
for(const mode of ['train','confirm']){
  const {captured,ctx}=captureStart(mode);
  assert.deepEqual(captured,{
    key:'k',skill:'reason',targetId:'target',focusTag:'focus',mode,used:[],q:null,error:null,answered:false,
    selected:null,selectedMany:[],order:[],orderIndices:[],textInputs:[],selfText:'',selfParts:[],selfChecks:[]
  });
  assert.equal(ctx.S.currentSkill,'k');assert.equal(ctx.S.lastStartedWeakKey,'k');
}

// Capture deterministic reset/application when a question is selected.
// Random option order is intentionally app-owned, so only permutation validity is frozen here.
{
  const q={id:'q-new',familyId:'f-new',level:2,options:['A','B','C']};
  const weak={streak:1,lastDrillId:'old',seenDrills:['seen'],reservedConfirm:[]};
  const drillState={
    key:'k',mode:'train',used:['old'],q:{id:'old'},error:'old error',answered:true,selected:2,selectedMany:[1],
    order:['x'],orderIndices:[0],textInputs:['text'],selfText:'self',selfParts:['part'],selfChecks:[true],
    selfcheck:true,aiFeedback:{feedback:true},aiFeedbackStale:true,choiceOrder:[2,1,0]
  };
  let persisted=0;
  const ctx={
    S:{weak:{k:weak}},drillState,
    poolForWeak:()=>[q],ensureConfirmationReserve:()=>[],
    leastRecentlyUsed:(_k,items)=>items,
    persistDrill(){persisted++},
    Math,
    ENGLISH_ENGINE_CORE:{
      selectNextPracticeQuestion:()=>({question:q,usedIds:['old','q-new'],resetUsed:false})
    }
  };
  ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);
  vm.runInContext(`${nextSrc}\nglobalThis.nextDrill();`,ctx);
  assert.equal(drillState.q,q);assert.equal(drillState.error,null);assert.deepEqual(plain(drillState.used),['old','q-new']);
  assert.equal(weak.lastDrillId,'q-new');assert.deepEqual(plain(weak.seenDrills),['seen','q-new']);
  assert.equal(drillState.answered,false);assert.equal(drillState.selected,null);assert.deepEqual(plain(drillState.selectedMany),[]);
  assert.deepEqual(plain(drillState.order),[]);assert.deepEqual(plain(drillState.orderIndices),[]);assert.deepEqual(plain(drillState.textInputs),[]);
  assert.equal(drillState.selfText,'');assert.deepEqual(plain(drillState.selfParts),[]);assert.deepEqual(plain(drillState.selfChecks),[]);
  assert.equal(drillState.selfcheck,false);assert.equal(drillState.aiFeedback,null);assert.equal(drillState.aiFeedbackStale,false);
  assert.deepEqual([...drillState.choiceOrder].sort((a,b)=>a-b),[0,1,2]);assert.equal(new Set(drillState.choiceOrder).size,3);
  assert.equal(persisted,1);
}

console.log('Waseda practice session state characterization: CLEAN');
