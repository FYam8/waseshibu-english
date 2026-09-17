# Shared English Engine v1 — Gate Status

Last updated: 2026-09-17

## Production safety

- Production branch: `main`
- Baseline production commit for this branch: `44154a777b2d6c584a1eba4a38bb782c6b70d0bb`
- Shared-engine branch: `feat/shared-engine-v1`
- Production `main` wiring changed: **No**
- Candidate branch loads `engine/core.js`; production data, storage keys, Cloud Sync identities and school data remain unchanged.
- PR #11 remains Draft and must not merge until the later Waseda parity gates are complete.

## Gate 0 — contract / identity baseline

Status: **CLEAN**

Guards cover the current Waseda localStorage/recovery namespaces, schema, route/default year/goals, score limits, progress API/IndexedDB identity, Waseda policy shape, exam years, malformed adapter validation and namespace collision checks.

## Gate 1 — behavior characterization

Status: **CLEAN and retained as a permanent regression gate**

The source/runtime, executable learning-flow and real-browser suites freeze current Waseda behavior for Today ordering, route selection, active exam/drill resume, future retention blocking, 3-consecutive + next-day 2-consecutive mastery, failed confirmation fallback, migration/recovery/import and stable IDs.

Frozen data identity:

- exam IDs: **167**
- exam-ID SHA-256: `f4d22a1214fe3415f964835c747aba4acf0dbfb1b3181f1b5e9675b0adf5d809`
- active drill IDs: **283**
- active-drill-ID SHA-256: `bbb7939ceefa3b82578604c508d58aa5dd5182c86670ed7a940b192bf1c38e8f`

The browser suite uses isolated localhost Chrome profiles and never touches production user storage or cloud progress.

## Gate 2 — pure shared logic extraction

Status: **IN PROGRESS — delegation stage 3 candidate**

`engine/core.js` contains:

- `localDate`
- `plusDays`
- `normalizeDrillState`
- `wordCount`
- `familyCount`

The candidate runtime loads `engine/core.js` before `app.js`. Waseda then uses a deliberately small compatibility surface:

- `wordCount`
- `familyCount`
- `localDate`
- `plusDays`
- `normalizeDrillState`

`normalizeDrillState` required extra handling because it executes while `app.js` is still starting. `app.js` now contains a guarded wrapper: when the shared core is loaded it calls `ENGLISH_ENGINE_CORE.normalizeDrillState`; when the core is absent it preserves the previous Waseda implementation as an exact fallback. After `app.js` finishes loading, `engine/waseda-compat.js` delegates the global helper directly to the shared core.

Before wiring this helper, parity coverage was expanded for the two-pass startup path: normalization of the saved drill snapshot and normalization again after replacing the saved question with the current bank record. Invalid legacy choice order repair and legacy reorder `orderIndices` recovery are compared directly against the previous Waseda behavior. A production-valid legacy choice resume is also covered in the real browser.

A synthetic reorder-resume browser fixture was rejected by current production startup semantics, so it was not used to redefine Waseda behavior. The reorder normalization rule remains covered at pure-function parity level instead of changing production to satisfy an artificial fixture.

`engine/manifest.json` is now `0.1.0-alpha.4`. `productionWiring` remains false because `main` has not changed, and Rikkyo consumption remains blocked until Waseda parity/release gates complete.

**Next Gate 2 action:** continue extracting the next low-risk pure/state helper group in small increments, preserving the same contract, characterization and browser gates after every delegation.

## Future Rikkyo relationship

Rikkyo must consume a pinned vendored engine artifact, never a live script from Waseda `main`. Engine updates may create/update a Rikkyo sync PR only after Rikkyo compatibility tests pass. Waseda-specific config, policy and data are never copied by that sync.

## Merge rule

No production merge is allowed merely because the current sub-stage is clean. Runtime extraction must proceed in small commits with full CI and browser parity after each runtime wiring change. Final Waseda commonization requires two consecutive CLEAN review/test loops before merge to `main`.
