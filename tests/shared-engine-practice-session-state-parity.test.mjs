import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

function read(path){return fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8')}
function plain(v){return JSON.parse(JSON.stringify(v))}
const ctx={};ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);vm.runInContext(read('engine/core.js'),ctx,{filename:'engine/core.js'});
const core=ctx.ENGLISH_ENGINE_CORE;
assert.equal(typeof core.createPracticeSessionState,'function');
assert.equal(typeof core.applyPracticeQuestionState,'function');

const weak={skill:'reason',targetId:'reason-evidence',focusTag:'cause',seenDrills:['old']};
for(const mode of ['train','confirm']){
  assert.deepEqual(plain(core.createPracticeSessionState({key:'k',weak:plain(weak),mode})),{
    key:'k',skill:'reason',targetId:'reason-evidence',focusTag:'cause',mode,
    used:[],q:null,error:null,answered:false,selected:null,selectedMany:[],order:[],orderIndices:[],
    textInputs:[],selfText:'',selfParts:[],selfChecks:[]
  });
}

{
  const drill={
    key:'k',mode:'train',used:['old'],q:{id:'old'},error:'error',answered:true,selected:2,selectedMany:[1],
    order:['x'],orderIndices:[0],textInputs:['t'],selfText:'self',selfParts:['p'],selfChecks:[true],
    selfcheck:true,aiFeedback:{x:1},aiFeedbackStale:true,choiceOrder:[2,1,0]
  };
  const w=plain(weak),q={id:'new',options:['A','B','C']};
  const result=core.applyPracticeQuestionState(drill,w,q,{usedIds:['old','new'],choiceOrder:[1,2,0]});
  assert.equal(result,drill);
  assert.equal(drill.q,q);assert.equal(drill.error,null);assert.deepEqual(plain(drill.used),['old','new']);
  assert.equal(w.lastDrillId,'new');assert.deepEqual(plain(w.seenDrills),['old','new']);
  assert.equal(drill.answered,false);assert.equal(drill.selected,null);assert.deepEqual(plain(drill.selectedMany),[]);
  assert.deepEqual(plain(drill.order),[]);assert.deepEqual(plain(drill.orderIndices),[]);assert.deepEqual(plain(drill.textInputs),[]);
  assert.equal(drill.selfText,'');assert.deepEqual(plain(drill.selfParts),[]);assert.deepEqual(plain(drill.selfChecks),[]);
  assert.equal(drill.selfcheck,false);assert.equal(drill.aiFeedback,null);assert.equal(drill.aiFeedbackStale,false);
  assert.deepEqual(plain(drill.choiceOrder),[1,2,0]);
}
{
  const drill={used:['old']},w={seenDrills:['new','new']},q={id:'new'};
  core.applyPracticeQuestionState(drill,w,q,{choiceOrder:[]});
  assert.deepEqual(plain(drill.used),['old','new'],'used list fallback must append selected question');
  assert.deepEqual(plain(w.seenDrills),['new'],'seenDrills must remain unique');
}

for(const bad of [
  ()=>core.createPracticeSessionState({key:'k',weak:null,mode:'train'}),
  ()=>core.applyPracticeQuestionState(null,{},{}),
  ()=>core.applyPracticeQuestionState({},null,{}),
  ()=>core.applyPracticeQuestionState({}, {}, null)
])assert.throws(bad,/weak must be an object|drill must be an object|question must be an object/);

console.log('shared practice session state parity: CLEAN');
