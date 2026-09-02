
import fs from 'fs';
global.window = {};
window.DRILLS = [];
window.PAST_PAPERS = [];
window.PAST_PAPER_ANSWERS = {};
const scripts = ["data.js","paper-underlines.js","manual-guides.js","extra-drills.js","detail-drills-v2.js","learning-model.js","original-drills-loop3.js","original-drills-loop4.js","detail20-fix-loop1.js","rebuttal16-loop2.js","rebuttal16-loop3-afterturn.js","summary15-loop2.js","summary15-loop4.js","reason10-loop2.js","reason10-loop3.js","emotion10-loop2.js","context10-loop2.js","connector11-loop2.js"];
for (const s of scripts) {
  const code = fs.readFileSync(s,'utf8');
  Function(code).call(globalThis);
}
const active = (window.DRILLS||[]).filter(q=>!q.retired);
const groups={};
for(const q of active){
  (groups[q.skill] ||= []).push(q);
}
for(const k of ["connector","content_match","insertion","reference"]){
  console.log('\nSKILL',k, groups[k]?.length);
  for(const q of groups[k]||[]) console.log(q.id, q.targetId||'', q.focusTag||'', (q.prompt||'').slice(0,90).replace(/\n/g,' '));
}
console.log('active',active.length,'retired',(window.DRILLS||[]).filter(q=>q.retired).length,'total',(window.DRILLS||[]).length)
