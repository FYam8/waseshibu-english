import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

function read(path){return fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8')}
function plain(v){return JSON.parse(JSON.stringify(v))}
const ctx={};ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);vm.runInContext(read('engine/core.js'),ctx,{filename:'engine/core.js'});
const core=ctx.ENGLISH_ENGINE_CORE;
for(const name of ['isExamAttemptComparable','interruptExamAttempt','scoreObjectiveQuestion','buildWrongWeaknessState','markWeaknessesActuallyCorrect']){
  assert.equal(typeof core?.[name],'function',`missing ${name}`);
}

function legacyComparable(a){return a?.exposure==='first'&&a?.mode==='timed'&&!a?.interrupted&&!a?.overtime}
for(const attempt of [
  {exposure:'first',mode:'timed',interrupted:false,overtime:false},
  {exposure:'first',mode:'timed',interrupted:true,overtime:false},
  {exposure:'first',mode:'untimed',interrupted:false,overtime:false},
  {exposure:'done',mode:'timed',interrupted:false,overtime:false},
  null
])assert.equal(core.isExamAttemptComparable(plain(attempt)),!!legacyComparable(attempt));

{
  const a={id:'a',mode:'timed',interrupted:false,custom:'keep'};
  const result=core.interruptExamAttempt(a);
  assert.equal(result,a);assert.deepEqual(plain(a),{id:'a',mode:'untimed',interrupted:true,custom:'keep'});
  assert.equal(core.interruptExamAttempt(null),null);
}

const normalize=s=>String(s||'').trim().replace(/\s+/g,'').replace(/，/g,',').toLowerCase();
const match=(q,a)=>{
  const x=normalize(a),z=normalize(q.answer);
  if(q.type==='text'){if(z==='peanut(s)')return ['peanut','peanuts'].includes(x);return x===z}
  if(q.type==='multi')return x.split(',').filter(Boolean).sort().join(',')===z.split(',').filter(Boolean).sort().join(',');
  return x===z;
};
function legacyScore(q,a){
  if(q.type==='multi'){
    const chosen=new Set(normalize(a).split(',').filter(Boolean)),correct=normalize(q.answer).split(',').filter(Boolean),unit=q.points/correct.length;
    return correct.reduce((sum,x)=>sum+(chosen.has(x)?unit:0),0);
  }
  return match(q,a)?q.points:0;
}
for(const fixture of [
  [{type:'choice',answer:'ア',points:5},'ア'],
  [{type:'choice',answer:'ア',points:5},'イ'],
  [{type:'text',answer:'peanut(s)',points:4},'peanuts'],
  [{type:'multi',answer:'ア,ウ',points:6},'ア,ウ'],
  [{type:'multi',answer:'ア,ウ',points:6},'ア,イ'],
  [{type:'multi',answer:'ア,ウ',points:6},'ア,ウ,エ']
]){
  const [q,a]=fixture;
  assert.equal(core.scoreObjectiveQuestion(plain(q),a,{normalize,matchAnswer:match}),legacyScore(q,a),JSON.stringify(fixture));
}
assert.throws(()=>core.scoreObjectiveQuestion(null,'a',{normalize,matchAnswer:match}),/question must be an object/);
assert.throws(()=>core.scoreObjectiveQuestion({type:'multi',answer:'a',points:1},'a',{normalize:null}),/normalize must be a function/);
assert.throws(()=>core.scoreObjectiveQuestion({type:'choice',answer:'a',points:1},'a',{normalize,matchAnswer:null}),/matchAnswer must be a function/);

function legacyWeak(old,{year,id,label,category,component='main',skill,targetId,focusTag,examFormat,trap,priority,points,user,today,manualComponents=[]}){
  return {...old,year:Number(year),id,label,category,component,skill,targetId,focusTag,examFormat,trap,priority,points,user,last:'wrong',status:'active',streak:0,confirmStreak:0,next:today,wrongCount:(old.wrongCount||0)+1,reservedConfirm:[],seenDrills:old.seenDrills||[],manualComponents:manualComponents.length?[...new Set(manualComponents)]:old.manualComponents||[]};
}
const old={status:'mastered',streak:3,confirmStreak:2,wrongCount:2,reservedConfirm:['r'],seenDrills:['d'],manualComponents:['old'],extra:'keep'};
const args={year:2024,id:'q',label:'Q',category:'文脈',component:'main',skill:'reason',targetId:'t',focusTag:'f',examFormat:'choice',trap:'x',priority:'A',points:5,user:'イ',today:'2026-09-18',manualComponents:[]};
assert.deepEqual(plain(core.buildWrongWeaknessState(plain(old),plain(args))),legacyWeak(plain(old),plain(args)));
const manualArgs={...args,component:'grammar',category:'英作文：grammar',focusTag:'manual:summary:grammar',trap:'grammar',manualComponents:['grammar','logic','grammar']};
assert.deepEqual(plain(core.buildWrongWeaknessState({},plain(manualArgs))),legacyWeak({},plain(manualArgs)));

{
  const rows=[
    {year:2024,id:'q',component:'main',status:'active',actualCorrect:1,user:'old',last:'wrong'},
    {year:2024,id:'q',component:'x',status:'pending',actualCorrect:0,user:'old2',last:'wrong'},
    {year:2023,id:'q',actualCorrect:7},
    {year:2024,id:'other',actualCorrect:9}
  ];
  const returned=core.markWeaknessesActuallyCorrect(rows,{year:2024,id:'q',user:'ア'});
  assert.equal(returned,rows);
  assert.deepEqual(plain(rows),[
    {year:2024,id:'q',component:'main',status:'active',actualCorrect:2,user:'ア',last:'correct'},
    {year:2024,id:'q',component:'x',status:'pending',actualCorrect:1,user:'ア',last:'correct'},
    {year:2023,id:'q',actualCorrect:7},
    {year:2024,id:'other',actualCorrect:9}
  ]);
}

console.log('shared exam attempt/scoring/weakness parity: CLEAN');
