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
const RealDate=Date;
const fixedBase=new RealDate(2026,8,17,12,0,0);
class FixedDate extends RealDate{
  constructor(...args){super(...(args.length?args:[fixedBase.getTime()]))}
  static now(){return fixedBase.getTime()}
}
const oldCtx={Date:FixedDate};oldCtx.globalThis=oldCtx;vm.createContext(oldCtx);
const oldNames=['localDate','plusDays','normalizeDrillState','wordCount','familyCount'];
vm.runInContext(`${oldNames.map(n=>functionSource(app,n)).join('\n')}\nglobalThis.old={${oldNames.join(',')}}`,oldCtx);

const coreCtx={};coreCtx.globalThis=coreCtx;coreCtx.window=coreCtx;vm.createContext(coreCtx);vm.runInContext(read('engine/core.js'),coreCtx,{filename:'engine/core.js'});
const old=oldCtx.old,core=coreCtx.ENGLISH_ENGINE_CORE;
assert.ok(core,'shared engine core did not load');
assert.equal(typeof core.ensureFamilyIds,'function','shared family-ID helper missing');
assert.match(functionSource(app,'normalizeDrillState'),/ENGLISH_ENGINE_CORE\?\.normalizeDrillState/,'startup normalization wrapper must delegate when shared core is loaded');

const index=read('index.html');
const coreTag='<script src="engine/core.js"></script>',appTag='<script src="app.js"></script>',compatTag='<script src="schools/waseshibu/compat.js"></script>',syncTag='<script src="progress-sync.js"></script>';
const corePos=index.indexOf(coreTag),appPos=index.indexOf(appTag),compatPos=index.indexOf(compatTag),syncPos=index.indexOf(syncTag);
assert.ok(corePos>=0,'index.html must load engine/core.js in the candidate runtime');
assert.ok(appPos>=0&&corePos<appPos,'engine/core.js must load before app.js');
assert.ok(compatPos>appPos,'Waseda compatibility bridge must load after app.js so it replaces the legacy globals');
assert.ok(syncPos>compatPos,'progress-sync.js must remain after the compatibility bridge');

for(const d of [new RealDate(2026,0,1),new RealDate(2026,8,17),new RealDate(2028,1,29)])assert.equal(core.localDate(d),old.localDate(d));
for(const n of [1,-1,2,30])assert.equal(core.plusDays(n,fixedBase),old.plusDays(n));

const drillFixtures=[
  null,
  {q:{id:'choice',options:['a','b','c']},choiceOrder:[2,0,1],used:['x'],selectedMany:[1],order:[],orderIndices:[],textInputs:['a'],selfParts:[],selfChecks:[],textDraft:'draft',selfText:'text'},
  {q:{id:'choice',options:['a','b']},choiceOrder:[0,0],order:['one','two'],shuffled:['two','one'],orderIndices:[]},
  {q:{id:'text'},choiceOrder:[9],used:null,selectedMany:null,order:null,orderIndices:null,textInputs:null,selfParts:null,selfChecks:null}
];
for(const fixture of drillFixtures)assert.deepEqual(plain(core.normalizeDrillState(fixture)),plain(old.normalizeDrillState(fixture)));

// Startup performs normalization once on the stored snapshot and again after replacing q
// with the current bank record. Freeze both legacy repair paths before delegation.
const storedChoice={q:{id:'choice'},choiceOrder:[0,0,0],used:null,selectedMany:null,order:null,orderIndices:null,textInputs:null,selfParts:null,selfChecks:null};
const currentChoice={id:'choice',options:['a','b','c']};
const oldChoice1=old.normalizeDrillState(storedChoice),coreChoice1=core.normalizeDrillState(storedChoice);
assert.deepEqual(plain(coreChoice1),plain(oldChoice1));
const oldChoice2=old.normalizeDrillState({...oldChoice1,q:currentChoice}),coreChoice2=core.normalizeDrillState({...coreChoice1,q:currentChoice});
assert.deepEqual(plain(coreChoice2),plain(oldChoice2));
assert.deepEqual(plain(coreChoice2.choiceOrder),[0,1,2],'invalid stored choice order must be repaired after bank record replacement');
assert.deepEqual(plain(coreChoice2.used),[]);assert.deepEqual(plain(coreChoice2.selectedMany),[]);assert.deepEqual(plain(coreChoice2.textInputs),[]);

const storedReorder={q:{id:'reorder'},order:['two','one'],shuffled:['one','two','three'],used:null,selectedMany:null,textInputs:null,selfParts:null,selfChecks:null};
const oldReorder=old.normalizeDrillState(storedReorder),coreReorder=core.normalizeDrillState(storedReorder);
assert.deepEqual(plain(coreReorder),plain(oldReorder));
assert.deepEqual(plain(coreReorder.orderIndices),[1,0],'legacy reorder selections must recover token indices from shuffled tokens');

for(const value of ['', '   ', 'one', 'one two', ' one\n two\tthree '])assert.equal(core.wordCount(value),old.wordCount(value));
for(const items of [[],[{familyId:'a'}],[{familyId:'a'},{familyId:'a'},{familyId:'b'}]])assert.equal(core.familyCount(items),old.familyCount(items));

const familyFixture=[
  {id:'known',skill:'reason',targetId:'reason-evidence'},
  {id:'keep',skill:'context',targetId:'context-word',familyId:'existing-family'},
  {skill:'summary',targetId:'summary-main'},
  {}
];
const legacyFamily=plain(familyFixture),sharedFamily=plain(familyFixture);
legacyFamily.forEach((q,i)=>{if(!q.familyId)q.familyId=String(q.id||`${q.skill||'skill'}:${q.targetId||'target'}:${i}`)});
assert.equal(core.ensureFamilyIds(sharedFamily),sharedFamily,'family-ID helper must mutate and return the original bank');
assert.deepEqual(sharedFamily,legacyFamily,'shared family-ID completion must match the Waseda startup hotfix exactly');
assert.equal(sharedFamily[1].familyId,'existing-family','existing family IDs must never be replaced');

const bridgeCtx={ENGLISH_ENGINE_CORE:core,wordCount:old.wordCount,familyCount:old.familyCount,localDate:old.localDate,plusDays:old.plusDays,normalizeDrillState:old.normalizeDrillState};bridgeCtx.globalThis=bridgeCtx;bridgeCtx.window=bridgeCtx;vm.createContext(bridgeCtx);vm.runInContext(read('schools/waseshibu/compat.js'),bridgeCtx,{filename:'schools/waseshibu/compat.js'});
for(const name of ['wordCount','familyCount','localDate','plusDays','normalizeDrillState'])assert.equal(bridgeCtx[name],core[name],`${name} was not delegated`);
assert.deepEqual(plain(bridgeCtx.ENGLISH_ENGINE_COMPAT.delegated),['wordCount','familyCount','localDate','plusDays','normalizeDrillState']);
assert.equal(bridgeCtx.ENGLISH_ENGINE_COMPAT.stage,'gate2-pure-helper-delegation-3');

console.log('shared engine core/delegation parity: CLEAN');
