# Testing, logging and git

Read this before writing tests, adding logging, or committing.

## What must be tested

**Unit tests (pure logic):**
- Eligibility engine: every rule, every boundary (CGPA equal to the minimum, empty branch list, passed deadline, closed job).
- Status machine: every allowed transition, and every disallowed one returns a conflict.
- Matching: embeddings beat keyword on differently worded resumes; the TF-IDF fallback runs when embeddings are disabled; threshold boundary behaves correctly; score stays within 0 to 100.
- Synonym normalization and skill extraction fallback.
- LLM tasks: invalid or malformed model output falls back cleanly (mock the client; tests never call Groq).

**Integration tests (supertest, in-memory or test database):**
- Auth: register, login, wrong password, suspended user.
- RBAC: each role against each protected route family; cross-owner access returns 403.
- Apply: success, ineligible (422 with failures), duplicate (409), closed job.
- Resume upload: valid PDF, wrong type (415), oversize (413), corrupt PDF (parseStatus failed, no 500).
- Application list: pagination, sorting by score, status filter, minScore.
- Reports: drive report counts match seeded data.

Tests must run with `AI_ENABLED=false` and `EMBEDDINGS_ENABLED=false` by default so they are fast and need no keys. A small embeddings test may run separately and is skipped if the model is absent.

## Logging
- pino with a request id on every request. Log method, path, status and duration. Never log passwords, tokens, API keys or resume text.
- Log once at boot: embeddings status, LLM enabled or disabled, `process.memoryUsage()`.
- Errors go through the central error handler; unexpected errors are logged with stack in development and without stack in production responses.

## Git
- Branch per phase: `phase-1-foundation`, `phase-2-auth`, and so on. Merge to `main` only after the phase's "Done when" checks pass.
- Small, meaningful commits with imperative messages (`Add eligibility engine with boundary tests`). Never commit `.env`, `server/models/`, `node_modules` or uploaded files.
- Tag a working state before risky work (`git tag phase-5-done`) so a bad change can be rolled back.
- Keep `.env.example` current in every commit that adds an env variable.

## Definition of done reminder
Runs locally, routes validated and guarded, tests added, no console errors, env documented, Postman collection and `docs/architecture.md` updated.
