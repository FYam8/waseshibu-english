# SOUND30_AUDIT_LOOP3_CLEAN

## 対象

- pronunciation: 16問
- stress: 14問
- 合計: 30問

## 前回CLEAN解除の理由

過去問比較を後から行った結果、以下が見つかった。

1. `lst01` が2025年度アクセント過去問と4語完全一致
   - 過去問: problem / reduce / climate / weather
   - 類題: problem / climate / reduce / weather
2. `lst14` が2024年度アクセント過去問と4語完全一致
   - 過去問: continue / passenger / accident / finally
   - 類題: accident / continue / passenger / finally
3. `lpr03` が2025年度 g 発音問題にやや近い
   - 過去問: gesture / globally / greet / gate
   - 類題: gesture / goat / great / gate

## 今回の修正

| 旧ID | 処理 | 新ID | 内容 |
|---|---|---|---|
| `lpr03` | 非破壊retire | `lpr17` | soft g / hard g の中心技能を維持しつつ、giant / garden / gold / gum に変更 |
| `lst01` | 非破壊retire | `lst15` | 第1音節3語＋第2音節1語の処理を維持しつつ、teacher / window / arrive / market に変更 |
| `lst14` | 非破壊retire | `lst16` | 第1音節3語＋第2音節1語の処理を維持しつつ、family / believe / animal / holiday に変更 |

## 過去問比較

### 2025年度 発音 g

過去問は gesture / globally / greet / gate の g の発音差を問う。
今回の `lpr17` は giant / garden / gold / gum とし、/dʒ/ と /g/ の識別処理は維持しつつ、4語完全一致と語句の近すぎを回避した。

### 2025年度 アクセント

過去問は problem / reduce / climate / weather。
今回の `lst15` は teacher / window / arrive / market とし、第1音節アクセント3語と第2音節アクセント1語を比較する処理だけを再現した。

### 2024年度 アクセント

過去問は continue / passenger / accident / finally。
今回の `lst16` は family / believe / animal / holiday とし、第1音節アクセント3語と第2音節アクセント1語を比較する処理だけを再現した。

## 精査結果

- active類題数: 283問維持
- retired類題数: 321問
- 音声知識 active: 30問
- pronunciation active: 16問
- stress active: 14問
- 過去問4語完全一致セット: 0件
- 発音正解位置: 0/1/2/3 各4問
- stress正解位置: 分散維持
- 既存履歴: 非破壊retireにより保持

## 実行テスト

全24テストPASS。

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
- sound30-loop2-audit.mjs
- sound30-loop3-pastpaper-audit.mjs
- その他既存回帰テスト

## 判定

音声知識セット30問について、修正 → 精査 → CLEAN → 独立再精査 → CLEAN を達成。
ただし、これは音声知識セットに限る。プロジェクト全体の最終統合CLEANは別工程。
