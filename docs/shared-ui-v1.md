# Shared English UI v1

## Goal

Use the current Waseda English UI/UX as the source of truth for a reusable English-app presentation layer. Rikkyo should consume the same shell and interaction patterns instead of independently recreating Today, route, past-paper, weakness, remediation, progress and backup UX.

## Layers

- `engine/`: shared learning/state behavior.
- `ui/`: shared presentation primitives, layout, responsive CSS and view shell.
- `schools/<school>/ui.js`: branding, labels and feature flags only.
- school app/data: school-specific exam identity, question renderers, scoring wording and data.

## Non-negotiable rules

1. Waseda production UI is the baseline. Extraction must not visually or behaviorally change Waseda.
2. Rikkyo does not hand-copy Waseda CSS or page markup after Shared UI is wired.
3. Consumers vendor a pinned UI artifact; no live cross-repository CSS/JS imports.
4. Shared UI may expose renderer slots, but question formats stay school/data driven.
5. Theme/branding tokens stay school-owned.
6. Mobile behavior is part of the contract, not an optional later cleanup.
7. Waseda gets two consecutive CLEAN UI/browser loops before Shared UI is merged.
8. Rikkyo gets its own browser/mobile compatibility loop before deploy.

## First extraction boundary

Gate UI0 is characterization only:
- freeze nav/view order and labels,
- freeze current Waseda theme variables,
- split an exact non-wired copy of the existing CSS into `ui/base.css` + school theme,
- provide pure shell markup helpers,
- do not change `index.html` or `styles.css` runtime loading yet.

Only after UI0 is CLEAN should Waseda itself be rewired to shared UI assets.
