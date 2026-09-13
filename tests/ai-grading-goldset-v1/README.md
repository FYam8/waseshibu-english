# English AI Grading Gold Set v1

Purpose: validate a low-token semantic grader for the free-response English writing items in the Waseda Shibuya Singapore entrance-exam trainer.

## Scope

This first gold set covers two 24-point rebuttal-writing questions:

- `2024:4`: summarize B's opposition to allowing mobile phones at school, then rebut it. The exam instruction requires English and a maximum of 60 words.
- `2026:6`: summarize Ken's preference for professional cleaners, then rebut it. The exam instruction asks for about 50 words.

The repository contains official answer examples for both questions, but this gold set does **not** invent an official 24-point breakdown. It labels semantic components only. Numeric app scoring should be calibrated later and clearly shown as an app-estimated score unless an official detailed rubric is verified.

## Compact grader target

The grader should return only:

`[S1,S2,R1,R2,X,G]`

Where:

- `S1`: opponent's core stance.
- `S2`: at least one material reason supporting the opponent's stance.
- `R1`: an actual rebuttal or material qualification, not simple agreement.
- `R2`: a relevant reason, example, rule, or compromise supporting the rebuttal.
- `X`: major source distortion or material self-contradiction.
- `G`: language severity.

For `S1/S2/R1/R2`:

- `0` absent
- `1` supported
- `2` contradicted/materially wrong
- `3` unclear/mixed

For `X`:

- `0` none
- `1` major contradiction/distortion

For `G`:

- `0` clear enough
- `1` minor grammar/spelling errors, meaning clear
- `2` materially impaired English / response-condition violation

## Important routing rule

Do **not** escalate merely because an answer contains `not`, `n't`, `but`, or `however`. Negation and contrast are normal in these tasks. Risk escalation should target structural conflict, role reversal, prompt injection, mixed-language violations, or materially fragmentary/ambiguous answers.

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

## Safety/quality metrics

The validation stage should report at least:

- exact case match
- component accuracy across all six fields
- semantic-component accuracy for `S1..R2`
- major contradiction miss rate
- false-complete rate on non-complete cases
- average input/output tokens
- Level-2 escalation rate

The main safety metric is not just overall accuracy. False full-credit style outcomes and missed meaning reversals should be treated as high-severity failures.

## Source files

The gold set is grounded in the current repository's `data.js`, `manual-guides.js`, and `app.js`. The official answer examples used here are already recorded in `manual-guides.js`. The current app still stores manual scores in `S.manual`; this gold set does not change production grading or storage behavior.
