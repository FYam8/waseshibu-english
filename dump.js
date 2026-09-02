
global.window = global;
global.localStorage = {getItem(){return null}, setItem(){}, removeItem(){}};
global.document = {addEventListener(){}, querySelector(){return null}, querySelectorAll(){return []}, getElementById(){return null}};
global.navigator = {};
global.location = {};
const fs=require('fs'), vm=require('vm'), path=require('path');
const files=['data.js','paper-underlines.js','manual-guides.js','extra-drills.js','detail-drills-v2.js','learning-model.js','original-drills-loop3.js','original-drills-loop4.js','detail20-fix-loop1.js','rebuttal16-loop2.js','rebuttal16-loop3-afterturn.js','summary15-loop2.js','summary15-loop4.js','reason10-loop2.js','reason10-loop3.js','emotion10-loop2.js'];
for (const f of files){ vm.runInThisContext(fs.readFileSync(path.join(__dirname,f),'utf8'), {filename:f});}
const drills=global.DRILLS||global.window.DRILLS;
console.log(JSON.stringify({count:drills.length, bySkill:drills.reduce((a,d)=>{if(!d.retired)a[d.skill]=(a[d.skill]||0)+1; return a},{}), retired:drills.filter(d=>d.retired).length,
context:drills.filter(d=>!d.retired && d.skill==='context')}, null, 2));
