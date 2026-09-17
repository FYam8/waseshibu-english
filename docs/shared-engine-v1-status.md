# Shared English Engine v1 — Gate Status

Last updated: 2026-09-17

## Production safety

- Production branch: `main`
- Baseline production commit for this branch: `44154a777b2d6c584a1eba4a38bb782c6b70d0bb`
- Shared-engine branch: `feat/shared-engine-v1`
- Production `main` wiring changed: **No**
- PR #11 remains Draft and must not merge until final Waseda parity gates are complete.
- Exam/drill content and stable problem IDs remain frozen.
- Waseda local/cloud identity values remain exactly the same even where their source is now the validated school adapter.
- Rikkyo does **not** consume this candidate yet.

## Gate 0 — contract / identity baseline

Status: **CLEAN**

The contract guards Waseda localStorage/recovery namespaces, schema, route/default year/goals, score limits, progress API/IndexedDB identity, school policy shape, exam years, malformed adapter validation and namespace collision checks.

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

Status: **CLEAN through learning-state migration delegation**

`engine/core.js` contains generic helpers for `localDate`, `plusDays`, `normalizeDrillState`, `wordCount`, `familyCount`, `ensureFamilyIds` and `migrateLearningState`.

Waseda delegates these through guarded wrappers while retaining exact legacy fallbacks where needed. `engine/core.js` loads before `learning-model.js`; `learning-model.js` delegates only generic state-migration mechanics while supplying Waseda-specific metadata resolution and valid-drill lookup callbacks. The old Waseda migration body remains the no-core fallback.

Permanent parity coverage proves delegated vs legacy equality for invalid-goal repair, invalid `currentDrill` cleanup, weakness metadata remapping, manual component mapping, confirmation reservation dedup/filter/cap-at-two, legacy drill normalization and family-ID completion.

## Gate 3 — school adapter / Waseda policy and runtime config

Status: **CLEAN for current sub-stage**

`engine/bootstrap.js` validates `schools/waseshibu/config.js` and `schools/waseshibu/policy.js` and exposes `ENGLISH_ENGINE_ADAPTER` before the candidate runtime starts.

Seven school-specific decisions in `app.js` delegate through `ENGLISH_ENGINE_ADAPTER.policy`, with exact legacy fallbacks: question priority, goal eligibility, priority ordering, route role, goal label, goal advice and skill display name.

Low-risk exam values come from `ENGLISH_ENGINE_ADAPTER.config.exam`: route, default year, default goal, daily task target and goal tiers.

Persistence identity/config values come from `ENGLISH_ENGINE_ADAPTER.config.storage`: primary/legacy localStorage keys, migration/import recovery prefixes and schema version. This is source parameterization only; Waseda identity values and state meaning are unchanged.

## Gate 4 — score, learning-model and persistence boundaries

Status: **CHARACTERIZED / CLEAN; selected generic mechanics delegated**

### Score model

`tests/waseda-score-model-characterization.test.mjs` freezes the Waseda 80+20=100 coupling: every routed written paper totals 80, listening is clamped to 20, total score remains same-attempt written + listening, import ceilings remain 80/20, displays remain /80, /20 and /100, and cloud written-score metadata remains 80.

### Learning model

Frozen school-specific mapping/data boundary:

- exam mapping count: **167**; SHA-256 `e11d73163f804c8639748a9e66c5853e078846842812152f30c33bf39fbe3db4`
- active bank count: **283**; SHA-256 `eddfded9fc21d06b79d7b0ae9765104fb1520211f0951fa4ddf281c4de16c7e0`
- pre-app missing `familyId`: **60**
- pre-app missing `focusTag`: **14**
- pre-app missing `examFormat`: **32**
- pre-app missing `level`: **14**

Those optional-field gaps are current load-order behavior; production problem data was not rewritten to satisfy the refactor.

### Persistence / recovery

`tests/waseda-persistence-characterization.test.mjs` freezes primary/legacy/recovery lookup precedence, corrupt-primary recovery, v2/v7 migrations, raw pre-migration snapshots, targeted-attempt repair, future-schema no-downgrade behavior, same-key schema upgrades and newest-three import recovery retention.

## Gate 5 — progress-sync adapter and projection boundary

Status: **CHARACTERIZED; IDENTITY + PROJECTION CONFIG DELEGATION CLEAN**

`tests/waseda-progress-sync-characterization.test.mjs` freezes the external/local sync contract: API endpoint, app ID, local state key, IndexedDB name/version/stores, control and registration behavior, HTTP endpoints, state/occurrence source IDs and event types, production-only occurrence behavior, timestamp-independent fingerprinting, no raw answer/manual uploads and current written-score metadata.

`progress-sync.js` now sources endpoint/app ID and local storage/IndexedDB identity from `ENGLISH_ENGINE_ADAPTER.config.progress/storage`, with exact Waseda fallbacks. The existing `window.__WASESHIBU_PROGRESS_API__` override remains intact.

The progress projection now also sources these school-specific values from `config.exam`:

- configured exam years
- permitted goal tiers
- default goal
- written maximum score
- baseline progress label through the configured app ID

`tests/waseda-progress-projection-config-delegation.test.mjs` injects a fake school configuration and verifies that only those school-specific projection values change. The no-adapter path remains exactly Waseda: 2019–2026, goal tiers 60/70/75, default goal 60 and written max 80.

Source-record IDs, event types, registration/control behavior, dedup/revision semantics and HTTP/IndexedDB contracts were not generalized or renamed. The guarded one-shot suite and the permanent normal verify suite both passed, including the real-browser, progress/cloud and AI grading suites.

`engine/manifest.json` is `0.1.0-alpha.10`. Production wiring remains false because `main` has not changed, and Rikkyo consumption remains blocked.

## Next extraction boundary — app score model

The next safe gate is the app-side score model. Its current 80+20=100 behavior is already characterized; the next step should source written/listening/total maxima from validated exam config while keeping current Waseda values, import semantics, result/status wording and browser behavior exactly unchanged. This should be performed as another one-shot guarded wiring change with fake-adapter and no-adapter parity tests.

## Future Rikkyo relationship

Rikkyo must consume a pinned vendored engine artifact, never a live script from Waseda `main`. Engine updates may create/update a Rikkyo sync PR only after Rikkyo compatibility tests pass. Waseda-specific config, policy, problem data, branding and identities are never copied automatically.

## Merge rule

No production merge is allowed merely because the current sub-stage is clean. Runtime extraction must proceed in small commits with full CI and browser parity after each runtime wiring change. Final Waseda commonization requires **two consecutive CLEAN review/test loops** before merge to `main`.
