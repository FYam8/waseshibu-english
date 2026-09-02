
import fs from 'fs';
global.window={DRILLS:[]}; window.PAST_PAPERS=[]; window.PAST_PAPER_ANSWERS={};
for (const s of ["data.js","paper-underlines.js","manual-guides.js","extra-drills.js","detail-drills-v2.js","learning-model.js","original-drills-loop3.js","original-drills-loop4.js","detail20-fix-loop1.js","rebuttal16-loop2.js","rebuttal16-loop3-afterturn.js","summary15-loop2.js","summary15-loop4.js","reason10-loop2.js","reason10-loop3.js","emotion10-loop2.js","context10-loop2.js","connector11-loop2.js"]) {
 Function(fs.readFileSync(s,'utf8')).call(globalThis);
}
const active=window.DRILLS.filter(q=>!q.retired && ["insertion","connector"].includes(q.skill));
fs.writeFileSync("active_conn_ins.json", JSON.stringify(active,null,2));
