import fs from 'node:fs';

const indexPath=new URL('../index.html',import.meta.url);
const modelPath=new URL('../learning-model.js',import.meta.url);
let index=fs.readFileSync(indexPath,'utf8');
let model=fs.readFileSync(modelPath,'utf8');

const coreTag='<script src="engine/core.js"></script>';
const modelTag='<script src="learning-model.js"></script>';
const appTag='<script src="app.js"></script>';
if((index.split(coreTag).length-1)!==1)throw new Error('engine/core.js tag count changed unexpectedly');
if((index.split(modelTag).length-1)!==1)throw new Error('learning-model.js tag count changed unexpectedly');
if(index.indexOf(coreTag)>index.indexOf(modelTag)){
  index=index.replace(coreTag,'');
  index=index.replace(modelTag,`${coreTag}${modelTag}`);
}
if(!(index.indexOf(coreTag)>=0&&index.indexOf(coreTag)<index.indexOf(modelTag)&&index.indexOf(modelTag)<index.indexOf(appTag)))throw new Error('required core -> learning-model -> app order was not produced');

const start=model.indexOf('function migrateState(state){');
const end=model.indexOf('\nwindow.ENGLISH_MODEL=',start);
if(start<0||end<0)throw new Error('migrateState boundary not found');
const oldBlock=model.slice(start,end);
if(!oldBlock.includes('state.goal=[60,70,75].includes(Number(state.goal))?Number(state.goal):60;'))throw new Error('legacy Waseda goal migration changed unexpectedly');
if(!oldBlock.includes('w.reservedConfirm=[...new Set(Array.isArray(w.reservedConfirm)?w.reservedConfirm:[])].filter(id=>valid.has(id)).slice(0,2);'))throw new Error('legacy reserved-confirm migration changed unexpectedly');
if(oldBlock.includes('migrateLearningState'))throw new Error('learning migration is already delegated');

const replacement=`function migrateState(state){
 const shared=window.ENGLISH_ENGINE_CORE?.migrateLearningState;
 if(shared)return shared(state,{
   goalTiers:[60,70,75],
   defaultGoal:60,
   resolveWeakMeta(w){
     const q=(D[w.year]||[]).find(x=>x.id===w.id),meta=q?actualMeta(w.year,q):null;
     if(!meta)return null;
     return {targetId:meta.targetId,focusTag:w.component&&w.component!=="main"?\`manual:\${q.skill}:\${w.component}\`:meta.focusTag,examFormat:meta.examFormat,trap:w.component&&w.component!=="main"?w.component:meta.trap};
   },
   validDrillIdsForTarget(targetId){return B.filter(x=>!x.retired&&x.targetId===targetId).map(x=>x.id)}
 });
 state.goal=[60,70,75].includes(Number(state.goal))?Number(state.goal):60;
 state.currentDrill=state.currentDrill&&typeof state.currentDrill==="object"?state.currentDrill:null;
 for(const w of Object.values(state.weak||{})){
   const q=(D[w.year]||[]).find(x=>x.id===w.id),meta=q?actualMeta(w.year,q):null;
   if(meta)Object.assign(w,{targetId:meta.targetId,focusTag:w.component&&w.component!=="main"?\`manual:\${q.skill}:\${w.component}\`:meta.focusTag,examFormat:meta.examFormat,trap:w.component&&w.component!=="main"?w.component:meta.trap});
   const valid=new Set(B.filter(x=>!x.retired&&x.targetId===w.targetId).map(x=>x.id));
   w.reservedConfirm=[...new Set(Array.isArray(w.reservedConfirm)?w.reservedConfirm:[])].filter(id=>valid.has(id)).slice(0,2);
 }
 return state;
}`;
model=model.slice(0,start)+replacement+model.slice(end);

fs.writeFileSync(indexPath,index);
fs.writeFileSync(modelPath,model);
console.log('Waseda learning-state migration delegation prepared');
