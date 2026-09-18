(function(root){
'use strict';
root.ENGLISH_SCHOOL_UI=Object.freeze({
  contractVersion:1,
  brand:Object.freeze({
    eyebrow:'WASEDA SHIBUYA ENGLISH',
    heading:'過去問 × 弱点克服'
  }),
  views:Object.freeze([
    Object.freeze({id:'home',label:'今日やること'}),
    Object.freeze({id:'route',label:'学習ルート'}),
    Object.freeze({id:'exam',label:'過去問'}),
    Object.freeze({id:'review',label:'間違い対策'}),
    Object.freeze({id:'drill',label:'克服ドリル'}),
    Object.freeze({id:'stats',label:'成績・到達度'}),
    Object.freeze({id:'guide',label:'使い方'})
  ]),
  footer:'2019〜2026年度の実際の筆記問題をテキスト収録。英単語・リスニングは別アプリ想定。',
  features:Object.freeze({
    scoreDisplay:true,
    listeningScore:true,
    aiWriting:true,
    paperViewer:true,
    backupImport:true
  })
});
})(typeof globalThis!=='undefined'?globalThis:this);
