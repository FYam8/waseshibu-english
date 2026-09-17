import fs from 'node:fs';

const path=new URL('../app.js',import.meta.url);
let source=fs.readFileSync(path,'utf8');

function findFunction(sourceText,name){
  const marker=`function ${name}(`,start=sourceText.indexOf(marker);
  if(start<0)throw new Error(`${name} marker not found`);
  if(sourceText.indexOf(marker,start+marker.length)>=0)throw new Error(`${name} marker is not unique`);
  const brace=sourceText.indexOf('{',start);
  if(brace<0)throw new Error(`${name} body not found`);
  let depth=0;
  for(let i=brace;i<sourceText.length;i++){
    if(sourceText[i]==='{')depth++;
    else if(sourceText[i]==='}'&&--depth===0)return{start,end:i+1,text:sourceText.slice(start,i+1)};
  }
  throw new Error(`${name} body is unterminated`);
}
function replace(name,required,replacement){
  const found=findFunction(source,name);
  if(found.text.includes('ENGLISH_ENGINE_ADAPTER'))throw new Error(`${name} is already wired to the school adapter`);
  for(const fragment of required)if(!found.text.includes(fragment))throw new Error(`${name} changed unexpectedly: ${fragment}`);
  source=source.slice(0,found.start)+replacement+source.slice(found.end);
}

replace('strategyPriority',['q.priority==="A"','q.skill==="insertion"'],`function strategyPriority(q){\n const policy=typeof window!=="undefined"&&window.ENGLISH_ENGINE_ADAPTER?.policy;\n if(policy)return policy.resolveQuestionPriority(q);\n if(q.priority==="A")return "A";if(q.skill==="insertion")return "C";return "B"\n}`);
replace('gradeInGoal',['grade==="A"','goal>=70','goal>=75'],`function gradeInGoal(grade,goal=S.goal){\n const policy=typeof window!=="undefined"&&window.ENGLISH_ENGINE_ADAPTER?.policy;\n if(policy)return policy.isPriorityInGoal(grade,goal);\n return grade==="A"||(grade==="B"&&goal>=70)||(grade==="C"&&goal>=75)\n}`);
replace('goalLabel',['A 60点','B 70点','C 75点'],`function goalLabel(goal=S.goal){\n const policy=typeof window!=="undefined"&&window.ENGLISH_ENGINE_ADAPTER?.policy;\n if(policy)return policy.goalLabel(goal);\n return goal===60?"A 60点":goal===70?"B 70点":"C 75点"\n}`);
replace('goalAdvice',['60点を守ります','70点を狙います','75点を狙います'],`function goalAdvice(goal=S.goal){\n const policy=typeof window!=="undefined"&&window.ENGLISH_ENGINE_ADAPTER?.policy;\n if(policy)return policy.goalAdvice(goal);\n return goal===60?"A問題を最優先にして60点を守ります。":goal===70?"Aを固め、B問題まで直して70点を狙います。":"A・Bを確実にした後、取れるC問題を選んで75点を狙います。"\n}`);
replace('routeRole',['初見診断','実戦確認','最終判定','弱点補強'],`function routeRole(y){\n const policy=typeof window!=="undefined"&&window.ENGLISH_ENGINE_ADAPTER?.policy;\n if(policy)return policy.routeRole(y);\n return y===2024?"初見診断":y===2025?"実戦確認":y===2026?"最終判定":"弱点補強"\n}`);
replace('skillName',['skillNames[s]||s'],`function skillName(s){\n const policy=typeof window!=="undefined"&&window.ENGLISH_ENGINE_ADAPTER?.policy;\n if(policy)return policy.skillName(s);\n return skillNames[s]||s\n}`);
replace('priorityOrder',['[w.priority]??3'],`function priorityOrder(w){\n const policy=typeof window!=="undefined"&&window.ENGLISH_ENGINE_ADAPTER?.policy;\n if(policy)return policy.priorityOrder(w?.priority);\n return ({A:0,B:1,C:2})[w.priority]??3\n}`);

const delegated=(source.match(/ENGLISH_ENGINE_ADAPTER\?\.policy/g)||[]).length;
if(delegated!==7)throw new Error(`expected 7 school-policy delegation points, found ${delegated}`);
fs.writeFileSync(path,source);
console.log('Waseda policy delegation wrappers prepared');
