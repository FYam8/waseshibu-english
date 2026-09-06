import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import assert from 'node:assert/strict'
import {fileURLToPath} from 'node:url'

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..')
const html=fs.readFileSync(path.join(root,'index.html'),'utf8')
const scripts=[...html.matchAll(/<script\s+src="([^"]+)"/g)].map(match=>match[1])
const elements=new Map()
const element=id=>{
  if(!elements.has(id))elements.set(id,{id,innerHTML:'',textContent:'',value:'',checked:false,classList:{add(){},remove(){},toggle(){}},style:{},dataset:{},querySelectorAll:()=>[],addEventListener(){},appendChild(){},remove(){},getBoundingClientRect(){return {top:0}}})
  return elements.get(id)
}
const storage=new Map([['sentinel','preserved']])
const localStorage={get length(){return storage.size},key(i){return [...storage.keys()][i]??null},getItem:key=>storage.get(key)??null,setItem:(key,value)=>storage.set(key,String(value)),removeItem:key=>storage.delete(key)}
const context={console,Date,Math,JSON,Intl,Map,Set,Array,Object,String,Number,Boolean,RegExp,Error,URL,Blob,localStorage,alert(){},confirm(){return true},scrollTo(){},requestAnimationFrame(){},setTimeout(){return 1},clearTimeout(){},setInterval(){return 1},clearInterval(){},document:{getElementById:element,querySelectorAll:()=>[],querySelector:()=>null,addEventListener(){},body:element('body'),hidden:false}}
context.window=context
context.window.addEventListener=()=>{}
context.window.matchMedia=()=>({matches:false})
vm.createContext(context)
for(const file of scripts)vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file})

const snapshot=JSON.stringify([...storage.entries()])
const rows=vm.runInContext(`BANK.filter(q=>!q.retired).map(q=>({id:q.id,skill:q.skill,point:learningPointSelection(explanationParts(q.explanation),q).text,prompt:q.prompt,options:q.options,answer:q.answer,parts:explanationParts(q.explanation)}))`,context)
const release1=vm.runInContext('[...LEARNING_POINT_RELEASE1_IDS]',context)
const release2=vm.runInContext('[...LEARNING_POINT_RELEASE2_IDS]',context)
assert.equal(release2.length,64)
assert.equal(new Set(release2).size,64)
assert.equal(release1.filter(id=>release2.includes(id)).length,0)
assert.equal(new Set([...release1,...release2]).size,180)
const released=rows.filter(row=>release2.includes(row.id))
const expected={reference:9,context:10,connector:10,extract:11,example:10,writing_completion:14}
assert.deepEqual(Object.fromEntries(Object.keys(expected).map(skill=>[skill,released.filter(row=>row.skill===skill).length])),expected)
for(const row of released){
  assert.ok(row.point.length>=20&&row.point.length<=180,`${row.id}: invalid length`)
  assert.doesNotMatch(row.point,/候補語だけでなく|空所の直前だけでなく|長文中の対応語を|抽象→具体の対応を|指定語数内で、空所前後に/)
  assert.doesNotMatch(row.point,/非公式|A\/B|解説を確認しましょう|undefined|null/)
}
for(const [skill,count] of Object.entries(expected))assert.equal(new Set(released.filter(row=>row.skill===skill).map(row=>row.point)).size,count,`${skill}: points must be problem-specific`)

const byId=Object.fromEntries(rows.map(row=>[row.id,row]))
assert.equal(byId.lrf09.options[1],'his ankle becoming worse')
assert.equal(byId.lrf09.answer,1)
assert.doesNotMatch(byId.lco22.parts.find(part=>part.label==='他選択肢').text,/Because|Otherwise/)
for(let i=1;i<=10;i++)assert.doesNotMatch(byId[`lcx${String(i).padStart(2,'0')}`].parts.find(part=>part.label==='他選択肢').text,/(^|[^A-Za-z])[ABCD]([^A-Za-z]|$)/)
assert.doesNotMatch(byId.lex21.parts.find(part=>part.label==='他選択肢が違う理由').text,/(^|[^A-Za-z])[ABCD]([^A-Za-z]|$)/)
assert.match(byId.let02.prompt,/『混雑している』に当たる英語1語/)
assert.doesNotMatch(byId.let02.prompt,/混雑しすぎている/)
for(const id of ['lwc29','lwc31']){
  const minimum=byId[id].parts.find(part=>part.label==='最小限答案例').text
  const high=byId[id].parts.find(part=>part.label==='高得点答案例').text
  assert.notEqual(minimum,high)
}
assert.equal(JSON.stringify([...storage.entries()]),snapshot)
assert.equal(vm.runInContext('BANK.filter(q=>!q.retired).length',context),283)
assert.equal(vm.runInContext('BANK.filter(q=>q.retired).length',context),321)
console.log('learning-point release2 independent audit CLEAN',JSON.stringify({released:64,categories:expected,correctedData:16,active:283,retired:321}))
