# API contract

Read this before adding or changing any route. All paths are prefixed with `/api`. Protected routes need `Authorization: Bearer <token>`.

## Response shape
- Success: `{ success: true, data }`
- List: `{ success: true, data: [...], meta: { page, limit, total, totalPages } }`
- Failure: `{ success: false, error: { code, message, details? } }`

## Status codes
400 validation, 401 unauthenticated, 403 forbidden, 404 not found, 409 conflict (duplicate application, invalid transition), 413 file too large, 415 wrong file type, 422 eligibility failure on apply (include the failures array), 429 rate limited.

## Endpoints

| Area | Endpoints |
|---|---|
| Health | `GET /health` returns `{ db, embeddings: 'ready' or 'fallback', llm: 'enabled' or 'disabled', memoryMb }` |
| Auth | `POST /auth/register`, `POST /auth/login`, `GET /auth/me` |
| Student | `GET /students/me`, `PUT /students/me`, `POST /students/me/resume`, `GET /students/me/resume`, `POST /students/me/resume/reparse`, `GET /students/:id` (admin, or recruiter of an applied job) |
| Jobs | `POST /jobs`, `GET /jobs` (q, role, location, company, type, eligible=true, status, page, limit, sort), `GET /jobs/:id`, `PUT /jobs/:id`, `PATCH /jobs/:id/publish`, `PATCH /jobs/:id/close`, `DELETE /jobs/:id` (draft only), `GET /jobs/recommended`, `POST /jobs/ai/suggest-skills` |
| Eligibility and fit | `GET /jobs/:id/eligibility`, `GET /jobs/:id/fit` (eligibility + match score + skill gaps) |
| Applications | `POST /jobs/:id/apply`, `GET /applications/me`, `GET /jobs/:id/applications` (page, limit, sort=score or date, status, minScore, q), `PATCH /applications/:id/status`, `GET /applications/:id/ai-summary`, `GET /jobs/:id/applications/export.csv` |
| Matching | `GET /matching/:jobId/:studentId`, `GET /matching/:jobId/:studentId/compare` (keyword vs TF-IDF vs embeddings) |
| Interviews | `POST /interviews`, `GET /interviews/me`, `GET /interviews?from=&to=`, `PATCH /interviews/:id` (reschedule, cancel, complete) |
| Notifications | `GET /notifications`, `PATCH /notifications/:id/read`, `PATCH /notifications/read-all` |
| Analytics | `GET /analytics/overview`, `GET /analytics/skills-demand`, `GET /analytics/placements` |
| Reports | `GET /analytics/reports/drive/:jobId`, `GET /analytics/reports/drive/:jobId/export.csv`, `GET /analytics/reports/overview/export.csv` (admin) |
| Admin | `GET /admin/students`, `PATCH /admin/students/:id`, `GET /admin/recruiters`, `PATCH /admin/recruiters/:id/approve`, `GET /admin/drives`, `GET /admin/audit-logs`, `GET /admin/export/students.csv` |

## Permissions

| Action | Student | Recruiter | Admin |
|---|---|---|---|
| Edit own profile, upload resume | yes | no | no |
| View own applications | yes | no | all |
| Browse open jobs | yes | yes | yes |
| Create, edit, publish, close jobs | no | own jobs only, approved only | any |
| Apply to a job | yes, if eligible | no | no |
| View applicants of a job | no | own jobs only | any |
| Change application status | no | own jobs only | any |
| Schedule interviews | no | own jobs only | any |
| View a student record | own only | only students who applied to their jobs | all |
| Approve recruiters, manage students | no | no | yes |
| Analytics, reports, audit logs, exports | no | own jobs only (no audit logs) | all |

Object-level checks are mandatory: a recruiter requesting another recruiter's job or applicants gets 403; a student requesting another student's profile gets 403.

## Route checklist (apply to every new route)
1. Zod schema for body, query and params.
2. `auth` then `authorize(roles)` middleware.
3. Ownership check in the service, not the controller.
4. Pagination, sorting and filtering for lists.
5. Audit log entry for sensitive actions.
6. Entry added to the Postman collection and `docs/architecture.md`.
