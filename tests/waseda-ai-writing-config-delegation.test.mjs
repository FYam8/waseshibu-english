import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

function read(path){return fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8')}
function plain(v){return JSON.parse(JSON.stringify(v))}

const app=read('app.js');
const start=app.indexOf('const SCHOOL_AI_WRITING_CONFIG=');
const end=app.indexOf('const ROUTE=',start);
assert.ok(start>=0&&end>start,'AI config declaration block missing');
const block=app.slice(start,end);

function evaluate(adapter){
  const ctx={};
  if(adapter!==undefined)ctx.ENGLISH_ENGINE_ADAPTER=adapter;
  ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);
  vm.runInContext(`${block}\nglobalThis.out={enabled:AI_GRADING_ENABLED,endpoint:AI_GRADING_API,skills:[...AI_GRADING_SKILLS]};`,ctx);
  return plain(ctx.out);
}

// No-adapter path is the exact installed Waseda fallback.
assert.deepEqual(evaluate(undefined),{
  enabled:true,
  endpoint:'https://waseshibu-writing-grader.fyam8.workers.dev',
  skills:['writing_completion','summary','rebuttal']
});

// A different school can supply its own endpoint and supported skills without changing engine code.
assert.deepEqual(evaluate({config:{aiWriting:{enabled:true,endpoint:'https://example.test/grade',skills:['summary']}}}),{
  enabled:true,endpoint:'https://example.test/grade',skills:['summary']
});

// Schools/environments can explicitly disable AI writing.
assert.deepEqual(evaluate({config:{aiWriting:{enabled:false,endpoint:'https://example.test/unused',skills:['summary','rebuttal']}}}),{
  enabled:false,endpoint:'https://example.test/unused',skills:[]
});

// Waseda adapter values equal the frozen production integration.
const cfgCtx={};cfgCtx.window=cfgCtx;cfgCtx.globalThis=cfgCtx;vm.createContext(cfgCtx);
vm.runInContext(read('schools/waseshibu/config.js'),cfgCtx,{filename:'schools/waseshibu/config.js'});
const cfg=plain(cfgCtx.ENGLISH_SCHOOL_CONFIG.aiWriting);
assert.deepEqual(cfg,{
  enabled:true,
  endpoint:'https://waseshibu-writing-grader.fyam8.workers.dev',
  skills:['writing_completion','summary','rebuttal']
});
assert.deepEqual(evaluate({config:{aiWriting:cfg}}),cfg);

console.log('Waseda AI writing config delegation: CLEAN');
