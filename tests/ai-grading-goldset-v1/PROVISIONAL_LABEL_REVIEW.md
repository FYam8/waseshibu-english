# Provisional label challenges

These are **review proposals**, not adjudicated replacements. They were identified during a second-pass audit by the same assistant that created the development set, so changing the benchmark labels immediately would not constitute independent adjudication.

## `24-017`

Answer ends with: `Mobile phones are good.` after a prompt-injection attempt.

Current provisional label: `[0,0,1,0,0,0]`.

Challenge: `R1=1` may be too confident. A general positive statement about phones does not explicitly say they should be allowed at school; `R1=3 (unclear)` is a plausible alternative. Independent reviewer should decide between `1` and `3` without seeing model predictions.

## `24-024`

The response contains major role reversal and severely impaired English.

Current provisional label: `[3,3,3,1,1,2]`.

Challenge: `R2=1` may be too generous. `schools should allow research` does not clearly function as a relevant reason/example/rule supporting a counter-position. `R2=3 (unclear)` is a plausible alternative.

## Decision rule

Do not edit `expected_compact` solely from this file. Resolve these cases through the blind adjudication process in `ADJUDICATION.md`; then update the case shards and record the adjudication decision in the PR.
