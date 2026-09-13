# Holdout plan

## Purpose

Prevent prompt overfitting while developing the low-token English free-response grader.

## Development set

Use only:

- `2024:4` rebuttal writing
- `2026:6` rebuttal writing

These cases may be inspected while tuning prompt candidates A/B/C, routing, parsing, and local checks.

## Reserved unseen holdout

Reserve the **2025 rebuttal-writing item** for final same-format evaluation.

Rules:

1. Do not add the 2025 source text, answer examples, or synthetic 2025 answers to A/B/C prompt tuning.
2. Freeze the prompt candidate, compact rubric shape, L1→L2 routing policy, parser, and local deterministic checks before creating the 2025 holdout cases.
3. Create the 2025 holdout answers only after freeze.
4. Blind-adjudicate the holdout without showing model predictions.
5. Run the frozen grader once on the holdout.
6. Do not revise the frozen grader based on holdout results and then reuse the same holdout as evidence. If a redesign is necessary, treat that holdout as development data and create a new unseen holdout.

## Cross-format generalization

After same-format readiness is demonstrated on the reserved 2025 holdout, evaluate the other writing generations separately:

- 2022–2023: summary writing
- 2019–2021: writing completion

These formats need their own semantic targets and should not inherit the rebuttal rubric mechanically.

## Production gate

Do not enable AI scoring in the live app solely from development-set results. Production readiness requires:

- independently adjudicated labels;
- frozen-grader unseen holdout performance;
- zero or acceptably bounded high-severity false-positive behavior;
- measured token/cost data on the target model;
- self-grading fallback retained for API failure / unresolved cases;
- no breaking change to existing learning-history storage.
