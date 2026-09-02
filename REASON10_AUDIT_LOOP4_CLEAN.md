# REASON10_AUDIT_LOOP4_CLEAN

## 対象

弱点分野: `reason` / 理由  
対象active類題: 10問

## 前回NOT CLEANの理由

`lrs02` と `lrs04` が、過去問の理由問題に比べてやや軽かった。

- `lrs02`: 危険表示が正解選択肢に直結しやすい
- `lrs04`: パソコン故障とケーブル忘れが正解に直結しやすい

理由問題の基準は、`because` 直後を拾うのではなく、前後2〜4文の状況から行動・反応・判断の原因を復元すること。

## 修正

### 非破壊retire

- `lrs02`
- `lrs04`

いずれも削除せず、`retired: true` / `legacyCompletion: true` を付与。既存attempt・3/3・masteryの事実を壊さない。

### 新ID追加

- `lrs15`
- `lrs16`

## 新問の設計

### lrs15

通常使う橋について、友人の情報だけでなく、現場の工事、コーン、引き返す生徒という複数情報から、遠回りを選んだ理由を判断する問題。

対応する過去問型:
- 2024大問5問2: 反応の理由を描写から判断
- 2026大問7問3: 行動の理由を前後文脈から判断

### lrs16

レポート送信の遅れについて、完成ファイルの保存場所、充電ケーブル、提出条件、翌朝の行動を時系列で結びつけて判断する問題。

対応する過去問型:
- 2025大問5問5: 行動理由を物語の文脈から判断
- 2026大問7問3: その後の行動まで含めて理由を判断

## 精査1

実施内容:

- active類題数 283維持
- retired類題数 136
- active reason 10問
- `lrs02` / `lrs04` が非破壊retire済み
- `lrs15` / `lrs16` がactive
- 解説8項目確認
- `because / so that / in order to` による理由直示がないことを確認
- lrs15は複数状況証拠あり
- lrs16は時系列・提出条件・ファイル所在証拠あり

結果: CLEAN

## 独立再精査

ZIP相当ディレクトリを別視点で再読み込みし、`index.html` のscript順にruntime `window.DRILLS` を構成して再確認。

実行テスト:

- `node tests/audit.mjs`
- `node tests/detail-audit.mjs`
- `node tests/detail20-loop1-audit.mjs`
- `node tests/rebuttal16-loop3-audit.mjs`
- `node tests/summary15-loop4-audit.mjs`
- `node tests/original-loop4-audit.mjs`
- `node tests/reason10-loop2-audit.mjs`
- `node tests/reason10-loop3-audit.mjs`

結果: CLEAN

## 最終判定

`reason` 10問に限り、修正 → 精査 → CLEAN → 独立再精査 → CLEAN を達成。

ただし、プロジェクト全体CLEANではない。
