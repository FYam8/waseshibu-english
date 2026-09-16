# Writing grader Worker

Production endpoint for optional learning-only AI feedback on all eight free-writing exams and 45 free-writing drills.

- One Workers AI call per explicit user action; there is no retry or automatic background call.
- Answers are capped at 1,200 characters, the whole request at 16,000 characters, and output at 900 tokens.
- Global and per-client one-minute rate limits protect the public endpoint.
- Scores are calculated by deterministic code after the model returns fixed semantic signals.
- The endpoint never changes progress sync data. The browser stores feedback only in the existing manual-answer object as additive fields.
- Exam and drill IDs are allowlisted; caller-provided task text is bounded and treated as untrusted quoted data.
- Logs contain task ID, scope, skill, aggregate token counts, and issue count, but not the student's answer.

Deploy with Wrangler 4.36 or later from this directory. No API token is stored in the repository; the `AI` binding supplies Workers AI access at runtime.
