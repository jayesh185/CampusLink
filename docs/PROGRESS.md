# PROGRESS.md: CampusLink build log

The agent reads this at the start of every session and updates it at the end of every phase (and before stopping mid-phase). It is the single source of truth for "where are we". The owner may edit it too.

## Current status

- **Current phase:** Phase 1 (not started)
- **Last completed step:** none
- **Next action:** start Phase 1 (Foundation)
- **Last updated:** (agent fills in date and time)

## Phase checklist

| Phase | Name | Status | Done-when checks passed | Notes |
|---|---|---|---|---|
| 1 | Foundation | not started | | |
| 2 | Models and Auth | not started | | |
| 3 | Student profile, resume, AI infra | not started | | |
| 4 | Jobs and eligibility | not started | | |
| 5 | Matching engine | not started | | |
| 6 | Applications and workflow | not started | | |
| 7 | Interviews, notifications, calendar | not started | | |
| 8 | Admin, analytics, reports, audit | not started | | |
| 9 | Seed, hardening, docs | not started | | |
| 10 | Render deployment | not started | | |

Status values: `not started`, `in progress`, `done`, `blocked`.

## Environment status

| Item | State |
|---|---|
| Atlas cluster and DB user | not set up |
| `.env` created locally | no |
| `LLM_MODEL` chosen | no |
| Embedding model downloaded to `server/models/` | no |
| Render service created | no |

## Decisions made during the build

Record any decision not already in `AGENTS.md` or `docs/spec/` (e.g. a tuned `SKILL_MATCH_THRESHOLD`, a library swap the owner approved).

- (none yet)

## Deviations from the spec

Anything built differently from the spec, with the reason and whether the owner approved it.

- (none yet)

## Known issues and TODOs

- (none yet)

## Last session summary

(The agent writes 3 to 6 lines here at the end of each phase: what was built, which files matter most, what was tested, what to do next.)

## How to resume

1. Read `AGENTS.md`, then this file, then the spec files relevant to the next phase.
2. Run `git status` and `git log -5` to confirm the working tree matches this log.
3. Run `npm test` and the dev server to confirm the last phase still works.
4. Continue from "Next action" above. If anything here disagrees with the code, tell the owner before proceeding.
