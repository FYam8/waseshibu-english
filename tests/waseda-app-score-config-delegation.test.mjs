import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

function read(path){return fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8')}
function functionSource(source,name){
  const marker=`function ${name}(`,start=source.indexOf(marker);assert.ok(start>=0,`missing function ${name}`);
  const brace=source.indexOf('{',start);let depth=0;
  for(let i=brace;i<source.length;i++){if(source[i]==='{')depth++;else if(source[i]==='}'&&--depth===0)return source.slice(start,i+1)}
  throw new Error(`unterminated function ${name}`);
}
function plain(value){return JSON.parse(JSON.stringify(value))}

const app=read('app.js');
assert.match(app,/WRITTEN_MAX_SCORE=Number\(SCHOOL_EXAM_CONFIG\?\.writtenMaxScore\)\|\|80/);
assert.match(app,/LISTENING_MAX_SCORE=Number\.isFinite\(Number\(SCHOOL_EXAM_CONFIG\?\.listeningMaxScore\)\)&&Number\(SCHOOL_EXAM_CONFIG\.listeningMaxScore\)>=0\?Number\(SCHOOL_EXAM_CONFIG\.listeningMaxScore\):20/);
assert.match(app,/TOTAL_MAX_SCORE=Number\(SCHOOL_EXAM_CONFIG\?\.totalMaxScore\)\|\|WRITTEN_MAX_SCORE\+LISTENING_MAX_SCORE/);

const initStart=app.indexOf('const INIT=');assert.ok(initStart>=0,'INIT declaration missing');
const initEnd=app.indexOf(';',initStart);assert.ok(initEnd>initStart,'INIT terminator missing');
const prefix=app.slice(0,initEnd+1);
function evaluate(adapter){
  const ctx={};ctx.window=ctx;ctx.globalThis=ctx;ctx.EXAM_DATA={};ctx.PAPERS={};ctx.DRILLS=[];ctx.FALLBACK={};if(adapter)ctx.ENGLISH_ENGINE_ADAPTER=adapter;vm.createContext(ctx);
  vm.runInContext(`${prefix}\nglobalThis.__score={written:WRITTEN_MAX_SCORE,listening:LISTENING_MAX_SCORE,total:TOTAL_MAX_SCORE};`,ctx);
  return plain(ctx.__score);
}
const fake={config:{exam:{route:[2030],dailyTaskTarget:4,goalTiers:[90,110],defaultGoal:90,defaultYear:2030,writtenMaxScore:120,listeningMaxScore:30,totalMaxScore:150}}};
assert.deepEqual(evaluate(fake),{written:120,listening:30,total:150});
assert.deepEqual(evaluate(null),{written:80,listening:20,total:100});

const setListeningScore=functionSource(app,'setListeningScore');
const goalStatus=functionSource(app,'goalStatus');
const ctx={S:{attempts:[{id:'x',writtenScore:100,listeningScore:null,totalScore:null}]},LISTENING_MAX_SCORE:30,TOTAL_MAX_SCORE:150,save(){},render(){}};ctx.globalThis=ctx;vm.createContext(ctx);
vm.runInContext(`${setListeningScore}\n${goalStatus}\nglobalThis.api={setListeningScore,goalStatus}`,ctx);
ctx.api.setListeningScore('x','40');
assert.equal(ctx.S.attempts[0].listeningScore,30);
assert.equal(ctx.S.attempts[0].totalScore,130);
assert.equal(ctx.api.goalStatus({writtenScore:100,listeningScore:25},110),'到達（125/150）');
assert.equal(ctx.api.goalStatus({writtenScore:85,listeningScore:null},110),'リスニング25/30以上が必要');
assert.equal(ctx.api.goalStatus({writtenScore:70,listeningScore:null},110),'現在の筆記点では到達不可');

const validateImport=functionSource(app,'validateImport');
assert.match(validateImport,/written>WRITTEN_MAX_SCORE/);
assert.match(validateImport,/Number\(listening\)>LISTENING_MAX_SCORE/);
const result=functionSource(app,'result'),stats=functionSource(app,'stats'),exam=functionSource(app,'exam'),home=functionSource(app,'home'),route=functionSource(app,'route');
assert.match(result,/writtenScore\}\/\$\{WRITTEN_MAX_SCORE\}/);
assert.match(result,/total\}\/\$\{TOTAL_MAX_SCORE\}/);
assert.match(result,/max=\$\{LISTENING_MAX_SCORE\}/);
assert.match(stats,/writtenScore\}\/\$\{WRITTEN_MAX_SCORE\}/);
assert.match(stats,/totalScore\}\/\$\{TOTAL_MAX_SCORE\}/);
assert.match(exam,/筆記\$\{WRITTEN_MAX_SCORE\}点/);
assert.match(home,/last\.score\}\/\$\{WRITTEN_MAX_SCORE\}/);
assert.match(route,/last\.writtenScore\}\/\$\{WRITTEN_MAX_SCORE\}/);

console.log('Waseda app score-model config delegation: CLEAN');
