# Shared English Engine v1 — Gate Status

Last updated: 2026-09-18

## Production safety

- Production branch: `main`
- Original production baseline: `44154a777b2d6c584a1eba4a38bb782c6b70d0bb`
- Shared-engine production cutover: `70644a9bb891f7c99bd7a08f7beeb941b3ed6807`
- PR #11 was squash-merged after two consecutive full CLEAN verification loops.
- Production `main` wiring changed: **Yes — Shared English Engine v1 is now the Waseda runtime.**
- Post-cutover `main` verification run `35334219119`: **SUCCESS**
- Post-cutover GitHub Pages run `35334217904`: **SUCCESS**
- Exam/drill content and stable problem IDs remain frozen.
- Waseda local/cloud identity values remain exactly the same even though their source is now the validated school adapter.
- Rikkyo consumer onboarding may begin only through a separate pinned-vendor branch/PR after this release metadata gate is merged.

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

The Waseda school config now declares `writtenMaxScore:80`, `listeningMaxScore:20`, and `totalMaxScore:100`. The shared contract validates that the total equals written + listening and that goal tiers fit within the total ceiling.

`app.js` now sources those three maxima from `ENGLISH_ENGINE_ADAPTER.config.exam`, with exact 80/20/100 fallbacks. Import validation, listening clamping, goal-distance wording, exam/result/stats denominators and listening input limits all follow the configured values. A fake-adapter test uses 120+30=150 to prove the delegation; the no-adapter path remains exactly Waseda 80+20=100.

`tests/waseda-score-model-characterization.test.mjs` continues to freeze the real Waseda behavior: every routed written paper totals 80, listening is capped at 20, total score remains same-attempt written + listening, and Waseda displays/validation remain 80/20/100. The guarded one-shot wiring suite and the permanent full verify suite both passed, including real-browser, progress/cloud and AI grading checks.

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

`progress-sync.js` sources endpoint/app ID and local storage/IndexedDB identity from `ENGLISH_ENGINE_ADAPTER.config.progress/storage`, with exact Waseda fallbacks. The existing `window.__WASESHIBU_PROGRESS_API__` override remains intact.

The progress projection also sources configured exam years, goal tiers/default goal, written maximum score and the baseline progress label from school config. Fake-adapter and no-adapter tests verify that only those school-specific values vary; source-record IDs, event types, registration/control behavior, dedup/revision semantics and HTTP/IndexedDB contracts remain unchanged.

## Current production level

`engine/manifest.json` is **1.0.0** with status `production-waseda-commonized`.

The production cutover and post-cutover verification have passed the permanent verification suite, including:

- shared contract/bootstrap/core parity
- policy/runtime config delegation
- Waseda score-model characterization
- app score-config fake/no-adapter delegation
- learning-model fingerprints and learning migration parity
- persistence/recovery and storage config gates
- progress-sync/projection characterization and delegation
- Today/mastery behavior characterization
- real-browser fresh/resume/legacy/future-retention scenarios
- progress cloud-sync guards
- AI writing UI/grader/goldset guards

Production `main` is now commonized. The release metadata update changes no runtime behavior.

## Gate 6 — remediation mastery transition

Status: **DELEGATED / CLEAN**

`engine/core.js` now owns the deterministic remediation mastery state transition through `advanceRemediationMastery`:

- training correct increments streak
- training wrong resets streak
- 3 consecutive correct -> pending next-day confirmation
- confirmation correct increments confirmation streak
- 2 consecutive confirmation correct -> mastered
- confirmation wrong -> active training reset, clears reserved confirmations and requests a new confirmation reserve

`app.js` now delegates only that deterministic state transition to the shared core. Waseda-specific side effects such as selecting/reserving concrete confirmation questions remain in the app and are triggered from the helper's transition flags. The exact legacy transition remains as a no-core fallback.

The first runtime wiring attempt exposed one compatibility issue in the non-browser characterization harness because it referenced `window` directly. The candidate was not merged or deployed; the access was changed to a guarded `typeof window!=="undefined"` path, preserving the browser shared-core path and the existing non-browser fallback. After that fix, the permanent runtime-delegation gate, learning-flow characterization, real-browser smoke, Cloud Sync and AI suites all passed.

## Gate 7 — daily remediation scheduling primitives

Status: **CHARACTERIZED + DELEGATED / CLEAN**

The current Waseda Today/remediation scheduler is now explicitly frozen for:

- active weaknesses being immediately eligible
- pending confirmation becoming eligible only on/after its due date
- pending confirmations sorting before active training
- school priority order, then due date, last-assigned date and stable key tie-breaks
- daily answered count using the maximum of same-day persistent progress and same-day plan count
- daily target remaining/reached semantics
- Today action ordering: due confirmation -> in-progress weakness -> active exam resume -> untouched weakness -> route -> out-of-goal upgrade suggestion

The shared core now owns the deterministic eligibility, ordering and daily-target accounting helpers. `app.js` delegates to them using guarded browser access while retaining exact no-core legacy fallbacks. Dedicated characterization, old-vs-shared parity and fake-shared runtime-delegation tests all pass, followed by the full real-browser, Cloud Sync and AI suite.

## Gate 8 — daily plan construction and Today action selection

Status: **CHARACTERIZED + DELEGATED / CLEAN**

The shared core now builds the generic `weak / waiting / route / complete` daily-plan state and returns the keys whose `lastAssignedDate` must be updated. `app.js` applies that Waseda state mutation and persists it, so the shared helper remains deterministic and does not write browser state directly.

The shared core also selects generic Today action descriptors in the frozen order:

1. due confirmation
2. in-progress weakness
3. active exam resume
4. untouched weakness
5. next route year
6. out-of-goal upgrade suggestion

Waseda-specific display text, route-role wording and goal labels remain in `app.js` / the Waseda policy adapter. The no-core legacy paths remain intact. Characterization, old-vs-shared parity, fake-shared runtime-delegation, real-browser, Cloud Sync and AI suites are all CLEAN.

## Gate 9 — practice pool / confirmation reservation / next-question selection

Status: **CHARACTERIZED + DELEGATED / CLEAN**

The current Waseda practice selection behavior is now frozen and delegated for:

- exact target pool first, widening to the same skill only when the exact target has fewer than five distinct families
- retired drill exclusion
- confirmation reservation de-duplication by ID and family, capped at two families
- invalid reservation removal and deterministic refill through the existing Waseda ranking callback
- confirmation mode selecting reserved IDs only
- training mode excluding reserved confirmation families and already-used questions
- the existing exhausted-pool reset behavior, including the current fallback that excludes reserved IDs rather than whole reserved families after a training reset
- level 1/2 preference before training streak 2, with level 3 allowed from streak 2 onward
- preservation of the available higher-level question when no lower-level candidate exists

The shared core owns the deterministic pool/reservation/candidate mechanics. Waseda still owns the ranking callback (`leastRecentlyUsed`), concrete drill data, UI/session mutations and explanatory text. `app.js` delegates through guarded helpers and retains the exact previous implementation as the no-core fallback.

Dedicated characterization, shared-vs-legacy parity and fake-shared runtime-delegation tests are permanent CI gates. The full real-browser, Cloud Sync and AI suites are CLEAN after runtime wiring.

## Gate 10 — practice ranking and session readiness

Status: **CHARACTERIZED + DELEGATED / CLEAN**

The shared core now owns the deterministic practice ranking weights and readiness decision after the app has handled an already-open drill:

- matching `focusTag`: -30 rank weight
- confirmation + level 3: -20
- matching `examFormat`: -6
- immediate-last-question penalty
- then drill-log last-use position
- then stable ID ordering
- minimum five-family readiness
- future pending-confirmation block
- initial `train` vs `confirm` mode

The app intentionally still owns the same-weakness resume and cross-weakness unfinished-session short-circuits because those are navigation/session side effects that occur before pool construction. It also owns alert wording, navigation and persistence. The shared path and no-core fallback are both regression-tested.

A source-characterization test initially caught the expected structural change in `startSkill`; the gate was updated to require both the shared readiness path and the original fallback, then the complete browser/sync/AI suite returned CLEAN. No production branch or deployed Waseda state was touched during that iteration.

## Gate 11 — practice session state

Status: **CHARACTERIZED + DELEGATED / CLEAN**

The shared core now owns the deterministic shape of a newly started practice session and the deterministic state reset/application when a practice question is selected.

The shared session shape covers the common learning-state fields: key/skill/target/focus/mode, used IDs, selected answers, multi-select state, reorder state, text inputs and self-check drafts. Applying a question also updates `lastDrillId` / unique `seenDrills`, clears prior answer/AI-feedback state and accepts a caller-supplied choice order.

Random option-order generation intentionally remains in the app so the shared state helper stays deterministic. Persistence, navigation and Waseda-specific error text also remain app-owned. Exact legacy fallback state construction/reset remains present. The first source-only regression assertion was updated to recognize the guarded shared helper plus the retained fallback; full real-browser, Cloud Sync and AI suites are CLEAN.

## Gate 12 — exam attempt / objective scoring / weakness-state primitives

Status: **CHARACTERIZED + DELEGATED / CLEAN**

The audit-selected exam boundary is now extracted only at the deterministic state layer:

- comparable attempt = first exposure + timed + not interrupted + not overtime
- interrupting an attempt switches it to interrupted / untimed while the app keeps alert/save/render side effects
- objective scoring supports Waseda's existing multi-answer partial credit and delegates answer matching back to the app
- the Waseda-specific `peanut(s)` accepted-answer exception remains outside the shared engine
- wrong-answer weakness reconstruction resets mastery state, clears confirmation reservation, increments wrong count and preserves prior seen-drill history
- a later actually-correct source answer updates matching weakness components without deleting their remediation history

`app.js` now delegates these primitives through guarded shared-core calls and retains the exact legacy implementations as no-core fallbacks. Waseda metadata mapping, manual-component mapping, strategy priority, scoring orchestration, dialogs, persistence and navigation remain app/policy owned.

The new runtime-delegation gate plus all prior characterization/parity gates, real-browser smoke, Cloud Sync and AI suites are CLEAN.

## Gate 13 — local-day rollover

Status: **CHARACTERIZED + DELEGATED / CLEAN**

The shared core now owns the deterministic rollover decision and stale daily-state cleanup:

- same local date -> no-op
- unanswered drill on a date change -> defer rollover to protect the in-progress answer
- answered drill / other views -> apply rollover
- stale `dailyPlan` and `dailyProgress` are cleared only when their date differs from the current local date
- drill-view notice intent is returned to the app rather than rendered by the engine

`app.js` keeps the browser focus/visibility listeners, timer scheduling, Japanese notice text, render/save calls and `dayChangeAnswerMoved` presentation flag. Exact no-core fallbacks remain present. Characterization, old-vs-shared parity, fake-shared runtime delegation, real-browser smoke, Cloud Sync and AI suites are CLEAN.

## Gate 14 — AI writing integration compatibility and adapter config

Status: **CHARACTERIZED + CONFIG-DELEGATED / CLEAN**

The browser/worker compatibility boundary is now frozen for:

- current Waseda AI endpoint and opt-in request path
- supported skills: `writing_completion`, `summary`, `rebuttal`
- eight Waseda exam writing-task IDs and their school-specific word/part limits
- drill task construction and 12/24-point skill maxima
- POST JSON shape `{task, answer}`
- safe feedback validation fields
- FNV-1a answer fingerprint and stale-feedback detection
- Cloudflare usage-limit / temporary-rate-limit error handling
- no legacy client-tracking header

The Waseda school adapter now explicitly declares `aiWriting.enabled`, `aiWriting.endpoint` and `aiWriting.skills`. `app.js` sources only those integration settings from the adapter, retaining exact Waseda fallbacks. A consumer school can provide a different endpoint/skill set or disable AI writing entirely.

School-specific exam/drill task construction, Waseda source-paper mapping, manual guides, answer aliases, UI wording and the Worker scoring implementation remain outside the shared core. Contract validation covers malformed optional AI-writing config. Full browser, Cloud Sync and existing AI grader/UI/goldset suites remain CLEAN.

## Gate 15 — backup / import merge

Status: **CHARACTERIZED + DELEGATED / CLEAN**

The high-risk merge path was characterized before runtime wiring. The frozen semantics cover:

- mastered weakness state wins over non-mastered state
- otherwise confirmation/streak progress decides the weakness merge, with incoming winning ties
- nonblank current answers win ordinary answer-map conflicts
- manual records prefer the side with a score; when both are scored, current wins; component tags are unioned
- exposure keeps the more-exposed state by the existing first < unknown < partial < done rank
- duplicate rows keep the last value for a key while retaining the original key insertion order
- same-day daily progress keeps the larger answered count
- current live attempt/drill remains active; a conflicting incoming live attempt is archived as interrupted and a conflicting incoming drill is moved to recovered drills
- attempts/history/drill logs and recovered drills retain the existing de-duplication keys
- merged daily plan is deliberately cleared
- schema is forced to the current Waseda schema

The shared core now owns the deterministic merge primitives and `mergeImportedLearningState`. The Waseda app still owns backup identity validation, checksum/schema checks, pre-import recovery snapshots, replace-vs-merge confirmation, learning-model migration, manual weakness consolidation, current-drill rebinding, persistence and UI. Exact no-core fallbacks remain.

The focused characterization, primitive parity, composite parity and runtime-delegation gates all pass, followed by the complete real-browser, Cloud Sync and AI suite. Waseda storage keys, recovery prefixes, schema and existing learner-history meaning were not changed.

## Gate 16 — final shared-engine readiness audit

Status: **CLEAN**

The final consumer-boundary audit found and corrected one structural leak before production cutover: the Waseda-only compatibility bridge had still lived at `engine/waseda-compat.js` even though the documented consumer rule says only school-neutral code belongs in the shared artifact. It now lives at `schools/waseshibu/compat.js`.

The permanent readiness gate now verifies:

- `engine/` contains only `bootstrap.js`, `contract.js`, `core.js` and `manifest.json`
- generic engine runtime files contain no Waseda/Rikkyo/provider identity or browser persistence/network dependencies
- every exported core helper is declared in the manifest
- Waseda config/policy/compatibility files live under `schools/waseshibu/`
- the real load order remains core -> learning-model, validated adapter -> app, app -> Waseda compatibility bridge -> progress sync
- all current Waseda storage, score, route, progress and AI-writing identity values remain exact
- the Waseda runtime is actually wired to the shared helpers while retaining local fallbacks
- there is no live cross-repository engine import

After correcting the browser smoke fixture to load the relocated school compatibility bridge, the final readiness test and complete browser/sync/AI suite are CLEAN.

## Next boundary — Rikkyo consumer onboarding

Shared Engine v1 production cutover is complete. Do not make additional Waseda runtime refactors as part of Rikkyo onboarding.

The next phase is to create/use the separate Rikkyo English repository, inventory its existing analyzed/problem data as-is, create a Rikkyo config/policy/data pack, and vendor a pinned copy of the **school-neutral `engine/` artifact**. Rikkyo tests must verify its own storage/cloud namespace, FY24–FY26 exam formats and learning flow before deployment. Future Waseda engine changes flow to Rikkyo only through compatibility-tested sync PRs.

## Future Rikkyo relationship

Rikkyo must consume a pinned vendored engine artifact, never a live script from Waseda `main`. Engine updates may create/update a Rikkyo sync PR only after Rikkyo compatibility tests pass. Waseda-specific config, policy, problem data, branding and identities are never copied automatically.

## Merge rule

No production merge is allowed merely because the current sub-stage is clean. Runtime extraction must proceed in small commits with full CI and browser parity after each runtime wiring change. Final Waseda commonization requires **two consecutive CLEAN review/test loops** before merge to `main`.
