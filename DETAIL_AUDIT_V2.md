# DETAIL_AUDIT_V2

## Basis
- Base ZIP: `waseshibu-english-v0.18.1-reviewed2.zip`
- Uploaded base filename: `waseshibu-english-v0.18.1-reviewed2 (1).zip`
- Base SHA-256: `c95f162e3a7529f100649c6cfc83b6b2de79867ff1f5e58198ee4c59eef7767d`
- Scope: `detail` / 内容把握 only.
- Existing attempt/history/mastery facts are not rewritten.

## Source audit
The base `EXAM_DATA` contains 50 source items with `skill === "detail"` across 2019-2026.

After reading the source question forms first, the 50 items were grouped into four operational target pools. Fine-grained processing remains in `focusTag`.

| targetId | source items | active drill families |
|---|---:|---:|
| detail-context-evidence | 21 | 5 |
| detail-causal-inference | 13 | 5 |
| detail-paraphrase-evidence | 13 | 5 |
| detail-insertion-cohesion | 3 | 5 |

Fine focus tags include:
- context-dialogue
- context-word-fit
- connector-context
- vocab-in-context
- reason-motive
- situation-reaction
- action-intent
- paraphrase-scope
- study-finding
- negative-detail
- example-identification
- insertion-cohesion

## Existing drill disposition
### Reused with mapping/explanation edits
`nd02, nd03, nd04, nd05, nd06, nd08, nd10`

### Retired non-destructively
`dt01, dt02, xdt1, xdt2, xdt3, xdt4, xdt5, xdt6, xdt7, xdt8, nd01, nd07, nd09`

The retired IDs remain in the bank and are marked `retired`; they are not deleted. Historical references remain valid.

### New original replacement drills
`rdt_cx01, rdt_cx02, rdt_cx03, rdt_cx04, rdt_cx05, rdt_ci02, rdt_ci03, rdt_pe03, rdt_in01, rdt_in02, rdt_in03, rdt_in04, rdt_in05`

All new items are explicitly labeled `【オリジナル類題】`.

## Problem-count policy
Active drill count before this detail patch: 283.
Active drill count after this detail patch: 283.

The patch does not increase the active problem count. It reuses 7 suitable `nd` items, retires 13 mismatched legacy detail items, and adds 13 replacements.

## Non-destructive migration
`actualMeta()` now derives a current `targetId` and `focusTag` for each of the 50 source detail items.
`migrateState()` updates derived mapping fields and confirmation reservations, while past history, attempts, drillLog, streak/confirmStreak and mastered status are preserved.

## Audit loop

### Revision found during audit
The first review found:
1. `nd10` used “NOT stated” while two distractors were only implied rather than explicitly stated.
2. `rdt_in02` allowed a weaker second insertion position.
3. `rdt_in03` allowed a broader “For example” interpretation at another position.

These were revised. CLEAN count was reset to zero.

### CLEAN 1
After revision:
- full `tests/audit.mjs`: PASS
- active total remains 283
- official-answer hashes unchanged
- 2019-2026 exam totals unchanged
- storage schema/key unchanged
- migration/recovery tests PASS

Result: CLEAN.

### CLEAN 2 — independent detail audit
`tests/detail-audit.mjs` independently checks:
- all 50 source detail items receive one of the four audited target IDs
- no source item falls back to old `explicit-evidence` / `inference-evidence`
- 13 mismatched legacy detail IDs are retired
- 7 `nd` items are reused
- 20 active detail drills remain
- each target has 5 distinct families
- each target has at least two level-3 items
- all active detail items are labeled `【オリジナル類題】`
- answer indexes/options are structurally valid
- explanation minimum fields are present
- migration preserves historical/mastery facts

Result: CLEAN.

## Status
The detail implementation described above has two consecutive CLEAN results and may be treated as the reviewed detail candidate.
Other skills have not been re-audited by this report.
