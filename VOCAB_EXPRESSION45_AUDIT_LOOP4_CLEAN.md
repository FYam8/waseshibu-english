# VOCAB_EXPRESSION45_AUDIT_LOOP4_CLEAN

## Scope
語彙・表現セット45問（vocab_definition 13 / extract 11 / paraphrase 11 / example 10）の訂正・精査ループ。

## Previous HOLD reason
過去問比較で以下2点をHOLDに戻した。

1. `let01`
   - 設問が「自然に分解する」に当たる英語1語を問うていたが、正解 `naturally` は「自然に」に対応する語。
   - `break down naturally` 全体で「自然に分解する」なので、1語指定との対応が不自然。

2. `lex11`
   - 2025年度大問6の `barriers / uniforms / girls' activity / cartwheels` に題材・正解方向が近すぎた。
   - 中心技能は合うが、オリジナル類題として過去問模倣リスクがある。

## Correction
### let01
- 同一IDで問題意図を変えない軽微修正。
- 設問を「『自然に』に当たる英語1語」に修正。
- 正解 `naturally` を維持。
- 解説で `break down` は「分解する」で2語句、今回の1語指定は `naturally` と明示。

### lex11
- 非破壊retire。
- `retiredReason = vocab45_correction_loop4_too_close_to_2025_barriers_uniforms`
- `legacyCompletion = true`
- 新ID `lex21` を追加。
- 題材を制服・女子・運動量から離し、地域センターの高齢者向けPC教室と、オンライン申込フォームが参加の妨げになる場面へ変更。
- 中心処理は「抽象概念 barrier → 本文中の具体例特定」を維持。

## Past-paper comparison
- 2025年度大問6の `barriers` 具体例問題は、制服が活動参加を妨げる例を選ぶ問題。
- `lex21` は、ウェブ申込フォームと小さい説明文字が高齢者の参加を妨げる例を選ぶ。
- 話題は独立しつつ、抽象概念を本文中の具体例へ落とす処理を維持。

## Runtime audit
- active drills: 283
- retired drills: 247
- vocab_definition active: 13
- extract active: 11
- paraphrase active: 11
- example active: 10
- active examples: lex12-lex20, lex21
- lex11 retired: PASS
- let01 prompt/answer alignment: PASS

## Tests
PASS:
- audit.mjs
- detail-audit.mjs
- detail20-loop1-audit.mjs
- rebuttal16-loop3-audit.mjs
- summary15-loop4-audit.mjs
- reason10-loop3-audit.mjs
- emotion10-loop4-audit.mjs
- context10-loop2-audit.mjs
- reading50-loop3-audit.mjs
- vocab45-loop3-audit.mjs
- vocab45-correction-loop4-audit.mjs

## CLEAN result
修正 → 精査 → CLEAN
独立再精査 → CLEAN

語彙・表現セット45問に限り CLEAN ×2 達成。
プロジェクト全体はまだ未完。
