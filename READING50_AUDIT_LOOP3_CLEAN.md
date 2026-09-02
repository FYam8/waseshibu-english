# READING50_AUDIT_LOOP3_CLEAN

## 対象

読解ミニセットA 50問。

- connector: 11問
- content_match: 16問
- insertion: 14問
- reference: 9問

## 追加精査の結論

前回の reading50-loop2 では内容面の主要修正は通っていたが、今回の再精査で次の実装・運用上の修正事項を検出した。

1. connector 11問の正解位置がすべて options[0] に偏っていた。
2. insertion 14問の正解位置に [4] がなく、位置暗記リスクが残っていた。
3. 一部の旧テストが過去ループ時点の期待値のまま残っており、現在状態の総合回帰テストとして不整合だった。

このため、いったん CLEAN を解除し、修正後に再度精査ループを回した。

## 過去問との比較

### connector

2020〜2022年度の接続関係問題は、説明文中で前後の論理関係を読む問題として扱う。

中心型:
- For example: 一般説明 → 具体例
- However: 一般認識・制限 → 実際・利点
- In other words: 言い換え
- As a result: 原因・変化 → 結果

reading50-loop3 ではこの主要4型を維持したまま、正解選択肢の位置だけが偏らないように lco20〜lco30 へ非破壊置換した。

### insertion

文挿入は、接続語1個で即答するのではなく、指示語・時系列・因果・結論位置など2根拠以上で決める。

reading50-loop3 では、[4] が正解になる問題を4問追加した。  
旧問のうち lin02 / lin04 / lin05 / lin12 を非破壊retireし、lin15〜lin18 を追加した。

### content_match / reference

content_match 16問と reference 9問は、今回の再精査で大きな修正事項は検出しなかった。  
reading50-loop2 時点の問題本体を維持し、回帰確認のみ実施した。

## 修正内容

### connector

非破壊retire:
- lco01, lco02, lco03, lco12, lco13, lco14, lco15, lco16, lco17, lco18, lco19

新ID:
- lco20〜lco30

正解位置分布:
- 0: 2問
- 1: 3問
- 2: 3問
- 3: 3問

### insertion

非破壊retire:
- lin02, lin04, lin05, lin12

新ID:
- lin15, lin16, lin17, lin18

新規4問はいずれも [4] が正解。  
理由は、結論文・評価文・This showed... 型を本文末に置く処理を確認するため。

## 実装確認

- active類題数: 283
- retired類題数: 191
- reading50 active: 50
- connector active: 11
- content_match active: 16
- insertion active: 14
- reference active: 9

## テスト結果

すべてPASS。

- audit.mjs: PASS
- connector11-loop2-audit.mjs: PASS
- context10-loop2-audit.mjs: PASS
- current-state-audit.mjs: PASS
- detail-audit.mjs: PASS
- detail20-loop1-audit.mjs: PASS
- emotion10-loop2-audit.mjs: PASS
- emotion10-loop4-audit.mjs: PASS
- original-loop4-audit.mjs: PASS
- reading50-loop2-audit.mjs: PASS
- reading50-loop3-audit.mjs: PASS
- reason10-loop2-audit.mjs: PASS
- reason10-loop3-audit.mjs: PASS
- rebuttal16-loop2-audit.mjs: PASS
- rebuttal16-loop3-audit.mjs: PASS
- summary15-loop2-audit.mjs: PASS
- summary15-loop4-audit.mjs: PASS

## CLEAN判定

読解ミニセットA 50問に限り、

修正 → 精査 → CLEAN → 独立再精査 → CLEAN

を達成。

ただし、これはプロジェクト全体CLEANではない。
