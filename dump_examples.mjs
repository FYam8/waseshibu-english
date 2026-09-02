
import fs from 'node:fs';import path from 'node:path';import vm from 'node:vm';
const root=process.cwd(); const html=fs.readFileSync(path.join(root,'index.html'),'utf8'); const scripts=[...html.matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]);
const dummy={innerHTML:'',textContent:'',value:'',className:'',style:{},dataset:{},classList:{add(){},remove(){},toggle(){}},appendChild(){},addEventListener(){},querySelector(){return dummy},querySelectorAll(){return[]},closest(){return null}};
const ctx={console,window:null,document:{getElementById(){return dummy},querySelector(){return dummy},querySelectorAll(){return[]},createElement(){return dummy},addEventListener(){},body:dummy},localStorage:{getItem(){},setItem(){},removeItem(){},key(){},length:0},navigator:{},location:{hash:''},addEventListener(){},removeEventListener(){},setTimeout(){},clearTimeout(){}}; ctx.window=ctx; vm.createContext(ctx);
for (const s of scripts){vm.runInContext(fs.readFileSync(path.join(root,s),'utf8'),ctx,{filename:s});}
const a=(ctx.DRILLS||[]).filter(q=>!q.retired && q.skill==='example'); console.log(JSON.stringify(a.map(q=>({id:q.id,answer:q.answer,prompt:q.prompt.slice(0,80)})),null,2));
