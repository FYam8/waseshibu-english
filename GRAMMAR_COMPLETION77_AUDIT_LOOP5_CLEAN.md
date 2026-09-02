# GRAMMAR_COMPLETION77_AUDIT_LOOP5_CLEAN

## Scope
文法・完成セット77問のみを対象に、前回NOT CLEANになった2点を修正し、再精査した。

対象:
- reorder: 47問
- sentence_completion: 16問
- writing_completion: 14問

## Previous NOT CLEAN reasons
1. 2026型reorder 10問で、(1)の答えがすべてアに偏っていた。
2. writing_completionの一部本文が短く、2020/2021型の物語・教訓完成として情報選別負荷が軽かった。

## Fixes

### 1. Reorder answer-position bias
2026型reorder 10問について、文中(1)(2)の位置を再設計した。
旧状態では全問で(1)=アだったが、修正後は(1)の答え位置とペアが分散した。

対象:
- ro01, ro02, ro05, ro06, ro07, ro08, ro09, xro3, nr_rc1, nr_cp1

追加修正:
- nr_rc1 / nr_cp1 は、lead・tokens・prompt・explanationの不整合も補正した。

### 2. Writing completion load
短めだった旧active writing_completionを非破壊retireし、新IDで置換した。

追加retire:
- lwc30, lwc32, lwc33, lwc34, lwc35, lwc36, lwc37, lwc38, lwc39, lwc40, lwc41, lwc42

追加新ID:
- lwc43〜lwc54

active writing_completionは14問を維持。
2020型は「結末5語以内＋教訓15語以内」、2021型は「10語以内×2」を維持し、本文量・不要情報・情報選別負荷を増やした。

## Past-paper comparison basis
- reorderは2020〜2025型の「2番目・5番目」形式を維持しつつ、直近2026型の文中(1)(2)番号空欄も10問入れた。
- writing_completionは2020/2021型の「まとまった物語・説明を読んで、結末または教訓を空所に入れる」処理へ寄せた。
- sentence_completionは過去問形式と大きくずれていないため維持した。

## Verification
修正後、以下を確認した。

- active drills: 283 maintained
- retired drills: 288
- grammar/completion active: 77
- reorder: 47
- sentence_completion: 16
- writing_completion: 14
- 2026型reorder: 10
- 2026型reorderの(1)答え位置は分散
- writing_completionは2空所・語数制限・過去問比較・答案例を維持
- 既存attempt / 3/3 / mastery を壊さない非破壊retire方針を維持

## Tests
全tests/*.mjsを実行し、PASSを確認。

Main loop5 test:
- tests/grammar-completion77-loop5-audit.mjs: PASS

Regression tests:
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
- grammar-completion77-loop5-audit.mjs

## CLEAN loop result
- 修正後精査: CLEAN
- ZIP再展開後の独立再精査: CLEAN

## Judgment
文法・完成セット77問に限り、CLEAN ×2 達成として扱う。
プロジェクト全体はまだ未完。残りは音声知識セット30問。
