import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
const initMarker='const INIT=';
const initStart=app.indexOf(initMarker);assert.ok(initStart>=0,'INIT declaration not found');
const initEnd=app.indexOf(';',initStart);assert.ok(initEnd>initStart,'INIT declaration terminator not found');
const prefix=app.slice(0,initEnd+1);

assert.match(prefix,/SCHOOL_EXAM_CONFIG=window\.ENGLISH_ENGINE_ADAPTER\?\.config\?\.exam\|\|null/);
assert.match(prefix,/DAILY_TASK_TARGET=Number\(SCHOOL_EXAM_CONFIG\?\.dailyTaskTarget\)\|\|10/);
assert.match(prefix,/ROUTE=Array\.isArray\(SCHOOL_EXAM_CONFIG\?\.route\)\?\[\.\.\.SCHOOL_EXAM_CONFIG\.route\]:\[2024,2023,2022,2021,2020,2019,2025,2026\]/);
assert.match(prefix,/DEFAULT_GOAL=Number\(SCHOOL_EXAM_CONFIG\?\.defaultGoal\)\|\|60/);
assert.match(prefix,/DEFAULT_YEAR=Number\(SCHOOL_EXAM_CONFIG\?\.defaultYear\)\|\|2024/);
assert.match(prefix,/goal:DEFAULT_GOAL,year:DEFAULT_YEAR/);

const fakeExam={route:[2030,2031],dailyTaskTarget:7,defaultGoal:70,defaultYear:2030};
const ctx={window:{EXAM_DATA:{},PAPERS:{},DRILLS:[],FALLBACK:{},ENGLISH_ENGINE_ADAPTER:{config:{exam:fakeExam}}}};ctx.globalThis=ctx;vm.createContext(ctx);
vm.runInContext(`${prefix}\nglobalThis.__runtime={route:ROUTE,daily:DAILY_TASK_TARGET,goal:DEFAULT_GOAL,year:DEFAULT_YEAR,initGoal:INIT.goal,initYear:INIT.year}`,ctx);
assert.deepEqual(JSON.parse(JSON.stringify(ctx.__runtime.route)),fakeExam.route);
assert.equal(ctx.__runtime.daily,7);
assert.equal(ctx.__runtime.goal,70);
assert.equal(ctx.__runtime.year,2030);
assert.equal(ctx.__runtime.initGoal,70);
assert.equal(ctx.__runtime.initYear,2030);

const fallbackCtx={window:{EXAM_DATA:{},PAPERS:{},DRILLS:[],FALLBACK:{}}};fallbackCtx.globalThis=fallbackCtx;vm.createContext(fallbackCtx);
vm.runInContext(`${prefix}\nglobalThis.__runtime={route:ROUTE,daily:DAILY_TASK_TARGET,goal:DEFAULT_GOAL,year:DEFAULT_YEAR}`,fallbackCtx);
assert.deepEqual(JSON.parse(JSON.stringify(fallbackCtx.__runtime.route)),[2024,2023,2022,2021,2020,2019,2025,2026]);
assert.equal(fallbackCtx.__runtime.daily,10);assert.equal(fallbackCtx.__runtime.goal,60);assert.equal(fallbackCtx.__runtime.year,2024);

console.log('Waseda low-risk runtime config delegation: CLEAN');
