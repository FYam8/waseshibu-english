# Shared Exam Session Controller (UI 1.1.0, controller contract 1)

## Audit baseline

2026-09-22: Waseda main `ce29faf3767c3df22a191dc138a9d516518cc9af`; Rikkyo main `0a0f30711e802a1adbc8e2091247e18c6e7bf025`. Both engine/ and ui/ files match byte-for-byte and therefore have identical Git blob IDs. Waseda has advanced from the handover, including immediate objective-answer locking at the deadline (701a51f). This behavior must survive extraction.

| Priority | Existing duplication | Shared boundary | School-owned boundary |
| --- | --- | --- | --- |
| P0 | timerMarkup/updateTimer, interval start/stop, answer-sheet toggles, major/problem jump | ui/exam-session.js; timer formatting, overtime transition, interval lifecycle, persisted UI toggles, scroll/highlight | getState/save/render, problem element ID mapping, onTimeout policy, missing-target message |
| P1 | inputFor/answerRow, choice/slot selection, word-order operations | Future answer widget state transitions and controls | scoring types, answer schema adapters, missing-word rules, manual grading authority |
| P2 | futureConfirmationMarkup/learningActionsMarkup | Future descriptor presenter | goal labels, limitation wording, school route IDs |
| P3 | Rikkyo source/context grouping; Waseda paper assembly | Future source-to-question grouping helper | actual source renderer, supplied-source boundaries |
| P4 | export/import actions, recovery notices, day-change presentation | Future shared presentation/dialogs | namespace, backup format validation, recovery policy, storage access |

This PR implements P0 only. P1–P4 require separate compatibility reviews.

## Contract

Load `ui/exam-session.js` before app.js. `ENGLISH_UI_EXAM_SESSION.create(options)` accepts:

- `getState()`: resolve current state on every action (including after Import replace).
- `save()` and `render()`: use the existing school's persistence and renderer.
- `problemElementIds(identity)`: ordered DOM IDs; only the school knows its IDs and parent fallback.
- `onTimeout(attempt)`: optional redraw/policy callback when the interval first crosses zero. The controller sets `overtime` and saves first. Waseda redraws immediately to preserve its existing lock; Rikkyo continues answering as before.
- `onMissingProblem(identity)`: school-local notice.
- `document`, `now`: optional dependencies for deterministic tests.

Methods: timerMarkup(attempt), updateTimer(), start(view), stop(), toggleAnswerSheet(), toggleAnswerSize(), toggleExamInfo(), jumpAnswerMajor(major), jumpToProblem(identity).

Render lifecycle: stop() before replacing DOM; start(view) after. start() also stops any old interval. Only active timed exam views get an interval. timerMarkup marks overdue attempts during initial/resumed rendering, without recursive rendering. updateTimer notifies onTimeout once. Neither method creates an attempt or chooses a time limit.

Storage schema and keys remain unchanged. Only the already-existing overtime and three UI booleans are changed. No direct localStorage/IndexedDB access, score calculation, learning selection, or source data is present in the controller. Existing responsive CSS and markup are unchanged.

Vendor ui/ from a verified Waseda commit, pin that exact commit and blob IDs in the consumer lock. Never import from a mutable production URL. Shared UI contract remains 1; the controller is an additive export. Existing component exports are unchanged.
