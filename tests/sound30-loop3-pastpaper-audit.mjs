
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
assert.equal(sound.length, 30, 'active sound drills must remain 30');
assert.equal(sound.filter(d => d.skill === 'pronunciation').length, 16);
assert.equal(sound.filter(d => d.skill === 'stress').length, 14);

for (const id of ['lst01','lst14','lpr03']) {
  assert.ok(!active.some(d => d.id === id), `${id} must be retired after past-paper comparison`);
  assert.ok(drills.some(d => d.id === id && d.retired), `${id} must remain as retired legacy record`);
}
for (const id of ['lpr17','lst15','lst16']) {
  assert.ok(active.some(d => d.id === id), `${id} replacement must be active`);
}

const pastSets = [
  ['continue','passenger','accident','finally'], // 2024 stress
  ['problem','reduce','climate','weather'],     // 2025 stress
  ['gesture','globally','greet','gate'],        // 2025 pronunciation
  ['home','remove','gold','notice']             // 2026 pronunciation
].map(a => a.map(x => x.toLowerCase()).sort().join('|'));

for (const d of sound) {
  const set = d.options.map(x => String(x).toLowerCase()).sort().join('|');
  assert.ok(!pastSets.includes(set), `${d.id} must not reuse a complete past-paper four-word set`);
  assert.ok(d.explanation.includes('【正解】'));
  assert.ok(d.explanation.includes(d.skill === 'pronunciation' ? '【発音】' : '【強勢位置】'));
  assert.ok(d.explanation.includes('【他選択肢との差】'));
  assert.ok(d.explanation.includes('【元弱点とのつながり】'));
  assert.ok(d.explanation.includes('【戦略】'));
}

const pronDist = sound.filter(d=>d.skill==='pronunciation').reduce((m,d)=>{m[d.answer]=(m[d.answer]||0)+1; return m;}, {});
assert.deepEqual(pronDist, {'0':4,'1':4,'2':4,'3':4}, 'pronunciation answer positions must stay balanced 4 each');
const stressDist = sound.filter(d=>d.skill==='stress').reduce((m,d)=>{m[d.answer]=(m[d.answer]||0)+1; return m;}, {});
assert.ok(Object.values(stressDist).every(v => v >= 2), 'stress answer positions must remain dispersed');

console.log('sound30-loop3-pastpaper-audit PASS');
