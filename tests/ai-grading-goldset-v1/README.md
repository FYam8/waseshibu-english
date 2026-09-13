# English AI Grading Development Set v1

Purpose: develop and validate a low-token semantic grader for the free-response English writing items in the Waseda Shibuya Singapore entrance-exam trainer.

## Status: PROVISIONAL DEVELOPMENT SET

This dataset is synthetic and was created during grader development. Its labels have **not yet been independently human-adjudicated**, so benchmark numbers from it must not be presented as final grading accuracy.

Use this set to compare prompt candidates and find failure modes. After the prompt/routing policy is frozen, create a separate unseen holdout set and adjudicate it independently before making a production-quality claim.

## Scope

This first development set covers two 24-point rebuttal-writing questions:

- `2024:4`: summarize B's opposition to allowing mobile phones at school, then rebut it. The exam instruction requires English and a maximum of 60 words.
- `2026:6`: summarize Ken's preference for professional cleaners, then rebut it. The exam instruction asks for about 50 words.

The repository contains official answer examples for both questions, but this dataset does **not** invent an official 24-point breakdown. It labels semantic/language components only. Numeric app scoring must be calibrated later and clearly shown as an app-estimated score unless an official detailed rubric is verified.

## Compact AI target

The AI grader should return only:

`[S1,S2,R1,R2,X,G]`

Where:

- `S1`: opponent's core stance.
- `S2`: at least one material reason supporting the opponent's stance.
- `R1`: an actual rebuttal or material qualification, not simple agreement.
- `R2`: a relevant reason, example, rule, compromise, or alternative supporting the rebuttal.
- `X`: major source distortion or material self-contradiction.
- `G`: English-language clarity only.

For `S1/S2/R1/R2`:

- `0` absent
- `1` supported
- `2` contradicted/materially wrong
- `3` unclear/mixed

For `X`:

- `0` none
- `1` major contradiction/distortion

For `G`:

- `0` English is clear enough
- `1` minor grammar/spelling errors but meaning remains clear
- `2` English is materially impaired or the response is materially non-English

### Word count / response format is NOT an AI field

Do not ask the model to count words. Word-count and deterministic format checks belong in local code.

- For `2024:4`, `>60` words is a deterministic hard-limit flag.
- For `2026:6`, the instruction says "about 50 words" but the repository does not provide a verified hard scoring cutoff. Record the count locally; do not invent a numeric penalty threshold.

This separation keeps the AI prompt smaller and avoids wasting model calls on deterministic checks.

## Routing policy

There are two distinct routing stages:

1. **Pre-AI local checks**: blank input, technical input limits, obvious prompt-injection patterns if desired, and deterministic format metadata.
2. **Post-L1 semantic escalation**: send to L2 when the L1 result contains any `3` in `S1..R2`, `X=1`, `G=2`, or the L1 output is malformed.

Do **not** escalate merely because an answer contains `not`, `n't`, `but`, or `however`. Negation and contrast are normal in these questions.

The case-level `risk_expectation` field is a development hint for obvious pre-AI/high-risk inputs; it is not the sole source of the post-L1 escalation decision.

## Dataset composition

There are 52 cases total: 26 per question. They include:

- official answer examples
- strong paraphrases
- valid alternative reasons
- answers without `However`
- summary-only and rebuttal-only responses
- agreement instead of rebuttal
- reversed summaries
- source distortions
- self-contradictory answers
- minor grammar/spelling errors
- major language problems
- very short / overlong answers
- prompt-injection attempts
- blank answers for local precheck

Blank cases are expected to be handled locally without an AI call.

## Prompt A/B/C preflight

`prompt-candidates.mjs` defines three semantically equivalent prompt shapes:

- A: safest/readable baseline
- B: compact natural-language version
- C: ultra-compact version

The student answer is serialized as JSON data before insertion into the prompt. This makes the answer boundary explicit and reduces prompt-injection ambiguity.

Character counts are only a rough preflight. After any prompt edit, regenerate them rather than relying on previously recorded numbers. **Actual target-model input/output token counts and grading accuracy decide the winner.**

Generate test prompts with:

```bash
node tests/ai-grading-goldset-v1/generate-prompts.mjs tests/ai-grading-goldset-v1 B L1
```

## Blind adjudication

Generate a reviewer packet that omits `expected_compact` and all model predictions:

```bash
node tests/ai-grading-goldset-v1/generate-adjudication-packet.mjs tests/ai-grading-goldset-v1 > adjudication-packet.json
```

After an independent reviewer fills labels, use `reconcile-adjudication.mjs` to compare them with the provisional development labels. See `ADJUDICATION.md`, `SECOND_REVIEW_PRIORITY.md`, and `PROVISIONAL_LABEL_REVIEW.md`.

## Cloudflare Workers AI real-model evaluation

The repository includes `run-cloudflare-eval.mjs` and a manual GitHub Actions workflow `.github/workflows/ai-grading-benchmark.yml`.

Credentials must never be committed. Provide them only as repository Actions secrets:

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`

The token should be scoped for Workers AI access only as needed.

Once the manual workflow is available on the default branch, choose **Actions → AI grading benchmark → Run workflow**. It runs A, B, and C on all 50 AI-call cases, applies L1→L2 escalation, validates each output set, compares the candidates, and uploads the raw/metric/comparison JSON files as an artifact.

Local equivalent:

```bash
export CLOUDFLARE_ACCOUNT_ID='...'
export CLOUDFLARE_API_TOKEN='...'
export CF_AI_MODEL='@cf/openai/gpt-oss-20b'

node tests/ai-grading-goldset-v1/run-cloudflare-eval.mjs tests/ai-grading-goldset-v1 A > eval-A.json
node tests/ai-grading-goldset-v1/run-cloudflare-eval.mjs tests/ai-grading-goldset-v1 B > eval-B.json
node tests/ai-grading-goldset-v1/run-cloudflare-eval.mjs tests/ai-grading-goldset-v1 C > eval-C.json
node tests/ai-grading-goldset-v1/compare-evals.mjs tests/ai-grading-goldset-v1 eval-A.json eval-B.json eval-C.json > comparison.json
```

`pricing-snapshot.json` contains a dated price snapshot only for estimating development-run cost. Re-check current provider pricing before making any budget claim.

## Candidate selection rule

A candidate is not allowed to win merely because it uses fewer tokens. The development comparator first requires:

- 100% prediction coverage;
- zero major-contradiction miss/unresolved rate;
- zero false semantic-complete rate.

Among candidates that pass those safety gates, it ranks by semantic accuracy, then exact case match, then total token usage.

This is only a **development leader**. It is not a production winner until blind adjudication and unseen holdout evaluation are complete.

## Safety/quality metrics

`validate.mjs` reports at least:

- prediction coverage
- exact case match across all AI cases
- component accuracy on valid predictions and on all AI cases
- semantic accuracy for `S1..R2`
- major contradiction miss-or-unresolved rate
- false **semantic-complete** rate (not a claim of official full credit)
- expected L2 escalation cases and missed/unresolved escalation rate
- declared word-count mismatches
- deterministic hard word-limit violations

Missing/malformed outputs must never disappear from denominators in a way that makes accuracy look artificially high.

## Development vs final evaluation

Do not use the same 52 cases both to tune A/B/C and to make a final accuracy claim.

Recommended sequence:

1. independently adjudicate this 52-case development set;
2. compare A/B/C and freeze prompt + routing policy;
3. create a new unseen holdout set;
4. independently adjudicate the holdout without model predictions;
5. run the frozen grader once on holdout;
6. decide production readiness from holdout safety + accuracy + token/cost metrics.

`HOLDOUT_PLAN.md` reserves the 2025 rebuttal-writing item for the unseen same-format holdout. 2019–2023 are reserved for later cross-format generalization work.

## Source files

The development set is grounded in the current repository's `data.js`, `manual-guides.js`, and `app.js`. The official answer examples used here are already recorded in `manual-guides.js`. The current app still stores manual scores in `S.manual`; this PR does not change production grading or storage behavior.
