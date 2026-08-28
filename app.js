
const D=window.EXAM_DATA, P=window.PAPERS, BANK=window.DRILLS, FALLBACK=window.FALLBACK;
const KEY="waseshibu.adaptive.v2";
const INIT={year:2026,answers:{},manual:{},history:[],weak:{},cause:{},drillLog:[],currentSkill:null,theme:"light"};
let S;try{S={...INIT,...JSON.parse(localStorage.getItem(KEY)||"{}")}}catch(e){S={...INIT}}
let view="home", drillState=null;
const app=document.getElementById("app"), kana=["ア","イ","ウ","エ","オ","カ","キ","ク"];
const fullwidthDigits="０１２３４５６７８９";
const skillNames={pronunciation:"発音",stress:"アクセント",reorder:"語句整序",vocab_definition:"英文定義",writing_completion:"短文完成",summary:"要約",rebuttal:"要約＋反論",paraphrase:"言い換え",context:"文脈",emotion:"心情",reason:"理由",extract:"本文抜出",content_match:"内容一致",sentence_completion:"英語完成",reference:"指示語",connector:"接続語",insertion:"文挿入",detail:"内容把握",example:"具体例"};
function save(){localStorage.setItem(KEY,JSON.stringify(S))}
function h(s=""){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function norm(s){return String(s||"").trim().replace(/\s+/g,"").replace(/，/g,",").toLowerCase()}
function k(y,id){return `${y}:${id}`}
function badge(p){return `<span class="badge ${p}">${p}</span>`}
function today(){return new Date().toISOString().slice(0,10)}
function plusDays(n){let d=new Date();d.setDate(d.getDate()+n);return d.toISOString().slice(0,10)}
function skillName(s){return skillNames[s]||s}
function goto(v){view=v;document.querySelectorAll("nav button").forEach(b=>b.classList.toggle("active",b.dataset.v===v));render();scrollTo(0,0)}
document.querySelectorAll("nav button").forEach(b=>b.onclick=()=>goto(b.dataset.v));
document.getElementById("dark").onclick=()=>{document.documentElement.classList.toggle("dark");S.theme=document.documentElement.classList.contains("dark")?"dark":"light";save()}
if(S.theme==="dark")document.documentElement.classList.add("dark");

function activeWeak(){return Object.entries(S.weak).filter(([_,w])=>w.status!=="mastered")}
function mastered(){return Object.values(S.weak).filter(w=>w.status==="mastered").length}
function home(){
 const active=activeWeak(), due=active.filter(([_,w])=>!w.next||w.next<=today()).length;
 const last=S.history.at(-1);
 return `<section class="card hero"><div class=eyebrow>ACTUAL 2019–2026 + ADAPTIVE REMEDIATION</div>
 <h2>過去問で間違えた弱点を、<br>似た問題で消えるまで反復。</h2>
 <p>問題冊子PDFは表示しません。実際の過去問本文・設問をアプリ内のテキストとして収録し、採点後は誤答分野の類題を繰り返します。</p>
 <div class=row><button class=primary onclick="openYear(2026)">実際の過去問を解く</button><button onclick="goto('review')">間違い対策へ</button></div></section>
 <section class="grid three"><div class=card><div class=metric>${active.length}</div><div class=muted>未克服の弱点</div></div>
 <div class=card><div class=metric>${due}</div><div class=muted>今日やる復習</div></div>
 <div class=card><div class=metric>${mastered()}</div><div class=muted>克服済み</div></div></section>
 <section class=card><h3>克服ルール</h3><div class="grid three">
 <div class=bluebox><b>① 即時類題</b><p>過去問を間違えた直後、同じ技能を3問連続正解するまで反復。</p></div>
 <div class=warnbox><b>② 翌日チェック</b><p>3連続正解しても消さず、翌日に2問確認。</p></div>
 <div class=okbox><b>③ 克服</b><p>翌日の確認も2連続正解で初めて「克服済み」。</p></div></div></section>
 ${last?`<section class=card><h3>直近の過去問</h3><p>${last.year}年度　筆記 ${last.score}/80　／　A問題失点 ${last.aLost}点　／　B問題失点 ${last.bLost}点</p></section>`:""}`;
}
function openYear(y){S.year=y;save();goto("exam")}
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
 section=cutSection(section,new RegExp(`^問${fwNumber(part[1])}[ \\t　]+`,"m"),/^問[１２３４５６７８９][ \t　]+/m)||section;
 if(part[2]){
   const next=String(Number(part[2])+1);
   section=cutSection(section,new RegExp(`^[（(]${fwNumber(part[2])}[）)]`,"m"),new RegExp(`^[（(]${fwNumber(next)}[）)]`,"m"))||section;
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
function formatPaperText(text){
 return text.split("\n").map(line=>{
   const major=line.match(/^([３４５６７８])[ \t　]+(.*)$/);
   if(major)return `<div class=major-heading><span>大問${fullwidthDigits.indexOf(major[1])}</span><strong>${h(major[2])}</strong></div>`;
   if(/^問[１２３４５６７８９]/.test(line))return `<div class=subquestion-heading>${h(line)}</div>`;
   return `<div class=paper-line>${line?h(line):"&nbsp;"}</div>`;
 }).join("");
}
function renderPaperPages(y,pages){
 let current=null;
 return pages.map((p,i)=>{
   const majors=majorNumbers(p.text);if(majors.length)current=majors.at(-1);
   const label=majors.length?`大問 ${majors.join("・")}`:current?`大問 ${current}（続き）`:`筆記ページ ${i+1}`;
   return `<article class=paper-page><div class=page-label><b>${y}年度</b><span>${label}</span></div><div class=paper-text>${formatPaperText(p.text)}</div></article>`;
 }).join("");
}
function exam(){
 const y=Number(S.year), rows=D[y], pages=P[y];
 return `<div class=tabs>${Object.keys(D).map(Number).sort().map(n=>`<button class="year ${n===y?"selected":""}" onclick="openYear(${n})">${n}</button>`).join("")}</div>
 <section class=notice><b>${y}年度 実際の筆記問題</b><br><span class=muted>問題冊子PDFではなく、問題冊子から抽出した実際の本文・設問をそのまま表示しています。大問1・2（リスニング）は別アプリ対象です。</span></section>
 <div class=examgrid><section>${renderPaperPages(y,pages)}</section>
 <aside class="card answerpanel"><div class="row space"><h3>解答欄</h3><span>筆記80点</span></div>
 <div class=answer-help><b>入力方法</b><span>記号はボタンをタップ。複数回答は選んだ順が表示されます。英語は回答欄へ直接入力してください。</span></div>
 ${rows.map(q=>answerRow(y,q)).join("")}
 <button class=primary onclick="grade(${y})">採点して弱点分析</button></aside></div>`;
}
function answerRow(y,q){
 const key=k(y,q.id), rawVal=S.answers[key]??"", wr=S.weak[key], cls=wr?.last==="wrong"?"bad":wr?.last==="correct"?"good":q.type==="manual"?"manual":"";
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
   input=`<div class=input-guide><b>記述問題</b>：紙に書いた答案を公式解答と比べ、自己採点した点数を入力</div><div class=score-input><button type=button aria-label="1点減らす" onclick="adjustScore(${y},'${q.id}',-1,${q.points})">−</button><input id="m-${q.id}" type=number inputmode=numeric min=0 max=${q.points} value="${score}" placeholder="0" oninput="rememberScore(${y},'${q.id}',this.value,${q.points})"><span>/ ${q.points}点</span><button type=button aria-label="1点増やす" onclick="adjustScore(${y},'${q.id}',1,${q.points})">＋</button></div>`;
 }
 return `<div class="q ${cls}"><div class="row space"><b>${h(q.label)}</b><span>${q.points}点 ${badge(q.priority)}</span></div><div class="tiny muted">${h(q.category)}</div>${input}${wr?.last==="wrong"?`<div class="tiny previous-answer">前回：${h(wr.user||"未入力")} → 正解 ${h(q.answer||"記述自己採点")}</div>`:""}</div>`;
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
 const n=value===""?"":Math.max(0,Math.min(max,Number(value)||0));S.manual[k(y,id)]={score:n};save();
}
function adjustScore(y,id,delta,max){
 const input=document.getElementById("m-"+id),current=input.value===""?0:Number(input.value);input.value=Math.max(0,Math.min(max,current+delta));rememberScore(y,id,input.value,max);
}
function matches(q,a){
 const x=norm(a), z=norm(q.answer);
 if(q.type==="text"){if(z==="peanut(s)")return ["peanut","peanuts"].includes(x);return x===z}
 if(q.type==="multi"){return x.split(",").filter(Boolean).sort().join(",")===z.split(",").filter(Boolean).sort().join(",")}
 return x===z;
}
function grade(y){
 let score=0,aLost=0,bLost=0,wrongCount=0;
 D[y].forEach(q=>{
   const key=k(y,q.id);
   if(q.type==="manual"){
     const sc=Math.max(0,Math.min(q.points,Number(document.getElementById("m-"+q.id).value||0)));
     S.manual[key]={score:sc};score+=sc;
     if(sc<q.points){createWeak(y,q,`自己採点 ${sc}/${q.points}`,false);wrongCount++; if(q.priority==="A")aLost+=q.points-sc;else bLost+=q.points-sc}
     else markActualCorrect(y,q,`自己採点 ${sc}/${q.points}`);
   }else{
     const a=document.getElementById("a-"+q.id).value;S.answers[key]=a;
     const ok=matches(q,a);if(ok){score+=q.points;markActualCorrect(y,q,a)}
     else{createWeak(y,q,a,false);wrongCount++;if(q.priority==="A")aLost+=q.points;else bLost+=q.points}
   }
 });
 S.history.push({year:y,score,aLost,bLost,wrongCount,at:new Date().toISOString()});save();
 alert(`筆記 ${score}/80\nA問題失点 ${aLost}点\nB問題失点 ${bLost}点\n要対策 ${wrongCount}問\n\n誤答は「間違い対策」に入り、類題を3問連続正解するまで反復します。`);
 render();
}
function createWeak(y,q,user){
 const key=k(y,q.id), old=S.weak[key]||{};
 S.weak[key]={...old,year:y,id:q.id,label:q.label,category:q.category,skill:q.skill,priority:q.priority,points:q.points,user,last:"wrong",status:"active",streak:0,confirmStreak:0,next:today(),wrongCount:(old.wrongCount||0)+1};
}
function markActualCorrect(y,q,user){
 const key=k(y,q.id), old=S.weak[key];
 if(old){old.user=user;old.last="correct";old.actualCorrect=(old.actualCorrect||0)+1}
}
function review(){
 const arr=activeWeak().map(([key,w])=>({key,w})).sort((a,b)=>(a.w.priority>b.w.priority?1:-1)||(a.w.next||"").localeCompare(b.w.next||""));
 if(!arr.length)return `<section class="card hero"><h2>現在、未克服の誤答はありません。</h2><p>A問題を維持しながらB問題の上積みに進めます。</p></section>`;
 return `<section class=card><div class="row space"><div><div class=eyebrow>ERROR → DRILL → RETEST</div><h2>間違い対策 ${arr.length}件</h2></div><button class=primary onclick="startDue()">今日の復習を開始</button></div>
 <p>A問題を先に処理。同じ技能の類題を3連続正解→翌日2連続正解で克服です。</p></section>
 ${arr.map(({key,w})=>`<section class="card wrong"><div class="row space"><div><b>${w.year} ${h(w.label)}</b><div class="tiny"><span class=skill>${skillName(w.skill)}</span> ／ ${h(w.category)} ／ ${w.points}点</div></div>${badge(w.priority)}</div>
 <p>誤答：<b>${h(w.user||"未入力")}</b>　${w.status==="pending"?`<span class=badge>翌日確認待ち</span>`:""}</p>
 <p class=muted>${w.status==="pending"?`次の定着チェック：${w.next}`:`類題連続正解：${w.streak||0}/3`}</p>
 <label>失点原因 <select onchange="setCause('${key}',this.value)"><option value="">選択</option>${["ケアレスミス","知識不足","語順・構文","本文根拠の見落とし","選択肢の読み違い","推論しすぎ","時間不足","記述条件漏れ"].map(c=>`<option ${S.cause[key]===c?"selected":""}>${c}</option>`).join("")}</select></label>
 <div class=row style="margin-top:10px"><button class=primary onclick="startSkill('${key}')">${w.status==="pending"?"定着チェック":"克服ドリル"}</button><button onclick="openYear(${w.year})">過去問本文を確認</button></div></section>`).join("")}`;
}
function setCause(key,v){S.cause[key]=v;save()}
function startDue(){
 const due=activeWeak().filter(([_,w])=>!w.next||w.next<=today()).sort((a,b)=>a[1].priority>b[1].priority?1:-1);
 if(!due.length)return alert("今日が期限の復習はありません。");
 startSkill(due[0][0]);
}
function poolFor(skill){
 let pool=BANK.filter(x=>x.skill===skill);
 if(pool.length<3)for(const fb of (FALLBACK[skill]||[]))pool=pool.concat(BANK.filter(x=>x.skill===fb));
 return pool;
}
function startSkill(key){
 const w=S.weak[key];if(!w)return;
 if(w.status==="pending" && w.next>today()) {
   if(!confirm(`定着チェック予定日は ${w.next} です。今日先にやりますか？`))return;
 }
 S.currentSkill=key;save();
 drillState={key,skill:w.skill,mode:w.status==="pending"?"confirm":"train",used:[],q:null,answered:false,selected:null,order:[],textInputs:[]};
 nextDrill();goto("drill");
}
function nextDrill(){
 if(!drillState)return;
 const pool=poolFor(drillState.skill);
 let candidates=pool.filter(x=>!drillState.used.includes(x.id));
 if(!candidates.length){drillState.used=[];candidates=pool}
 // During training, introduce level 1/2 first; confirmation may use any level.
 if(drillState.mode==="train"){
   const w=S.weak[drillState.key], max=(w.streak||0)>=2?3:2;
   const leveled=candidates.filter(x=>x.level<=max);if(leveled.length)candidates=leveled;
 }
 const q=candidates[Math.floor(Math.random()*candidates.length)];
 drillState.q=q;drillState.used.push(q.id);drillState.answered=false;drillState.selected=null;drillState.order=[];drillState.textInputs=[];
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
   if(ok)w.confirmStreak=(w.confirmStreak||0)+1;else{w.confirmStreak=0;w.status="active";w.streak=0;w.next=today()}
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
 const active=activeWeak(), bySkill={}, byCause={}, a=active.filter(([_,w])=>w.priority==="A"), b=active.filter(([_,w])=>w.priority==="B");
 active.forEach(([key,w])=>{bySkill[w.skill]=(bySkill[w.skill]||0)+1;if(S.cause[key])byCause[S.cause[key]]=(byCause[S.cause[key]]||0)+1});
 const recent=S.drillLog.slice(-20), rate=recent.length?Math.round(recent.filter(x=>x.ok).length/recent.length*100):0;
 return `<section class="grid three"><div class=card><div class=metric>${a.length}</div><div class=muted>A問題の未克服</div></div><div class=card><div class=metric>${b.length}</div><div class=muted>B問題の未克服</div></div><div class=card><div class=metric>${rate}%</div><div class=muted>直近20類題の正答率</div></div></section>
 <section class=card><h2>弱点分野</h2><div class=table><table><tr><th>分野</th><th>未克服</th><th>対策</th></tr>${Object.entries(bySkill).sort((a,b)=>b[1]-a[1]).map(([s,n])=>`<tr><td>${skillName(s)}</td><td>${n}</td><td><button onclick="startFirstSkill('${s}')">類題を解く</button></td></tr>`).join("")||"<tr><td colspan=3>未克服なし</td></tr>"}</table></div></section>
 <section class=card><h3>失点原因</h3>${Object.entries(byCause).sort((a,b)=>b[1]-a[1]).map(([c,n])=>`<p>${h(c)}：${n}</p>`).join("")||"<p class=muted>間違い対策画面で原因を選ぶと表示されます。</p>"}
 </section><section class=card><h3>優先順位</h3><p><b>Aの誤答 → Aのケアレスミス → 頻出B → 時間不足 → 記述条件</b>の順で直します。C相当の難問より、Aの再発防止を優先します。</p></section>`;
}
function startFirstSkill(s){let x=activeWeak().find(([_,w])=>w.skill===s);if(x)startSkill(x[0])}
function guide(){
 return `<section class=card><h2>この版の使い方</h2><ol>
 <li><b>実際の過去問</b>：PDFではなく、2019〜2026の実際の筆記本文・設問を画面内で読む。</li>
 <li>解答欄では、選択問題は記号ボタンをタップ。複数回答は選んだ順を確認し、英語は入力欄へ直接入力する。</li>
 <li>記述問題は紙に書いた答案を公式解答と比べ、自己採点した点数を入力する。</li>
 <li>誤答は自動で<b>間違い対策</b>へ入る。</li>
 <li>失点原因を選ぶ。</li>
 <li><b>克服ドリル</b>：同じ技能の似た問題を3問連続正解するまで繰り返す。間違えると連続数は0に戻る。</li>
 <li>3連続正解しても消さず、翌日に2問の定着チェック。</li>
 <li>翌日も2連続正解して初めて克服済み。</li></ol>
 <div class=notice><b>英単語・リスニング</b><p>通常の英単語学習とリスニングは別アプリ想定です。過去問中の英文定義問題は本番演習として残しますが、単語そのものの大量反復はこのアプリの中心にはしていません。</p></div>
 <div class=bluebox><b>類題について</b><p>類題は過去問本文のコピーではなく、実際の出題技能・構文・ひっかけ方を基にしたオリジナル問題です。誤答した技能に応じて自動選択されます。</p></div></section>`;
}
function render(){app.innerHTML=({home,exam,review,drill,stats,guide})[view]()}
render();
