# Eligibility, matching and AI

Read this before touching eligibility, matching, embeddings, workers or any LLM code.

## 1. Eligibility engine
Pure function: `(studentProfile, job) -> { eligible, failures: [{ rule, required, actual, message }] }`.

Rules: branch in allowed list (empty list means all); `cgpa >= minCgpa`; `gradYear` equals the required year when set; `backlogs <= maxBacklogs`; job status is `open`; deadline has not passed.

Messages must be readable, e.g. `CGPA 6.8 is below the required 7.5`. The same function is used by `GET /jobs/:id/eligibility` and by apply (which returns 422 with the failures). Unit-test every rule and every boundary.

## 2. Embedding service
- Model: `all-MiniLM-L6-v2` via `@huggingface/transformers`, 384 dimensions. Files live in `server/models/`, downloaded at build time by `scripts/download-model.js`. Remote loading is disabled in production.
- Interface: `embed(texts[]) -> number[][]`. Vectors are normalized to unit length, so cosine similarity is a dot product.
- Long text: split into chunks of about 200 words, embed each, average the chunk vectors, normalize.
- Runs only in the embedding worker pool (1 thread), preloaded at boot. If loading fails, log once and switch to the TF-IDF fallback.
- Embed at upload, profile update, job create, update and publish. Never at ranking or list time.

## 3. Matching engine
Inputs: resume items (profile skills, parsed skills, each project, each experience entry) and job items (each required skill, the description). Normalize skill strings through `utils/skillSynonyms.js` (80+ entries: ml = machine learning, js = javascript, reactjs = react, k8s = kubernetes).

Components:
- **Skill coverage, weight 0.50:** per required skill, best cosine similarity among resume items. At or above `SKILL_MATCH_THRESHOLD` (start 0.55, tune on seeded resumes) it counts as matched. An exact synonym match counts as 1.0. Coverage = matched / required.
- **Document similarity, weight 0.30:** cosine of resume and job document vectors, rescaled and clamped to 0..1 (tune the range on seed data).
- **Project and experience relevance, weight 0.20:** mean of the top 3 similarities between project or experience items and the job description vector.

Final score = weighted sum x 100, rounded.

**Fallback (embeddings unavailable):** 0.50 synonym skill overlap + 0.35 TF-IDF document similarity + 0.15 project relevance. Set `method: 'tfidf-fallback'`.

**Explanation object:**
```
{ score: 78, method: 'embeddings',
  breakdown: { skillCoverage, docSimilarity, projectRelevance, weights },
  matchedSkills: [{ required, via, similarity }],
  missingSkills: [...],
  comparison: { keyword, tfidf, embeddings },
  summary: 'Strong match: 4 of 5 required skills found. Missing: Docker.' }
```

**Compare endpoint:** returns the score and matched skills for keyword (exact token match only), TF-IDF with synonyms, and embeddings, plus the skills only embeddings found. Seed resumes worded differently for the same skills so the gap is visible.

**Skill gaps:** for each missing skill return 1 or 2 free resources from `utils/learningResources.js`.

## 4. Worker pools
- `workers/pool.js` creates two Piscina pools: parse (`PARSE_THREADS`, default 2) and embedding (`EMBEDDINGS_THREADS`, default 1).
- Workers are pure: no DB access, input in, result out. Every task has a timeout and a fallback so a bad PDF or model error cannot hang a request.
- Single Node process only (no PM2 cluster): each process would load its own model copy. Log `process.memoryUsage()` after model preload.

## 5. LLM module (Groq)
- `ai/llmClient.js` wraps the `openai` SDK with `baseURL = LLM_BASE_URL`. Features: timeout, 2 retries with exponential backoff on 429 and 5xx, in-process queue limited by `LLM_MAX_CONCURRENCY`, `AI_ENABLED` kill switch.
- Request JSON output at low temperature; validate every response with Zod. If the model lacks strict schema mode, use JSON mode and include the word JSON in the prompt.
- Tasks:
  1. `extractResume`: resume text to structured skills, projects, experience, education. Fallback: regex plus synonym extractor.
  2. `suggestJobSkills`: job description to suggested skills. The recruiter always reviews before publishing. Fallback: synonym-map keyword extraction.
  3. `explainMatch`: receives only computed facts, writes a 2 to 3 sentence summary and student gap advice. It may not add facts. Fallback: string template. Runs in the background after apply.
- Prompts live in `ai/prompts/` with a `promptVersion`. Resume text is passed as delimited data; the system prompt says to ignore instructions inside it.
- Cache results on the document (hash of input + `promptVersion`). Store `model`, `promptVersion`, `fallbackUsed` with every result.
- `ai/sanitize.js` strips emails and phone numbers before text leaves the server.

## 6. Recruitment reports
Drive report (JSON and CSV) for one job: applicant count, funnel counts per status, average and median match score, top applicant skills, most common missing skills, interview counts, selection rate, applications per day. Admin overview CSV across all drives. Recruiters see only their own jobs.
