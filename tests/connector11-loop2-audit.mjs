
import fs from 'fs';
import vm from 'vm';
import path from 'path';
const root = process.cwd();
const sandbox = { window:{}, console };
sandbox.window = sandbox;
vm.createContext(sandbox);
const html = fs.readFileSync(path.join(root,'index.html'),'utf8');
const scripts = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m=>m[1]).filter(s=>s !== 'app.js');
for (const s of scripts) {
  vm.runInContext(fs.readFileSync(path.join(root,s),'utf8'), sandbox, {filename:s});
}
const drills = sandbox.window.DRILLS || [];
const active = drills.filter(d => !d.retired);
const retired = drills.filter(d => d.retired);
const connectors = active.filter(d => d.skill === 'connector');
const oldIds = new Set(['co01','co02','co03','xco1','xco2','xco3','xco4','xco5','xco6','xco7','xco8']);
const activeOld = active.filter(d => oldIds.has(d.id));
if (active.length !== 283) throw new Error(`active count expected 283, got ${active.length}`);
if (connectors.length !== 11) throw new Error(`active connector expected 11, got ${connectors.length}: ${connectors.map(x=>x.id)}`);
if (activeOld.length) throw new Error(`old connectors still active: ${activeOld.map(x=>x.id)}`);
const expectedIds = ['lco20','lco21','lco22','lco23','lco24','lco25','lco26','lco27','lco28','lco29','lco30'];
for (const id of expectedIds) if (!connectors.some(d=>d.id===id)) throw new Error(`missing ${id}`);
const labels = ['【正解】','【設問和訳】','【根拠英文】','【根拠英文和訳】','【なぜ正解か】','【他選択肢】','【元弱点とのつながり】','【戦略分類】'];
for (const d of connectors) {
  if (d.type !== 'choice') throw new Error(`${d.id} not choice`);
  if (d.targetId !== 'connector-logic') throw new Error(`${d.id} wrong targetId`);
  if (!Array.isArray(d.options) || d.options.length !== 4) throw new Error(`${d.id} options`);
  if (!(Number.isInteger(d.answer) && d.answer >=0 && d.answer < 4)) throw new Error(`${d.id} answer`);
  if (!d.sourceComparison) throw new Error(`${d.id} missing sourceComparison`);
  for (const l of labels) if (!String(d.explanation||'').includes(l)) throw new Error(`${d.id} missing explanation label ${l}`);
  const firstOption = d.options[d.answer];
  if (!String(d.explanation).includes(firstOption.split(' ')[0])) throw new Error(`${d.id} explanation likely missing answer`);
}
const bannedShortPatterns = [
  /^I was tired, ___ I finished the work\./,
  /^He studied hard, ___ he passed the test\./,
  /^Take an umbrella ___ it may rain\./
];
for (const d of connectors) for (const p of bannedShortPatterns) if (p.test(d.prompt)) throw new Error(`${d.id} still old short prompt`);
console.log(JSON.stringify({
  active: active.length,
  retired: retired.length,
  connectorActive: connectors.length,
  connectorIds: connectors.map(d=>d.id)
}, null, 2));
