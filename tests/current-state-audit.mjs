
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
for(const s of scripts){vm.runInContext(fs.readFileSync(path.join(root,s),'utf8'),ctx,{filename:s});}
const drills=ctx.DRILLS||[];
const active=drills.filter(q=>!q.retired);
assert.equal(active.length,283);
assert.equal(active.filter(q=>q.skill==='detail').length,20);
assert.equal(active.filter(q=>q.skill==='rebuttal').length,16);
assert.equal(active.filter(q=>q.skill==='summary').length,15);
assert.equal(active.filter(q=>q.skill==='summary').every(q=>/^lsu(2[6-9]|3[0-9]|40)$/.test(q.id)), true);
assert.equal(active.length,283); assert(drills.filter(q=>q.retired).length>=191);
for(const id of ["dt01","xdt1","nrb01","nsu01","lsu01","lsu10"]){assert.equal(drills.find(q=>q.id===id)?.retired,true,`${id} retired`);}
console.log('current-state-audit ok: active 283; retired >=191; completed sets valid through reading50 loop2');
