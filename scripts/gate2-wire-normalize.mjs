import fs from 'node:fs';

const path=new URL('../app.js',import.meta.url);
const source=fs.readFileSync(path,'utf8');
const marker='function normalizeDrillState(value)';
const start=source.indexOf(marker);
if(start<0)throw new Error('normalizeDrillState marker not found');
if(source.indexOf(marker,start+marker.length)>=0)throw new Error('normalizeDrillState marker is not unique');
const brace=source.indexOf('{',start);
if(brace<0)throw new Error('normalizeDrillState body not found');
let depth=0,end=-1;
for(let i=brace;i<source.length;i++){
  if(source[i]==='{')depth++;
  else if(source[i]==='}'&&--depth===0){end=i+1;break;}
}
if(end<0)throw new Error('normalizeDrillState body is unterminated');
const current=source.slice(start,end);
if(current.includes('ENGLISH_ENGINE_CORE'))throw new Error('normalizeDrillState is already wired to the shared engine');
const requiredFragments=[
  'const q=value.q||null',
  'choiceOrder=candidate.length===expected.length',
  'if(!orderIndices.length&&order.length&&Array.isArray(value.shuffled))',
  'textDraft:value.textDraft||""',
  'selfText:value.selfText||""'
];
for(const fragment of requiredFragments)if(!current.includes(fragment))throw new Error(`legacy normalizeDrillState changed unexpectedly: ${fragment}`);

const replacement=`function normalizeDrillState(value){\n const shared=typeof window!=="undefined"&&window.ENGLISH_ENGINE_CORE?.normalizeDrillState;\n if(shared)return shared(value);\n if(!value||typeof value!=="object")return null;\n const q=value.q||null,expected=q?.options?q.options.map((_,i)=>i):[],candidate=Array.isArray(value.choiceOrder)?value.choiceOrder:[],choiceOrder=candidate.length===expected.length&&new Set(candidate).size===expected.length&&candidate.every(i=>expected.includes(i))?candidate:expected,order=Array.isArray(value.order)?value.order:[];\n let orderIndices=Array.isArray(value.orderIndices)?value.orderIndices.filter(i=>Number.isInteger(i)):[];\n if(!orderIndices.length&&order.length&&Array.isArray(value.shuffled)){const used=new Set();orderIndices=order.map(token=>{const index=value.shuffled.findIndex((x,i)=>x===token&&!used.has(i));if(index>=0)used.add(index);return index}).filter(i=>i>=0)}\n return {...value,used:Array.isArray(value.used)?value.used:[],selectedMany:Array.isArray(value.selectedMany)?value.selectedMany:[],order,orderIndices,textInputs:Array.isArray(value.textInputs)?value.textInputs:[],selfParts:Array.isArray(value.selfParts)?value.selfParts:[],selfChecks:Array.isArray(value.selfChecks)?value.selfChecks:[],choiceOrder,textDraft:value.textDraft||"",selfText:value.selfText||""};\n}`;
const next=source.slice(0,start)+replacement+source.slice(end);
if(next===source)throw new Error('patch produced no change');
if((next.match(/ENGLISH_ENGINE_CORE\?\.normalizeDrillState/g)||[]).length!==1)throw new Error('expected exactly one shared normalization delegation');
fs.writeFileSync(path,next);
console.log('Gate 2 normalizeDrillState wrapper prepared');
