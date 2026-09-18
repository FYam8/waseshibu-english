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

const source=functionSource(read('app.js'),'availableLearningActions');
assert.match(source,/ENGLISH_ENGINE_CORE\?\.selectDailyLearningActionDescriptors/);
assert.match(source,/typeof window!=="undefined"/);
assert.match(source,/const rows=activeWeak\(\)/,'legacy Today action fallback must remain');

const entries=[
  ['due',{status:'pending',priority:'A',year:2024,label:'Due',confirmStreak:1}],
  ['continue',{status:'active',priority:'A',year:2023,label:'Continue',streak:2}],
  ['new',{status:'active',priority:'A',year:2022,label:'New',streak:0}],
  ['upgrade',{status:'active',priority:'B',year:2021,label:'Upgrade',streak:0}]
];
const calls=[];
const ctx={
  S:{currentAttempt:{status:'active',year:2025}},
  activeWeak:()=>entries,
  nextRouteYear:()=>2026,
  gradeInGoal:p=>p==='A',
  eligibleToday:()=>true,
  sortWeakEntries:(a,b)=>a[0].localeCompare(b[0]),
  routeRole:y=>y===2026?'最終判定':'弱点補強',
  goalLabel:g=>g===70?'B 70点':'C 75点',
  ENGLISH_ENGINE_CORE:{
    selectDailyLearningActionDescriptors(args){
      calls.push(args);
      return [
        {kind:'weak',stage:'confirm',key:'due'},
        {kind:'weak',stage:'continue',key:'continue'},
        {kind:'attempt',year:2025},
        {kind:'weak',stage:'new',key:'new'},
        {kind:'route',year:2026},
        {kind:'upgrade',key:'upgrade',priority:'B'}
      ];
    }
  }
};
ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);
vm.runInContext(`${source}\nglobalThis.actions=availableLearningActions();`,ctx);
assert.equal(calls.length,1);
const args=calls[0];
assert.deepEqual(plain(args.entries.map(x=>x[0])),['due','continue','new','upgrade']);
assert.equal(args.currentAttempt,ctx.S.currentAttempt);assert.equal(args.routeYear,2026);
assert.equal(typeof args.isInGoal,'function');assert.equal(typeof args.isEligible,'function');assert.equal(typeof args.compareEntries,'function');

assert.deepEqual(plain(ctx.actions),[
  {kind:'weak',key:'due',label:'今日の定着チェックへ',note:'2024 Due（1/2）'},
  {kind:'weak',key:'continue',label:'この弱点を続ける',note:'2023 Continue（2/3）'},
  {kind:'attempt',year:2025,label:'2025年度の続きへ',note:'解答途中の過去問があります。'},
  {kind:'weak',key:'new',label:'次の弱点へ',note:'2022 New（A）'},
  {kind:'route',year:2026,label:'2026年度の過去問を見る',note:'最終判定。年度ページを開くだけでは初見性を消費しません。'},
  {kind:'goal',goal:70,label:'B 70点へ進む',note:'B問題の未克服があります。'}
]);

console.log('Waseda Today action selection runtime delegation: CLEAN');
