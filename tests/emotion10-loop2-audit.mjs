
import fs from 'fs';
import vm from 'vm';
import path from 'path';

const root = process.cwd();
const idx = fs.readFileSync(path.join(root,'index.html'),'utf8');
const scripts = [...idx.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m=>m[1]).filter(s=>s !== 'app.js');
const window = {};
const context = {window, console};
vm.createContext(context);
for (const s of scripts) {
  vm.runInContext(fs.readFileSync(path.join(root,s),'utf8'), context, {filename:s});
}
const B = window.DRILLS || [];
const active = B.filter(q=>!q.retired);
const retired = B.filter(q=>q.retired);
const oldIds = ["em01","em02","xem1","xem2","xem3","xem4","xem5","xem6","xem7","xem8","lem07"];
const newIds = ["lem01","lem02","lem03","lem04","lem05","lem06","lem08","lem09","lem10","lem11"];
function fail(msg){ console.error(msg); process.exit(1); }
if (active.length !== 283) fail(`active count ${active.length}`);
for (const id of oldIds) {
  const q = B.find(x=>x.id===id);
  if (!q || !q.retired || !q.legacyCompletion) fail(`old emotion not retired safely: ${id}`);
}
for (const id of newIds) {
  const q = B.find(x=>x.id===id);
  if (!q || q.retired) fail(`new emotion missing/retired: ${id}`);
  if (q.skill !== 'emotion') fail(`new emotion wrong skill: ${id} ${q.skill}`);
  if (q.type !== 'choice') fail(`new emotion wrong type: ${id}`);
  if (!q.prompt.includes('【オリジナル類題】')) fail(`not labeled original: ${id}`);
  if (/\bafraid\b|\bproud\b|\bembarrassed\b|\bdisappointed\b|\brelieved\b/i.test(q.prompt)) {
    // Allow if used in options; prompt should avoid direct emotion words.
    fail(`direct emotion word in prompt: ${id}`);
  }
  const labels = ['【正解】','【設問和訳】','【根拠英文】','【根拠英文和訳】','【なぜ正解か】','【他選択肢】','【弱点】','【戦略】'];
  for (const lab of labels) if (!String(q.explanation||'').includes(lab)) fail(`missing ${lab}: ${id}`);
  if (!Array.isArray(q.options) || q.options.length !== 4) fail(`bad options: ${id}`);
}
const emotionActive = active.filter(q=>q.skill === 'emotion');
if (emotionActive.length !== 10) fail(`active emotion ${emotionActive.length}`);
if (emotionActive.some(q=>!newIds.includes(q.id))) fail(`unexpected active emotion ids ${emotionActive.map(q=>q.id).join(',')}`);
console.log('emotion10-loop2-audit PASS', JSON.stringify({active:active.length, retired:retired.length, emotionActive:emotionActive.map(q=>q.id)}));
