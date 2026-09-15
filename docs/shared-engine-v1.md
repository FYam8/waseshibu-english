# Shared English Engine v1

## Goal

Make `FYam8/waseshibu-english` the canonical source for the reusable English learning engine while preserving the current Waseda Shibuya Singapore production behavior byte-for-byte at the public entry point until parity tests pass. Rikkyo UK will live in a separate repository and consume only the reusable engine contract; its school-specific exam data, drills, branding, scoring rules, and storage namespace remain separate.

## Non-negotiable safety rules

1. `main` is production. Shared-engine work happens on `feat/shared-engine-v1` until all compatibility gates are green.
2. The current Waseda browser storage identity must not change: `waseshibu.adaptive.v3`, its legacy/recovery prefixes, and `schemaVersion` migration behavior stay compatible.
3. Waseda cloud progress identity must not change during commonization: endpoint, `APP_ID=english`, IndexedDB name/version, and event semantics remain unchanged.
4. No Rikkyo data may be written under a Waseda storage key, IndexedDB name, cloud endpoint namespace, or source-record namespace.
5. Existing Waseda exam/drill IDs are immutable. Refactoring must not renumber or recycle IDs because local/cloud history depends on them.
6. No live cross-repository JavaScript import from another repository's `main`. Consumers use a pinned engine revision and update only after compatibility tests pass.

## Target separation

### 1. Engine (shared, canonical in Waseda repository)

Reusable behavior only:

- navigation/view rendering primitives
- exam attempt state machine
- grading orchestration
- weakness registration
- remediation scheduling (3 consecutive + next-day 2 consecutive)
- daily-plan logic
- generic persistence/migration hooks
- generic progress-sync adapter interface
- generic skill/target rendering
- import/export/recovery utilities

The engine must not know the school name, exam years, route order, school-specific question IDs, school-specific target mappings, localStorage key, cloud endpoint, or branding.

### 2. School adapter

Each school supplies configuration such as:

- `schoolId`
- branding/title/footer
- available years and recommended route
- goal tiers and score ceiling
- permanent storage namespace and migration aliases
- progress-sync namespace/endpoint policy
- labels and school-specific strategy text

`schools/waseshibu/config.js` is the compatibility baseline. Its values are intentionally copied from the production runtime first; only after parity is proven will `app.js` read them.

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

For Rikkyo, existing analyzed original/similar-question data is imported as-is and treated as source-of-truth. Missing fields required by the engine contract are added without regenerating or replacing valid existing content.

## Cross-repository relationship

Waseda remains the master for engine behavior. Rikkyo should vendor a pinned engine revision plus an `engine.lock.json` containing the Waseda commit SHA and engine contract version. A sync workflow checks Waseda for a newer engine revision, runs Rikkyo compatibility tests, and updates automatically only when those tests pass. This gives automatic propagation of shared UI/logic fixes without allowing a Waseda-specific content or branding change to leak into Rikkyo.

Recommended rule:

- change under `engine/**` -> eligible to propagate to Rikkyo
- change under `schools/waseshibu/**` or Waseda data files -> Waseda only
- change touching both -> propagate only the `engine/**` artifact after both Waseda and Rikkyo contract tests pass

## Migration sequence

1. Freeze and record current Waseda production identities and behavior.
2. Introduce the engine contract and Waseda adapter without wiring them into production.
3. Add contract/parity tests that compare adapter values with current runtime constants.
4. Extract pure helpers/state logic from `app.js` in small commits, leaving compatibility wrappers.
5. Move Waseda-specific mappings out of `learning-model.js` into the Waseda data/model adapter.
6. Parameterize persistence and progress sync while keeping Waseda defaults exactly the same.
7. Run full Waseda regression tests and browser smoke checks; only then merge to `main`.
8. Create the separate Rikkyo English repository and import existing Rikkyo data without rewriting it.
9. Fill only contract-required gaps in the Rikkyo data pack.
10. Add pinned engine sync + Rikkyo compatibility tests, then deploy Rikkyo separately.

## First compatibility gate

Before any production wiring, the adapter must match the live Waseda constants for:

- storage key and legacy/recovery prefixes
- schema version
- default year, route and goal tiers
- cloud API endpoint
- cloud app ID
- IndexedDB name/version

`tests/shared-engine-contract.test.mjs` enforces this baseline.