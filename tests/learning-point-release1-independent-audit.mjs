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

const beforeBank=vm.runInContext('JSON.stringify(BANK)',context)
const beforeStorage=JSON.stringify([...storage.entries()])
const rows=vm.runInContext(`BANK.filter(q=>!q.retired).map(q=>({id:q.id,skill:q.skill,point:learningPointSelection(explanationParts(q.explanation),q).text}))`,context)
const releaseIds=vm.runInContext('[...LEARNING_POINT_RELEASE1_IDS]',context)
const released=rows.filter(row=>releaseIds.includes(row.id))
assert.equal(released.length,116)
assert.equal(new Set(releaseIds).size,116)
assert.equal(vm.runInContext('JSON.stringify(BANK)',context),beforeBank)
assert.equal(localStorage.getItem('sentinel'),'preserved')
assert.equal(JSON.stringify([...storage.entries()]),beforeStorage)

const expected={reorder:38,sentence_completion:16,rebuttal:16,reason:10,content_match:5,insertion:10,emotion:10,paraphrase:11}
assert.deepEqual(Object.fromEntries(Object.keys(expected).map(skill=>[skill,released.filter(row=>row.skill===skill).length])),expected)
for(const row of released){
  assert.ok(row.point.length>=20&&row.point.length<=180,`${row.id}: invalid length`)
  assert.doesNotMatch(row.point,/本番の語句整序は|空所前後の語と自然につながる|相手の主張を要約し、その後で|感情語を探すのではなく|下線語を単独暗記ではなく/)
  assert.doesNotMatch(row.point,/^(?:重要表現：)?[A-Za-z]+(?:,\s*[A-Za-z]+){1,3}$/)
  assert.doesNotMatch(row.point,/非公式|A\/B|解説を確認しましょう|undefined|null/)
}
for(const [skill,count] of Object.entries(expected)){
  const points=released.filter(row=>row.skill===skill).map(row=>row.point)
  const minimumUnique=skill==='sentence_completion'?15:count
  assert.ok(new Set(points).size>=minimumUnique,`${skill}: insufficient problem-specific points`)
}

const excluded=['lrf09','lco22','lcx01','lcx02','lcx03','lcx04','lcx05','lcx06','lcx07','lcx08','lcx09','lcx10','lex21','let02','lwc29','lwc31']
assert.ok(excluded.every(id=>!releaseIds.includes(id)))
assert.equal(vm.runInContext('BANK.filter(q=>!q.retired).length',context),283)
assert.equal(vm.runInContext('BANK.filter(q=>q.retired).length',context),321)
console.log('learning-point release1 independent audit CLEAN',JSON.stringify({released:released.length,categories:expected,active:283,retired:321,excluded:excluded.length}))
