# EMOTION10_AUDIT_LOOP2_CLEAN

## Scope

対象は `emotion` / 心情 10問のみ。プロジェクト全体のCLEANではない。

## Past-paper comparison basis

- 2024年度大問5問3: 前夜の失敗、帰宅後の言動、翌朝の認識から心情を判断する。
- 早稲渋対策方針: 心情は、感情語を本文にそのまま書かず、行動・発言・状況変化から判断させる。

## Changes

Retired non-destructively:

- `em01`, `em02`
- `xem1`〜`xem8`

Added new active items:

- `lem01`〜`lem10`

## Design

All new items:

- keep `skill: "emotion"` so existing UI weakness category remains unchanged
- use new IDs, not destructive overwrites
- include `targetId: "emotion-inference"`
- include `focusTag` for reaction, change, action, and social-context inference
- avoid direct emotion words in the prompt
- require 3〜6文程度の状況・行動・結果の読解
- use four-choice format
- include explanation labels:
  - 正解
  - 設問和訳
  - 根拠英文
  - 根拠英文和訳
  - なぜ正解か
  - 他選択肢
  - 弱点
  - 戦略

## Audit loop

### 修正 → 精査 → CLEAN

- `node tests/audit.mjs`: PASS
- `node tests/detail-audit.mjs`: PASS
- `node tests/detail20-loop1-audit.mjs`: PASS
- `node tests/rebuttal16-loop3-audit.mjs`: PASS
- `node tests/summary15-loop4-audit.mjs`: PASS
- `node tests/original-loop4-audit.mjs`: PASS
- `node tests/reason10-loop3-audit.mjs`: PASS
- `node tests/emotion10-loop2-audit.mjs`: PASS

Result: CLEAN.

### 独立再精査 → CLEAN

ZIP化前と同じ構成を別ディレクトリで読み直し、`index.html` のscript順でruntimeを再構成して検査。

- active total: 283
- retired total: 146
- active emotion: `lem01`〜`lem10`
- retired legacy emotion: `em01`, `em02`, `xem1`〜`xem8`

Result: CLEAN.

## Final judgment

`emotion` / 心情10問に限り、CLEAN ×2 達成。

ただし、これは全体CLEANではない。次工程では `context` / 文脈、または `connector` / 接続関係の個別監査に進む。
