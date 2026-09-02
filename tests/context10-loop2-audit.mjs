
import fs from 'fs';
import vm from 'vm';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

global.window = global;
global.localStorage = {getItem(){return null}, setItem(){}, removeItem(){}};
global.document = {addEventListener(){}, querySelector(){return null}, querySelectorAll(){return []}, getElementById(){return null}};
Object.defineProperty(global,'navigator',{value:{}, configurable:true});
Object.defineProperty(global,'location',{value:{}, configurable:true});

const scriptOrder=['data.js','paper-underlines.js','manual-guides.js','extra-drills.js','detail-drills-v2.js','learning-model.js','original-drills-loop3.js','original-drills-loop4.js','detail20-fix-loop1.js','rebuttal16-loop2.js','rebuttal16-loop3-afterturn.js','summary15-loop2.js','summary15-loop4.js','reason10-loop2.js','reason10-loop3.js','emotion10-loop2.js','context10-loop2.js'];
for(const f of scriptOrder){vm.runInThisContext(fs.readFileSync(path.join(__dirname,'..',f),'utf8'),{filename:f});}
const drills = global.window.DRILLS || [];
const active = drills.filter(q=>!q.retired);
const retired = drills.filter(q=>q.retired);
function assert(cond,msg){ if(!cond){ console.error('FAIL:',msg); process.exit(1);} }
assert(active.length===283, `active count ${active.length} !== 283`);
assert(retired.length===157, `retired count ${retired.length} !== 157`);
const context = active.filter(q=>q.skill==='context');
assert(context.length===10, `active context count ${context.length} !== 10`);
const ids = context.map(q=>q.id).sort();
assert(JSON.stringify(ids)===JSON.stringify(["lcx01","lcx02","lcx03","lcx04","lcx05","lcx06","lcx07","lcx08","lcx09","lcx10"]), 'active context ids mismatch: '+ids.join(','));
for(const id of ["cx01","cx02","xcx1","xcx2","xcx3","xcx4","xcx5","xcx6","xcx7","xcx8"]){
  const q=drills.find(x=>x.id===id);
  assert(q && q.retired===true && q.legacyCompletion===true, `old context not retired: ${id}`);
}
for(const q of context){
  assert(q.type==='choice', `${q.id} not choice`);
  assert(q.options && q.options.length===4, `${q.id} options not 4`);
  assert(Number.isInteger(q.answer) && q.answer>=0 && q.answer<4, `${q.id} invalid answer`);
  assert(q.prompt.includes('【オリジナル類題】'), `${q.id} missing original label`);
  assert(q.targetId && q.focusTag && q.familyId, `${q.id} missing target/focus/family`);
  const labels=['【正解】','【設問和訳】','【根拠英文】','【根拠英文和訳】','【なぜ正解か】','【他選択肢】','【元弱点とのつながり】','【戦略分類】'];
  for (const lab of labels) assert(q.explanation.includes(lab), `${q.id} explanation missing ${lab}`);
}
const targetCounts = context.reduce((a,q)=>{a[q.targetId]=(a[q.targetId]||0)+1;return a;},{});
assert(targetCounts['context-dialogue-fit']===4, 'dialogue target count not 4');
assert(targetCounts['context-lexical-fit']===3, 'lexical target count not 3');
assert(targetCounts['context-sentence-fit']===3, 'sentence target count not 3');
console.log('context10-loop2-audit PASS', JSON.stringify({active:active.length, retired:retired.length, context:context.length, targetCounts}));
