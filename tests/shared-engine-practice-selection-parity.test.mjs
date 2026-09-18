import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

function read(path){return fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8')}
function plain(v){return JSON.parse(JSON.stringify(v))}
const ctx={};ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);vm.runInContext(read('engine/core.js'),ctx,{filename:'engine/core.js'});
const core=ctx.ENGLISH_ENGINE_CORE;
for(const name of ['selectPracticePool','reserveConfirmationIds','selectNextPracticeQuestion'])assert.equal(typeof core?.[name],'function',`missing ${name}`);

function legacyPool(bank,w,minFamilies=5){
  const active=bank.filter(x=>!x.retired),exact=active.filter(x=>x.targetId===w.targetId);
  if(new Set(exact.map(x=>x.familyId)).size>=minFamilies)return exact;
  const broad=active.filter(x=>x.skill===w.skill);
  return broad.length?broad:exact;
}
const bank=[
  {id:'e1',targetId:'t',skill:'s',familyId:'f1'},
  {id:'e2',targetId:'t',skill:'s',familyId:'f2'},
  {id:'b3',targetId:'x',skill:'s',familyId:'f3'},
  {id:'b4',targetId:'x',skill:'s',familyId:'f4'},
  {id:'b5',targetId:'x',skill:'s',familyId:'f5'},
  {id:'ret',targetId:'t',skill:'s',familyId:'fr',retired:true}
];
for(const minFamilies of [2,5,6]){
  const expected=legacyPool(plain(bank),{targetId:'t',skill:'s'},minFamilies).map(x=>x.id);
  const actual=plain(core.selectPracticePool(plain(bank),{targetId:'t',skill:'s'},{minFamilies})).map(x=>x.id);
  assert.deepEqual(actual,expected);
}

function legacyReserve(currentReserved,pool,rankChoices,limit=2){
  const byId=new Map(pool.map(x=>[x.id,x])),reserved=[];
  for(const id of [...new Set(Array.isArray(currentReserved)?currentReserved:[])]){
    const q=byId.get(id);
    if(q&&!reserved.some(x=>byId.get(x)?.familyId===q.familyId))reserved.push(id);
    if(reserved.length===limit)break;
  }
  if(reserved.length<limit){
    const families=new Set(reserved.map(id=>byId.get(id)?.familyId));
    const choices=[...rankChoices(pool.filter(x=>!reserved.includes(x.id)&&!families.has(x.familyId)))];
    while(reserved.length<limit&&choices.length){
      const q=choices.shift();if(families.has(q.familyId))continue;
      families.add(q.familyId);reserved.push(q.id);
    }
  }
  return reserved;
}
const pool=[
  {id:'a1',familyId:'fa',level:1},{id:'a2',familyId:'fa',level:3},
  {id:'b1',familyId:'fb',level:3},{id:'c1',familyId:'fc',level:2},{id:'d1',familyId:'fd',level:3}
];
const rank=items=>[...items].sort((a,b)=>(Number(b.level)||0)-(Number(a.level)||0)||a.id.localeCompare(b.id));
for(const current of [
  [],
  ['missing','a1','a1','a2','b1','c1'],
  ['a2'],
  ['a1','c1']
]){
  for(const limit of [1,2,3]){
    assert.deepEqual(
      plain(core.reserveConfirmationIds({currentReserved:plain(current),pool:plain(pool),rankChoices:rank,limit})),
      legacyReserve(plain(current),plain(pool),rank,limit)
    );
  }
}

function legacyNext({pool,reservedIds,usedIds,mode,streak,rankChoices}){
  const reserved=reservedIds||[],reservedFamilies=new Set(pool.filter(x=>reserved.includes(x.id)).map(x=>x.familyId));
  let used=[...(usedIds||[])],candidates=mode==='confirm'
    ?pool.filter(x=>reserved.includes(x.id)&&!used.includes(x.id))
    :pool.filter(x=>!reservedFamilies.has(x.familyId)&&!used.includes(x.id));
  let resetUsed=false;
  if(!candidates.length){resetUsed=true;used=[];candidates=mode==='confirm'?pool.filter(x=>reserved.includes(x.id)):pool.filter(x=>!reserved.includes(x.id))}
  if(mode==='train'){
    const max=(streak||0)>=2?3:2,leveled=candidates.filter(x=>x.level<=max);if(leveled.length)candidates=leveled;
  }
  candidates=rankChoices(candidates,mode==='confirm');
  const question=candidates[0]||null;if(question)used.push(question.id);
  return {question,usedIds:used,resetUsed};
}
const nextPool=[
  {id:'r1',familyId:'fr1',level:3},{id:'r1b',familyId:'fr1',level:1},
  {id:'r2',familyId:'fr2',level:3},{id:'t1',familyId:'ft1',level:1},
  {id:'t2',familyId:'ft2',level:2},{id:'t3',familyId:'ft3',level:3}
];
const nextRank=(items,confirm)=>[...items].sort((a,b)=>(confirm?(b.level-a.level):0)||a.id.localeCompare(b.id));
for(const fixture of [
  {reservedIds:['r1','r2'],usedIds:['r1'],mode:'confirm',streak:3},
  {reservedIds:['r1','r2'],usedIds:[],mode:'train',streak:0},
  {reservedIds:['r1'],usedIds:['t1','t2','t3'],mode:'train',streak:0},
  {reservedIds:[],usedIds:[],mode:'train',streak:2},
  {reservedIds:['r1','r2'],usedIds:['r1','r2'],mode:'confirm',streak:3}
]){
  const expected=legacyNext({...fixture,pool:plain(nextPool),rankChoices:nextRank});
  const actual=plain(core.selectNextPracticeQuestion({...fixture,pool:plain(nextPool),rankChoices:nextRank}));
  assert.deepEqual(actual,plain(expected),JSON.stringify(fixture));
}

for(const bad of [
  ()=>core.selectPracticePool(null,{}),
  ()=>core.selectPracticePool([],null),
  ()=>core.reserveConfirmationIds({pool:null,rankChoices:rank}),
  ()=>core.reserveConfirmationIds({pool:[],rankChoices:null}),
  ()=>core.selectNextPracticeQuestion({pool:null,rankChoices:nextRank}),
  ()=>core.selectNextPracticeQuestion({pool:[],rankChoices:null})
])assert.throws(bad,/bank must be an array|weak must be an object|pool must be an array|rankChoices must be a function/);

console.log('shared practice pool / confirmation selection parity: CLEAN');
