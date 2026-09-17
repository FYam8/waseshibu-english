import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

function read(path){return fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8')}
function functionSource(source,name){
  const marker=`function ${name}(`,start=source.indexOf(marker);
  assert.ok(start>=0,`missing function ${name}`);
  const brace=source.indexOf('{',start);let depth=0;
  for(let i=brace;i<source.length;i++){
    if(source[i]==='{')depth++;
    else if(source[i]==='}'&&--depth===0)return source.slice(start,i+1);
  }
  throw new Error(`unterminated function ${name}`);
}
function plain(value){return JSON.parse(JSON.stringify(value))}

const app=read('app.js');
const oldCtx={};oldCtx.globalThis=oldCtx;vm.createContext(oldCtx);
const oldNames=['localDate','normalizeDrillState','wordCount','familyCount'];
vm.runInContext(`${oldNames.map(n=>functionSource(app,n)).join('\n')}\nglobalThis.old={${oldNames.join(',')}}`,oldCtx);

const coreCtx={};coreCtx.globalThis=coreCtx;coreCtx.window=coreCtx;vm.createContext(coreCtx);vm.runInContext(read('engine/core.js'),coreCtx,{filename:'engine/core.js'});
const old=oldCtx.old,core=coreCtx.ENGLISH_ENGINE_CORE;
assert.ok(core,'shared engine core did not load');

const index=read('index.html');
const corePos=index.indexOf('<script src="engine/core.js"></script>'),appPos=index.indexOf('<script src="app.js"></script>');
assert.ok(corePos>=0,'index.html must load engine/core.js in the candidate runtime');
assert.ok(appPos>=0&&corePos<appPos,'engine/core.js must load before app.js');

for(const d of [new Date(2026,0,1),new Date(2026,8,17),new Date(2028,1,29)]){
  assert.equal(core.localDate(d),old.localDate(d));
}
assert.equal(core.plusDays(1,new Date(2026,8,17)),'2026-09-18');
assert.equal(core.plusDays(-1,new Date(2026,0,1)),'2025-12-31');

const drillFixtures=[
  null,
  {q:{id:'choice',options:['a','b','c']},choiceOrder:[2,0,1],used:['x'],selectedMany:[1],order:[],orderIndices:[],textInputs:['a'],selfParts:[],selfChecks:[],textDraft:'draft',selfText:'text'},
  {q:{id:'choice',options:['a','b']},choiceOrder:[0,0],order:['one','two'],shuffled:['two','one'],orderIndices:[]},
  {q:{id:'text'},choiceOrder:[9],used:null,selectedMany:null,order:null,orderIndices:null,textInputs:null,selfParts:null,selfChecks:null}
];
for(const fixture of drillFixtures){
  assert.deepEqual(plain(core.normalizeDrillState(fixture)),plain(old.normalizeDrillState(fixture)));
}
for(const value of ['', '   ', 'one', 'one two', ' one\n two\tthree '])assert.equal(core.wordCount(value),old.wordCount(value));
for(const items of [[],[{familyId:'a'}],[{familyId:'a'},{familyId:'a'},{familyId:'b'}]])assert.equal(core.familyCount(items),old.familyCount(items));

console.log('shared engine shadow core parity: CLEAN');
