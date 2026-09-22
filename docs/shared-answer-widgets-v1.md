# Shared Answer Widgets — UI 1.2.0 / widget contract 1

Baseline: Waseda main 54948540323f36c8b2c033da5c83429bb5327a24; Rikkyo main 73b6a3a1a8c4a8eb30ccbe4614551c4daf3c7630. Both repositories' engine/ and ui/ trees matched before P1.

`ui/answer-widgets.js` owns choice, multiple-choice, text, textarea, multi-slot and reorder markup; immutable selection/slot/reorder transitions; and preview refresh. Reorder positions are indices, so repeated words remain distinct. Bounds and duplicate-index checks prevent reuse of one token. Undo/clear and tokens respect disabled state, including an answered legacy drill. Clearing the order retains the typed missing-word draft, preserving existing semantics. No answer keys enter this module.

Adapters supply choice labels, native-input versus button presentation, handlers, DOM IDs, read/write state, completeness/scoring policy and manual-grading guidance. Handler strings and labelHtml/suffixHtml are trusted adapter code; question/user text is escaped before HTML output. Waseda keeps kana buttons, ordered pair answers, choice feedback, objective deadline lock and manual/AI workflow. Rikkyo keeps its compound correction format and unscored/manual policies.

## Storage compatibility

No schema/key changes. Waseda continues to store comma-delimited exam selections, selectedMany indices, textInputs, manual entries and order/orderIndices/shuffled drill fields. The adapter maps the shared reorder result back to both existing drill arrays. Existing engine normalization remains responsible for older saved drills.

Rikkyo continues to store strings, selection/slot arrays, and `{order, missing}` for word-order exam responses. Shared functions return new values; persistence/import/recovery remains school-owned. Missing-word editing refreshes the assembled answer without rerendering the focused input. FY26B holdout, practice selection, family rotation, mastery and daily state are unchanged.

## Verification

`shared-answer-widgets.test.mjs`: immutable transitions, duplicates, invalid indices, missing-word edits, undo/clear, locks, maximum selections, slot drafts, escaping and actual app delegation.

`answer-widget-browser-checks.mjs`: same test harness runs each school at 390px and 1280px, through production index on an isolated origin. Checks answer selection, text drafts, reorder controls and restoration. Waseda's obsolete full-word-order format is exercised with an explicitly synthetic local fixture; no practice bank or release selection changes. Existing G0/G1 covers all active drill formats. Rikkyo additionally checks replace/merge preservation, editing inserted missing words and all 16 FY24/FY25 surplus-word questions.

The Rikkyo adapter must recognize the declared surplus token and include source-confirmed fixed prefix/suffix when evaluating assembled answers. These are school-owned rules/data, not rules in the shared widget. Any source corrections are documented by the consumer.

P2–P4 are outside this release.
