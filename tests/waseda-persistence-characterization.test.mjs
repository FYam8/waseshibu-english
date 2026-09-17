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
class MemoryStorage{
  constructor(entries=[]){this.map=new Map(entries)}
  get length(){return this.map.size}
  key(i){return [...this.map.keys()][i]??null}
  getItem(k){return this.map.has(String(k))?this.map.get(String(k)):null}
  setItem(k,v){this.map.set(String(k),String(v))}
  removeItem(k){this.map.delete(String(k))}
  clear(){this.map.clear()}
  entries(){return [...this.map.entries()]}
}

const configCtx={};configCtx.window=configCtx;configCtx.globalThis=configCtx;vm.createContext(configCtx);vm.runInContext(read('schools/waseshibu/config.js'),configCtx);
const schoolConfig=plain(configCtx.ENGLISH_SCHOOL_CONFIG);
const app=read('app.js');
const initStart=app.indexOf('const INIT=');assert.ok(initStart>=0,'INIT missing');
const initEnd=app.indexOf(';',initStart);assert.ok(initEnd>initStart,'INIT terminator missing');
const prefix=app.slice(0,initEnd+1);
const functions=['storageKeys','recoveryCandidates','parseStored','loadState','save','savePreImportRecovery'].map(name=>functionSource(app,name)).join('\n');

function build(storage=new MemoryStorage()){
  const alerts=[];
  const ctx={console,localStorage:storage,alert:m=>alerts.push(String(m))};
  ctx.window=ctx;ctx.globalThis=ctx;ctx.EXAM_DATA={};ctx.PAPERS={};ctx.DRILLS=[];ctx.FALLBACK={};
  ctx.ENGLISH_ENGINE_ADAPTER={config:schoolConfig};
  ctx.ENGLISH_MODEL={migrateState(state){return state}};
  vm.createContext(ctx);
  vm.runInContext(`${prefix}\nfunction strategyPriority(q){return q?.priority||'B'}\nfunction consolidateManualWeak(state){return state}\nlet S=null,storageWarningShown=false;\n${functions}\nglobalThis.__persistence={constants:{STORAGE_KEY,LEGACY_KEYS:[...LEGACY_KEYS],RECOVERY_PREFIX,IMPORT_RECOVERY_PREFIX,SCHEMA_VERSION},loadState,save,savePreImportRecovery,setState(v){S=v},getState(){return S}};`,ctx);
  return {ctx,api:ctx.__persistence,storage,alerts};
}

const empty=build();
const {STORAGE_KEY,LEGACY_KEYS,RECOVERY_PREFIX,IMPORT_RECOVERY_PREFIX,SCHEMA_VERSION}=plain(empty.api.constants);
assert.equal(STORAGE_KEY,schoolConfig.storage.key,'storage key diverged from Waseda config');
assert.deepEqual(LEGACY_KEYS,schoolConfig.storage.legacyKeys,'legacy storage keys diverged from Waseda config');
assert.equal(RECOVERY_PREFIX,schoolConfig.storage.recoveryPrefix,'migration recovery prefix diverged');
assert.equal(IMPORT_RECOVERY_PREFIX,schoolConfig.storage.importRecoveryPrefix,'import recovery prefix diverged');
assert.equal(SCHEMA_VERSION,schoolConfig.storage.schemaVersion,'schema version diverged');

const fresh=plain(empty.api.loadState());
assert.equal(fresh.schemaVersion,8);
assert.equal(fresh.goal,60);
assert.equal(fresh.year,2024);
assert.ok(empty.storage.getItem(STORAGE_KEY),'fresh load must persist canonical primary state');

// Primary corrupt -> legacy fallback -> canonical rewrite + recovery notice.
{
  const legacy={schemaVersion:8,goal:70,year:2023,answers:{},manual:{},weak:{},cause:{},exposure:{},history:[],attempts:[],drillLog:[]};
  const storage=new MemoryStorage([[STORAGE_KEY,'{broken'],[LEGACY_KEYS[0],JSON.stringify(legacy)]]);
  const {api}=build(storage),state=plain(api.loadState());
  assert.equal(state.goal,70);assert.equal(state.year,2023);
  assert.equal(state.recoveryNotice,'破損した保存データを自動復元しました。');
  assert.equal(JSON.parse(storage.getItem(STORAGE_KEY)).goal,70,'recovered legacy state must be rewritten to primary key');
}

// Recovery precedence: primary, then legacy, then newest import recovery, then highest migration version.
{
  const base=marker=>JSON.stringify({schemaVersion:8,goal:60,year:2024,theme:marker,answers:{},manual:{},weak:{},cause:{},exposure:{},history:[],attempts:[],drillLog:[]});
  const storage=new MemoryStorage([
    [`${IMPORT_RECOVERY_PREFIX}.100`,base('import-old')],
    [`${IMPORT_RECOVERY_PREFIX}.200`,base('import-new')],
    [`${RECOVERY_PREFIX}.v2`,base('migration-v2')],
    [`${RECOVERY_PREFIX}.v7`,base('migration-v7')]
  ]);
  const state=plain(build(storage).api.loadState());
  assert.equal(state.theme,'import-new','newest import recovery must win before migration snapshots');
  storage.removeItem(STORAGE_KEY);storage.removeItem(`${IMPORT_RECOVERY_PREFIX}.100`);storage.removeItem(`${IMPORT_RECOVERY_PREFIX}.200`);
  const state2=plain(build(storage).api.loadState());
  assert.equal(state2.theme,'migration-v7','highest migration recovery version must win');
}

// v2 -> v8: preserve history, synthesize non-comparable attempt/exposure, clear old daily plan, save exact pre-migration snapshot.
{
  const raw={schemaVersion:2,goal:60,year:2024,answers:{'2024:q':'ア'},manual:{},weak:{},cause:{},exposure:{},history:[{year:2024,score:51,aLost:4,bLost:7,at:'2026-01-02T03:04:05Z'}],attempts:[],drillLog:[],dailyPlan:{date:'2026-09-17',kind:'weak'}};
  const rawText=JSON.stringify(raw),storage=new MemoryStorage([[STORAGE_KEY,rawText]]),state=plain(build(storage).api.loadState());
  assert.equal(state.schemaVersion,8);
  assert.equal(state.attempts.length,1);
  assert.equal(state.attempts[0].writtenScore,51);
  assert.equal(state.attempts[0].comparable,false);
  assert.equal(state.attempts[0].legacy,true);
  assert.equal(state.exposure['2024'],'unknown');
  assert.equal(state.dailyPlan,null);
  assert.equal(storage.getItem(`${RECOVERY_PREFIX}.v2`),rawText,'pre-migration recovery snapshot must preserve original bytes');
}

// v7 daily answeredCount is split into dailyProgress while retaining the plan.
{
  const raw={schemaVersion:7,goal:60,year:2024,answers:{},manual:{},weak:{},cause:{},exposure:{},history:[],attempts:[],drillLog:[],dailyPlan:{date:'2026-09-17',kind:'weak',answeredCount:6}};
  const state=plain(build(new MemoryStorage([[STORAGE_KEY,JSON.stringify(raw)]])).api.loadState());
  assert.deepEqual(state.dailyProgress,{date:'2026-09-17',answeredCount:6});
  assert.equal(state.dailyPlan.kind,'weak');
}

// Old targeted attempt must become an interrupted untimed attempt.
{
  const raw={schemaVersion:8,goal:60,year:2024,answers:{},manual:{},weak:{},cause:{},exposure:{},history:[],attempts:[],drillLog:[],currentAttempt:{id:'a1',year:2024,mode:'targeted'}};
  const state=plain(build(new MemoryStorage([[STORAGE_KEY,JSON.stringify(raw)]])).api.loadState());
  assert.equal(state.currentAttempt.mode,'untimed');assert.equal(state.currentAttempt.interrupted,true);
}

// Future schema is not rewritten, and save refuses to downgrade it.
{
  const future={schemaVersion:9,goal:60,year:2024,answers:{},manual:{},weak:{},cause:{},exposure:{},history:[],attempts:[],drillLog:[]};
  const text=JSON.stringify(future),storage=new MemoryStorage([[STORAGE_KEY,text]]),runtime=build(storage),state=plain(runtime.api.loadState());
  assert.equal(state.schemaVersion,9);assert.equal(storage.getItem(STORAGE_KEY),text,'future schema must not be rewritten on load');
  runtime.api.setState(future);assert.equal(runtime.api.save(),false);assert.equal(storage.getItem(STORAGE_KEY),text,'future schema save must be refused');
}

// Current/older state save upgrades schema in place on the permanent key.
{
  const storage=new MemoryStorage(),runtime=build(storage),state={schemaVersion:7,goal:70,marker:'save-test'};
  runtime.api.setState(state);assert.equal(runtime.api.save(),true);assert.equal(state.schemaVersion,8);
  assert.equal(JSON.parse(storage.getItem(STORAGE_KEY)).marker,'save-test');
}

// Import recovery keeps at most three local snapshots.
{
  const storage=new MemoryStorage([
    [`${IMPORT_RECOVERY_PREFIX}.1`,'{}'],[`${IMPORT_RECOVERY_PREFIX}.2`,'{}'],[`${IMPORT_RECOVERY_PREFIX}.3`,'{}']
  ]),runtime=build(storage);
  runtime.api.setState({schemaVersion:8,goal:60,marker:'before-import'});
  const key=runtime.api.savePreImportRecovery();
  const keys=storage.entries().map(([k])=>k).filter(k=>k.startsWith(`${IMPORT_RECOVERY_PREFIX}.`));
  assert.ok(key&&storage.getItem(key),'new import recovery snapshot missing');
  assert.equal(keys.length,3,'import recovery must retain exactly three newest snapshots');
  assert.ok(!storage.getItem(`${IMPORT_RECOVERY_PREFIX}.1`),'oldest import recovery must be pruned');
}

console.log('Waseda persistence/recovery characterization: CLEAN');
