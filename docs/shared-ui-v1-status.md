# Shared English UI v1 — Status

Last updated: 2026-09-18

## Goal

Use Waseda English as the UI/UX source of truth and make Rikkyo consume the same presentation system instead of maintaining a hand-copied imitation.

Target:

- Waseda = Shared Engine + Shared UI + Waseda Adapter + Waseda Data
- Rikkyo = Shared Engine + Shared UI + Rikkyo Adapter + Rikkyo Data

## UI0 — characterization

Status: **CLEAN**

Frozen from the current Waseda production UI:

- view order: Today / Route / Exam / Review / Drill / Stats / Guide
- Waseda labels and brand text
- complete existing responsive CSS baseline
- school theme variables
- Waseda A/B/C strategy badge CSS as school-owned compatibility styling

Generic `ui/` files are guarded against Waseda/Rikkyo/provider identity leakage.

## UI1 — shared shell and CSS runtime

Status: **WIRED ON FEATURE BRANCH / FULL VERIFY CLEAN**

The Waseda candidate now:

- loads `schools/waseshibu/theme.css`
- loads `ui/base.css`
- loads `schools/waseshibu/ui-compat.css`
- mounts header/nav/footer with `ui/shell.js`
- validates the school UI adapter through `ui/contract.js`
- mounts the shell before `app.js`, so existing Waseda navigation/dark-mode wiring sees the same DOM

The legacy `styles.css` remains untouched in the repository as a parity reference but is not double-loaded by the candidate.

The complete Waseda verification suite, including existing real-browser smoke, Cloud Sync and AI suites, is CLEAN on the runtime-wired candidate.

## Findings from review loop

### Fixed

1. **Rikkyo was beginning to hand-copy Waseda-like UI.**
   - Rikkyo is now explicitly deployment-blocked until Shared UI is pinned.
   - Rikkyo data/engine work is preserved; its current shell/CSS is marked prototype-only.

2. **A/B/C strategy styling leaked into generic CSS.**
   - Moved to `schools/waseshibu/ui-compat.css`.

3. **Shared nav helper initially emitted empty class attributes.**
   - Fixed so generated Waseda DOM exactly matches the previous static nav markup.

4. **Runtime shell extraction initially invalidated source-only baseline assumptions.**
   - Tests now freeze the school UI adapter and generated DOM rather than requiring static duplicated markup in `index.html`.

## UI2 — shared view primitives

Status: **FIRST SLICE WIRED / FULL VERIFY CLEAN**

`ui/components.js` is now loaded before `app.js`. Waseda delegates the following reusable presentation primitives while retaining exact no-Shared-UI fallbacks:

- metric cards used by Today and Stats
- progress bar used by remediation
- completion marks used by Today/Review
- learning-route step card frame
- backup/import panel frame

The route component owns only shared layout/classes. Waseda still supplies route-role wording, protected-year policy, recommendations, score detail and button action.

The complete Waseda permanent suite and real-browser smoke remain CLEAN after the runtime delegation.

## Still not shared

The next UI2 slices are:

- Today hero/action frame and daily summary frame
- weakness/review row frame
- remediation header/question/feedback frame
- past-paper attempt/answer-panel frame
- common question-renderer primitives

School-specific question formats, goal/scoring wording and data remain pluggable through adapter/data.

## Next gate — UI2 Today / weakness / remediation frames

Continue with small parity-guarded frame extraction. Do not rewrite all Waseda view functions at once.

## Rikkyo gate

Rikkyo must not merge/deploy its prototype UI. After a Waseda Shared UI release:

1. vendor exact `ui/` artifact,
2. add `ui.lock.json`,
3. add Rikkyo theme/UI adapter,
4. replace prototype shell/CSS,
5. plug in Rikkyo renderers,
6. run desktop/mobile parity,
7. require two consecutive CLEAN loops.
