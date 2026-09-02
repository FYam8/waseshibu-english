
const fs = require('fs'), vm = require('vm'), path=require('path');
const root=process.cwd();
const sandbox={window:{}, console}; sandbox.window=sandbox; vm.createContext(sandbox);
const scripts=['data.js','paper-underlines.js','manual-guides.js','extra-drills.js','detail-drills-v2.js','learning-model.js','original-drills-loop3.js','original-drills-loop4.js','detail20-fix-loop1.js','rebuttal16-loop2.js','rebuttal16-loop3-afterturn.js','summary15-loop2.js','summary15-loop4.js','reason10-loop2.js','reason10-loop3.js','emotion10-loop2.js','context10-loop2.js'];
for(const s of scripts){ vm.runInContext(fs.readFileSync(path.join(root,s),'utf8'), sandbox, {filename:s});}
console.log(JSON.stringify(sandbox.window.DRILLS.filter(x=>x.skill==='connector').map(({id,skill,type,prompt,options,answer,retired,targetId,explanation})=>({id,skill,type,prompt,options,answer,retired,targetId,explanation})),null,2));
