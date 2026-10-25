# Story feedback quote repair

Production logs recorded `ungrounded story correction` (HTTP 502). The prior
repair prompt asked the model to copy the original text again; a model could
repeat a reconstructed/corrected quote and exhaust all three attempts.

The normal assessment still uses exact quoted substrings. Its bounded repair
now supplies numbered original words. A repair may identify a zero-based,
inclusive word range; the server extracts the original characters verbatim,
including punctuation and whitespace, then runs the original validation and
scoring rules. Invalid, conflicting and oversized ranges are rejected. No
unanchored feedback, invented replacement quote or default grade is accepted.

The response shape, score limits, task authority, origin checks, deadline and
rate limiter remain the same. This repair is used only by Rikkyo story tasks;
Waseda tasks and the Rikkyo reading adapter use their existing paths. Failures
no longer advertise the unavailable self-marking feature for story practice.

Tests reproduce an incorrect model quote, verify repaired exact evidence and
unchanged ratings, cover whitespace/range validation, and verify safe failure
when the model keeps producing ungrounded feedback. The student's screenshot
answer is not included in repository fixtures.
