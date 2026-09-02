
import fs from 'fs';
import path from 'path';
import vm from 'vm';

const root = path.resolve(process.argv[2] || '.');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script\s+src="([^"]+)"/g)].map(m => m[1]);

const context = {
  window: {},
  console,
  localStorage: { getItem(){return null}, setItem(){}, removeItem(){} },
  document: {
    addEventListener(){},
    querySelector(){ return null; },
    querySelectorAll(){ return []; },
    getElementById(){ return null; },
    createElement(){ return { style:{}, classList:{add(){},remove(){}}, appendChild(){}, setAttribute(){}, addEventListener(){}, innerHTML:'' }; },
    body: { appendChild(){} }
  },
  location: {},
  navigator: {},
  setTimeout(){},
  clearTimeout(){}
};
context.window = context.window;
context.window.DRILLS = [];
context.global = context.window;
vm.createContext(context);

for (const s of scripts) {
  const p = path.join(root, s);
  if (!fs.existsSync(p)) continue;
  try { vm.runInContext(fs.readFileSync(p, 'utf8'), context, {filename:s}); }
  catch (e) { if (s !== 'app.js') throw e; }
}

const drills = context.window.DRILLS || [];
const ids = [
"rdt_cx01","rdt_cx02","rdt_cx03","rdt_cx04","rdt_cx05",
"rdt_ci02","rdt_ci03",
"rdt_in01","rdt_in02","rdt_in03","rdt_in04","rdt_in05",
"nd04","nd05","nd08","nd10"
];

const bad = [];
const banned = [
  '本文中の該当箇所を確認し',
  '根拠箇所の意味を日本語で確認し',
  '本文の条件・原因・結果・指示関係と矛盾しないため',
  '本文にない情報、逆の内容、または根拠範囲から外れる内容を含む'
];
for (const id of ids) {
  const q = drills.find(x => x.id === id && !x.retired);
  if (!q) bad.push(`${id}: missing active item`);
  const e = String(q?.explanation || '');
  for (const label of ['【正解】','【設問和訳】','【根拠英文】','【根拠英文和訳】','【なぜ正解か】','【他選択肢が違う理由】','【元弱点とのつながり】','【戦略】']) {
    if (!e.includes(label)) bad.push(`${id}: missing ${label}`);
  }
  for (const b of banned) {
    if (e.includes(b)) bad.push(`${id}: contains placeholder ${b}`);
  }
}

const active = drills.filter(x => !x.retired).length;
if (active !== 283) bad.push(`active count ${active} != 283`);

if (bad.length) {
  console.error(bad.join('\n'));
  process.exit(1);
}
console.log('detail placeholder strict audit CLEAN');
