import assert from'node:assert/strict';import{context as ctx,data}from'./g2-content-audit.mjs';
const policy=ctx.ENGLISH_SCHOOL_POLICY;
for(const [source,kind] of [['2019:5-2','dialogue'],['2020:5-2','dialogue'],['2019:5-3','lexical']]){
 const[y,id]=source.split(':'),weak={...data.exams[y].find(q=>q.id===id),year:Number(y),status:'active',streak:0,reservedConfirm:[]};
 const before=JSON.stringify(weak),plan=policy.practicePlan(data.drills,weak);assert.ok(plan);assert.equal(JSON.stringify(weak),before,'policy must not mutate state');
 assert.ok(plan.pool.every(q=>kind==='dialogue'?['context-dialogue','context-dialogue-next-action','context-dialogue-correction','context-dialogue-offer','context-dialogue-advice'].includes(q.focusTag):q.focusTag==='vocab-in-context'||q.targetId==='context-lexical-fit'));
 assert.ok(new Set(plan.pool.map(q=>q.familyId)).size>=5);
 for(const fields of [{reservedConfirm:['lcx08','lcx10']},{reservedConfirm:['lcx09','lcx06']},{status:'pending'},{streak:1,lastDrillId:'lcx01'}])assert.equal(policy.practicePlan(data.drills,{...weak,...fields}),null,'old cycle preserved');
 assert.equal(policy.practicePlan(data.drills,weak,{q:{id:'lcx01'}}),null,'old active question preserved');
 const started={...weak,reservedConfirm:[...plan.confirmationIds]};assert.deepEqual(policy.practicePlan(data.drills,started).confirmationIds,plan.confirmationIds);
 assert.equal(policy.practicePlan(data.drills.map(q=>q.id===plan.pool[0].id?{...q,retired:true}:q),weak),null,'retired/missing reviewed content fails closed');
 for(const ids of [['lcx08','lcx10'],[...plan.confirmationIds]]){const state={weak:{[source+':main']:{...weak,reservedConfirm:ids,status:'pending',streak:3}},attempts:[{id:'historical-score',writtenScore:77}],drillLog:[{q:'lcx08',ok:true}]};const historical=JSON.stringify(state.attempts);ctx.ENGLISH_MODEL.migrateState(state);assert.deepEqual([...state.weak[source+':main'].reservedConfirm],ids,'reload retains old and new reservations');assert.equal(JSON.stringify(state.attempts),historical);}
 const restarted=policy.practicePlan(data.drills,{...weak,reservedConfirm:[]},{q:plan.pool[0],mode:'train',failedConfirmation:true});assert.ok(restarted,'failed confirmation starts a new supported cycle');
}
console.log('Context route semantic families / old reservations / no state mutation / retired content / failure restart PASS');
