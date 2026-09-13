import fs from 'node:fs';
import assert from 'node:assert/strict';

const sync=fs.readFileSync(new URL('../progress-sync.js',import.meta.url),'utf8');
const index=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');

assert.match(sync,/APP_ID='english'/);
assert.match(sync,/STORAGE_KEY='waseshibu\.adaptive\.v3'/);
assert.match(sync,/SYNC_DB='waseshibu-progress-sync'/);
assert.match(sync,/SYNC_DB_VERSION=7/);
assert.match(sync,/state:summary/);
assert.match(sync,/state:latest-exam/);
assert.match(sync,/state:year:/);
assert.match(sync,/state:weakness/);
assert.match(sync,/state:retention/);
assert.match(sync,/state:drill/);
assert.match(sync,/maxScore:80/);
assert.match(sync,/progress\/snapshot/);
assert.match(sync,/events\/batch/);
assert.match(sync,/v1\/control/);
assert.match(sync,/getOrCreateRegistrationSeed/);
assert.match(sync,/collectionDisabled/);
assert.match(sync,/deadletter/);
assert.match(sync,/pagehide/);
assert.match(sync,/studying remains local-first/);
assert.match(sync,/payload:started\?\{year:String\(year\),completed\}:\{completed:false\}/);
assert.doesNotMatch(sync,/payload:started\?\{year:String\(year\),completed\}:\{year:String\(year\),completed:false\}/);
assert.doesNotMatch(sync,/S\.answers|S\.manual/);
assert.match(index,/<script src="app\.js"><\/script><script src="progress-sync\.js"><\/script>/);
assert.match(app,/const STORAGE_KEY="waseshibu\.adaptive\.v3"/);
assert.match(app,/SCHEMA_VERSION=8/);

console.log('English cloud progress sync guards: CLEAN');
