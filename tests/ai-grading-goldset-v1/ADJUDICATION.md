# Adjudication protocol

The 52 cases in this directory are a **provisional development set**, not yet an independently human-adjudicated gold standard.

## Goal

Create trustworthy target labels for `[S1,S2,R1,R2,X,G]` without allowing model predictions to influence the human judgment.

## Reviewer procedure

For each case, the reviewer should see only:

1. the original question instruction;
2. the opponent/source text;
3. the semantic target definitions;
4. the student answer;
5. the grader codebook from `grader-schema.json`.

The reviewer should **not** see:

- the current `expected_compact` value;
- any A/B/C model prediction;
- any numeric app-estimated score.

The reviewer independently assigns `[S1,S2,R1,R2,X,G]` and optionally records a short note for ambiguous cases.

## Resolution

- If the independent label matches the provisional label, mark the case adjudicated.
- If it differs, inspect the source text and codebook and resolve the disagreement before benchmarking.
- If the codebook itself is ambiguous, fix the codebook first, then re-review every affected case.

For high-risk cases (`X=1`, any semantic field `=3`, or `G=2`), a second independent reviewer is preferred before production use.

## Word count and format

Do not include word-count compliance in `G`.

- Word counting is deterministic local logic.
- `2024:4` has a hard maximum of 60 words and can be flagged locally.
- `2026:6` says approximately 50 words; without a verified official hard cutoff, do not invent a pass/fail threshold or numeric penalty.

## Benchmark integrity

This development set may be used to tune prompt A/B/C and routing rules. It must **not** be the sole dataset used to claim final accuracy.

After prompt/routing freeze, create a separate unseen holdout set, adjudicate it without model predictions, and run the frozen grader once. Final production-readiness claims should be based on that holdout.
