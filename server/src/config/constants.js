/**
 * System-wide constants, enums and business state machines
 */

export const ROLES = Object.freeze({
  STUDENT: 'student',
  RECRUITER: 'recruiter',
  ADMIN: 'admin',
});

export const USER_STATUS = Object.freeze({
  ACTIVE: 'active',
  PENDING: 'pending',
  SUSPENDED: 'suspended',
});

export const JOB_STATUS = Object.freeze({
  DRAFT: 'draft',
  OPEN: 'open',
  CLOSED: 'closed',
});

export const JOB_TYPE = Object.freeze({
  FULL_TIME: 'full_time',
  INTERNSHIP: 'internship',
});

export const APPLICATION_STATUS = Object.freeze({
  APPLIED: 'applied',
  SHORTLISTED: 'shortlisted',
  INTERVIEW_SCHEDULED: 'interview_scheduled',
  SELECTED: 'selected',
  REJECTED: 'rejected',
});

/**
 * Valid state transitions for applications
 * Terminal states: selected, rejected
 */
export const VALID_APPLICATION_TRANSITIONS = Object.freeze({
  [APPLICATION_STATUS.APPLIED]: [
    APPLICATION_STATUS.SHORTLISTED,
    APPLICATION_STATUS.REJECTED,
  ],
  [APPLICATION_STATUS.SHORTLISTED]: [
    APPLICATION_STATUS.INTERVIEW_SCHEDULED,
    APPLICATION_STATUS.REJECTED,
  ],
  [APPLICATION_STATUS.INTERVIEW_SCHEDULED]: [
    APPLICATION_STATUS.SELECTED,
    APPLICATION_STATUS.REJECTED,
    APPLICATION_STATUS.SHORTLISTED, // if interview is cancelled
  ],
  [APPLICATION_STATUS.SELECTED]: [], // terminal
  [APPLICATION_STATUS.REJECTED]: [], // terminal
});

export const INTERVIEW_MODE = Object.freeze({
  ONLINE: 'online',
  ONSITE: 'onsite',
});

export const INTERVIEW_STATUS = Object.freeze({
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  RESCHEDULED: 'rescheduled',
});

export const RESUME_PARSE_STATUS = Object.freeze({
  NONE: 'none',
  OK: 'ok',
  FAILED: 'failed',
});

export const AUDIT_ACTIONS = Object.freeze({
  USER_REGISTERED: 'USER_REGISTERED',
  USER_LOGGED_IN: 'USER_LOGGED_IN',
  RECRUITER_APPROVED: 'RECRUITER_APPROVED',
  STUDENT_SUSPENDED: 'STUDENT_SUSPENDED',
  STUDENT_ACTIVATED: 'STUDENT_ACTIVATED',
  JOB_CREATED: 'JOB_CREATED',
  JOB_UPDATED: 'JOB_UPDATED',
  JOB_PUBLISHED: 'JOB_PUBLISHED',
  JOB_CLOSED: 'JOB_CLOSED',
  APPLICATION_SUBMITTED: 'APPLICATION_SUBMITTED',
  APPLICATION_STATUS_CHANGED: 'APPLICATION_STATUS_CHANGED',
  INTERVIEW_SCHEDULED: 'INTERVIEW_SCHEDULED',
  INTERVIEW_UPDATED: 'INTERVIEW_UPDATED',
});

export const MATCH_WEIGHTS = Object.freeze({
  EMBEDDINGS: {
    SKILL: 0.50,
    DOC: 0.30,
    PROJECT: 0.20,
  },
  TFIDF_FALLBACK: {
    SKILL: 0.50,
    DOC: 0.35,
    PROJECT: 0.15,
  },
});

