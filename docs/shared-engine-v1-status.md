# Shared English Engine v1 — Gate Status

Last updated: 2026-09-17

## Production safety

- Production branch: `main`
- Baseline production commit for this branch: `44154a777b2d6c584a1eba4a38bb782c6b70d0bb`
- Shared-engine branch: `feat/shared-engine-v1`
- Production `main` wiring changed: **No**
- Candidate branch now loads `engine/core.js`, but `app.js` has not delegated behavior to it yet.
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

### Source/runtime characterization

`tests/waseda-behavior-characterization.test.mjs` freezes:

- fresh goal/year/route defaults
- A/B/C eligibility and route roles
- Today action ordering
- daily-plan modes
- unfinished drill priority
- no early next-day confirmation
- 3-consecutive + next-day 2-consecutive mastery semantics
- failed confirmation fallback to training
- migration/recovery/import invariants
- stable exam/drill ID fingerprints

Frozen data identity at the current baseline:

- exam IDs: **167**
- exam-ID SHA-256: `f4d22a1214fe3415f964835c747aba4acf0dbfb1b3181f1b5e9675b0adf5d809`
- active drill IDs: **283**
- active-drill-ID SHA-256: `bbb7939ceefa3b82578604c508d58aa5dd5182c86670ed7a940b192bf1c38e8f`

### Executable learning-flow characterization

`tests/waseda-learning-flow-characterization.test.mjs` executes the current production functions for:

- Today ordering (retention -> in-progress weakness -> active exam -> next weakness)
- fresh route recommendation
- training wrong-answer streak reset
- third consecutive correct -> next-day pending
- failed retention check -> reset to training
- second retention correct -> mastered

### Real-browser characterization

`tests/waseda-browser-smoke.sh` runs the real static app in headless Chrome against four isolated browser states:

1. `fresh` — home/Today/default persistence/goal change/navigation
2. `attempt` — active past-paper attempt survives reload and is offered for resume
3. `drill` — active remediation drill survives reload and takes Today priority
4. `future` — future next-day confirmation remains blocked

This browser test uses an isolated localhost origin/profile and never touches production user storage or cloud progress.

## Gate 2 — pure shared logic extraction

Status: **STARTED — candidate runtime loads core; behavior delegation not started**

`engine/core.js` currently mirrors a small school-neutral helper set:

- `localDate`
- `plusDays`
- `normalizeDrillState`
- `wordCount`
- `familyCount`

`tests/shared-engine-core-parity.test.mjs` compares these helpers with the current Waseda runtime and guards that `engine/core.js` loads before `app.js` in the candidate `index.html`. The real-browser scenarios also assert that the shared core is loaded.

`engine/manifest.json` marks `runtimeLoaded: true` and still keeps `productionWiring: false`. Thus the feature branch exercises the engine asset in the real browser while current Waseda behavior continues to come from the existing `app.js` functions.

**Next Gate 2 action:** delegate one small pure-helper group behind Waseda compatibility wrappers, rerun contract + pure-core parity + executable flow + real-browser scenarios + existing Waseda CI, and stop on any unexplained difference.

## Future Rikkyo relationship

Rikkyo must consume a pinned vendored engine artifact, never a live script from Waseda `main`. An engine update may create or update a Rikkyo sync PR only after Rikkyo compatibility tests pass. Waseda-specific config, policy and data are never copied by that sync.

## Merge rule

No production merge is allowed merely because Gate 0/1 are clean. Runtime extraction must proceed in small commits, with full CI and real-browser parity after each runtime wiring change. Final Waseda commonization requires two consecutive CLEAN review/test loops before merge to `main`.
