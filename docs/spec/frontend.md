# Frontend conventions

Read this before building or changing anything in `client/`.

## Structure
- `app/`: router, providers, QueryClient. `api/`: axios instance plus one file per server module. `features/`: one folder per area (auth, student, recruiter, admin, jobs, applications, interviews, reports). `components/`: shared UI. `layouts/`: one per role. `routes/`: `ProtectedRoute`, `RoleRoute`.
- Feature folders own their pages, components and hooks. Shared components must be generic (no feature logic).

## Data and state
- Server state with TanStack Query only. One query key factory per feature. Invalidate related keys after every mutation.
- Local UI state with `useState`. No global store unless truly needed (auth user lives in context).
- All HTTP goes through the axios instance in `api/axios.js`. It attaches the Bearer token, unwraps the `{ success, data }` shape, and on 401 clears the token and redirects to login.
- Never compute eligibility or scores on the client. Display what the server returns.

## Forms
- `react-hook-form` for every form. Show server validation errors (`error.details`) next to the fields. Disable submit while pending.
- Toast on every mutation result (`react-hot-toast`).

## Routing and access
- `ProtectedRoute` requires login. `RoleRoute` requires one of the allowed roles and redirects by role. These are convenience only: the backend is the real guard.
- Default landing per role: student to `/student`, recruiter to `/recruiter`, admin to `/admin`.

## Pages by role
- **Public:** Landing, Login, Register (role picker: student or recruiter; recruiters see a pending-approval notice).
- **Student:** Dashboard (profile completeness, recent applications, upcoming interviews), Profile editor (education, skill chips, projects, experience), Resume (upload, parse status, extracted skills, re-parse), Jobs (search, filters, eligibility badge and match % per card, Recommended tab), Job detail (fit panel, apply), My Applications (status timeline from `statusHistory`), Interviews (list and calendar), Notifications bell.
- **Recruiter:** Dashboard, Jobs (form with eligibility rule builder and Suggest skills button), Applicants (server-side paginated table: sort by score, filter by status and min score, search; candidate drawer with score breakdown, AI summary, resume viewer; bulk shortlist), Interview scheduler, Calendar, Reports (funnel, score distribution, Export CSV).
- **Admin:** Overview analytics, Recruiter approvals, Student records (search, edit, suspend), Active drives, Audit log viewer (filter by actor, action, date), Exports.

## Shared components
`Table` (server-side pagination, sort), `Pagination`, `Modal`, `Badge`, `EmptyState`, `Spinner` or skeleton, `ScoreBreakdown` (per-skill evidence), `MethodComparison` (keyword vs TF-IDF vs embeddings), `StatusTimeline`.

## UI rules
- Every list and page has loading, empty and error states.
- Responsive for mobile and desktop (Tailwind breakpoints). No horizontal page scroll; wide tables scroll inside their container.
- Label AI-generated text as AI-assisted. Show a small "template" badge when `fallbackUsed` is true.
- Accessible basics: labels on inputs, keyboard-reachable buttons, sufficient contrast.
- Use `VITE_API_URL` for the API base. No secrets in the client bundle.
