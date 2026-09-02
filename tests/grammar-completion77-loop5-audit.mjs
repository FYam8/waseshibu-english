
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const html = fs.readFileSync(path.join(root,'index.html'),'utf8');
const scripts = [...html.matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]);
const ctx = {
  console, window:null,
  document:{getElementById(){return{}},querySelector(){return{}},querySelectorAll(){return[]},createElement(){return{}},addEventListener(){},body:{}},
  localStorage:{getItem(){return null},setItem(){},removeItem(){},key(){return null},length:0},
  navigator:{}, location:{hash:''}, addEventListener(){}, removeEventListener(){}, setTimeout(){}, clearTimeout(){}
};
ctx.window=ctx; vm.createContext(ctx);
for (const s of scripts){
  const p=path.join(root,s);
  if(fs.existsSync(p)) vm.runInContext(fs.readFileSync(p,'utf8'),ctx,{filename:s});
}
const drills = ctx.DRILLS || [];
const active = drills.filter(d=>!d.retired && d.active!==false);
const retired = drills.filter(d=>d.retired || d.active===false);
function assert(cond,msg){ if(!cond){ console.error(msg); process.exit(1); } }
const bySkill = {};
for (const d of active) bySkill[d.skill]=(bySkill[d.skill]||[]).concat(d);

assert(active.length===283, `active count ${active.length}`);
assert((bySkill.reorder||[]).length===47, 'reorder not 47');
assert((bySkill.sentence_completion||[]).length===16, 'sentence_completion not 16');
assert((bySkill.writing_completion||[]).length===14, 'writing_completion not 14');

const numbered = (bySkill.reorder||[]).filter(d=>d.examFormat==='numbered_blanks_2026');
assert(numbered.length===10, `2026 numbered reorder count ${numbered.length}`);
const firsts = numbered.map(d=>d.answer?.[0]);
assert(!firsts.every(x=>x===0), '2026 numbered first answer all 0');
assert(firsts.filter(x=>x===0).length===0, '2026 numbered first answer still includes all old ア pattern');
assert(new Set(firsts).size>=3, `2026 numbered first answer not diverse: ${firsts.join(',')}`);
const pairs = numbered.map(d=>(d.answer||[]).join('-'));
assert(new Set(pairs).size>=6, `2026 numbered pair answer not diverse: ${pairs.join(',')}`);
for (const d of numbered){
  assert(d.prompt.includes('(1)') && d.prompt.includes('(2)'), `${d.id} numbered prompt missing`);
  assert(d.explanation.includes('【指定位置】') && d.explanation.includes('(1)：') && d.explanation.includes('(2)：'), `${d.id} numbered explanation missing`);
  assert(Array.isArray(d.answer) && d.answer.length===2, `${d.id} answer not pair`);
  assert(d.answer.every(i=>Number.isInteger(i) && i>=0 && i<(d.tokens||[]).length), `${d.id} answer index out of range`);
}
const rc = active.find(d=>d.id==='nr_rc1');
assert(rc && rc.lead.includes('who') && rc.explanation.includes('a woman'), 'nr_rc1 not corrected');
const cp = active.find(d=>d.id==='nr_cp1');
assert(cp && cp.explanation.includes('better at speaking'), 'nr_cp1 not corrected');

const retiredWriting = ['lwc32','lwc34','lwc35','lwc36','lwc38','lwc42'];
for (const id of retiredWriting){
  const d=drills.find(x=>x.id===id);
  assert(d && (d.retired || d.active===false), `${id} not retired`);
}
const writing = bySkill.writing_completion||[];
for (let i=43;i<=48;i++) assert(writing.some(d=>d.id===`lwc${i}`), `lwc${i} missing`);
for (const d of writing){
  assert(Array.isArray(d.partLimits) && d.partLimits.length===2, `${d.id} partLimits missing`);
  assert((d.partLimits[0]===5 && d.partLimits[1]===15) || (d.partLimits[0]===10 && d.partLimits[1]===10), `${d.id} limits not 2020/2021 type`);
  const wc = (d.prompt.match(/\b[A-Za-z][A-Za-z'-]*\b/g)||[]).length;
  assert(wc>=95, `${d.id} passage too short-ish: ${wc}`);
  for(const label of ['【語数】','【設問条件】','【最小限答案例】','【高得点答案例】','【合格戦略】','【過去問比較】']){
    assert(d.explanation.includes(label), `${d.id} missing ${label}`);
  }
}
assert(retired.length>=282, `retired low ${retired.length}`);
console.log('grammar-completion77-loop5-audit PASS', {active:active.length, retired:retired.length, firsts, pairs, writing:writing.map(d=>d.id)});
