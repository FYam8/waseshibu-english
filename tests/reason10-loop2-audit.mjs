
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m=>m[1]);
const ctx = { window: { DRILLS: [] }, console };
ctx.global = ctx;
vm.createContext(ctx);
for (const src of scripts) {
  if (src === 'app.js') continue;
  if (!src.endsWith('.js')) continue;
  if (!fs.existsSync(path.join(root, src))) continue;
  const code = fs.readFileSync(path.join(root, src), 'utf8');
  vm.runInContext(code, ctx, { filename: src });
}
const drills = ctx.window.DRILLS || [];
const active = drills.filter(q=>!q.retired);
const retired = drills.filter(q=>q.retired);
function assert(cond, msg){ if(!cond){ console.error('FAIL:', msg); process.exit(1); } }
const reasonActive = active.filter(q=>q.skill==='reason');
assert(active.length === 283, `active count expected 283 got ${active.length}`);
assert(reasonActive.length === 10, `active reason expected 10 got ${reasonActive.length}`);
const retiredExpected = ['lrs01','lrs02','lrs04','lrs05','lrs06','lrs08'];
for (const id of retiredExpected) {
  const q = drills.find(x=>x.id===id);
  assert(q && q.retired && q.legacyCompletion, `${id} should be non-destructively retired`);
}
const added = ['lrs11','lrs12','lrs13','lrs14'];
for (const id of added) {
  const q = active.find(x=>x.id===id);
  assert(q, `${id} missing from active`);
  assert(q.skill === 'reason', `${id} skill mismatch`);
  assert(q.type === 'choice', `${id} type mismatch`);
  assert(Array.isArray(q.options) && q.options.length === 4, `${id} options not 4`);
  assert(Number.isInteger(q.answer) && q.answer >=0 && q.answer < 4, `${id} answer invalid`);
  for (const label of ['【正解】','【設問和訳】','【根拠英文】','【根拠英文和訳】','【なぜ正解か】','【他選択肢】','【弱点】','【戦略】']) {
    assert((q.explanation || '').includes(label), `${id} missing explanation label ${label}`);
  }
  assert(!/(because|so that|in order to)\s/i.test(q.prompt), `${id} prompt should not make reason direct with reason marker`);
}
const retained = ['lrs03','lrs07','lrs09','lrs10'];
for (const id of retained) assert(active.some(q=>q.id===id), `${id} should remain active`);
console.log('reason10-loop2-audit PASS', JSON.stringify({
  active: active.length,
  retired: retired.length,
  reasonActive: reasonActive.map(q=>q.id)
}));
