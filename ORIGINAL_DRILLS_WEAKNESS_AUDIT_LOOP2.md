# ORIGINAL_DRILLS_WEAKNESS_AUDIT_LOOP_2

実行日時: 2026-09-02 16:47+01:00

## Scope

- 対象: `waseshibu-english-v0.18.2-detail-reviewed2.zip`
- 作業目的: 前回 NOT CLEAN の原因を受けた、再修正 → 精査 → 独立再精査
- 注意: このレポートはオリジナル類題全体の精査であり、detail単独の実装テストとは分ける。

## 修正

### 修正1: `insertion-cohesion` を UI skill から外した

前回監査で、`nin01`〜`nin05` が `skill: "insertion-cohesion"` として残り、UI上の既存弱点分野を増やす恐れがあった。

修正後:

- `skill: "insertion"`
- `targetId: "insertion-cohesion"`
- `focusTag` は維持

対象ID:

`nin01, nin02, nin03, nin04, nin05`

これは問題本文の大幅変更ではなく、分類フィールドの修正。既存attemptを上書きしない非破壊方針に抵触しない。

## 実装整合性チェック

### 既存自動監査

- `node tests/audit.mjs`: PASS
- `node tests/detail-audit.mjs`: PASS

### 実行時DRILLS集計

- active: 283
- retired: 17
- `insertion-cohesion` skill: 0
- `insertion` skill: 14

| skill | active count |
|---|---:|
| `connector` | 11 |
| `content_match` | 16 |
| `context` | 10 |
| `detail` | 20 |
| `emotion` | 10 |
| `example` | 10 |
| `extract` | 11 |
| `insertion` | 14 |
| `paraphrase` | 11 |
| `pronunciation` | 16 |
| `reason` | 10 |
| `rebuttal` | 16 |
| `reference` | 9 |
| `reorder` | 47 |
| `sentence_completion` | 16 |
| `stress` | 14 |
| `summary` | 15 |
| `vocab_definition` | 13 |
| `writing_completion` | 14 |

## 精査1

判定: **NOT CLEAN**

理由:

1. UI skill不整合は修正済み。
2. しかし、解説最低基準の未達が大量に残る。
3. `summary`, `rebuttal`, `reason`, `vocab_definition`, `content_match`, `insertion` は、依然として元依頼で指摘された構造問題を持つ。
4. detailは方向性は改善済みだが、全20問の解説が厳密な8項目基準に未到達。

### 解説最低基準の機械的チェック

選択式・複数選択式について、以下8項目を明示ラベルとして検査した。

- `【正解】`
- `【設問和訳】`
- `【根拠英文】`
- `【根拠英文和訳】`
- `【なぜ正解か】`
- `【他選択肢】`
- `【弱点】`
- `【戦略】`

| skill | choice/multi items | 8項目完備 | `【正解】`あり |
|---|---:|---:|---:|
| `connector` | 11 | 0 | 0 |
| `content_match` | 16 | 0 | 0 |
| `context` | 10 | 0 | 0 |
| `detail` | 20 | 0 | 20 |
| `emotion` | 10 | 0 | 0 |
| `example` | 10 | 0 | 0 |
| `insertion` | 14 | 0 | 0 |
| `paraphrase` | 11 | 0 | 0 |
| `pronunciation` | 16 | 0 | 0 |
| `reason` | 10 | 0 | 0 |
| `reference` | 9 | 0 | 0 |
| `stress` | 14 | 0 | 0 |
| `vocab_definition` | 8 | 0 | 0 |

結論: 8項目完備は **0問**。  
これは実装の動作不具合ではないが、引き継ぎ指示の解説最低基準としては **FAIL / MAJOR_EDIT**。

### 分野別の残課題

| 分野 | 残課題 | 判定 |
|---|---|---|
| 内容把握/detail | 4クラスタ化・retire方針は改善。ただし解説8項目未達、`rdt_pe03` の中心処理、`nd02/nd06` の直示原因問題を再検討 | HOLD |
| 要約/summary | 旧10問は要約済み材料。新5問だけ本番型に近い | MAJOR_EDIT/REPLACE |
| 要約＋反論/rebuttal | 旧11問は相手主張が一文圧縮。新5問だけ本番型に近い | MAJOR_EDIT/REPLACE |
| 内容一致/content_match | 旧11問は短文照合中心。新5問も根拠範囲はまだ軽い | MAJOR_EDIT |
| 文挿入/insertion | skill修正済み。ただし解説で根拠2つを明示する形式が不足 | MAJOR_EDIT |
| 理由/reason | 10問中7問に because / so that / to などの理由直示がある | MAJOR_EDIT |
| 英文定義/vocab_definition | 13問中8問が四択。頭文字＋記述型でない | MAJOR_EDIT |
| 語句整序/reorder | 素材は活かせるが本番の指定位置回答・構文解説を追加する必要 | LIGHT_EDIT |
| 発音/pronunciation | 形式は近い。正解一意性と解説強化の確認が必要 | KEEP候補 |
| アクセント/stress | 形式は近い。正解一意性と解説強化の確認が必要 | KEEP候補 |

## 独立再精査

判定: **NOT CLEAN**

別観点として、以下を確認した。

1. UI弱点分野を増やす不整合は消えた。
2. active数283、retired数17は維持。
3. ただし、オリジナル類題全体については、初期依頼の中心である「元問で必要だった思考処理を再現する」検査が detail以外で未実施。
4. `summary` と `rebuttal` は、元依頼で「最重要修正」とされたにもかかわらず旧問が残存。
5. 解説最低基準を満たした状態での2回連続CLEANには到達していない。

## CLEAN status

| 段階 | 結果 |
|---|---|
| 修正 | `nin01`〜`nin05` の skill 修正 |
| 精査 | NOT CLEAN |
| 独立再精査 | NOT CLEAN |
| CLEAN連続回数 | 0 |

## 次に必要な修正

次回の修正対象は、Severity × User impact × 戦略重要度で以下の順。

1. `summary` 旧10問を本番型へREPLACEまたはMAJOR_EDIT
2. `rebuttal` 旧11問を会話型へREPLACEまたはMAJOR_EDIT
3. `reason` の直示原因問題7問を、前後文脈から理由を復元する問題へ置換
4. `vocab_definition` の四択8問を頭文字＋記述へ変更
5. 選択式全体の解説最低基準を満たすテンプレートへ改修
6. detail全20問を、元問別の evidence span / distractor structure まで再照合

## 結論

今回の精査ループで、前回の重大な分類不整合 `insertion-cohesion` skill は修正済み。

ただし、オリジナル類題全体はまだ CLEAN ではない。  
`v0.18.2-detail-reviewed2` は引き続き **HOLD / review candidate** 扱いにする。
