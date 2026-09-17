import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

function read(path){return fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8')}
const ctx={};ctx.globalThis=ctx;ctx.window=ctx;vm.createContext(ctx);
for(const path of ['engine/contract.js','schools/waseshibu/config.js','schools/waseshibu/policy.js','engine/bootstrap.js'])vm.runInContext(read(path),ctx,{filename:path});

const adapter=ctx.ENGLISH_ENGINE_ADAPTER;
assert.ok(adapter,'validated school adapter was not created');
assert.equal(adapter.contractVersion,1);
assert.equal(adapter.config.schoolId,'waseshibu');
assert.equal(adapter.config.storage.key,'waseshibu.adaptive.v3');
assert.equal(adapter.config.storage.schemaVersion,8);
assert.equal(adapter.config.progress.appId,'english');
assert.equal(adapter.policy.routeRole(2024),'初見診断');
assert.equal(adapter.policy.resolveQuestionPriority({skill:'insertion'}),'C');
assert.equal(adapter.policy.isPriorityInGoal('B',70),true);
assert.equal(adapter.policy.isPriorityInGoal('C',70),false);

const index=read('index.html');
const tagPos=path=>index.indexOf(`<script src="${path}"></script>`);
const adapterTags=['engine/contract.js','schools/waseshibu/config.js','schools/waseshibu/policy.js','engine/bootstrap.js','app.js','engine/waseda-compat.js','progress-sync.js'];
let previous=-1;
for(const path of adapterTags){const pos=tagPos(path);assert.ok(pos>=0,`missing runtime script ${path}`);assert.ok(pos>previous,`adapter/runtime script order changed at ${path}`);previous=pos;}
const corePos=tagPos('engine/core.js'),modelPos=tagPos('learning-model.js'),appPos=tagPos('app.js');
assert.ok(corePos>=0,'missing runtime script engine/core.js');
assert.equal(index.split('<script src="engine/core.js"></script>').length-1,1,'engine/core.js must load exactly once');
assert.ok(corePos<modelPos&&modelPos<appPos,'shared core must load before learning-model.js and app.js');
console.log('shared engine Waseda adapter bootstrap: CLEAN');
