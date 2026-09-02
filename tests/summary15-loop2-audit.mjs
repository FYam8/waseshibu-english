
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const scripts=[...html.matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]);

function storage(initial={}){
  const values=new Map(Object.entries(initial));
  return {get length(){return values.size}, key:i=>[...values.keys()][i]??null, getItem:k=>values.has(k)?values.get(k):null, setItem:(k,v)=>values.set(k,String(v)), removeItem:k=>values.delete(k)};
}
const dummyEl={innerHTML:'',textContent:'',value:'',className:'',style:{},dataset:{},classList:{add(){},remove(){},toggle(){}},appendChild(){},addEventListener(){},querySelector(){return dummyEl},querySelectorAll(){return []},closest(){return null}};
const ctx={
  console,
  window:null,
  document:{getElementById(){return dummyEl},querySelector(){return dummyEl},querySelectorAll(){return []},createElement(){return dummyEl},addEventListener(){},body:dummyEl},
  localStorage:storage(),
  navigator:{},
  location:{hash:''},
  addEventListener(){},
  removeEventListener(){},
  setTimeout(){},
  clearTimeout(){},
};
ctx.window=ctx;
vm.createContext(ctx);
for (const s of scripts){
  const file=path.join(root,s);
  if(!fs.existsSync(file)) throw new Error(`script missing: ${s}`);
  vm.runInContext(fs.readFileSync(file,'utf8'),ctx,{filename:s});
}
const drills=ctx.DRILLS||[];
const active=drills.filter(q=>!q.retired);
assert.equal(active.length,283,'active count must remain 283');
const retired=drills.filter(q=>q.retired);
const summary=active.filter(q=>q.skill==='summary');
assert.equal(summary.length,15,'active summary must be 15');
const expected=[...Array(15)].map((_,i)=>`lsu${String(i+26).padStart(2,'0')}`);
assert.equal(JSON.stringify(summary.map(q=>q.id).sort()), JSON.stringify(expected.sort()), 'summary ids must be lsu26-lsu40');
const oldIds=["nsu01","nsu02","nsu03","nsu04","nsu05","lsu01","lsu02","lsu03","lsu04","lsu05","lsu06","lsu07","lsu08","lsu09","lsu10"];
for(const id of oldIds){
  const q=drills.find(x=>x.id===id);
  assert(q && q.retired===true, `${id} must be retired`);
  assert(q.legacyCompletion===true, `${id} must preserve legacyCompletion`);
}
for(const q of summary){
  assert.equal(q.type,'selfcheck');
  assert(q.prompt.includes('【オリジナル類題'), `${q.id} must identify original drill`);
  assert(q.prompt.includes('次の英文を要約しなさい'), `${q.id} must use official-like summary instruction`);
  assert(q.maxWords===40 || q.maxWords===50, `${q.id} maxWords must be 40 or 50`);
  const body=q.prompt.split('\n').slice(1).join(' ');
  const wc=body.trim().split(/\s+/).filter(Boolean).length;
  assert(wc>=150, `${q.id} source body too short for loop4 load check: ${wc}`);
  for(const label of ['【語数】','【設問条件】','【過去問比較】','【残す要点】','【削る情報】','【構成】','【答案例】','【合格戦略】']){
    assert(q.explanation.includes(label), `${q.id} missing explanation label ${label}`);
  }
  assert(!/要約：[^A-Za-z]*$/.test(q.prompt), `${q.id} must not be a Japanese already-summary translation task`);
}
console.log('summary15-loop2-audit superseded-by-loop4 compatible CLEAN');
