import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const ctx={};ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);vm.runInContext(read('ui/components.js'),ctx,{filename:'ui/components.js'});
const ui=ctx.ENGLISH_UI_COMPONENTS;

assert.equal(ui.metricCard('72/80','2024年度の筆記得点'),'<div class=card><div class=metric>72/80</div><div class=muted>2024年度の筆記得点</div></div>');
assert.equal(ui.metricCard('--','過去問未実施'),'<div class=card><div class=metric>--</div><div class=muted>過去問未実施</div></div>');
assert.equal(ui.progressBar(2,3),'<div class=progress><span style="width:66.66666666666666%"></span></div>');
assert.equal(ui.progressBar(5,3),'<div class=progress><span style="width:100%"></span></div>');
assert.equal(ui.completionMark('✓ 今日の目安10問を達成'),'<span class=completion-mark>✓ 今日の目安10問を達成</span>');

const route=ui.routeStepCard({
  index:2,title:'2023年度',role:'弱点補強',status:'未着手',
  description:'現在の弱点に対応する実際の過去問を使います。',
  recommendationsHtml:'<div class=route-recs>R</div>',
  detailHtml:'<p class=tiny>D</p>',
  actionHtml:'<button>年度を開く</button>'
});
assert.equal(route,'<article class="card route-step "><div class=route-number>2</div><div class=route-main><div class="row space"><div><h3>2023年度</h3><b>弱点補強</b></div><span class="status-pill">未着手</span></div><p>現在の弱点に対応する実際の過去問を使います。</p><div class=route-recs>R</div><p class=tiny>D</p><button>年度を開く</button></div></article>');
assert.match(ui.routeStepCard({index:1,title:'x',role:'y',status:'z',description:'d',protectedCard:true}),/class="card route-step protected"/);
assert.equal(ui.todayCard({complete:false,contentHtml:'<b>T</b>'}),'<section class="card hero today-card "><b>T</b></section>');
assert.equal(ui.todayCard({complete:true,contentHtml:'X'}),'<section class="card hero today-card today-complete">X</section>');
assert.equal(ui.weaknessCard({assigned:false,contentHtml:'W'}),'<section class="card wrong ">W</section>');
assert.equal(ui.weaknessCard({assigned:true,contentHtml:'W'}),'<section class="card wrong today-assigned">W</section>');
assert.equal(ui.drillCard({contentHtml:'D'}),'<section class="card drill-card">D</section>');
assert.equal(ui.attemptBar({summaryHtml:'S',timerHtml:'T',actionsHtml:'A'}),'<section class="attempt-bar ">STA</section>');
assert.equal(ui.attemptBar({compact:true,summaryHtml:'S'}),'<section class="attempt-bar attempt-compact">S</section>');
assert.equal(ui.answerPanel({open:true,expanded:false,headerHtml:'H',bodyHtml:'B'}),'<aside id=answerPanel class="card answerpanel sheet-open ">HB</aside>');
assert.equal(ui.answerPanel({open:false,expanded:true,headerHtml:'H',bodyHtml:'B'}),'<aside id=answerPanel class="card answerpanel sheet-collapsed sheet-expanded">HB</aside>');
assert.equal(ui.paperPage({year:2024,label:'大問 3',bodyHtml:'<p>X</p>'}),'<article class=paper-page><div class=page-label><b>2024年度</b><span>大問 3</span></div><div class=paper-text><p>X</p></div></article>');

const backup=ui.backupPanel({
  description:'この端末では、アプリを更新しても学習履歴を自動で引き継ぎます。',
  exportOnclick:'exportData()',
  importOnchange:'importData(this)'
});
assert.match(backup,/^<section class=backup-box>/);
assert.match(backup,/id=importMode/);
assert.match(backup,/value=merge>現在データへ統合/);
assert.match(backup,/value=replace>現在データと置換/);
assert.match(backup,/accept="application\/json,\.json"/);

for(const file of ['ui/components.js']){
  assert.doesNotMatch(read(file),/waseshibu|rikkyo|早稲|立教|fyam8|workers\.dev/i,file+' leaks school/provider identity');
}
assert.equal(ui.metricCard('<x>','A&B'),'<div class=card><div class=metric>&lt;x&gt;</div><div class=muted>A&amp;B</div></div>');

console.log('Shared English UI primitive components: CLEAN');
