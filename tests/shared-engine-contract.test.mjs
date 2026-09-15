import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

function read(path){return fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8')}
function runBrowserScript(path){const context={};context.globalThis=context;context.window=context;vm.createContext(context);vm.runInContext(read(path),context,{filename:path});return context}
function capture(text,re,label){const match=text.match(re);assert.ok(match,`could not read ${label} from production source`);return match[1]}

const contractCtx=runBrowserScript('engine/contract.js');
const configCtx=runBrowserScript('schools/waseshibu/config.js');
const contract=contractCtx.ENGLISH_ENGINE_CONTRACT;
const config=configCtx.ENGLISH_SCHOOL_CONFIG;
assert.equal(contract.version,1);
assert.equal(contract.validateSchoolConfig(config).ok,true,contract.validateSchoolConfig(config).errors.join('\n'));

const app=read('app.js');
const sync=read('progress-sync.js');

assert.equal(config.storage.key,capture(app,/const STORAGE_KEY="([^"]+)"/,'STORAGE_KEY'));
assert.deepEqual([...config.storage.legacyKeys],JSON.parse(`[${capture(app,/LEGACY_KEYS=\[([^\]]*)\]/,'LEGACY_KEYS')}]`.replaceAll("'",'"')));
assert.equal(config.storage.recoveryPrefix,capture(app,/RECOVERY_PREFIX="([^"]+)"/,'RECOVERY_PREFIX'));
assert.equal(config.storage.importRecoveryPrefix,capture(app,/IMPORT_RECOVERY_PREFIX="([^"]+)"/,'IMPORT_RECOVERY_PREFIX'));
assert.equal(config.storage.schemaVersion,Number(capture(app,/SCHEMA_VERSION=(\d+)/,'SCHEMA_VERSION')));
assert.equal(config.exam.dailyTaskTarget,Number(capture(app,/DAILY_TASK_TARGET=(\d+)/,'DAILY_TASK_TARGET')));
assert.deepEqual([...config.exam.route],capture(app,/const ROUTE=\[([^\]]+)\]/,'ROUTE').split(',').map(Number));
assert.equal(config.exam.defaultYear,Number(capture(app,/year:(\d+),answers:/,'default year')));
assert.equal(config.exam.defaultGoal,Number(capture(app,/goal:(\d+),year:/,'default goal')));

assert.equal(config.progress.endpoint,capture(sync,/const API_DEFAULT='([^']+)'/,'API_DEFAULT'));
assert.equal(config.progress.appId,capture(sync,/const APP_ID='([^']+)'/,'APP_ID'));
assert.equal(config.storage.syncDb,capture(sync,/const SYNC_DB='([^']+)'/,'SYNC_DB'));
assert.equal(config.storage.syncDbVersion,Number(capture(sync,/const SYNC_DB_VERSION=(\d+)/,'SYNC_DB_VERSION')));
assert.equal(config.storage.key,capture(sync,/const STORAGE_KEY='([^']+)'/,'sync STORAGE_KEY'));

assert.ok(!config.schoolId.includes('rikkyo'));
assert.ok(config.storage.key.startsWith('waseshibu.'));
assert.ok(config.storage.syncDb.startsWith('waseshibu-'));

console.log('shared-engine contract baseline: OK');
