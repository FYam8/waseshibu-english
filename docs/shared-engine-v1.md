# Shared English Engine v1

## Goal

Make `FYam8/waseshibu-english` the canonical source for reusable English-learning behavior while preserving the current Waseda Shibuya Singapore user-visible behavior and all storage/cloud compatibility throughout the migration. Rikkyo UK will live in a separate repository and consume only the reusable engine artifact. Its exam data, original/similar questions, branding, scoring rules, learning strategy, and persistence namespaces remain school-owned.

The target is not to copy the Waseda app and then maintain two forks. The target is one shared engine, exercised first by Waseda, with separate school adapters and separate school data packs.

## Non-negotiable safety rules

1. `main` is production. Shared-engine changes are developed on isolated branches and merge only after Waseda compatibility gates are green; the initial v1 cutover completed through PR #11.
2. The current Waseda browser storage identity must not change: `waseshibu.adaptive.v3`, legacy/recovery prefixes, schema migration behavior, and existing recovery semantics stay compatible.
3. Waseda cloud progress identity must not change during commonization: endpoint, `APP_ID=english`, IndexedDB name/version, event identity, source-record identity, and payload meaning remain compatible.
4. No Rikkyo data may be written under a Waseda localStorage key, IndexedDB name, cloud app ID, recovery prefix, or source-record namespace.
5. Existing Waseda exam/drill IDs are immutable. Refactoring must not renumber, recycle, or reinterpret IDs because local/cloud history depends on them.
6. No live cross-repository JavaScript import from another repository's `main`. A consumer vendors a pinned engine revision.
7. A shared-engine update must never write directly to the Rikkyo production branch. It creates/updates a Rikkyo sync PR only after Rikkyo compatibility tests pass; Rikkyo deployment remains repository-local.
8. Shared-engine extraction must not be used as an opportunity to change UX, scoring, scheduling, wording, data, or learning policy. Behavior changes are separate follow-up work after parity.
9. Before each extraction stage, the feature branch must be synchronized with the latest Waseda `main`; parity is measured against that latest production baseline, not an obsolete commit.

## Target separation

### 1. Engine

Reusable behavior only:

- navigation/view rendering primitives
- exam attempt state machine
- grading orchestration
- weakness registration
- remediation scheduling
- daily-plan state machine
- generic persistence/migration hooks
- generic progress-sync transport/interface
- generic drill-session state
- import/export/recovery utilities
- school-adapter invocation and validation

The engine must not know a school name, fixed exam years, route order, Waseda A/B/C policy, school-specific question IDs, school-specific target mappings, localStorage key, cloud endpoint, cloud app ID, or branding.

`engine/manifest.json` identifies the vendorable engine artifact and contract version. Rikkyo will pin the source commit and artifact version/hash rather than loading Waseda `main` live.

### 2. School adapter

A school adapter has two parts.

#### Static config

`schools/<school>/config.js` supplies:

- `schoolId`
- branding/title/footer
- available years and recommended route
- goal tiers and score ceiling
- daily target
- permanent storage namespace and migration aliases
- progress-sync namespace/endpoint policy

#### Policy functions

`schools/<school>/policy.js` supplies school-specific behavior that must not leak into the generic engine:

- question priority resolution
- whether a priority is included in a selected goal
- priority sorting
- route-role labels
- goal labels/advice
- school-facing skill labels

The Waseda adapter explicitly preserves the current `A/B/C` rules, including the current `insertion -> C` behavior. Production now loads these school-owned files around the shared engine; consumers such as Rikkyo provide their own config/policy files.

### 3. School data pack

School-owned content remains outside the common engine:

- `EXAM_DATA`
- `PAPERS`
- `DRILLS`
- question IDs / stable IDs
- source metadata
- answer keys and scoring metadata
- school-specific learning-model mappings and content patches
- original/similar questions and their explanations

For Rikkyo, existing analyzed original/similar-question data is treated as source-of-truth. Valid existing content is not regenerated merely to fit the shared engine. Only missing contract-required metadata is added. New content is created only for genuinely missing coverage.

## Cross-repository relationship

Waseda remains the master for engine behavior. Rikkyo vendors a pinned engine revision plus `engine.lock.json` containing at minimum:

- source repository (`FYam8/waseshibu-english`)
- source commit SHA
- engine contract version
- engine version
- vendored artifact hash

A sync workflow checks Waseda for a newer compatible engine revision. If `engine/**` changed, it vendors that artifact into a Rikkyo branch, runs Rikkyo contract/regression tests, and opens or updates a PR only when those tests pass. It does not merge directly into Rikkyo production and never copies `schools/waseshibu/**` or Waseda data files.

Propagation rule:

- `engine/**` only -> eligible for Rikkyo sync
- `schools/waseshibu/**` or Waseda data only -> Waseda only
- engine plus Waseda-specific files -> only the engine artifact is eligible, after both Waseda parity and Rikkyo compatibility pass

## Migration gates

### Gate 0 — baseline identity contract

Record, but do not wire, the current Waseda config/policy. CI verifies the baseline against production constants/data.

Required invariants:

- storage key and legacy/recovery prefixes
- schema version
- default year, route and goal tiers
- daily target and written score ceiling
- cloud API endpoint and app ID
- IndexedDB name/version
- Waseda priority/goal/route-label policy
- adapter year list equals actual exam-data year list
- malformed/colliding namespaces are rejected safely

### Gate 1 — behavioral characterization before extraction

Before moving logic out of `app.js`, add tests that characterize the current Waseda behavior. Extraction is not allowed to begin until these tests are green against the latest production runtime.

Minimum characterization matrix:

- fresh state -> current default goal/year and initial Today recommendation
- goal 60/70/75 priority eligibility
- route sequence and route-role labels
- active vs pending weakness ordering
- immediate remediation streak reset on wrong answer
- 3-consecutive transition into next-day pending state
- next-day 2-consecutive completion
- early next-day confirmation behavior exactly as current production
- reload/resume of active exam and active drill state
- day change / Today regeneration behavior
- legacy schema migration and recovery fallback
- export/import round trip and pre-import recovery
- unchanged exam/drill stable IDs
- cloud occurrence/state event semantics and source IDs

### Gate 2 — pure logic extraction

Extract only deterministic helpers/state transitions first. Keep compatibility wrappers in `app.js`. No storage or cloud changes in this gate.

After each small extraction commit:

1. run Node/unit characterization tests;
2. run Waseda browser smoke tests;
3. compare reference flows with the pre-extraction baseline;
4. stop immediately on any unexplained difference.

### Gate 3 — school policy/model separation

Move Waseda-only policy and learning-model mappings behind `schools/waseshibu/**`. Generic engine code must no longer contain Waseda year checks, A/B/C assumptions, school-specific skill priority exceptions, or Waseda text.

### Gate 4 — persistence extraction

Parameterize generic persistence while preserving Waseda defaults and stored meaning:

- same permanent storage key
- same schema version/migrations
- same recovery keys
- same serialized state meaning
- same restore/import behavior

Test representative states from old schemas and current schema before wiring production to the adapter.

### Gate 5 — progress-sync extraction

Split generic sync transport/reconciliation from Waseda identity. For Waseda, endpoint, app ID, IndexedDB, revisions, source-record IDs, event types, payload meaning, and baseline behavior must remain unchanged.

Rikkyo cloud sync is separately namespaced and enabled only after independent tests.

### Gate 6 — full Waseda parity and browser verification

Before merge to `main`, verify at least:

- Today
- route
- exam start/resume/grade
- wrong answer -> weakness registration
- remediation drill
- 3 consecutive / next-day 2 consecutive
- reload in the middle of each flow
- date-boundary behavior
- stats
- export/import/recovery
- cloud progress sync
- AI-writing behavior currently present in Waseda production
- dark mode and current mobile layout

Run desktop and mobile-sized browser checks. Project release rule applies: two consecutive review/test loops with no required fixes before production merge.

### Gate 7 — merge Waseda commonized runtime

Only after Gate 6 is clean, wire `main` to shared engine + Waseda adapter. From the Waseda user's perspective this is a refactor release, not a feature release.

### Gate 8 — establish separate Rikkyo English repository

Create/use a separate Rikkyo English repository. Do not fork Waseda persistence identities. Inventory the Rikkyo English data that actually exists and preserve valid IDs/content.

### Gate 9 — Rikkyo data-gap audit

Compare existing Rikkyo data with the engine/data contract. Fill only missing metadata/coverage. Keep source-derived past-paper material distinct from newly authored practice items.

Rikkyo FY24-FY26 English papers have their own mix of listening, grammar/reorder, reading and writing formats, so the Rikkyo adapter must model Rikkyo formats rather than forcing Waseda categories onto them.

### Gate 10 — Rikkyo compatibility, sync workflow, and deployment

Add `engine.lock.json`, Rikkyo-specific contract/regression tests, pinned vendor sync, and separate deployment. Test the complete Rikkyo flow independently before production.

## Browser-parity principle

Unit tests are necessary but not sufficient. The app's behavior includes DOM state, persisted state, navigation, reload, responsive layout and cloud interaction. Every extraction gate that changes runtime code therefore requires browser-level verification.

Preferred pattern: run the same seeded state/action sequence against the pre-refactor baseline and candidate build, then compare meaningful visible and persisted state. Screenshot checks may supplement layout regression coverage, but semantic assertions are the primary gate.

## Current status

`tests/shared-engine-contract.test.mjs` originated as the Gate 0 guard and remains a permanent regression gate. During the initial extraction the adapter/engine files were introduced without changing production behavior; after the v1 cutover, `index.html` loads the validated Waseda adapter and shared engine in the tested order.
