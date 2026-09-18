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

const source=functionSource(read('app.js'),'ensureDailyPlan');
assert.match(source,/ENGLISH_ENGINE_CORE\?\.buildRemediationDailyPlan/);
assert.match(source,/typeof window!=="undefined"/);
assert.match(source,/const candidates=activeWeak\(\)/,'legacy daily-plan fallback must remain');

const fixed='2026-09-18T06:45:00.000Z',RealDate=Date;
class FixedDate extends RealDate{constructor(...args){super(...(args.length?args:[fixed]))}static now(){return new RealDate(fixed).getTime()}}
const weakA={status:'active',priority:'A'},weakB={status:'pending',priority:'B',next:'2026-09-18'},calls=[];
let saves=0;
const ctx={
  Date:FixedDate,
  S:{goal:70,dailyPlan:null,weak:{a:weakA,b:weakB}},
  dailyPlanValid:()=>false,
  activeWeak:()=>[['a',weakA],['b',weakB]],
  dailyProgressCount:()=>4,
  nextRouteYear:()=>2026,
  today:()=> '2026-09-18',
  gradeInGoal:p=>p!=='C',
  eligibleToday:([,w])=>w.status==='active'||w.status==='pending',
  sortWeakEntries:(a,b)=>a[0].localeCompare(b[0]),
  save(){saves++},
  ENGLISH_ENGINE_CORE:{
    buildRemediationDailyPlan(args){
      calls.push(args);
      return {plan:{date:args.today,goal:args.goal,kind:'weak',weakKeys:['b','a'],answeredCount:args.answeredCount,createdAt:args.nowIso},assignedKeys:['b','a']};
    }
  }
};
ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);
vm.runInContext(`${source}\nglobalThis.result=ensureDailyPlan();`,ctx);
assert.equal(calls.length,1);
const args=calls[0];
assert.deepEqual(plain(args.entries.map(x=>x[0])),['a','b']);
assert.equal(args.goal,70);assert.equal(args.today,'2026-09-18');assert.equal(args.answeredCount,4);assert.equal(args.routeYear,2026);assert.equal(args.nowIso,fixed);
assert.equal(args.isInGoal(weakA),true);assert.equal(args.isEligible(['a',weakA]),true);assert.equal(typeof args.compareEntries,'function');
assert.deepEqual(plain(ctx.result),{date:'2026-09-18',goal:70,kind:'weak',weakKeys:['b','a'],answeredCount:4,createdAt:fixed});
assert.equal(weakA.lastAssignedDate,'2026-09-18');assert.equal(weakB.lastAssignedDate,'2026-09-18');
assert.equal(saves,1);

console.log('Waseda daily plan construction runtime delegation: CLEAN');
