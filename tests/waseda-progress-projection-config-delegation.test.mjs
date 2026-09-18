import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

function read(path){return fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8')}
function plain(value){return JSON.parse(JSON.stringify(value))}
const source=read('progress-sync.js');

assert.match(source,/SCHOOL_EXAM_CONFIG=window\.ENGLISH_ENGINE_ADAPTER\?\.config\?\.exam\|\|null/,'exam projection adapter missing');
assert.match(source,/SYNC_YEARS=typeof SCHOOL_EXAM_CONFIG!=='undefined'&&Array\.isArray\(SCHOOL_EXAM_CONFIG\?\.years\)\?\[\.\.\.SCHOOL_EXAM_CONFIG\.years\]:\[2019,2020,2021,2022,2023,2024,2025,2026\]/);
assert.match(source,/SYNC_GOAL_TIERS=typeof SCHOOL_EXAM_CONFIG!=='undefined'&&Array\.isArray\(SCHOOL_EXAM_CONFIG\?\.goalTiers\)\?\[\.\.\.SCHOOL_EXAM_CONFIG\.goalTiers\]:\[60,70,75\]/);
assert.match(source,/SYNC_DEFAULT_GOAL=typeof SCHOOL_EXAM_CONFIG!=='undefined'&&Number\.isFinite\(Number\(SCHOOL_EXAM_CONFIG\?\.defaultGoal\)\)\?Number\(SCHOOL_EXAM_CONFIG\.defaultGoal\):60/);
assert.match(source,/SYNC_WRITTEN_MAX=typeof SCHOOL_EXAM_CONFIG!=='undefined'\?Number\(SCHOOL_EXAM_CONFIG\?\.writtenMaxScore\)\|\|80:80/);
assert.match(source,/function syncGoal\(s\)\{const goal=Number\(s\?\.goal\);return SYNC_GOAL_TIERS\.includes\(goal\)\?goal:SYNC_DEFAULT_GOAL\}/);
assert.match(source,/maxScore:SYNC_WRITTEN_MAX/);
assert.match(source,/for\(const year of SYNC_YEARS\)/);
assert.match(source,/progressLabel:`\$\{APP_ID\} target \$\{syncGoal\(s\)\}`/);

const start=source.indexOf('function validIso(v)');
const end=source.indexOf('async function queueRecord',start);
assert.ok(start>=0&&end>start,'projection block missing');
const block=source.slice(start,end);
const RealDate=Date,fixedNow=new RealDate('2032-05-01T12:00:00.000Z');
class FixedDate extends RealDate{
  constructor(...args){super(...(args.length?args:[fixedNow.getTime()]))}
  static now(){return fixedNow.getTime()}
}
function projection(examConfig,appId='rikkyo-english'){
  const ctx={Date:FixedDate,SCHOOL_EXAM_CONFIG:examConfig,APP_ID:appId};ctx.globalThis=ctx;vm.createContext(ctx);
  vm.runInContext(`
function canonicalize(v){return Array.isArray(v)?v.map(canonicalize):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonicalize(v[k])])):v}
const canonicalJson=v=>JSON.stringify(canonicalize(v));
${block}
globalThis.__projection={buildOccurrenceRecords,buildStateRecords,drillYear,syncGoal,SYNC_YEARS,SYNC_GOAL_TIERS,SYNC_DEFAULT_GOAL,SYNC_WRITTEN_MAX};
`,ctx);
  return ctx.__projection;
}

const fake={years:[2030,2032],goalTiers:[50,55],defaultGoal:50,writtenMaxScore:120};
const p=projection(fake);
assert.deepEqual(plain(p.SYNC_YEARS),[2030,2032]);
assert.deepEqual(plain(p.SYNC_GOAL_TIERS),[50,55]);
assert.equal(p.SYNC_DEFAULT_GOAL,50);
assert.equal(p.SYNC_WRITTEN_MAX,120);
assert.equal(p.syncGoal({goal:55}),55);
assert.equal(p.syncGoal({goal:999}),50);
assert.equal(p.drillYear({key:'2032:q:main'}),'2032');
assert.equal(p.drillYear({key:'2024:q:main'}),null);

const fixture={
  goal:55,
  attempts:[{id:'x1',year:2030,status:'graded',mode:'timed',writtenScore:90,gradedAt:'2032-04-29T10:00:00.000Z'}],
  currentAttempt:{id:'x2',year:2032,status:'active',mode:'timed',startedAt:'2032-05-01T10:00:00.000Z'},
  drillLog:[{key:'2032:q:main',q:'d1',skill:'reason',ok:false,at:'2032-04-30T09:00:00.000Z'}],
  weak:{w:{status:'active',category:'理由'}},
  answers:{'2030:q':'a'},manual:{'2032:q':{score:1}}
};
const occurrences=plain(p.buildOccurrenceRecords(fixture));
assert.equal(occurrences[0].payload.maxScore,120);
assert.equal(occurrences[0].payload.score,90);
assert.equal(occurrences[1].eventType,'exam_started');
assert.deepEqual(occurrences[2].payload,{year:'2032',kind:'remediation-drill',skill:'reason',questionId:'d1',correct:0,total:1,completed:true});

const states=plain(p.buildStateRecords(fixture));
assert.deepEqual(states.filter(x=>x.sourceRecordId.startsWith('state:year:')).map(x=>x.sourceRecordId),['state:year:2030','state:year:2032']);
const byId=Object.fromEntries(states.map(x=>[x.sourceRecordId,x]));
assert.equal(byId['state:summary'].payload.kind,'target-55');
assert.equal(byId['state:latest-exam'].payload.maxScore,120);
assert.equal(byId['state:year:2030'].payload.completed,true);
assert.equal(byId['state:year:2032'].payload.completed,false);
assert.equal(p.buildStateRecords({...fixture,goal:999})[0].payload.kind,'target-50');

const fallback=projection(undefined,'english');
assert.deepEqual(plain(fallback.SYNC_YEARS),[2019,2020,2021,2022,2023,2024,2025,2026]);
assert.deepEqual(plain(fallback.SYNC_GOAL_TIERS),[60,70,75]);
assert.equal(fallback.SYNC_DEFAULT_GOAL,60);
assert.equal(fallback.SYNC_WRITTEN_MAX,80);

console.log('Waseda progress projection school-config delegation: CLEAN');
