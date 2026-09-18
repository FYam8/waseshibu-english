import fs from 'node:fs';
import assert from 'node:assert/strict';

const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const app=read('app.js'),index=read('index.html');

for(const [helper,component] of [
  ['uiMetricCard','metricCard'],
  ['uiProgressBar','progressBar'],
  ['uiCompletionMark','completionMark'],
  ['uiRouteStepCard','routeStepCard'],
  ['uiTodayCard','todayCard'],
  ['uiWeaknessCard','weaknessCard'],
  ['uiDrillCard','drillCard'],
  ['uiAttemptBar','attemptBar'],
  ['uiAnswerPanel','answerPanel'],
  ['uiPaperPage','paperPage'],
  ['uiBackupPanel','backupPanel']
]){
  assert.ok(app.includes('function '+helper+'('),helper+' wrapper missing');
  assert.ok(app.includes('SHARED_UI_COMPONENTS?.'+component),helper+' must delegate to shared component');
}
assert.match(app,/function uiMetricCard[\s\S]*?<div class=card><div class=metric>/,'metric fallback changed');
assert.match(app,/function uiProgressBar[\s\S]*?<div class=progress><span style="width:/,'progress fallback changed');

assert.ok(app.includes('uiMetricCard(last?'),'home metric cards not delegated');
assert.ok(app.includes('uiMetricCard(a.length,"A未克服")'),'stats metric cards not delegated');
assert.ok(app.includes('uiProgressBar(streak,target)'),'drill progress bar not delegated');
assert.ok(app.includes('uiCompletionMark(`✓ ${h(action.label)}`)'),'Today completion marker not delegated');
assert.ok(app.includes('uiCompletionMark(`✓ 今日の目安${DAILY_TASK_TARGET}問を達成`)'),'review completion marker not delegated');
assert.ok(app.includes('uiRouteStepCard({index:i+1'),'route cards not delegated');
assert.ok(app.includes('uiTodayCard({complete:action.complete,contentHtml:todayContent})'),'Today frame not delegated');
assert.ok(app.includes('uiWeaknessCard({assigned:isAssigned,contentHtml})'),'weakness frame not delegated');
assert.ok(app.includes('return uiDrillCard(contentHtml);'),'drill frame not delegated');
assert.ok(app.includes('uiAttemptBar({compact:S.examInfoCompact'),'attempt bar not delegated');
assert.ok(app.includes('uiAnswerPanel({open:S.answerSheetOpen'),'answer panel not delegated');
assert.ok(app.includes('uiPaperPage({year:y,label,bodyHtml:formatted.html})'),'paper pages not delegated');
assert.ok(app.includes('uiBackupPanel("この端末では、アプリを更新しても学習履歴を自動で引き継ぎます。'),'backup panel not delegated');

const compPos=index.indexOf('<script src="ui/components.js"></script>');
const appPos=index.indexOf('<script src="app.js"></script>');
assert.ok(compPos>=0&&appPos>=0&&compPos<appPos,'Shared UI components must load before app.js');

console.log('Waseda Shared UI primitive runtime delegation: CLEAN');
