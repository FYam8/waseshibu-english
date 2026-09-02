# 要約＋反論 16問 精査ループ2

対象ベース: `waseshibu-english-v0.18.2-detail20-loop1.zip`

## 結論

判定: **要約＋反論 16問に限り CLEAN ×2**

- 修正 → 精査 → CLEAN: 達成
- 独立再精査 → CLEAN: 達成
- 全体CLEANではない。対象は `skill: "rebuttal"` の有効16問のみ。

## 実施内容

### 1. `nrb01〜nrb05`

個別精査ループ1で MAJOR_EDIT 判定だったため、削除ではなく非破壊retireにした。

- `retired: true`
- `retiredBy: "rebuttal16-loop2"`
- `legacyCompletion: true`
- `retireReason` 付与

理由:
- 相手発言が短く、本番型の「主張＋理由2つ程度＋補足」の負荷に不足。
- `lrb` 群とテーマ重複が大きい。
- 既存attempt・3/3・mastery保護のため物理削除しない。

### 2. 新ID追加

`lrb12〜lrb16` を新規追加。

| ID | テーマ | 形式 |
|---|---|---|
| lrb12 | オンライン授業 | 2024型・60語以内 |
| lrb13 | 学生のアルバイト | 2025型・約50語 |
| lrb14 | 上位者だけの表彰 | 2025型・約50語 |
| lrb15 | 教室カメラ | 2026型・約50語 |
| lrb16 | 科目完全自由選択 | 2026型・約50語 |

全問で以下を満たすようにした。

- 相手発言に主張あり
- 理由2つ程度あり
- 補足情報あり
- 生徒が「要点選択 → 要約 → 反論」を行う必要あり
- `【オリジナル類題】` 明記
- `model` 付与
- `check` 5項目以上
- maxWords 内の答案例

### 3. `lrb01〜lrb11`

問題本文は本番型に近いためKEEP方向。  
ただし解説が薄かったため、英作文用8項目に補強した。

追加した解説項目:

1. 語数
2. 設問条件
3. 良い点
4. 優先修正点
5. 文法・語法
6. 最小限修正版
7. 高得点答案例
8. 合格戦略上の評価

## 精査1

実行テスト:

- `node tests/audit.mjs`
- `node tests/detail-audit.mjs`
- `node tests/detail20-loop1-audit.mjs`
- `node tests/original-loop4-audit.mjs`
- `node tests/rebuttal16-loop2-audit.mjs`

結果: **PASS / CLEAN**

確認内容:

- active類題数283維持
- retired類題数100
- `nrb01〜nrb05` が非破壊retire
- active `rebuttal` が16問
- active IDが `lrb01〜lrb16`
- 8項目解説が全問に存在
- 新規5問は主張＋理由＋補足を含む
- UI上のskillは `rebuttal` 維持

## 独立再精査

ZIP化後、別ディレクトリへ再展開して同一テスト群を実行。

結果: **PASS / CLEAN**

確認内容:

- 再展開後も active 283
- 再展開後も retired 100
- 再展開後も active `rebuttal` 16問
- 再展開後も `nrb01〜nrb05` はretired
- 再展開後も `lrb12〜lrb16` がactive
- 既存履歴保護方針に反するID上書きなし

## CLEAN状況

| 対象 | 判定 |
|---|---|
| 要約＋反論16問 | CLEAN ×2 |
| プロジェクト全体 | NOT CLEAN継続 |

## 残課題

今回の対象外として、以下はまだ全体CLEANではない。

- 要約
- 理由
- 英文定義
- 内容一致
- 文挿入
- 指示語
- 文脈
- 心情
- 語句整序
- 発音・アクセント
- その他skillのmapping・解説監査
