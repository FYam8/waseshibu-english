# SUMMARY15 精査ループ4 レポート

## 対象
- 弱点分野: 要約 `summary`
- 対象 active ID: `lsu26`〜`lsu40`
- 元の修正理由: loop3で、`lsu11`〜`lsu25` の本文分量・不要情報・情報選別負荷が2022/2023年度本番型に比べて軽いと判定したため。

## 過去問比較の基準

### 2022年度 大問4
- 形式: 英文を読んで40語以内でsummaryを書く。
- 処理: 誤解・試行・失敗・本当の原因/教訓を要約する。
- 目安本文量: 約200語級。

### 2023年度 大問4
- 形式: 英文を読んで50語以内でsummaryを書く。
- 処理: 人物・状態の対比、変化、結論を要約する。
- 目安本文量: 約230語級。

## 修正内容

- `lsu11`〜`lsu25`: 非破壊retire。
- `lsu26`〜`lsu40`: 新IDで15問追加。
- active summary数は15問を維持。
- active drill総数は283問を維持。
- retired drill総数は130問。

## 本文分量

| ID | 型 | 本文語数 | 語数条件 |
|---|---|---:|---:|
| lsu26 | summary-2022 | 171 | 40語以内 |
| lsu27 | summary-2023 | 186 | 50語以内 |
| lsu28 | summary-2022 | 161 | 40語以内 |
| lsu29 | summary-2023 | 187 | 50語以内 |
| lsu30 | summary-2022 | 169 | 40語以内 |
| lsu31 | summary-2023 | 178 | 50語以内 |
| lsu32 | summary-2022 | 165 | 40語以内 |
| lsu33 | summary-2023 | 188 | 50語以内 |
| lsu34 | summary-2022 | 164 | 40語以内 |
| lsu35 | summary-2023 | 170 | 50語以内 |
| lsu36 | summary-2022 | 157 | 40語以内 |
| lsu37 | summary-2023 | 181 | 50語以内 |
| lsu38 | summary-2022 | 155 | 40語以内 |
| lsu39 | summary-2023 | 181 | 50語以内 |
| lsu40 | summary-2022 | 158 | 40語以内 |

## 監査1

- `node tests/summary15-loop4-audit.mjs`: PASS
- active summary 15問: PASS
- active ID `lsu26`〜`lsu40`: PASS
- 旧 `lsu11`〜`lsu25` retired: PASS
- 本文分量:
  - 2022型: 150〜210語
  - 2023型: 170〜230語
- 解説ラベル: PASS
- モデル答案語数: PASS

判定: CLEAN

## 独立再精査

別ディレクトリへZIP再展開後、同じruntime順で再確認。

- `node tests/summary15-loop4-audit.mjs`: PASS
- `node tests/detail20-loop1-audit.mjs`: PASS
- `node tests/rebuttal16-loop3-audit.mjs`: PASS
- `node tests/original-loop4-audit.mjs`: PASS

判定: CLEAN

## 結論

`summary` 15問に限って、修正 → 精査 → CLEAN → 独立再精査 → CLEAN を達成。

ただし、これはsummary分野のみのCLEANであり、プロジェクト全体CLEANではない。
