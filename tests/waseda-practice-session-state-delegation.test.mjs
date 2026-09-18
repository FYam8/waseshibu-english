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
assert.match(startSrc,/ENGLISH_ENGINE_CORE\?\.createPracticeSessionState/);
assert.match(startSrc,/:\{key,skill:w\.skill,targetId:w\.targetId,focusTag:w\.focusTag,mode,/,'new-session legacy fallback missing');
assert.match(nextSrc,/ENGLISH_ENGINE_CORE\?\.applyPracticeQuestionState/);
assert.match(nextSrc,/drillState\.error=null;[\s\S]*?drillState\.choiceOrder=choiceOrder/,'selected-question legacy fallback missing');

{
  const weak={status:'active',skill:'reason',targetId:'t',focusTag:'f'};
  const created={key:'shared',mode:'train',used:[],q:null};
  const calls=[];
  const pool=Array.from({length:5},(_,i)=>({id:`q${i}`,familyId:`f${i}`}));
  const ctx={
    S:{weak:{k:weak},currentSkill:null,lastStartedWeakKey:null},
    drillState:null,
    completedDrillCycle:()=>false,endDrillSession(){},resumeCurrentDrill(){},
    poolForWeak:()=>pool,today:()=> '2026-09-18',skillName:()=> '理由',
    ensureConfirmationReserve(){return []},nextDrill(){},goto(){},alert(){throw new Error('unexpected alert')},
    ENGLISH_ENGINE_CORE:{
      practiceSessionStartDecision:()=>({kind:'start',mode:'train'}),
      createPracticeSessionState(args){calls.push(args);return created}
    }
  };
  ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);
  vm.runInContext(`${startSrc}\nglobalThis.startSkill('k');`,ctx);
  assert.equal(calls.length,1);assert.equal(calls[0].key,'k');assert.equal(calls[0].weak,weak);assert.equal(calls[0].mode,'train');
  assert.equal(ctx.drillState,created);
}

{
  const q={id:'shared-q',options:['A','B','C']},weak={streak:1,lastDrillId:'old',seenDrills:['old'],reservedConfirm:[]};
  const drillState={key:'k',mode:'train',used:['old'],q:null,error:'old',answered:true,selected:2,selectedMany:[1],order:['x'],orderIndices:[0],textInputs:['t'],selfText:'s',selfParts:['p'],selfChecks:[true],selfcheck:true,aiFeedback:{x:1},aiFeedbackStale:true};
  let persists=0;const calls=[];
  const ctx={
    S:{weak:{k:weak}},drillState,Math,
    poolForWeak:()=>[q],ensureConfirmationReserve:()=>[],
    leastRecentlyUsed:(_key,items)=>items,persistDrill(){persists++},
    ENGLISH_ENGINE_CORE:{
      selectNextPracticeQuestion:()=>({question:q,usedIds:['old','shared-q'],resetUsed:false}),
      applyPracticeQuestionState(drill,w,question,args){
        calls.push({drill,w,question,args:plain(args)});
        drill.error=null;drill.q=question;drill.used=[...args.usedIds];w.lastDrillId=question.id;w.seenDrills=[...new Set([...(w.seenDrills||[]),question.id])];
        drill.answered=false;drill.selected=null;drill.selectedMany=[];drill.order=[];drill.orderIndices=[];drill.textInputs=[];drill.selfText='';drill.selfParts=[];drill.selfChecks=[];drill.selfcheck=false;drill.aiFeedback=null;drill.aiFeedbackStale=false;drill.choiceOrder=[...args.choiceOrder];return drill;
      }
    }
  };
  ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);
  vm.runInContext(`${nextSrc}\nglobalThis.nextDrill();`,ctx);
  assert.equal(calls.length,1);assert.equal(calls[0].drill,drillState);assert.equal(calls[0].w,weak);assert.equal(calls[0].question,q);
  assert.deepEqual(calls[0].args.usedIds,['old','shared-q']);assert.deepEqual([...calls[0].args.choiceOrder].sort((a,b)=>a-b),[0,1,2]);
  assert.equal(drillState.q,q);assert.deepEqual(plain(drillState.used),['old','shared-q']);assert.equal(weak.lastDrillId,'shared-q');assert.equal(persists,1);
}

console.log('Waseda practice session state runtime delegation: CLEAN');
