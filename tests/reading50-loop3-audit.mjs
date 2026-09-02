
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const scripts=[...html.matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]);
function storage(){const values=new Map(); return {get length(){return values.size}, key:i=>[...values.keys()][i]??null, getItem:k=>values.has(k)?values.get(k):null, setItem:(k,v)=>values.set(k,String(v)), removeItem:k=>values.delete(k)};}
const dummy={innerHTML:'',textContent:'',value:'',className:'',style:{},dataset:{},classList:{add(){},remove(){},toggle(){}},appendChild(){},addEventListener(){},querySelector(){return dummy},querySelectorAll(){return[]},closest(){return null}};
const ctx={console,window:null,document:{getElementById(){return dummy},querySelector(){return dummy},querySelectorAll(){return[]},createElement(){return dummy},addEventListener(){},body:dummy},localStorage:storage(),navigator:{},location:{hash:''},addEventListener(){},removeEventListener(){},setTimeout(){},clearTimeout(){}};
ctx.window=ctx; vm.createContext(ctx);
for(const s of scripts){vm.runInContext(fs.readFileSync(path.join(root,s),'utf8'),ctx,{filename:s});}
const drills=ctx.DRILLS||[];
const active=drills.filter(q=>!q.retired);
const retired=drills.filter(q=>q.retired);
assert.equal(active.length,283);
assert.equal(active.length,283); assert(retired.length>=191);
const connector=active.filter(q=>q.skill==='connector');
assert.equal(connector.length,11);
assert.equal(JSON.stringify(connector.map(q=>q.id).sort()), JSON.stringify(['lco20','lco21','lco22','lco23','lco24','lco25','lco26','lco27','lco28','lco29','lco30'].sort()));
const ansCounts=connector.reduce((a,q)=>{a[q.answer]=(a[q.answer]||0)+1; return a;},{});
assert(Object.keys(ansCounts).length===4, 'connector answers must use all four option positions');
assert(Math.max(...Object.values(ansCounts))-Math.min(...Object.values(ansCounts))<=1, 'connector answer positions must be balanced');
for(const q of connector){
  assert.deepEqual([...q.options].sort(), ['As a result','For example','However','In other words'].sort(), `${q.id} options must be core past-paper connector set`);
  for(const label of ['【正解】','【設問和訳】','【根拠英文】','【根拠英文和訳】','【なぜ正解か】']) assert(q.explanation.includes(label), `${q.id} missing ${label}`);
}
for(const id of ['lco01','lco02','lco03','lco12','lco13','lco14','lco15','lco16','lco17','lco18','lco19','lin02','lin04','lin05','lin12']){
  const q=drills.find(x=>x.id===id);
  assert(q?.retired===true, `${id} must be retired`);
  assert(q?.legacyCompletion===true, `${id} must preserve legacyCompletion`);
}
const insertion=active.filter(q=>q.skill==='insertion');
assert.equal(insertion.length,14);
const iCounts=insertion.reduce((a,q)=>{a[q.answer]=(a[q.answer]||0)+1; return a;},{});
assert(iCounts[3]>=4, 'insertion must include final-position answers after loop3');
for(const id of ['lin15','lin16','lin17','lin18']){
  const q=active.find(x=>x.id===id);
  assert(q, `${id} must be active`);
  assert.equal(q.answer,3, `${id} must use [4] as correct position`);
  assert(q.explanation.includes('【根拠英文和訳】') && /[\u3040-\u30ff\u4e00-\u9fff]/.test(q.explanation), `${id} must include Japanese evidence translation`);
}
assert.equal(active.filter(q=>q.skill==='content_match').length,16);
assert.equal(active.filter(q=>q.skill==='reference').length,9);
console.log(JSON.stringify({active:active.length, retired:retired.length, connector:connector.length, insertion:insertion.length, connectorAnswerCounts:ansCounts, insertionAnswerCounts:iCounts}, null, 2));
