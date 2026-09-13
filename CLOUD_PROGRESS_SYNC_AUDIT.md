# English Cloud Progress Sync audit

## Scope
- Preserve `waseshibu.adaptive.v3` and schema v8 unchanged.
- Add read-only Cloudflare progress reconciliation through shared `waseshibu-progress-sync` IndexedDB.
- Keep local learning fully usable when network/API sync fails.
- Do not upload raw English answers or manual-response text.
- Keep per-device current state separate so snapshots are not simply added together.

## Review result
- Pass 1: CLEAN after fixing unstarted-year payload handling.
- Guard coverage: app id, shared DB v7, current-state records, exam max score 80, baseline, batch upload, control refresh, deadletter, page-exit reconciliation, storage-key compatibility, raw-answer exclusion.

A second CI pass is required before main/publication.
