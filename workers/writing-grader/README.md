# Writing grader Worker

Production endpoint for the optional learning-only AI feedback shown for `2024:4` and `2026:6`.

- One Workers AI call per explicit user action; there is no retry or automatic background call.
- Input is capped at 1,200 characters and output at 900 tokens.
- Global and per-client one-minute rate limits protect the public endpoint.
- Scores are calculated by deterministic code after the model returns fixed semantic signals.
- The endpoint never changes progress sync data. The browser stores feedback only in the existing manual-answer object as additive fields.
- Logs contain question ID, aggregate token counts, and issue count, but not the student's answer.

Deploy with Wrangler 4.36 or later from this directory. No API token is stored in the repository; the `AI` binding supplies Workers AI access at runtime.
