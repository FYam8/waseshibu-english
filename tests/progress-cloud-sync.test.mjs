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

// From-now production needs immutable occurrence rows because state:* rows are cumulative.
assert.match(sync,/function buildOccurrenceRecords/);
assert.match(sync,/history:exam:/);
assert.match(sync,/history:drill:/);
assert.match(sync,/exam_interrupted/);
assert.match(sync,/drill_answered/);
assert.match(sync,/correct:d\.ok\?1:0/);
assert.match(sync,/reg\?\.status!=='production'/);
assert.match(sync,/occurrenceSignature:/);
assert.match(sync,/Object\.assign\(reg,next\)/);
assert.match(sync,/flushAvailable/);

// Current-state counts remain semantically valid and include an active exam session.
assert.match(sync,/total:weak\.length,correct:mastered\.length/);
assert.doesNotMatch(sync,/total:activeWeak\.length,correct:mastered\.length/);
assert.match(sync,/activeAttempt\?\.startedAt/);

// State timestamps change every reconciliation; they must not create timestamp-only revisions.
assert.match(sync,/canonicalJson\(\{eventType:record\.eventType,payload:record\.payload\}\)/);
assert.doesNotMatch(sync,/canonicalJson\(\{eventType:record\.eventType,occurredAt:record\.occurredAt,payload:record\.payload\}\)/);

// Reading local answers is allowed for counts/year-start detection, but raw answer maps must never be uploaded.
assert.doesNotMatch(sync,/\banswers\s*:/);
assert.doesNotMatch(sync,/\bmanual\s*:/);

assert.match(index,/<script src="app\.js"><\/script><script src="progress-sync\.js"><\/script>/);
assert.match(app,/const STORAGE_KEY="waseshibu\.adaptive\.v3"/);
assert.match(app,/SCHEMA_VERSION=8/);

console.log('English cloud progress sync guards: CLEAN');
