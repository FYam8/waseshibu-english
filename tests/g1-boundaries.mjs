import assert from 'node:assert/strict';

// Only synthetic fixtures; all state transitions below use production controls.
// Existing answer keys define regression expectations, not official-answer truth.
export async function runBoundaryChecks(h){
  const {context,origin,url,key,state,sentinelCheck,snapshot,checks,dialogs,baseline}=h;
  const clone=x=>JSON.parse(JSON.stringify(x));
  async function seed(c,fixture){
    await c.addInitScript(({origin,key,fixture})=>{if(location.origin===origin&&!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(fixture));},{origin,key,fixture});
  }
  async function start(p,year=2024,timed=false){
    await p.locator('nav button[data-v="exam"]').click();
    await p.getByRole('button',{name:String(year),exact:true}).click();
    await p.getByLabel('完全初見',{exact:true}).check();
    await p.getByLabel(timed?'本番時間で通し演習':'時間無制限で通し演習',{exact:true}).check();
    if(timed)await p.locator('#timeLimit').fill('10'); // test duration, not official exam time
    await p.getByRole('button',{name:'問題を開いて開始',exact:true}).click();
  }
  async function fillCorrect(p,year){
    const qs=await p.evaluate(y=>window.EXAM_DATA[y],year);
    for(const q of qs){
      const row=p.locator(`[id="answer-${year}-${q.id}"]`);
      if(q.type==='manual')await row.locator('input[type="number"]').fill(String(q.points));
      else if(q.type==='text')await row.locator('input:not([type="hidden"])').fill(' '+String(q.answer).toUpperCase()+' ');
      else for(const answer of q.answer.split(','))await row.getByRole('button',{name:answer,exact:true}).click();
    }
    return qs;
  }
  async function freeze(p,day='2026-10-01'){
    await p.clock.install({time:new Date(day+'T23:59:57Z')});
    await p.clock.pauseAt(new Date(day+'T23:59:58Z'));
  }
  async function answerChoice(p){
    const s=await state(p),d=s.currentDrill;
    assert.equal(d.q.type,'choice');
    await p.locator('.choices .choice').nth(d.choiceOrder.indexOf(d.q.answer)).click();
    return d.q.id;
  }
  // Unscored writing and a missing error reason must prevent finalization.
  {
    const c=await context(),p=await c.newPage();await p.goto(url);await start(p);
    const before=await state(p);
    await p.getByRole('button',{name:'採点して弱点分析',exact:true}).click();
    assert.match(dialogs.at(-1).message,/未採点/);
    assert.equal((await state(p)).attempts.length,0);
    assert.equal((await state(p)).currentAttempt.id,before.currentAttempt.id);
    const qs=await fillCorrect(p,2024),manual=qs.find(q=>q.type==='manual');
    const row=p.locator(`[id="answer-2024-${manual.id}"]`);
    await row.locator('input[type="number"]').fill(String(manual.points-1));
    await p.getByRole('button',{name:'採点して弱点分析',exact:true}).click();
    assert.match(dialogs.at(-1).message,/減点された原因/);
    assert.equal((await state(p)).attempts.length,0);
    await row.locator('details.component-picker summary').click();
    await row.locator('input[type="checkbox"]').first().check();
    await p.getByRole('button',{name:'採点して弱点分析',exact:true}).click();
    const graded=(await state(p)).attempts[0];assert.equal(graded.writtenScore,79);
    assert.equal(graded.comparable,false);
    // A 0 listening score is measured; blank is unknown. The written snapshot stays fixed.
    for(const [value,score,total] of [['0',0,79],['20',20,99],['',null,null]]){
      await p.locator('.listening-input').fill(value);await p.locator('.listening-input').press('Tab');
      const a=(await state(p)).attempts[0];assert.equal(a.listeningScore,score);assert.equal(a.totalScore,total);
      assert.deepEqual(a.answers,graded.answers);assert.deepEqual(a.manual,graded.manual);assert.equal(a.writtenScore,79);
    }
    await snapshot(p,'boundary-score-79');await sentinelCheck(p);
    checks.push('unscored/manual cause gates; answer-key regression 79/80; listening 0/20/unknown');
    await c.close();
  }
  // Mixed cases: multi has one correct/one wrong, pair is reversed, and text is empty.
  {
    const c=await context(),p=await c.newPage();await p.goto(url);await start(p,2023);
    const qs=await fillCorrect(p,2023),multi=qs.find(q=>q.type==='multi'),pair=qs.find(q=>q.type==='pair'),text=qs.find(q=>q.type==='text');
    assert.equal(multi.points,6);assert.equal(pair.points,3);assert.equal(text.points,3);
    const mr=p.locator(`[id="answer-2023-${multi.id}"]`),pr=p.locator(`[id="answer-2023-${pair.id}"]`);
    const correct=multi.answer.split(',');await mr.getByRole('button',{name:correct[1],exact:true}).click();
    const wrong=(await mr.locator('.answer-kana').allTextContents()).find(t=>!correct.includes(t.trim())).trim();
    await mr.getByRole('button',{name:wrong,exact:true}).click();
    await pr.getByRole('button',{name:'選択をやり直す',exact:true}).click();
    for(const token of pair.answer.split(',').reverse())await pr.getByRole('button',{name:token,exact:true}).click();
    await p.locator(`[id="a-${text.id}"]`).fill('');
    await p.getByRole('button',{name:'採点して弱点分析',exact:true}).click();
    const first=(await state(p)).attempts[0];assert.equal(first.writtenScore,71,'6-point multi earns 3; reversed pair and blank text earn 0');
    assert.equal((await state(p)).weak[`2023:${text.id}:main`].last,'wrong');
    await start(p,2023);await fillCorrect(p,2023);
    await p.getByRole('button',{name:'採点して弱点分析',exact:true}).dblclick();
    const after=await state(p);assert.equal(after.attempts.length,2,'double click must not duplicate the second result');
    assert.deepEqual(after.attempts[0],first,'retake must not recompute the first score');assert.equal(after.attempts[1].writtenScore,80);
    await snapshot(p,'boundary-retake-80');await sentinelCheck(p);
    checks.push('multi partial / reversed pair / blank text -> 71; perfect retake -> 80; double click and first score preserved');await c.close();
  }
  // Dismissing incomplete-answer confirmation must not create a score.
  {
    const c=await context({acceptConfirm:false}),p=await c.newPage();await p.goto(url);await start(p);
    for(const input of await p.locator('input[id^="m-"]').all())await input.fill(await input.getAttribute('max'));
    const before=await state(p);await p.getByRole('button',{name:'採点して弱点分析',exact:true}).click();
    assert.match(dialogs.at(-1).message,/未回答または選択数不足/);assert.deepEqual(await state(p),before);
    await sentinelCheck(p);checks.push('cancel unfilled-paper grading preserves active attempt and no score');await c.close();
  }
  // Switching the selected year does not itself interrupt the old attempt.
  // Starting another year archives the previous draft with its own stable attempt ID.
  {
    const c=await context();await seed(c,baseline);const p=await c.newPage();await p.goto(url);await start(p,2023);
    const q=await p.evaluate(()=>window.EXAM_DATA[2023].find(q=>q.type==='text'));
    await p.locator(`[id="a-${q.id}"]`).fill('year-2023-draft');const before=await state(p);
    await p.getByRole('button',{name:'2022',exact:true}).click();
    assert.equal((await state(p)).currentAttempt.id,before.currentAttempt.id);
    await p.getByRole('button',{name:'2023',exact:true}).click();assert.equal(await p.locator(`[id="a-${q.id}"]`).inputValue(),'year-2023-draft');
    await start(p,2022);
    const after=await state(p),archived=after.attempts.find(a=>a.id===before.currentAttempt.id);
    assert.equal(archived.status,'interrupted');assert.equal(archived.answers[`2023:${q.id}`],'year-2023-draft');
    assert.equal(after.currentAttempt.year,2022);assert.notEqual(after.currentAttempt.id,archived.id);
    assert.deepEqual(after.attempts.filter(a=>a.id!==archived.id),baseline.attempts,'first graded records must survive year switch');
    await p.reload();await p.getByRole('button',{name:'2022年度の続きへ',exact:true}).click();
    assert.equal((await state(p)).currentAttempt.id,after.currentAttempt.id);
    await snapshot(p,'boundary-year-switch');await sentinelCheck(p);
    checks.push('year selection round-trip and new-year start archive old answers; first score preserved');await c.close();
  }
  // A next-day retention state cannot start early, then needs two actual UI answers.
  {
    const c=await context(),fixture=clone(baseline);
    const weakKey=Object.keys(fixture.weak).find(k=>fixture.weak[k].skill==='pronunciation');assert.ok(weakKey);
    const weak={...fixture.weak[weakKey],status:'pending',streak:3,confirmStreak:0,next:'2026-10-02',reservedConfirm:[]};
    fixture.weak={[weakKey]:weak};fixture.currentDrill=null;fixture.currentSkill=null;fixture.dailyPlan=null;fixture.dailyProgress=null;
    await seed(c,fixture);const p=await c.newPage();await freeze(p);await p.goto(url);
    await p.locator('nav button[data-v="review"]').click();
    assert.equal(await p.getByRole('button',{name:'2026-10-02 まで待つ',exact:true}).isEnabled(),false);
    await p.clock.fastForward(4000);
    await p.locator('section.wrong').getByRole('button',{name:/定着チェック/}).click();
    assert.equal((await state(p)).currentDrill.mode,'confirm');
    const id1=await answerChoice(p);assert.equal((await state(p)).weak[weakKey].status,'pending');
    await p.locator('.drill-next button.primary').click();const id2=await answerChoice(p);assert.notEqual(id1,id2);
    const done=await state(p);assert.equal(done.weak[weakKey].status,'mastered');assert.equal(done.weak[weakKey].confirmStreak,2);
    assert.equal(done.drillLog.length,baseline.drillLog.length+2);
    assert.deepEqual(done.attempts,baseline.attempts);assert.deepEqual(done.drillLog.slice(0,baseline.drillLog.length),baseline.drillLog);
    await snapshot(p,'boundary-next-day-confirmed');await sentinelCheck(p);
    checks.push('pending blocked before day; next-day two distinct answers -> mastered; history preserved (synthetic clock)');await c.close();
  }
  // Midnight must not replace the question or draft currently being answered.
  {
    const c=await context(),fixture=clone(baseline);const p=await c.newPage();await freeze(p);await seed(c,fixture);await p.goto(url);
    await p.locator('nav button[data-v="review"]').click();
    const target=p.locator('section.wrong').filter({hasText:'英文定義'}).first();
    await target.locator('button').filter({hasText:/克服ドリル|追加練習/}).click();
    assert.equal((await state(p)).currentDrill.q.type,'text');await p.locator('#drillText').fill('before-midnight-draft');
    const before=await state(p);await p.clock.fastForward(4000);
    assert.equal(await p.locator('#drillText').inputValue(),'before-midnight-draft');
    assert.deepEqual((await state(p)).currentDrill,before.currentDrill);
    await p.getByRole('button',{name:'答える',exact:true}).click();
    const after=await state(p);assert.equal(after.dailyProgress.date,'2026-10-02');
    assert.equal(after.drillLog.at(-1).at.slice(0,10),'2026-10-02');assert.deepEqual(after.attempts,baseline.attempts);
    await snapshot(p,'boundary-midnight-answer');await sentinelCheck(p);
    checks.push('midnight keeps active draft; post-midnight answer counts on new day without changing first scores');await c.close();
  }
  // Reproduce live expiry, not merely reload an already-expired fixture.
  {
    const c=await context(),p=await c.newPage();await p.clock.install({time:new Date('2026-10-03T12:00:00Z')});
    await p.clock.pauseAt(new Date('2026-10-03T12:00:01Z'));await p.goto(url);await start(p,2024,true);
    const row=p.locator('[id="answer-2024-3-1"]');const buttons=row.locator('.answer-kana');
    await buttons.first().click();
    await p.locator('[id="a-3-4-1"]').fill('before-deadline');
    await p.locator('input[id^="m-"]').first().fill('1');
    const before=await state(p);
    await p.clock.fastForward(600001);
    const expired=await state(p);assert.equal(expired.currentAttempt.overtime,true);
    const remainedEnabled=await buttons.nth(1).isEnabled();
    // If a bug leaves the control enabled, attempt the forbidden UI edit to prove its impact.
    if(remainedEnabled)await buttons.nth(1).click();
    await snapshot(p,'boundary-live-expiry');
    assert.deepEqual((await state(p)).answers,before.answers,'live deadline must prevent later answers from replacing saved answers');
    assert.equal(remainedEnabled,false,'objective controls must disable at live expiry');
    assert.equal(await p.locator('[id="a-3-4-1"]').isEnabled(),false,'text input also locks');
    assert.deepEqual((await state(p)).manual,before.manual,'redraw must preserve self-marking draft');
    assert.equal(await p.locator('input[id^="m-"]').first().isEnabled(),true,'manual marking remains available');
    await p.reload();await p.getByRole('button',{name:'2024年度の続きへ',exact:true}).click();
    assert.equal(await row.locator('.answer-kana').first().isEnabled(),false);
    await sentinelCheck(p);checks.push('live timed expiry locks objective input; self-marking stays available; reload retains lock');await c.close();
  }
  // G2 repair: actual source error -> relevant training -> later, distinct confirmation.
  let newCycleStart,sourceScore;
  {
    const c=await context(),p=await c.newPage();await freeze(p);await p.goto(url);await start(p,2022);await fillCorrect(p,2022);
    await p.locator('[id="answer-2022-6-2"] .answer-kana').filter({hasText:/^ア$/}).click();
    await p.getByRole('button',{name:'採点して弱点分析',exact:true}).click();
    sourceScore=clone((await state(p)).attempts);assert.equal(sourceScore.at(-1).writtenScore,77);
    await p.locator('nav button[data-v="review"]').click();
    await p.locator('section.wrong').getByRole('button',{name:/克服ドリル|追加練習/}).click();
    newCycleStart=await state(p);const ids=[];
    for(let n=0;n<3;n++){
      const before=await state(p);assert.equal(before.currentDrill.q.skill,'connector');
      await p.reload();await p.getByRole('button',{name:'途中の1問を再開',exact:true}).click();
      const restored=await state(p);assert.deepEqual(restored.currentDrill.choiceOrder,before.currentDrill.choiceOrder);
      assert.deepEqual(restored.weak['2022:6-2:main'].reservedConfirm,['lco28','lco26']);
      ids.push(await answerChoice(p));
      if(n===1){
        await p.locator('#drillFeedback details').first().locator('summary').click();
        assert.match(await p.locator('#drillFeedback').innerText(),/白紙のページ/);
        await snapshot(p,'g2-connector-example-translation');
      }
      if(n<2)await p.locator('.drill-next button.primary').click();
    }
    assert.deepEqual(ids,['lco21','lco23','lco27']);
    const pending=await state(p);assert.equal(pending.weak['2022:6-2:main'].status,'pending');
    assert.deepEqual(pending.attempts,sourceScore);
    await p.clock.fastForward(4000);await p.locator('nav button[data-v="review"]').click();
    await p.locator('section.wrong').getByRole('button',{name:/定着チェック/}).click();
    assert.equal((await state(p)).currentDrill.q.id,'lco26');ids.push(await answerChoice(p));
    await p.locator('.drill-next button.primary').click();
    assert.equal((await state(p)).currentDrill.q.id,'lco28');
    await p.reload();await p.getByRole('button',{name:'途中の1問を再開',exact:true}).click();ids.push(await answerChoice(p));
    const done=await state(p);assert.equal(done.weak['2022:6-2:main'].status,'mastered');
    assert.equal(new Set(ids).size,5);assert.deepEqual(done.attempts,sourceScore);
    await snapshot(p,'g2-connector-next-day-confirmed');await sentinelCheck(p);
    checks.push('2022 connector error -> connector training 3 incl example -> reload -> next-day distinct example/restatement 2; first score preserved');await c.close();
  }
  // Previously started cycles must keep their old question, order and reservations.
  {
    const fixture=clone(newCycleStart),wk='2022:6-2:main';
    const c=await context(),p=await c.newPage();await freeze(p);await p.goto(url);
    const old=await p.evaluate(()=>window.DRILLS.find(q=>q.id==='rdt_cx01'));
    await c.close();
    fixture.weak[wk].reservedConfirm=['rdt_cx03','rdt_cx04'];fixture.weak[wk].seenDrills=['rdt_cx01'];fixture.weak[wk].lastDrillId='rdt_cx01';
    fixture.currentDrill.q=old;fixture.currentDrill.used=['rdt_cx01'];fixture.currentDrill.choiceOrder=[2,0,1,3];
    const legacy=await context();await seed(legacy,fixture);const page=await legacy.newPage();await freeze(page);await page.goto(url);
    const restored=await state(page);assert.deepEqual(restored.currentDrill,fixture.currentDrill);
    assert.deepEqual(restored.weak[wk].reservedConfirm,fixture.weak[wk].reservedConfirm);
    await page.getByRole('button',{name:'途中の1問を再開',exact:true}).click();assert.equal(await answerChoice(page),'rdt_cx01');
    await page.locator('.drill-next button.primary').click();assert.equal((await state(page)).currentDrill.q.id,'rdt_cx02');
    await page.reload();await page.getByRole('button',{name:'途中の1問を再開',exact:true}).click();await answerChoice(page);
    await page.locator('.drill-next button.primary').click();assert.equal(await answerChoice(page),'rdt_cx05');
    assert.deepEqual((await state(page)).weak[wk].reservedConfirm,['rdt_cx03','rdt_cx04']);
    await page.clock.fastForward(4000);await page.locator('nav button[data-v="review"]').click();
    await page.locator('section.wrong').getByRole('button',{name:/定着チェック/}).click();
    assert.equal(await answerChoice(page),'rdt_cx03');await page.locator('.drill-next button.primary').click();assert.equal(await answerChoice(page),'rdt_cx04');
    assert.deepEqual((await state(page)).attempts,sourceScore);await sentinelCheck(page);
    checks.push('legacy in-progress connector source keeps old question/order, old training and next-day reservations without rewriting first score');await legacy.close();
  }
  // Release gate: new official guides are visible through the real exam controls.
  {
    const c=await context(),p=await c.newPage();await p.goto(url);
    for(const y of [2019,2020,2021,2022,2023,2024,2025,2026]){
      await start(p,y);const guides=p.locator('.official-guide');assert.equal(await guides.count(),2);
      for(let i=0;i<2;i++){await guides.nth(i).locator('summary').click();assert.ok((await guides.nth(i).locator('.official-answer').innerText()).length>20);}
      if(y===2023)assert.match(await p.locator('[id="a-5-5"]').getAttribute('placeholder'),/2語/);
      if(y===2021)assert.match(await guides.nth(1).innerText(),/\(1\)\(4\)で3点/);
      if(y===2025)await snapshot(p,'release-official-guides-2025');
    }
    await sentinelCheck(p);checks.push('all 16 manual guides visible in eight yearly exams; 2021 nonadjacent partial-credit grouping');await c.close();
  }
  {
    const c=await context(),p=await c.newPage();await p.goto(url);await start(p);
    const good={score:24,maxScore:24,semantic:[1,1,1,1,0,0],breakdown:[],issues:[],strengths:[],reasons:[]};
    let pendingRoute,seen;
    const intercepted=()=>new Promise(resolve=>{seen=resolve});
    await p.route('**/v1/grade-writing',route=>{h.blocked.push({url:route.request().url(),method:'POST',mocked:true});pendingRoute=route;seen();});
    const input=p.locator('[id="ai-answer-2024-4"]'),button=p.locator('[id="ai-grade-2024-4"]');
    await input.fill('Original submitted answer.');await p.locator('[id="m-4"]').fill('11');
    let request=intercepted();await button.click();await request;
    await input.fill('Edited while waiting.');
    await pendingRoute.fulfill({status:200,contentType:'application/json',body:JSON.stringify(good)});
    await p.locator('.ai-stale').waitFor();
    assert.equal(await input.inputValue(),'Edited while waiting.');assert.equal(await p.getByRole('button',{name:'この点数を自己採点欄に反映',exact:true}).isEnabled(),false);
    await p.reload();await p.getByRole('button',{name:'2024年度の続きへ',exact:true}).click();
    assert.equal(await input.inputValue(),'Edited while waiting.');assert.equal((await state(p)).manual['2024:4'].score,11);
    await snapshot(p,'release-ai-late-edited-draft');checks.push('delayed mock AI response retains edited answer and score across reload; stale grade cannot apply');
    // A heuristic promotion must never be displayed or applied as a reliable grade.
    request=intercepted();await button.click();await request;
    await pendingRoute.fulfill({status:200,contentType:'application/json',body:JSON.stringify({...good,localAdjustments:[{index:2,from:0,to:1}]})});
    await p.getByText('AI評価は要確認です。',{exact:true}).waitFor();
    assert.equal(await p.getByRole('button',{name:'この点数を自己採点欄に反映',exact:true}).count(),0);
    assert.equal((await state(p)).manual['2024:4'].score,11);
    await snapshot(p,'release-ai-review-required');checks.push('mock heuristic-promoted AI result withheld from numeric display/application');
    // Invalid payload and local timeout protect the same draft and manual score.
    request=intercepted();await button.click();await request;
    await pendingRoute.fulfill({status:200,contentType:'application/json',body:'{"invalid":true}'});
    await p.locator('[id="ai-status-2024-4"]').filter({hasText:'安全に確認'}).waitFor();
    await p.clock.install();await p.clock.pauseAt(new Date());
    request=intercepted();await button.click();await request;
    await p.clock.fastForward(30001);
    await p.locator('[id="ai-status-2024-4"]').filter({hasText:'時間内'}).waitFor();
    assert.equal(await button.isEnabled(),true);assert.equal(await input.inputValue(),'Edited while waiting.');
    assert.equal((await state(p)).manual['2024:4'].score,11);
    await snapshot(p,'release-ai-timeout');await sentinelCheck(p);
    checks.push('malformed mock response and 30-second timeout retain draft/self-score and allow retry');await c.close();
  }
  for(const [year,id] of [[2021,'6-4'],[2023,'6-2']]){
    const c=await context(),p=await c.newPage();await p.goto(url);await start(p,year);await fillCorrect(p,year);
    const q=await p.evaluate(({year,id})=>window.EXAM_DATA[year].find(q=>q.id===id),{year,id});
    const wrong=['ア','イ','ウ','エ'].find(a=>a!==q.answer);
    await p.locator(`[id="answer-${year}-${id}"]`).getByRole('button',{name:wrong,exact:true}).click();
    await p.getByRole('button',{name:'採点して弱点分析',exact:true}).click();
    await p.locator('nav button[data-v="review"]').click();
    await p.locator('section.wrong').getByRole('button',{name:/克服ドリル|追加練習/}).click();
    assert.equal((await state(p)).currentDrill.q.skill,'connector');await sentinelCheck(p);
    checks.push(`${year}:${id} connector source error opens connector remediation`);await c.close();
  }

  {
    const c=await context(),wk='2025:4:main';
    const fixture={schemaVersion:8,goal:60,year:2025,weak:{[wk]:{year:2025,id:'4',label:'人工',status:'active',priority:'A',skill:'rebuttal',streak:0}},currentSkill:wk,currentDrill:{key:wk,skill:'rebuttal',mode:'train',q:{id:'lrb13'},answered:false,selfText:'',selfParts:[],selfChecks:[],used:['lrb13']}};
    await seed(c,fixture);const p=await c.newPage();await p.goto(url);await p.getByRole('button',{name:'途中の1問を再開',exact:true}).click();
    await p.locator('#selfText').fill(Array(51).fill('word').join(' '));
    assert.match(await p.locator('#wordCount').innerText(),/約50語/);
    await p.getByRole('button',{name:'セルフチェックへ',exact:true}).click();
    assert.equal((await state(p)).currentDrill.selfcheck,true,'about 50 does not reject 51 as a hard limit');
    await snapshot(p,'release-approximate-word-rule');await sentinelCheck(p);
    checks.push('approximate writing instruction displays about 50 and allows 51-word draft into self-check');await c.close();
  }

}
