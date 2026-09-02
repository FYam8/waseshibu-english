
const fs=require('fs'), vm=require('vm');
const ctx={window:{}, console}; ctx.window.DRILLS=[];
vm.createContext(ctx);
const scripts=[...fs.readFileSync('index.html','utf8').matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]).filter(s=>s!=='app.js');
for (const s of scripts) vm.runInContext(fs.readFileSync(s,'utf8'),ctx,{filename:s});
const B=ctx.window.DRILLS; const active=B.filter(x=>!x.retired);
const skills={}; active.forEach(d=>skills[d.skill]=(skills[d.skill]||0)+1);
const ids=active.filter(d=>['vocab_definition','extract','paraphrase','example'].includes(d.skill));
console.log(JSON.stringify({total:B.length, active:active.length, retired:B.length-active.length, skills, vocabIds:ids.map(d=>d.id)},null,2));
function assert(c,m){if(!c){console.error('FAIL',m);process.exit(1)}}
assert(active.length===283,'active 283');
assert(ids.length===45,'vocab45 active');
for(const s of ['vocab_definition','extract','paraphrase','example']) assert(ids.filter(d=>d.skill===s).length==={vocab_definition:13,extract:11,paraphrase:11,example:10}[s], s);
assert(ids.every(d=>d.explanation && d.explanation.includes('【正解】')),'expl');
assert(ids.filter(d=>d.skill==='vocab_definition').every(d=>d.type==='text' && d.initial),'def text');
const ex=ids.filter(d=>d.skill==='example'); assert(new Set(ex.map(d=>d.answer)).size>1,'example dispersed');
