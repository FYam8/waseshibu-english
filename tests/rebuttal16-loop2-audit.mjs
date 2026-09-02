
import fs from "fs";
import vm from "vm";
import path from "path";

const dir = process.cwd();
const html = fs.readFileSync(path.join(dir, "index.html"), "utf8");
const scripts = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]);
const ctx = { window: {}, console };
ctx.window.window = ctx.window;
vm.createContext(ctx);
for (const s of scripts) {
  if (s === "app.js") continue;
  const code = fs.readFileSync(path.join(dir, s), "utf8");
  vm.runInContext(code, ctx, { filename: s });
}
const drills = ctx.window.DRILLS || [];
const active = drills.filter(q => !q.retired);
const retired = drills.filter(q => q.retired);

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

assert(active.length === 283, `active count expected 283, got ${active.length}`);
assert(retired.length >= 100, `retired count expected at least 100, got ${retired.length}`);

const oldIds = ["nrb01","nrb02","nrb03","nrb04","nrb05"];
for (const id of oldIds) {
  const q = drills.find(x => x.id === id);
  assert(q && q.retired === true, `${id} must be non-destructively retired`);
  assert(q.legacyCompletion === true, `${id} must preserve legacy completion`);
}
const activeRebuttal = active.filter(q => q.skill === "rebuttal");
assert(activeRebuttal.length === 16, `active rebuttal expected 16, got ${activeRebuttal.length}`);

const expectedIds = ["lrb01","lrb02","lrb03","lrb04","lrb05","lrb06","lrb07","lrb08","lrb09","lrb10","lrb11","lrb12","lrb13","lrb14","lrb15","lrb16"];
assert(JSON.stringify(activeRebuttal.map(q => q.id).sort()) === JSON.stringify(expectedIds.sort()), "active rebuttal ids mismatch");

const labels = ["【語数】","【設問条件】","【良い点】","【優先修正点】","【文法・語法】","【最小限修正版】","【高得点答案例】","【合格戦略上の評価】"];
for (const q of activeRebuttal) {
  assert(q.type === "selfcheck", `${q.id}: type must remain selfcheck`);
  assert(q.targetId === "rebuttal-dialogue", `${q.id}: targetId must be rebuttal-dialogue`);
  assert(q.prompt.includes("主張を要約") && q.prompt.includes("反論"), `${q.id}: prompt must require summary + rebuttal`);
  assert(Array.isArray(q.check) && q.check.length >= 5, `${q.id}: check list must have at least 5 items`);
  assert(q.model && q.model.length > 80, `${q.id}: model answer required`);
  const words = (q.model.match(/[A-Za-z']+/g) || []).length;
  assert(words <= (q.maxWords || 60) + 3, `${q.id}: model answer too long (${words} words for ${q.maxWords})`);
  for (const label of labels) assert(q.explanation.includes(label), `${q.id}: missing explanation label ${label}`);
}

const newIds = ["lrb12","lrb13","lrb14","lrb15","lrb16"];
for (const id of newIds) {
  const q = active.find(x => x.id === id);
  assert(q.prompt.includes("【オリジナル類題"), `${id}: must be marked as original`);
  const bLine = q.prompt.split("\n").find(line => line.startsWith("B:")) || "";
  const sentenceCount = (bLine.match(/[.!?]/g) || []).length;
  assert(sentenceCount >= 3, `${id}: B statement must include claim/reasons/support`);
}

console.log("rebuttal16 loop2 audit ok: nrb01-05 retired + lrb12-16 added; 16 active rebuttal; explanations 8 fields; active 283; history-safe");
