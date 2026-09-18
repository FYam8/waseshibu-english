import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

function read(path){return fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8')}
function plain(value){return JSON.parse(JSON.stringify(value))}
const app=read('app.js');
const initStart=app.indexOf('const INIT=');assert.ok(initStart>=0,'INIT declaration missing');
const initEnd=app.indexOf(';',initStart);assert.ok(initEnd>initStart,'INIT terminator missing');
const prefix=app.slice(0,initEnd+1);
assert.match(prefix,/SCHOOL_STORAGE_CONFIG=window\.ENGLISH_ENGINE_ADAPTER\?\.config\?\.storage\|\|null/,'storage adapter delegation missing');

function run(adapter){
  const ctx={console};ctx.window=ctx;ctx.globalThis=ctx;ctx.EXAM_DATA={};ctx.PAPERS={};ctx.DRILLS=[];ctx.FALLBACK={};
  if(adapter)ctx.ENGLISH_ENGINE_ADAPTER=adapter;
  vm.createContext(ctx);
  vm.runInContext(`${prefix}\nglobalThis.__runtimeStorage={key:STORAGE_KEY,legacy:[...LEGACY_KEYS],recovery:RECOVERY_PREFIX,importRecovery:IMPORT_RECOVERY_PREFIX,schema:SCHEMA_VERSION,initSchema:INIT.schemaVersion}`,ctx);
  return plain(ctx.__runtimeStorage);
}

const fake={config:{exam:{route:[2030],dailyTaskTarget:3,goalTiers:[50],defaultGoal:50,defaultYear:2030},storage:{key:'fake.school.state.v5',legacyKeys:['fake.school.state.v4','fake.school.state.v3'],recoveryPrefix:'fake.school.pre-migration',importRecoveryPrefix:'fake.school.pre-import',schemaVersion:5}}};
assert.deepEqual(run(fake),{
  key:'fake.school.state.v5',
  legacy:['fake.school.state.v4','fake.school.state.v3'],
  recovery:'fake.school.pre-migration',
  importRecovery:'fake.school.pre-import',
  schema:5,
  initSchema:5
},'runtime storage constants must follow the validated school adapter');

const fallback=run(null);
assert.deepEqual(fallback,{
  key:'waseshibu.adaptive.v3',
  legacy:['waseshibu.adaptive.v2'],
  recovery:'waseshibu.adaptive.pre-migration',
  importRecovery:'waseshibu.adaptive.pre-import',
  schema:8,
  initSchema:8
},'no-adapter fallback must preserve exact Waseda persistence identity');

const configCtx={};configCtx.window=configCtx;configCtx.globalThis=configCtx;vm.createContext(configCtx);vm.runInContext(read('schools/waseshibu/config.js'),configCtx);
const current=plain(configCtx.ENGLISH_SCHOOL_CONFIG.storage);
assert.equal(current.key,fallback.key);
assert.deepEqual(current.legacyKeys,fallback.legacy);
assert.equal(current.recoveryPrefix,fallback.recovery);
assert.equal(current.importRecoveryPrefix,fallback.importRecovery);
assert.equal(current.schemaVersion,fallback.schema);

console.log('Waseda storage-config delegation: CLEAN');
