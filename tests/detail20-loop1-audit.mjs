
import fs from 'fs';
import vm from 'vm';
const context={window:{}, console};
context.window.DRILLS=[];
context.window.PAST_PAPERS=[];
context.window.MANUAL_GUIDES=[];
vm.createContext(context);
for (const f of ['data.js','paper-underlines.js','manual-guides.js','extra-drills.js','detail-drills-v2.js','learning-model.js','original-drills-loop3.js','original-drills-loop4.js','detail20-fix-loop1.js']) {
  const code=fs.readFileSync(f,'utf8');
  vm.runInContext(code, context, {filename:f});
}
const B=context.window.DRILLS || [];
const ids = ["rdt_cx01","rdt_cx02","rdt_cx03","rdt_cx04","rdt_cx05","rdt_ci02","rdt_ci03","rdt_pe03","rdt_in01","rdt_in02","rdt_in03","rdt_in04","rdt_in05","nd02","nd03","nd04","nd05","nd06","nd08","nd10"];
let failures=[];
for (const id of ids) {
  const q=B.find(x=>x.id===id && !x.retired);
  if(!q){failures.push(id+': missing/retired'); continue;}
  const e=String(q.explanation||'');
  for (const label of ['【正解】','【設問和訳】','【根拠','【戦略】']) {
    if(!e.includes(label)) failures.push(id+': missing '+label);
  }
  if(!e.includes('【なぜ正解か】') && !e.includes('【他選択肢】')) failures.push(id+': weak explanation structure');
}
for (const id of ['rdt_pe03','nd02','nd03','nd06']) {
 const q=B.find(x=>x.id===id && !x.retired);
 if(!q || !q.detail20FixLoop1) failures.push(id+': patch flag missing');
}
const active=B.filter(x=>!x.retired).length;
const retired=B.filter(x=>x.retired).length;
if(active!==283) failures.push('active count '+active);
if(failures.length){console.error(failures.join('\n')); process.exit(1);}
console.log(`detail20 loop1 audit ok: ${ids.length} active detail items checked; active ${active}; retired ${retired}; major fixes applied`);
