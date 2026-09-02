# GRAMMAR_COMPLETION77_AUDIT_LOOP2_CLEAN

## Scope
文法・完成セット77問:
- reorder: 47
- sentence_completion: 16
- writing_completion: 14

## Past-paper comparison criteria
語句整序は早稲渋の本番型に合わせ、全文整序だけでなく「2番目・5番目」の指定位置回答を明示する。
英語完成は、2019〜2021型の「具体例完成・物語結論・教訓完成・和文対応英文完成」に合わせる。
大幅変更は同一ID上書きではなく、非破壊retire＋新ID追加を原則とした。

## Changes
### reorder 47
- 既存素材は原則維持。
- active reorderはすべて `type: "pair"` / `examFormat: "pair"` に統一。
- 2番目・5番目の指定位置回答を `answer` に設定。
- 完成英文、全文和訳、文構造、重要構文、語順理由、指定位置、間違いやすい点を解説へ追加。
- `xro2` は語数が4語で5番目指定に合わないため非破壊retire。
- 代替として `lro48` を追加。

### sentence_completion 16
- 既存問題を維持。
- 完成英文、全文和訳、文構造、重要表現、語法理由、指定解答、別解可否、戦略を解説へ追加。

### writing_completion 14
- 旧 `wr01`, `xwc1〜xwc8`, `nwc01〜nwc05` は非破壊retire。
- 新ID `lwc01〜lwc14` を追加。
- 2019〜2021型に合わせ、具体例完成・自然な結末・教訓完成の形式に再設計。
- 語数、設問条件、良い答案の条件、優先修正点、文法語法、最小限答案例、高得点答案例、合格戦略を解説へ追加。

## Counts
- active total: 283
- retired total: 262
- grammar/completion active: 77

## Audit results
修正後精査: CLEAN
独立再精査: CLEAN

## Tests
- audit.mjs PASS
- detail-audit.mjs PASS
- detail20-loop1-audit.mjs PASS
- rebuttal16-loop3-audit.mjs PASS
- summary15-loop4-audit.mjs PASS
- reason10-loop3-audit.mjs PASS
- emotion10-loop4-audit.mjs PASS
- context10-loop2-audit.mjs PASS
- reading50-loop3-audit.mjs PASS
- vocab45-correction-loop4-audit.mjs PASS
- grammar-completion77-loop2-audit.mjs PASS

## Status
文法・完成セット77問に限り CLEAN x2.
Project全体はまだ音声知識セット30問が未完。
