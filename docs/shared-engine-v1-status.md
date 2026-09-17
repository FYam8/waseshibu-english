# Shared English Engine v1 — Gate Status

Last updated: 2026-09-17

## Production safety

- Production branch: `main`
- Baseline production commit for this branch: `44154a777b2d6c584a1eba4a38bb782c6b70d0bb`
- Shared-engine branch: `feat/shared-engine-v1`
- Production `main` wiring changed: **No**
- Candidate branch loads and validates the Waseda school adapter, then loads the shared core.
- Exam/drill data, `learning-model.js`, `progress-sync.js`, Waseda storage/schema/recovery identities and Cloud Sync identities remain unchanged.
- PR #11 remains Draft and must not merge until the later Waseda parity gates are complete.

## Gate 0 — contract / identity baseline

Status: **CLEAN**

The contract guards the current Waseda localStorage/recovery namespaces, schema, route/default year/goals, score limits, progress API/IndexedDB identity, school policy shape, exam years, malformed adapter validation and namespace collision checks.

## Gate 1 — behavior characterization

Status: **CLEAN and retained as a permanent regression gate**

The source/runtime, executable learning-flow and real-browser suites freeze current Waseda behavior for Today ordering, route selection, active exam/drill resume, future retention blocking, 3-consecutive + next-day 2-consecutive mastery, failed confirmation fallback, migration/recovery/import and stable IDs.

Frozen data identity:

- exam IDs: **167**
- exam-ID SHA-256: `f4d22a1214fe3415f964835c747aba4acf0dbfb1b3181f1b5e9675b0adf5d809`
- active drill IDs: **283**
- active-drill-ID SHA-256: `bbb7939ceefa3b82578604c508d58aa5dd5182c86670ed7a940b192bf1c38e8f`

The browser suite uses isolated localhost Chrome profiles and never touches production user storage or cloud progress.

## Gate 2 — shared pure/state helpers

Status: **CLEAN through helper delegation stage 3**

`engine/core.js` contains `localDate`, `plusDays`, `normalizeDrillState`, `wordCount` and `familyCount`.

The candidate runtime loads `engine/core.js` before `app.js`. Waseda delegates all five helpers to the shared core. `normalizeDrillState` is additionally delegated during startup through a guarded `app.js` wrapper because it executes before the post-app compatibility bridge. If the shared core is absent, the exact legacy Waseda implementation remains as fallback.

Parity coverage includes the two-pass startup path (stored drill snapshot, then current bank question), invalid legacy choice-order repair, legacy reorder `orderIndices` recovery, and production-valid browser resume of an old-format choice drill. The full Waseda verify suite passed after delegation.

## Gate 3 — school adapter / Waseda policy and low-risk runtime config

Status: **IN PROGRESS — current sub-stage CLEAN**

The candidate page loads, in order:

1. `engine/contract.js`
2. `schools/waseshibu/config.js`
3. `schools/waseshibu/policy.js`
4. `engine/bootstrap.js`
5. `engine/core.js`
6. `app.js`
7. `engine/waseda-compat.js`
8. `progress-sync.js`

`engine/bootstrap.js` validates the Waseda config and policy and exposes `ENGLISH_ENGINE_ADAPTER`. Browser tests verify that the loaded adapter is `waseshibu`, keeps `waseshibu.adaptive.v3`, and exposes the expected Waseda route policy.

Seven school-specific decisions in `app.js` delegate through `ENGLISH_ENGINE_ADAPTER.policy` while retaining their exact previous Waseda logic as fallback:

- question priority
- goal eligibility
- priority ordering
- route role
- goal label
- goal advice
- skill display name

The following low-risk exam runtime values now come from `ENGLISH_ENGINE_ADAPTER.config.exam`, again with exact current Waseda fallbacks:

- route
- default year
- default goal
- daily task target
- goal tiers

Goal-tier validation and all three current goal rendering loops now use `GOAL_TIERS`, so a future school adapter can supply its own permitted tiers without changing Waseda's current `[60,70,75]` behavior. Dedicated runtime-config tests inject a fake exam config and verify that route, defaults, daily target and goal tiers actually follow the adapter; a no-adapter fixture verifies the original Waseda fallbacks.

The guarded one-shot wiring workflows for each runtime edit were deleted after successful use. The normal verify workflow now permanently covers contract, adapter bootstrap, core parity, policy delegation, runtime-config delegation, Waseda behavior/learning-flow characterization, real-browser scenarios, progress-sync and AI-grading guards.

`engine/manifest.json` is `0.1.0-alpha.6`. Production wiring remains false because `main` has not changed, and Rikkyo consumption remains blocked until Waseda parity/release gates complete.

## Next boundary to characterize before further extraction

Do **not** naively replace every `80`/`20`/`100` in Waseda with config constants. The current runtime has coupled assumptions around written score, listening score, total score, import validation, result display and comparability. Before parameterizing these, add explicit score-model characterization so Waseda's current 80+20=100 semantics cannot drift.

The other next boundary is `learning-model.js`: separate school-specific model mappings from generic scheduling/state behavior only after its current migration/mapping behavior has dedicated characterization coverage.

Storage key, schema version, recovery prefixes, sync DB/API/app ID and Cloud Sync event meaning remain frozen until their own later gates.

## Future Rikkyo relationship

Rikkyo must consume a pinned vendored engine artifact, never a live script from Waseda `main`. Engine updates may create/update a Rikkyo sync PR only after Rikkyo compatibility tests pass. Waseda-specific config, policy and data are never copied by that sync.

## Merge rule

No production merge is allowed merely because the current sub-stage is clean. Runtime extraction must proceed in small commits with full CI and browser parity after each runtime wiring change. Final Waseda commonization requires two consecutive CLEAN review/test loops before merge to `main`.
