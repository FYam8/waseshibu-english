// CI integration test, not the cloud browser control surface.
// Usage: node tests/g0-g1-browser.test.mjs <Jekyll output directory> <390|1280>
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.G1_PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve(process.argv[2]||'_site');
const width=Number(process.argv[3]||390);
assert.ok([390,1280].includes(width));
const out=path.resolve('g0-g1-results',String(width));fs.mkdirSync(out,{recursive:true});
const key='waseshibu.adaptive.v3';
const sentinels={'waseshibu_vocab_state':'dummy-vocab-do-not-change','dummy.math.progress':'dummy-math-do-not-change'};
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const original=fs.readFileSync('index.html');
assert.equal(sha(fs.readFileSync(path.join(root,'index.html'))),sha(original),'Jekyll changed index bytes');
for(const excluded of ['tests','docs','workers'])assert.equal(fs.existsSync(path.join(root,excluded)),false,'published '+excluded);
const assets=[...original.toString().matchAll(/(?:src|href)="([^"]+)"/g)].map(x=>x[1]);
const manifest=Object.fromEntries(['index.html',...assets].map(p=>{
  const local=fs.readFileSync(p),built=fs.readFileSync(path.join(root,p));
  assert.equal(sha(local),sha(built),'Jekyll changed '+p);return[p,sha(built)];
}));
const requests=[],blocked=[],errors=[],consoleErrors=[],checks=[];
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.txt':'text/plain'};
const server=http.createServer((req,res)=>{
  const pathname=new URL(req.url,'http://localhost').pathname;
  requests.push({method:req.method,path:pathname});
  if(!['GET','HEAD'].includes(req.method)||!pathname.startsWith('/waseshibu-english/')){res.writeHead(404);return res.end();}
  const relative=decodeURIComponent(pathname.slice('/waseshibu-english/'.length))||'index.html';
  const file=path.resolve(root,relative);
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end();}
  res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');
  res.end(fs.readFileSync(file));
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin=`http://127.0.0.1:${server.address().port}`;
const url=origin+'/waseshibu-english/';
const browser=await chromium.launch({headless:true});
async function context(){
  const c=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block',acceptDownloads:true});
  // No production request is ever continued, including anonymous registration.
  await c.route('**/*',route=>{
    const u=route.request().url();
    if(new URL(u).origin===origin)return route.continue();
    blocked.push({url:u,method:route.request().method()});return route.abort('blockedbyclient');
  });
  await c.addInitScript(({sentinels,origin})=>{
    // addInitScript also runs in the initial opaque about:blank document.
    // Seed only our test origin; do not catch or hide production-page errors.
    if(location.origin!==origin)return;
    for(const [k,v] of Object.entries(sentinels))if(localStorage.getItem(k)===null)localStorage.setItem(k,v);
  },{sentinels,origin});
  c.on('page',p=>{
    p.on('pageerror',e=>errors.push(e.message));
    p.on('console',m=>{if(m.type()==='error')consoleErrors.push({text:m.text(),url:m.location().url});});
    p.on('dialog',d=>d.type()==='confirm'?d.accept():d.dismiss());
  });
  return c;
}
const state=p=>p.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
async function sentinelCheck(p){assert.deepEqual(await p.evaluate(keys=>Object.fromEntries(keys.map(k=>[k,localStorage.getItem(k)])),Object.keys(sentinels)),sentinels);}
async function snapshot(p,name){
  await p.screenshot({path:path.join(out,name+'.png'),fullPage:true});
  fs.writeFileSync(path.join(out,name+'.txt'),await p.locator('body').innerText());
  const dimensions=await p.evaluate(()=>({viewport:innerWidth,width:document.documentElement.scrollWidth}));
  assert.ok(dimensions.width<=dimensions.viewport+1,`${name}: horizontal overflow ${JSON.stringify(dimensions)}`);
}
let finalState;
try{
  const c=await context(),p=await c.newPage();
  await p.goto(url);
  await p.getByRole('button',{name:'2024年度の過去問を見る',exact:true}).waitFor();
  assert.equal((await p.locator('body').innerText()).includes('\\n'),false);
  assert.equal(await p.locator('nav button').count(),7);
  const inventory=await p.evaluate(()=>({
    exams:Object.fromEntries(Object.entries(window.EXAM_DATA).map(([year,qs])=>[year,qs.map(q=>({id:q.id,type:q.type,points:q.points,skill:q.skill}))])),
    drills:window.DRILLS.map(q=>({id:q.id,type:q.type,skill:q.skill,retired:!!q.retired})),
    config:window.ENGLISH_SCHOOL_CONFIG,
    ui:!!window.ENGLISH_UI_COMPONENTS&&!!window.ENGLISH_UI_SHELL&&!!window.ENGLISH_ENGINE_ADAPTER
  }));
  assert.equal(inventory.ui,true);
  assert.deepEqual([inventory.config.exam.writtenMaxScore,inventory.config.exam.listeningMaxScore,inventory.config.exam.totalMaxScore],[80,20,100]);
  fs.writeFileSync(path.join(out,'inventory.json'),JSON.stringify(inventory,null,2));
  await snapshot(p,'home');checks.push('fresh shared UI home');
  await p.getByRole('button',{name:'2024年度の過去問を見る',exact:true}).click();
  await p.getByLabel('完全初見',{exact:true}).check();
  await p.getByLabel('時間無制限で通し演習',{exact:true}).check();
  await p.getByRole('button',{name:'問題を開いて開始',exact:true}).click();
  const question=await p.evaluate(()=>window.EXAM_DATA[2024].find(q=>q.type==='choice'&&q.skill==='pronunciation'));
  assert.ok(question,'representative pronunciation question');
  const row=p.locator(`[id="answer-2024-${question.id}"]`);
  assert.equal(await row.locator('[aria-pressed="true"]').count(),0);
  const wrong=(await row.locator('.answer-kana').allTextContents()).find(t=>t.trim()!==question.answer).trim();
  await row.getByRole('button',{name:wrong,exact:true}).click();
  const written=p.locator('textarea[id^="ai-answer-2024-"]').first();
  await written.fill('This is an artificial draft for the isolated test.');
  const draftState=await state(p);
  await p.reload();
  await p.getByRole('button',{name:'2024年度の続きへ',exact:true}).click();
  assert.equal(await row.getByRole('button',{name:wrong,exact:true}).getAttribute('aria-pressed'),'true');
  assert.equal(await written.inputValue(),'This is an artificial draft for the isolated test.');
  assert.equal((await state(p)).currentAttempt.id,draftState.currentAttempt.id);
  checks.push('exam answer and writing draft survive reload');
  const aiBox=written.locator('..');
  await aiBox.getByRole('button',{name:'AIで学習用採点',exact:true}).click();
  await p.waitForFunction(()=>[...document.querySelectorAll('.ai-status')].some(e=>e.textContent.includes('自己採点はそのまま利用できます')));
  assert.deepEqual((await state(p)).manual,draftState.manual,'blocked AI must not assign zero or lose draft');
  checks.push('blocked AI preserves draft and unconfirmed self-score');
  // Every manually scored task must be explicitly supplied for a full exam grade.
  // Artificial self-scores are fixture inputs, not evidence of correct essays.
  for(const input of await p.locator('input[id^="m-"]').all())await input.fill(await input.getAttribute('max'));
  await snapshot(p,'exam');
  await p.getByRole('button',{name:'採点して弱点分析',exact:true}).click();
  await p.locator('.result-hero').waitFor();
  assert.match(await p.locator('.score-total').innerText(),/リスニング入力後/);
  const graded=await state(p);
  assert.equal(graded.attempts.length,1);
  assert.equal(graded.attempts[0].answers[`2024:${question.id}`],wrong);
  assert.equal(graded.attempts[0].listeningScore??null,null);
  assert.equal(graded.attempts[0].totalScore??null,null);
  assert.equal(graded.weak[`2024:${question.id}:main`].last,'wrong');
  await snapshot(p,'result');checks.push('wrong answer -> grade -> weakness; listening remains unknown');
  await p.getByRole('button',{name:'誤答一覧',exact:true}).click();
  const weak=p.locator('section.wrong').filter({hasText:`2024 ${question.label}`}).first();
  await weak.locator('button').filter({hasText:/克服ドリル|追加練習/}).click();
  await p.locator('.drill-card').waitFor();
  const drilling=await state(p);
  assert.equal(drilling.currentDrill.key,`2024:${question.id}:main`);
  assert.equal(drilling.currentDrill.q.skill,question.skill);
  assert.equal(drilling.currentDrill.q.type,'choice');
  const choices=await p.locator('.choices .choice').allTextContents();
  assert.equal(await p.locator('.choices .selected,.choices .correct,.choices .wrong').count(),0);
  await p.reload();
  await p.getByRole('button',{name:'途中の1問を再開',exact:true}).click();
  assert.deepEqual(await p.locator('.choices .choice').allTextContents(),choices);
  const resumed=await state(p);
  assert.deepEqual(resumed.currentDrill.choiceOrder,drilling.currentDrill.choiceOrder);
  assert.equal(resumed.currentDrill.q.id,drilling.currentDrill.q.id);
  const shown=resumed.currentDrill.choiceOrder.indexOf(resumed.currentDrill.q.answer);
  await p.locator('.choices .choice').nth(shown).click();
  await p.locator('#drillFeedback').waitFor();
  assert.equal((await state(p)).drillLog.length,1);
  await snapshot(p,'drill-feedback');
  await p.reload();
  assert.equal((await state(p)).drillLog.length,1);
  assert.deepEqual((await state(p)).attempts,graded.attempts,'first graded attempt must not change');
  await p.locator('nav button[data-v="drill"]').click();
  await p.getByRole('button',{name:'今日はここまで',exact:true}).click();
  await p.locator('.today-card').waitFor();
  await sentinelCheck(p);checks.push('mapped drill -> reload -> same choices -> answer -> reload -> home');
  await p.locator('nav button[data-v="guide"]').click();
  const downloadEvent=p.waitForEvent('download');
  await p.getByRole('button',{name:'バックアップを書き出す',exact:true}).click();
  const download=await downloadEvent;const backupPath=path.join(out,'synthetic-backup.json');await download.saveAs(backupPath);
  const exported=JSON.parse(fs.readFileSync(backupPath,'utf8'));
  const c2=await context(),p2=await c2.newPage();await p2.goto(url);
  await p2.locator('nav button[data-v="guide"]').click();
  await p2.locator('input[type="file"]').setInputFiles(backupPath);
  await p2.locator('.today-card').waitFor();
  const imported=await state(p2);
  for(const field of ['answers','manual','attempts','history','drillLog','weak','exposure'])assert.deepEqual(imported[field],exported.state[field],'import '+field);
  await p2.locator('nav button[data-v="guide"]').click();
  await p2.locator('input[type="file"]').setInputFiles(backupPath);
  await p2.locator('.today-card').waitFor();
  for(const field of ['attempts','history','drillLog'])assert.deepEqual((await state(p2))[field],imported[field],'duplicate import '+field);
  await p2.locator('nav button[data-v="guide"]').click();
  const beforeInvalid=await state(p2);
  await p2.locator('input[type="file"]').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from('{invalid')});
  await p2.waitForFunction(()=>document.querySelector('input[type="file"]').value==='');
  assert.deepEqual(await state(p2),beforeInvalid,'invalid import must be non-destructive');
  await sentinelCheck(p2);checks.push('export/import semantics, duplicate import, invalid JSON, unrelated keys');
  finalState=await state(p2);
  await c2.close();await c.close();
  // Broaden to one saved draft per currently active drill format.
  // Fixture setup is synthetic; subsequent answers and navigation are UI actions.
  const probeContext=await context(),probe=await probeContext.newPage();await probe.goto(url);
  const representatives=await probe.evaluate(()=>{
    const active=window.DRILLS.filter(q=>!q.retired);
    return [...new Set(active.map(q=>q.type))].map(type=>active.find(q=>q.type===type));
  });
  await probeContext.close();
  for(const q of representatives){
    const fc=await context();
    const weakKey=`2024:fixture-${q.type}:main`;
    const fixture={schemaVersion:8,goal:60,year:2024,weak:{[weakKey]:{year:2024,id:`fixture-${q.type}`,label:`人工 ${q.type}`,status:'active',priority:'A',skill:q.skill,targetId:q.targetId,focusTag:q.focusTag,streak:0,confirmStreak:0}},currentSkill:weakKey,currentDrill:{key:weakKey,skill:q.skill,targetId:q.targetId,focusTag:q.focusTag,mode:'train',q:{id:q.id},answered:false,selected:null,selectedMany:[],order:[],orderIndices:[],textInputs:[],selfText:'',selfParts:[],selfChecks:[],used:[q.id]}};
    await fc.addInitScript(({origin,key,fixture})=>{if(location.origin===origin&&!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(fixture));},{origin,key,fixture});
    const fp=await fc.newPage();await fp.goto(url);await fp.getByRole('button',{name:'途中の1問を再開',exact:true}).click();
    const card=fp.locator('.drill-card');
    if(q.type==='pair'){
      const buttons=card.locator('.answer-kana');await buttons.nth(0).click();await buttons.nth(1).click();await buttons.nth(1).click();
      assert.equal((await state(fp)).currentDrill.selectedMany.length,1,'pair toggle cancels');
    }else if(q.type==='multi_choice'){
      const buttons=card.locator('.choice');await buttons.nth(0).click();await buttons.nth(1).click();await buttons.nth(1).click();
      assert.equal((await state(fp)).currentDrill.selectedMany.length,1,'multi-choice toggle cancels');
    }else if(q.type==='text')await card.locator('input').fill('draft');
    else if(q.type==='text_multi')await card.locator('input').first().fill('draft');
    else if(q.type==='selfcheck')await card.locator('textarea').first().fill('A saved artificial writing draft.');
    else assert.equal(q.type,'choice','unhandled active format requires a test');
    const before=await state(fp);
    // textarea.textContent is the markup/default value, not the live answer.
    // Compare input values, and compare textContent only for button labels.
    const controls=()=>card.locator('input,textarea,button').evaluateAll(es=>es.map(e=>({tag:e.tagName,text:e.tagName==='BUTTON'?e.textContent:null,value:e.value,disabled:e.disabled,cls:e.className})));
    const beforeControls=await controls();
    await fp.reload();await fp.getByRole('button',{name:'途中の1問を再開',exact:true}).click();
    for(const field of ['q','key','selectedMany','choiceOrder','textDraft','textInputs','selfText','selfParts','order','orderIndices'])assert.deepEqual((await state(fp)).currentDrill[field],before.currentDrill[field],q.type+' reload '+field);
    assert.deepEqual(await controls(),beforeControls,q.type+' rendered controls after reload');
    await sentinelCheck(fp);await snapshot(fp,'format-'+q.type);
    await fc.close();checks.push(q.type+' artificial draft toggle/input and reload');
  }
  assert.ok(blocked.some(x=>x.url.includes('/v1/register-anonymous')),'prove production registration was intercepted');
  assert.ok(blocked.some(x=>x.url.includes('writing-grader')),'prove AI API was intercepted');
  assert.deepEqual(errors,[],'uncaught page errors');
  const unexpectedConsole=consoleErrors.filter(x=>!((x.text.includes('ERR_BLOCKED_BY_CLIENT')&&blocked.some(b=>b.url===x.url))||(x.url===origin+'/favicon.ico'&&x.text.includes('404'))));
  assert.deepEqual(unexpectedConsole,[],'unexpected console errors');
  console.log(`G0/G1 representative integration PASS width=${width}; ${checks.length} groups; not full G1 or content/effectiveness proof.`);
}finally{
  fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({width,origin,indexSha256:sha(original),manifest,checks,blocked,requests,errors,consoleErrors,finalState},null,2));
  await browser.close();await new Promise(resolve=>server.close(resolve));
}
