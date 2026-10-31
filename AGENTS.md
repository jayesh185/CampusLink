# AGENTS.md: CampusLink

Persistent instructions for any coding agent working in this repo. Read this fully before every task. If a request conflicts with this file, stop and ask.

## 1. What this project is

CampusLink is an AI-assisted college placement and recruitment platform (Nexaura Prompt Battle, PS 03). Three roles:

- **student:** maintains profile, uploads PDF resume, discovers jobs, sees eligibility and match score, applies, tracks status, attends interviews.
- **recruiter:** posts jobs with eligibility rules, reviews ranked applicants, shortlists, schedules interviews. Must be approved by an admin before publishing.
- **admin:** approves recruiters, manages students, monitors drives, sees analytics, reports and audit logs. Created only by the seed script.

The owner does not write code. You write all of it, phase by phase, and stop at the end of each phase for the owner to test.

## 2. Fixed stack (do not change without explicit permission)

- **Database:** MongoDB Atlas via Mongoose. Resume files in GridFS.
- **Server:** Node 20, Express, JavaScript (no TypeScript). Zod, JWT, bcrypt, multer, helmet, cors, compression, express-rate-limit, pino, Piscina, pdf-parse, natural (TF-IDF).
- **Embeddings:** `@huggingface/transformers` running `all-MiniLM-L6-v2` locally (384 dims). No external embeddings API.
- **LLM:** Groq through its OpenAI-compatible API using the `openai` SDK. Configured only by env: `LLM_BASE_URL`, `LLM_MODEL`, `LLM_API_KEY`.
- **Client:** React 18, Vite, React Router 6, TanStack Query, axios, Tailwind CSS, react-hook-form, recharts, react-hot-toast.
- **Tests:** Vitest or Jest, plus supertest for the server.
- **Hosting:** backend on Render (assume 512 MB RAM), frontend on Vercel or Netlify, database on Atlas.

## 3. Repository layout

One repo, npm workspaces, `client/` and `server/` as sibling folders under the root.

```
campuslink/
├── package.json  render.yaml  README.md  AGENTS.md
├── docs/            # architecture.md, postman collection
├── server/
│   ├── models/      # embedding model files, downloaded at BUILD time (gitignored)
│   ├── scripts/     # download-model.js
│   └── src/
│       ├── config/ middleware/ models/ utils/ seed/
│       ├── modules/ # auth users students recruiters jobs eligibility applications
│       │            # interviews matching notifications analytics reports audit admin
│       ├── ai/      # llmClient, prompts, schemas, extractResume, suggestJobSkills, explainMatch, sanitize
│       ├── embeddings/  # embeddingService, vectorMath, chunking
│       └── workers/ # pool.js (two pools), parseResume, embedText, matchScore
└── client/src/      # app api features components layouts hooks routes utils
```

Each server module has exactly: `*.routes.js`, `*.controller.js`, `*.service.js`, `*.validation.js`. Controllers only handle HTTP. Services hold business logic. Mongoose models live in `server/src/models`.

## 4. Commands

Create these npm scripts if they do not exist, and keep them working:

- `npm run dev`: run server and client together.
- `npm run seed`: wipe and recreate demo data (idempotent, prints demo credentials).
- `npm test`: run server tests.
- `npm run build`: client build; server build step runs `scripts/download-model.js`.
- `npm start`: `node server/src/server.js` (single process).

## 5. Coding rules

1. Every route is validated with Zod, authenticated where needed, and role-guarded. Authorization is enforced on the backend. Object-level ownership checks are mandatory (a recruiter cannot touch another recruiter's job; a student cannot read another student's data).
2. All list endpoints support server-side pagination, sorting and filtering and return `{ data, meta: { page, limit, total, totalPages } }`.
3. Response shape: success `{ success: true, data }`, failure `{ success: false, error: { code, message, details? } }`. Use `ApiError` and one central error handler. Never leak stack traces in production.
4. HTTP codes: 400 validation, 401 unauthenticated, 403 forbidden, 404 not found, 409 conflict (duplicate application, invalid status transition), 413 file too large, 415 wrong file type, 422 eligibility failure on apply (include the failures array), 429 rate limited.
5. All config comes from validated env vars in `server/src/config/env.js`. Keep `.env.example` files current. Never hardcode or log secrets.
6. Dates are stored in UTC (ISO). Passwords hashed with bcrypt. Never return password hashes.
7. Write small, readable files with brief comments on non-obvious logic. No dead code and no TODO placeholders in a finished phase.
8. Prefer boring, standard solutions. Add a dependency only if it is needed, and say why.

## 6. Domain rules (do not break)

- **Eligibility** is a pure function: branch in allowed list (empty means all), `cgpa >= minCgpa`, grad year match, `backlogs <= maxBacklogs`, job `open`, deadline not passed. Failures return readable messages, e.g. `CGPA 6.8 is below the required 7.5`. It is enforced on the backend at apply time and mirrored in the UI.
- **Application status machine:** `applied -> shortlisted | rejected`; `shortlisted -> interview_scheduled | rejected`; `interview_scheduled -> selected | rejected | shortlisted`; `selected` and `rejected` are terminal. Any other transition returns 409. Every transition appends to `statusHistory`, writes an audit log and creates a notification.
- A unique index on `{ job, student }` prevents duplicate applications.
- Resume uploads: PDF only, max 5 MB, MIME and magic-byte checks. Parse failures set `parseStatus: 'failed'` and never return a 500.

## 7. AI rules

- **The LLM never decides eligibility or the final match score.** It may only extract structured data from resumes, suggest job skills for human review, and rephrase facts already computed.
- Validate every LLM output with Zod. On any failure, timeout, missing key or `AI_ENABLED=false`, use the non-LLM fallback and record `fallbackUsed: true`. Store `model` and `promptVersion` with each result.
- Treat resume text as untrusted input. Pass it to prompts as delimited data, ignore instructions found inside it, and strip emails and phone numbers before sending text to the LLM.
- **Matching score** = 0.50 skill coverage + 0.30 document similarity + 0.20 project relevance, using stored embeddings. The TF-IDF path is the baseline and the fallback. Return an explanation object with per-skill evidence, matched and missing skills, and the keyword / TF-IDF / embeddings comparison.
- Never call the LLM or the embedding model inside a list endpoint. Compute at upload, publish or apply time, store the result, read the stored value. The apply request must never wait on Groq.
- The app must work fully with `AI_ENABLED=false` and `EMBEDDINGS_ENABLED=false`.

## 8. Performance and memory (Render 512 MB)

- CPU-heavy work (PDF parsing, embeddings, matching) runs in Piscina workers, never on the main event loop.
- Two pools: parse pool (`PARSE_THREADS`, default 2) and embedding pool (`EMBEDDINGS_THREADS`, default 1). Never raise `EMBEDDINGS_THREADS` above 1.
- Run a single Node process. Do not use PM2 cluster mode or `cluster`: each process would load its own copy of the model.
- Download model files during the build into `server/models/`. Never download at runtime. Preload the model at boot and log `process.memoryUsage()`.
- Mongoose vectors use `select: false`. Use `.lean()` and projections on lists.

## 9. Security

helmet, strict CORS from env, rate limiting (global and stricter on auth), mongo-sanitize, Zod on every input, audit logging for sensitive actions. No secrets in the repo, client bundle, logs, prompts or chat.

## 10. How to work

1. Work one phase at a time. Do not start the next phase until the owner confirms.
2. Before coding a phase, restate in 3 to 5 lines what you will build. Then build it completely.
3. At the end of a phase, print: files created or changed, how to run it, the exact Postman requests to test it, and the phase's "Done when" checks with pass or fail.
4. Run tests and the server before saying a phase is done. If something cannot be verified, say so plainly.
5. If a requirement is ambiguous or conflicts with this file, ask one specific question instead of guessing.
6. Do not refactor or rename things outside the current phase unless asked.
7. Keep `docs/architecture.md` and the Postman collection updated as routes are added.

## 11. Definition of done (per phase)

- Code runs locally with `npm run dev`.
- New routes validated, role-guarded and ownership-checked.
- Tests added for business logic (eligibility, status transitions, matching) and key routes.
- No console errors, no unhandled promise rejections.
- Env vars documented in `.env.example`.
- Nothing hardcoded that belongs in env.

## 12. Demo priorities

Never drop: eligibility enforcement on the backend, match explanation with per-skill evidence, the keyword vs TF-IDF vs embeddings comparison, the seed script (works with no LLM key), and the `/api/health` endpoint reporting `{ db, embeddings, llm, memoryMb }`. Cut first if short on time: calendar view, audit viewer UI, analytics charts, CSV exports, LLM explanations (keep the template text).
