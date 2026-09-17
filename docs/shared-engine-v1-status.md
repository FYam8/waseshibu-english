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

`engine/core.js` contains generic helpers for:

- `localDate`
- `plusDays`
- `normalizeDrillState`
- `wordCount`
- `familyCount`
- `ensureFamilyIds`
- `migrateLearningState`

Waseda delegates these through guarded wrappers while retaining exact legacy fallbacks where needed. `engine/core.js` now loads before `learning-model.js`; `learning-model.js` delegates only the generic state-migration mechanics while supplying Waseda-specific metadata resolution and valid-drill lookup callbacks. The old Waseda migration body remains the no-core fallback.

Permanent parity coverage proves delegated vs legacy equality for invalid-goal repair, invalid `currentDrill` cleanup, weakness metadata remapping, manual component mapping, confirmation reservation dedup/filter/cap-at-two, legacy drill normalization and family-ID completion.

## Gate 3 — school adapter / Waseda policy and runtime config

Status: **CLEAN for current sub-stage**

`engine/bootstrap.js` validates `schools/waseshibu/config.js` and `schools/waseshibu/policy.js` and exposes `ENGLISH_ENGINE_ADAPTER` before the candidate runtime starts.

Seven school-specific decisions in `app.js` delegate through `ENGLISH_ENGINE_ADAPTER.policy`, with exact legacy fallbacks:

- question priority
- goal eligibility
- priority ordering
- route role
- goal label
- goal advice
- skill display name

The following low-risk exam values come from `ENGLISH_ENGINE_ADAPTER.config.exam` with exact Waseda fallbacks:

- route
- default year
- default goal
- daily task target
- goal tiers

The following persistence identity/config values now come from `ENGLISH_ENGINE_ADAPTER.config.storage`, again with exact current Waseda fallbacks:

- primary localStorage key: `waseshibu.adaptive.v3`
- legacy keys: `waseshibu.adaptive.v2`
- migration-recovery prefix: `waseshibu.adaptive.pre-migration`
- import-recovery prefix: `waseshibu.adaptive.pre-import`
- schema version: `8`

This is parameterization of the source of those values, **not** a Waseda identity migration. The actual values and state meaning are unchanged.

## Gate 4 — score, learning-model and persistence boundaries

Status: **CHARACTERIZED / CLEAN; selected generic mechanics delegated**

### Score model

`tests/waseda-score-model-characterization.test.mjs` freezes the current Waseda coupling:

- every routed written paper totals 80 points
- listening is clamped to 0–20
- total score is same-attempt written + listening
- total denominator is 100
- import validation remains written <=80 and listening <=20
- result/stats displays remain /80, /20 and /100
- cloud progress written max remains 80

Score constants have **not** been generalized yet.

### Learning model

`tests/waseda-learning-model-characterization.test.mjs` fingerprints the current school-specific mapping/data boundary:

- exam mapping count: **167**
- exam mapping SHA-256: `e11d73163f804c8639748a9e66c5853e078846842812152f30c33bf39fbe3db4`
- active bank count: **283**
- active bank mapping SHA-256: `eddfded9fc21d06b79d7b0ae9765104fb1520211f0951fa4ddf281c4de16c7e0`
- pre-app missing `familyId`: **60**, SHA-256 `c1d5c29582039d1590b22b7ceda67a958268b3c34a3bf4f26ef0f636dcdf359c`
- pre-app missing `focusTag`: **14**, SHA-256 `508748a861ecf59ed55c5a5918df31baa59826a3f541215b902c52d56ad91bcf`
- pre-app missing `examFormat`: **32**, SHA-256 `010d82e535e67ee74ff338e76b6af21694efdbbb272d0b1d71f6c66c73faa15e`
- pre-app missing `level`: **14**, SHA-256 `508748a861ecf59ed55c5a5918df31baa59826a3f541215b902c52d56ad91bcf`

Those optional-field gaps are current load-order behavior; production problem data was not rewritten to satisfy the refactor.

### Persistence / recovery

`tests/waseda-persistence-characterization.test.mjs` freezes current persistence semantics before any deeper extraction:

- primary -> legacy -> import-recovery -> migration-recovery lookup order
- corrupt-primary fallback and recovery notice
- v2 history migration into legacy, non-comparable attempts
- pre-migration raw snapshot preservation
- v7 `dailyPlan.answeredCount` -> `dailyProgress` transition
- targeted attempt -> interrupted untimed repair
- future-schema no-rewrite / no-downgrade behavior
- same-key schema upgrade behavior
- import recovery retention of the newest three snapshots

`tests/waseda-storage-config-delegation.test.mjs` additionally verifies fake-school adapter values are honored while the no-adapter path retains exact Waseda storage identities. Full browser, progress-sync and AI suites passed after this wiring.

`engine/manifest.json` is `0.1.0-alpha.8`. Production wiring remains false because `main` has not changed, and Rikkyo consumption remains blocked.

## Next extraction boundary — progress sync

Before parameterizing `progress-sync.js`, explicitly characterize its external and local identity boundary: API endpoint, app ID, IndexedDB name/version, local state key, control keys, event/source-record naming, anonymous registration behavior, occurrence/state record semantics, baseline semantics, revocation/collection-disabled behavior and score metadata. Existing sync guards already cover many of these, but the next gate should freeze them as a deliberate adapter boundary before changing runtime constants.

No progress-sync identity or event meaning should change during that extraction.

## Future Rikkyo relationship

Rikkyo must consume a pinned vendored engine artifact, never a live script from Waseda `main`. Engine updates may create/update a Rikkyo sync PR only after Rikkyo compatibility tests pass. Waseda-specific config, policy, problem data, branding and identities are never copied automatically.

## Merge rule

No production merge is allowed merely because the current sub-stage is clean. Runtime extraction must proceed in small commits with full CI and browser parity after each runtime wiring change. Final Waseda commonization requires **two consecutive CLEAN review/test loops** before merge to `main`.
