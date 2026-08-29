
const D=window.EXAM_DATA, P=window.PAPERS, BANK=window.DRILLS, FALLBACK=window.FALLBACK;
// STORAGE_KEY is permanent. Future releases migrate schemaVersion in place and must not rename this key.
const STORAGE_KEY="waseshibu.adaptive.v3", LEGACY_KEYS=["waseshibu.adaptive.v2"], RECOVERY_KEY="waseshibu.adaptive.pre-migration", SCHEMA_VERSION=4;
const ROUTE=[2024,2023,2022,2021,2020,2019,2025,2026];
const INIT={schemaVersion:SCHEMA_VERSION,year:2024,answers:{},manual:{},history:[],attempts:[],weak:{},cause:{},drillLog:[],currentSkill:null,currentAttempt:null,lastResultId:null,lastStartedWeakKey:null,exposure:{},theme:"light",answerSheetOpen:true,answerSheetExpanded:false,examInfoCompact:false};
function loadState(){
 let raw=null,rawText=null,sourceKey=null;
 for(const key of [STORAGE_KEY,...LEGACY_KEYS]){try{const text=localStorage.getItem(key);if(!text)continue;const parsed=JSON.parse(text);if(parsed&&typeof parsed==="object"){raw=parsed;rawText=text;sourceKey=key;break}}catch(e){}}
 const next={...INIT,...(raw||{})};
 next.answers=next.answers||{};next.manual=next.manual||{};next.weak=next.weak||{};next.cause=next.cause||{};next.exposure=next.exposure||{};next.history=Array.isArray(next.history)?next.history:[];next.attempts=Array.isArray(next.attempts)?next.attempts:[];next.drillLog=Array.isArray(next.drillLog)?next.drillLog:[];
 const fromVersion=Number(raw?.schemaVersion)||2;
 if(fromVersion<3){
   next.history.forEach((x,i)=>{const id=`legacy-${x.year}-${i}-${x.at||"unknown"}`;if(!next.attempts.some(a=>a.id===id))next.attempts.push({id,year:Number(x.year),writtenScore:Number(x.score)||0,status:"graded",mode:"unknown",exposure:"unknown",comparable:false,gradedAt:x.at||null,aLost:x.aLost||0,bLost:x.bLost||0,cLost:0,legacy:true})});
   Object.keys(next.answers).forEach(key=>{const y=Number(key.split(":")[0]);if(y)next.exposure[y]=next.exposure[y]||"unknown"});
 }
 Object.values(next.weak).forEach(w=>{const q=(D[w.year]||[]).find(x=>x.id===w.id);if(q)w.priority=strategyPriority(q)});
 if(fromVersion<=SCHEMA_VERSION){
   next.schemaVersion=SCHEMA_VERSION;
   try{if(rawText&&fromVersion<SCHEMA_VERSION&&!localStorage.getItem(RECOVERY_KEY))localStorage.setItem(RECOVERY_KEY,rawText);localStorage.setItem(STORAGE_KEY,JSON.stringify(next))}catch(e){}
 }
 return next;
}
let S=loadState();
let view="home", drillState=null, timerHandle=null;
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
function attemptId(){return `a-${Date.now()}-${Math.random().toString(36).slice(2,8)}`}
function yearKeys(obj,y){return Object.keys(obj||{}).filter(x=>x.startsWith(`${y}:`))}
function hasSavedAnswers(y){return yearKeys(S.answers,y).some(x=>S.answers[x]!=="")||yearKeys(S.manual,y).some(x=>S.manual[x]?.score!==""&&S.manual[x]?.score!==undefined)}
function strategyPriority(q){if(q.priority==="A")return "A";if(q.skill==="insertion")return "C";return "B"}
function routeRole(y){return y===2024?"初見診断":y===2025?"実戦確認":y===2026?"最終判定":"弱点補強"}
function routeRecommendations(y){
 if(y>=2025)return [];
 const skills=new Set(activeWeak().map(([_,w])=>w.skill));
 return (D[y]||[]).filter(q=>skills.has(q.skill)).sort((a,b)=>strategyPriority(a).localeCompare(strategyPriority(b))).slice(0,3);
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
function nextRouteYear(){return ROUTE.find(y=>!S.attempts.some(a=>a.year===y&&a.status==="graded"))||2026}
function todayAction(){
 if(S.currentAttempt?.status==="active")return {label:`${S.currentAttempt.year}年度の続きを解く`,action:`openYear(${S.currentAttempt.year})`,note:"解答途中の過去問があります。"};
 const due=activeWeak().filter(([_,w])=>w.status==="pending"&&w.next<=today());if(due.length)return {label:"今日の定着チェック",action:"startDue()",note:`期限が来た復習が${due.length}件あります。`};
 const active=activeWeak().filter(([_,w])=>w.status==="active");if(active.length)return {label:"誤答の克服ドリル",action:"startDue()",note:`未克服の弱点が${active.length}件あります。`};
 const y=nextRouteYear();return {label:`${y}年度 ${routeRole(y)}を始める`,action:`openYear(${y})`,note:"推奨ルート上の次の課題です。"};
}
function home(){
 const active=activeWeak(), due=active.filter(([_,w])=>!w.next||w.next<=today()).length;
 const last=S.history.at(-1);
 const action=todayAction();
 return `<section class="card hero today-card"><div class=eyebrow>TODAY'S NEXT ACTION</div>
 <h2>今日やること</h2><p>${h(action.note)}</p>
 <div class=row><button class=primary onclick="${action.action}">${h(action.label)}</button><button onclick="goto('route')">学習ルートを見る</button></div></section>
 <section class="grid three"><div class=card><div class=metric>${active.length}</div><div class=muted>未克服の弱点</div></div>
 <div class=card><div class=metric>${due}</div><div class=muted>今日やる復習</div></div>
 <div class=card><div class=metric>${mastered()}</div><div class=muted>克服済み</div></div></section>
 <section class=card><h3>推奨する過去問ルート</h3><p class=route-inline>${ROUTE.map(y=>`<span class="${S.attempts.some(a=>a.year===y&&a.status==="graded")?"done":""}">${y}</span>`).join("<b>→</b>")}</p><p class=muted>2024で診断し、2023～2019で補強。2025で実戦確認し、2026を最終判定に残します。</p></section>
 <section class=card><h3>克服ルール</h3><div class="grid three">
 <div class=bluebox><b>① 即時類題</b><p>過去問を間違えた直後、同じ技能を3問連続正解するまで反復。</p></div>
 <div class=warnbox><b>② 翌日チェック</b><p>3連続正解しても消さず、翌日に2問確認。</p></div>
 <div class=okbox><b>③ 克服</b><p>翌日の確認も2連続正解で初めて「克服済み」。</p></div></div></section>
 ${last?`<section class=card><h3>直近の過去問</h3><p>${last.year}年度　筆記 ${last.score}/80　／　A失点 ${last.aLost||0}点　／　B失点 ${last.bLost||0}点　／　C失点 ${last.cLost||0}点</p></section>`:""}`;
}
function route(){
 return `<section class="card hero"><div class=eyebrow>DIAGNOSE → REMEDIATE → VERIFY</div><h2>過去問学習ルート</h2><p>年度ごとの目的を変え、2025・2026の初見性を守ります。</p></section>
 <section class=route-list>${ROUTE.map((y,i)=>{const attempts=S.attempts.filter(a=>a.year===y),last=[...attempts].reverse().find(a=>a.status==="graded"),exp=S.exposure[y],status=last?"採点済み":S.currentAttempt?.year===y&&S.currentAttempt.status==="active"?"解答中":exp?"一部既出":"未着手",protectedYear=y>=2025&&!attempts.length&&!exp,recs=routeRecommendations(y);return `<article class="card route-step ${protectedYear?"protected":""}"><div class=route-number>${i+1}</div><div class=route-main><div class="row space"><div><h3>${y}年度</h3><b>${routeRole(y)}</b></div><span class="status-pill">${protectedYear?"初見温存中":status}</span></div><p>${y===2024?"現在地を測り、全問を弱点分析します。":y<2024?"2024で見つかった弱点に対応する実際の過去問を使います。":y===2025?"補強が直近型に通用するか確認します。":"本番前の最後の完全初見判定です。"}</p>${recs.length?`<div class=route-recs><b>現在の弱点に対応</b><p>${recs.map(q=>`${h(q.label)}（${skillName(q.skill)}・${strategyPriority(q)}）`).join(" ／ ")}</p></div>`:""}${last?`<p class=tiny>最新：筆記 ${last.writtenScore}/80　${exposureLabel(last.exposure)}　${last.comparable?"比較対象":"練習記録"}</p>`:""}<button class="${y===nextRouteYear()?"primary":""}" onclick="openYear(${y})">${S.currentAttempt?.year===y&&S.currentAttempt.status==="active"?"続きを解く":"年度を開く"}</button></div></article>`}).join("")}</section>`;
}
function openYear(y){S.year=y;save();goto("exam")}
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
 <fieldset><legend>実施方法</legend><label><input type=radio name=examMode value=timed onchange="document.getElementById('limitRow').hidden=false"> 本番時間で通し演習</label><label><input type=radio name=examMode value=untimed onchange="document.getElementById('limitRow').hidden=true"> 時間無制限で通し演習</label><label><input type=radio name=examMode value=targeted onchange="document.getElementById('limitRow').hidden=true"> 弱点問題として使う</label><div id=limitRow hidden><label>公式に指定された制限時間 <input id=timeLimit type=number inputmode=numeric min=10 max=180 placeholder="分"> 分</label><p class=tiny>公式資料で時間を確認して入力してください。アプリは未確認の時間を自動設定しません。</p></div></fieldset>
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
function formatPaperText(text,y,startMajor){
 const lines=text.split("\n"),html=[];let currentMajor=startMajor,currentQuestion=null;
 for(let i=0;i<lines.length;i++){
   const line=lines[i],major=line.match(/^([３４５６７８])[ \t　]+(.*)$/);
   if(major){
     currentMajor=fullwidthDigits.indexOf(major[1]);currentQuestion=null;
     const title=[major[2]];
     while(title.length<5&&needsContinuation(joinWrappedLines(title))&&i+1<lines.length&&lines[i+1].trim()&&!/^[ \t　]*(?:[３４５６７８][ \t　]+|問[1-9１２３４５６７８９])/.test(lines[i+1]))title.push(lines[++i]);
     html.push(`<div id="problem-${y}-${currentMajor}" class=major-heading><span>大問${currentMajor}</span><strong>${h(joinWrappedLines(title))}</strong></div>`);continue;
   }
   const question=line.match(/^[ \t　]*問([1-9１２３４５６７８９])[ \t　]*/);
   if(question){
     currentQuestion=/[1-9]/.test(question[1])?Number(question[1]):fullwidthDigits.indexOf(question[1]);
     const title=[line];
     while(title.length<4&&needsContinuation(joinWrappedLines(title))&&i+1<lines.length&&lines[i+1].trim()&&!/^[ \t　]*(?:[３４５６７８][ \t　]+|問[1-9１２３４５６７８９]|[（(][1-9１２３４５６７８９][）)])/.test(lines[i+1]))title.push(lines[++i]);
     html.push(`<div id="problem-${y}-${currentMajor}-${currentQuestion}" class=subquestion-heading>${h(joinWrappedLines(title))}</div>`);continue;
   }
   const sub=line.match(/^[ \t　]*[（(]([1-9１２３４５６７８９])[）)]/);
   if(sub&&currentMajor&&currentQuestion){
     const subNumber=/[1-9]/.test(sub[1])?Number(sub[1]):fullwidthDigits.indexOf(sub[1]);
     html.push(`<div id="problem-${y}-${currentMajor}-${currentQuestion}-${subNumber}" class="paper-line subpart-line">${h(line)}</div>`);continue;
   }
   const pattern=(line.match(/\([^)]*\)/g)||[]).length>=3||/\[[ア-ク].*[ア-ク].*\]/.test(line);
   html.push(`<div class="paper-line ${pattern?"answer-pattern-line":""}">${line?h(line):"&nbsp;"}</div>`);
 }
 return {html:html.join(""),lastMajor:currentMajor};
}
function renderPaperPages(y,pages){
 let current=null;
 return pages.map((p,i)=>{
   const majors=majorNumbers(p.text),formatted=formatPaperText(p.text,y,current);current=formatted.lastMajor;
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
 <section class="attempt-bar ${S.examInfoCompact?"attempt-compact":""}"><div class=attempt-summary><b>${y}年度 <span class=attempt-role>${routeRole(y)}</span></b><span class=attempt-detail>${exposureLabel(attempt.exposure)}／${attempt.mode==="timed"?"本番時間":attempt.mode==="targeted"?"弱点問題":"時間無制限"}</span></div>${timerMarkup(attempt)}<div class=attempt-actions><button class=interrupt-button onclick="interruptAttempt()">中断を記録</button><button class=attempt-toggle onclick="toggleExamInfo()">${S.examInfoCompact?"開く":"小さくする"}</button></div></section>
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
 const validKana=["choice","pair","multi"].includes(q.type)?availableKana(y,q):kana;
 let val=rawVal;
 if(q.type==="choice"&&!validKana.includes(val))val="";
 if(q.type==="pair"||q.type==="multi")val=norm(val).split(",").filter(x=>validKana.includes(x)).join(",");
 if(val!==rawVal){S.answers[key]=val;save()}
 let input="";
 if(q.type==="choice"){
   input=`<div class=input-guide>実際の選択肢から記号を1つタップ</div><input id="a-${q.id}" type=hidden value="${h(val)}"><div class="answer-options single" role=group aria-label="${h(q.label)}の回答">${validKana.map(x=>`<button type=button class="answer-kana ${val===x?"selected":""}" aria-pressed="${val===x}" onclick="pickAnswer(${y},'${q.id}','${x}',this)">${x}</button>`).join("")}</div>`;
 }else if(q.type==="pair"||q.type==="multi"){
   const max=String(q.answer||"").split(",").filter(Boolean).length||2;
   const selected=norm(val).split(",").filter(Boolean);
   const note=q.type==="pair"?`<b>${max}つ</b>を、解答する順にタップ`:`<b>${max}つ</b>をタップ（順不同）`;
   input=`<div class=input-guide>${note}</div><input id="a-${q.id}" type=hidden value="${h(val)}"><div class=selection-summary id="summary-${q.id}">${selectionText(selected,q.type,max)}</div><div class="answer-options multi" role=group aria-label="${h(q.label)}の回答">${validKana.map(x=>`<button type=button data-kana="${x}" class="answer-kana ${selected.includes(x)?"selected":""}" aria-pressed="${selected.includes(x)}" onclick="toggleKanaAnswer(${y},'${q.id}','${x}',${max},'${q.type}')">${x}</button>`).join("")}</div><button type=button class=answer-clear onclick="clearKanaAnswer(${y},'${q.id}',${max},'${q.type}')">選択をやり直す</button>`;
 }else if(q.type==="text"){
   const placeholder=q.skill==="extract"?"本文から英語1語を入力（例：wish）":"半角英語で入力（例：hungry）";
   input=`<label class=input-guide for="a-${q.id}">${q.skill==="extract"?"本文から指定された語を抜き出して入力":"英語の答えを入力"}</label><input id="a-${q.id}" value="${h(val)}" placeholder="${placeholder}" autocomplete=off autocapitalize=none spellcheck=false oninput="rememberAnswer(${y},'${q.id}',this.value)">`;
 }else{
   const score=S.manual[key]?.score??"";
   const selected=S.manual[key]?.components||[];
   input=`<div class=input-guide><b>記述問題</b>：紙に書いた答案を公式解答と比べ、自己採点した点数を入力</div><div class=score-input><button type=button aria-label="1点減らす" onclick="adjustScore(${y},'${q.id}',-1,${q.points})">−</button><input id="m-${q.id}" type=number inputmode=numeric min=0 max=${q.points} value="${score}" placeholder="未採点" oninput="rememberScore(${y},'${q.id}',this.value,${q.points})"><span>/ ${q.points}点</span><button type=button aria-label="1点増やす" onclick="adjustScore(${y},'${q.id}',1,${q.points})">＋</button></div><details class=component-picker ${score!==""&&Number(score)<q.points?"needs-input":""}><summary>減点された原因を選ぶ</summary>${manualComponents(q).map(c=>`<label><input type=checkbox ${selected.includes(c)?"checked":""} onchange="rememberManualComponent(${y},'${q.id}','${c}',this.checked)"> ${c}</label>`).join("")}</details>`;
 }
 const priority=strategyPriority(q);
 return `<div id="answer-${y}-${q.id}" data-major="${(q.label.match(/大問(\d+)/)||[])[1]||""}" class="q ${cls}"><div class="row space"><b>${h(q.label)}</b><span>${q.points}点 ${badge(priority)}</span></div><div class=q-meta><span class="tiny muted">${h(q.category)} ／ 学習上の${priority}分類</span><button type=button onclick="jumpToProblem(${y},'${q.id}')">問題へ ↑</button></div>${input}${wr?.last==="wrong"?`<div class="tiny previous-answer">前回：${h(wr.user||"未入力")} → 正解 ${h(q.answer||"記述自己採点")}</div>`:""}</div>`;
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
 const missingManual=D[y].filter(q=>q.type==="manual"&&(S.manual[k(y,q.id)]?.score===""||S.manual[k(y,q.id)]?.score===undefined));
 if(missingManual.length)return alert(`${missingManual.map(q=>`${q.label}（${q.points}点）`).join("、")} が未採点です。公式解答と比べて点数を入力してください。`);
 const missingCause=D[y].filter(q=>q.type==="manual"&&Number(S.manual[k(y,q.id)]?.score)<q.points&&!(S.manual[k(y,q.id)]?.components||[]).length);
 if(missingCause.length)return alert(`${missingCause.map(q=>q.label).join("、")} の「減点された原因」を1つ以上選んでください。`);
 let score=0,aLost=0,bLost=0,cLost=0,wrongCount=0;
 D[y].forEach(q=>{
   const key=k(y,q.id);
   if(q.type==="manual"){
     const sc=Math.max(0,Math.min(q.points,Number(S.manual[key].score)));score+=sc;
     if(sc<q.points){(S.manual[key].components||["判定できない"]).forEach(c=>createWeak(y,q,`自己採点 ${sc}/${q.points}`,c));wrongCount++; const p=strategyPriority(q);if(p==="A")aLost+=q.points-sc;else if(p==="C")cLost+=q.points-sc;else bLost+=q.points-sc}
     else markActualCorrect(y,q,`自己採点 ${sc}/${q.points}`);
   }else{
     const a=document.getElementById("a-"+q.id).value;S.answers[key]=a;
     const earned=objectiveScore(q,a);score+=earned;if(earned===q.points)markActualCorrect(y,q,a);
     else{createWeak(y,q,a);wrongCount++;const lost=q.points-earned,p=strategyPriority(q);if(p==="A")aLost+=lost;else if(p==="C")cLost+=lost;else bLost+=lost}
   }
 });
 attempt.status="graded";attempt.gradedAt=new Date().toISOString();attempt.writtenScore=score;attempt.aLost=aLost;attempt.bLost=bLost;attempt.cLost=cLost;attempt.wrongCount=wrongCount;attempt.comparable=attemptComparable(attempt);attempt.answers=Object.fromEntries(yearKeys(S.answers,y).map(x=>[x,S.answers[x]]));attempt.manual=Object.fromEntries(yearKeys(S.manual,y).map(x=>[x,S.manual[x]]));
 S.attempts.push({...attempt});S.history.push({year:y,score,aLost,bLost,cLost,wrongCount,at:attempt.gradedAt,attemptId:attempt.id});S.lastResultId=attempt.id;S.currentAttempt=null;save();goto("result");
 }
function createWeak(y,q,user,component="main"){
 const key=`${k(y,q.id)}:${component}`, old=S.weak[key]||{};
 S.weak[key]={...old,year:Number(y),id:q.id,label:q.label,category:component==="main"?q.category:`${q.category}：${component}`,component,skill:q.skill,priority:strategyPriority(q),points:q.points,user,last:"wrong",status:"active",streak:0,confirmStreak:0,next:today(),wrongCount:(old.wrongCount||0)+1,reservedConfirm:[],seenDrills:old.seenDrills||[]};
}
function markActualCorrect(y,q,user){
 Object.values(S.weak).filter(w=>w.year===Number(y)&&w.id===q.id).forEach(old=>{old.user=user;old.last="correct";old.actualCorrect=(old.actualCorrect||0)+1});
}
function setListeningScore(id,value){const a=S.attempts.find(x=>x.id===id);if(!a)return;const score=value===""?null:Math.max(0,Math.min(20,Number(value)||0));a.listeningScore=score;a.totalScore=score===null?null:a.writtenScore+score;save();render()}
function goalStatus(a,target){if(a.listeningScore!==null&&a.listeningScore!==undefined){const total=a.writtenScore+a.listeningScore;return total>=target?`到達（${total}/100）`:`あと${target-total}点`};const need=target-a.writtenScore;if(need<=0)return `筆記だけで${target}点以上`;if(need<=20)return `リスニング${need}/20以上が必要`;return `現在の筆記点では到達不可`}
function result(){
 const a=S.attempts.find(x=>x.id===S.lastResultId)||latestAttempt();if(!a)return `<section class="card hero"><h2>採点結果はまだありません。</h2><button onclick="openYear(${nextRouteYear()})">過去問を始める</button></section>`;
 const total=a.listeningScore===null||a.listeningScore===undefined?null:a.writtenScore+a.listeningScore;
 const unresolved=activeWeak().map(([_,w])=>w).filter(w=>w.year===a.year).sort((x,y)=>x.priority.localeCompare(y.priority)).slice(0,6);
 return `<section class="card hero result-hero"><div class=eyebrow>${a.year} RESULT</div><h2>筆記 ${a.writtenScore}/80</h2><p>${exposureLabel(a.exposure)}／${a.mode==="timed"?"本番時間":a.mode==="targeted"?"弱点問題":"時間無制限"}／${a.comparable?"到達度比較に使用":"練習記録"}</p><div class="score-total">${total===null?"総合点はリスニング入力後に表示":`総合 ${total}/100`}</div></section>
 <section class="grid three"><div class=card><div class=metric>${a.aLost||0}</div><div class=muted>A問題の失点</div></div><div class=card><div class=metric>${a.bLost||0}</div><div class=muted>B問題の失点</div></div><div class=card><div class=metric>${a.cLost||0}</div><div class=muted>C問題の失点</div></div></section>
 <section class=card><h3>同じ受験回のリスニング</h3><p class=muted>別年度・別の受験回の最高点とは合算しません。</p><label>リスニング得点 <input class=listening-input type=number inputmode=numeric min=0 max=20 value="${a.listeningScore??""}" placeholder="未入力" onchange="setListeningScore('${a.id}',this.value)"> /20</label></section>
 <section class=card><h3>60・65・70・75点への距離</h3><div class=goal-grid>${[60,65,70,75].map(t=>`<div class=goal-card><b>${t}点</b><span>${goalStatus(a,t)}</span></div>`).join("")}</div><p class=tiny>総合点は同じ年度・同じ受験回の筆記とリスニングだけを合算します。</p></section>
 ${unresolved.length?`<section class=card><h3>この年度の未克服ポイント</h3>${unresolved.map(w=>`<p><b>${badge(w.priority)} ${h(w.label)}</b>　${skillName(w.skill)}：${h(w.category)}</p>`).join("")}</section>`:""}
 <section class=card><h3>次にやること</h3><p>A問題の誤答を先に直し、その後、目標点までに必要なB問題を補強します。C問題は後回し候補です。</p><div class=row><button class=primary onclick="goto('review')">誤答の克服を始める</button><button onclick="goto('route')">学習ルートへ</button><button onclick="openYear(${a.year})">${a.year}年度メニューへ</button></div></section>`;
}
function review(){
 const arr=activeWeak().map(([key,w])=>({key,w})).sort((a,b)=>(a.w.priority>b.w.priority?1:-1)||(a.w.next||"").localeCompare(b.w.next||""));
 if(!arr.length)return `<section class="card hero"><h2>現在、未克服の誤答はありません。</h2><p>A問題を維持しながらB問題の上積みに進めます。</p></section>`;
 return `<section class=card><div class="row space"><div><div class=eyebrow>ERROR → DRILL → RETEST</div><h2>間違い対策 ${arr.length}件</h2></div><button class=primary onclick="startDue()">今日の復習を開始</button></div>
 <p>A問題を先に処理。同じ技能の類題を3連続正解→翌日2連続正解で克服です。</p></section>
 ${arr.map(({key,w})=>`<section class="card wrong"><div class="row space"><div><b>${w.year} ${h(w.label)}</b><div class="tiny"><span class=skill>${skillName(w.skill)}</span> ／ ${h(w.category)} ／ ${w.component&&w.component!=="main"?`元設問 ${w.points}点`:`${w.points}点`}</div></div>${badge(w.priority)}</div>
 <p>誤答：<b>${h(w.user||"未入力")}</b>　${w.status==="pending"?`<span class=badge>翌日確認待ち</span>`:""}</p>
 <p class=muted>${w.status==="pending"?`次の定着チェック：${w.next}`:`類題連続正解：${w.streak||0}/3`}</p>
 <label>失点原因 <select onchange="setCause('${key}',this.value)"><option value="">選択</option>${["ケアレスミス","知識不足","語順・構文","本文根拠の見落とし","選択肢の読み違い","推論しすぎ","時間不足","記述条件漏れ"].map(c=>`<option ${S.cause[key]===c?"selected":""}>${c}</option>`).join("")}</select></label>
 <div class=row style="margin-top:10px"><button class=primary onclick="startSkill('${key}')">${w.status==="pending"?"定着チェック":"克服ドリル"}</button><button onclick="openYear(${w.year})">過去問本文を確認</button></div></section>`).join("")}`;
}
function setCause(key,v){S.cause[key]=v;save()}
function startDue(){
 const due=activeWeak().filter(([_,w])=>!w.next||w.next<=today()).sort((a,b)=>a[1].priority.localeCompare(b[1].priority)||(a[1].next||"").localeCompare(b[1].next||"")||a[0].localeCompare(b[0]));
 if(!due.length)return alert("今日が期限の復習はありません。");
 const highest=due[0][1].priority,tier=due.filter(([_,w])=>w.priority===highest),last=tier.findIndex(([key])=>key===S.lastStartedWeakKey),chosen=tier[(last+1)%tier.length];
 startSkill(chosen[0]);
}
function poolFor(skill){
 return BANK.filter(x=>x.skill===skill);
}
function startSkill(key){
 const w=S.weak[key];if(!w)return;
 const pool=poolFor(w.skill);if(pool.length<5)return alert(`${skillName(w.skill)}の同一論点類題は現在${pool.length}問です。即時3問＋未出の翌日2問を確保できないため、克服判定は開始できません。関連技能で代用せず、問題追加が必要です。`);
 if(w.status==="pending" && w.next>today()) {
   if(!confirm(`定着チェック予定日は ${w.next} です。今日先にやりますか？`))return;
 }
 if(!Array.isArray(w.reservedConfirm)||w.reservedConfirm.length<2){const unseen=pool.filter(x=>!(w.seenDrills||[]).includes(x.id)).sort(()=>Math.random()-.5);w.reservedConfirm=unseen.slice(0,2).map(x=>x.id)}
 S.currentSkill=key;S.lastStartedWeakKey=key;save();
 drillState={key,skill:w.skill,mode:w.status==="pending"?"confirm":"train",used:[],q:null,answered:false,selected:null,order:[],textInputs:[]};
 nextDrill();goto("drill");
}
function nextDrill(){
 if(!drillState)return;
 const pool=poolFor(drillState.skill);
 const w=S.weak[drillState.key],reserved=w.reservedConfirm||[];
 let candidates=drillState.mode==="confirm"?pool.filter(x=>reserved.includes(x.id)&&!drillState.used.includes(x.id)):pool.filter(x=>!reserved.includes(x.id)&&!drillState.used.includes(x.id));
 if(!candidates.length){drillState.used=[];candidates=drillState.mode==="confirm"?pool.filter(x=>reserved.includes(x.id)):pool.filter(x=>!reserved.includes(x.id))}
 // During training, introduce level 1/2 first; confirmation may use any level.
 if(drillState.mode==="train"){
   const max=(w.streak||0)>=2?3:2;
   const leveled=candidates.filter(x=>x.level<=max);if(leveled.length)candidates=leveled;
 }
 const unseen=candidates.filter(x=>!(w.seenDrills||[]).includes(x.id));if(unseen.length)candidates=unseen;
 if(candidates.length>1&&w.lastDrillId)candidates=candidates.filter(x=>x.id!==w.lastDrillId);
 const q=candidates[Math.floor(Math.random()*candidates.length)];
 drillState.q=q;drillState.used.push(q.id);w.lastDrillId=q.id;w.seenDrills=[...new Set([...(w.seenDrills||[]),q.id])];save();drillState.answered=false;drillState.selected=null;drillState.order=[];drillState.textInputs=[];
}
function drill(){
 if(!drillState){
   const due=activeWeak();
   return `<section class="card hero"><h2>克服ドリル</h2><p>${due.length?"「間違い対策」から弱点を選ぶと、その技能の類題を繰り返します。":"現在ドリル対象はありません。"}</p><button onclick="goto('review')">間違い対策へ</button></section>`;
 }
 const w=S.weak[drillState.key], q=drillState.q;
 if(!w||!q)return `<section class=card>ドリル対象がありません。</section>`;
 const target=drillState.mode==="confirm"?2:3, streak=drillState.mode==="confirm"?(w.confirmStreak||0):(w.streak||0);
 return `<section class="card drill-card"><div class="row space"><div><div class=eyebrow>${drillState.mode==="confirm"?"SPACED RETEST":"REPEATED SIMILAR PRACTICE"}</div><h2>${skillName(drillState.skill)} 克服ドリル</h2></div><span>${streak}/${target} 連続正解</span></div>
 <div class=progress><span style="width:${Math.min(100,streak/target*100)}%"></span></div>
 <p class=muted>元の誤答：${w.year} ${h(w.label)} ／ ${h(w.category)}</p>
 <hr><h3>${h(q.prompt)}</h3>${drillInput(q)}
 ${drillState.answered?drillFeedback(q):""}
 </section>`;
}
function drillInput(q){
 if(q.type==="choice")return `<div class=choices>${q.options.map((o,i)=>`<button ${drillState.answered?"disabled":""} class="choice ${drillState.answered?(i===q.answer?"correct":i===drillState.selected?"wrong":""):""}" onclick="answerDrillChoice(${i})">${kana[i]}　${h(o)}</button>`).join("")}</div>`;
 if(q.type==="text")return `<input id=drillText placeholder="本文から1語"><button class=primary onclick="answerDrillText()">答える</button>`;
 if(q.type==="text_multi")return `<div class=grid>${q.answers.map((_,i)=>`<input id=mt${i} placeholder="(${i+1})">`).join("")}</div><button class=primary onclick="answerDrillMulti()">答える</button>`;
 if(q.type==="reorder")return `<p><b>${h(q.lead)}</b></p><div class=tokens>${shuffleTokens(q.tokens).map((t,i)=>`<button class=token onclick="addToken('${h(t).replace(/'/g,"&#39;")}')">${h(t)}</button>`).join("")}</div><div id=orderBox class=reorder-answer>${drillState.order.map(h).join(" ")}</div><div class=row><button onclick="clearOrder()">やり直す</button><button class=primary onclick="answerReorder()">答える</button></div>`;
 if(q.type==="selfcheck")return `<textarea id=selfText placeholder="ここに答案を書く"></textarea><button class=primary onclick="showSelfCheck()">セルフチェックへ</button>${drillState.selfcheck?`<div class=warnbox><b>必須チェック</b>${q.check.map((x,i)=>`<label><input type=checkbox id=ck${i}> ${h(x)}</label><br>`).join("")}<p><b>答案例：</b>${h(q.model)}</p><div class=row><button onclick="selfResult(false)">まだ不十分</button><button class=primary onclick="selfResult(true)">条件を満たした</button></div></div>`:""}`;
 return "";
}
function shuffleTokens(tokens){if(drillState.shuffled)return drillState.shuffled;drillState.shuffled=[...tokens].sort(()=>Math.random()-.5);return drillState.shuffled}
function addToken(t){if(drillState.answered)return;drillState.order.push(t.replace(/&#39;/g,"'"));render()}
function clearOrder(){drillState.order=[];drillState.shuffled=null;render()}
function answerDrillChoice(i){if(drillState.answered)return;drillState.selected=i;finishDrill(i===drillState.q.answer)}
function answerDrillText(){let a=document.getElementById("drillText").value.trim().toLowerCase();finishDrill(a===drillState.q.answerText.toLowerCase())}
function answerDrillMulti(){let ok=drillState.q.answers.every((x,i)=>norm(document.getElementById("mt"+i).value)===norm(x));finishDrill(ok)}
function answerReorder(){let ok=drillState.order.join(" ")===drillState.q.answer.join(" ");finishDrill(ok)}
function showSelfCheck(){drillState.selfcheck=true;render()}
function selfResult(ok){if(ok && !drillState.q.check.every((_,i)=>document.getElementById("ck"+i)?.checked))return alert("必須チェックをすべて確認してください。");finishDrill(ok)}
function finishDrill(ok){
 const w=S.weak[drillState.key];drillState.answered=true;drillState.correct=ok;
 if(drillState.mode==="train"){
   if(ok)w.streak=(w.streak||0)+1;else w.streak=0;
   if(w.streak>=3){w.status="pending";w.next=plusDays(1);w.confirmStreak=0}
 }else{
   if(ok)w.confirmStreak=(w.confirmStreak||0)+1;else{w.confirmStreak=0;w.status="active";w.streak=0;w.next=today();w.reservedConfirm=[]}
   if(w.confirmStreak>=2){w.status="mastered";w.masteredAt=new Date().toISOString();w.last="correct"}
 }
 S.drillLog.push({key:drillState.key,skill:drillState.skill,q:drillState.q.id,ok,at:new Date().toISOString()});save();render()
}
function drillFeedback(q){
 const w=S.weak[drillState.key];
 let msg=drillState.correct?"正解":"不正解";
 let nextLabel="似た問題をもう1問";
 if(w.status==="pending"&&drillState.mode==="train")nextLabel="今日は終了（翌日確認へ）";
 if(w.status==="mastered")nextLabel="克服完了";
 return `<div class="${drillState.correct?"okbox":"notice"}" style="margin-top:14px"><b>${msg}</b><p>${h(q.explanation||"")}</p>
 ${w.status==="pending"&&drillState.mode==="train"?`<p>3問連続正解。<b>${w.next}</b> に2問の定着チェックを行います。</p>`:""}
 ${w.status==="mastered"?`<p>翌日の定着チェックも2問連続正解。克服済みにしました。</p>`:""}
 <button class=primary onclick="${w.status==="mastered"|| (w.status==="pending"&&drillState.mode==="train")?"finishSession()":"continueDrill()"}">${nextLabel}</button></div>`;
}
function continueDrill(){drillState.selfcheck=false;drillState.shuffled=null;nextDrill();render()}
function finishSession(){drillState=null;S.currentSkill=null;save();goto("review")}

function stats(){
 const active=activeWeak(), bySkill={}, byCause={}, a=active.filter(([_,w])=>w.priority==="A"), b=active.filter(([_,w])=>w.priority==="B"), c=active.filter(([_,w])=>w.priority==="C");
 active.forEach(([key,w])=>{bySkill[w.skill]=(bySkill[w.skill]||0)+1;if(S.cause[key])byCause[S.cause[key]]=(byCause[S.cause[key]]||0)+1});
 const recent=S.drillLog.slice(-20), rate=recent.length?Math.round(recent.filter(x=>x.ok).length/recent.length*100):0;
 const comparable=S.attempts.filter(x=>x.status==="graded"&&x.comparable),latest=[...comparable].reverse()[0];
 const statusFor=t=>{const eligible=comparable.filter(x=>x.totalScore!==null&&x.totalScore!==undefined),reached=eligible.at(-1)?.totalScore>=t,stable=eligible.length>=2&&eligible.at(-1).year!==eligible.at(-2).year&&eligible.at(-1).totalScore>=t&&eligible.at(-2).totalScore>=t;return stable?"安定":reached?"到達":"未到達"};
 return `<section class="grid four"><div class=card><div class=metric>${a.length}</div><div class=muted>A未克服</div></div><div class=card><div class=metric>${b.length}</div><div class=muted>B未克服</div></div><div class=card><div class=metric>${c.length}</div><div class=muted>C未克服</div></div><div class=card><div class=metric>${rate}%</div><div class=muted>直近20類題</div></div></section>
 <section class=card><h2>総合点の到達度</h2><div class=goal-grid>${[60,65,70,75].map(t=>`<div class="goal-card ${statusFor(t)==="安定"?"stable":""}"><b>${t}点</b><span>${statusFor(t)}</span></div>`).join("")}</div><p class=muted>「安定」は、異なる年度の完全初見・本番時間・通し演習で2回連続到達した場合のみです。${latest&&!latest.totalScore?" リスニング未入力のため総合判定は保留です。":""}</p></section>
 <section class=card><h2>年度別記録</h2><div class=table><table><tr><th>年度</th><th>役割</th><th>筆記</th><th>総合</th><th>条件</th></tr>${ROUTE.map(y=>{const x=latestAttempt(y);return `<tr><td>${y}</td><td>${routeRole(y)}</td><td>${x?`${x.writtenScore}/80`:"－"}</td><td>${x?.totalScore!==null&&x?.totalScore!==undefined?`${x.totalScore}/100`:"－"}</td><td>${x?(x.comparable?"比較対象":"練習記録"):"未着手"}</td></tr>`}).join("")}</table></div></section>
 <section class=card><h2>弱点分野</h2><div class=table><table><tr><th>分野</th><th>未克服</th><th>対策</th></tr>${Object.entries(bySkill).sort((a,b)=>b[1]-a[1]).map(([s,n])=>`<tr><td>${skillName(s)}</td><td>${n}</td><td><button onclick="startFirstSkill('${s}')">類題を解く</button></td></tr>`).join("")||"<tr><td colspan=3>未克服なし</td></tr>"}</table></div></section>
 <section class=card><h3>失点原因</h3>${Object.entries(byCause).sort((a,b)=>b[1]-a[1]).map(([c,n])=>`<p>${h(c)}：${n}</p>`).join("")||"<p class=muted>間違い対策画面で原因を選ぶと表示されます。</p>"}
 </section><section class=card><h3>優先順位</h3><p><b>Aの誤答 → Aのケアレスミス → 頻出B → 時間不足 → 記述条件</b>の順で直します。C相当の難問より、Aの再発防止を優先します。</p></section>`;
}
function startFirstSkill(s){let x=activeWeak().find(([_,w])=>w.skill===s);if(x)startSkill(x[0])}
function exportData(){const payload={appId:"waseshibu-english-adaptive",schemaVersion:SCHEMA_VERSION,exportedAt:new Date().toISOString(),state:S};const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=`waseshibu-english-backup-${today()}.json`;a.hidden=true;document.body?.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000)}
function normalizeImportedState(x){return {...x,answers:x.answers||{},manual:x.manual||{},weak:x.weak||{},cause:x.cause||{},exposure:x.exposure||{},attempts:Array.isArray(x.attempts)?x.attempts:[],history:Array.isArray(x.history)?x.history:[],drillLog:Array.isArray(x.drillLog)?x.drillLog:[]}}
function validateImport(payload){if(!payload||payload.appId!=="waseshibu-english-adaptive"||!payload.state)throw new Error("このアプリのバックアップではありません。");if(!Number.isFinite(Number(payload.schemaVersion))||Number(payload.schemaVersion)>SCHEMA_VERSION)throw new Error("対応していないバックアップ形式です。");const x=normalizeImportedState(payload.state);if(typeof x.answers!=="object"||Array.isArray(x.answers)||typeof x.weak!=="object"||Array.isArray(x.weak))throw new Error("必要な学習データがありません。");for(const a of x.attempts){const writtenMissing=a.writtenScore===null||a.writtenScore===undefined||a.writtenScore==="",written=Number(a.writtenScore),writtenInvalid=(!writtenMissing&&(!Number.isFinite(written)||written<0||written>80))||(a.status==="graded"&&writtenMissing),listening=a.listeningScore;const listeningInvalid=listening!==null&&listening!==undefined&&(listening===""||!Number.isFinite(Number(listening))||Number(listening)<0||Number(listening)>20);if(!a.id||!ROUTE.includes(Number(a.year))||writtenInvalid||listeningInvalid)throw new Error("受験記録の年度または点数が不正です。")}if(x.currentAttempt&&(!x.currentAttempt.id||!ROUTE.includes(Number(x.currentAttempt.year))))throw new Error("解答途中の記録が不正です。");return x}
function mergeWeak(a={},b={}){if(a.status==="mastered"&&b.status!=="mastered")return a;if(b.status==="mastered"&&a.status!=="mastered")return b;const ap=(a.confirmStreak||0)*10+(a.streak||0),bp=(b.confirmStreak||0)*10+(b.streak||0);return bp>=ap?{...a,...b}:{...b,...a}}
function dedupeBy(arr,keyFn){const m=new Map();arr.forEach(x=>m.set(keyFn(x),x));return [...m.values()]}
function mergeExposure(a={},b={}){const rank={first:0,unknown:1,partial:2,done:3},out={...a};Object.entries(b).forEach(([y,v])=>{if(out[y]===undefined||rank[v]>=rank[out[y]])out[y]=v});return out}
async function importData(input){const file=input.files?.[0];if(!file)return;if(file.size>10*1024*1024)return alert("バックアップファイルが大きすぎます。");try{const incoming=validateImport(JSON.parse(await file.text())),mode=document.getElementById("importMode")?.value||"merge";if(!confirm(`バックアップを${mode==="replace"?"現在データと置き換え":"現在データへ統合"}ます。よろしいですか？`))return;if(mode==="replace"){exportData();S={...INIT,...incoming,schemaVersion:SCHEMA_VERSION}}else{const attemptMap=new Map([...S.attempts,...(incoming.attempts||[])].map(x=>[x.id,x])),weak={...S.weak};Object.entries(incoming.weak||{}).forEach(([key,w])=>weak[key]=mergeWeak(weak[key],w));S={...S,answers:{...S.answers,...incoming.answers},manual:{...S.manual,...incoming.manual},weak,cause:{...S.cause,...incoming.cause},exposure:mergeExposure(S.exposure,incoming.exposure),attempts:[...attemptMap.values()],history:dedupeBy([...S.history,...(incoming.history||[])],x=>x.attemptId||`${x.year}:${x.at}:${x.score}`),drillLog:dedupeBy([...S.drillLog,...(incoming.drillLog||[])],x=>`${x.key}:${x.q}:${x.at}:${x.ok}`)}}save();alert("学習データを復元しました。");goto("home")}catch(e){alert(`復元できませんでした：${e.message}`)}finally{input.value=""}}
function guide(){
 return `<section class=card><h2>この版の使い方</h2><ol>
 <li><b>学習ルート</b>：2024→2023→2022→2021→2020→2019→2025→2026の順で進める。</li>
 <li><b>実際の過去問</b>：PDFではなく、2019〜2026の実際の筆記本文・設問を画面内で読む。</li>
 <li>解答欄では、選択問題は記号ボタンをタップ。複数回答は選んだ順を確認し、英語は入力欄へ直接入力する。</li>
 <li>記述問題は紙に書いた答案を公式解答と比べ、自己採点した点数を入力する。</li>
 <li>誤答は自動で<b>間違い対策</b>へ入る。</li>
 <li>失点原因を選ぶ。</li>
 <li><b>克服ドリル</b>：同じ技能の似た問題を3問連続正解するまで繰り返す。間違えると連続数は0に戻る。</li>
 <li>3連続正解しても消さず、翌日に2問の定着チェック。</li>
 <li>翌日も2連続正解して初めて克服済み。</li></ol>
 <div class=notice><b>英単語・リスニング</b><p>通常の英単語学習とリスニングは別アプリ想定です。過去問中の英文定義問題は本番演習として残しますが、単語そのものの大量反復はこのアプリの中心にはしていません。</p></div>
 <div class=bluebox><b>類題について</b><p>${BANK.length}問のオリジナル類題を収録しています。即時練習3問とは別に、未出2問を翌日確認用として確保します。</p></div>
 <div class=warnbox><b>A・B・Cについて</b><p>学校公式の分類ではなく、60～75点を目指すための学習上の分類です。Aを先に、Bで上積みし、Cは後回し候補とします。</p></div>
 <section class=backup-box><h3>学習データのバックアップ</h3><p>この端末では、アプリを更新しても学習履歴を自動で引き継ぎます。機種変更、ブラウザ変更、端末故障への備えにはバックアップを使ってください。</p><div class=row><button onclick="exportData()">バックアップを書き出す</button><label>復元方法 <select id=importMode><option value=merge>現在データへ統合</option><option value=replace>現在データと置換</option></select></label><label class=file-button>バックアップを選ぶ<input type=file accept="application/json,.json" onchange="importData(this)"></label></div></section></section>`;
}
function render(){if(timerHandle){clearInterval(timerHandle);timerHandle=null}app.innerHTML=({home,route,exam,result,review,drill,stats,guide})[view]();if(view==="exam"&&S.currentAttempt?.status==="active"&&S.currentAttempt.mode==="timed")timerHandle=setInterval(updateTimer,1000)}
render();
