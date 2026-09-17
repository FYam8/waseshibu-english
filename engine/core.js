(function(root){
'use strict';

// Shared English engine helpers extracted under Waseda parity guards.
function localDate(d=new Date()){
  const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}
function plusDays(n,base=new Date()){
  const d=new Date(base.getTime());d.setDate(d.getDate()+Number(n));return localDate(d);
}
function normalizeDrillState(value){
  if(!value||typeof value!=='object')return null;
  const q=value.q||null,
    expected=q?.options?q.options.map((_,i)=>i):[],
    candidate=Array.isArray(value.choiceOrder)?value.choiceOrder:[],
    choiceOrder=candidate.length===expected.length&&new Set(candidate).size===expected.length&&candidate.every(i=>expected.includes(i))?candidate:expected,
    order=Array.isArray(value.order)?value.order:[];
  let orderIndices=Array.isArray(value.orderIndices)?value.orderIndices.filter(i=>Number.isInteger(i)):[];
  if(!orderIndices.length&&order.length&&Array.isArray(value.shuffled)){
    const used=new Set();
    orderIndices=order.map(token=>{
      const index=value.shuffled.findIndex((x,i)=>x===token&&!used.has(i));
      if(index>=0)used.add(index);
      return index;
    }).filter(i=>i>=0);
  }
  return {...value,
    used:Array.isArray(value.used)?value.used:[],
    selectedMany:Array.isArray(value.selectedMany)?value.selectedMany:[],
    order,orderIndices,
    textInputs:Array.isArray(value.textInputs)?value.textInputs:[],
    selfParts:Array.isArray(value.selfParts)?value.selfParts:[],
    selfChecks:Array.isArray(value.selfChecks)?value.selfChecks:[],
    choiceOrder,
    textDraft:value.textDraft||'',
    selfText:value.selfText||''
  };
}
function wordCount(s){return String(s||'').trim()?String(s).trim().split(/\s+/).length:0}
function familyCount(items){return new Set((items||[]).map(x=>x.familyId)).size}
function ensureFamilyIds(items){
  if(!Array.isArray(items))return items;
  items.forEach((q,i)=>{if(!q.familyId)q.familyId=String(q.id||`${q.skill||'skill'}:${q.targetId||'target'}:${i}`)});
  return items;
}
function migrateLearningState(state,{goalTiers,defaultGoal,resolveWeakMeta,validDrillIdsForTarget}={}){
  if(!state||typeof state!=='object')throw new TypeError('state must be an object');
  const tiers=Array.isArray(goalTiers)?goalTiers.map(Number).filter(Number.isFinite):[];
  const fallbackGoal=Number(defaultGoal);
  if(!tiers.length||!Number.isFinite(fallbackGoal)||!tiers.includes(fallbackGoal))throw new TypeError('valid goalTiers/defaultGoal are required');
  if(typeof resolveWeakMeta!=='function')throw new TypeError('resolveWeakMeta must be a function');
  if(typeof validDrillIdsForTarget!=='function')throw new TypeError('validDrillIdsForTarget must be a function');
  state.goal=tiers.includes(Number(state.goal))?Number(state.goal):fallbackGoal;
  state.currentDrill=state.currentDrill&&typeof state.currentDrill==='object'?state.currentDrill:null;
  for(const w of Object.values(state.weak||{})){
    const meta=resolveWeakMeta(w);
    if(meta&&typeof meta==='object')Object.assign(w,meta);
    const ids=validDrillIdsForTarget(w.targetId);
    const valid=new Set(Array.isArray(ids)?ids:ids?Array.from(ids):[]);
    w.reservedConfirm=[...new Set(Array.isArray(w.reservedConfirm)?w.reservedConfirm:[])].filter(id=>valid.has(id)).slice(0,2);
  }
  return state;
}
function advanceRemediationMastery(weak,drill,correct,{today,nextDay,nowIso,trainTarget=3,confirmTarget=2}={}){
  if(!weak||typeof weak!=='object')throw new TypeError('weak must be an object');
  if(!drill||typeof drill!=='object')throw new TypeError('drill must be an object');
  const result={needsConfirmationReserve:false,completedTraining:false,mastered:false};
  if(drill.mode==='train'){
    if(correct)weak.streak=(weak.streak||0)+1;else weak.streak=0;
    if(weak.streak>=trainTarget){
      weak.status='pending';weak.next=nextDay;weak.confirmStreak=0;result.completedTraining=true;
    }
  }else{
    if(correct)weak.confirmStreak=(weak.confirmStreak||0)+1;
    else{
      weak.confirmStreak=0;weak.status='active';weak.streak=0;weak.next=today;weak.reservedConfirm=[];
      drill.mode='train';drill.used=[];drill.failedConfirmation=true;result.needsConfirmationReserve=true;
    }
    if(weak.confirmStreak>=confirmTarget){
      weak.status='mastered';weak.masteredAt=nowIso;weak.last='correct';result.mastered=true;
    }
  }
  return result;
}

const api=Object.freeze({localDate,plusDays,normalizeDrillState,wordCount,familyCount,ensureFamilyIds,migrateLearningState,advanceRemediationMastery});
if(typeof module!=='undefined'&&module.exports)module.exports=api;
root.ENGLISH_ENGINE_CORE=api;
})(typeof globalThis!=='undefined'?globalThis:this);
