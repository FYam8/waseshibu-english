# Shared English Engine v1 — Gate Status

Last updated: 2026-09-17

## Production safety

- Production branch: `main`
- Baseline production commit for this branch: `44154a777b2d6c584a1eba4a38bb782c6b70d0bb`
- Shared-engine branch: `feat/shared-engine-v1`
- Production `main` wiring changed: **No**
- Candidate branch loads `engine/core.js` and delegates only four pure helpers through `engine/waseda-compat.js`.
- `learning-model.js`, `progress-sync.js`, exam data, drill data, storage keys and cloud identities are unchanged.
- PR #11 remains Draft and must not merge until the later Waseda parity gates are complete.

## Gate 0 — contract / identity baseline

Status: **CLEAN**

Guards cover the current Waseda:

- localStorage key and legacy/recovery namespaces
- schema version
- route/default year/goals/daily target/written score ceiling
- progress API app ID/endpoint and IndexedDB identity
- Waseda-specific priority/goal/route/skill policy shape
- exam year set vs `EXAM_DATA`
- malformed adapter validation and namespace collision checks

## Gate 1 — behavior characterization

Status: **CLEAN for the characterized baseline; retained as a permanent regression gate**

`tests/waseda-behavior-characterization.test.mjs`, `tests/waseda-learning-flow-characterization.test.mjs` and the real-browser smoke suite freeze the current Waseda behavior for fresh Today, route selection, active exam resume, active drill resume, future retention blocking, 3-consecutive + next-day 2-consecutive mastery, failed confirmation fallback, migration/recovery/import invariants and stable IDs.

Frozen data identity:

- exam IDs: **167**
- exam-ID SHA-256: `f4d22a1214fe3415f964835c747aba4acf0dbfb1b3181f1b5e9675b0adf5d809`
- active drill IDs: **283**
- active-drill-ID SHA-256: `bbb7939ceefa3b82578604c508d58aa5dd5182c86670ed7a940b192bf1c38e8f`

The real-browser suite runs isolated Chrome profiles for `fresh`, `attempt`, `drill` and `future`; it never touches production user storage or cloud progress.

## Gate 2 — pure shared logic extraction

Status: **IN PROGRESS — delegation stage 2 CLEAN**

`engine/core.js` currently contains:

- `localDate`
- `plusDays`
- `normalizeDrillState`
- `wordCount`
- `familyCount`

The candidate runtime now loads `engine/core.js` before `app.js`, then loads `engine/waseda-compat.js` after `app.js`. The compatibility bridge delegates these four pure helpers to the shared core:

- `wordCount`
- `familyCount`
- `localDate`
- `plusDays`

`normalizeDrillState` remains on the legacy Waseda implementation for now because it participates in startup/resume state handling and will be migrated separately with stronger state fixtures.

The second delegation stage passed both push-triggered and pull-request-triggered verification. Both runs included contract validation, direct old-vs-engine core parity, executable Today/mastery characterization, real-browser `fresh/attempt/drill/future` scenarios, Cloud progress-sync guards, AI writing tests and the existing grading-goldset checks.

One expected regression guard failed during the first delegation attempt because `tests/progress-cloud-sync.test.mjs` required `app.js` and `progress-sync.js` to be adjacent script tags. The candidate intentionally inserts the compatibility bridge between them. The guard was corrected to preserve its semantic requirement—`progress-sync.js` must load after `app.js` and the compatibility bridge—and the complete suite then passed.

`engine/manifest.json` is now `0.1.0-alpha.3`, marks `candidateBehaviorDelegation: true`, keeps `productionWiring: false`, and blocks Rikkyo consumption until the Waseda parity/release gates are complete.

**Next Gate 2 action:** characterize startup/resume normalization more deeply, then migrate `normalizeDrillState` or another deterministic state helper as a separate small step. Stop on any unexplained visible or persisted-state difference.

## Future Rikkyo relationship

Rikkyo must consume a pinned vendored engine artifact, never a live script from Waseda `main`. An engine update may create or update a Rikkyo sync PR only after Rikkyo compatibility tests pass. Waseda-specific config, policy and data are never copied by that sync.

## Merge rule

No production merge is allowed merely because Gate 0/1 or the current Gate 2 sub-stage are clean. Runtime extraction must proceed in small commits, with full CI and real-browser parity after each runtime wiring change. Final Waseda commonization requires two consecutive CLEAN review/test loops before merge to `main`.
