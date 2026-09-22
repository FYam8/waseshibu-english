import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const manifest=JSON.parse(read('ui/manifest.json'));

assert.equal(manifest.name,'shared-english-ui');
assert.equal(manifest.uiVersion,'1.2.0');
assert.equal(manifest.contractVersion,1);
assert.equal(manifest.runtimeWiring,true);
assert.equal(manifest.consumerPolicy,'pinned-vendor-pr-only');
assert.equal(manifest.releaseGate,'waseda-ui-parity-before-consumer-sync');

const uiFiles=fs.readdirSync(path.join(root,'ui')).sort();
assert.deepEqual(uiFiles,['answer-widgets.js','base.css','components.js','contract.js','exam-session.js','manifest.json','shell.js']);
for(const file of ['ui/answer-widgets.js','ui/base.css','ui/components.js','ui/contract.js','ui/shell.js','ui/exam-session.js']){
  assert.doesNotMatch(read(file),/waseshibu|rikkyo|早稲|立教|fyam8|workers\.dev/i,file+' leaks school/provider identity');
}
assert.doesNotMatch(read('ui/base.css'),/\.A\{|\.B\{|\.C\{/,'Waseda strategy CSS leaked into shared UI');

const ctx={};ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);
vm.runInContext(read('ui/components.js'),ctx,{filename:'ui/components.js'});
const keys=Object.keys(ctx.ENGLISH_UI_COMPONENTS).sort();
assert.deepEqual(keys,[...manifest.sharedComponents].sort(),'manifest component list must equal runtime exports');

const index=read('index.html');
for(const src of ['ui/contract.js','schools/waseshibu/ui.js','ui/shell.js','ui/components.js'])assert.ok(index.includes('src="'+src+'"'),src+' missing from Waseda candidate');
assert.ok(index.indexOf('src="ui/components.js"')<index.indexOf('src="app.js"'),'Shared UI components must load before app.js');
assert.ok(index.includes('href="ui/base.css"'));
assert.ok(index.includes('href="schools/waseshibu/theme.css"'));
assert.ok(index.includes('href="schools/waseshibu/ui-compat.css"'));
assert.ok(!index.includes('href="styles.css"'),'legacy CSS must not double-load');
assert.ok(index.includes('ENGLISH_UI_SHELL.mount(window.ENGLISH_SCHOOL_UI)'));
assert.doesNotMatch(index,/https:\/\/fyam8\.github\.io\/waseshibu-english\/ui\//,'must not live-import UI from Waseda Pages');

const app=read('app.js');
for(const helper of ['metricCard','progressBar','completionMark','routeStepCard','todayCard','weaknessCard','drillCard','attemptBar','answerPanel','paperPage','backupPanel']){
  assert.ok(app.includes('SHARED_UI_COMPONENTS?.'+helper),'Waseda app not delegated to '+helper);
}
for(const schoolFile of ['schools/waseshibu/ui.js','schools/waseshibu/theme.css','schools/waseshibu/ui-compat.css'])assert.ok(fs.existsSync(path.join(root,schoolFile)),schoolFile+' missing');

console.log('Shared English UI final readiness: CLEAN');
