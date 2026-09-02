
import fs from 'fs';
import vm from 'vm';
import path from 'path';
import assert from 'assert';

const root = path.resolve('.');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1]);

const ctx = {
  window: {},
  console,
  localStorage: { getItem(){return null}, setItem(){}, removeItem(){} },
  document: {
    addEventListener(){},
    querySelector(){return null},
    querySelectorAll(){return []},
    getElementById(){return null},
    body: {},
    documentElement: {}
  }
};
ctx.global = ctx;
ctx.window.window = ctx.window;
ctx.window.console = console;
ctx.window.localStorage = ctx.localStorage;
vm.createContext(ctx);

for (const s of scripts) {
  const p = path.join(root, s);
  if (!fs.existsSync(p)) continue;
  try { vm.runInContext(fs.readFileSync(p, 'utf8'), ctx, { filename: s }); }
  catch (e) { if (s !== 'app.js') throw e; }
}

const drills = ctx.window.DRILLS || ctx.DRILLS || [];
const active = drills.filter(d => !d.retired);
assert.equal(active.length, 283, 'active drill count must remain 283');

const sound = active.filter(d => ['pronunciation','stress'].includes(d.skill));
assert.equal(sound.length, 30, 'active sound drills must be 30');
assert.equal(sound.filter(d => d.skill === 'pronunciation').length, 16);
assert.equal(sound.filter(d => d.skill === 'stress').length, 14);

const oldIds = ["pr01","pr02","pr03","pr04","pr05","pr06","pr07","pr08","xpr1","xpr2","xpr3","xpr4","xpr5","xpr6","xpr7","xpr8","st01","st02","st03","st04","st05","st06","xst1","xst2","xst3","xst4","xst5","xst6","xst7","xst8"];
assert.equal(active.filter(d => oldIds.includes(d.id)).length, 0, 'old sound drills must be retired');

for (const d of sound) {
  assert.ok(d.id.startsWith('lpr') || d.id.startsWith('lst'));
  assert.ok(d.prompt.includes('【オリジナル類題】'));
  assert.ok(d.explanation.includes('【正解】'));
  assert.ok(d.explanation.includes(d.skill === 'pronunciation' ? '【発音】' : '【強勢位置】'));
  assert.ok(d.explanation.includes('【他選択肢との差】'));
  assert.ok(d.explanation.includes('【元弱点とのつながり】'));
  assert.ok(d.explanation.includes('【戦略】'));
  assert.ok(Number.isInteger(d.answer) && d.answer >= 0 && d.answer < 4);
}

const pronDist = sound.filter(d=>d.skill==='pronunciation').reduce((m,d)=>{m[d.answer]=(m[d.answer]||0)+1; return m;}, {});
assert.deepEqual(pronDist, {'0':4,'1':4,'2':4,'3':4}, 'pronunciation answer positions must be balanced 4 each');
const stressDist = sound.filter(d=>d.skill==='stress').reduce((m,d)=>{m[d.answer]=(m[d.answer]||0)+1; return m;}, {});
assert.ok(Object.values(stressDist).every(v => v >= 2), 'stress answer positions must not collapse to one side');

const pairs = new Set(sound.map(d => d.skill + ':' + JSON.stringify(d.options)));
assert.equal(pairs.size, sound.length, 'no duplicate option sets in sound drills');

console.log('sound30-loop2-audit PASS');
