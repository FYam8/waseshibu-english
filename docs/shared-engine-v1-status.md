# Shared English Engine v1 — Gate Status

Last updated: 2026-09-17

## Production safety

- Production branch: `main`
- Baseline production commit for this branch: `44154a777b2d6c584a1eba4a38bb782c6b70d0bb`
- Shared-engine branch: `feat/shared-engine-v1`
- Production `main` wiring changed: **No**
- Candidate branch loads and validates the Waseda school adapter, then loads the shared core.
- Exam/drill content, `learning-model.js`, `progress-sync.js`, Waseda storage/schema/recovery identities and Cloud Sync identities remain unchanged.
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

Status: **CLEAN through current helper extraction**

`engine/core.js` now contains:

- `localDate`
- `plusDays`
- `normalizeDrillState`
- `wordCount`
- `familyCount`
- `ensureFamilyIds`

The first five helpers are delegated through the candidate Waseda runtime with exact legacy fallbacks. `normalizeDrillState` is also delegated during startup because it is needed before the post-app compatibility bridge.

`ensureFamilyIds` now owns the generic practice-bank completion rule that had been a Waseda startup hotfix: records missing `familyId` receive `id` when available, otherwise the same `skill:targetId:index` fallback. A guarded one-shot workflow changed `app.js` only after the entire Waseda contract/browser/sync/AI suite passed. The original Waseda loop remains as fallback if the shared engine is absent.

Parity coverage includes two-pass drill-state startup normalization, invalid legacy choice-order repair, legacy reorder `orderIndices` recovery, old-format choice resume, and exact old-vs-shared family-ID completion.

## Gate 3 — school adapter / Waseda policy and low-risk runtime config

Status: **CLEAN for current sub-stage**

The candidate page loads, in order:

1. `engine/contract.js`
2. `schools/waseshibu/config.js`
3. `schools/waseshibu/policy.js`
4. `engine/bootstrap.js`
5. `engine/core.js`
6. `app.js`
7. `engine/waseda-compat.js`
8. `progress-sync.js`

`engine/bootstrap.js` validates the Waseda config and policy and exposes `ENGLISH_ENGINE_ADAPTER`.

Seven school-specific decisions in `app.js` delegate through `ENGLISH_ENGINE_ADAPTER.policy` while retaining their exact previous Waseda logic as fallback:

- question priority
- goal eligibility
- priority ordering
- route role
- goal label
- goal advice
- skill display name

The following low-risk exam runtime values come from `ENGLISH_ENGINE_ADAPTER.config.exam`, with exact current Waseda fallbacks:

- route
- default year
- default goal
- daily task target
- goal tiers

Dedicated tests inject fake policy/config adapters and verify that these runtime decisions truly follow the adapter; no-adapter fixtures verify the original Waseda fallbacks.

## Gate 4 — score and learning-model boundaries

Status: **CHARACTERIZED / CLEAN — extraction not yet performed**

### Score model

`tests/waseda-score-model-characterization.test.mjs` freezes the current Waseda coupling:

- every routed written paper totals 80 points
- listening is clamped to 0–20
- total score is same-attempt written + listening
- total denominator is 100
- import validation remains written <=80 and listening <=20
- result/stats displays remain /80, /20 and /100
- cloud progress written max remains 80

This prevents a future school adapter from accidentally breaking Waseda by replacing isolated score constants without understanding the 80+20=100 model.

### Learning model

`tests/waseda-learning-model-characterization.test.mjs` now fingerprints the current school-specific mapping and migration boundary:

- exam mapping count: **167**
- exam mapping SHA-256: `e11d73163f804c8639748a9e66c5853e078846842812152f30c33bf39fbe3db4`
- active bank count: **283**
- active bank mapping SHA-256: `eddfded9fc21d06b79d7b0ae9765104fb1520211f0951fa4ddf281c4de16c7e0`

It also freezes the real load-order boundary created by drill scripts that execute after `learning-model.js`:

- pre-app missing `familyId`: **60** records, SHA-256 `c1d5c29582039d1590b22b7ceda67a958268b3c34a3bf4f26ef0f636dcdf359c`
- pre-app missing `focusTag`: **14** records, SHA-256 `508748a861ecf59ed55c5a5918df31baa59826a3f541215b902c52d56ad91bcf`
- pre-app missing `examFormat`: **32** records, SHA-256 `010d82e535e67ee74ff338e76b6af21694efdbbb272d0b1d71f6c66c73faa15e`
- pre-app missing `level`: **14** records, SHA-256 `508748a861ecf59ed55c5a5918df31baa59826a3f541215b902c52d56ad91bcf`

This was an important finding: those missing optional fields are part of the current load-order behavior, not evidence that production data should be rewritten. `familyId` is normalized at app startup; `focusTag`, `examFormat` and `level` may remain undefined for some later-loaded records and are currently tolerated as ranking/difficulty hints.

Migration characterization also freezes invalid-goal fallback, invalid `currentDrill` cleanup, weakness metadata remapping, reservation filtering/deduplication/cap-at-two, and manual-component focus/trap mapping.

`engine/manifest.json` is now `0.1.0-alpha.7`. Production wiring remains false because `main` has not changed, and Rikkyo consumption remains blocked.

## Next extraction boundary

The next safe task is to separate generic learning-state migration mechanics from Waseda-specific metadata mapping. That should be done without changing the existing `learning-model.js` data mappings or the just-frozen fingerprints. Score parameterization, storage/schema changes and Cloud Sync parameterization remain later gates.

Storage key, schema version, recovery prefixes, sync DB/API/app ID and Cloud Sync event meaning remain frozen until their own later gates.

## Future Rikkyo relationship

Rikkyo must consume a pinned vendored engine artifact, never a live script from Waseda `main`. Engine updates may create/update a Rikkyo sync PR only after Rikkyo compatibility tests pass. Waseda-specific config, policy and data are never copied by that sync.

## Merge rule

No production merge is allowed merely because the current sub-stage is clean. Runtime extraction must proceed in small commits with full CI and browser parity after each runtime wiring change. Final Waseda commonization requires two consecutive CLEAN review/test loops before merge to `main`.
