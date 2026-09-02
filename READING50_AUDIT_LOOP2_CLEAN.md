# READING50_AUDIT_LOOP2_CLEAN

## 対象

読解ミニセットA 50問。

- connector: 11問
- content_match: 16問
- insertion: 14問
- reference: 9問

## 前回NOT CLEANの理由

1. connector 11問のうち lco04〜lco11 が、Although / Unless / After that などに広がりすぎ、接続関係の元過去問対応として締まりが弱かった。
2. insertion 14問の `【根拠英文和訳】` が英文再掲になっており、解説最低基準を満たしていなかった。
3. content_match / reference はKEEP候補が多いが、50問セットとして回帰確認が必要だった。

## 過去問との比較

### connector

比較軸は、2020〜2022年度の説明文中の接続語問題。

- 2020年度大問6: 「治療後も避ける必要がある」→「それでも命に関わる反応を避けられる」の However 型。
- 2021年度大問6: 「水中は静かだと思われる」→「実際は違う」の However 型。
- 2022年度大問6: media multitasking の一般説明から具体例へ進む For example 型。

このため、connector は学習範囲をむやみに広げず、主要4系統に締め直した。

- For example
- However
- In other words
- As a result

処理:
- lco04〜lco11 を非破壊retire。
- lco12〜lco19 を新IDで追加。
- lco02 / lco03 の選択肢も主要4系統へ調整。

### insertion

比較軸は、2021〜2023年度の説明文での文挿入型。

文挿入は、接続語1個ではなく、指示語・時系列・因果・同義反復など2つ以上の根拠で位置を決める必要がある。

処理:
- lin01〜lin14 は問題本体を維持。
- 全14問の `【根拠英文和訳】` を日本語説明へ修正。
- `【過去問比較】` を追加。

### content_match

1択・2択・NOT型を維持。本文の複数情報照合、時系列、実験条件、最終判断、本文にない推測を誤答にする構造を確認。今回は問題本体を維持。

### reference

単純名詞照応ではなく、出来事・行動・計画・節・原因全体を指す照応に寄せられているため、問題本体を維持。

## 修正内容

- connector active: lco01, lco02, lco03, lco12, lco13, lco14, lco15, lco16, lco17, lco18, lco19
- lco04〜lco11: retired / legacyCompletion
- insertion: lin01〜lin14 の解説を修正
- content_match: lcm01〜lcm16 維持
- reference: lrf01〜lrf09 維持

## 精査1

PASS。

確認項目:
- active 283
- retired 176
- reading50 active 50
- connector 11
- content_match 16
- insertion 14
- reference 9
- connector が主要4選択肢に収まること
- insertion の根拠英文和訳に日本語が入っていること
- 旧connectorの広げすぎIDがactiveから外れていること

## 独立再精査

別ディレクトリに展開した状態で再テストし、同じ結果を確認。

PASS。

## CLEAN判定

読解ミニセットA 50問に限り、

修正 → 精査 → CLEAN → 独立再精査 → CLEAN

を達成。

ただし、プロジェクト全体CLEANではない。
