# Shared English Engine v1 — Remaining Runtime Audit

Last updated: 2026-09-18

This audit classifies the remaining Waseda `app.js` responsibilities before any further extraction. The rule is to extract behavior only when Rikkyo should inherit the same semantics; school data, policy, wording and external contracts stay outside the generic core.

## A. Generic engine behavior — next extraction candidates

### Exam attempt lifecycle
Candidate generic mechanics:
- comparable-attempt predicate: first exposure + timed + not interrupted + not overtime
- interrupting an active attempt into an untimed/non-comparable state
- deterministic attempt finalization fields
- same-attempt score/listening aggregation already parameterized by school score maxima

App-owned side effects that should remain outside the pure helper:
- confirmation dialogs
- DOM input for exposure/mode/time limit
- timezone lookup
- saving current answer/manual maps
- navigation/render

### Objective scoring
Candidate generic mechanics:
- multi-answer partial credit
- exact score result from a caller-provided match predicate
- clamp/normalization helpers where their semantics are school-independent

Do **not** move the Waseda `peanut(s)` special case into the shared engine. That is a question/data answer-alias concern. Until it is represented in data, Waseda should continue to supply the match predicate.

### Weakness state
Candidate generic mechanics:
- wrong-answer weakness reset to active training
- streak/confirmation reset
- reservation clear
- wrong-count increment
- preserving previous `seenDrills`
- marking an existing weakness as actually correct and incrementing `actualCorrect`

School-owned inputs:
- question metadata (`targetId`, `focusTag`, `examFormat`, `trap`)
- strategy priority
- manual-component focus/category mapping
- display labels

### Import/merge
Potential later generic module:
- weak-state merge preference
- de-duplication
- answer/manual-map merge
- exposure merge
- same-day daily-progress merge
- conflict archiving of current attempt/drill

This is high-risk persistence behavior and remains behind the already-frozen persistence/recovery gate. Do not extract it in the same change as exam grading.

### Day rollover
Potential generic mechanics:
- invalidate stale daily plan/progress on local-date change
- defer rollover while an unanswered drill is open

DOM visibility/focus listeners and notices remain app presentation behavior.

## B. School policy / data — keep outside shared core

Keep Waseda-owned:
- `strategyPriority`, goal labels/advice, route roles and skill display labels
- all `EXAM_DATA`, `PAPERS`, `DRILLS` and stable IDs
- Waseda learning-model target/focus/trap mappings and data patches
- manual answer components and their school-specific meaning
- protected-year / first-sight strategy wording
- paper-text section parsing where it depends on the Waseda source-paper format
- Waseda-specific accepted-answer exceptions such as `peanut(s)` unless converted into explicit data aliases

Rikkyo should supply its own equivalents through its adapter/data pack.

## C. Presentation / browser shell — keep app-owned for now

Do not extract yet:
- Home / Route / Exam / Result / Review / Drill / Stats / Guide HTML
- Japanese labels, notices and alert wording
- DOM event handlers, scrolling and navigation
- answer-sheet layout, paper rendering and underlines
- dark theme and UI toggles
- random choice-order generation
- browser timer display

A reusable presentation shell can be considered only after behavior/state boundaries are stable.

## D. External integrations — separate compatibility boundary required

### Cloud progress
Already characterized and adapter-backed. Event/source semantics remain frozen.

### AI writing grader
Still Waseda-wired. Before sharing:
- characterize endpoint/skill contract
- request/response schema
- rate/platform error handling
- answer fingerprint/stale-feedback behavior
- which skills use AI grading

Parameterize only after those tests exist. Rikkyo may need a different endpoint or skill set.

## Next gate

The next extraction is deliberately limited to **exam attempt + objective scoring + weakness-state primitives**:

1. characterize current Waseda attempt comparability/interruption behavior;
2. characterize objective scoring including multi partial credit and Waseda match callback behavior;
3. characterize weakness reset/preservation and actual-correct update;
4. add shared pure helpers under old-vs-new parity;
5. wire only those helpers with exact Waseda fallbacks;
6. run the full real-browser, Cloud Sync and AI suite.

Do not extract the full `grade()` orchestration yet.
