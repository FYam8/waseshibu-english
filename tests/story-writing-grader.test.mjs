import assert from 'node:assert/strict';import worker,{resolveTask}from '../workers/writing-grader/src/index.mjs';import{tasks,parseStory,countWords}from '../workers/writing-grader/src/adapters/rikkyo.mjs';
const answer=('This is a short sentence about my new ability. ').repeat(9).trim(),raw={ratings:[4,4,4,4,4,4],issues:[],strengths:['明確です'],revisedExample:answer,nextPractice:['物語を読み直す']};
for(const[id,t]of Object.entries(tasks)){const task=resolveTask({schoolId:'rikkyo',scope:'exam',taskId:id,skill:t.skill,prompt:'OVERRIDE',maxWords:1,finalExamCompleted:true});assert.ok(task);assert.equal(task.maxWords,100);assert.notEqual(task.prompt,'OVERRIDE');const d=parseStory(JSON.stringify(raw),task,answer);assert.equal(d.score,28);assert.equal(d.breakdown.length,7);assert.equal(d.official,false);}
for(const task of[{schoolId:'other',scope:'exam',taskId:'FY26A:Q8',skill:'story_writing'},{schoolId:'rikkyo',scope:'exam',taskId:'FY26A:Q7',skill:'story_writing'},{schoolId:'rikkyo',scope:'exam',taskId:'FY26B:Q8',skill:'story_writing'},{schoolId:'rikkyo',scope:'drill',taskId:'FY26A:Q8',skill:'story_writing'}])assert.equal(resolveTask(task),null);
const task=resolveTask({schoolId:'rikkyo',scope:'exam',taskId:'FY26A:Q8',skill:'story_writing'});
for(const text of ['```'+JSON.stringify(raw)+'```','<script>',JSON.stringify({...raw,ratings:[5,4,4,4,4,4]}),JSON.stringify({...raw,issues:[{original:'NOT IN ANSWER'}]}),JSON.stringify({...raw,revisedExample:'short'})])assert.throws(()=>parseStory(text,task,answer));
for(const n of[0,1,59,60,79,80,100,101,120,121])assert.equal(parseStory(JSON.stringify(raw),task,Array(n).fill('word').join(' ')).lengthPoints,n>=80&&n<=100?4:n>=60&&n<=120?2:0);
assert.equal(countWords("I'm ready for a well-known adventure."),6);
let called=0;const env={AI:{run:async()=>{called++;return{response:JSON.stringify(raw)}}},STORY_RATE_LIMIT:{limit:async()=>({success:true})}};
const post=(body,origin='https://fyam8.github.io')=>new Request('https://test/v1/grade-writing',{method:'POST',headers:{origin,'content-type':'application/json'},body:typeof body==='string'?body:JSON.stringify(body)});
assert.equal((await worker.fetch(post({task,answer},'https://evil.test'),env)).status,403);
assert.equal((await worker.fetch(post('{invalid'),env)).status,400);
assert.equal((await worker.fetch(post({task:{...task,taskId:'FY26A:Q7'},answer}),env)).status,400);
assert.equal((await worker.fetch(post({task,answer:'x'.repeat(1201)}),env)).status,413);
assert.equal(called,0);
assert.equal((await worker.fetch(post({task,answer}),{...env,STORY_RATE_LIMIT:{limit:async()=>({success:false})}})).status,429);
assert.equal((await worker.fetch(post({task,answer}),{AI:env.AI})).status,503);
assert.equal((await worker.fetch(post({task,answer}),env)).status,200);
console.log('Story grader: 4-task allowlist, canonical authority, boundaries, JSON/evidence, origin, rate limiting, preserved unofficial scores PASS');

// A malformed/too-short improvement must never be mistaken for the submitted answer.
const low={...raw,ratings:[0,0,0,4,4,4],revisedExample:'short'};let runs=0;
const repairEnv={...env,AI:{run:async(model,input)=>{runs++;if(runs===1)return{response:JSON.stringify(low)};assert.ok(input.messages.some(m=>m.content.includes('STUDENT:')));return{response:JSON.stringify({revisedExample:answer})}}}};
const repaired=await(await worker.fetch(post({task,answer}),repairEnv)).json();assert.equal(repaired.score,16);assert.equal(repaired.breakdown[0].earned,0);assert.equal(runs,2);
console.log('Bounded example repair preserves original assessment PASS');

const noErrors=parseStory(JSON.stringify({...raw,ratings:[0,0,0,0,0,0]}),task,answer);assert.equal(noErrors.breakdown[3].earned,4);assert.equal(noErrors.breakdown[4].earned,4);
console.log('Language deductions require grounded errors PASS');
