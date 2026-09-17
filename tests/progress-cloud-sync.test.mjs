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

// Unstarted years must not become "started" merely because a state row exists.
assert.match(sync,/payload:started\?\{year:String\(year\),completed\}:\{completed:false\}/);
assert.doesNotMatch(sync,/payload:started\?\{year:String\(year\),completed\}:\{year:String\(year\),completed:false\}/);

// From-now production needs occurrence rows because cumulative state:* rows are excluded formally.
assert.match(sync,/function buildOccurrenceRecords/);
assert.match(sync,/history:exam:/);
assert.match(sync,/history:drill:/);
assert.match(sync,/exam_started/);
assert.match(sync,/exam_interrupted/);
assert.match(sync,/drill_answered/);
assert.match(sync,/correct:d\.ok\?1:0/);
assert.match(sync,/reg\?\.status!=='production'/);
assert.match(sync,/occurrenceSignature:/);
assert.match(sync,/active:active\?\[active\.id,'active',active\.startedAt,active\.year\]:null/);
assert.match(sync,/Object\.assign\(reg,next\)/);
assert.match(sync,/flushAvailable/);

// Current-state counts remain semantically valid and include an active exam session.
assert.match(sync,/total:weak\.length,correct:mastered\.length/);
assert.doesNotMatch(sync,/total:activeWeak\.length,correct:mastered\.length/);
assert.match(sync,/active\?\.startedAt/);

// State timestamps change every reconciliation; they must not create timestamp-only revisions.
assert.match(sync,/canonicalJson\(\{eventType:record\.eventType,payload:record\.payload\}\)/);
assert.doesNotMatch(sync,/canonicalJson\(\{eventType:record\.eventType,occurredAt:record\.occurredAt,payload:record\.payload\}\)/);

// If control changes to revoked/ignored during baseline, stop before growing the outbox.
assert.match(sync,/await uploadBaseline\(reg\);if\(await getControl\('syncRevoked'\)\|\|await getControl\('collectionDisabled'\)\)return/);

// Reading local answers is allowed for counts/year-start detection, but raw answer maps must never be uploaded.
assert.doesNotMatch(sync,/\banswers\s*:/);
assert.doesNotMatch(sync,/\bmanual\s*:/);

const appScriptPos=index.indexOf('<script src="app.js"></script>');
const syncScriptPos=index.indexOf('<script src="progress-sync.js"></script>');
assert.ok(appScriptPos>=0,'app.js must be loaded');
assert.ok(syncScriptPos>appScriptPos,'progress-sync.js must load after app.js and any compatibility bridge');
assert.match(app,/const STORAGE_KEY="waseshibu\.adaptive\.v3"/);
assert.match(app,/SCHEMA_VERSION=8/);

console.log('English cloud progress sync guards: CLEAN');
