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

Status: **FRAME LAYER WIRED / EXACT-HEAD FULL VERIFY CLEAN**

`ui/components.js` is loaded before `app.js`. Waseda now delegates the following reusable presentation primitives while retaining exact no-Shared-UI fallbacks:

- metric cards used by Today and Stats
- progress bar used by remediation
- completion marks used by Today/Review
- learning-route step card frame
- Today hero frame
- weakness/review row frame
- remediation drill card frame
- backup/import panel frame

Shared components own layout/classes only. Waseda continues to supply goal/scoring wording, route policy, weakness metadata, question content, button actions and drill feedback content.

The exact same runtime head passed both push and PR full verification. Existing Waseda real-browser smoke, persistence/recovery, Cloud Sync and AI suites are CLEAN.

## Still not shared

The next presentation boundary is the past-paper experience:

- attempt bar / timer shell
- paper + answer-panel layout
- answer-jump navigation
- reusable choice/text/multi/manual renderer primitives
- common correct/wrong feedback framing

School-specific question formats, scoring rules and content stay pluggable through adapter/data.

## Next gate — UI3 past-paper and answer shell

Characterize the current Waseda attempt/answer-panel DOM first, then extract small renderer/layout primitives. Do not copy Waseda scoring assumptions into the shared UI.

## Rikkyo gate

Rikkyo must not merge/deploy its prototype UI. After a Waseda Shared UI release:

1. vendor exact `ui/` artifact,
2. add `ui.lock.json`,
3. add Rikkyo theme/UI adapter,
4. replace prototype shell/CSS,
5. plug in Rikkyo renderers,
6. run desktop/mobile parity,
7. require two consecutive CLEAN loops.
