# CONTEXT10_AUDIT_LOOP2_CLEAN

## Scope
- Skill: `context` / 文脈
- Input base: `waseshibu-english-v0.18.2-emotion10-loop4-clean.zip`
- Output: `waseshibu-english-v0.18.2-context10-loop2-clean.zip`
- Status: CLEAN x2 for `context` 10 active items only.

## Source requirement
This loop follows the handoff rule that UI weakness labels must be preserved while internal subtypes may be refined. It also applies the specific `context` rule: 文脈 = 空所前後から語句・発言を選ぶ。単純な感情語当てだけにしない。

## Past-paper comparison used during the loop
Past-paper context/blank items used as comparison targets:

1. 2026 大問7 問1
   - Form: choose the most appropriate utterance in a dialogue/narrative.
   - Processing: Arthur's rejection of the offer and immediate action with the box determine the natural response.
   - Required skill: dialogue/context fit, not keyword matching.

2. 2026 大問7 問2
   - Form: choose the word that fits Arthur's reaction.
   - Processing: the surrounding conversation shows that the offer morally troubles him.
   - Required skill: select a word/phrase that fits local context.

3. 2024 大問4 / 2026 大問6
   - Form: a blank inside a dialogue, with the next speaker's reaction after the blank.
   - Processing: the blank must fit both the previous claim and the following response.
   - Required skill: dialogue continuity.

4. 2024 大問6 / 2022-2023 explanatory passages
   - Form: select a sentence/phrase that fits the paragraph flow.
   - Processing: use preceding topic + following `This`/examples/result to choose the sentence.
   - Required skill: context-sentence cohesion.

## First audit result
The old active context items were all retired:
- `cx01`, `cx02`, `xcx1`, `xcx2`, `xcx3`, `xcx4`, `xcx5`, `xcx6`, `xcx7`, `xcx8`

Reason:
- They were mostly short emotion-word or one-word vocabulary items.
- Many overlapped with `emotion` or `reason`.
- They did not adequately represent "空所前後から語句・発言を選ぶ".

## Fix
Added 10 new active context items:

| ID | targetId | Main process |
|---|---|---|
| `lcx01` | `context-dialogue-fit` | Deadline + locked classroom -> natural next action |
| `lcx02` | `context-dialogue-fit` | Correct misunderstanding about event cancellation |
| `lcx03` | `context-lexical-fit` | Situation with too many people -> crowded |
| `lcx04` | `context-sentence-fit` | tool-lending service + following This |
| `lcx05` | `context-sentence-fit` | experiment problem -> fair-test correction |
| `lcx06` | `context-dialogue-fit` | heavy box + no elevator -> offer to help |
| `lcx07` | `context-lexical-fit` | latest official information -> reliable |
| `lcx08` | `context-sentence-fit` | science-only expectation vs multi-subject examples |
| `lcx09` | `context-dialogue-fit` | new information -> practical advice |
| `lcx10` | `context-lexical-fit` | old map causing wrong classrooms -> confusing |

Internal distribution:
- `context-dialogue-fit`: 4
- `context-lexical-fit`: 3
- `context-sentence-fit`: 3

## Sample comparison

### Past paper: 2026 大問7 問1
The past paper asks for the best content in a blank after Mr. Steward asks, "Don’t you want to think about it for a day or two?" Arthur then gives back the box and rejects the offer. The correct response must match that action.

### Similar original item: `lcx01`
Leo has not sent the file because it is saved on the locked classroom computer. The teacher will check it before lunch tomorrow. The blank asks what he will do. The correct answer is to go early tomorrow and send it before the check.

Comparison:
- Both require a natural utterance/action from previous conditions.
- Both are not simple emotion/vocabulary items.
- Both use dialogue context and action logic.

### Past paper: 2026 大問7 問2
Arthur's reaction to the button offer is selected from the surrounding moral rejection of the offer.

### Similar original item: `lcx02`
Aya misunderstands the science fair as canceled. Ben clarifies that only the outdoor part was canceled and projects will still be shown in the gym. The correct blank confirms that the place changed but the event still happens.

Comparison:
- Both require choosing a phrase from surrounding context.
- Both depend on information update ("not canceled entirely" / "morally unacceptable").
- Distractors contradict the updated information.

### Past paper: 2024/2026 dialogue blank patterns
The blank must connect the previous speaker's opinion and the following speaker's reaction.

### Similar original item: `lcx09`
Haru wants to join a club but thinks he needs his own camera. Nina adds new information that school cameras are available. The blank selects the practical advice: talk to the teacher before giving up.

Comparison:
- The blank is constrained by both previous misunderstanding and new information.
- It is dialogue-fit, not one-word feeling selection.

## Explanation quality
All 10 active context items include:
1. 正解
2. 設問和訳
3. 根拠英文
4. 根拠英文和訳
5. なぜ正解か
6. 他選択肢が違う理由
7. 元弱点とのつながり
8. 戦略分類A/B/C（非公式）

## Non-destructive policy
- Old context items are not deleted.
- Old items are marked retired and legacyCompletion.
- Existing attempts/3-3/mastery facts are preserved.
- Active total remains 283.

## Test results

### Clean 1
- `node tests/audit.mjs`: PASS
- `node tests/detail-audit.mjs`: PASS
- `node tests/detail20-loop1-audit.mjs`: PASS
- `node tests/rebuttal16-loop3-audit.mjs`: PASS
- `node tests/summary15-loop4-audit.mjs`: PASS
- `node tests/original-loop4-audit.mjs`: PASS
- `node tests/reason10-loop3-audit.mjs`: PASS
- `node tests/emotion10-loop4-audit.mjs`: PASS
- `node tests/context10-loop2-audit.mjs`: PASS

### Independent re-audit
The output ZIP was re-extracted and the same runtime script order was used to reconstruct `window.DRILLS`.
- Active drills: 283
- Retired drills: 157
- Active context: 10
- Active context IDs: `lcx01`-`lcx10`
- Old context IDs retired: PASS
- UI skill preserved as `context`: PASS
- Internal targetIds distributed as 4/3/3: PASS
- Explanation 8 fields: PASS

## Final judgment
`context` 10 items: CLEAN x2.

This is not a project-wide CLEAN. Remaining fields still need their own individual loops.
