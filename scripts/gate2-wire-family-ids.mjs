import fs from 'node:fs';

const path=new URL('../app.js',import.meta.url);
let source=fs.readFileSync(path,'utf8');
const oldLine='BANK.forEach((q,i)=>{ if(!q.familyId) q.familyId=String(q.id||`${q.skill||"skill"}:${q.targetId||"target"}:${i}`); });';
if(!source.includes(oldLine))throw new Error('Waseda familyId startup hotfix changed unexpectedly');
if(source.includes('sharedEnsureFamilyIds'))throw new Error('familyId completion is already delegated');
const replacement=`const sharedEnsureFamilyIds=window.ENGLISH_ENGINE_CORE?.ensureFamilyIds;\nif(sharedEnsureFamilyIds)sharedEnsureFamilyIds(BANK);\nelse ${oldLine}`;
source=source.replace(oldLine,replacement);
if(!source.includes('sharedEnsureFamilyIds(BANK)'))throw new Error('shared familyId delegation missing');
if(!source.includes(`else ${oldLine}`))throw new Error('legacy familyId fallback missing');
fs.writeFileSync(path,source);
console.log('Waseda familyId completion delegation prepared');
