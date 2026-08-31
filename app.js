
const D=window.EXAM_DATA, P=window.PAPERS, BANK=window.DRILLS, FALLBACK=window.FALLBACK;
// STORAGE_KEY is permanent. Future releases migrate schemaVersion in place and must not rename this key.
const STORAGE_KEY="waseshibu.adaptive.v3", LEGACY_KEYS=["waseshibu.adaptive.v2"], RECOVERY_PREFIX="waseshibu.adaptive.pre-migration", IMPORT_RECOVERY_PREFIX="waseshibu.adaptive.pre-import", SCHEMA_VERSION=8, DAILY_TASK_LIMIT=10;
const ROUTE=[2024,2023,2022,2021,2020,2019,2025,2026];
const INIT={schemaVersion:SCHEMA_VERSION,goal:60,year:2024,answers:{},manual:{},history:[],attempts:[],weak:{},cause:{},drillLog:[],currentSkill:null,currentDrill:null,currentAttempt:null,lastResultId:null,lastStartedWeakKey:null,dailyPlan:null,dailyProgress:null,recoveredDrills:[],exposure:{},theme:"light",answerSheetOpen:true,answerSheetExpanded:false,examInfoCompact:false,recoveryNotice:null};
function storageKeys(prefix){const keys=[];try{for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(key?.startsWith(prefix))keys.push(key)}}catch(e){}return keys}
function recoveryCandidates(){const imports=storageKeys(`${IMPORT_RECOVERY_PREFIX}.`).sort().reverse(),migrations=storageKeys(`${RECOVERY_PREFIX}.v`).sort((a,b)=>(Number(b.split(".v").pop())||0)-(Number(a.split(".v").pop())||0));return [...imports,...migrations]}
function parseStored(key){try{const text=localStorage.getItem(key),value=text&&JSON.parse(text);return value&&typeof value==="object"?{value,text,key}:null}catch(e){return null}}
function consolidateManualWeak(state){for(const [year,rows] of Object.entries(D)){for(const q of rows.filter(x=>x.type==="manual")){const prefix=`${year}:${q.id}:`,entries=Object.entries(state.weak||{}).filter(([key])=>key.startsWith(prefix));if(!entries.length)continue;const mainKey=`${prefix}main`,components=[...new Set(entries.flatMap(([_,w])=>w.manualComponents||[w.component]).filter(x=>x&&x!=="main"))],states=entries.map(([_,w])=>w.status),source=entries.find(([key])=>key===mainKey)?.[1]||entries[0][1],status=states.every(x=>x==="mastered")?"mastered":states.every(x=>x!=="active")?"pending":"active",merged={...source,component:"main",category:q.category,focusTag:q.focusTag,status,manualComponents:components,wrongCount:Math.max(...entries.map(([_,w])=>Number(w.wrongCount)||0))};state.weak[mainKey]=merged;for(const [key] of entries)if(key!==mainKey){delete state.weak[key];if(state.cause?.[key]&&!state.cause[mainKey])state.cause[mainKey]=state.cause[key];delete state.cause?.[key];if(state.currentSkill===key)state.currentSkill=mainKey;if(state.currentDrill?.key===key)state.currentDrill.key=mainKey}}}return state}
function loadState(){
 let found=null,primaryCorrupt=false;
 try{primaryCorrupt=!!localStorage.getItem(STORAGE_KEY)&&!parseStored(STORAGE_KEY)}catch(e){}
 for(const key of [STORAGE_KEY,...LEGACY_KEYS,...recoveryCandidates()]){found=parseStored(key);if(found)break}
 const raw=found?.value||null,rawText=found?.text||null,sourceKey=found?.key||null;
 const next={...INIT,...(raw||{})};
 next.answers=next.answers||{};next.manual=next.manual||{};next.weak=next.weak||{};next.cause=next.cause||{};next.exposure=next.exposure||{};next.history=Array.isArray(next.history)?next.history:[];next.attempts=Array.isArray(next.attempts)?next.attempts:[];next.drillLog=Array.isArray(next.drillLog)?next.drillLog:[];next.dailyPlan=next.dailyPlan&&typeof next.dailyPlan==="object"?next.dailyPlan:null;next.dailyProgress=next.dailyProgress&&typeof next.dailyProgress==="object"?next.dailyProgress:null;next.recoveredDrills=Array.isArray(next.recoveredDrills)?next.recoveredDrills:[];
 const fromVersion=Number(raw?.schemaVersion)||2;
 if(fromVersion<3){
   next.history.forEach((x,i)=>{const id=`legacy-${x.year}-${i}-${x.at||"unknown"}`;if(!next.attempts.some(a=>a.id===id))next.attempts.push({id,year:Number(x.year),writtenScore:Number(x.score)||0,status:"graded",mode:"unknown",exposure:"unknown",comparable:false,gradedAt:x.at||null,aLost:x.aLost||0,bLost:x.bLost||0,cLost:0,legacy:true})});
   Object.keys(next.answers).forEach(key=>{const y=Number(key.split(":")[0]);if(y)next.exposure[y]=next.exposure[y]||"unknown"});
 }
 if(fromVersion===7&&next.dailyPlan?.date&&Number.isFinite(Number(next.dailyPlan.answeredCount)))next.dailyProgress={date:next.dailyPlan.date,answeredCount:Number(next.dailyPlan.answeredCount)||0};
 if(fromVersion<7)next.dailyPlan=null;
 if(next.currentAttempt?.mode==="targeted"){next.currentAttempt.mode="untimed";next.currentAttempt.interrupted=true}
 Object.values(next.weak).forEach(w=>{const q=(D[w.year]||[]).find(x=>x.id===w.id);if(q)w.priority=strategyPriority(q)});
 if(window.ENGLISH_MODEL)window.ENGLISH_MODEL.migrateState(next);
 consolidateManualWeak(next);
 if(fromVersion<=SCHEMA_VERSION){
   next.schemaVersion=SCHEMA_VERSION;
   try{if(rawText&&fromVersion<SCHEMA_VERSION){const recoveryKey=`${RECOVERY_PREFIX}.v${fromVersion}`;if(!localStorage.getItem(recoveryKey))localStorage.setItem(recoveryKey,rawText)}if(primaryCorrupt&&sourceKey!==STORAGE_KEY)next.recoveryNotice="破損した保存データを自動復元しました。";localStorage.setItem(STORAGE_KEY,JSON.stringify(next))}catch(e){}
 }
 return next;
}
let S=loadState();
let view="home", drillState=normalizeDrillState(S.currentDrill), timerHandle=null, dayRefreshHandle=null, renderedDate=today();
if(drillState){const current=BANK.find(q=>q.id===drillState.q?.id&&!q.retired);if(!current||!S.weak[drillState.key]||S.weak[drillState.key].status==="mastered"){drillState=null;S.currentDrill=null;S.currentSkill=null}else{drillState=normalizeDrillState({...drillState,q:current});S.currentDrill=drillState}}
let storageWarningShown=false;
const app=document.getElementById("app"), kana=["ア","イ","ウ","エ","オ","カ","キ","ク"];
const fullwidthDigits="０１２３４５６７８９";
const skillNames={pronunciation:"発音",stress:"アクセント",reorder:"語句整序",vocab_definition:"英文定義",writing_completion:"短文完成",summary:"要約",rebuttal:"要約＋反論",paraphrase:"言い換え",context:"文脈",emotion:"心情",reason:"理由",extract:"本文抜出",content_match:"内容一致",sentence_completion:"英語完成",reference:"指示語",connector:"接続語",insertion:"文挿入",detail:"内容把握",example:"具体例"};
function save(){if(Number(S.schemaVersion)>SCHEMA_VERSION)return false;S.schemaVersion=SCHEMA_VERSION;try{localStorage.setItem(STORAGE_KEY,JSON.stringify(S));return true}catch(e){if(!storageWarningShown){storageWarningShown=true;alert("学習履歴を端末に保存できませんでした。ブラウザの空き容量またはプライベートブラウズ設定を確認してください。")}return false}}
function h(s=""){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function norm(s){return String(s||"").trim().replace(/\s+/g,"").replace(/，/g,",").toLowerCase()}
function k(y,id){return `${y}:${id}`}
function badge(p){return `<span class="badge ${p}">${p}</span>`}
function localDate(d=new Date()){const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,"0"),day=String(d.getDate()).padStart(2,"0");return `${y}-${m}-${day}`}
function today(){return localDate()}
function plusDays(n){let d=new Date();d.setDate(d.getDate()+n);return localDate(d)}
function normalizeDrillState(value){
 if(!value||typeof value!=="object")return null;
 const q=value.q||null,expected=q?.options?q.options.map((_,i)=>i):[],candidate=Array.isArray(value.choiceOrder)?value.choiceOrder:[],choiceOrder=candidate.length===expected.length&&new Set(candidate).size===expected.length&&candidate.every(i=>expected.includes(i))?candidate:expected,order=Array.isArray(value.order)?value.order:[];
 let orderIndices=Array.isArray(value.orderIndices)?value.orderIndices.filter(i=>Number.isInteger(i)):[];
 if(!orderIndices.length&&order.length&&Array.isArray(value.shuffled)){const used=new Set();orderIndices=order.map(token=>{const index=value.shuffled.findIndex((x,i)=>x===token&&!used.has(i));if(index>=0)used.add(index);return index}).filter(i=>i>=0)}
 return {...value,used:Array.isArray(value.used)?value.used:[],selectedMany:Array.isArray(value.selectedMany)?value.selectedMany:[],order,orderIndices,textInputs:Array.isArray(value.textInputs)?value.textInputs:[],selfParts:Array.isArray(value.selfParts)?value.selfParts:[],selfChecks:Array.isArray(value.selfChecks)?value.selfChecks:[],choiceOrder,textDraft:value.textDraft||"",selfText:value.selfText||""};
}
function attemptId(){return `a-${Date.now()}-${Math.random().toString(36).slice(2,8)}`}
function yearKeys(obj,y){return Object.keys(obj||{}).filter(x=>x.startsWith(`${y}:`))}
function hasSavedAnswers(y){return yearKeys(S.answers,y).some(x=>S.answers[x]!=="")||yearKeys(S.manual,y).some(x=>S.manual[x]?.score!==""&&S.manual[x]?.score!==undefined)}
function strategyPriority(q){if(q.priority==="A")return "A";if(q.skill==="insertion")return "C";return "B"}
function gradeInGoal(grade,goal=S.goal){return grade==="A"||(grade==="B"&&goal>=70)||(grade==="C"&&goal>=75)}
function goalLabel(goal=S.goal){return goal===60?"A 60点":goal===70?"B 70点":"C 75点"}
function goalAdvice(goal=S.goal){return goal===60?"A問題を最優先にして60点を守ります。":goal===70?"Aを固め、B問題まで直して70点を狙います。":"A・Bを確実にした後、取れるC問題を選んで75点を狙います。"}
function setGoal(goal){goal=Number(goal);if(![60,70,75].includes(goal))return;S.goal=goal;S.dailyPlan=null;save();render()}
function routeRole(y){return y===2024?"初見診断":y===2025?"実戦確認":y===2026?"最終判定":"弱点補強"}
function routeRecommendations(y){
 if(y>=2025)return [];
 const targets=new Set(activeWeak().filter(([_,w])=>gradeInGoal(w.priority)).map(([_,w])=>w.targetId));
 return (D[y]||[]).filter(q=>targets.has(q.targetId)&&gradeInGoal(strategyPriority(q))).sort((a,b)=>strategyPriority(a).localeCompare(strategyPriority(b))).slice(0,3);
}
function exposureLabel(x){return ({first:"完全初見",partial:"一部見た",done:"解答済み",unknown:"判定不明"})[x]||"未設定"}
function skillName(s){return skillNames[s]||s}
function goto(v){view=v;document.querySelectorAll("nav button").forEach(b=>b.classList.toggle("active",b.dataset.v===v));render();scrollTo(0,0)}
document.querySelectorAll("nav button").forEach(b=>b.onclick=()=>goto(b.dataset.v));
document.getElementById("dark").onclick=()=>{document.documentElement.classList.toggle("dark");S.theme=document.documentElement.classList.contains("dark")?"dark":"light";save()}
if(S.theme==="dark")document.documentElement.classList.add("dark");

function activeWeak(){return Object.entries(S.weak).filter(([_,w])=>w.status!=="mastered")}
function mastered(){return Object.values(S.weak).filter(w=>w.status==="mastered").length}
function latestAttempt(y){return [...S.attempts].reverse().find(a=>a.status==="graded"&&(!y||a.year===Number(y)))}
function nextRouteYear(){return ROUTE.find(y=>!S.attempts.some(a=>a.year===y&&a.status==="graded"))||null}
function priorityOrder(w){return ({A:0,B:1,C:2})[w.priority]??3}
function eligibleToday([_,w]){return w.status==="active"||(w.status==="pending"&&(!w.next||w.next<=today()))}
function sortWeakEntries(a,b){
 const aDue=a[1].status==="pending"?0:1,bDue=b[1].status==="pending"?0:1;if(aDue!==bDue)return aDue-bDue;
 const priority=priorityOrder(a[1])-priorityOrder(b[1]);if(priority)return priority;
 const next=(a[1].next||"").localeCompare(b[1].next||"");if(next)return next;
 const assigned=(a[1].lastAssignedDate||"").localeCompare(b[1].lastAssignedDate||"");if(assigned)return assigned;
 return a[0].localeCompare(b[0]);
}
function dailyPlanValid(){return S.dailyPlan&&S.dailyPlan.date===today()&&Number(S.dailyPlan.goal)===Number(S.goal)}
function invalidateDailyPlan(){S.dailyPlan=null;save()}
function dailyProgressCount(){return S.dailyProgress?.date===today()?Math.max(0,Number(S.dailyProgress.answeredCount)||0):0}
function dailyAnswered(plan=ensureDailyPlan()){return Math.max(dailyProgressCount(),plan?.date===today()?Number(plan.answeredCount)||0:0)}
function dailyQuestionsRemaining(plan=ensureDailyPlan()){return plan?.kind==="weak"?Math.max(0,DAILY_TASK_LIMIT-dailyAnswered(plan)):0}
function dailyQuestionLimitReached(plan=ensureDailyPlan()){return dailyQuestionsRemaining(plan)<=0}
function ensureDailyPlan(){
 if(dailyPlanValid())return S.dailyPlan;
 const candidates=activeWeak().filter(([_,w])=>gradeInGoal(w.priority)).filter(eligibleToday).sort(sortWeakEntries),all=activeWeak().filter(([_,w])=>gradeInGoal(w.priority)),routeYear=nextRouteYear();
 if(candidates.length){
   const weakKeys=candidates.map(([key,w])=>{w.lastAssignedDate=today();return key});
   S.dailyPlan={date:today(),goal:S.goal,kind:"weak",weakKeys,answeredCount:dailyProgressCount(),createdAt:new Date().toISOString()};
 }else if(all.length){
   S.dailyPlan={date:today(),goal:S.goal,kind:"waiting",weakKeys:[],createdAt:new Date().toISOString()};
 }else if(routeYear){
   S.dailyPlan={date:today(),goal:S.goal,kind:"route",weakKeys:[],routeYear,createdAt:new Date().toISOString()};
 }else{
   S.dailyPlan={date:today(),goal:S.goal,kind:"complete",weakKeys:[],createdAt:new Date().toISOString()};
 }
 save();return S.dailyPlan;
}
function planRemaining(plan=ensureDailyPlan()){
 if(plan.kind!=="weak"||dailyQuestionLimitReached(plan))return [];
 return (plan.weakKeys||[]).filter(key=>{const w=S.weak[key];return w&&eligibleToday([key,w])});
}
function planBacklog(plan=ensureDailyPlan()){
 if(!dailyQuestionLimitReached(plan))return 0;
 return activeWeak().filter(([_,w])=>gradeInGoal(w.priority)).filter(eligibleToday).length;
}
function nextPendingDate(){return activeWeak().filter(([_,w])=>gradeInGoal(w.priority)).map(([_,w])=>w.status==="pending"&&w.next>today()?w.next:null).filter(Boolean).sort()[0]||null}
function completeTodayNote(plan){
 const backlog=planBacklog(plan),next=nextPendingDate();
 if(dailyQuestionLimitReached(plan)&&backlog)return `今日の必須10問は完了しました。残り${backlog}件は任意で続けられます。`;
 if(next)return `今日の必須課題は完了しました。次の定着チェックは ${next} です。`;
 if(nextRouteYear())return "今日の必須課題は完了しました。次の年度は明日以降に進めます。";
 return "今日の必須課題はすべて完了しました。";
}
function todayAction(){
 if(S.currentAttempt?.status==="active")return {label:`${S.currentAttempt.year}年度の続きを解く`,action:`openYear(${S.currentAttempt.year})`,note:"解答途中の過去問があります。"};
 if(drillState?.key&&S.weak[drillState.key]&&S.weak[drillState.key].status!=="mastered")return {label:"克服ドリルの続きから",action:"resumeCurrentDrill()",note:`${S.weak[drillState.key].year} ${S.weak[drillState.key].label} の途中から正確に再開します。`};
 const plan=ensureDailyPlan(),remaining=planRemaining(plan);
 if(remaining.length){const due=remaining.filter(key=>S.weak[key]?.status==="pending").length;return {label:due?"今日の定着チェック":"誤答の克服ドリル",action:"startTodayTasks()",note:`今日の必須問題は残り${dailyQuestionsRemaining(plan)}問です（実際に答えた問題を数えます）。`};}
 if(plan.kind==="route"&&plan.routeYear)return {label:`${plan.routeYear}年度 ${routeRole(plan.routeYear)}を始める`,action:`openYear(${plan.routeYear})`,note:"推奨ルート上の今日の課題です。"};
 return {complete:true,label:"今日の割当は完了",note:completeTodayNote(plan)};
}
function optionalNextAction(){
 const plan=ensureDailyPlan(),extra=activeWeak().filter(([key,w])=>gradeInGoal(w.priority)&&eligibleToday([key,w])).sort(sortWeakEntries)[0];
 if(extra)return {label:"時間があれば次の1件へ",action:`startSkill('${extra[0]}')`,note:`${extra[1].year} ${extra[1].label}（${extra[1].priority}）`};
 const y=nextRouteYear();if(y)return {label:"時間があれば次の過去問へ",action:`openYear(${y})`,note:`${y}年度 ${routeRole(y)}`};
 const outside=activeWeak().filter(eligibleToday).sort(sortWeakEntries)[0];if(outside)return {label:"時間があれば上の目標へ",action:`setGoal(${outside[1].priority==="B"?70:75})`,note:`${outside[1].priority}問題の未克服があります`};
 return null;
}
function goalEstimate(goal){const rows=activeWeak().filter(([_,w])=>gradeInGoal(w.priority,goal)),count=rows.length,years=ROUTE.filter(y=>!S.attempts.some(a=>a.year===y&&a.status==="graded")).length,questions=rows.reduce((sum,[_,w])=>sum+(w.status==="pending"?Math.max(0,2-(w.confirmStreak||0)):Math.max(0,3-(w.streak||0))+2),0),days=Math.ceil(questions/DAILY_TASK_LIMIT)+years;return {count,days}}
function home(){
 const active=activeWeak();
 const last=S.history.at(-1);
 const action=todayAction(),plan=ensureDailyPlan(),remaining=planRemaining(plan),optional=optionalNextAction(),isResume=S.currentAttempt?.status==="active"||(drillState?.key&&S.weak[drillState.key]&&S.weak[drillState.key].status!=="mastered"),etas=[60,70,75].map(t=>[t,goalEstimate(t)]);
 return `${S.recoveryNotice?`<section class="card okbox recovery-notice"><b>学習履歴を自動復元しました</b><p>${h(S.recoveryNotice)}</p><button onclick="dismissRecoveryNotice()">確認</button></section>`:""}<section class="card hero today-card ${action.complete?"today-complete":""}"><div class=today-head><div><div class=eyebrow>${action.complete?"TODAY'S PLAN COMPLETE":"TODAY · MAX 10 QUESTIONS"}</div><h2>今日やること</h2><p>${h(action.note)}</p></div><div class=goal-block><span>学習目標</span><strong>${goalLabel()}</strong><small>得点・履歴とは別に管理</small></div></div>
 <div class="target-row goal-selector"><span>目標を変更</span>${[60,70,75].map((t,i)=>`<button class="target-chip ${S.goal===t?"selected":""}" onclick="setGoal(${t})">${String.fromCharCode(65+i)} ${t}点</button>`).join("")}</div>
 <div class=goal-eta>${etas.map(([t,e])=>`<article class="${S.goal===t?"selected":""}"><div><b>${goalLabel(t)}</b><small>${e.count}弱点を対象</small></div><strong>${e.days?`約${e.days}日`:"達成"}</strong></article>`).join("")}</div><p class=goal-eta-note>現在の未克服数と1日最大10問から計算した目安です。得点到達を保証する日数ではありません。</p>
 ${isResume?`<div class=resume-action><button class=primary onclick="${action.action}">${h(action.label)}</button><span>${h(action.note)}</span></div>`:remaining.length?`<div class=today-list>${remaining.map((key,i)=>{const w=S.weak[key];return `<article><span>${i+1}</span><div><b>${h(w.year+" "+w.label)}</b><small>${badge(w.priority)} ${h(w.category)} ／ ${h(w.trap||w.focusTag||skillName(w.skill))}</small></div><button class="${i===0?"primary":""}" onclick="startSkill('${key}')">${i===0?"今これをやる":"開く"}</button></article>`}).join("")}</div>`:`<div class=row>${action.complete?`<span class=completion-mark>✓ ${h(action.label)}</span>${optional?`<button onclick="${optional.action}">${h(optional.label)}</button><small>${h(optional.note)}</small>`:""}`:`<button class=primary onclick="${action.action}">${h(action.label)}</button>`}<button onclick="goto('route')">学習ルートを見る</button></div>`}</section>
 <section class="grid three"><div class=card><div class=metric>${last?`${last.score}/80`:"--"}</div><div class=muted>${last?`${last.year}年度の筆記得点`:"過去問未実施"}</div></div>
 <div class=card><div class=metric>${goalLabel()}</div><div class=muted>現在の学習目標</div></div>
 <div class=card><div class=metric>${active.filter(([_,w])=>w.priority==="A").length}</div><div class=muted>A問題の未克服</div></div></section>
 <section class=card><div class="row space"><div><div class=eyebrow>CURRENT STATUS</div><h3>現在の到達状況</h3></div><b>未克服 ${active.length} ／ 克服済み ${mastered()}</b></div><p>${goalAdvice()}</p><p class=muted>A＝60点、B＝70点、C＝75点。目標を変えても、これまでの得点・正誤・類題履歴は消しません。</p></section>
 <section class=card><h3>推奨する過去問ルート</h3><p class=route-inline>${ROUTE.map(y=>`<span class="${S.attempts.some(a=>a.year===y&&a.status==="graded")?"done":""}">${y}</span>`).join("<b>→</b>")}</p><p class=muted>2024で診断し、2023～2019で補強。2025で実戦確認し、2026を最終判定に残します。</p></section>
 <section class=card><h3>${goalLabel()}の学習方針</h3><p>${goalAdvice()}</p><h3>克服ルール</h3><div class="grid three">
 <div class=bluebox><b>① ピンポイント類題</b><p>元の誤答と同じ論点を3問連続正解するまで反復。</p></div>
 <div class=warnbox><b>② 翌日チェック</b><p>3連続正解しても消さず、翌日に2問確認。</p></div>
 <div class=okbox><b>③ 克服</b><p>翌日の確認も2連続正解で初めて「克服済み」。</p></div></div></section>
 ${last?`<section class=card><h3>直近の過去問</h3><p>${last.year}年度　筆記 ${last.score}/80　／　A失点 ${last.aLost||0}点　／　B失点 ${last.bLost||0}点　／　C失点 ${last.cLost||0}点</p></section>`:""}`;
}
function route(){
 return `<section class="card hero"><div class=eyebrow>DIAGNOSE → REMEDIATE → VERIFY</div><h2>過去問学習ルート</h2><p>年度ごとの目的を変え、2025・2026の初見性を守ります。</p></section>
 <section class=route-list>${ROUTE.map((y,i)=>{const attempts=S.attempts.filter(a=>a.year===y),last=[...attempts].reverse().find(a=>a.status==="graded"),exp=S.exposure[y],status=last?"採点済み":S.currentAttempt?.year===y&&S.currentAttempt.status==="active"?"解答中":exp?"一部既出":"未着手",protectedYear=y>=2025&&!attempts.length&&!exp,recs=routeRecommendations(y);return `<article class="card route-step ${protectedYear?"protected":""}"><div class=route-number>${i+1}</div><div class=route-main><div class="row space"><div><h3>${y}年度</h3><b>${routeRole(y)}</b></div><span class="status-pill">${protectedYear?"初見温存中":status}</span></div><p>${y===2024?"現在地を測り、全問を弱点分析します。":y<2024?"2024で見つかった弱点に対応する実際の過去問を使います。":y===2025?"補強が直近型に通用するか確認します。":"本番前の最後の完全初見判定です。"}</p>${recs.length?`<div class=route-recs><b>現在の弱点に対応</b><p>${recs.map(q=>`${h(q.label)}（${skillName(q.skill)}・${strategyPriority(q)}）`).join(" ／ ")}</p></div>`:""}${last?`<p class=tiny>最新：筆記 ${last.writtenScore}/80　${exposureLabel(last.exposure)}　${last.comparable?"比較対象":"練習記録"}</p>`:""}<button class="${y===nextRouteYear()?"primary":""}" onclick="openYear(${y})">${S.currentAttempt?.year===y&&S.currentAttempt.status==="active"?"続きを解く":"年度を開く"}</button></div></article>`}).join("")}</section>`;
}
function openYear(y){y=Number(y);if(!ROUTE.includes(y))return goto("home");S.year=y;save();goto("exam")}
function clearYearWork(y){yearKeys(S.answers,y).forEach(x=>delete S.answers[x]);yearKeys(S.manual,y).forEach(x=>delete S.manual[x])}
function beginAttempt(y){
 const exposure=document.querySelector('input[name="exposure"]:checked')?.value,mode=document.querySelector('input[name="examMode"]:checked')?.value;
 if(!exposure||!mode)return alert("初見状況と実施方法を選んでください。");
 let limit=null;if(mode==="timed"){limit=Number(document.getElementById("timeLimit")?.value);if(!Number.isFinite(limit)||limit<10||limit>180)return alert("本番の制限時間を10～180分で入力してください。")}
 if(S.currentAttempt?.status==="active"&&S.currentAttempt.year!==y&&!confirm(`${S.currentAttempt.year}年度が解答途中です。中断して${y}年度を始めますか？`))return;
 if(hasSavedAnswers(y)&&!confirm(`${y}年度の現在の入力欄を消して、新しい受験を始めますか？ 過去の採点済み結果は残ります。`))return;
 if(S.currentAttempt?.status==="active"){
   const old=S.currentAttempt,oy=old.year;old.status="interrupted";old.interrupted=true;old.endedAt=new Date().toISOString();old.answers=Object.fromEntries(yearKeys(S.answers,oy).map(x=>[x,S.answers[x]]));old.manual=Object.fromEntries(yearKeys(S.manual,oy).map(x=>[x,S.manual[x]]));S.attempts.push({...old});
 }
 if(hasSavedAnswers(y))clearYearWork(y);
 S.currentAttempt={id:attemptId(),year:Number(y),status:"active",exposure,mode,limitMinutes:limit,startedAt:new Date().toISOString(),startedTimezone:Intl.DateTimeFormat().resolvedOptions().timeZone||"local",interrupted:false,overtime:false};
 S.exposure[y]=exposure;save();render();
}
function resumeLegacy(y){
 S.currentAttempt={id:attemptId(),year:Number(y),status:"active",exposure:S.exposure[y]||"unknown",mode:"unknown",limitMinutes:null,startedAt:new Date().toISOString(),startedTimezone:Intl.DateTimeFormat().resolvedOptions().timeZone||"local",interrupted:true,legacy:true};save();render();
}
function interruptAttempt(){if(!S.currentAttempt)return;S.currentAttempt.interrupted=true;S.currentAttempt.mode="untimed";save();alert("中断を記録しました。この受験は保存されますが、本番比較・安定判定には使いません。");render()}
function attemptComparable(a){return a?.exposure==="first"&&a?.mode==="timed"&&!a?.interrupted&&!a?.overtime}
function elapsedSeconds(a){return Math.max(0,Math.floor((Date.now()-new Date(a.startedAt).getTime())/1000))}
function timerMarkup(a){if(a.mode!=="timed")return `<span class="timer practice">時間無制限</span>`;const total=a.limitMinutes*60,remain=total-elapsedSeconds(a);if(remain<=0){a.overtime=true;save()}const abs=Math.abs(remain),mm=String(Math.floor(abs/60)).padStart(2,"0"),ss=String(abs%60).padStart(2,"0");return `<span id=examTimer class="timer ${remain<=0?"over":""}">${remain<=0?"時間超過 ":"残り "}${mm}:${ss}</span>`}
function updateTimer(){const a=S.currentAttempt,el=document.getElementById("examTimer");if(!el||!a||a.mode!=="timed")return;const total=a.limitMinutes*60,remain=total-elapsedSeconds(a);if(remain<=0&&!a.overtime){a.overtime=true;save()}const abs=Math.abs(remain),mm=String(Math.floor(abs/60)).padStart(2,"0"),ss=String(abs%60).padStart(2,"0");el.textContent=`${remain<=0?"時間超過 ":"残り "}${mm}:${ss}`;el.classList.toggle("over",remain<=0)}
function examGate(y){
 const protectedYear=y>=2025&&!S.exposure[y]&&!S.attempts.some(a=>a.year===y),saved=hasSavedAnswers(y);
 return `<section class="card hero exam-gate ${protectedYear?"protected":""}"><div class=eyebrow>${routeRole(y)}</div><h2>${y}年度を始める前に</h2>${protectedYear?`<div class=warnbox><b>初見温存中</b><p>${y===2026?"最終判定用の年度です。補強と2025年度の確認後に解くことを推奨します。":"直近型の実戦確認用です。2019～2023の補強後を推奨します。"}</p></div>`:""}
 <fieldset><legend>この年度を以前に見ましたか？</legend><label><input type=radio name=exposure value=first> 完全初見</label><label><input type=radio name=exposure value=partial> 一部見た</label><label><input type=radio name=exposure value=done> 解いたことがある</label></fieldset>
 <fieldset><legend>実施方法</legend><label><input type=radio name=examMode value=timed onchange="document.getElementById('limitRow').hidden=false"> 本番時間で通し演習</label><label><input type=radio name=examMode value=untimed onchange="document.getElementById('limitRow').hidden=true"> 時間無制限で通し演習</label><div id=limitRow hidden><label>公式に指定された制限時間 <input id=timeLimit type=number inputmode=numeric min=10 max=180 placeholder="分"> 分</label><p class=tiny>公式資料で時間を確認して入力してください。アプリは未確認の時間を自動設定しません。</p></div></fieldset>
 <div class=row><button class=primary onclick="beginAttempt(${y})">問題を開いて開始</button>${saved?`<button onclick="resumeLegacy(${y})">保存済み答案を続ける</button>`:""}</div></section>`;
}
function fwNumber(n){return [...String(n)].map(x=>fullwidthDigits[Number(x)]).join("")}
function cutSection(text,startRe,nextRe){
 const start=startRe.exec(text);if(!start)return null;
 const rest=text.slice(start.index),next=nextRe.exec(rest.slice(start[0].length));
 return next?rest.slice(0,start[0].length+next.index):rest;
}
function questionSource(y,q){
 const all=(P[y]||[]).map(p=>p.text).join("\n"),big=(q.label.match(/大問(\d+)/)||[])[1];
 let section=big?cutSection(all,new RegExp(`^${fwNumber(big)}[ \\t　]+`,"m"),/^[３４５６７８][ \t　]+/m):null;
 section=section||all;
 const part=q.label.match(/\s問(\d+)(?:\((\d+)\))?/);if(!part)return section;
 section=cutSection(section,new RegExp(`^問[${part[1]}${fwNumber(part[1])}][ \\t　]+`,"m"),/^問[1-9１２３４５６７８９][ \t　]+/m)||section;
 if(part[2]){
   const next=String(Number(part[2])+1);
   section=cutSection(section,new RegExp(`^[（(][${part[2]}${fwNumber(part[2])}][）)]`,"m"),new RegExp(`^[（(][${next}${fwNumber(next)}][）)]`,"m"))||section;
 }
 return section;
}
function availableKana(y,q){
 const source=questionSource(y,q),range=source.match(/[（(]?ア[）)]?\s*[～〜]\s*[（(]?([イ-ク])[）)]?/);
 if(range)return kana.slice(0,kana.indexOf(range[1])+1);
 const found=new Set([...source.matchAll(/[ア-ク](?=[ \t　A-Za-z])/g)].map(m=>m[0])),result=[];
 for(const mark of kana){if(found.has(mark))result.push(mark);else break}
 return result.length?result:kana;
}
function majorNumbers(text){return [...text.matchAll(/^([３４５６７８])[ \t　]+/gm)].map(m=>fullwidthDigits.indexOf(m[1]))}
function joinWrappedLines(lines){
 return lines.reduce((out,line)=>{
   const next=line.trim();if(!out)return next;
   const gap=/[A-Za-z0-9,.;:]$/.test(out)&&/^[A-Za-z0-9]/.test(next)?" ":"";
   return out+gap+next;
 },"");
}
function needsContinuation(text){return !/[。.!?]$/.test(String(text).trim())}
function paperLineHtml(line,y,pageNumber){
 const ranges=[],entries=window.PAPER_UNDERLINES?.[`${y}:${pageNumber}`]||[];
 for(const entry of entries){
   let from=0,index;
   while((index=line.indexOf(entry.text,from))!==-1){
     const part=entry.part||entry.text,partIndex=entry.text.indexOf(part);
     if(partIndex!==-1)ranges.push([index+partIndex,index+partIndex+part.length]);
     from=index+Math.max(1,entry.text.length);
   }
 }
 const blankPattern=/[①②③④⑤⑥⑦⑧⑨⑩➀➁➂➃➄➅]\s*[“"']?\s*(\[[^\]]*\])/g;
 for(const match of line.matchAll(blankPattern)){
   const start=match.index+match[0].indexOf(match[1]);ranges.push([start,start+match[1].length]);
 }
 ranges.sort((a,b)=>a[0]-b[0]||b[1]-a[1]);
 const merged=[];for(const range of ranges){const last=merged.at(-1);if(last&&range[0]<=last[1])last[1]=Math.max(last[1],range[1]);else merged.push([...range])}
 if(!merged.length)return line?h(line):"&nbsp;";
 let out="",cursor=0;for(const [start,end] of merged){out+=h(line.slice(cursor,start))+`<span class=paper-underline>${h(line.slice(start,end))}</span>`;cursor=end}return out+h(line.slice(cursor));
}
function formatPaperText(text,y,startMajor,pageNumber){
 const lines=text.split("\n"),html=[];let currentMajor=startMajor,currentQuestion=null;
 for(let i=0;i<lines.length;i++){
   const line=lines[i],major=line.match(/^([３４５６７８])[ \t　]+(.*)$/);
   if(major){
     currentMajor=fullwidthDigits.indexOf(major[1]);currentQuestion=null;
     const title=[major[2]];
     while(title.length<5&&needsContinuation(joinWrappedLines(title))&&i+1<lines.length&&lines[i+1].trim()&&!/^[ \t　]*(?:[３４５６７８][ \t　]+|問[1-9１２３４５６７８９])/.test(lines[i+1]))title.push(lines[++i]);
     html.push(`<div id="problem-${y}-${currentMajor}" class=major-heading><span>大問${currentMajor}</span><strong>${paperLineHtml(joinWrappedLines(title),y,pageNumber)}</strong></div>`);continue;
   }
   const question=line.match(/^[ \t　]*問([1-9１２３４５６７８９])[ \t　]*/);
   if(question){
     currentQuestion=/[1-9]/.test(question[1])?Number(question[1]):fullwidthDigits.indexOf(question[1]);
     const title=[line];
     while(title.length<4&&needsContinuation(joinWrappedLines(title))&&i+1<lines.length&&lines[i+1].trim()&&!/^[ \t　]*(?:[３４５６７８][ \t　]+|問[1-9１２３４５６７８９]|[（(][1-9１２３４５６７８９][）)])/.test(lines[i+1]))title.push(lines[++i]);
     html.push(`<div id="problem-${y}-${currentMajor}-${currentQuestion}" class=subquestion-heading>${paperLineHtml(joinWrappedLines(title),y,pageNumber)}</div>`);continue;
   }
   const sub=line.match(/^[ \t　]*[（(]([1-9１２３４５６７８９])[）)]/);
   if(sub&&currentMajor&&currentQuestion){
     const subNumber=/[1-9]/.test(sub[1])?Number(sub[1]):fullwidthDigits.indexOf(sub[1]);
     html.push(`<div id="problem-${y}-${currentMajor}-${currentQuestion}-${subNumber}" class="paper-line subpart-line">${paperLineHtml(line,y,pageNumber)}</div>`);continue;
   }
   const pattern=(line.match(/\([^)]*\)/g)||[]).length>=3||/\[[ア-ク].*[ア-ク].*\]/.test(line);
   html.push(`<div class="paper-line ${pattern?"answer-pattern-line":""}">${paperLineHtml(line,y,pageNumber)}</div>`);
 }
 return {html:html.join(""),lastMajor:currentMajor};
}
function renderPaperPages(y,pages){
 let current=null;
 return pages.map((p,i)=>{
   const majors=majorNumbers(p.text),formatted=formatPaperText(p.text,y,current,p.page);current=formatted.lastMajor;
   const label=majors.length?`大問 ${majors.join("・")}`:current?`大問 ${current}（続き）`:`筆記ページ ${i+1}`;
   return `<article class=paper-page><div class=page-label><b>${y}年度</b><span>${label}</span></div><div class=paper-text>${formatted.html}</div></article>`;
 }).join("");
}
function answerMajors(rows){return [...new Set(rows.map(q=>(q.label.match(/大問(\d+)/)||[])[1]).filter(Boolean))]}
function manualComponents(q){
 if(q.skill==="rebuttal")return ["相手の主張の要約","反論への移行","反論の明確さ","理由・具体例","語数・条件","文法・語彙","判定できない"];
 if(q.skill==="summary")return ["重要点の選択","内容の正確さ","まとめ方","語数・条件","文法・語彙","判定できない"];
 if(q.skill==="writing_completion")return ["本文理解","内容の一貫性","語数・条件","文法・語彙","判定できない"];
 return ["語順・構文","必要語句","文法・語彙","条件漏れ","判定できない"];
}
function questionWeak(y,id){return Object.values(S.weak).find(w=>w.year===Number(y)&&w.id===id&&w.status!=="mastered")}
function exam(){
 const y=Number(S.year), rows=D[y], pages=P[y];
 const attempt=S.currentAttempt;if(!attempt||attempt.year!==y||attempt.status!=="active")return `<div class=tabs>${ROUTE.map(n=>`<button class="year ${n===y?"selected":""}" onclick="openYear(${n})">${n}</button>`).join("")}</div>${examGate(y)}`;
 return `<div class=tabs>${ROUTE.map(n=>`<button class="year ${n===y?"selected":""}" onclick="openYear(${n})">${n}</button>`).join("")}</div>
 <section class="attempt-bar ${S.examInfoCompact?"attempt-compact":""}"><div class=attempt-summary><b>${y}年度 <span class=attempt-role>${routeRole(y)}</span></b><span class=attempt-detail>${exposureLabel(attempt.exposure)}／${attempt.mode==="timed"?"本番時間":"時間無制限"}</span></div>${timerMarkup(attempt)}<div class=attempt-actions><button class=interrupt-button onclick="interruptAttempt()">中断を記録</button><button class=attempt-toggle onclick="toggleExamInfo()">${S.examInfoCompact?"開く":"小さくする"}</button></div></section>
 <section class=notice><b>${y}年度 実際の筆記問題</b><br><span class=muted>問題冊子PDFではなく、問題冊子から抽出した実際の本文・設問をそのまま表示しています。大問1・2（リスニング）は別アプリ対象です。</span></section>
 <div class=examgrid><section class=problem-column>${renderPaperPages(y,pages)}</section>
 <aside id=answerPanel class="card answerpanel ${S.answerSheetOpen?"sheet-open":"sheet-collapsed"} ${S.answerSheetExpanded?"sheet-expanded":""}"><div class=answer-sheet-head><div><h3>解答欄</h3><span>筆記80点</span></div><div class=sheet-actions>${S.answerSheetOpen?`<button type=button class="sheet-toggle size-toggle" onclick="toggleAnswerSize()">${S.answerSheetExpanded?"標準":"広げる"}</button>`:""}<button type=button class=sheet-toggle onclick="toggleAnswerSheet()">${S.answerSheetOpen?"閉じる":"解答欄を開く"}</button></div></div>
 <div class=answer-sheet-body><div class=answer-help><b>スマホでは問題を上側、解答欄を下側に同時表示</b><span>「問題へ」を押すと、該当箇所へすぐ移動します。</span></div>
 <div class=answer-jumps>${answerMajors(rows).map(m=>`<button type=button onclick="jumpAnswerMajor(${y},'${m}')">大問${m}</button>`).join("")}</div>
 ${rows.map(q=>answerRow(y,q)).join("")}
 <button class="primary grade-button" onclick="grade(${y})">採点して弱点分析</button></div></aside></div>`;
}
function answerRow(y,q){
 const key=k(y,q.id), rawVal=S.answers[key]??"", wr=questionWeak(y,q.id), cls=wr?.last==="wrong"?"bad":wr?.last==="correct"?"good":q.type==="manual"?"manual":"";
 const locked=q.type!=="manual"&&S.currentAttempt?.mode==="timed"&&S.currentAttempt?.overtime,disabled=locked?" disabled":"";
 const validKana=["choice","pair","multi"].includes(q.type)?availableKana(y,q):kana;
 let val=rawVal;
 if(q.type==="choice"&&!validKana.includes(val))val="";
 if(q.type==="pair"||q.type==="multi")val=norm(val).split(",").filter(x=>validKana.includes(x)).join(",");
 if(val!==rawVal){S.answers[key]=val;save()}
 let input="";
 if(q.type==="choice"){
   input=`<div class=input-guide>実際の選択肢から記号を1つタップ</div><input id="a-${q.id}" type=hidden value="${h(val)}"><div class="answer-options single" role=group aria-label="${h(q.label)}の回答">${validKana.map(x=>`<button type=button${disabled} class="answer-kana ${val===x?"selected":""}" aria-pressed="${val===x}" onclick="pickAnswer(${y},'${q.id}','${x}',this)">${x}</button>`).join("")}</div>`;
 }else if(q.type==="pair"||q.type==="multi"){
   const max=String(q.answer||"").split(",").filter(Boolean).length||2;
   const selected=norm(val).split(",").filter(Boolean);
   const note=q.type==="pair"?`<b>${max}つ</b>を、解答する順にタップ`:`<b>${max}つ</b>をタップ（順不同）`;
   input=`<div class=input-guide>${note}</div><input id="a-${q.id}" type=hidden value="${h(val)}"><div class=selection-summary id="summary-${q.id}">${selectionText(selected,q.type,max)}</div><div class="answer-options multi" role=group aria-label="${h(q.label)}の回答">${validKana.map(x=>`<button type=button${disabled} data-kana="${x}" class="answer-kana ${selected.includes(x)?"selected":""}" aria-pressed="${selected.includes(x)}" onclick="toggleKanaAnswer(${y},'${q.id}','${x}',${max},'${q.type}')">${x}</button>`).join("")}</div><button type=button${disabled} class=answer-clear onclick="clearKanaAnswer(${y},'${q.id}',${max},'${q.type}')">選択をやり直す</button>`;
 }else if(q.type==="text"){
   const placeholder=q.skill==="extract"?"本文から英語1語を入力（例：wish）":"半角英語で入力（例：hungry）";
   input=`<label class=input-guide for="a-${q.id}">${q.skill==="extract"?"本文から指定された語を抜き出して入力":"英語の答えを入力"}</label><input id="a-${q.id}"${disabled} value="${h(val)}" placeholder="${placeholder}" autocomplete=off autocapitalize=none spellcheck=false oninput="rememberAnswer(${y},'${q.id}',this.value)">`;
 }else{
   const score=S.manual[key]?.score??"";
   const selected=S.manual[key]?.components||[];
   const guide=window.MANUAL_GUIDES?.[key];
   input=`<div class=input-guide><b>記述問題</b>：紙に書いた答案を公式解答と比べ、自己採点した点数を入力</div>${guide?`<details class=official-guide><summary>${h(guide.title)}</summary><p class=official-answer>${h(guide.answer)}</p><p class=tiny>${h(guide.note)}</p></details>`:`<p class="tiny muted">この年度は公式解答冊子を手元で確認して採点してください。未確認の模範解答は表示しません。</p>`}<div class=score-input><button type=button aria-label="1点減らす" onclick="adjustScore(${y},'${q.id}',-1,${q.points})">−</button><input id="m-${q.id}" type=number inputmode=numeric min=0 max=${q.points} value="${score}" placeholder="未採点" oninput="rememberScore(${y},'${q.id}',this.value,${q.points})"><span>/ ${q.points}点</span><button type=button aria-label="1点増やす" onclick="adjustScore(${y},'${q.id}',1,${q.points})">＋</button></div><details class=component-picker ${score!==""&&Number(score)<q.points?"needs-input":""}><summary>減点された原因を選ぶ</summary>${manualComponents(q).map(c=>`<label><input type=checkbox ${selected.includes(c)?"checked":""} onchange="rememberManualComponent(${y},'${q.id}','${c}',this.checked)"> ${c}</label>`).join("")}</details>`;
 }
 const priority=strategyPriority(q);
 return `<div id="answer-${y}-${q.id}" data-major="${(q.label.match(/大問(\d+)/)||[])[1]||""}" class="q ${cls}"><div class="row space"><b>${h(q.label)}</b><span>${q.points}点 ${badge(priority)}</span></div><div class=q-meta><span class="tiny muted">${h(q.category)} ／ 学習上の${priority}分類</span><button type=button onclick="jumpToProblem(${y},'${q.id}')">問題へ ↑</button></div>${locked?"<p class=timeout-note>制限時間終了のため、客観問題の解答をロックしました。記述の自己採点は続けられます。</p>":""}${input}${wr?.last==="wrong"?`<div class="tiny previous-answer">前回：${h(wr.user||"未入力")} → 正解 ${h(q.answer||"記述自己採点")}</div>`:""}</div>`;
}
function toggleAnswerSheet(){
 S.answerSheetOpen=!S.answerSheetOpen;save();render();
}
function toggleAnswerSize(){S.answerSheetExpanded=!S.answerSheetExpanded;save();render()}
function toggleExamInfo(){S.examInfoCompact=!S.examInfoCompact;save();render()}
function jumpAnswerMajor(y,major){
 const panel=document.querySelector(".answer-sheet-body");
 const actual=[...document.querySelectorAll(`#answerPanel .q[data-major="${major}"]`)][0];if(!panel||!actual)return;
 panel.scrollTo({top:Math.max(0,actual.offsetTop-95),behavior:"smooth"});actual.classList.add("focus-flash");setTimeout(()=>actual.classList.remove("focus-flash"),1200);
}
function jumpToProblem(y,id){
 const parts=String(id).split("-");let target=null;
 while(parts.length&&!target){target=document.getElementById(`problem-${y}-${parts.join("-")}`);if(!target)parts.pop()}
 if(!target)return alert("問題の位置を特定できませんでした。");
 target.scrollIntoView({behavior:"smooth",block:"start"});target.classList.add("focus-flash");setTimeout(()=>target.classList.remove("focus-flash"),1400);
}
function selectionText(arr,type,max){
 if(!arr.length)return `未選択（${max}つ選んでください）`;
 const joined=arr.join(type==="pair"?" → ":"・");
 return `<b>選択中：</b>${joined}<span>${arr.length}/${max}</span>`;
}
function rememberAnswer(y,id,value){S.answers[k(y,id)]=value;save()}
function pickAnswer(y,id,value,button){
 const input=document.getElementById("a-"+id);input.value=value;rememberAnswer(y,id,value);
 button.parentElement.querySelectorAll(".answer-kana").forEach(b=>{const on=b===button;b.classList.toggle("selected",on);b.setAttribute("aria-pressed",on)});
}
function toggleKanaAnswer(y,id,value,max,type){
 const input=document.getElementById("a-"+id);let arr=norm(input.value).split(",").filter(Boolean),i=arr.indexOf(value);
 if(i>=0)arr.splice(i,1);else if(arr.length<max)arr.push(value);else return alert(`${max}つまで選べます。別の記号に変える場合は、選択済みの記号をもう一度タップしてください。`);
 input.value=arr.join(",");rememberAnswer(y,id,input.value);
 const group=input.parentElement.querySelector(".answer-options");group.querySelectorAll(".answer-kana").forEach(b=>{const on=arr.includes(b.dataset.kana);b.classList.toggle("selected",on);b.setAttribute("aria-pressed",on)});
 document.getElementById("summary-"+id).innerHTML=selectionText(arr,type,max);
}
function clearKanaAnswer(y,id,max,type){
 const input=document.getElementById("a-"+id);input.value="";rememberAnswer(y,id,"");
 input.parentElement.querySelectorAll(".answer-kana").forEach(b=>{b.classList.remove("selected");b.setAttribute("aria-pressed","false")});
 document.getElementById("summary-"+id).innerHTML=selectionText([],type,max);
}
function rememberScore(y,id,value,max){
 const key=k(y,id),n=value===""?"":Math.max(0,Math.min(max,Number(value)||0));S.manual[key]={...(S.manual[key]||{}),score:n};save();
}
function rememberManualComponent(y,id,component,on){const key=k(y,id),old=S.manual[key]||{score:"",components:[]},set=new Set(old.components||[]);if(on)set.add(component);else set.delete(component);S.manual[key]={...old,components:[...set]};save()}
function adjustScore(y,id,delta,max){
 const input=document.getElementById("m-"+id),current=input.value===""?0:Number(input.value);input.value=Math.max(0,Math.min(max,current+delta));rememberScore(y,id,input.value,max);
}
function matches(q,a){
 const x=norm(a), z=norm(q.answer);
 if(q.type==="text"){if(z==="peanut(s)")return ["peanut","peanuts"].includes(x);return x===z}
 if(q.type==="multi"){return x.split(",").filter(Boolean).sort().join(",")===z.split(",").filter(Boolean).sort().join(",")}
 return x===z;
}
function objectiveScore(q,a){
 if(q.type==="multi"){const chosen=new Set(norm(a).split(",").filter(Boolean)),correct=norm(q.answer).split(",").filter(Boolean),unit=q.points/correct.length;return correct.reduce((sum,x)=>sum+(chosen.has(x)?unit:0),0)}
 return matches(q,a)?q.points:0;
}
function grade(y){
 const attempt=S.currentAttempt;if(!attempt||attempt.year!==Number(y)||attempt.status!=="active")return alert("新しい受験を開始してから採点してください。");
 const missingObjective=D[y].filter(q=>q.type!=="manual"&&(!String(S.answers[k(y,q.id)]??"").trim()||(q.type==="pair"||q.type==="multi")&&norm(S.answers[k(y,q.id)]).split(",").filter(Boolean).length!==(String(q.answer||"").split(",").filter(Boolean).length||2)));
 if(missingObjective.length&&!confirm(`${missingObjective.map(q=>q.label).join("、")} が未回答または選択数不足です。0点として採点しますか？`))return;
 const missingManual=D[y].filter(q=>q.type==="manual"&&(S.manual[k(y,q.id)]?.score===""||S.manual[k(y,q.id)]?.score===undefined));
 if(missingManual.length)return alert(`${missingManual.map(q=>`${q.label}（${q.points}点）`).join("、")} が未採点です。公式解答と比べて点数を入力してください。`);
 const missingCause=D[y].filter(q=>q.type==="manual"&&Number(S.manual[k(y,q.id)]?.score)<q.points&&!(S.manual[k(y,q.id)]?.components||[]).length);
 if(missingCause.length)return alert(`${missingCause.map(q=>q.label).join("、")} の「減点された原因」を1つ以上選んでください。`);
 let score=0,aLost=0,bLost=0,cLost=0,wrongCount=0;
 D[y].forEach(q=>{
   const key=k(y,q.id);
   if(q.type==="manual"){
     const sc=Math.max(0,Math.min(q.points,Number(S.manual[key].score)));score+=sc;
     if(sc<q.points){const components=S.manual[key].components||["判定できない"];createWeak(y,q,`自己採点 ${sc}/${q.points}`,"main",components);wrongCount++; const p=strategyPriority(q);if(p==="A")aLost+=q.points-sc;else if(p==="C")cLost+=q.points-sc;else bLost+=q.points-sc}
     else markActualCorrect(y,q,`自己採点 ${sc}/${q.points}`);
   }else{
     const a=String(S.answers[key]??"");S.answers[key]=a;
     const earned=objectiveScore(q,a);score+=earned;if(earned===q.points)markActualCorrect(y,q,a);
     else{createWeak(y,q,a);wrongCount++;const lost=q.points-earned,p=strategyPriority(q);if(p==="A")aLost+=lost;else if(p==="C")cLost+=lost;else bLost+=lost}
   }
 });
 attempt.status="graded";attempt.gradedAt=new Date().toISOString();attempt.writtenScore=score;attempt.aLost=aLost;attempt.bLost=bLost;attempt.cLost=cLost;attempt.wrongCount=wrongCount;attempt.comparable=attemptComparable(attempt);attempt.answers=Object.fromEntries(yearKeys(S.answers,y).map(x=>[x,S.answers[x]]));attempt.manual=Object.fromEntries(yearKeys(S.manual,y).map(x=>[x,S.manual[x]]));
 S.attempts.push({...attempt});S.history.push({year:y,score,aLost,bLost,cLost,wrongCount,at:attempt.gradedAt,attemptId:attempt.id});S.lastResultId=attempt.id;S.currentAttempt=null;
 const existingPlan=dailyPlanValid()?S.dailyPlan:null,unfinished=existingPlan?.kind==="weak"&&planRemaining(existingPlan).length;
 if(!unfinished){
   if(wrongCount)S.dailyPlan=null;
   else S.dailyPlan={date:today(),goal:S.goal,kind:"done",weakKeys:[],completedRouteYear:Number(y),completedAt:new Date().toISOString()};
 }
 save();goto("result");
 }
function createWeak(y,q,user,component="main",manualComponents=[]){
 const key=`${k(y,q.id)}:${component}`, old=S.weak[key]||{};
 S.weak[key]={...old,year:Number(y),id:q.id,label:q.label,category:component==="main"?q.category:`${q.category}：${component}`,component,skill:q.skill,targetId:q.targetId,focusTag:component==="main"?q.focusTag:`manual:${q.skill}:${component}`,examFormat:q.examFormat,trap:component==="main"?q.trap:component,priority:strategyPriority(q),points:q.points,user,last:"wrong",status:"active",streak:0,confirmStreak:0,next:today(),wrongCount:(old.wrongCount||0)+1,reservedConfirm:[],seenDrills:old.seenDrills||[],manualComponents:manualComponents.length?[...new Set(manualComponents)]:old.manualComponents||[]};
}
function markActualCorrect(y,q,user){
 Object.values(S.weak).filter(w=>w.year===Number(y)&&w.id===q.id).forEach(old=>{old.user=user;old.last="correct";old.actualCorrect=(old.actualCorrect||0)+1});
}
function setListeningScore(id,value){const a=S.attempts.find(x=>x.id===id);if(!a)return;const score=value===""?null:Math.max(0,Math.min(20,Number(value)||0));a.listeningScore=score;a.totalScore=score===null?null:a.writtenScore+score;save();render()}
function goalStatus(a,target){if(a.listeningScore!==null&&a.listeningScore!==undefined){const total=a.writtenScore+a.listeningScore;return total>=target?`到達（${total}/100）`:`あと${target-total}点`};const need=target-a.writtenScore;if(need<=0)return `筆記だけで${target}点以上`;if(need<=20)return `リスニング${need}/20以上が必要`;return `現在の筆記点では到達不可`}
function result(){
 const a=S.attempts.find(x=>x.id===S.lastResultId)||latestAttempt();if(!a){const y=nextRouteYear();return `<section class="card hero"><h2>採点結果はまだありません。</h2>${y?`<button onclick="openYear(${y})">過去問を始める</button>`:`<button onclick="goto('home')">今日やることへ</button>`}</section>`;}
 const total=a.listeningScore===null||a.listeningScore===undefined?null:a.writtenScore+a.listeningScore;
 const unresolved=activeWeak().map(([_,w])=>w).filter(w=>w.year===a.year).sort((x,y)=>x.priority.localeCompare(y.priority)).slice(0,6);
 return `<section class="card hero result-hero"><div class=eyebrow>${a.year} RESULT</div><h2>筆記 ${a.writtenScore}/80</h2><p>${exposureLabel(a.exposure)}／${a.mode==="timed"?"本番時間":"時間無制限"}／${a.comparable?"到達度比較に使用":"練習記録"}</p><div class="score-total">${total===null?"総合点はリスニング入力後に表示":`総合 ${total}/100`}</div></section>
 <section class="grid three"><div class=card><div class=metric>${a.aLost||0}</div><div class=muted>A問題の失点</div></div><div class=card><div class=metric>${a.bLost||0}</div><div class=muted>B問題の失点</div></div><div class=card><div class=metric>${a.cLost||0}</div><div class=muted>C問題の失点</div></div></section>
 <section class=card><h3>同じ受験回のリスニング</h3><p class=muted>別年度・別の受験回の最高点とは合算しません。</p><label>リスニング得点 <input class=listening-input type=number inputmode=numeric min=0 max=20 value="${a.listeningScore??""}" placeholder="未入力" onchange="setListeningScore('${a.id}',this.value)"> /20</label></section>
 <section class=card><h3>A・B・C目標への距離</h3><div class=goal-grid>${[60,70,75].map(t=>`<div class="goal-card ${S.goal===t?"selected":""}"><b>${goalLabel(t)}</b><span>${goalStatus(a,t)}</span></div>`).join("")}</div><p class=tiny>総合点は同じ年度・同じ受験回の筆記とリスニングだけを合算します。</p></section>
 ${unresolved.length?`<section class=card><h3>この年度の未克服ポイント</h3>${unresolved.map(w=>`<p><b>${badge(w.priority)} ${h(w.label)}</b>　${skillName(w.skill)}：${h(w.category)}</p>`).join("")}</section>`:""}
 <section class=card><h3>次にやること</h3><p>${goalAdvice()}</p><div class=row><button class=primary onclick="goto('home')">今日やることへ</button><button onclick="goto('review')">誤答一覧</button><button onclick="goto('route')">学習ルートへ</button></div></section>`;
}
function review(){
 const arr=activeWeak().sort(sortWeakEntries).map(([key,w])=>({key,w}));
 if(!arr.length)return `<section class="card hero"><h2>現在、未克服の誤答はありません。</h2><p>A問題を維持しながらB問題の上積みに進めます。</p></section>`;
 const plan=ensureDailyPlan(),remaining=planRemaining(plan),assigned=new Set(plan.weakKeys||[]),backlog=planBacklog(plan);
 return `<section class=card><div class="row space"><div><div class=eyebrow>ERROR → DRILL → RETEST</div><h2>間違い対策 ${arr.length}件</h2></div>${remaining.length?`<button class=primary onclick="startTodayTasks()">今日の残り ${remaining.length}件を進める</button>`:`<span class=completion-mark>✓ 今日の割当完了</span>`}</div>
 <p>${goalLabel()}の範囲を優先し、1日最大${DAILY_TASK_LIMIT}課題。同じ論点の類題を3連続正解→翌日2連続正解で克服です。${backlog?` 枠外の${backlog}件は次回以降に回します。`:""}</p></section>
 ${arr.map(({key,w})=>{const isAssigned=assigned.has(key),future=w.status==="pending"&&w.next>today(),buttonLabel=future?`${w.next} まで待つ`:isAssigned?(w.status==="pending"?"今日の定着チェック":"今日の克服ドリル"):(w.status==="pending"?"定着チェック":"追加練習");return `<section class="card wrong ${isAssigned?"today-assigned":""}"><div class="row space"><div><b>${w.year} ${h(w.label)}</b><div class="tiny"><span class=skill>${skillName(w.skill)}</span> ／ ${h(w.category)} ／ ${w.component&&w.component!=="main"?`元設問 ${w.points}点`:`${w.points}点`}</div></div>${badge(w.priority)}</div>
 <p>誤答：<b>${h(w.user||"未入力")}</b>　${w.status==="pending"?`<span class=badge>翌日確認待ち</span>`:""}</p>
 <p class=muted>${w.status==="pending"?`次の定着チェック：${w.next}`:`類題連続正解：${w.streak||0}/3`}</p>
 <label>失点原因 <select onchange="setCause('${key}',this.value)"><option value="">選択</option>${["ケアレスミス","知識不足","語順・構文","本文根拠の見落とし","選択肢の読み違い","推論しすぎ","時間不足","記述条件漏れ"].map(c=>`<option ${S.cause[key]===c?"selected":""}>${c}</option>`).join("")}</select></label>
 <div class=row style="margin-top:10px"><button ${future?"disabled":""} class="${isAssigned&&!future?"primary":""}" onclick="startSkill('${key}')">${buttonLabel}</button><button onclick="openYear(${w.year})">過去問本文を確認</button></div></section>`}).join("")}`;
}
function setCause(key,v){S.cause[key]=v;save()}
function startTodayTasks(){const remaining=planRemaining();if(!remaining.length)return alert("今日の割当は完了しています。");if(S.currentSkill&&remaining.includes(S.currentSkill))return startSkill(S.currentSkill);const entries=remaining.map(key=>[key,S.weak[key]]).sort(sortWeakEntries),last=entries.findIndex(([key])=>key===S.lastStartedWeakKey),chosen=entries[(last+1)%entries.length];startSkill(chosen[0])}
function startDue(){startTodayTasks()}
function poolForWeak(w){return BANK.filter(x=>!x.retired&&x.targetId===w.targetId)}
function lastDrillUse(key,id){for(let i=S.drillLog.length-1;i>=0;i--){const x=S.drillLog[i];if(x.key===key&&x.q===id)return i}return -1}
function leastRecentlyUsed(key,items,lastId,w,confirm=false){return [...items].sort((a,b)=>{const rank=q=>(q.focusTag===w.focusTag?-30:0)+(confirm&&q.level===3?-20:0)+(q.examFormat===w.examFormat?-6:0);return rank(a)-rank(b)||(a.id===lastId?1:b.id===lastId?-1:0)||lastDrillUse(key,a.id)-lastDrillUse(key,b.id)||a.id.localeCompare(b.id)})}
function ensureConfirmationReserve(key,w,pool){
 const byId=new Map(pool.map(x=>[x.id,x])),reserved=[];
 for(const id of [...new Set(Array.isArray(w.reservedConfirm)?w.reservedConfirm:[])]){const q=byId.get(id);if(q&&!reserved.some(x=>byId.get(x)?.familyId===q.familyId))reserved.push(id);if(reserved.length===2)break}
 if(reserved.length<2){const families=new Set(reserved.map(id=>byId.get(id)?.familyId)),choices=leastRecentlyUsed(key,pool.filter(x=>!reserved.includes(x.id)&&!families.has(x.familyId)),w.lastDrillId,w,true);while(reserved.length<2&&choices.length){const q=choices.shift();if(families.has(q.familyId))continue;families.add(q.familyId);reserved.push(q.id)}}
 w.reservedConfirm=reserved;return reserved;
}
function persistDrill(){S.currentDrill=drillState?JSON.parse(JSON.stringify(drillState)):null;save()}
function resumeCurrentDrill(){if(!drillState||!S.weak[drillState.key]){S.currentDrill=null;drillState=null;save();return goto("home")}goto("drill")}
function startSkill(key){
 const w=S.weak[key];if(!w)return;
 if(drillState?.key&&S.weak[drillState.key]?.status==="mastered"){drillState=null;S.currentDrill=null;S.currentSkill=null}
 if(drillState?.key===key&&drillState.q&&!drillState.q.retired)return resumeCurrentDrill();
 if(drillState?.key&&drillState.key!==key)return alert("別の克服ドリルが途中です。『今日やること』から途中の問題を完了してから次へ進んでください。");
 const pool=poolForWeak(w),families=new Set(pool.map(x=>x.familyId));if(families.size<5)return alert(`${skillName(w.skill)}の同一論点類題は現在${families.size}系統です。即時3問＋翌日2問を別問題で確保できないため開始できません。`);
 if(w.status==="pending"&&w.next>today())return alert(`定着チェック予定日は ${w.next} です。翌日確認の効果を守るため、予定日までは開始できません。`);
 ensureConfirmationReserve(key,w,pool);
 S.currentSkill=key;S.lastStartedWeakKey=key;
 drillState={key,skill:w.skill,targetId:w.targetId,focusTag:w.focusTag,mode:w.status==="pending"?"confirm":"train",used:[],q:null,error:null,answered:false,selected:null,selectedMany:[],order:[],orderIndices:[],textInputs:[],selfText:"",selfParts:[],selfChecks:[]};
 nextDrill();goto("drill");
}
function nextDrill(){
 if(!drillState)return;
 const w=S.weak[drillState.key],pool=poolForWeak(w);
 const reserved=ensureConfirmationReserve(drillState.key,w,pool),reservedFamilies=new Set(pool.filter(x=>reserved.includes(x.id)).map(x=>x.familyId));
 let candidates=drillState.mode==="confirm"?pool.filter(x=>reserved.includes(x.id)&&!drillState.used.includes(x.id)):pool.filter(x=>!reservedFamilies.has(x.familyId)&&!drillState.used.includes(x.id));
 if(!candidates.length){drillState.used=[];candidates=drillState.mode==="confirm"?pool.filter(x=>reserved.includes(x.id)):pool.filter(x=>!reserved.includes(x.id))}
 // During training, introduce level 1/2 first; confirmation may use any level.
 if(drillState.mode==="train"){
   const max=(w.streak||0)>=2?3:2;
   const leveled=candidates.filter(x=>x.level<=max);if(leveled.length)candidates=leveled;
 }
 candidates=leastRecentlyUsed(drillState.key,candidates,w.lastDrillId,w,drillState.mode==="confirm");
 const q=candidates[0];
 if(!q){drillState.q=null;drillState.error="出題できる類題を確保できませんでした。間違い対策へ戻って、もう一度開始してください。";persistDrill();return}
 drillState.error=null;
 drillState.q=q;drillState.used.push(q.id);w.lastDrillId=q.id;w.seenDrills=[...new Set([...(w.seenDrills||[]),q.id])];drillState.answered=false;drillState.selected=null;drillState.selectedMany=[];drillState.order=[];drillState.orderIndices=[];drillState.textInputs=[];drillState.selfText="";drillState.selfParts=[];drillState.selfChecks=[];drillState.selfcheck=false;drillState.choiceOrder=q.options?q.options.map((_,i)=>i).sort(()=>Math.random()-.5):[];persistDrill();
}
function drill(){
 if(!drillState){
   const due=activeWeak();
   return `<section class="card hero"><h2>克服ドリル</h2><p>${due.length?"「今日やること」から、元の誤答と同じ論点の類題へ進みます。":"現在ドリル対象はありません。"}</p><button onclick="goto('home')">今日やることへ</button></section>`;
 }
 const w=S.weak[drillState.key], q=drillState.q;
 if(!w||!q)return `<section class=card><h2>ドリルを開始できませんでした</h2><p>${h(drillState.error||"ドリル対象がありません。")}</p><button onclick="finishSession()">間違い対策へ戻る</button></section>`;
 const target=drillState.mode==="confirm"?2:3, streak=drillState.mode==="confirm"?(w.confirmStreak||0):(w.streak||0);
 return `<section class="card drill-card"><div class="row space"><div><div class=eyebrow>${drillState.mode==="confirm"?"SPACED RETEST":"REPEATED SIMILAR PRACTICE"}</div><h2>${skillName(drillState.skill)} 克服ドリル</h2></div><span>${streak}/${target} 連続正解</span></div>
 <div class=progress><span style="width:${Math.min(100,streak/target*100)}%"></span></div>
 <p class=muted>元の誤答：${w.year} ${h(w.label)} ／ ${h(w.category)} ／ ${h(w.trap||w.focusTag||"")}</p>
 <hr><h3 class=drill-prompt>${h(q.prompt)}</h3>${drillInput(q)}
 ${drillState.answered?drillFeedback(q):""}
 </section>`;
}
function drillInput(q){
 if(q.type==="choice")return `<div class=choices>${drillState.choiceOrder.map((original,shown)=>`<button ${drillState.answered?"disabled":""} class="choice ${drillState.answered?(original===q.answer?"correct":original===drillState.selected?"wrong":""):""}" onclick="answerDrillChoice(${original})">${kana[shown]}　${h(q.options[original])}</button>`).join("")}</div>`;
 if(q.type==="multi_choice")return `<div class=selection-summary>${drillState.selectedMany.length?`選択中：${drillState.selectedMany.map(i=>h(q.options[i])).join(" ／ ")}`:`未選択（${q.answer.length}つ）`}</div><div class=choices>${drillState.choiceOrder.map((original,shown)=>`<button ${drillState.answered?"disabled":""} class="choice ${drillState.selectedMany.includes(original)?"selected":""} ${drillState.answered?(q.answer.includes(original)?"correct":drillState.selectedMany.includes(original)?"wrong":""):""}" onclick="toggleDrillMulti(${original})">${kana[shown]}　${h(q.options[original])}</button>`).join("")}</div><button class=primary onclick="answerDrillChoiceMulti()">この2つで答える</button>`;
 if(q.type==="pair")return `<p><b>${h(q.lead)}</b>　選択肢を並べたときの2番目・5番目を順にタップ</p><div class=selection-summary>${drillState.selectedMany.length?drillState.selectedMany.map(i=>`${kana[i]} ${h(q.tokens[i])}`).join(" → "):`未選択（2つ）`}</div><div class="answer-options multi">${q.tokens.map((t,i)=>`<button class="answer-kana ${drillState.selectedMany.includes(i)?"selected":""}" ${drillState.answered?"disabled":""} onclick="toggleDrillPair(${i})">${kana[i]}<small>${h(t)}</small></button>`).join("")}</div><button class=primary onclick="answerDrillPair()">この順で答える</button>`;
 if(q.type==="text")return `<input id=drillText placeholder="${q.initial?`${h(q.initial)} から始まる英語1語`:"本文から英語1語"}" value="${h(drillState.textDraft||"")}" oninput="rememberDrillText(this.value)"><button class=primary onclick="answerDrillText()">答える</button>`;
 if(q.type==="text_multi")return `<div class=grid>${q.answers.map((_,i)=>`<input id=mt${i} placeholder="(${i+1})" value="${h(drillState.textInputs?.[i]||"")}" oninput="rememberTextInput(${i},this.value)">`).join("")}</div><button class=primary onclick="answerDrillMulti()">答える</button>`;
 if(q.type==="reorder"){const shuffled=shuffleTokens(q.tokens);return `<p><b>${h(q.lead)}</b></p><div class=tokens>${shuffled.map((t,i)=>`<button class="token ${drillState.orderIndices.includes(i)?"disabled":""}" ${drillState.orderIndices.includes(i)?"disabled":""} onclick="addTokenAt(${i})">${h(t)}</button>`).join("")}</div><div id=orderBox class=reorder-answer>${drillState.order.map(h).join(" ")}</div><div class=row><button onclick="undoToken()">1語戻す</button><button onclick="clearOrder()">やり直す</button><button class=primary onclick="answerReorder()">答える</button></div>`}
 if(q.type==="selfcheck"){const writing=q.partLimits?`<div class=self-parts>${q.partLimits.map((limit,i)=>`<label><b>(${i+1})</b><textarea placeholder="空所(${i+1})" oninput="rememberSelfPart(${i},this.value)">${h(drillState.selfParts?.[i]||"")}</textarea><span id=partCount${i}>${wordCount(drillState.selfParts?.[i]||"")}語 / ${limit}語以内</span></label>`).join("")}</div>`:`<textarea id=selfText placeholder="ここに答案を書く" oninput="rememberSelfText(this.value)">${h(drillState.selfText||"")}</textarea><div class=word-count id=wordCount>${wordCount(drillState.selfText||"")}語${q.maxWords?` / ${q.maxWords}語以内`:q.approxWords?` / 約${q.approxWords}語`:""}</div>`;return `${writing}<button class=primary onclick="showSelfCheck()">セルフチェックへ</button>${drillState.selfcheck?`<div class=warnbox><b>必須チェック</b>${q.check.map((x,i)=>`<label><input type=checkbox id=ck${i} ${drillState.selfChecks?.[i]?"checked":""} onchange="rememberSelfCheck(${i},this.checked)"> ${h(x)}</label><br>`).join("")}<p><b>答案例：</b>${h(q.model)}</p><div class=row><button onclick="selfResult(false)">まだ不十分</button><button class=primary onclick="selfResult(true)">条件を満たした</button></div></div>`:""}`}
 return "";
}
function shuffleTokens(tokens){if(drillState.shuffled)return drillState.shuffled;drillState.shuffled=[...tokens].sort(()=>Math.random()-.5);return drillState.shuffled}
function addTokenAt(i){if(drillState.answered||drillState.orderIndices.includes(i))return;drillState.orderIndices.push(i);drillState.order.push(shuffleTokens(drillState.q.tokens)[i]);persistDrill();render()}
function undoToken(){if(drillState.answered)return;drillState.order.pop();drillState.orderIndices.pop();persistDrill();render()}
function clearOrder(){drillState.order=[];drillState.orderIndices=[];persistDrill();render()}
function answerDrillChoice(i){if(drillState.answered)return;drillState.selected=i;finishDrill(i===drillState.q.answer)}
function toggleDrillMulti(i){if(drillState.answered)return;const a=drillState.selectedMany,j=a.indexOf(i),max=drillState.q.answer.length;if(j>=0)a.splice(j,1);else if(a.length<max)a.push(i);else return alert(`${max}つまで選べます。選択済みをもう一度押すと外せます。`);persistDrill();render()}
function answerDrillChoiceMulti(){const a=[...drillState.selectedMany].sort((x,y)=>x-y),b=[...drillState.q.answer].sort((x,y)=>x-y);if(a.length!==b.length)return alert(`${b.length}つ選んでください。`);finishDrill(a.every((x,i)=>x===b[i]))}
function toggleDrillPair(i){if(drillState.answered)return;const a=drillState.selectedMany,j=a.indexOf(i);if(j>=0)a.splice(j,1);else if(a.length<2)a.push(i);else return alert("2つまでです。選び直す記号をもう一度押してください。");persistDrill();render()}
function answerDrillPair(){if(drillState.selectedMany.length!==2)return alert("2番目・5番目の2つを順に選んでください。");finishDrill(drillState.selectedMany.every((x,i)=>x===drillState.q.answer[i]))}
function rememberDrillText(v){drillState.textDraft=v;persistDrill()}
function rememberTextInput(i,v){drillState.textInputs=drillState.textInputs||[];drillState.textInputs[i]=v;persistDrill()}
function answerDrillText(){let a=document.getElementById("drillText").value.trim().toLowerCase();finishDrill(a===drillState.q.answerText.toLowerCase())}
function answerDrillMulti(){let ok=drillState.q.answers.every((x,i)=>norm(drillState.textInputs?.[i])===norm(x));finishDrill(ok)}
function answerReorder(){let ok=drillState.order.join(" ")===drillState.q.answer.join(" ");finishDrill(ok)}
function wordCount(s){return String(s||"").trim()?String(s).trim().split(/\s+/).length:0}
function rememberSelfText(v){drillState.selfText=v;const el=document.getElementById("wordCount"),q=drillState.q;if(el)el.textContent=`${wordCount(v)}語${q.maxWords?` / ${q.maxWords}語以内`:q.approxWords?` / 約${q.approxWords}語`:""}`;persistDrill()}
function rememberSelfPart(i,v){drillState.selfParts=drillState.selfParts||[];drillState.selfParts[i]=v;const el=document.getElementById("partCount"+i),limit=drillState.q.partLimits[i];if(el)el.textContent=`${wordCount(v)}語 / ${limit}語以内`;persistDrill()}
function rememberSelfCheck(i,on){drillState.selfChecks=drillState.selfChecks||[];drillState.selfChecks[i]=on;persistDrill()}
function showSelfCheck(){const q=drillState.q;if(q.partLimits){for(let i=0;i<q.partLimits.length;i++){const n=wordCount(drillState.selfParts?.[i]);if(!n)return alert(`空所(${i+1})を入力してください。`);if(n>q.partLimits[i])return alert(`空所(${i+1})は${n}語です。${q.partLimits[i]}語以内に直してください。`)}}else{const n=wordCount(drillState.selfText);if(!n)return alert("答案を入力してください。");if(q.maxWords&&n>q.maxWords)return alert(`${n}語です。${q.maxWords}語以内に直してください。`)}drillState.selfcheck=true;persistDrill();render()}
function selfResult(ok){if(ok && !drillState.q.check.every((_,i)=>drillState.selfChecks?.[i]))return alert("必須チェックをすべて確認してください。");finishDrill(ok)}
function finishDrill(ok){
 if(!drillState||drillState.answered)return;
 ensureDailyPlan();
 const w=S.weak[drillState.key];drillState.answered=true;drillState.correct=ok;
 if(S.dailyPlan?.date===today()&&S.dailyPlan.kind==="weak"){
   const count=dailyAnswered(S.dailyPlan)+1;S.dailyPlan.answeredCount=count;S.dailyProgress={date:today(),answeredCount:count};
 }
 if(drillState.mode==="train"){
   if(ok)w.streak=(w.streak||0)+1;else w.streak=0;
   if(w.streak>=3){w.status="pending";w.next=plusDays(1);w.confirmStreak=0}
 }else{
   if(ok)w.confirmStreak=(w.confirmStreak||0)+1;else{w.confirmStreak=0;w.status="active";w.streak=0;w.next=today();w.reservedConfirm=[];drillState.mode="train";drillState.used=[];drillState.failedConfirmation=true;ensureConfirmationReserve(drillState.key,w,poolForWeak(w))}
   if(w.confirmStreak>=2){w.status="mastered";w.masteredAt=new Date().toISOString();w.last="correct"}
 }
 S.drillLog.push({key:drillState.key,skill:drillState.skill,targetId:w.targetId,q:drillState.q.id,ok,at:new Date().toISOString()});persistDrill();render()
}
function drillFeedback(q){
 const w=S.weak[drillState.key];
 let msg=drillState.correct?"正解":drillState.failedConfirmation?"定着チェック不正解":"不正解";
 let nextLabel="似た問題をもう1問";
 if(w.status==="pending"&&drillState.mode==="train")nextLabel="今日は終了（翌日確認へ）";
 if(w.status==="mastered")nextLabel="克服完了";
 const reachedLimit=dailyQuestionLimitReached();if(reachedLimit&&w.status!=="pending"&&w.status!=="mastered")nextLabel="今日の必須10問を完了";
 return `<div class="${drillState.correct?"okbox":"notice"}" style="margin-top:14px"><b>${msg}</b><p>${h(q.explanation||"")}</p>
 ${drillState.failedConfirmation?"<p>定着しきっていません。ここから3問連続正解の練習へ戻ります。</p>":""}
 ${w.status==="pending"&&drillState.mode==="train"?`<p>3問連続正解。<b>${w.next}</b> に2問の定着チェックを行います。</p>`:""}
 ${w.status==="mastered"?`<p>翌日の定着チェックも2問連続正解。克服済みにしました。</p>`:""}
 <button class=primary onclick="${reachedLimit||w.status==="mastered"|| (w.status==="pending"&&drillState.mode==="train")?"finishSession()":"continueDrill()"}">${nextLabel}</button></div>`;
}
function continueDrill(){drillState.selfcheck=false;drillState.shuffled=null;drillState.failedConfirmation=false;nextDrill();render()}
function finishSession(){drillState=null;S.currentSkill=null;S.currentDrill=null;save();goto("home")}

function stats(){
 const active=activeWeak(), bySkill={}, byCause={}, a=active.filter(([_,w])=>w.priority==="A"), b=active.filter(([_,w])=>w.priority==="B"), c=active.filter(([_,w])=>w.priority==="C");
 active.forEach(([key,w])=>{bySkill[w.skill]=(bySkill[w.skill]||0)+1;if(S.cause[key])byCause[S.cause[key]]=(byCause[S.cause[key]]||0)+1});
 const recent=S.drillLog.slice(-20), rate=recent.length?Math.round(recent.filter(x=>x.ok).length/recent.length*100):0;
 const comparable=S.attempts.filter(x=>x.status==="graded"&&x.comparable),latest=[...comparable].reverse()[0];
 const statusFor=t=>{const eligible=comparable.filter(x=>x.totalScore!==null&&x.totalScore!==undefined),reached=eligible.at(-1)?.totalScore>=t,stable=eligible.length>=2&&eligible.at(-1).year!==eligible.at(-2).year&&eligible.at(-1).totalScore>=t&&eligible.at(-2).totalScore>=t;return stable?"安定":reached?"到達":"未到達"};
 return `<section class="grid four"><div class=card><div class=metric>${a.length}</div><div class=muted>A未克服</div></div><div class=card><div class=metric>${b.length}</div><div class=muted>B未克服</div></div><div class=card><div class=metric>${c.length}</div><div class=muted>C未克服</div></div><div class=card><div class=metric>${rate}%</div><div class=muted>直近20類題</div></div></section>
 <section class=card><h2>総合点の到達度</h2><div class=goal-grid>${[60,70,75].map(t=>`<div class="goal-card ${statusFor(t)==="安定"?"stable":""} ${S.goal===t?"selected":""}"><b>${goalLabel(t)}</b><span>${statusFor(t)}</span></div>`).join("")}</div><p class=muted>「安定」は、異なる年度の完全初見・本番時間・通し演習で2回連続到達した場合のみです。${latest&&!latest.totalScore?" リスニング未入力のため総合判定は保留です。":""}</p></section>
 <section class=card><h2>年度別記録</h2><div class=table><table><tr><th>年度</th><th>役割</th><th>筆記</th><th>総合</th><th>条件</th></tr>${ROUTE.map(y=>{const x=latestAttempt(y);return `<tr><td>${y}</td><td>${routeRole(y)}</td><td>${x?`${x.writtenScore}/80`:"－"}</td><td>${x?.totalScore!==null&&x?.totalScore!==undefined?`${x.totalScore}/100`:"－"}</td><td>${x?(x.comparable?"比較対象":"練習記録"):"未着手"}</td></tr>`}).join("")}</table></div></section>
 <section class=card><h2>弱点分野</h2><div class=table><table><tr><th>分野</th><th>未克服</th><th>対策</th></tr>${Object.entries(bySkill).sort((a,b)=>b[1]-a[1]).map(([s,n])=>`<tr><td>${skillName(s)}</td><td>${n}</td><td><button onclick="startFirstSkill('${s}')">類題を解く</button></td></tr>`).join("")||"<tr><td colspan=3>未克服なし</td></tr>"}</table></div></section>
 <section class=card><h3>失点原因</h3>${Object.entries(byCause).sort((a,b)=>b[1]-a[1]).map(([c,n])=>`<p>${h(c)}：${n}</p>`).join("")||"<p class=muted>間違い対策画面で原因を選ぶと表示されます。</p>"}
 </section><section class=card><h3>優先順位</h3><p><b>Aの誤答 → Aのケアレスミス → 頻出B → 時間不足 → 記述条件</b>の順で直します。C相当の難問より、Aの再発防止を優先します。</p></section>`;
}
function startFirstSkill(s){let x=activeWeak().filter(([_,w])=>w.skill===s).filter(eligibleToday).sort(sortWeakEntries)[0];if(x)startSkill(x[0]);else alert("この分野は、今日取り組める問題がありません。定着チェック予定日を確認してください。")}
function stateChecksum(state){const text=JSON.stringify(state);let hash=2166136261;for(let i=0;i<text.length;i++){hash^=text.charCodeAt(i);hash=Math.imul(hash,16777619)}return `fnv1a32-${(hash>>>0).toString(16).padStart(8,"0")}`}
function exportData(){const payload={appId:"waseshibu-english-adaptive",schemaVersion:SCHEMA_VERSION,exportedAt:new Date().toISOString(),state:S,stateChecksum:stateChecksum(S)};const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=`waseshibu-english-backup-${today()}.json`;a.hidden=true;document.body?.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000)}
function savePreImportRecovery(){try{const key=`${IMPORT_RECOVERY_PREFIX}.${Date.now()}`;localStorage.setItem(key,JSON.stringify(S));const keys=storageKeys(`${IMPORT_RECOVERY_PREFIX}.`).sort().reverse();keys.slice(3).forEach(old=>localStorage.removeItem(old));return key}catch(e){return null}}
function normalizeImportedState(x){const next={...x,answers:x.answers||{},manual:x.manual||{},weak:x.weak||{},cause:x.cause||{},exposure:x.exposure||{},attempts:Array.isArray(x.attempts)?x.attempts:[],history:Array.isArray(x.history)?x.history:[],drillLog:Array.isArray(x.drillLog)?x.drillLog:[],dailyPlan:x.dailyPlan&&typeof x.dailyPlan==="object"?x.dailyPlan:null,dailyProgress:x.dailyProgress&&typeof x.dailyProgress==="object"?x.dailyProgress:null,recoveredDrills:Array.isArray(x.recoveredDrills)?x.recoveredDrills:[]};if(next.currentAttempt?.mode==="targeted"){next.currentAttempt.mode="untimed";next.currentAttempt.interrupted=true}return window.ENGLISH_MODEL?window.ENGLISH_MODEL.migrateState(next):next}
function validateImport(payload){if(!payload||payload.appId!=="waseshibu-english-adaptive"||!payload.state)throw new Error("このアプリのバックアップではありません。");if(!Number.isFinite(Number(payload.schemaVersion))||Number(payload.schemaVersion)>SCHEMA_VERSION)throw new Error("対応していないバックアップ形式です。");if(payload.stateChecksum&&payload.stateChecksum!==stateChecksum(payload.state))throw new Error("バックアップの検査値が一致しません。ファイルが途中で壊れた可能性があります。");const x=normalizeImportedState(payload.state);if(typeof x.answers!=="object"||Array.isArray(x.answers)||typeof x.weak!=="object"||Array.isArray(x.weak))throw new Error("必要な学習データがありません。");for(const a of x.attempts){const writtenMissing=a.writtenScore===null||a.writtenScore===undefined||a.writtenScore==="",written=Number(a.writtenScore),writtenInvalid=(!writtenMissing&&(!Number.isFinite(written)||written<0||written>80))||(a.status==="graded"&&writtenMissing),listening=a.listeningScore;const listeningInvalid=listening!==null&&listening!==undefined&&(listening===""||!Number.isFinite(Number(listening))||Number(listening)<0||Number(listening)>20);if(!a.id||!ROUTE.includes(Number(a.year))||writtenInvalid||listeningInvalid)throw new Error("受験記録の年度または点数が不正です。")}if(x.currentAttempt&&(!x.currentAttempt.id||!ROUTE.includes(Number(x.currentAttempt.year))))throw new Error("解答途中の記録が不正です。");return x}
function mergeWeak(a={},b={}){if(a.status==="mastered"&&b.status!=="mastered")return a;if(b.status==="mastered"&&a.status!=="mastered")return b;const ap=(a.confirmStreak||0)*10+(a.streak||0),bp=(b.confirmStreak||0)*10+(b.streak||0);return bp>=ap?{...a,...b}:{...b,...a}}
function dedupeBy(arr,keyFn){const m=new Map();arr.forEach(x=>m.set(keyFn(x),x));return [...m.values()]}
function mergeExposure(a={},b={}){const rank={first:0,unknown:1,partial:2,done:3},out={...a};Object.entries(b).forEach(([y,v])=>{if(out[y]===undefined||rank[v]>=rank[out[y]])out[y]=v});return out}
function mergeAnswerMaps(current={},incoming={}){const out={...incoming};Object.entries(current).forEach(([key,value])=>{if(String(value??"").trim()||!String(out[key]??"").trim())out[key]=value});return out}
function mergeManualMaps(current={},incoming={}){const out={...incoming};Object.entries(current).forEach(([key,value])=>{const other=out[key]||{},currentHas=value?.score!==""&&value?.score!==undefined,incomingHas=other?.score!==""&&other?.score!==undefined;out[key]={...(currentHas||!incomingHas?other:value),...(currentHas||!incomingHas?value:other),components:[...new Set([...(other.components||[]),...(value?.components||[])])]}});return out}
function mergeDailyProgress(a,b){if(a?.date===today()||b?.date===today())return {date:today(),answeredCount:Math.max(a?.date===today()?Number(a.answeredCount)||0:0,b?.date===today()?Number(b.answeredCount)||0:0)};return a||b||null}
function mergeImportedState(current,incoming){
 const attemptMap=new Map([...(incoming.attempts||[]),...(current.attempts||[])].map(x=>[x.id,x])),weak={...(current.weak||{})};Object.entries(incoming.weak||{}).forEach(([key,w])=>weak[key]=mergeWeak(weak[key],w));
 let currentAttempt=current.currentAttempt||null,recoveredDrills=[...(current.recoveredDrills||[]),...(incoming.recoveredDrills||[])];
 if(currentAttempt&&incoming.currentAttempt&&currentAttempt.id!==incoming.currentAttempt.id){const archived={...incoming.currentAttempt,status:"interrupted",interrupted:true,endedAt:new Date().toISOString(),recoveredFromImport:true};attemptMap.set(archived.id,archived)}else if(!currentAttempt)currentAttempt=incoming.currentAttempt||null;
 let currentDrill=current.currentDrill||null;if(currentDrill&&incoming.currentDrill&&(currentDrill.key!==incoming.currentDrill.key||currentDrill.q?.id!==incoming.currentDrill.q?.id))recoveredDrills.push({...incoming.currentDrill,recoveredAt:new Date().toISOString()});else if(!currentDrill)currentDrill=incoming.currentDrill||null;
 return {...incoming,...current,answers:mergeAnswerMaps(current.answers,incoming.answers),manual:mergeManualMaps(current.manual,incoming.manual),weak,cause:{...(incoming.cause||{}),...(current.cause||{})},exposure:mergeExposure(incoming.exposure,current.exposure),attempts:[...attemptMap.values()],history:dedupeBy([...(incoming.history||[]),...(current.history||[])],x=>x.attemptId||`${x.year}:${x.at}:${x.score}`),drillLog:dedupeBy([...(incoming.drillLog||[]),...(current.drillLog||[])],x=>`${x.key}:${x.q}:${x.at}:${x.ok}`),currentAttempt,currentDrill,recoveredDrills:dedupeBy(recoveredDrills,x=>`${x.key}:${x.q?.id}:${x.recoveredAt||"saved"}`),dailyPlan:null,dailyProgress:mergeDailyProgress(current.dailyProgress,incoming.dailyProgress),schemaVersion:SCHEMA_VERSION}
}
async function importData(input){const file=input.files?.[0];if(!file)return;if(file.size>10*1024*1024)return alert("バックアップファイルが大きすぎます。");try{const incoming=validateImport(JSON.parse(await file.text())),mode=document.getElementById("importMode")?.value||"merge";if(!confirm(`バックアップを${mode==="replace"?"現在データと置き換え":"現在データへ統合"}ます。よろしいですか？`))return;savePreImportRecovery();S=mode==="replace"?{...INIT,...incoming,schemaVersion:SCHEMA_VERSION}:mergeImportedState(S,incoming);if(window.ENGLISH_MODEL)window.ENGLISH_MODEL.migrateState(S);consolidateManualWeak(S);S.dailyPlan=null;drillState=normalizeDrillState(S.currentDrill);const current=BANK.find(q=>q.id===drillState?.q?.id&&!q.retired);if(drillState&&(!current||!S.weak[drillState.key]||S.weak[drillState.key].status==="mastered")){drillState=null;S.currentDrill=null;S.currentSkill=null}else if(drillState){drillState=normalizeDrillState({...drillState,q:current});S.currentDrill=drillState}renderedDate=today();save();alert("学習データを復元しました。インポート前の状態も端末内に退避しました。");goto("home")}catch(e){alert(`復元できませんでした：${e.message}`)}finally{input.value=""}}
function dismissRecoveryNotice(){S.recoveryNotice=null;save();render()}
function restoreRecoveredDrill(index){const item=normalizeDrillState(S.recoveredDrills?.[index]),w=item&&S.weak[item.key],q=item&&BANK.find(x=>x.id===item.q?.id&&!x.retired);if(!item||!w||w.status==="mastered"||!q)return alert("この退避ドリルは現在の問題バンクでは再開できません。履歴自体は残っています。");if(drillState&&!confirm("現在のドリルを退避し、選択したドリルを再開しますか？"))return;if(drillState)S.recoveredDrills.push({...drillState,recoveredAt:new Date().toISOString()});item.q=q;S.recoveredDrills.splice(index,1);drillState=item;S.currentDrill=item;S.currentSkill=item.key;save();goto("drill")}
function deleteRecoveredDrill(index){if(!confirm("この退避ドリルを一覧から削除しますか？ 学習履歴と弱点は削除されません。"))return;S.recoveredDrills.splice(index,1);save();render()}
function guide(){
 return `<section class=card><h2>この版の使い方</h2><ol>
 <li><b>学習ルート</b>：2024→2023→2022→2021→2020→2019→2025→2026の順で進める。</li>
 <li><b>実際の過去問</b>：PDFではなく、2019〜2026の実際の筆記本文・設問を画面内で読む。</li>
 <li>解答欄では、選択問題は記号ボタンをタップ。複数回答は選んだ順を確認し、英語は入力欄へ直接入力する。</li>
 <li>記述問題は紙に書いた答案を公式解答と比べ、自己採点した点数を入力する。</li>
 <li>誤答は自動で<b>間違い対策</b>へ入る。</li>
 <li>失点原因を選ぶ。</li>
 <li><b>学習目標</b>：A 60点、B 70点、C 75点から選ぶ。目標変更は得点・正誤・履歴を変えず、今日の推奨だけを再計算する。</li>
 <li><b>今日の割当</b>：定着確認と目標範囲の誤答を優先し、実際に答えた類題を1日最大10問まで数える。終えた後も任意の次問題を表示する。</li>
 <li><b>克服ドリル</b>：元の誤答と同じ論点の類題を3問連続正解するまで繰り返す。途中で画面を移動しても同じ進行位置から再開する。</li>
 <li>3連続正解しても消さず、翌日に2問の定着チェック。</li>
 <li>翌日も2連続正解して初めて克服済み。</li></ol>
 <div class=notice><b>英単語・リスニング</b><p>通常の英単語学習とリスニングは別アプリ想定です。過去問中の英文定義問題は本番演習として残しますが、単語そのものの大量反復はこのアプリの中心にはしていません。</p></div>
 <div class=bluebox><b>類題について</b><p>${BANK.filter(x=>!x.retired).length}問の有効なオリジナル類題を収録しています。元設問の論点を優先し、翌日確認には異なる問題系統を2問確保します。</p></div>
 <div class=warnbox><b>A・B・Cについて</b><p>学校公式の分類ではなく、合格戦略上の分類です。A＝60点を守る、B＝70点への上積み、C＝75点で選ぶ高コスト問題です。</p></div>
 <section class=backup-box><h3>学習データのバックアップ</h3><p>この端末では、アプリを更新しても学習履歴を自動で引き継ぎます。機種変更、ブラウザ変更、端末故障への備えにはバックアップを使ってください。復元前の状態は端末内にも3世代まで退避します。</p><div class=row><button onclick="exportData()">バックアップを書き出す</button><label>復元方法 <select id=importMode><option value=merge>現在データへ統合</option><option value=replace>現在データと置換</option></select></label><label class=file-button>バックアップを選ぶ<input type=file accept="application/json,.json" onchange="importData(this)"></label></div></section>${S.recoveredDrills?.length?`<section class=backup-box><h3>退避した途中ドリル</h3><p>バックアップ統合時に重なった途中データです。</p>${S.recoveredDrills.map((d,i)=>`<div class="row space"><span>${h(S.weak[d.key]?.label||d.key||"不明なドリル")} ／ ${h(d.q?.id||"問題不明")}</span><span><button onclick="restoreRecoveredDrill(${i})">再開</button><button onclick="deleteRecoveredDrill(${i})">削除</button></span></div>`).join("")}</section>`:""}</section>`;
}
function scheduleDayRefresh(){if(dayRefreshHandle)clearTimeout(dayRefreshHandle);const next=new Date();next.setHours(24,0,1,0);dayRefreshHandle=setTimeout(()=>{checkDayChange();scheduleDayRefresh()},Math.max(1000,next-Date.now()))}
function checkDayChange(){if(renderedDate===today())return;renderedDate=today();S.dailyPlan=null;S.dailyProgress=null;save();render()}
window.addEventListener("focus",checkDayChange);document.addEventListener("visibilitychange",()=>{if(!document.hidden)checkDayChange()});
function render(){if(timerHandle){clearInterval(timerHandle);timerHandle=null}app.innerHTML=({home,route,exam,result,review,drill,stats,guide})[view]();if(view==="exam"&&S.currentAttempt?.status==="active"&&S.currentAttempt.mode==="timed")timerHandle=setInterval(updateTimer,1000);scheduleDayRefresh()}
render();
