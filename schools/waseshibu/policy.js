(function(root){
'use strict';
const skillNames=Object.freeze({
  pronunciation:'発音',stress:'アクセント',reorder:'語句整序',vocab_definition:'英文定義',writing_completion:'短文完成',summary:'要約',rebuttal:'要約＋反論',paraphrase:'言い換え',context:'文脈',emotion:'心情',reason:'理由',extract:'本文抜出',content_match:'内容一致',sentence_completion:'英語完成',reference:'指示語',connector:'接続語',insertion:'文挿入',detail:'内容把握',example:'具体例'
});
function resolveQuestionPriority(question){if(question?.priority==='A')return'A';if(question?.skill==='insertion')return'C';return'B'}
function isPriorityInGoal(priority,goal){return priority==='A'||(priority==='B'&&Number(goal)>=70)||(priority==='C'&&Number(goal)>=75)}
function priorityOrder(priority){return({A:0,B:1,C:2})[priority]??3}
function routeRole(year){return Number(year)===2024?'初見診断':Number(year)===2025?'実戦確認':Number(year)===2026?'最終判定':'弱点補強'}
function goalLabel(goal){return Number(goal)===60?'A 60点':Number(goal)===70?'B 70点':'C 75点'}
function goalAdvice(goal){return Number(goal)===60?'A問題を最優先にして60点を守ります。':Number(goal)===70?'Aを固め、B問題まで直して70点を狙います。':'A・Bを確実にした後、取れるC問題を選んで75点を狙います。'}
function skillName(skill){return skillNames[skill]||skill}
// A school-specific remediation route; shared mastery/scoring rules remain unchanged.
const connectorIds=Object.freeze(['lco21','lco23','lco27','lco28','lco26']);
function practicePlan(bank,weak,currentDrill=null){
 if(!new Set(['2021:6-4','2022:6-2','2023:6-2']).has(Number(weak?.year)+':'+weak?.id))return null;
 const pool=connectorIds.map(id=>bank.find(q=>q.id===id&&!q.retired));
 if(pool.some(q=>!q)||new Set(pool.map(q=>q.familyId)).size!==5)return null;
 const reserved=Array.isArray(weak.reservedConfirm)?weak.reservedConfirm:[];
 // Keep older cycles, including their future questions, on the old route.
 if(reserved.some(id=>!connectorIds.includes(id)))return null;
 if(currentDrill?.q&&!connectorIds.includes(currentDrill.q.id))return null;
 if(!reserved.length&&(weak.status==='pending'||Number(weak.streak)>0)&&!connectorIds.includes(weak.lastDrillId))return null;
 return {pool,confirmationIds:['lco28','lco26']};
}
function additionalReservedIds(bank,targetId){
 return targetId==='detail-context-evidence'?bank.filter(q=>!q.retired&&connectorIds.includes(q.id)).map(q=>q.id):[];
}
root.ENGLISH_SCHOOL_POLICY=Object.freeze({practicePlan,additionalReservedIds,resolveQuestionPriority,isPriorityInGoal,priorityOrder,routeRole,goalLabel,goalAdvice,skillName});
})(typeof globalThis!=='undefined'?globalThis:this);
