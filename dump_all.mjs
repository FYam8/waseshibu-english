
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=process.cwd();
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const scripts=[...html.matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]);
const ctx={console,window:null,document:{getElementById(){return{}},querySelector(){return{}},querySelectorAll(){return[]},createElement(){return{}},addEventListener(){},body:{}},localStorage:{getItem(){return null},setItem(){},removeItem(){},key(){return null},length:0},navigator:{},location:{hash:''},addEventListener(){},removeEventListener(){},setTimeout(){},clearTimeout(){}};
ctx.window=ctx; vm.createContext(ctx);
for (const s of scripts){ if(s==='app.js'){}; const p=path.join(root,s); if(fs.existsSync(p)) vm.runInContext(fs.readFileSync(p,'utf8'),ctx,{filename:s}); }
fs.writeFileSync('/mnt/data/drills_dump_reading50_loop3.json', JSON.stringify(ctx.DRILLS||[],null,2));
