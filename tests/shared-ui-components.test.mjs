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
