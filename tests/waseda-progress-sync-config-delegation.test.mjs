import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

function read(path){return fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8')}
function plain(value){return JSON.parse(JSON.stringify(value))}
const source=read('progress-sync.js');
assert.match(source,/SCHOOL_PROGRESS_CONFIG=window\.ENGLISH_ENGINE_ADAPTER\?\.config\?\.progress\|\|null/,'progress config adapter missing');
assert.match(source,/SCHOOL_STORAGE_CONFIG=window\.ENGLISH_ENGINE_ADAPTER\?\.config\?\.storage\|\|null/,'sync storage config adapter missing');
assert.match(source,/window\.__WASESHIBU_PROGRESS_API__\|\|API_DEFAULT/,'existing Waseda API override must remain intact');

const strict=source.indexOf("'use strict';");
const end=source.indexOf('const MAX_BATCH=',strict);
assert.ok(strict>=0&&end>strict,'progress-sync config prefix missing');
const declarations=source.slice(strict+"'use strict';".length,end);
function evaluate(adapter){
  const ctx={};ctx.window=ctx;ctx.globalThis=ctx;if(adapter)ctx.ENGLISH_ENGINE_ADAPTER=adapter;vm.createContext(ctx);
  vm.runInContext(`${declarations}\nglobalThis.__sync={api:API_DEFAULT,appId:APP_ID,storageKey:STORAGE_KEY,db:SYNC_DB,dbVersion:SYNC_DB_VERSION};`,ctx);
  return plain(ctx.__sync);
}

const fake={config:{progress:{endpoint:'https://progress.example.test',appId:'rikkyo-english'},storage:{key:'rikkyo.english.v1',syncDb:'rikkyo-english-progress',syncDbVersion:3}}};
assert.deepEqual(evaluate(fake),{
  api:'https://progress.example.test',
  appId:'rikkyo-english',
  storageKey:'rikkyo.english.v1',
  db:'rikkyo-english-progress',
  dbVersion:3
},'progress-sync identity must follow the validated school adapter');
assert.deepEqual(evaluate(null),{
  api:'https://waseshibu-progress-api.fyam8.workers.dev',
  appId:'english',
  storageKey:'waseshibu.adaptive.v3',
  db:'waseshibu-progress-sync',
  dbVersion:7
},'no-adapter fallback must preserve exact Waseda progress identity');

const configCtx={};configCtx.window=configCtx;configCtx.globalThis=configCtx;vm.createContext(configCtx);vm.runInContext(read('schools/waseshibu/config.js'),configCtx);
const current=plain(configCtx.ENGLISH_SCHOOL_CONFIG),runtime=evaluate({config:current});
assert.deepEqual(runtime,{
  api:current.progress.endpoint,
  appId:current.progress.appId,
  storageKey:current.storage.key,
  db:current.storage.syncDb,
  dbVersion:current.storage.syncDbVersion
});

console.log('Waseda progress-sync config delegation: CLEAN');
