
import fs from 'fs';
global.window={DRILLS:[]}; window.PAST_PAPERS=[]; window.PAST_PAPER_ANSWERS={};
const scripts=["data.js","paper-underlines.js","manual-guides.js","extra-drills.js","detail-drills-v2.js","learning-model.js","original-drills-loop3.js","original-drills-loop4.js","detail20-fix-loop1.js","rebuttal16-loop2.js","rebuttal16-loop3-afterturn.js","summary15-loop2.js","summary15-loop4.js","reason10-loop2.js","reason10-loop3.js","emotion10-loop2.js","context10-loop2.js","connector11-loop2.js","reading50-loop2.js"];
for(const s of scripts){ Function(fs.readFileSync(s,'utf8')).call(globalThis); }
const active=window.DRILLS.filter(q=>!q.retired);
function assert(cond,msg){if(!cond){throw new Error(msg)}}
const groups={}; for(const q of active){(groups[q.skill] ||= []).push(q);}
assert(active.length===283,`active ${active.length}`);
assert((window.DRILLS.filter(q=>q.retired).length)===176, `retired ${window.DRILLS.filter(q=>q.retired).length}`);
assert(groups.connector?.length===11, `connector ${groups.connector?.length}`);
assert(groups.insertion?.length===14, `insertion ${groups.insertion?.length}`);
assert(groups.content_match?.length===16, `content_match ${groups.content_match?.length}`);
assert(groups.reference?.length===9, `reference ${groups.reference?.length}`);
const activeIds=new Set(active.map(q=>q.id));
for(const id of ["lco04","lco05","lco06","lco07","lco08","lco09","lco10","lco11"]){assert(!activeIds.has(id), id+" still active");}
for(const id of ["lco01","lco02","lco03","lco12","lco13","lco14","lco15","lco16","lco17","lco18","lco19"]){assert(activeIds.has(id), id+" missing");}
const okOpts=new Set(["For example","However","In other words","As a result"]);
for(const q of groups.connector){ 
  assert(q.skill==="connector",`${q.id} wrong skill`);
  assert(q.targetId==="connector-logic",`${q.id} target`);
  assert(q.options.every(o=>okOpts.has(o)),`${q.id} broad option ${q.options}`);
  assert(q.explanation.includes("【根拠英文和訳】"),`${q.id} no translation label`);
  assert(q.explanation.includes("【過去問比較】") || q.sourceComparison,`${q.id} no comparison`);
}
for(const q of groups.insertion){
  assert(q.explanation.includes("【根拠英文和訳】"),`${q.id} missing ja`);
  const ja=q.explanation.split("【根拠英文和訳】")[1].split("【なぜ正解か】")[0];
  assert(/[ぁ-んァ-ン一-龥]/.test(ja),`${q.id} no Japanese in translation`);
  assert(!/^[A-Za-z ,./?;:'"()-]+$/.test(ja.trim()),`${q.id} translation still english`);
}
console.log(JSON.stringify({
  active:active.length, retired:window.DRILLS.filter(q=>q.retired).length,
  connector:groups.connector.length, insertion:groups.insertion.length, content_match:groups.content_match.length, reference:groups.reference.length
}, null, 2));
