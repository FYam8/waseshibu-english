import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import assert from 'node:assert/strict'
import {fileURLToPath} from 'node:url'

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..')
const html=fs.readFileSync(path.join(root,'index.html'),'utf8')
const scripts=[...html.matchAll(/<script\s+src="([^"]+)"/g)].map(match=>match[1])
const elements=new Map()
const element=id=>{
  if(!elements.has(id))elements.set(id,{id,innerHTML:'',textContent:'',value:'',checked:false,classList:{add(){},remove(){},toggle(){}},style:{},dataset:{},querySelectorAll:()=>[],addEventListener(){},appendChild(){},remove(){},getBoundingClientRect(){return {top:0}}})
  return elements.get(id)
}
const storage=new Map([['sentinel','preserved']])
const localStorage={get length(){return storage.size},key(i){return [...storage.keys()][i]??null},getItem:key=>storage.get(key)??null,setItem:(key,value)=>storage.set(key,String(value)),removeItem:key=>storage.delete(key)}
const context={console,Date,Math,JSON,Intl,Map,Set,Array,Object,String,Number,Boolean,RegExp,Error,URL,Blob,localStorage,alert(){},confirm(){return true},scrollTo(){},requestAnimationFrame(){},setTimeout(){return 1},clearTimeout(){},setInterval(){return 1},clearInterval(){},document:{getElementById:element,querySelectorAll:()=>[],querySelector:()=>null,addEventListener(){},body:element('body'),hidden:false}}
context.window=context
context.window.addEventListener=()=>{}
context.window.matchMedia=()=>({matches:false})
vm.createContext(context)
// Sync is excluded: this is a content VM, with no network or real storage.
for(const file of scripts.filter(file=>file!=="progress-sync.js"))vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file})

// Node VM with synthetic DOM/storage: structural audit, never a browser test.
const data=JSON.parse(vm.runInContext('JSON.stringify({exams:D,papers:P,drills:BANK,guides:window.MANUAL_GUIDES,pools:Object.fromEntries(Object.entries(D).flatMap(([year,rows])=>rows.map(q=>[year+":"+q.id,poolForWeak({...q,year:Number(year)}).map(d=>d.id)])))})',context));
const sourceIds=new Set(Object.entries(data.exams).flatMap(([y,rows])=>rows.map(q=>y+':'+q.id)));
const active=data.drills.filter(q=>!q.retired), issues=[];
const check=(ok,id,kind)=>{if(!ok)issues.push({id,kind})};
const unique=(rows,key)=>new Set(rows.map(key)).size===rows.length;
check(unique(data.drills,q=>q.id),'bank','duplicate ID');
for(const q of active){
 for(const id of q.sourceItemIds||[])check(sourceIds.has(id),q.id,'sourceItemIds reference');
 check(!!q.prompt?.trim(),q.id,'missing prompt');check(!!q.explanation?.trim(),q.id,'missing explanation');
 if(['choice','multi_choice'].includes(q.type)){
  check(Array.isArray(q.options)&&q.options.length>=2,q.id,'options');
  const answers=q.type==='choice'?[q.answer]:q.answer;
  check(Array.isArray(answers)&&answers.length>0&&answers.every(a=>Number.isInteger(a)&&a>=0&&a<q.options.length),q.id,'answer range');
 }
 if(q.type==='text')check(!!q.answerText?.trim(),q.id,'text answer');
 if(q.type==='text_multi')check(Array.isArray(q.answers)&&q.answers.length>0&&q.answers.every(x=>String(x).trim()),q.id,'multi text answers');
 if(q.type==='pair'){
 check(q.tokens?.length>0&&q.solution?.length>0,q.id,'pair solution');
 check(Array.isArray(q.answer)&&q.answer.length===2&&q.answer.every(i=>Number.isInteger(i)&&i>=0&&i<q.tokens.length),q.id,'pair answer range');
 check(JSON.stringify([...q.tokens].sort())===JSON.stringify([...q.solution].sort()),q.id,'pair token multiset');
 }
 if(q.type==='selfcheck')check(!!q.model?.trim()&&q.check?.length>0,q.id,'selfcheck model/checklist');
}
const mapping=[];
for(const [year,rows] of Object.entries(data.exams)){
 check(unique(rows,q=>q.id),year,'duplicate exam ID');check(rows.reduce((s,q)=>s+q.points,0)===80,year,'written sum');
 for(const q of rows){
  const id=year+':'+q.id,pool=data.pools[id].map(id=>data.drills.find(d=>d.id===id)),families=new Set(pool.map(d=>d.familyId)).size;
  const rendered=vm.runInContext('renderPaperPages('+year+',P['+year+'])',context);
  check(rendered.includes('id="problem-'+year+'-'+q.id+'"'),id,'problem anchor');
  check(pool.length>0&&families>=5,id,'insufficient pool');check(pool.every(d=>!d.retired),id,'retired in pool');
  mapping.push({id,label:q.label,type:q.type,points:q.points,answer:q.answer,skill:q.skill,targetId:q.targetId,focusTag:q.focusTag,page:q.page,poolIds:pool.map(d=>d.id),families,sameFocusCount:pool.filter(d=>d.focusTag===q.focusTag).length,otherTargets:pool.filter(d=>d.targetId!==q.targetId).map(d=>d.id),sourceReview:'not reviewed'});
 }
}
const fixture=JSON.parse(fs.readFileSync(path.join(root,'tests/g2-2022-source-key.json'),'utf8'));
for(const row of fixture.rows){
 const q=data.exams['2022'].find(q=>q.id===row.id);
 check(q?.points===row.points,'2022:'+row.id,'source points');
 if(row.answer!==null)check(q?.answer===row.answer,'2022:'+row.id,'source answer');
 const entry=mapping.find(q=>q.id==='2022:'+row.id);entry.sourceReview=row.answer===null?'points verified; manual answer not embedded':'answer and points verified';
}
const core=context.ENGLISH_ENGINE_CORE,weak={...data.exams['2022'].find(q=>q.id==='6-2'),year:2022,reservedConfirm:[],streak:0,status:'active'},pool=data.pools['2022:6-2'].map(id=>data.drills.find(q=>q.id===id));
const rank=(items,confirm=false)=>core.rankPracticeQuestions(items,{weak,confirm,lastUse:()=>-1});
context.auditWeak=weak;context.auditPool=pool;
const reservedIds=JSON.parse(JSON.stringify(vm.runInContext("ensureConfirmationReserve('2022:6-2:main',auditWeak,auditPool)",context)));
let usedIds=[];const training=[];
for(let streak=0;streak<3;streak++){const r=core.selectNextPracticeQuestion({pool,reservedIds,usedIds,mode:'train',streak,rankChoices:rank});training.push(r.question.id);usedIds=r.usedIds;}
const focusCase={sourceId:'2022:6-2',focus:weak.focusTag,training,reservedIds,trainingConnectorCount:training.filter(id=>pool.find(q=>q.id===id).skill==='connector').length};
assert.equal(focusCase.trainingConnectorCount,3);
assert.deepEqual(training,['lco21','lco23','lco27']);
assert.deepEqual(reservedIds,['lco28','lco26']);
assert.ok(!training.some(id=>reservedIds.includes(id)));
for(const id of ['lco23','lco26','lco27','lco28','lco30']){
 const q=data.drills.find(q=>q.id===id),parts=q.explanation.split('【根拠英文和訳】');
 assert.equal(parts.length,2);assert.ok(parts[1].length>60);assert.ok(q.explanation.includes('【論理関係の確認】'));
}
const policy=context.ENGLISH_SCHOOL_POLICY;
for(const fields of [{reservedConfirm:['rdt_cx03','rdt_cx04']},{status:'pending',reservedConfirm:[]},{streak:1,lastDrillId:'rdt_cx01',reservedConfirm:[]}])assert.equal(policy.practicePlan(data.drills,{...weak,...fields}),null);
assert.equal(policy.practicePlan(data.drills,{...weak,reservedConfirm:[]},{q:{id:'rdt_cx01'}}),null);
assert.equal(policy.practicePlan(data.drills,{...weak,year:2021}),null);
for(const ids of [['rdt_cx03','rdt_cx04'],['lco28','lco26']]){
 const original={goal:60,weak:{'2022:6-2:main':{...weak,component:'main',reservedConfirm:ids,status:'pending',streak:3,confirmStreak:1,seenDrills:['rdt_cx01'],next:'2026-10-02'}},currentDrill:{key:'2022:6-2:main',q:{id:ids[0]},choiceOrder:[2,0,1,3],selected:2},attempts:[{id:'keep-first',writtenScore:77,answers:{'2022:6-2':'ア'}}],drillLog:[{q:'rdt_cx01',ok:true}]};
 const migrated=JSON.parse(JSON.stringify(original));context.ENGLISH_MODEL.migrateState(migrated);assert.deepEqual(JSON.parse(JSON.stringify(migrated)),original,'migration must retain old/new reservation, answers and progress');
}
const manualWithoutGuide=Object.entries(data.exams).flatMap(([y,rows])=>rows.filter(q=>q.type==='manual'&&!data.guides[y+':'+q.id]).map(q=>y+':'+q.id));
const report={focusCase,manualWithoutGuide,scope:'Structural VM audit; source answers separately reviewed; no learner data',examCount:mapping.length,activeCount:active.length,retiredCount:data.drills.length-active.length,issues,mapping};
if(process.argv.includes('--write'))fs.writeFileSync(path.join(root,'docs/g2-content-map.json'),JSON.stringify(report,null,2)+'\n');
if(process.argv.includes('--dump'))fs.writeFileSync('/tmp/g2-runtime.json',JSON.stringify(data,null,2));
console.log(JSON.stringify({examCount:report.examCount,activeCount:active.length,issues,focusCase,manualWithoutGuide,broadPools:mapping.filter(q=>q.otherTargets.length).map(q=>({id:q.id,skill:q.skill,target:q.targetId,pool:q.poolIds.length,families:q.families}))},null,2));
assert.equal(issues.length,0,'structural issues require review');
