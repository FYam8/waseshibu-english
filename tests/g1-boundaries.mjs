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
    await buttons.first().click();const before=await state(p);
    await p.clock.fastForward(600001);
    const expired=await state(p);assert.equal(expired.currentAttempt.overtime,true);
    const remainedEnabled=await buttons.nth(1).isEnabled();
    // If a bug leaves the control enabled, attempt the forbidden UI edit to prove its impact.
    if(remainedEnabled)await buttons.nth(1).click();
    await snapshot(p,'boundary-live-expiry');
    assert.deepEqual((await state(p)).answers,before.answers,'live deadline must prevent later answers from replacing saved answers');
    assert.equal(remainedEnabled,false,'objective controls must disable at live expiry');
    assert.equal(await p.locator('input[id^="m-"]').first().isEnabled(),true,'manual marking remains available');
    await p.reload();await p.getByRole('button',{name:'2024年度の続きへ',exact:true}).click();
    assert.equal(await row.locator('.answer-kana').first().isEnabled(),false);
    await sentinelCheck(p);checks.push('live timed expiry locks objective input; self-marking stays available; reload retains lock');await c.close();
  }
}
