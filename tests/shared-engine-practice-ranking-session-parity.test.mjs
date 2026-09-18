import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

function read(path){return fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8')}
function plain(v){return JSON.parse(JSON.stringify(v))}
const ctx={};ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);vm.runInContext(read('engine/core.js'),ctx,{filename:'engine/core.js'});
const core=ctx.ENGLISH_ENGINE_CORE;
assert.equal(typeof core.rankPracticeQuestions,'function');
assert.equal(typeof core.practiceSessionStartDecision,'function');

function legacyRank(items,{weak,lastId,confirm,lastUse}){
  return [...items].sort((a,b)=>{
    const rank=q=>(q.focusTag===weak.focusTag?-30:0)+(confirm&&q.level===3?-20:0)+(q.examFormat===weak.examFormat?-6:0);
    return rank(a)-rank(b)||(a.id===lastId?1:b.id===lastId?-1:0)||lastUse(a.id)-lastUse(b.id)||a.id.localeCompare(b.id);
  });
}
const weak={focusTag:'focus',examFormat:'choice'};
const items=[
  {id:'a',focusTag:'focus',examFormat:'choice',level:1},
  {id:'b',focusTag:'focus',examFormat:'choice',level:3},
  {id:'c',focusTag:'focus',examFormat:'other',level:3},
  {id:'d',focusTag:'other',examFormat:'choice',level:3},
  {id:'e',focusTag:'other',examFormat:'other',level:1}
];
const use={a:-1,b:4,c:1,d:2,e:0},lastUse=id=>use[id]??-1;
for(const confirm of [false,true]){
  for(const lastId of [null,'a','b']){
    const expected=legacyRank(plain(items),{weak,lastId,confirm,lastUse}).map(x=>x.id);
    const actual=plain(core.rankPracticeQuestions(plain(items),{weak:plain(weak),lastId,confirm,lastUse})).map(x=>x.id);
    assert.deepEqual(actual,expected);
  }
}

function legacyDecision({weak,key,currentDrill,familyTotal,today,minFamilies=5}){
  if(!weak||typeof weak!=='object')return {kind:'missing'};
  if(currentDrill?.key===key&&currentDrill.q&&!currentDrill.q.retired)return {kind:'resume'};
  if(currentDrill?.key&&currentDrill.key!==key)return {kind:'blocked-other'};
  if(Number(familyTotal)<Number(minFamilies))return {kind:'insufficient-families',familyTotal:Number(familyTotal)||0,minFamilies:Number(minFamilies)};
  if(weak.status==='pending'&&weak.next>today)return {kind:'too-early',date:weak.next};
  return {kind:'start',mode:weak.status==='pending'?'confirm':'train'};
}
const fixtures=[
  {weak:null,key:'k',currentDrill:null,familyTotal:5,today:'2026-09-18'},
  {weak:{status:'active'},key:'k',currentDrill:{key:'k',q:{id:'q'}},familyTotal:5,today:'2026-09-18'},
  {weak:{status:'active'},key:'k',currentDrill:{key:'k',q:{id:'q',retired:true}},familyTotal:5,today:'2026-09-18'},
  {weak:{status:'active'},key:'k',currentDrill:{key:'other',q:{id:'q'}},familyTotal:5,today:'2026-09-18'},
  {weak:{status:'active'},key:'k',currentDrill:null,familyTotal:4,today:'2026-09-18'},
  {weak:{status:'pending',next:'2026-09-19'},key:'k',currentDrill:null,familyTotal:5,today:'2026-09-18'},
  {weak:{status:'pending',next:'2026-09-18'},key:'k',currentDrill:null,familyTotal:5,today:'2026-09-18'},
  {weak:{status:'active'},key:'k',currentDrill:null,familyTotal:5,today:'2026-09-18'}
];
for(const fixture of fixtures){
  assert.deepEqual(
    plain(core.practiceSessionStartDecision(plain(fixture))),
    legacyDecision(plain(fixture)),
    JSON.stringify(fixture)
  );
}
assert.deepEqual(plain(core.practiceSessionStartDecision({weak:{status:'active'},key:'k',currentDrill:null,familyTotal:2,today:'2026-09-18',minFamilies:3})),{kind:'insufficient-families',familyTotal:2,minFamilies:3});

for(const bad of [
  ()=>core.rankPracticeQuestions(null,{weak,lastUse}),
  ()=>core.rankPracticeQuestions([],{weak:null,lastUse}),
  ()=>core.rankPracticeQuestions([],{weak,lastUse:null})
])assert.throws(bad,/items must be an array|weak must be an object|lastUse must be a function/);

console.log('shared practice ranking / session-start parity: CLEAN');
