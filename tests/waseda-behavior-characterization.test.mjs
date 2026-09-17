import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

function read(path){return fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8')}
function functionSource(source,name){
  const marker=`function ${name}(`,start=source.indexOf(marker);
  assert.ok(start>=0,`missing function ${name}`);
  const brace=source.indexOf('{',start);assert.ok(brace>=0,`missing body for ${name}`);
  let depth=0;
  for(let i=brace;i<source.length;i++){
    if(source[i]==='{')depth++;
    else if(source[i]==='}'&&--depth===0)return source.slice(start,i+1);
  }
  throw new Error(`unterminated function ${name}`);
}
function before(haystack,a,b,label){
  const ai=haystack.indexOf(a),bi=haystack.indexOf(b);
  assert.ok(ai>=0,`${label}: missing ${a}`);assert.ok(bi>=0,`${label}: missing ${b}`);assert.ok(ai<bi,`${label}: expected ${a} before ${b}`);
}
function compact(s){return s.replace(/\s+/g,'')}
function hash(values){return crypto.createHash('sha256').update(values.join('\n')).digest('hex')}
function plain(value){return JSON.parse(JSON.stringify(value))}

const BASELINE=Object.freeze({
  examIdCount:167,
  examIdSha256:'f4d22a1214fe3415f964835c747aba4acf0dbfb1b3181f1b5e9675b0adf5d809',
  activeDrillCount:283,
  activeDrillIdSha256:'bbb7939ceefa3b82578604c508d58aa5dd5182c86670ed7a940b192bf1c38e8f'
});

const app=read('app.js');

// Fresh-state and route baseline. The Waseda adapter is now the canonical candidate source,
// while app.js must retain exact legacy fallbacks until the migration is complete.
const configCtx={};configCtx.globalThis=configCtx;configCtx.window=configCtx;vm.createContext(configCtx);vm.runInContext(read('schools/waseshibu/config.js'),configCtx,{filename:'schools/waseshibu/config.js'});
const examConfig=configCtx.ENGLISH_SCHOOL_CONFIG.exam;
assert.deepEqual(plain(examConfig.route),[2024,2023,2022,2021,2020,2019,2025,2026]);
assert.equal(examConfig.defaultGoal,60);assert.equal(examConfig.defaultYear,2024);assert.equal(examConfig.dailyTaskTarget,10);assert.equal(examConfig.writtenMaxScore,80);
assert.match(app,/\[2024,2023,2022,2021,2020,2019,2025,2026\]/,'Waseda route fallback must remain present during config migration');
assert.match(app,/goal:(?:60|DEFAULT_GOAL),year:(?:2024|DEFAULT_YEAR),/,'fresh-state defaults changed');
assert.match(app,/DAILY_TASK_TARGET[^;]*10/,'daily target fallback changed');

// Evaluate the small current policy helpers directly from the production source.
const policyNames=['strategyPriority','gradeInGoal','goalLabel','goalAdvice','routeRole','priorityOrder'];
const policySource=policyNames.map(name=>functionSource(app,name)).join('\n');
const pctx={S:{goal:60}};pctx.globalThis=pctx;vm.createContext(pctx);vm.runInContext(`${policySource}\nglobalThis.__policy={${policyNames.join(',')}}`,pctx);
const p=pctx.__policy;
assert.equal(p.strategyPriority({priority:'A',skill:'detail'}),'A');
assert.equal(p.strategyPriority({skill:'insertion'}),'C');
assert.equal(p.strategyPriority({skill:'reason'}),'B');
assert.equal(p.gradeInGoal('A',60),true);assert.equal(p.gradeInGoal('B',60),false);
assert.equal(p.gradeInGoal('B',70),true);assert.equal(p.gradeInGoal('C',70),false);assert.equal(p.gradeInGoal('C',75),true);
assert.deepEqual(['A','B','C','X'].map(x=>p.priorityOrder({priority:x})),[0,1,2,3]);
assert.equal(p.routeRole(2024),'初見診断');assert.equal(p.routeRole(2025),'実戦確認');assert.equal(p.routeRole(2026),'最終判定');assert.equal(p.routeRole(2023),'弱点補強');
assert.equal(p.goalLabel(60),'A 60点');assert.equal(p.goalLabel(70),'B 70点');assert.equal(p.goalLabel(75),'C 75点');

// Today ordering: due retention first, then an in-progress weakness, active exam resume,
// untouched active weakness, route, and only then an out-of-goal upgrade suggestion.
const actions=functionSource(app,'availableLearningActions');
before(actions,'if(due[0])','if(progressed[0])','Today action ordering');
before(actions,'if(progressed[0])','if(S.currentAttempt?.status==="active")','Today action ordering');
before(actions,'if(S.currentAttempt?.status==="active")','if(other[0])','Today action ordering');
before(actions,'if(other[0])','const y=nextRouteYear()','Today action ordering');
before(actions,'const y=nextRouteYear()','const outside=activeWeak()','Today action ordering');
const todayAction=functionSource(app,'todayAction');
assert.match(todayAction,/drillState\?\.key.*return \{kind:"resume"/s,'an unfinished drill must win over other Today actions');

// Daily planning distinguishes available weaknesses, waiting-for-retention, route work, and completion.
const plan=compact(functionSource(app,'ensureDailyPlan'));
assert.ok(plan.includes('kind:"weak"'));assert.ok(plan.includes('kind:"waiting"'));assert.ok(plan.includes('kind:"route"'));assert.ok(plan.includes('kind:"complete"'));
assert.match(app,/function eligibleToday\(\[_?,?w\]\)\{return w\.status==="active"\|\|\(w\.status==="pending"&&\(!w\.next\|\|w\.next<=today\(\)\)\)\}/);

// Starting a weakness may not bypass an unfinished drill or start next-day confirmation early.
const start=functionSource(app,'startSkill');
assert.match(start,/drillState\?\.key&&drillState\.key!==key.*別の克服ドリルが途中/s);
assert.match(start,/w\.status==="pending"&&w\.next>today\(\).*予定日までは開始できません/s);
assert.match(start,/mode:w\.status==="pending"\?"confirm":"train"/);
assert.match(start,/families\.size<5.*即時3問＋翌日2問を別問題で確保できない/s);

// The present mastery state machine is the core parity target: immediate 3, next-day 2,
// wrong answers reset the active streak, and a failed confirmation returns to training.
const finish=compact(functionSource(app,'finishDrill'));
for(const required of [
  'if(ok)w.streak=(w.streak||0)+1;elsew.streak=0;',
  'if(w.streak>=3){w.status="pending";w.next=plusDays(1);w.confirmStreak=0}',
  'if(ok)w.confirmStreak=(w.confirmStreak||0)+1;',
  'w.confirmStreak=0;w.status="active";w.streak=0;w.next=today();w.reservedConfirm=[];drillState.mode="train";drillState.used=[];drillState.failedConfirmation=true;',
  'if(w.confirmStreak>=2){w.status="mastered";'
])assert.ok(finish.includes(required),`mastery baseline changed: ${required}`);

// Confirmation questions are reserved separately from training families.
const next=compact(functionSource(app,'nextDrill'));
assert.ok(next.includes('drillState.mode==="confirm"?pool.filter(x=>reserved.includes(x.id)&&!drillState.used.includes(x.id)):pool.filter(x=>!reservedFamilies.has(x.familyId)&&!drillState.used.includes(x.id))'));
assert.ok(next.includes('constmax=(w.streak||0)>=2?3:2;'));

// Existing migration/recovery semantics are frozen before persistence extraction.
assert.match(app,/for\(const key of \[STORAGE_KEY,\.\.\.LEGACY_KEYS,\.\.\.recoveryCandidates\(\)\]\)/);
assert.match(app,/if\(fromVersion===7&&next\.dailyPlan\?\.date.*next\.dailyProgress=/s);
assert.match(app,/if\(fromVersion<7\)next\.dailyPlan=null/);
assert.match(app,/if\(next\.currentAttempt\?\.mode==="targeted"\)\{next\.currentAttempt\.mode="untimed";next\.currentAttempt\.interrupted=true\}/);

// Backup/import behavior: app identity, checksum validation, pre-import recovery and three-generation retention.
const exportFn=functionSource(app,'exportData');
assert.match(exportFn,/appId:"waseshibu-english-adaptive"/);assert.match(exportFn,/stateChecksum:stateChecksum\(S\)/);
const importValidate=functionSource(app,'validateImport');
assert.match(importValidate,/payload\.appId!=="waseshibu-english-adaptive"/);assert.match(importValidate,/payload\.stateChecksum&&payload\.stateChecksum!==stateChecksum\(payload\.state\)/);
const preImport=functionSource(app,'savePreImportRecovery');assert.match(preImport,/keys\.slice\(3\)\.forEach/);
const mergeImport=functionSource(app,'mergeImportedState');
assert.match(mergeImport,/currentAttempt\.id!==incoming\.currentAttempt\.id/);assert.match(mergeImport,/recoveredFromImport:true/);assert.match(mergeImport,/recoveredDrills\.push/);

// Load the same pre-app data scripts as index.html to freeze stable IDs before extraction.
const index=read('index.html');
const scripts=[...index.matchAll(/<script\s+src="([^"]+)"/g)].map(x=>x[1]);
const dataScripts=scripts.slice(0,scripts.indexOf('app.js')).filter(x=>!x.startsWith('schools/')&&!x.startsWith('engine/'));
const ctx={console};ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);
for(const script of dataScripts){
  const code=read(script);
  try{vm.runInContext(code,ctx,{filename:script})}catch(error){throw new Error(`data baseline script failed: ${script}: ${error.message}`)}
}
const examIds=Object.entries(ctx.EXAM_DATA||{}).flatMap(([year,rows])=>rows.map(q=>`${year}:${q.id}`)).sort();
const activeDrillIds=(ctx.DRILLS||[]).filter(q=>!q.retired).map(q=>String(q.id)).sort();
assert.equal(new Set(examIds).size,examIds.length,'exam stable IDs must be unique');
assert.equal(new Set(activeDrillIds).size,activeDrillIds.length,'active drill IDs must be unique');
assert.equal(examIds.length,BASELINE.examIdCount,'exam stable-ID count changed');
assert.equal(hash(examIds),BASELINE.examIdSha256,'exam stable-ID set changed');
assert.equal(activeDrillIds.length,BASELINE.activeDrillCount,'active drill count changed');
assert.equal(hash(activeDrillIds),BASELINE.activeDrillIdSha256,'active drill stable-ID set changed');

console.log(JSON.stringify({ok:true,...BASELINE},null,2));
