import fs from 'node:fs';
import vm from 'node:vm';
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

const app=read('app.js');
const index=read('index.html');

// The existing Waseda written paper is an 80-point component for every routed year.
const scripts=[...index.matchAll(/<script\s+src="([^"]+)"/g)].map(x=>x[1]);
const dataScripts=scripts.slice(0,scripts.indexOf('engine/contract.js')).filter(x=>!x.startsWith('engine/')&&!x.startsWith('schools/'));
const dataCtx={console};dataCtx.window=dataCtx;dataCtx.globalThis=dataCtx;vm.createContext(dataCtx);
for(const script of dataScripts){
  try{vm.runInContext(read(script),dataCtx,{filename:script})}catch(error){throw new Error(`score-model data script failed: ${script}: ${error.message}`)}
}
const route=[2024,2023,2022,2021,2020,2019,2025,2026];
for(const year of route){
  const rows=dataCtx.EXAM_DATA?.[year]||[];
  assert.ok(rows.length,`${year}: missing exam rows`);
  const total=rows.reduce((sum,q)=>sum+(Number(q.points)||0),0);
  assert.equal(total,80,`${year}: written points no longer total 80`);
}

// Listening is a 20-point component and total score is the same attempt's written + listening.
const setListening=functionSource(app,'setListeningScore');
const goalStatus=functionSource(app,'goalStatus');
const ctx={S:{attempts:[{id:'a',writtenScore:72,listeningScore:null,totalScore:null}]},save(){},render(){}};ctx.globalThis=ctx;vm.createContext(ctx);
vm.runInContext(`${setListening}\n${goalStatus}\nglobalThis.api={setListeningScore,goalStatus}`,ctx);
ctx.api.setListeningScore('a','15');
assert.equal(ctx.S.attempts[0].listeningScore,15);assert.equal(ctx.S.attempts[0].totalScore,87);
ctx.api.setListeningScore('a','25');
assert.equal(ctx.S.attempts[0].listeningScore,20,'listening score must remain capped at 20');assert.equal(ctx.S.attempts[0].totalScore,92);
ctx.api.setListeningScore('a','');
assert.equal(ctx.S.attempts[0].listeningScore,null);assert.equal(ctx.S.attempts[0].totalScore,null);
assert.equal(ctx.api.goalStatus({writtenScore:50,listeningScore:15},60),'到達（65/100）');
assert.equal(ctx.api.goalStatus({writtenScore:50,listeningScore:null},60),'リスニング10/20以上が必要');
assert.equal(ctx.api.goalStatus({writtenScore:30,listeningScore:null},60),'現在の筆記点では到達不可');

// Import validation and user-visible score labels are intentionally frozen before extraction.
const validateImport=functionSource(app,'validateImport');
assert.match(validateImport,/written>80/,'import written-score ceiling changed');
assert.match(validateImport,/Number\(listening\)>20/,'import listening-score ceiling changed');
const result=functionSource(app,'result');
assert.match(result,/writtenScore\}\/80/,'result written score denominator changed');
assert.match(result,/リスニング得点[\s\S]*?\/20/,'result listening denominator changed');
assert.match(result,/total\}\/100/,'result total score denominator changed');
const stats=functionSource(app,'stats');
assert.match(stats,/writtenScore\}\/80/,'stats written score denominator changed');
assert.match(stats,/totalScore\}\/100/,'stats total score denominator changed');

const sync=read('progress-sync.js');
if(sync.includes('const SYNC_WRITTEN_MAX=')){
  assert.match(sync,/SYNC_WRITTEN_MAX=Number\(SCHOOL_EXAM_CONFIG\?\.writtenMaxScore\)\|\|80/,'cloud progress written max fallback changed');
  assert.match(sync,/maxScore:SYNC_WRITTEN_MAX/,'cloud progress must use configured written max');
}else assert.match(sync,/maxScore:80/,'cloud progress written max score changed');

console.log('Waseda 80+20=100 score-model characterization: CLEAN');
