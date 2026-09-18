import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

function read(path){return fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8')}
function functionSource(source,name){
  const marker=`function ${name}(`,start=source.indexOf(marker);
  assert.ok(start>=0,`missing function ${name}`);
  const brace=source.indexOf('{',start);let depth=0;
  for(let i=brace;i<source.length;i++){
    if(source[i]==='{')depth++;
    else if(source[i]==='}'&&--depth===0)return source.slice(start,i+1);
  }
  throw new Error(`unterminated function ${name}`);
}

const app=read('app.js');
const names=['strategyPriority','gradeInGoal','goalLabel','goalAdvice','routeRole','skillName','priorityOrder'];
for(const name of names)assert.match(functionSource(app,name),/ENGLISH_ENGINE_ADAPTER\?\.policy/,`${name} must delegate through the school adapter`);

const calls=[];
const policy={
  resolveQuestionPriority(q){calls.push(['resolveQuestionPriority',q.skill]);return 'POLICY_PRIORITY'},
  isPriorityInGoal(priority,goal){calls.push(['isPriorityInGoal',priority,goal]);return priority==='B'&&goal===70},
  goalLabel(goal){calls.push(['goalLabel',goal]);return `POLICY_LABEL_${goal}`},
  goalAdvice(goal){calls.push(['goalAdvice',goal]);return `POLICY_ADVICE_${goal}`},
  routeRole(year){calls.push(['routeRole',year]);return `POLICY_ROUTE_${year}`},
  skillName(skill){calls.push(['skillName',skill]);return `POLICY_SKILL_${skill}`},
  priorityOrder(priority){calls.push(['priorityOrder',priority]);return priority==='B'?17:99}
};
const ctx={S:{goal:70},skillNames:{},window:{ENGLISH_ENGINE_ADAPTER:{policy}}};ctx.globalThis=ctx;vm.createContext(ctx);
vm.runInContext(`${names.map(name=>functionSource(app,name)).join('\n')}\nglobalThis.api={${names.join(',')}}`,ctx);
const p=ctx.api;
assert.equal(p.strategyPriority({skill:'detail'}),'POLICY_PRIORITY');
assert.equal(p.gradeInGoal('B'),true);
assert.equal(p.goalLabel(),'POLICY_LABEL_70');
assert.equal(p.goalAdvice(),'POLICY_ADVICE_70');
assert.equal(p.routeRole(2024),'POLICY_ROUTE_2024');
assert.equal(p.skillName('reason'),'POLICY_SKILL_reason');
assert.equal(p.priorityOrder({priority:'B'}),17);
assert.deepEqual(calls,[
  ['resolveQuestionPriority','detail'],
  ['isPriorityInGoal','B',70],
  ['goalLabel',70],
  ['goalAdvice',70],
  ['routeRole',2024],
  ['skillName','reason'],
  ['priorityOrder','B']
]);
console.log('Waseda school-policy delegation: CLEAN');
