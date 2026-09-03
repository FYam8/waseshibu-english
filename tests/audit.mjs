import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import {fileURLToPath} from 'node:url'

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..')
const scripts=['data.js','paper-underlines.js','manual-guides.js','extra-drills.js','detail-drills-v2.js','learning-model.js','original-drills-loop3.js','original-drills-loop4.js','app.js']

function storage(initial={}){
  const values=new Map(Object.entries(initial))
  return {values,get length(){return values.size},key:i=>[...values.keys()][i]??null,getItem:key=>values.has(key)?values.get(key):null,setItem:(key,value)=>values.set(key,String(value)),removeItem:key=>values.delete(key)}
}
function runtime(store){
  const elements=new Map(),element=id=>{if(!elements.has(id))elements.set(id,{id,innerHTML:'',classList:{add(){},remove(){},toggle(){}},style:{},dataset:{},querySelectorAll:()=>[],addEventListener(){},appendChild(){},remove(){}});return elements.get(id)}
  const context={console,Date,Math,JSON,Intl,Map,Set,Array,Object,String,Number,Boolean,RegExp,Error,URL,Blob,localStorage:store,__alerts:[],__confirmReturn:true,alert(x){context.__alerts.push(String(x))},confirm(){return context.__confirmReturn},scrollTo(){},setTimeout(){return 1},clearTimeout(){},setInterval(){return 1},clearInterval(){},document:{getElementById:element,querySelectorAll:()=>[],querySelector:()=>null,addEventListener(){},body:element('body'),hidden:false}}
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

assert.equal(app.run('SCHEMA_VERSION'),8)
assert.equal(app.run('S.goal'),60)
assert.equal(app.run('S.weak["2024:3-1:test-0"].customField'),'keep-0')
assert.equal(app.run('S.weak["2024:3-1:test-0"].targetId'),'pronunciation-contrast')
assert.equal(app.run('ensureDailyPlan().weakKeys.length'),12)
assert.equal(app.run('dailyQuestionsRemaining()'),10)
assert.equal(app.run('ensureDailyPlan().weakKeys.every(k=>S.weak[k].priority==="A")'),true)
assert.ok(store.getItem('waseshibu.adaptive.pre-migration.v5'))
assert.match(app.app.innerHTML,/A 60点/)
assert.match(app.app.innerHTML,/今日やること/)

app.run('startSkill("2024:3-1:test-0")')
assert.equal(app.run('drillState.key'),'2024:3-1:test-0')
assert.equal(app.run('drillState.q.targetId'),'pronunciation-contrast')
assert.equal(app.run('drillState.q.retired===true'),false)
assert.equal(app.run('JSON.stringify([...drillState.choiceOrder].sort((a,b)=>a-b))'),app.run('JSON.stringify(drillState.q.options.map((_,i)=>i))'))
assert.equal(app.run('displayedDrillPrompt(BANK.find(q=>q.id==="rdt_cx01"))').startsWith('Mika:'),true)
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
assert.equal(app.run('matches({type:"text",answer:"homeless man"},"homeless   man")'),true)
assert.equal(app.run('Object.values(D).every(rows=>rows.reduce((sum,q)=>sum+q.points,0)===80)'),true)
assert.equal(app.run('D[2024].filter(q=>q.label.startsWith("大問6")).reduce((s,q)=>s+q.points,0)'),20)
assert.equal(app.run('D[2026].filter(q=>q.label.startsWith("大問6")).reduce((s,q)=>s+q.points,0)'),24)
assert.equal(app.run('Object.values(D).flat().filter(q=>q.type!=="manual").length'),151)
assert.equal(app.run('D[2019].find(q=>q.id==="3-1").answer'),'ア')
assert.equal(app.run('Object.keys(MANUAL_GUIDES).length'),4)
assert.equal(app.run('MANUAL_GUIDES["2024:6-4"].answer.includes("helps")'),true)
assert.equal(app.run('MANUAL_GUIDES["2026:8-1"].note.includes("3点")'),true)
assert.equal(app.run('Object.entries(D).every(([y,rows])=>rows.every(q=>!["choice","pair","multi"].includes(q.type)||String(q.answer).split(",").every(a=>availableKana(Number(y),q).includes(a))))'),true)
assert.equal(app.run('Object.values(D).every(rows=>rows.reduce((sum,q)=>sum+(q.type==="manual"?q.points:objectiveScore(q,q.answer==="peanut(s)"?"peanuts":q.answer)),0)===80)'),true)
const expectedAnswerHashes={2019:'2c8f4caf269b2f86',2020:'4498f380c3dd3505',2021:'06d74f61dc0fdc28',2022:'197b6eed97e3721a',2023:'623cf9d9ce32c8f0',2024:'d30b635beba4c946',2025:'02daeb6c420df4eb',2026:'9c21722c87c7c74d'}
for(const [year,hash] of Object.entries(expectedAnswerHashes)){
  const rows=app.run(`D[${year}].filter(q=>q.type!=="manual").map(q=>[q.id,q.answer])`)
  assert.equal(crypto.createHash('sha256').update(JSON.stringify(rows)).digest('hex').slice(0,16),hash)
}
assert.equal(app.run('(()=>{const groups=Object.groupBy(BANK.filter(q=>!q.retired),q=>q.targetId);return Object.values(groups).every(rows=>new Set(rows.map(q=>q.familyId)).size>=5&&rows.filter(q=>q.level===3).length>=2)})()'),true)
assert.equal(app.run('BANK.filter(q=>!q.retired&&q.type==="pair").every(q=>q.answer.length===2&&q.solution.length>=5&&q.solution.every(token=>q.tokens.includes(token)))'),true)
assert.equal(app.run('BANK.filter(q=>!q.retired&&q.type==="selfcheck"&&q.maxWords).every(q=>q.model.trim().split(/\\s+/).length<=q.maxWords)'),true)
assert.equal(app.run('Object.values(PAPER_UNDERLINES).flat().length'),114)
assert.equal(app.run(`Object.entries(PAPER_UNDERLINES).every(([key,entries])=>{const [y,p]=key.split(":");const page=P[y]?.find(x=>String(x.page)===p);return page&&entries.every(e=>e.text.includes(e.part||e.text)&&page.text.includes(e.text)&&paperLineHtml(page.text.split("\\n").find(line=>line.includes(e.text)),Number(y),Number(p)).includes("paper-underline"))})`),true)

// Finishing the frozen daily ten must reveal, but not silently require, the next optional task.
const optionalApp=runtime(storage({'waseshibu.adaptive.v3':JSON.stringify(initial)}))
optionalApp.run('for(const key of ensureDailyPlan().weakKeys)S.weak[key].status="mastered";save();goto("home")')
assert.match(optionalApp.app.innerHTML,/時間があれば次の過去問へ/)
assert.equal(optionalApp.run('planRemaining().length'),0)

// A past-paper draft always overrides remediation in the home call to action.
optionalApp.run('S.currentAttempt={id:"draft-1",year:2024,status:"active",mode:"untimed",exposure:"first",startedAt:new Date().toISOString()};save();goto("home")')
assert.match(optionalApp.app.innerHTML,/2024年度の続きを解く/)

// The daily maximum counts questions actually answered and survives A/B/C changes.
const countApp=runtime(storage({'waseshibu.adaptive.v3':JSON.stringify({...initial,schemaVersion:8})}))
countApp.run('startSkill("2024:3-1:test-0")')
for(let i=0;i<10;i++)countApp.run(`finishDrill(false);${i<9?'continueDrill();':''}`)
assert.equal(countApp.run('dailyAnswered()'),10)
assert.equal(countApp.run('dailyQuestionsRemaining()'),0)
assert.equal(countApp.run('new Set(S.drillLog.slice(-5).map(x=>x.q)).size'),5)
countApp.run('drillState=null;S.currentDrill=null;S.currentSkill=null;setGoal(70)')
assert.equal(countApp.run('dailyAnswered()'),10)
assert.equal(countApp.run('dailyQuestionsRemaining()'),0)
countApp.run('S.dailyProgress={date:"2000-01-01",answeredCount:10};S.dailyPlan=null')
assert.equal(countApp.run('dailyQuestionsRemaining()'),10)

// Same-skill links skip a future retention item and open an eligible item.
const skillApp=runtime(storage({'waseshibu.adaptive.v3':JSON.stringify({...initial,schemaVersion:8,weak:{future:{...weak["2024:3-1:test-0"],status:"pending",next:"2999-01-01"},ready:{...weak["2024:3-1:test-1"],next:"2000-01-01"}}})}))
skillApp.run('startFirstSkill("pronunciation")')
assert.equal(skillApp.run('drillState.key'),'ready')

// Current drill uses the current bank record, while a removed question is cleared safely.
const currentQuestion=app.run('BANK.find(q=>q.id==="rdt_cx01"&&!q.retired).id')
const currentWeak={...weak['2024:3-1:test-0'],targetId:app.run(`BANK.find(q=>q.id==="${currentQuestion}").targetId`)}
const refreshApp=runtime(storage({'waseshibu.adaptive.v3':JSON.stringify({...initial,schemaVersion:8,weak:{wk:currentWeak},currentSkill:'wk',currentDrill:{key:'wk',q:{id:currentQuestion,prompt:'stale'},used:[],answered:false}})}))
assert.notEqual(refreshApp.run('drillState.q.prompt'),'stale')
refreshApp.run('drillState.choiceOrder=[3,2,1,0];S.currentDrill=drillState;save()')
const normalizedOrderApp=runtime(refreshApp.context.localStorage)
assert.equal(normalizedOrderApp.run('JSON.stringify(drillState.choiceOrder)'),'[3,2,1,0]')
assert.equal(normalizedOrderApp.run('remapExplanationChoiceLabels("ア this／イ think／ウ those／エ there",{options:["this","think","those","there"]})'),'エ this／ウ think／イ those／ア there')
const removedApp=runtime(storage({'waseshibu.adaptive.v3':JSON.stringify({...initial,schemaVersion:8,weak:{wk:currentWeak},currentSkill:'wk',currentDrill:{key:'wk',q:{id:'removed-question'},used:[],answered:false}})}))
assert.equal(removedApp.run('drillState'),null)

// Backup checksum, pre-import recovery, and conflict preservation.
const backupApp=runtime(storage({'waseshibu.adaptive.v3':JSON.stringify({...initial,schemaVersion:8})}))
assert.equal(backupApp.run('(()=>{const p={appId:"waseshibu-english-adaptive",schemaVersion:8,state:S};p.stateChecksum=stateChecksum(p.state);return validateImport(p).goal})()'),60)
assert.throws(()=>backupApp.run('(()=>{const p={appId:"waseshibu-english-adaptive",schemaVersion:8,state:{...S,goal:70},stateChecksum:"bad"};return validateImport(p)})()'),/検査値/)
backupApp.run('savePreImportRecovery()')
assert.ok([...backupApp.context.localStorage.values.keys()].some(key=>key.startsWith('waseshibu.adaptive.pre-import.')))
const merged=backupApp.run('mergeImportedState({...S,currentAttempt:{id:"local",year:2024,status:"active"},currentDrill:{key:"a",q:{id:"pr01"}}},{...S,currentAttempt:{id:"incoming",year:2023,status:"active"},currentDrill:{key:"b",q:{id:"pr02"}},unknownFutureField:"kept"})')
assert.equal(merged.currentAttempt.id,'local')
assert.ok(merged.attempts.some(x=>x.id==='incoming'&&x.status==='interrupted'))
assert.equal(merged.recoveredDrills.length,1)
assert.equal(merged.unknownFutureField,'kept')

// Corrupt primary data recovers from a local migration snapshot.
const recoveryStore=storage({'waseshibu.adaptive.v3':'{broken','waseshibu.adaptive.pre-migration.v5':JSON.stringify(initial)})
const recoveryApp=runtime(recoveryStore)
assert.equal(recoveryApp.run('S.goal'),60)
assert.match(recoveryApp.run('S.recoveryNotice'),/自動復元/)

// Manual errors create one weakness per actual question, with all causes retained.
const manualApp=runtime(storage({'waseshibu.adaptive.v3':JSON.stringify({...initial,schemaVersion:8,weak:{}})}))
manualApp.run('createWeak(2024,D[2024].find(q=>q.id==="4"),"自己採点 10/24","main",["相手の主張の要約","文法・語彙"])')
assert.equal(manualApp.run('Object.keys(S.weak).filter(k=>k.startsWith("2024:4:")).length'),1)
assert.equal(manualApp.run('S.weak["2024:4:main"].manualComponents.length'),2)
manualApp.run('rememberScore(2024,"4",999,24)')
assert.equal(manualApp.run('S.manual["2024:4"].score'),24)

// Draft fields and reorder token use survive rerenders without duplicate tokens.
manualApp.run('drillState={q:BANK.find(q=>q.type==="reorder"),answered:false,order:[],orderIndices:[],textInputs:[],selfChecks:[],shuffled:null};addTokenAt(0);addTokenAt(0);rememberTextInput(0,"draft");rememberSelfCheck(0,true)')
assert.equal(manualApp.run('drillState.order.length'),1)
assert.equal(manualApp.run('drillState.textInputs[0]'),'draft')
assert.equal(manualApp.run('drillState.selfChecks[0]'),true)
assert.deepEqual(Array.from(manualApp.run('normalizeDrillState({q:{},order:["b","a"],shuffled:["a","b"],orderIndices:[]}).orderIndices')),[1,0])

// Incomplete objective answers require confirmation; timeout locks only objective inputs.
const gradeApp=runtime(storage({'waseshibu.adaptive.v3':JSON.stringify({...initial,schemaVersion:8,weak:{},currentAttempt:{id:'grade',year:2024,status:'active',mode:'untimed',exposure:'first',startedAt:new Date().toISOString()},manual:{'2024:4':{score:24,components:[]},'2024:6-4':{score:5,components:[]}}})}))
gradeApp.context.__confirmReturn=false
gradeApp.run('grade(2024)')
assert.equal(gradeApp.run('S.currentAttempt.status'),'active')
assert.match(gradeApp.context.__alerts.join(' '),/^$/)
gradeApp.run('S.currentAttempt.mode="timed";S.currentAttempt.overtime=true')
assert.match(gradeApp.run('answerRow(2024,D[2024].find(q=>q.type==="choice"))'),/ disabled/)
assert.doesNotMatch(gradeApp.run('answerRow(2024,D[2024].find(q=>q.type==="manual"))'),/timeout-note/)

const styles=fs.readFileSync(path.join(root,'styles.css'),'utf8')
assert.match(styles,/\.today-list/)
assert.match(styles,/@media\(max-width:700px\)/)
assert.match(styles,/\.attempt-bar \.timer\{position:fixed/)
const html=fs.readFileSync(path.join(root,'index.html'),'utf8')
assert.ok(html.indexOf('paper-underlines.js')<html.indexOf('app.js'))
assert.ok(html.indexOf('manual-guides.js')<html.indexOf('app.js'))
assert.ok(html.indexOf('learning-model.js')<html.indexOf('app.js'))
assert.match(html,/noindex,nofollow/)
assert.match(html,/application-version" content="0\.18\.1"/)
assert.match(app.run('paperLineHtml("     ア trouble                   イ thousand",2024,4)'),/<span class=paper-underline>ou<\/span>/)
assert.match(app.run('paperLineHtml("It was ③[       ] to find nothing.",2019,6)'),/③<span class=paper-underline>\[       \]<\/span>/)
assert.match(app.run('paperLineHtml("②“[      ]” asked Miss Mebbin.",2022,8)'),/②“<span class=paper-underline>\[      \]<\/span>/)
assert.doesNotMatch(app.run('paperLineHtml("ordinary text",2024,4)'),/paper-underline/)
assert.equal(app.run(`(()=>{for(const [y,pages] of Object.entries(P)){for(const p of pages){for(const line of p.text.split("\\n")){if(/[①②③④⑤⑥⑦⑧⑨⑩➀➁➂➃➄➅]/.test(line)&&!/下線部/.test(line)&&!paperLineHtml(line,Number(y),p.page).includes("paper-underline"))return false}}}return true})()`),true)

console.log('audit ok: schema8 migration/recovery, A/B/C goals, actual daily 10, 151 official answers, 283 drills, resume/merge, timeout/input, mobile/noindex')
