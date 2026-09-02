
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
const bySkill=Object.groupBy(active, q=>q.skill);
assert.equal(active.length,283);
assert.equal(bySkill.vocab_definition.length,13);
assert.equal(bySkill.extract.length,11);
assert.equal(bySkill.paraphrase.length,11);
assert.equal(bySkill.example.length,10);

const let01=active.find(q=>q.id==='let01');
assert(let01, 'let01 active');
assert(let01.prompt.includes('『自然に』'), 'let01 prompt should ask 自然に only');
assert(!let01.prompt.includes('自然に分解する'), 'let01 prompt should not ask 自然に分解する as one word');
assert.equal(let01.answerText,'naturally');
assert(let01.explanation.includes('break down は『分解する』で2語の句'), 'let01 explanation distinguishes one-word target');

assert.equal(drills.find(q=>q.id==='lex11')?.retired, true, 'lex11 retired');
const lex21=active.find(q=>q.id==='lex21');
assert(lex21, 'lex21 active');
assert(!/uniform|skirts|cartwheels|girls/i.test(lex21.prompt), 'lex21 should avoid 2025 uniforms/girls/cartwheels topic');
assert(lex21.prompt.includes('application form') && lex21.prompt.includes('older residents'), 'lex21 new barrier topic');
assert.equal(lex21.answer,1);
assert(lex21.explanation.includes('申込方法と小さな説明文字'), 'lex21 Japanese rationale');

const exampleIds=bySkill.example.map(q=>q.id);
assert.deepEqual(exampleIds, ['lex12','lex13','lex14','lex15','lex16','lex17','lex18','lex19','lex20','lex21']);
assert.deepEqual(bySkill.example.map(q=>q.answer), [3,1,0,2,3,1,0,2,3,1]);

console.log(JSON.stringify({active:active.length, retired:drills.filter(q=>q.retired).length, let01:'fixed', lex11:'retired', lex21:'active'}, null, 2));
