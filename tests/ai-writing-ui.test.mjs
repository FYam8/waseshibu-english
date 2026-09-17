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
  maxScore: 24,
  semantic: [1, 1, 1, 0, 0, 1],
  organization: 1,
  wordCount: 38,
  lengthPoints: 1,
  lengthMax: 2,
  answerFingerprint: ctx.aiAnswerFingerprint("A new draft."),
};
state.manual["2024:4"].aiFeedbackStale = false;
ctx.applyAIGrade(2024, "4");
assert.equal(state.manual["2024:4"].score, 18);
assert.equal(state.manual["2024:4"].gradingMode, "ai-assisted");
assert(state.manual["2024:4"].components.includes("文法・語彙"));
assert(state.manual["2024:4"].components.includes("理由・具体例"));
assert.equal(ctx.localStorage.getItem("waseshibu.adaptive.v3") !== null, true);

const supportedExam=[],examTasks=[];
for(const [year,rows] of Object.entries(ctx.EXAM_DATA))for(const q of rows){const task=ctx.examWritingTask(Number(year),q);if(task){supportedExam.push(`${year}:${q.id}`);examTasks.push(task)}}
assert.deepEqual(supportedExam.sort(),["2019:4","2020:4","2021:4","2022:4","2023:4","2024:4","2025:4","2026:6"]);
assert(examTasks.every(task=>task.prompt.length>100));
assert.match(ctx.aiWritingInput(2024,ctx.EXAM_DATA[2024].find(q=>q.id==="4"),"2024:4",state.manual["2024:4"]),/AIで答案を詳しく確認/);
assert.match(ctx.aiWritingInput(2023,ctx.EXAM_DATA[2023].find(q=>q.id==="4"),"2023:4",{}),/12点相当/);
assert.equal(ctx.aiWritingInput(2024,ctx.EXAM_DATA[2024].find(q=>q.id==="6-4"),"2024:6-4",{}),"");

const supportedDrills=ctx.DRILLS.filter(q=>!q.retired&&ctx.drillWritingTask(q));
assert.equal(supportedDrills.length,45);
assert.deepEqual([...new Set(supportedDrills.map(q=>q.skill))].sort(),["rebuttal","summary","writing_completion"]);
assert([...examTasks,...supportedDrills.map(ctx.drillWritingTask)].every(task=>JSON.stringify({task,answer:"a".repeat(1200)}).length<16000));
vm.runInContext(`drillState={q:BANK.find(q=>q.id==="lsu26"),selfText:"A short draft summary.",selfParts:[],aiFeedback:null,aiFeedbackStale:false}`,ctx);
assert.match(ctx.drillInput(ctx.DRILLS.find(q=>q.id==="lsu26")),/AIで具体的な改善点を見る/);
let sentOptions;
ctx.fetch=async(_url,options)=>{sentOptions=options;return{ok:false,status:429,text:async()=>JSON.stringify({error:"usage_limit_reached",cloudflareCode:3036,message:"AI採点の利用上限に達しました。"})}};
await assert.rejects(ctx.requestWritingFeedback(examTasks[0],"A complete answer."),/AI採点の利用上限に達しました/);
assert.equal("x-client-id" in sentOptions.headers,false,"the removed per-client limiter must not leave a tracking header");
ctx.fetch=async()=>({ok:false,status:429,text:async()=>JSON.stringify({error:"ai_capacity_unavailable",cloudflareCode:3040,message:"CloudflareのAI処理が現在混み合っています。"})});
await assert.rejects(ctx.requestWritingFeedback(examTasks[0],"A complete answer."),/現在混み合っています/);
console.log("ai-writing-ui ok: all 8 free-writing exams and 45 writing drills are opt-in; Cloudflare limit errors are distinct; existing schema/key preserved");
