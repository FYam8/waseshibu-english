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
const localStorage={values:new Map(),get length(){return this.values.size},key(i){return [...this.values.keys()][i]??null},getItem(key){return this.values.has(key)?this.values.get(key):null},setItem(key,value){this.values.set(key,String(value))},removeItem(key){this.values.delete(key)}}
const context={console,Date,Math,JSON,Intl,Map,Set,Array,Object,String,Number,Boolean,RegExp,Error,URL,Blob,localStorage,alert(){},confirm(){return true},scrollTo(){},requestAnimationFrame(){},setTimeout(){return 1},clearTimeout(){},setInterval(){return 1},clearInterval(){},document:{getElementById:element,querySelectorAll:()=>[],querySelector:()=>null,addEventListener(){},body:element('body'),hidden:false}}
context.window=context
context.window.addEventListener=()=>{}
context.window.matchMedia=()=>({matches:false})
vm.createContext(context)
for(const file of scripts)vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file})

const before=vm.runInContext('JSON.stringify(BANK)',context)
const rows=vm.runInContext(`BANK.filter(q=>!q.retired).map(q=>({id:q.id,skill:q.skill,point:learningPointSelection(explanationParts(q.explanation),q).text,html:formatDrillExplanation(q.explanation,q)}))`,context)
assert.equal(rows.length,283)
assert.equal(vm.runInContext('JSON.stringify(BANK)',context),before)

for(const row of rows){
  assert.ok(row.point.length>=10,`${row.id}: learning point is too short: ${row.point}`)
  assert.ok(row.point.length<=180,`${row.id}: learning point is too long`)
  assert.doesNotMatch(row.point,/^(?:A\s*[\/／]\s*B|A\s*[〜～-]\s*B|[ABC])(?:（非公式）)?\s*[：:。.]/,`${row.id}: internal grade leaked`)
  assert.doesNotMatch(row.point,/undefined|null|解説を確認しましょう/,`${row.id}: invalid placeholder`)
  assert.equal(vm.runInContext(`hasExplanationChoiceLabels(${JSON.stringify(row.point)})`,context),false,`${row.id}: shuffled choice label leaked into learning point`)
  assert.match(row.html,/<b>覚えるポイント<\/b><p>/)
}

const byId=Object.fromEntries(rows.map(row=>[row.id,row]))
assert.equal(new Set(rows.filter(row=>row.skill==='detail').map(row=>row.point)).size,20)
assert.match(byId.nd03.point,/調査結果|数値/)
assert.doesNotMatch(byId.nd03.point,/^[AB]。$/)
assert.match(byId.lvd09.point,/crowded ＝ 混雑した（adjective）/)
assert.match(byId.sc01.point,/重要表現：help, get/)
assert.match(byId.lsu26.point,/人物・状況.*残す要点：museum/)
assert.doesNotMatch(byId.lsu26.point,/^40語以内。$/)
assert.match(byId.lrb01.point,/相手の主張を要約.*反論/)
assert.doesNotMatch(byId.lrb01.point,/^50〜60語/)
assert.match(byId.lpr04.point,/think.*\/θ\//)
assert.match(byId.lst04.point,/government.*第1音節/)
assert.match(vm.runInContext('formatDrillExplanation("festival は第1音節、他は第2音節。",{skill:"stress"})',context),/覚えるポイント<\/b><p>festival は第1音節/)
assert.equal(vm.runInContext('learningPointSelection([{label:"なぜ正解か",text:"A. Smith acted after the warning."}],{skill:"detail"}).text',context),'A. Smith acted after the warning.')

const skills=Object.fromEntries([...new Set(rows.map(row=>row.skill))].sort().map(skill=>[skill,{count:rows.filter(row=>row.skill===skill).length,unique:new Set(rows.filter(row=>row.skill===skill).map(row=>row.point)).size}]))
console.log('learning-point display audit PASS',JSON.stringify({total:rows.length,skills}))
