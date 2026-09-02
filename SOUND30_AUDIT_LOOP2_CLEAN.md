# SOUND30_AUDIT_LOOP2_CLEAN

## 対象
- 発音 `pronunciation`: 16問
- アクセント `stress`: 14問
- 合計: 30問

## 過去問比較
2024年度大問3では、発音問題と第一アクセント問題が出題されている。発音は `trouble / thousand / enough / touch`、アクセントは `continue / passenger / accident / finally` 型。
2025年度大問3でも、太字 `g` の発音問題と第一アクセント問題が出題されている。発音は `gesture / globally / greet / gate`、アクセントは `problem / reduce / climate / weather` 型。

今回の音声知識セットは、過去問と同じく「4語の中から発音または第一アクセント位置が異なるものを選ぶ」形式に統一した。

## 修正内容
旧音声30問は削除せず非破壊retireした。

retire対象:
- 発音: `pr01`〜`pr08`, `xpr1`〜`xpr8`
- アクセント: `st01`〜`st06`, `xst1`〜`xst8`

新規追加:
- 発音: `lpr01`〜`lpr16`
- アクセント: `lst01`〜`lst14`

## 主な改善
1. `pr02` と `xpr2` の `young / country / touch / group` 重複を解消。
2. 発音16問の正解位置を 0/1/2/3 に各4問ずつ分散。
3. アクセント14問の正解位置も分散し、旧 `st01`〜`st06` の「すべて4番目」偏りを解消。
4. `後ろ寄り`、`語末寄り` のような曖昧説明を避け、強勢音節を明記。
5. 全問の解説を以下の要素で統一。
   - 正解
   - 設問和訳
   - 発音または強勢位置
   - 他選択肢との差
   - 元弱点とのつながり
   - A/B/C戦略分類

## 精査1
- active類題数: 283維持
- retired類題数: 318
- active音声知識: 30
- 発音: 16
- アクセント: 14
- 旧IDがactiveに残っていないことを確認
- 新IDの解説ラベルを確認
- 正解位置偏りを確認

結果: CLEAN

## 独立再精査
ZIP再展開前の全 `tests/*.mjs` を再実行し、新設 `sound30-loop2-audit.mjs` も実行。

結果:
- 全23テスト PASS
- `sound30-loop2-audit PASS`
- active 283問維持
- 音声知識30問維持
- 旧attempt保護のため旧問はretiredとして保持

結果: CLEAN

## 判定
音声知識セット30問に限り、修正 → 精査 → CLEAN → 独立再精査 → CLEAN を達成。
