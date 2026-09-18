import fs from 'node:fs';
import assert from 'node:assert/strict';

const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const app=read('app.js'),index=read('index.html');

for(const [helper,component] of [
  ['uiMetricCard','metricCard'],
  ['uiProgressBar','progressBar']
]){
  assert.ok(app.includes('function '+helper+'('),helper+' wrapper missing');
  assert.ok(app.includes('SHARED_UI_COMPONENTS?.'+component),helper+' must delegate to shared component');
}
assert.match(app,/function uiMetricCard[\s\S]*?<div class=card><div class=metric>/,'metric fallback changed');
assert.match(app,/function uiProgressBar[\s\S]*?<div class=progress><span style="width:/,'progress fallback changed');

assert.ok(app.includes('uiMetricCard(last?'),'home metric cards not delegated');
assert.ok(app.includes('uiMetricCard(a.length,"A未克服")'),'stats metric cards not delegated');
assert.ok(app.includes('uiProgressBar(streak,target)'),'drill progress bar not delegated');

const compPos=index.indexOf('<script src="ui/components.js"></script>');
const appPos=index.indexOf('<script src="app.js"></script>');
assert.ok(compPos>=0&&appPos>=0&&compPos<appPos,'Shared UI components must load before app.js');

console.log('Waseda Shared UI primitive runtime delegation: CLEAN');
