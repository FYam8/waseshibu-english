import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

function read(path){return fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8')}
function functionSource(source,name){
  let start=source.indexOf(`function ${name}(`);
  if(start<0)start=source.indexOf(`async function ${name}(`);
  assert.ok(start>=0,`missing function ${name}`);
  const brace=source.indexOf('{',start);assert.ok(brace>=0);
  let depth=0,inSingle=false,inDouble=false,inTemplate=false,escaped=false;
  for(let i=brace;i<source.length;i++){
    const ch=source[i];
    if(escaped){escaped=false;continue}
    if(ch==='\\'){escaped=true;continue}
    if(!inDouble&&!inTemplate&&ch==="'"){inSingle=!inSingle;continue}
    if(!inSingle&&!inTemplate&&ch==='"'){inDouble=!inDouble;continue}
    if(!inSingle&&!inDouble&&ch==='`'){inTemplate=!inTemplate;continue}
    if(inSingle||inDouble||inTemplate)continue;
    if(ch==='{')depth++;
    else if(ch==='}'&&--depth===0)return source.slice(start,i+1);
  }
  throw new Error(`unterminated function ${name}`);
}
function plain(v){return JSON.parse(JSON.stringify(v))}

const app=read('app.js');
assert.match(app,/const AI_GRADING_API="https:\/\/waseshibu-writing-grader\.fyam8\.workers\.dev"/);
assert.match(app,/const AI_GRADING_SKILLS=new Set\(\["writing_completion","summary","rebuttal"\]\)/);
const limitsMatch=app.match(/const AI_EXAM_LIMITS=(\{[^;]+\});/);
assert.ok(limitsMatch,'AI_EXAM_LIMITS missing');
const limits=JSON.parse(limitsMatch[1]);
assert.deepEqual(Object.keys(limits).sort(),['2019:4','2020:4','2021:4','2022:4','2023:4','2024:4','2025:4','2026:6']);

// Feedback response validation is part of the browser/worker compatibility boundary.
{
  const ctx={};ctx.globalThis=ctx;vm.createContext(ctx);
  vm.runInContext(`${functionSource(app,'validateAIFeedback')}\nglobalThis.f=validateAIFeedback;`,ctx);
  const valid={score:10,maxScore:12,semantic:[1,1,1,1,1,1],breakdown:[],issues:[]};
  assert.equal(ctx.f(valid,12),true);
  for(const bad of [
    {...valid,score:12.5},
    {...valid,score:13},
    {...valid,maxScore:24},
    {...valid,semantic:[1,1]},
    {...valid,breakdown:null},
    {...valid,issues:null},
    null
  ])assert.equal(ctx.f(bad,12),false);
}

// Fingerprints are persisted with AI feedback and define stale-answer detection.
{
  const ctx={Math,String};ctx.globalThis=ctx;vm.createContext(ctx);
  vm.runInContext(`${functionSource(app,'aiAnswerFingerprint')}\nglobalThis.f=aiAnswerFingerprint;`,ctx);
  assert.equal(ctx.f(''),'fnv1a32-811c9dc5');
  assert.equal(ctx.f('A new draft.'),'fnv1a32-6daf1038');
  assert.notEqual(ctx.f('A new draft.'),ctx.f('A new draft!'));
}

// School-specific task construction remains outside the generic engine.
{
  const examSrc=functionSource(app,'examWritingTask'),drillSrc=functionSource(app,'drillWritingTask');
  const ctx={
    P:{2024:[{text:'４ Writing source passage with enough school-specific material.'}]},
    MANUAL_GUIDES:{'2024:4':{answer:'reference',note:'guide'}},
    k:(y,id)=>`${y}:${id}`
  };
  ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);
  vm.runInContext(`
const AI_GRADING_SKILLS=new Set(["writing_completion","summary","rebuttal"]);
const AI_EXAM_LIMITS=${JSON.stringify(limits)};
${examSrc}
${drillSrc}
globalThis.api={examWritingTask,drillWritingTask};
`,ctx);
  assert.deepEqual(plain(ctx.api.examWritingTask(2024,{id:'4',label:'大問4',skill:'rebuttal',points:24})),{
    scope:'exam',taskId:'2024:4',skill:'rebuttal',maxScore:24,
    prompt:'４ Writing source passage with enough school-specific material.',
    referenceAnswer:'reference',guidance:'guide',maxWords:60
  });
  assert.equal(ctx.api.examWritingTask(2024,{id:'6-4',label:'大問6',skill:'detail',points:5}),null);
  const drill=ctx.api.drillWritingTask({id:'d1',type:'selfcheck',skill:'summary',prompt:'p',model:'m',check:['a','b'],maxWords:50});
  assert.deepEqual(plain(drill),{scope:'drill',taskId:'d1',skill:'summary',maxScore:12,prompt:'p',referenceAnswer:'m',guidance:'a / b',maxWords:50});
  assert.equal(ctx.api.drillWritingTask({id:'d2',type:'choice',skill:'summary'}),null);
  assert.equal(ctx.api.drillWritingTask({id:'d3',type:'selfcheck',skill:'reason'}),null);
  assert.equal(ctx.api.drillWritingTask({id:'d4',type:'selfcheck',skill:'rebuttal',prompt:'p',check:[]}).maxScore,24);
}

// Browser request contract: endpoint, POST JSON shape, result validation and Cloudflare error mapping.
{
  const requestSrc=functionSource(app,'requestWritingFeedback'),validateSrc=functionSource(app,'validateAIFeedback');
  const calls=[];
  const good={score:10,maxScore:12,semantic:[1,1,1,1,1,1],breakdown:[],issues:[]};
  const ctx={
    fetch:async(url,options)=>{calls.push({url,options});return{ok:true,status:200,text:async()=>JSON.stringify(good)}}
  };
  ctx.globalThis=ctx;vm.createContext(ctx);
  vm.runInContext(`
const AI_GRADING_API="https://waseshibu-writing-grader.fyam8.workers.dev";
${validateSrc}
${requestSrc}
globalThis.f=requestWritingFeedback;
`,ctx);
  const task={scope:'drill',taskId:'d1',skill:'summary',maxScore:12};
  assert.deepEqual(plain(await ctx.f(task,'answer')),good);
  assert.equal(calls.length,1);
  assert.equal(calls[0].url,'https://waseshibu-writing-grader.fyam8.workers.dev/v1/grade-writing');
  assert.equal(calls[0].options.method,'POST');
  assert.deepEqual(plain(calls[0].options.headers),{'content-type':'application/json'});
  assert.deepEqual(JSON.parse(calls[0].options.body),{task,answer:'answer'});
  assert.equal('x-client-id' in calls[0].options.headers,false);

  ctx.fetch=async()=>({ok:false,status:429,text:async()=>JSON.stringify({error:'usage_limit_reached',cloudflareCode:3036})});
  await assert.rejects(ctx.f(task,'answer'),/AI採点の利用上限に達しました/);
  ctx.fetch=async()=>({ok:false,status:429,text:async()=>JSON.stringify({})});
  await assert.rejects(ctx.f(task,'answer'),/Cloudflare側の一時的な利用上限/);
  ctx.fetch=async()=>({ok:true,status:200,text:async()=>JSON.stringify({score:3,maxScore:12})});
  await assert.rejects(ctx.f(task,'answer'),/AI採点結果を安全に確認できませんでした/);
}

// Editing after feedback must mark it stale based on the stored answer fingerprint.
{
  const fpSrc=functionSource(app,'aiAnswerFingerprint'),staleSrc=functionSource(app,'markDrillAIStale');
  const ctx={drillState:{selfText:'new answer',q:{},aiFeedback:{answerFingerprint:'different'},aiFeedbackStale:false},drillAIAnswer:()=>ctx.drillState.selfText};
  ctx.globalThis=ctx;vm.createContext(ctx);
  vm.runInContext(`${fpSrc}\n${staleSrc}\nglobalThis.f=markDrillAIStale;`,ctx);
  ctx.f();assert.equal(ctx.drillState.aiFeedbackStale,true);
  ctx.drillState.aiFeedback.answerFingerprint=vm.runInContext('aiAnswerFingerprint("new answer")',ctx);
  ctx.f();assert.equal(ctx.drillState.aiFeedbackStale,false);
}

console.log('Waseda AI writing integration compatibility characterization: CLEAN');
