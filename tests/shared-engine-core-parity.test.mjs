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
const oldNames=['localDate','plusDays','normalizeDrillState','wordCount','familyCount'];
vm.runInContext(`${oldNames.map(n=>functionSource(app,n)).join('\n')}\nglobalThis.old={${oldNames.join(',')}}`,oldCtx);

const coreCtx={};coreCtx.globalThis=coreCtx;coreCtx.window=coreCtx;vm.createContext(coreCtx);vm.runInContext(read('engine/core.js'),coreCtx,{filename:'engine/core.js'});
const old=oldCtx.old,core=coreCtx.ENGLISH_ENGINE_CORE;
assert.ok(core,'shared engine core did not load');

const index=read('index.html');
const coreTag='<script src="engine/core.js"></script>',appTag='<script src="app.js"></script>',compatTag='<script src="engine/waseda-compat.js"></script>',syncTag='<script src="progress-sync.js"></script>';
const corePos=index.indexOf(coreTag),appPos=index.indexOf(appTag),compatPos=index.indexOf(compatTag),syncPos=index.indexOf(syncTag);
assert.ok(corePos>=0,'index.html must load engine/core.js in the candidate runtime');
assert.ok(appPos>=0&&corePos<appPos,'engine/core.js must load before app.js');
assert.ok(compatPos>appPos,'Waseda compatibility bridge must load after app.js so it replaces the legacy globals');
assert.ok(syncPos>compatPos,'progress-sync.js must remain after the compatibility bridge');

for(const d of [new Date(2026,0,1),new Date(2026,8,17),new Date(2028,1,29)])assert.equal(core.localDate(d),old.localDate(d));
for(const [n,d] of [[1,new Date(2026,8,17)],[-1,new Date(2026,0,1)],[2,new Date(2028,1,28)]])assert.equal(core.plusDays(n,d),old.plusDays.call({Date},n,d));

const drillFixtures=[
  null,
  {q:{id:'choice',options:['a','b','c']},choiceOrder:[2,0,1],used:['x'],selectedMany:[1],order:[],orderIndices:[],textInputs:['a'],selfParts:[],selfChecks:[],textDraft:'draft',selfText:'text'},
  {q:{id:'choice',options:['a','b']},choiceOrder:[0,0],order:['one','two'],shuffled:['two','one'],orderIndices:[]},
  {q:{id:'text'},choiceOrder:[9],used:null,selectedMany:null,order:null,orderIndices:null,textInputs:null,selfParts:null,selfChecks:null}
];
for(const fixture of drillFixtures)assert.deepEqual(plain(core.normalizeDrillState(fixture)),plain(old.normalizeDrillState(fixture)));
for(const value of ['', '   ', 'one', 'one two', ' one\n two\tthree '])assert.equal(core.wordCount(value),old.wordCount(value));
for(const items of [[],[{familyId:'a'}],[{familyId:'a'},{familyId:'a'},{familyId:'b'}]])assert.equal(core.familyCount(items),old.familyCount(items));

const bridgeCtx={ENGLISH_ENGINE_CORE:core,wordCount:old.wordCount,familyCount:old.familyCount,localDate:old.localDate,plusDays:old.plusDays};bridgeCtx.globalThis=bridgeCtx;bridgeCtx.window=bridgeCtx;vm.createContext(bridgeCtx);vm.runInContext(read('engine/waseda-compat.js'),bridgeCtx,{filename:'engine/waseda-compat.js'});
for(const name of ['wordCount','familyCount','localDate','plusDays'])assert.equal(bridgeCtx[name],core[name],`${name} was not delegated`);
assert.deepEqual(plain(bridgeCtx.ENGLISH_ENGINE_COMPAT.delegated),['wordCount','familyCount','localDate','plusDays']);
assert.equal(bridgeCtx.ENGLISH_ENGINE_COMPAT.stage,'gate2-pure-helper-delegation-2');

console.log('shared engine core/delegation parity: CLEAN');
