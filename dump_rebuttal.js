
global.window={};
global.document={};
global.localStorage={getItem:()=>null,setItem:()=>{},removeItem:()=>{}};
const fs=require('fs'), vm=require('vm');
for (const f of ['data.js','paper-underlines.js','manual-guides.js','extra-drills.js','detail-drills-v2.js','learning-model.js','original-drills-loop3.js','original-drills-loop4.js','detail20-fix-loop1.js','rebuttal16-loop2.js']) {
 const code=fs.readFileSync(f,'utf8'); vm.runInThisContext(code,{filename:f});
}
const active=window.DRILLS.filter(q=>q.skill==='rebuttal'&&!q.retired);
console.log(JSON.stringify(active.map(q=>({id:q.id,prompt:q.prompt,model:q.model,maxWords:q.maxWords})),null,2));
