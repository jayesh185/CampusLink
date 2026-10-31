# Data models (Mongoose)

Read this before touching any schema, seed script or aggregation. Every schema uses `timestamps: true`. Vector fields use `select: false`; round vector values to 4 decimals.

## User
- `email` (unique, lowercase), `passwordHash`, `name`
- `role`: `student` | `recruiter` | `admin`
- `status`: `active` | `pending` | `suspended` (new recruiters start `pending`)
- `lastLoginAt`

## StudentProfile
- `user` (ref, unique), `rollNo`, `branch`, `cgpa` (0 to 10), `gradYear`, `backlogs` (int, default 0), `phone`
- `skills[]`
- `projects[]`: `{ title, description, techStack[] }`
- `experience[]`: `{ company, role, description, startDate, endDate }`
- `resume`: `{ fileId, fileName, uploadedAt, parsedText, parsedSkills[], parseStatus ('none' | 'ok' | 'failed'), parseError, aiExtraction { data, model, promptVersion, fallbackUsed } }`
- `embeddings` (select:false): `{ model, version, items: [{ kind ('skill' | 'project' | 'experience'), text, vector[384] }], doc: [384], updatedAt }`
- Indexes: `user`, `branch`, `cgpa`, `gradYear`

## RecruiterProfile
- `user` (ref, unique), `company`, `designation`, `website`

## Job
- `recruiter` (ref User), `company`, `title`, `description`, `location`
- `type`: `full_time` | `internship`, `salaryRange`
- `requiredSkills[]`
- `eligibility`: `{ branches[], minCgpa, gradYear, maxBacklogs }` (empty `branches` means all)
- `status`: `draft` | `open` | `closed`, `deadline`, `driveDate`
- `embeddings` (select:false): `{ model, version, skills: [{ text, vector[384] }], doc: [384], updatedAt }`
- Indexes: `status`, `company`, `location`, text index on `title + description + requiredSkills`

## Application
- `job`, `student` (ref User)
- `status`: `applied` | `shortlisted` | `interview_scheduled` | `selected` | `rejected`
- `matchScore` (0 to 100)
- `matchBreakdown`: `{ method, weights, skillCoverage, docSimilarity, projectRelevance, matchedSkills[{ required, via, similarity }], missingSkills[], comparison { keyword, tfidf, embeddings } }`
- `aiSummary`: `{ text, model, promptVersion, fallbackUsed, generatedAt }` (written after apply, in the background)
- `eligibilitySnapshot`: `{ eligible, failures[] }`
- `statusHistory[]`: `{ from, to, by, note, at }`
- `resumeVersion` (fileId at apply time)
- Indexes: unique `{ job, student }`, `{ job, status }`

## Interview
- `application`, `job`, `student`, `recruiter`
- `scheduledAt`, `durationMins`, `mode` (`online` | `onsite`), `location` or `link`
- `status`: `scheduled` | `completed` | `cancelled` | `rescheduled`, `notes`
- Index: `scheduledAt`

## Notification
- `user`, `type`, `title`, `message`, `link`, `read` (bool)
- Index: `{ user, read, createdAt }`

## AuditLog
- `actor`, `actorRole`, `action` (e.g. `JOB_PUBLISHED`, `APPLICATION_STATUS_CHANGED`, `RECRUITER_APPROVED`), `targetType`, `targetId`, `meta`, `ip`
- Indexes: `actor`, `createdAt`

## Rules
- Never load vectors in list queries. Use `.lean()` and explicit projections.
- Re-embed only when the source content changes. Store the model name and version with every vector; if the model changes, regenerate all vectors.
- Resume files live in GridFS; the profile stores only `fileId`.
