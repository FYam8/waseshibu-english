(function(root){
'use strict';

// Gate 2 shadow extraction: these helpers are not wired into production yet.
// They mirror current Waseda behavior so parity can be proven before app.js delegates to them.
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

const api=Object.freeze({localDate,plusDays,normalizeDrillState,wordCount,familyCount});
if(typeof module!=='undefined'&&module.exports)module.exports=api;
root.ENGLISH_ENGINE_CORE=api;
})(typeof globalThis!=='undefined'?globalThis:this);
