
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
assert(retired.length>=246);
const bySkill=Object.groupBy(active, q=>q.skill);
assert.equal(bySkill.vocab_definition.length,13);
assert.equal(bySkill.extract.length,11);
assert.equal(bySkill.paraphrase.length,11);
assert.equal(bySkill.example.length,10);
assert.deepEqual(bySkill.example.map(q=>q.id), ['lex12','lex13','lex14','lex15','lex16','lex17','lex18','lex19','lex20','lex21']);
for(const id of ['lex01','lex02','lex03','lex04','lex05','lex06','lex07','lex08','lex09','lex10']){
  assert.equal(drills.find(q=>q.id===id)?.retired,true,`${id} should be retired`);
}
for(const q of [...bySkill.extract, ...bySkill.paraphrase, ...bySkill.example]){
  for(const label of ['【正解】','【設問和訳】','【根拠英文】','【根拠英文和訳】','【なぜ正解か】','【戦略】']){
    assert(q.explanation.includes(label), `${q.id} missing ${label}`);
  }
  const m=q.explanation.match(/【根拠英文和訳】([^\n]+)/);
  assert(m && /[ぁ-んァ-ヶ一-龠]/.test(m[1]), `${q.id} 根拠英文和訳 must be Japanese`);
}
for(const q of bySkill.vocab_definition){
  assert.equal(q.type,'text');
  assert(q.initial && q.prompt.toLowerCase().includes('('+q.initial.toLowerCase()), `${q.id} initial prompt`);
  for(const label of ['【正解】','【定義文和訳】','【単語の意味】','【品詞】','【例文】','【元弱点とのつながり】','【戦略】']){
    assert(q.explanation.includes(label), `${q.id} missing ${label}`);
  }
}
assert.deepEqual(bySkill.example.map(q=>q.answer), [3,1,0,2,3,1,0,2,3,1]);
console.log(JSON.stringify({active:active.length, retired:retired.length, vocabDefinition:bySkill.vocab_definition.length, extract:bySkill.extract.length, paraphrase:bySkill.paraphrase.length, example:bySkill.example.length}, null, 2));
