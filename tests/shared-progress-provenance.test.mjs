import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const lock=JSON.parse(read('shared-progress-candidate.json'));
assert.equal(lock.repository,'FYam8/waseshibu-progress-cloud');
assert.match(lock.commit,/^[a-f0-9]{40}$/);
assert.equal(lock.sourcePath,'src/client/progress-transport.js');
assert.equal(lock.localPath,'shared-progress-transport.js');
assert.equal(createHash('sha256').update(read(lock.localPath)).digest('hex'),lock.sha256,'Update from the upstream source; do not edit the vendored transport');
const html=read('index.html');
assert.ok(html.indexOf('src="shared-progress-transport.js"')>=0);
assert.ok(html.indexOf('src="shared-progress-transport.js"')<html.indexOf('src="progress-sync.js"'));
// A failed shared script load must not prevent local learning or write learner state.
vm.runInNewContext(read('progress-sync.js'),{window:{},localStorage:{getItem:()=>null},TextEncoder});
console.log('Shared transport provenance, load order and missing-script fallback PASS');
