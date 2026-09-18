import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

function read(path){return fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8')}
function functionSource(source,name){
  const marker=`function ${name}(`,start=source.indexOf(marker);
  assert.ok(start>=0,`missing function ${name}`);
  const brace=source.indexOf('{',start);assert.ok(brace>=0);
  let depth=0,inSingle=false,inDouble=false,inTemplate=false,escaped=false;
  for(let i=brace;i<source.length;i++){
    const ch=source[i];
    if(escaped){escaped=false;continue}
    if(ch==='\\'){escaped=true;continue}
    if(!inDouble&&!inTemplate&&ch==="'"){inSingle=!inSingle;continue}
    if(!inSingle&&!inTemplate&&ch==='"'){inDouble=!inDouble;continue}
    if(!inSingle&&!inDouble&&ch==='`'){inTemplate=!inTemplate;continue}
    if(inSingle||inDouble||inTemplate)continue;
    if(ch==='{')depth++;
    else if(ch==='}'&&--depth===0)return source.slice(start,i+1);
  }
  throw new Error(`unterminated function ${name}`);
}
function plain(v){return JSON.parse(JSON.stringify(v))}

const app=read('app.js');
const names=['eligibleToday','sortWeakEntries','dailyProgressCount','dailyAnswered','dailyTargetRemaining','dailyTargetReached'];
const snippets=Object.fromEntries(names.map(name=>[name,functionSource(app,name)]));
for(const [name,helper] of [
  ['eligibleToday','isRemediationEligible'],
  ['sortWeakEntries','compareRemediationEntries'],
  ['dailyProgressCount','remediationDailyProgressCount'],
  ['dailyAnswered','remediationDailyAnsweredCount'],
  ['dailyTargetRemaining','remediationDailyTargetRemaining'],
  ['dailyTargetReached','remediationDailyTargetReached']
]){
  assert.match(snippets[name],new RegExp(`ENGLISH_ENGINE_CORE\\?\\.${helper}`),`${name} must delegate to ${helper}`);
  assert.match(snippets[name],/typeof window!=="undefined"/,`${name} must preserve non-browser fallback`);
}

const calls=[];
const ctx={
  S:{dailyProgress:{date:'2026-09-18',answeredCount:3}},
  DAILY_TASK_TARGET:10,
  today:()=> '2026-09-18',
  priorityOrder:w=>({A:0,B:1,C:2}[w.priority]??3),
  ensureDailyPlan:()=>({date:'2026-09-18',answeredCount:4}),
  ENGLISH_ENGINE_CORE:{
    isRemediationEligible(w,t){calls.push(['eligible',plain(w),t]);return true},
    compareRemediationEntries(a,b,p){calls.push(['sort',a[0],b[0],p(a[1]),p(b[1])]);return -9},
    remediationDailyProgressCount(state,t){calls.push(['progress',state===ctx.S,t]);return 6},
    remediationDailyAnsweredCount(state,plan,t){calls.push(['answered',state===ctx.S,plain(plan),t]);return 8},
    remediationDailyTargetRemaining(answered,target){calls.push(['remaining',answered,target]);return 2},
    remediationDailyTargetReached(answered,target){calls.push(['reached',answered,target]);return false}
  }
};
ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);
vm.runInContext(`${snippets.eligibleToday}\n${snippets.sortWeakEntries}\n${snippets.dailyProgressCount}\n${snippets.dailyAnswered}\n${snippets.dailyTargetRemaining}\n${snippets.dailyTargetReached}\nglobalThis.api={eligibleToday,sortWeakEntries,dailyProgressCount,dailyAnswered,dailyTargetRemaining,dailyTargetReached};`,ctx);

const weak={status:'mastered',priority:'C'};
assert.equal(ctx.api.eligibleToday(['k',weak]),true);
assert.equal(ctx.api.sortWeakEntries(['a',{priority:'A'}],['b',{priority:'B'}]),-9);
assert.equal(ctx.api.dailyProgressCount(),6);
const plan={date:'2026-09-18',answeredCount:1};
assert.equal(ctx.api.dailyAnswered(plan),8);
assert.equal(ctx.api.dailyTargetRemaining(plan),2);
assert.equal(ctx.api.dailyTargetReached(plan),false);

assert.deepEqual(calls[0],['eligible',{status:'mastered',priority:'C'},'2026-09-18']);
assert.deepEqual(calls[1],['sort','a','b',0,1]);
assert.deepEqual(calls[2],['progress',true,'2026-09-18']);
assert.deepEqual(calls[3],['answered',true,plan,'2026-09-18']);
assert.deepEqual(calls[4],['answered',true,plan,'2026-09-18']);
assert.deepEqual(calls[5],['remaining',8,10]);
assert.deepEqual(calls[6],['answered',true,plan,'2026-09-18']);
assert.deepEqual(calls[7],['reached',8,10]);

console.log('Waseda daily remediation scheduling runtime delegation: CLEAN');
