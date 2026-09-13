# English AI Grading Development Set v1

Purpose: develop and validate a low-token semantic grader for the free-response English writing items in the Waseda Shibuya Singapore entrance-exam trainer.

## Status: PROVISIONAL DEVELOPMENT SET

This dataset is synthetic and was created during grader development. Its labels have **not yet been independently human-adjudicated**, so benchmark numbers from it must not be presented as final grading accuracy.

Use this set to find grader failure modes and, after blind adjudication, compare prompt candidates. After the prompt/routing policy is frozen, use a separate unseen holdout before making a production-quality claim.

## Scope

This first development set covers two 24-point rebuttal-writing questions:

- `2024:4`: summarize B's opposition to allowing mobile phones at school, then rebut it. The exam instruction requires English and a maximum of 60 words.
- `2026:6`: summarize Ken's preference for professional cleaners, then rebut it. The exam instruction asks for about 50 words.

The repository contains official answer examples for both questions, but this dataset does **not** invent an official 24-point breakdown. It labels semantic/language components only. Numeric app scoring must be calibrated later and clearly shown as an app-estimated score unless an official detailed rubric is verified.

## Compact AI target

The AI grader returns only:

`[S1,S2,R1,R2,X,G]`

Where:

- `S1`: opponent's core stance.
- `S2`: at least one material reason supporting the opponent's stance.
- `R1`: an actual rebuttal or material qualification, not simple agreement.
- `R2`: a relevant reason, example, rule, compromise, or alternative supporting the rebuttal.
- `X`: major source distortion or material self-contradiction.
- `G`: English-language clarity only.

For `S1/S2/R1/R2`: `0=absent`, `1=supported`, `2=contradicted/materially wrong`, `3=unclear/mixed`.

For `X`: `0=none`, `1=major contradiction/distortion`.

For `G`: `0=clear enough`, `1=minor errors but meaning clear`, `2=materially impaired or materially non-English`.

## Deterministic checks stay local

Do not ask the model to count words. Word-count and deterministic format checks belong in local code.

- `2024:4`: more than 60 words is a deterministic hard-limit flag.
- `2026:6`: the instruction says about 50 words, but no verified hard scoring cutoff is stored; record the count locally and do not invent a numeric penalty threshold.
- Blank input and technical input limits are also local checks.

## Routing policy

1. Local prechecks handle blank/technical/deterministic format information.
2. L1 receives compact rubric + answer.
3. Send to L2 when L1 has any `3` in `S1..R2`, `X=1`, `G=2`, or malformed output.
4. L2 adds only the minimum source context.

Do **not** escalate merely because an answer contains `not`, `n't`, `but`, or `however`; negation and contrast are normal in these questions.

The case-level `risk_expectation` field is a development hint, not a production scoring rule.

## Dataset composition

There are 52 cases total, 26 per question. They include official examples, paraphrases, valid alternative reasons, summary-only/rebuttal-only responses, agreement instead of rebuttal, reversed summaries, source distortion, self-contradiction, language errors, short/overlong answers, prompt injection, mixed-language answers, and blank input. Blank cases are local-precheck only.

## Prompt candidates

`prompt-candidates.mjs` defines three semantically equivalent shapes:

- A: safest/readable baseline
- B: compact natural-language version
- C: ultra-compact version

Student answers are JSON-serialized as untrusted data before insertion. Character counts are only a preflight; actual target-model token usage and grading behavior decide whether compression is worthwhile.

## Blind adjudication

Generate a reviewer packet that omits provisional labels and all model predictions:

```bash
node tests/ai-grading-goldset-v1/generate-adjudication-packet.mjs tests/ai-grading-goldset-v1 > adjudication-packet.json
```

After an independent reviewer fills labels, use `reconcile-adjudication.mjs` to compare them with the provisional development labels. See `ADJUDICATION.md`, `SECOND_REVIEW_PRIORITY.md`, and `PROVISIONAL_LABEL_REVIEW.md`.

## Cloudflare Workers AI trial

The repository includes `run-cloudflare-eval.mjs` and `.github/workflows/ai-grading-benchmark.yml`.

Credentials must never be committed. Provide them only as repository Actions secrets:

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`

Use a token limited to the Workers AI permissions needed for inference. The benchmark workflow only runs its secret-bearing job from `main`.

The current trial defaults to `@cf/openai/gpt-oss-20b`, temperature `0`, seed `1`, and a bounded `max_tokens=64`. The 64-token cap is a safety margin for the trial, not a target output length; actual output tokens are measured. The expected answer remains only the six-value array. Structured JSON mode is not assumed by the harness; output is validated by the strict parser so unsupported model-specific structured-output behavior cannot silently affect the comparison.

### Stage 1 — 12-answer technical pilot

Run **Actions → AI grading benchmark → Run workflow** on `main` with `scope=pilot`.

The pilot contains 12 deliberately difficult/mixed cases and runs A/B/C, so it makes 36 L1 evaluations plus any L2 escalations.

**The pilot is technical-only. It must not choose an A/B/C winner.** The comparator always sets `development_leader` to `null` for pilot scope. Pilot accuracy figures are diagnostic only because the sample is deliberately small, adversarially skewed, and still uses provisional labels.

Pilot pass checks only that the evaluation plumbing is healthy: exact pilot case set, valid final output coverage, no malformed final L2 output, and usable token telemetry. If the pilot fails, raw model output, stderr logs, metrics, and comparison JSON are still uploaded as an artifact before the workflow is marked failed.

### Stage 2 — full development comparison

Do not run the full 50-answer comparison until blind label adjudication is complete. The manual workflow enforces this: for `scope=full`, type `ADJUDICATED` in `full_confirmation`.

Full scope must contain exactly all 50 AI-call development cases. The validator rejects a subset labeled as full. Likewise, pilot scope must contain exactly the 12 IDs in `pilot-cases.json`.

Only full development scope may produce a `development_leader`. A candidate cannot win merely because it uses fewer tokens. It must first have a technical pass, 100% valid prediction coverage, zero major-contradiction miss/unresolved rate, and zero false-semantic-complete rate. Eligible candidates are then ranked by semantic accuracy, exact case match, and finally total token usage.

This is still only a **development leader**, not a production winner.

## Failure evidence

The GitHub Actions workflow preserves evidence even when a candidate, validator, or comparison fails. The uploaded artifact includes raw A/B/C JSON where available, candidate stderr logs, validation metrics, and `comparison.json`. A final gate then marks the workflow failed so errors cannot be mistaken for a passing benchmark.

## Safety/quality metrics

`validate.mjs` reports prediction coverage, exact case match, component/semantic accuracy, major contradiction miss-or-unresolved rate, false semantic-complete rate, L2 escalation misses, word-count metadata mismatches, and deterministic hard word-limit violations.

Missing/malformed outputs remain in the relevant denominators and cannot make accuracy look artificially high. Unexpected predictions outside the declared evaluation set are rejected.

## Development vs final evaluation

Recommended sequence:

1. run the 12-case **technical-only** pilot;
2. independently adjudicate the development labels;
3. if the pilot is technically healthy, run full A/B/C development comparison;
4. freeze prompt + routing policy;
5. use the unseen 2025 same-format holdout;
6. adjudicate the holdout without model predictions;
7. run the frozen grader once on holdout;
8. decide production readiness from holdout safety, accuracy, token, and cost metrics.

`HOLDOUT_PLAN.md` reserves the 2025 rebuttal-writing item for the unseen same-format holdout. 2019–2023 are reserved for later cross-format generalization work.

## Production impact

These benchmark files do not change `app.js`, the localStorage schema, grading UI, learner history, or progress sync behavior.
