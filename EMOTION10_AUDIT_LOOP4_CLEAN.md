# EMOTION10_AUDIT_LOOP4_CLEAN

## Scope
心情 `emotion` active 10問のみを対象に、前回NOT CLEANになった `lem07` の題材近接を修正し、再精査した。

## 修正
- `lem07` は2024年度大問5と「school dance / 新しい服飾品を買えない / 見られる恥ずかしさ / embarrassment」が近すぎるため、非破壊retire。
- 新ID `lem11` を追加。
- `lem11` は「借りた理科模型を壊してしまった後、相手に言い出す前の罪悪感・不安」を、行動・沈黙・後続対応から判断する問題。
- 既存attempt / 3/3 / mastery保護のため、旧IDは削除せず `retired`, `legacyCompletion` を付与。

## Active emotion IDs
`lem01`, `lem02`, `lem03`, `lem04`, `lem05`, `lem06`, `lem08`, `lem09`, `lem10`, `lem11`

## Retired in this loop
`lem07`

## Checks
- active全体: 283問維持
- retired全体: 147問
- active emotion: 10問維持
- 旧 `em01`, `em02`, `xem1`〜`xem8`: retired維持
- `lem07`: retired化
- `lem11`: active追加
- 感情語の直示回避: PASS
- 四択形式: PASS
- 解説8項目: PASS
- 題材独立性: PASS

## Test results
- `node tests/audit.mjs`: PASS
- `node tests/detail-audit.mjs`: PASS
- `node tests/detail20-loop1-audit.mjs`: PASS
- `node tests/rebuttal16-loop3-audit.mjs`: PASS
- `node tests/summary15-loop4-audit.mjs`: PASS
- `node tests/original-loop4-audit.mjs`: PASS
- `node tests/reason10-loop3-audit.mjs`: PASS
- `node tests/emotion10-loop4-audit.mjs`: PASS
- ZIP再展開後の独立再精査: PASS

## CLEAN verdict
`emotion` 10問に限り、修正 → 精査 → CLEAN → 独立再精査 → CLEAN を達成。
プロジェクト全体CLEANではない。
