# GRAMMAR_COMPLETION77_AUDIT_LOOP3_CLEAN

## 対象
文法・完成セット77問。

| skill | 問数 |
|---|---:|
| reorder | 47 |
| sentence_completion | 16 |
| writing_completion | 14 |
| 合計 | 77 |

## 前回HOLDに戻した理由
過去問と再比較した結果、次の2点が残っていた。

1. reorder 47問がすべて2020〜2025型の「2番目・5番目」形式で、直近2026型の「文中番号空欄回答」が不足。
2. writing_completion 14問が短文寄りで、2020年度・2021年度のようなまとまった物語／説明から結末・教訓を完成する負荷が不足。

sentence_completion 16問は、過去問の日本語対応・複数空所・1語補充形式に合うため維持。

## 今回の修正

### reorder
47問中10問を2026型に変更。

- 文中に `(1)` `(2)` を置く
- 選択肢からその2箇所に入る語句を順に答える
- `examFormat: "numbered_blanks_2026"` を付与
- UI文言を `pairInstruction` / `pairAlert` で切り替え可能にした

2020〜2025型の2番目・5番目形式も37問残し、恒常傾向と直近傾向の両方を扱う形にした。

### writing_completion
旧 `lwc01〜lwc14` は削除せず非破壊retire。

新ID `lwc29〜lwc42` を追加。

- 2020型：空所(1) 5語以内 + 空所(2) 15語以内
- 2021型：空所(1)(2) 各10語以内
- 本文量を増やし、出来事・転機・結論・教訓を読む必要がある形にした
- `partLimits` を使用し、2空所入力形式にした
- 解説に語数、設問条件、過去問比較、最小限答案例、高得点答案例、合格戦略を追加

## 過去問比較

### reorder
2020〜2025年度は、[ ]内の語句を並べ替え、2番目・5番目になる語句を答える形式が中心。
一方、2026年度では、文中番号空欄に入る語句を答える形式が確認された。

今回、37問を2番目・5番目型、10問を2026番号空欄型にしたため、恒常傾向と直近傾向を両方カバーする。

### writing_completion
2020年度大問4は、まとまった物語を読んで、結末・教訓に当たる空所を語数制限内で完成する形式。
2021年度大問4も、まとまった英文から教訓文の2空所を完成する形式。

今回の `lwc29〜lwc42` は、短文の教訓当てではなく、本文全体の出来事と教訓を読み、2空所に分けて完成させる形式にした。

## 精査結果

| チェック | 結果 |
|---|---|
| active類題数 | 283 |
| retired類題数 | 276 |
| grammar/completion active | 77 |
| reorder active | 47 |
| reorder 2026型 | 10 |
| sentence_completion active | 16 |
| writing_completion active | 14 |
| 旧writing_completion retire | PASS |
| 新writing_completion 2空所制約 | PASS |
| app.js pairInstruction対応 | PASS |
| 修正後精査 | CLEAN |
| ZIP再展開相当の独立再精査 | CLEAN |

## 実行テスト
以下を含む全テストをPASS。

- audit.mjs
- detail-audit.mjs
- detail20-loop1-audit.mjs
- rebuttal16-loop3-audit.mjs
- summary15-loop4-audit.mjs
- reason10-loop3-audit.mjs
- emotion10-loop4-audit.mjs
- context10-loop2-audit.mjs
- reading50-loop3-audit.mjs
- vocab45-correction-loop4-audit.mjs
- grammar-completion77-loop2-audit.mjs
- grammar-completion77-loop3-audit.mjs

## 判定
文法・完成セット77問に限っては、CLEAN ×2達成として扱える。

ただし、プロジェクト全体の残りは音声知識セット30問。
