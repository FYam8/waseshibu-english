
const fs=require('fs'), vm=require('vm');
const ctx={window:{}, console};
ctx.window.DRILLS=[];
vm.createContext(ctx);
const scripts=['data.js','paper-underlines.js','manual-guides.js','extra-drills.js','detail-drills-v2.js','learning-model.js','original-drills-loop3.js','original-drills-loop4.js','detail20-fix-loop1.js','rebuttal16-loop2.js','rebuttal16-loop3-afterturn.js','summary15-loop2.js','summary15-loop4.js','reason10-loop2.js','reason10-loop3.js','emotion10-loop2.js','context10-loop2.js','connector11-loop2.js','reading50-loop2.js','reading50-loop3.js'];
for (const s of scripts) vm.runInContext(fs.readFileSync(s,'utf8'),ctx,{filename:s});
const B=ctx.window.DRILLS;
const active=B.filter(x=>!x.retired);
const skills={}; active.forEach(d=>skills[d.skill]=(skills[d.skill]||0)+1);
console.log(JSON.stringify({total:B.length, active:active.length, retired:B.length-active.length, skills},null,2));
fs.writeFileSync('/mnt/data/runtime_active.json', JSON.stringify(active,null,2));
