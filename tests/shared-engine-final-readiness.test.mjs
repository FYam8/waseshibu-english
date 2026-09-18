import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const plain=v=>JSON.parse(JSON.stringify(v));

const engineFiles=fs.readdirSync(path.join(root,'engine')).sort();
assert.deepEqual(engineFiles,['bootstrap.js','contract.js','core.js','manifest.json'],'shared artifact must not contain school-specific runtime files');

for(const file of ['engine/bootstrap.js','engine/contract.js','engine/core.js']){
  const text=read(file);
  assert.doesNotMatch(text,/waseshibu|rikkyo|早稲|立教|fyam8|workers\.dev/i,`${file} leaks a school/provider identity`);
}
const coreText=read('engine/core.js');
for(const token of ['localStorage','indexedDB','document.','navigator.','fetch('])assert.ok(!coreText.includes(token),`shared core must remain pure: ${token}`);

const manifest=JSON.parse(read('engine/manifest.json'));
assert.equal(manifest.name,'shared-english-engine');
assert.equal(manifest.contractVersion,1);
assert.deepEqual(manifest.artifactRoots,['engine/']);
assert.equal(manifest.schoolSpecificFilesExcluded,true);
assert.equal(manifest.consumerPolicy,'pinned-vendor-pr-only');
assert.equal(manifest.releaseGate,'waseda-parity-before-consumer-sync');
assert.equal(manifest.productionWiring,true);
assert.equal(manifest.importMergeDelegated,true);
assert.equal(manifest.aiWritingConfigDelegated,true);
assert.equal(manifest.dayRolloverDelegated,true);

const coreCtx={};coreCtx.window=coreCtx;coreCtx.globalThis=coreCtx;vm.createContext(coreCtx);
vm.runInContext(coreText,coreCtx,{filename:'engine/core.js'});
const core=coreCtx.ENGLISH_ENGINE_CORE;
for(const name of manifest.delegatedHelpers){
  assert.equal(typeof core?.[name],'function',`manifest delegated helper missing from core: ${name}`);
}
const coreKeys=Object.keys(core).sort(),manifestKeys=[...manifest.delegatedHelpers].sort();
assert.deepEqual(coreKeys,manifestKeys,'every exported shared-core helper must be declared in the manifest');

const schoolFiles=fs.readdirSync(path.join(root,'schools','waseshibu')).sort();
for(const required of ['compat.js','config.js','policy.js'])assert.ok(schoolFiles.includes(required),`missing Waseda school adapter file ${required}`);
const compat=read('schools/waseshibu/compat.js');
assert.match(compat,/Waseda compatibility bridge/);
assert.match(compat,/ENGLISH_ENGINE_COMPAT/);

const index=read('index.html');
const scriptPos=src=>index.indexOf(`<script src="${src}"></script>`);
for(const src of [
  'engine/core.js','learning-model.js','engine/contract.js','schools/waseshibu/config.js',
  'schools/waseshibu/policy.js','engine/bootstrap.js','app.js','schools/waseshibu/compat.js','progress-sync.js'
])assert.ok(scriptPos(src)>=0,`candidate load-order script missing: ${src}`);
assert.ok(scriptPos('engine/core.js')<scriptPos('learning-model.js'),'shared core must load before learning-model.js');
assert.ok(scriptPos('learning-model.js')<scriptPos('app.js'),'learning-model.js must load before app.js');
assert.ok(scriptPos('engine/contract.js')<scriptPos('schools/waseshibu/config.js'));
assert.ok(scriptPos('schools/waseshibu/config.js')<scriptPos('schools/waseshibu/policy.js'));
assert.ok(scriptPos('schools/waseshibu/policy.js')<scriptPos('engine/bootstrap.js'));
assert.ok(scriptPos('engine/bootstrap.js')<scriptPos('app.js'),'validated adapter must exist before app.js');
assert.ok(scriptPos('app.js')<scriptPos('schools/waseshibu/compat.js'),'compatibility bridge must load after app.js');
assert.ok(scriptPos('schools/waseshibu/compat.js')<scriptPos('progress-sync.js'),'progress sync must load after compatibility bridge');
assert.ok(!index.includes('engine/waseda-compat.js'),'school compatibility bridge must stay outside shared artifact');

const configCtx={};configCtx.window=configCtx;configCtx.globalThis=configCtx;vm.createContext(configCtx);
vm.runInContext(read('schools/waseshibu/config.js'),configCtx,{filename:'schools/waseshibu/config.js'});
const config=plain(configCtx.ENGLISH_SCHOOL_CONFIG);
assert.equal(config.schoolId,'waseshibu');
assert.equal(config.storage.key,'waseshibu.adaptive.v3');
assert.equal(config.storage.schemaVersion,8);
assert.equal(config.storage.syncDb,'waseshibu-progress-sync');
assert.equal(config.storage.syncDbVersion,7);
assert.equal(config.progress.appId,'english');
assert.equal(config.progress.endpoint,'https://waseshibu-progress-api.fyam8.workers.dev');
assert.deepEqual(config.exam.route,[2024,2023,2022,2021,2020,2019,2025,2026]);
assert.deepEqual(config.exam.goalTiers,[60,70,75]);
assert.equal(config.exam.writtenMaxScore,80);
assert.equal(config.exam.listeningMaxScore,20);
assert.equal(config.exam.totalMaxScore,100);
assert.deepEqual(config.aiWriting,{
  enabled:true,
  endpoint:'https://waseshibu-writing-grader.fyam8.workers.dev',
  skills:['writing_completion','summary','rebuttal']
});

const contractCtx={};contractCtx.window=contractCtx;contractCtx.globalThis=contractCtx;vm.createContext(contractCtx);
vm.runInContext(read('engine/contract.js'),contractCtx,{filename:'engine/contract.js'});
assert.equal(contractCtx.ENGLISH_ENGINE_CONTRACT.validateSchoolConfig(config).ok,true);

const app=read('app.js'),learning=read('learning-model.js'),sync=read('progress-sync.js');
for(const required of [
  'advanceRemediationMastery','buildRemediationDailyPlan','selectDailyLearningActionDescriptors',
  'selectPracticePool','reserveConfirmationIds','selectNextPracticeQuestion','rankPracticeQuestions',
  'practiceSessionStartDecision','createPracticeSessionState','applyPracticeQuestionState',
  'isExamAttemptComparable','interruptExamAttempt','scoreObjectiveQuestion','buildWrongWeaknessState',
  'markWeaknessesActuallyCorrect','decideDayRollover','applyDailyRolloverState',
  'mergeImportedLearningState'
])assert.ok(app.includes(`ENGLISH_ENGINE_CORE?.${required}`),`app runtime not wired to shared helper: ${required}`);
assert.ok(learning.includes('ENGLISH_ENGINE_CORE?.migrateLearningState'),'learning migration must use shared core');
for(const fallback of ['waseshibu.adaptive.v3','waseshibu-progress-sync','https://waseshibu-progress-api.fyam8.workers.dev'])assert.ok(sync.includes(fallback)||app.includes(fallback),`Waseda compatibility fallback missing: ${fallback}`);

assert.doesNotMatch(app,/https:\/\/fyam8\.github\.io\/waseshibu-english\/engine\//,'runtime must not live-import shared engine from Waseda Pages');
assert.doesNotMatch(index,/https:\/\/fyam8\.github\.io\/waseshibu-english\/engine\//,'page must use local pinned engine files');

console.log('Shared English engine final readiness audit: CLEAN');
