
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
function assert(cond, msg) { if (!cond) throw new Error(msg); }

assert(active.length === 283, `active count expected 283, got ${active.length}`);
assert(retired.length >= 100, `retired count expected at least 100, got ${retired.length}`);

const activeRebuttal = active.filter(q => q.skill === "rebuttal");
const expectedIds = ["lrb01","lrb02","lrb03","lrb04","lrb05","lrb06","lrb07","lrb08","lrb09","lrb10","lrb11","lrb12","lrb13","lrb14","lrb15","lrb16"];
assert(activeRebuttal.length === 16, `active rebuttal expected 16, got ${activeRebuttal.length}`);
assert(JSON.stringify(activeRebuttal.map(q => q.id).sort()) === JSON.stringify(expectedIds.sort()), "active rebuttal ids mismatch");

for (const q of activeRebuttal) {
  assert(q.prompt.includes("【オリジナル類題"), `${q.id}: must be marked as original`);
  assert(q.prompt.includes("主張を要約") && q.prompt.includes("反論"), `${q.id}: prompt must require summary + rebuttal`);
  const lines = q.prompt.split("\n");
  const aBlankIndex = lines.findIndex(line => /^A:\s*\(\s*\)/.test(line));
  assert(aBlankIndex >= 0, `${q.id}: missing A blank`);
  assert(lines.length > aBlankIndex + 1, `${q.id}: missing post-blank response`);
  assert(/^B:\s+/.test(lines[aBlankIndex + 1]), `${q.id}: post-blank response must be B line`);
  assert((q.postBlankResponse || "") === lines[aBlankIndex + 1], `${q.id}: postBlankResponse mismatch`);
  assert(q.prompt.indexOf("\nB:") < q.prompt.indexOf("\nA: (") , `${q.id}: initial B claim must precede blank`);
  const firstB = lines.find(line => line.startsWith("B: "));
  const sentenceCount = (firstB.match(/[.!?]/g) || []).length;
  assert(sentenceCount >= 3, `${q.id}: initial B statement must include claim/reasons/support`);
  assert(q.explanation.includes("【後続発言】"), `${q.id}: explanation must mention post-blank response`);
  assert(q.model && q.model.length > 80, `${q.id}: model answer required`);
  const words = (q.model.match(/[A-Za-z']+/g) || []).length;
  assert(words <= (q.maxWords || 60) + 3, `${q.id}: model answer too long (${words} words for ${q.maxWords})`);
}

const hooks = {
  lrb02: ["rules", "emergencies", "study"],
  lrb10: ["benefit", "improving", "closing"],
  lrb11: ["responsibility", "save money", "extra work"]
};
for (const [id, required] of Object.entries(hooks)) {
  const q = activeRebuttal.find(x => x.id === id);
  const text = (q.postBlankResponse || "").toLowerCase();
  for (const phrase of required) assert(text.includes(phrase.toLowerCase()), `${id}: post-blank hook missing ${phrase}`);
}

console.log("rebuttal16 loop3 audit ok: 16 prompts include post-blank B response; dialogue structure matches 2024-2026; active 283; retired count may increase in later loops");
