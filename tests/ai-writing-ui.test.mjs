import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import assert from "node:assert/strict";
import { TextDecoder, TextEncoder } from "node:util";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const scripts = [...html.matchAll(/<script src="([^"]+)"/g)].map(match => match[1]).filter(script => script !== "progress-sync.js");
function storage() { const values = new Map(); return { get length() { return values.size; }, key: i => [...values.keys()][i] ?? null, getItem: k => values.has(k) ? values.get(k) : null, setItem: (k, v) => values.set(k, String(v)), removeItem: k => values.delete(k) }; }
const dummy = { innerHTML: "", textContent: "", value: "", disabled: false, className: "", style: {}, dataset: {}, classList: { add() {}, remove() {}, toggle() {} }, appendChild() {}, addEventListener() {}, querySelector() { return dummy; }, querySelectorAll() { return []; }, closest() { return null; } };
const ctx = { console, window: null, TextDecoder, TextEncoder, crypto: { randomUUID: () => "12345678-1234-1234-1234-123456789012", subtle: {} }, document: { getElementById() { return dummy; }, querySelector() { return dummy; }, querySelectorAll() { return []; }, createElement() { return dummy; }, addEventListener() {}, body: dummy }, localStorage: storage(), navigator: {}, location: { hash: "" }, addEventListener() {}, removeEventListener() {}, setTimeout() {}, clearTimeout() {}, fetch() { throw new Error("unexpected network call"); }, alert() {} };
ctx.window = ctx;
vm.createContext(ctx);
for (const script of scripts) vm.runInContext(fs.readFileSync(path.join(root, script), "utf8"), ctx, { filename: script });
vm.runInContext("globalThis.__state=()=>S;render=()=>{}", ctx);

const state = ctx.__state();
assert.equal(state.schemaVersion, 8);
state.manual["2024:4"] = { score: 11, components: ["文法・語彙"] };
ctx.rememberAIAnswer(2024, "4", "A new draft.");
assert.equal(state.manual["2024:4"].score, 11, "typing an AI answer must not overwrite self-score");
assert.deepEqual([...state.manual["2024:4"].components], ["文法・語彙"]);

state.manual["2024:4"].aiFeedback = {
  score: 18,
  semantic: [1, 1, 1, 0, 0, 1],
  organization: 1,
  wordCount: 38,
  answerFingerprint: ctx.aiAnswerFingerprint("A new draft."),
};
state.manual["2024:4"].aiFeedbackStale = false;
ctx.applyAIGrade(2024, "4");
assert.equal(state.manual["2024:4"].score, 18);
assert.equal(state.manual["2024:4"].gradingMode, "ai-assisted");
assert(state.manual["2024:4"].components.includes("文法・語彙"));
assert(state.manual["2024:4"].components.includes("理由・具体例"));
assert.equal(ctx.localStorage.getItem("waseshibu.adaptive.v3") !== null, true);

assert.match(ctx.aiWritingInput(2024, { id: "4" }, "2024:4", state.manual["2024:4"]), /AIで答案を詳しく確認/);
assert.equal(ctx.aiWritingInput(2023, { id: "4" }, "2023:4", {}), "");
console.log("ai-writing-ui ok: existing schema/key preserved; AI fields are additive and opt-in");
