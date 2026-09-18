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
root.ENGLISH_SCHOOL_POLICY=Object.freeze({resolveQuestionPriority,isPriorityInGoal,priorityOrder,routeRole,goalLabel,goalAdvice,skillName});
})(typeof globalThis!=='undefined'?globalThis:this);
