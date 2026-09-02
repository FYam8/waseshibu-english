# reason 10 個別修正・精査ループ2

## 対象
- 分野: 理由 (`skill: "reason"`)
- 対象: active 10問
- 基準: `waseshibu-english-v0.18.2-summary15-loop4-clean` から継続

## 過去問との比較

理由問題は、単純な `because` 一文抜きではなく、前後の状況から行動・反応・判断の原因を復元する必要がある。

比較した過去問例:

- 2024年度 大問5 問2: Yollieの顔が青ざめた理由。直後の「black puddle」「dye was running from her dress」から、染料が流れ出したことを判断する。
- 2025年度 大問5 問5: JohnnyがBillの足にしがみついた理由。誘拐犯側が帰したがっている一方、Johnny本人はSam/Billとの遊びを続けたがっている文脈を読む。
- 2026年度 大問7 問3: Normaが破れた名刺をバッグに入れた理由。Arthurは拒否しているが、Normaはまだ申し出に興味があるという前後文脈を読む。

## 修正理由

前回の個別監査で、以下4問が LIGHT_EDIT 対象になった。

| 旧ID | 問題点 | 処理 |
|---|---|---|
| `lrs01` | 天候→紙飾りの理由は良いが、誤答構造が薄い | retire + `lrs11` |
| `lrs05` | 持ち主特定→職員室がやや直線的 | retire + `lrs12` |
| `lrs06` | 赤ちゃんが寝た→声を出さない、がやや素直 | retire + `lrs13` |
| `lrs08` | sold out表示の目的が軽い | retire + `lrs14` |

既存履歴保護のため、旧IDは削除せず `retired: true`, `legacyCompletion: true` とした。

## 追加した新ID

| 新ID | 狙い |
|---|---|
| `lrs11` | 天候変化＋紙製展示物＋開いたドアから、移動理由を判断 |
| `lrs12` | 持ち主情報＋本人不在＋周囲状況から、職員室へ届ける判断理由を読む |
| `lrs13` | オンライン会議中の行動変化を、妹の体調・時系列から推論 |
| `lrs14` | 売り切れ商品・見本・列の発生から、掲示の目的を判断 |

## 維持したID

`lrs02`, `lrs03`, `lrs04`, `lrs07`, `lrs09`, `lrs10`

これらは中心技能・根拠範囲・解答形式が妥当と判断し、activeのまま維持。

## 精査1

- `node tests/audit.mjs`: PASS
- `node tests/detail-audit.mjs`: PASS
- `node tests/detail20-loop1-audit.mjs`: PASS
- `node tests/rebuttal16-loop3-audit.mjs`: PASS
- `node tests/summary15-loop4-audit.mjs`: PASS
- `node tests/original-loop4-audit.mjs`: PASS
- `node tests/reason10-loop2-audit.mjs`: PASS

## 独立再精査

ZIP化後に別ディレクトリへ再展開し、同テストを再実行。

結果:
- active drills: 283
- retired drills: 134
- active reason: 10
- active reason IDs: `lrs02`, `lrs03`, `lrs04`, `lrs07`, `lrs09`, `lrs10`, `lrs11`, `lrs12`, `lrs13`, `lrs14`
- `lrs01`, `lrs05`, `lrs06`, `lrs08` は非破壊retire確認済み

## CLEAN判定

理由 `reason` 10問に限って:

- 修正 → 精査 → CLEAN
- 独立再精査 → CLEAN

よって `reason` 10問は CLEAN ×2 達成。

ただし、プロジェクト全体はまだCLEANではない。
