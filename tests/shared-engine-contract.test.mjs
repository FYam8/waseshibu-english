import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

function read(path){return fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8')}
function runBrowserScript(path,context={}){context.globalThis=context;context.window=context;vm.createContext(context);vm.runInContext(read(path),context,{filename:path});return context}
function capture(text,re,label){const match=text.match(re);assert.ok(match,`could not read ${label} from production source`);return match[1]}
function plain(value){return JSON.parse(JSON.stringify(value))}

const contractCtx=runBrowserScript('engine/contract.js');
const configCtx=runBrowserScript('schools/waseshibu/config.js');
const policyCtx=runBrowserScript('schools/waseshibu/policy.js');
const dataCtx=runBrowserScript('data.js');
const contract=contractCtx.ENGLISH_ENGINE_CONTRACT;
const config=configCtx.ENGLISH_SCHOOL_CONFIG;
const policy=policyCtx.ENGLISH_SCHOOL_POLICY;
const manifest=JSON.parse(read('engine/manifest.json'));

assert.equal(contract.version,1);
assert.equal(manifest.name,'shared-english-engine');
assert.equal(manifest.contractVersion,contract.version);
assert.equal(manifest.sourceRepository,'FYam8/waseshibu-english');
assert.equal(manifest.productionWiring,false);
assert.deepEqual(manifest.artifactRoots,['engine/']);
assert.match(manifest.engineVersion,/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/);
assert.equal(contract.validateSchoolConfig(config).ok,true,contract.validateSchoolConfig(config).errors.join('\n'));
assert.equal(contract.validateSchoolPolicy(policy).ok,true,contract.validateSchoolPolicy(policy).errors.join('\n'));
assert.deepEqual([...config.exam.years],Object.keys(dataCtx.EXAM_DATA).map(Number).sort((a,b)=>a-b));

const app=read('app.js');
const sync=read('progress-sync.js');

// Storage identity is migration-sensitive. During staged commonization it may still be literal
// or may be sourced from the validated school adapter, but the exact Waseda fallbacks must remain
// visible and equal to the contract until production parity gates are complete.
if(app.includes('SCHOOL_STORAGE_CONFIG=window.ENGLISH_ENGINE_ADAPTER?.config?.storage||null')){
  assert.match(app,/STORAGE_KEY=String\(SCHOOL_STORAGE_CONFIG\?\.key\|\|"waseshibu\.adaptive\.v3"\)/);
  assert.match(app,/LEGACY_KEYS=Array\.isArray\(SCHOOL_STORAGE_CONFIG\?\.legacyKeys\)\?\[\.\.\.SCHOOL_STORAGE_CONFIG\.legacyKeys\]:\["waseshibu\.adaptive\.v2"\]/);
  assert.match(app,/RECOVERY_PREFIX=String\(SCHOOL_STORAGE_CONFIG\?\.recoveryPrefix\|\|"waseshibu\.adaptive\.pre-migration"\)/);
  assert.match(app,/IMPORT_RECOVERY_PREFIX=String\(SCHOOL_STORAGE_CONFIG\?\.importRecoveryPrefix\|\|"waseshibu\.adaptive\.pre-import"\)/);
  assert.match(app,/SCHEMA_VERSION=Number\(SCHOOL_STORAGE_CONFIG\?\.schemaVersion\)\|\|8/);
}else{
  assert.equal(config.storage.key,capture(app,/const STORAGE_KEY="([^"]+)"/,'STORAGE_KEY'));
  assert.deepEqual([...config.storage.legacyKeys],JSON.parse(`[${capture(app,/LEGACY_KEYS=\[([^\]]*)\]/,'LEGACY_KEYS')}]`.replaceAll("'",'"')));
  assert.equal(config.storage.recoveryPrefix,capture(app,/RECOVERY_PREFIX="([^"]+)"/,'RECOVERY_PREFIX'));
  assert.equal(config.storage.importRecoveryPrefix,capture(app,/IMPORT_RECOVERY_PREFIX="([^"]+)"/,'IMPORT_RECOVERY_PREFIX'));
  assert.equal(config.storage.schemaVersion,Number(capture(app,/SCHEMA_VERSION=(\d+)/,'SCHEMA_VERSION')));
}
assert.equal(config.storage.key,'waseshibu.adaptive.v3');
assert.deepEqual([...config.storage.legacyKeys],['waseshibu.adaptive.v2']);
assert.equal(config.storage.recoveryPrefix,'waseshibu.adaptive.pre-migration');
assert.equal(config.storage.importRecoveryPrefix,'waseshibu.adaptive.pre-import');
assert.equal(config.storage.schemaVersion,8);

// During the staged migration, low-risk exam runtime values may still be literals or may
// already be sourced from the validated adapter. In either case the Waseda fallback values
// must remain visible and equal to the adapter contract.
if(app.includes('SCHOOL_EXAM_CONFIG=window.ENGLISH_ENGINE_ADAPTER?.config?.exam||null')){
  assert.match(app,/DAILY_TASK_TARGET=Number\(SCHOOL_EXAM_CONFIG\?\.dailyTaskTarget\)\|\|10/);
  assert.match(app,/ROUTE=Array\.isArray\(SCHOOL_EXAM_CONFIG\?\.route\)\?\[\.\.\.SCHOOL_EXAM_CONFIG\.route\]:\[2024,2023,2022,2021,2020,2019,2025,2026\]/);
  assert.match(app,/DEFAULT_GOAL=Number\(SCHOOL_EXAM_CONFIG\?\.defaultGoal\)\|\|60/);
  assert.match(app,/DEFAULT_YEAR=Number\(SCHOOL_EXAM_CONFIG\?\.defaultYear\)\|\|2024/);
  assert.match(app,/goal:DEFAULT_GOAL,year:DEFAULT_YEAR/);
}else{
  assert.equal(config.exam.dailyTaskTarget,Number(capture(app,/DAILY_TASK_TARGET=(\d+)/,'DAILY_TASK_TARGET')));
  assert.deepEqual([...config.exam.route],capture(app,/const ROUTE=\[([^\]]+)\]/,'ROUTE').split(',').map(Number));
  assert.equal(config.exam.defaultYear,Number(capture(app,/year:(\d+),answers:/,'default year')));
  assert.equal(config.exam.defaultGoal,Number(capture(app,/goal:(\d+),year:/,'default goal')));
}
assert.equal(config.exam.dailyTaskTarget,10);
assert.deepEqual([...config.exam.route],[2024,2023,2022,2021,2020,2019,2025,2026]);
assert.equal(config.exam.defaultYear,2024);
assert.equal(config.exam.defaultGoal,60);

if(sync.includes('SCHOOL_PROGRESS_CONFIG=window.ENGLISH_ENGINE_ADAPTER?.config?.progress||null')){
  assert.match(sync,/API_DEFAULT=String\(SCHOOL_PROGRESS_CONFIG\?\.endpoint\|\|'https:\/\/waseshibu-progress-api\.fyam8\.workers\.dev'\)/);
  assert.match(sync,/APP_ID=String\(SCHOOL_PROGRESS_CONFIG\?\.appId\|\|'english'\)/);
  assert.match(sync,/STORAGE_KEY=String\(SCHOOL_STORAGE_CONFIG\?\.key\|\|'waseshibu\.adaptive\.v3'\)/);
  assert.match(sync,/SYNC_DB=String\(SCHOOL_STORAGE_CONFIG\?\.syncDb\|\|'waseshibu-progress-sync'\)/);
  assert.match(sync,/SYNC_DB_VERSION=Number\(SCHOOL_STORAGE_CONFIG\?\.syncDbVersion\)\|\|7/);
}else{
  assert.equal(config.progress.endpoint,capture(sync,/const API_DEFAULT='([^']+)'/,'API_DEFAULT'));
  assert.equal(config.progress.appId,capture(sync,/const APP_ID='([^']+)'/,'APP_ID'));
  assert.equal(config.storage.syncDb,capture(sync,/const SYNC_DB='([^']+)'/,'SYNC_DB'));
  assert.equal(config.storage.syncDbVersion,Number(capture(sync,/const SYNC_DB_VERSION=(\d+)/,'SYNC_DB_VERSION')));
  assert.equal(config.storage.key,capture(sync,/const STORAGE_KEY='([^']+)'/,'sync STORAGE_KEY'));
}
assert.equal(config.progress.endpoint,'https://waseshibu-progress-api.fyam8.workers.dev');
assert.equal(config.progress.appId,'english');
assert.equal(config.storage.syncDb,'waseshibu-progress-sync');
assert.equal(config.storage.syncDbVersion,7);
assert.equal(config.storage.key,'waseshibu.adaptive.v3');
assert.equal(config.exam.writtenMaxScore,Number(capture(sync,/maxScore:(\d+)/,'written max score')));

assert.equal(policy.resolveQuestionPriority({priority:'A',skill:'detail'}),'A');
assert.equal(policy.resolveQuestionPriority({skill:'insertion'}),'C');
assert.equal(policy.resolveQuestionPriority({skill:'reason'}),'B');
assert.equal(policy.isPriorityInGoal('A',60),true);
assert.equal(policy.isPriorityInGoal('B',60),false);
assert.equal(policy.isPriorityInGoal('B',70),true);
assert.equal(policy.isPriorityInGoal('C',70),false);
assert.equal(policy.isPriorityInGoal('C',75),true);
assert.deepEqual(['A','B','C','X'].map(policy.priorityOrder),[0,1,2,3]);
assert.equal(policy.routeRole(2024),'初見診断');
assert.equal(policy.routeRole(2025),'実戦確認');
assert.equal(policy.routeRole(2026),'最終判定');
assert.equal(policy.routeRole(2023),'弱点補強');
assert.equal(policy.goalLabel(60),'A 60点');
assert.equal(policy.goalLabel(70),'B 70点');
assert.equal(policy.goalLabel(75),'C 75点');
assert.match(policy.goalAdvice(60),/60点/);
assert.equal(policy.skillName('reason'),'理由');

for(const mutate of [
  x=>{x.schoolId='Rikkyo UK'},
  x=>{x.exam.goalTiers=42},
  x=>{x.exam.route=[9999]},
  x=>{x.exam.route=[2024,2024]},
  x=>{x.exam.writtenMaxScore=0},
  x=>{x.exam.dailyTaskTarget=0},
  x=>{x.storage.legacyKeys=[x.storage.key]},
  x=>{x.storage.legacyKeys=[x.storage.legacyKeys[0],x.storage.legacyKeys[0]]},
  x=>{x.storage.recoveryPrefix=x.storage.importRecoveryPrefix},
  x=>{x.storage.schemaVersion='8'},
  x=>{x.storage.syncDbVersion=0},
  x=>{x.progress.enabled='yes'},
  x=>{x.progress.endpoint='http://example.invalid'}
]){
  const invalid=plain(config);mutate(invalid);
  assert.doesNotThrow(()=>contract.validateSchoolConfig(invalid));
  assert.equal(contract.validateSchoolConfig(invalid).ok,false);
}
assert.equal(contract.validateSchoolPolicy({}).ok,false);

assert.ok(!config.schoolId.includes('rikkyo'));
assert.ok(config.storage.key.startsWith('waseshibu.'));
assert.ok(config.storage.syncDb.startsWith('waseshibu-'));

console.log('shared-engine contract baseline: OK');
