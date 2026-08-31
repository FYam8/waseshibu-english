import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import assert from 'node:assert/strict'
import {fileURLToPath} from 'node:url'

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..')
const scripts=['data.js','extra-drills.js','learning-model.js','app.js']

function storage(initial={}){
  const values=new Map(Object.entries(initial))
  return {values,getItem:key=>values.has(key)?values.get(key):null,setItem:(key,value)=>values.set(key,String(value)),removeItem:key=>values.delete(key)}
}
function runtime(store){
  const elements=new Map(),element=id=>{if(!elements.has(id))elements.set(id,{id,innerHTML:'',classList:{add(){},remove(){},toggle(){}},style:{},dataset:{},querySelectorAll:()=>[],addEventListener(){},appendChild(){},remove(){}});return elements.get(id)}
  const context={console,Date,Math,JSON,Intl,Map,Set,Array,Object,String,Number,Boolean,RegExp,Error,URL,Blob,localStorage:store,alert(){},confirm(){return true},scrollTo(){},setTimeout(){return 1},clearTimeout(){},setInterval(){return 1},clearInterval(){},document:{getElementById:element,querySelectorAll:()=>[],querySelector:()=>null,addEventListener(){},body:element('body'),hidden:false}}
  context.window=context;context.window.addEventListener=()=>{};vm.createContext(context)
  for(const file of scripts)vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file})
  return {context,run:code=>vm.runInContext(code,context),app:element('app')}
}

const weak={}
for(let i=0;i<12;i++)weak[`2024:3-1:test-${i}`]={year:2024,id:'3-1',label:`発音${i+1}`,category:'発音',component:`test-${i}`,skill:'pronunciation',priority:'A',points:3,status:'active',streak:0,confirmStreak:0,next:'2000-01-01',reservedConfirm:[],seenDrills:[],customField:`keep-${i}`}
weak['2024:4:main']={year:2024,id:'4',label:'大問4',category:'要約＋反論',component:'main',skill:'rebuttal',priority:'B',points:24,status:'active',streak:0,confirmStreak:0,next:'2000-01-01',reservedConfirm:[],seenDrills:[]}
weak['2024:6-5:main']={year:2024,id:'6-5',label:'大問6 問5',category:'文挿入',component:'main',skill:'insertion',priority:'C',points:3,status:'active',streak:0,confirmStreak:0,next:'2000-01-01',reservedConfirm:[],seenDrills:[]}
const initial={schemaVersion:5,year:2024,answers:{},manual:{},history:[],attempts:[],weak,cause:{},drillLog:[],exposure:{},theme:'light'}
const store=storage({'waseshibu.adaptive.v3':JSON.stringify(initial)})
let app=runtime(store)

assert.equal(app.run('SCHEMA_VERSION'),6)
assert.equal(app.run('S.goal'),60)
assert.equal(app.run('S.weak["2024:3-1:test-0"].customField'),'keep-0')
assert.equal(app.run('S.weak["2024:3-1:test-0"].targetId'),'pronunciation-contrast')
assert.equal(app.run('ensureDailyPlan().weakKeys.length'),10)
assert.equal(app.run('ensureDailyPlan().weakKeys.every(k=>S.weak[k].priority==="A")'),true)
assert.ok(store.getItem('waseshibu.adaptive.pre-migration.v5'))
assert.match(app.app.innerHTML,/A 60点/)
assert.match(app.app.innerHTML,/今日やること/)

app.run('startSkill("2024:3-1:test-0")')
assert.equal(app.run('drillState.key'),'2024:3-1:test-0')
assert.equal(app.run('drillState.q.targetId'),'pronunciation-contrast')
assert.equal(app.run('drillState.q.retired===true'),false)
assert.equal(app.run('S.weak[drillState.key].reservedConfirm.length'),2)
assert.equal(app.run('(()=>{const ids=S.weak[drillState.key].reservedConfirm,rows=ids.map(id=>BANK.find(q=>q.id===id));return new Set(rows.map(q=>q.familyId)).size})()'),2)
app.run('answerDrillChoice(drillState.q.answer)')
const savedOrder=app.run('JSON.stringify(drillState.choiceOrder)')
app.run('goto("home")')
assert.equal(app.run('todayAction().action'),'resumeCurrentDrill()')
assert.match(app.app.innerHTML,/克服ドリルの続きから/)

// Reloading the updated app must resume the same answered drill, not select a new first problem.
const savedQuestion=app.run('drillState.q.id')
app=runtime(store)
assert.equal(app.run('drillState.q.id'),savedQuestion)
assert.equal(app.run('drillState.answered'),true)
assert.equal(app.run('JSON.stringify(drillState.choiceOrder)'),savedOrder)
assert.equal(app.run('todayAction().action'),'resumeCurrentDrill()')

app.run('drillState=null;S.currentDrill=null;S.currentSkill=null;save();setGoal(70)')
assert.equal(app.run('S.goal'),70)
assert.equal(app.run('gradeInGoal("B")'),true)
assert.equal(app.run('gradeInGoal("C")'),false)
app.run('setGoal(75)')
assert.equal(app.run('gradeInGoal("C")'),true)
assert.equal(app.run('S.weak["2024:3-1:test-0"].streak'),1)

assert.equal(app.run('BANK.filter(q=>!q.retired).length'),283)
assert.equal(app.run('Object.values(D).flat().every(q=>q.targetId&&q.focusTag&&q.examFormat&&q.trap)'),true)
assert.equal(app.run('BANK.filter(q=>!q.retired).every(q=>q.targetId&&q.focusTag&&q.familyId)'),true)
assert.equal(app.run('BANK.filter(q=>q.retired).every(q=>![].includes(q.id))'),true)
assert.equal(app.run('wordCount("One  two\\nthree")'),3)
assert.equal(app.run('Object.values(D).every(rows=>rows.reduce((sum,q)=>sum+q.points,0)===80)'),true)
assert.equal(app.run('(()=>{const groups=Object.groupBy(BANK.filter(q=>!q.retired),q=>q.targetId);return Object.values(groups).every(rows=>new Set(rows.map(q=>q.familyId)).size>=5&&rows.filter(q=>q.level===3).length>=2)})()'),true)
assert.equal(app.run('BANK.filter(q=>!q.retired&&q.type==="pair").every(q=>q.answer.length===2&&q.solution.length>=5&&q.solution.every(token=>q.tokens.includes(token)))'),true)
assert.equal(app.run('BANK.filter(q=>!q.retired&&q.type==="selfcheck"&&q.maxWords).every(q=>q.model.trim().split(/\\s+/).length<=q.maxWords)'),true)

// Finishing the frozen daily ten must reveal, but not silently require, the next optional task.
const optionalApp=runtime(storage({'waseshibu.adaptive.v3':JSON.stringify(initial)}))
optionalApp.run('for(const key of ensureDailyPlan().weakKeys)S.weak[key].status="mastered";save();goto("home")')
assert.match(optionalApp.app.innerHTML,/時間があれば次の1件へ/)
assert.equal(optionalApp.run('planRemaining().length'),0)

// A past-paper draft always overrides remediation in the home call to action.
optionalApp.run('S.currentAttempt={id:"draft-1",year:2024,status:"active",mode:"untimed",exposure:"first",startedAt:new Date().toISOString()};save();goto("home")')
assert.match(optionalApp.app.innerHTML,/2024年度の続きを解く/)

const styles=fs.readFileSync(path.join(root,'styles.css'),'utf8')
assert.match(styles,/\.today-list/)
assert.match(styles,/@media\(max-width:700px\)/)
assert.match(styles,/\.attempt-bar \.timer\{position:fixed/)
const html=fs.readFileSync(path.join(root,'index.html'),'utf8')
assert.ok(html.indexOf('learning-model.js')<html.indexOf('app.js'))
assert.match(html,/noindex,nofollow/)

console.log('audit ok: migration, A/B/C goals, daily max 10, exact drill pool, distinct confirmation families, resume, data integrity, mobile rules')
