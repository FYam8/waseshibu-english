
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const scripts=[...html.matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]);
function storage(){const values=new Map(); return {get length(){return values.size}, key:i=>[...values.keys()][i]??null, getItem:k=>values.has(k)?values.get(k):null, setItem:(k,v)=>values.set(k,String(v)), removeItem:k=>values.delete(k)};}
const dummy={innerHTML:'',textContent:'',value:'',className:'',style:{},dataset:{},classList:{add(){},remove(){},toggle(){}},appendChild(){},addEventListener(){},querySelector(){return dummy},querySelectorAll(){return []},closest(){return null}};
const ctx={console,window:null,document:{getElementById(){return dummy},querySelector(){return dummy},querySelectorAll(){return []},createElement(){return dummy},addEventListener(){},body:dummy},localStorage:storage(),navigator:{},location:{hash:''},addEventListener(){},removeEventListener(){},setTimeout(){},clearTimeout(){}};
ctx.window=ctx; vm.createContext(ctx);
for(const s of scripts){const p=path.join(root,s); if(!fs.existsSync(p)) throw new Error(`missing script ${s}`); vm.runInContext(fs.readFileSync(p,'utf8'),ctx,{filename:s});}
const drills=ctx.DRILLS||[];
const active=drills.filter(q=>!q.retired);
assert.equal(active.length,283, 'active drills must remain 283');
assert.equal(active.filter(q=>q.skill==='summary').length,15, 'active summary must be 15');
const expected=[...Array(15)].map((_,i)=>`lsu${String(i+26).padStart(2,'0')}`);
assert.equal(JSON.stringify(active.filter(q=>q.skill==='summary').map(q=>q.id).sort()), JSON.stringify(expected.sort()));
for(let i=11;i<=25;i++){const q=drills.find(x=>x.id===`lsu${String(i).padStart(2,'0')}`); assert.equal(q?.retired,true, `${q?.id} must be retired`);}
for(const q of active.filter(q=>q.skill==='summary')){
  assert.equal(q.type,'selfcheck');
  assert.equal(q.originalDrill,true);
  assert.ok([40,50].includes(q.maxWords), `${q.id} maxWords`);
  const body=(q.prompt.split('\n').slice(1).join(' ')||'').trim();
  const wc=body.split(/\s+/).filter(Boolean).length;
  if(q.maxWords===40) assert.ok(wc>=150 && wc<=210, `${q.id} 2022 body wc ${wc}`);
  if(q.maxWords===50) assert.ok(wc>=170 && wc<=230, `${q.id} 2023 body wc ${wc}`);
  for(const label of ['【語数】','【設問条件】','【過去問比較】','【本文分量】','【残す要点】','【削る情報】','【構成】','【答案例】','【合格戦略】']){
    assert.ok(q.explanation.includes(label), `${q.id} missing ${label}`);
  }
  const mw=q.model.split(/\s+/).filter(Boolean).length;
  assert.ok(mw<=q.maxWords, `${q.id} model wc ${mw}>${q.maxWords}`);
  assert.ok(q.prompt.includes('【オリジナル類題'), `${q.id} must mark original`);
}
assert.ok(active.filter(q=>q.skill==='summary' && q.maxWords===40).length>=7, '2022-type count');
assert.ok(active.filter(q=>q.skill==='summary' && q.maxWords===50).length>=7, '2023-type count');
assert.ok(drills.filter(q=>q.retired).length>=130, 'retired count must be at least 130 after later non-destructive retire loops');
console.log('summary15-loop4-audit ok: active summary lsu26-lsu40; length/load/explanation checks passed.');
