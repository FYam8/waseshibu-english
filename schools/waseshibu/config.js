(function(root){
'use strict';
root.ENGLISH_SCHOOL_CONFIG=Object.freeze({
  contractVersion:1,
  schoolId:'waseshibu',
  brand:Object.freeze({
    eyebrow:'WASEDA SHIBUYA ENGLISH',
    title:'過去問 × 弱点克服',
    documentTitle:'早稲渋 英語｜過去問×弱点克服',
    description:'早稲田渋谷シンガポール校 英語 2019〜2026実際の過去問＋誤答克服ドリル',
    footer:'2019〜2026年度の実際の筆記問題をテキスト収録。英単語・リスニングは別アプリ想定。'
  }),
  exam:Object.freeze({
    years:Object.freeze([2019,2020,2021,2022,2023,2024,2025,2026]),
    route:Object.freeze([2024,2023,2022,2021,2020,2019,2025,2026]),
    defaultYear:2024,
    goalTiers:Object.freeze([60,70,75]),
    defaultGoal:60,
    writtenMaxScore:80,
    listeningMaxScore:20,
    totalMaxScore:100,
    dailyTaskTarget:10
  }),
  storage:Object.freeze({
    key:'waseshibu.adaptive.v3',
    legacyKeys:Object.freeze(['waseshibu.adaptive.v2']),
    recoveryPrefix:'waseshibu.adaptive.pre-migration',
    importRecoveryPrefix:'waseshibu.adaptive.pre-import',
    schemaVersion:8,
    syncDb:'waseshibu-progress-sync',
    syncDbVersion:7
  }),
  progress:Object.freeze({
    enabled:true,
    endpoint:'https://waseshibu-progress-api.fyam8.workers.dev',
    appId:'english'
  }),
  aiWriting:Object.freeze({
    enabled:true,
    endpoint:'https://waseshibu-writing-grader.fyam8.workers.dev',
    skills:Object.freeze(['writing_completion','summary','rebuttal'])
  })
});
})(typeof globalThis!=='undefined'?globalThis:this);
