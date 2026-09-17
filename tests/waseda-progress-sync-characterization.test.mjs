import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

function read(path){return fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8')}
function plain(value){return JSON.parse(JSON.stringify(value))}
function capture(text,re,label){const m=text.match(re);assert.ok(m,`missing ${label}`);return m[1]}

const source=read('progress-sync.js');
const configCtx={};configCtx.window=configCtx;configCtx.globalThis=configCtx;vm.createContext(configCtx);vm.runInContext(read('schools/waseshibu/config.js'),configCtx,{filename:'schools/waseshibu/config.js'});
const config=plain(configCtx.ENGLISH_SCHOOL_CONFIG);

// External/local identity boundary: these values must not drift during commonization.
const identity={
  endpoint:capture(source,/const API_DEFAULT='([^']+)'/,'API_DEFAULT'),
  appId:capture(source,/const APP_ID='([^']+)'/,'APP_ID'),
  storageKey:capture(source,/const STORAGE_KEY='([^']+)'/,'STORAGE_KEY'),
  syncDb:capture(source,/const SYNC_DB='([^']+)'/,'SYNC_DB'),
  syncDbVersion:Number(capture(source,/const SYNC_DB_VERSION=(\d+)/,'SYNC_DB_VERSION')),
  maxBatch:Number(capture(source,/const MAX_BATCH=(\d+)/,'MAX_BATCH')),
  reconcileMs:Number(capture(source,/const RECONCILE_INTERVAL_MS=([\d_]+)/,'RECONCILE_INTERVAL_MS').replaceAll('_','')),
  controlRefreshMs:capture(source,/const CONTROL_REFRESH_INTERVAL_MS=([^;]+)/,'CONTROL_REFRESH_INTERVAL_MS'),
  requestTimeoutMs:Number(capture(source,/const REQUEST_TIMEOUT_MS=([\d_]+)/,'REQUEST_TIMEOUT_MS').replaceAll('_',''))
};
assert.deepEqual(identity,{
  endpoint:'https://waseshibu-progress-api.fyam8.workers.dev',
  appId:'english',
  storageKey:'waseshibu.adaptive.v3',
  syncDb:'waseshibu-progress-sync',
  syncDbVersion:7,
  maxBatch:10,
  reconcileMs:60000,
  controlRefreshMs:'5*60_000',
  requestTimeoutMs:15000
});
assert.equal(config.progress.endpoint,identity.endpoint);
assert.equal(config.progress.appId,identity.appId);
assert.equal(config.storage.key,identity.storageKey);
assert.equal(config.storage.syncDb,identity.syncDb);
assert.equal(config.storage.syncDbVersion,identity.syncDbVersion);

// IndexedDB schema and control namespace are part of the installed-client compatibility boundary.
const stores=[...source.matchAll(/createObjectStore\('([^']+)'/g)].map(x=>x[1]);
assert.deepEqual(stores,['control','outbox','deadletter','seen_v2']);
for(const key of ['registration','pendingRegistration','syncRevoked','collectionDisabled'])assert.ok(source.includes(`'${key}'`),`missing sync control key ${key}`);
assert.match(source,/`\$\{APP_ID\}:occurrenceSignature:\$\{reg\.registrationId\}`/);
assert.match(source,/`\$\{APP_ID\}:baselineSent:\$\{reg\.registrationId\}`/);
assert.match(source,/function sourceKey\(id\)\{return `\$\{APP_ID\}:\$\{id\}`\}/);

// HTTP contract / authorization semantics.
for(const path of ['/v1/register-anonymous','/v1/control','/v1/progress/snapshot','/v1/events/batch'])assert.ok(source.includes(path),`missing progress endpoint ${path}`);
assert.match(source,/authorization:`Bearer \$\{reg\.credential\}`/);
assert.match(source,/r\.status===401\)\{await setControl\('syncRevoked',true\)/);
assert.match(source,/r\.status===403&&d\?\.code==='collection_disabled'\)\{await setControl\('collectionDisabled',true\)/);
assert.match(source,/reg\?\.status!=='production'\)return/,'occurrence upload must remain production-only');
assert.match(source,/canonicalJson\(\{eventType:record\.eventType,payload:record\.payload\}\)/,'state fingerprint must ignore timestamp-only changes');
assert.doesNotMatch(source,/canonicalJson\(\{eventType:record\.eventType,occurredAt:record\.occurredAt,payload:record\.payload\}\)/);
assert.doesNotMatch(source,/\banswers\s*:/,'raw answer map must never be uploaded');
assert.doesNotMatch(source,/\bmanual\s*:/,'raw manual-score map must never be uploaded');

// Execute the pure state/occurrence projection with a fixed clock so record semantics are frozen.
const start=source.indexOf('function validIso(v)');
const end=source.indexOf('async function queueRecord',start);
assert.ok(start>=0&&end>start,'pure progress projection boundary missing');
const pureBlock=source.slice(start,end);
const RealDate=Date,fixedNow=new RealDate('2026-09-17T12:00:00.000Z');
class FixedDate extends RealDate{
  constructor(...args){super(...(args.length?args:[fixedNow.getTime()]))}
  static now(){return fixedNow.getTime()}
}
const ctx={Date:FixedDate};ctx.globalThis=ctx;vm.createContext(ctx);
vm.runInContext(`
function canonicalize(v){return Array.isArray(v)?v.map(canonicalize):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonicalize(v[k])])):v}
const canonicalJson=v=>JSON.stringify(canonicalize(v));
${pureBlock}
globalThis.__projection={buildOccurrenceRecords,buildStateRecords,occurrenceSignature};
`,ctx);

const fixture={
  goal:70,
  attempts:[
    {id:'a-2024',year:2024,status:'graded',mode:'timed',writtenScore:64,startedAt:'2026-09-15T10:00:00.000Z',gradedAt:'2026-09-15T11:30:00.000Z'},
    {id:'a-2023',year:2023,status:'interrupted',mode:'untimed',startedAt:'2026-09-14T08:00:00.000Z',endedAt:'2026-09-14T08:45:00.000Z'}
  ],
  currentAttempt:{id:'a-active',year:2025,status:'active',mode:'timed',startedAt:'2026-09-17T10:00:00.000Z'},
  drillLog:[{key:'2024:6-5:main',q:'drill/1?',skill:'reason',ok:true,at:'2026-09-16T08:00:00.000Z'}],
  weak:{
    w1:{status:'active',category:'理由'},
    w2:{status:'mastered',category:'文脈'},
    w3:{status:'pending',category:'理由'}
  },
  answers:{'2022:q':'ア'},
  manual:{'2026:q':{score:5}}
};
const occurrences=plain(ctx.__projection.buildOccurrenceRecords(fixture));
assert.deepEqual(occurrences,[
  {sourceRecordId:'history:exam:a-2024',eventType:'exam_completed',occurredAt:'2026-09-15T11:30:00.000Z',payload:{year:'2024',score:64,maxScore:80,kind:'timed',completed:true}},
  {sourceRecordId:'history:exam:a-2023',eventType:'exam_interrupted',occurredAt:'2026-09-14T08:45:00.000Z',payload:{year:'2023',kind:'untimed',completed:false}},
  {sourceRecordId:'history:exam:a-active',eventType:'exam_started',occurredAt:'2026-09-17T10:00:00.000Z',payload:{year:'2025',kind:'timed',completed:false}},
  {sourceRecordId:'history:drill:2026-09-16T08:00:00.000Z:drill_1_',eventType:'drill_answered',occurredAt:'2026-09-16T08:00:00.000Z',payload:{year:'2024',kind:'remediation-drill',skill:'reason',questionId:'drill_1_',correct:1,total:1,completed:true}}
]);

const states=plain(ctx.__projection.buildStateRecords(fixture));
assert.deepEqual(states.map(x=>x.sourceRecordId),[
  'state:summary','state:latest-exam',
  'state:year:2019','state:year:2020','state:year:2021','state:year:2022','state:year:2023','state:year:2024','state:year:2025','state:year:2026',
  'state:weakness','state:retention','state:drill'
]);
const byId=Object.fromEntries(states.map(x=>[x.sourceRecordId,x]));
assert.deepEqual(byId['state:summary'].payload,{total:4,kind:'target-70',completed:false,lastLearningAt:'2026-09-17T10:00:00.000Z'});
assert.deepEqual(byId['state:latest-exam'],{sourceRecordId:'state:latest-exam',eventType:'exam_completed',occurredAt:'2026-09-15T11:30:00.000Z',payload:{year:'2024',score:64,maxScore:80,kind:'timed',completed:true,lastLearningAt:'2026-09-15T11:30:00.000Z'}});
assert.deepEqual(byId['state:year:2022'].payload,{year:'2022',completed:false});
assert.deepEqual(byId['state:year:2023'].payload,{year:'2023',completed:false});
assert.deepEqual(byId['state:year:2024'].payload,{year:'2024',completed:true});
assert.deepEqual(byId['state:year:2025'].payload,{year:'2025',completed:false});
assert.deepEqual(byId['state:year:2026'].payload,{year:'2026',completed:false});
assert.deepEqual(byId['state:weakness'].payload,{total:3,correct:1,category:'理由:2',completed:false});
assert.deepEqual(byId['state:retention'].payload,{total:1,kind:'next-day-confirmation',completed:false});
assert.deepEqual(byId['state:drill'].payload,{total:1,kind:'remediation-drill',completed:false,lastLearningAt:'2026-09-16T08:00:00.000Z'});

// Occurrence signature deliberately includes stable learning occurrences, not transient state timestamps.
const signature=ctx.__projection.occurrenceSignature(fixture);
assert.equal(signature,'{"active":["a-active","active","2026-09-17T10:00:00.000Z",2025],"attempts":[["a-2024","graded","2026-09-15T11:30:00.000Z",64],["a-2023","interrupted","2026-09-14T08:45:00.000Z",null]],"drills":[["2026-09-16T08:00:00.000Z","drill/1?",true,"2024:6-5:main"]]}');

console.log('Waseda progress-sync adapter boundary characterization: CLEAN');
