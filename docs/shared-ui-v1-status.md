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

## Not yet shared

UI/UX commonization is **not complete** at shell/CSS level. These still live as school app markup and are the next extraction boundary:

- Today action/metric cards
- learning route cards
- past-paper attempt/answer-panel shell
- weakness/review rows
- remediation drill question/feedback shell
- progress/stat cards
- backup/import panel
- common question-renderer primitives

School-specific question formats and score wording remain pluggable through adapter/data.

## Next gate — UI2 view primitives

Extract Waseda view markup in small parity-guarded slices. Start with the lowest-risk reusable components:

1. metric/status cards
2. Today primary action card
3. route step card
4. weakness row
5. remediation header/progress/feedback shell
6. backup/import panel

Do not rewrite all Waseda view functions at once.

## Rikkyo gate

Rikkyo must not merge/deploy its prototype UI. After a Waseda Shared UI release:

1. vendor exact `ui/` artifact,
2. add `ui.lock.json`,
3. add Rikkyo theme/UI adapter,
4. replace prototype shell/CSS,
5. plug in Rikkyo renderers,
6. run desktop/mobile parity,
7. require two consecutive CLEAN loops.
