import rateLimit from 'express-rate-limit';

const standardResponse = (message) => ({
  success: false,
  error: {
    code: 'TOO_MANY_REQUESTS',
    message,
  },
});

/**
 * Global rate limiter: 100 requests per 15 minutes per IP
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: standardResponse('Too many requests, please try again in 15 minutes'),
});

/**
 * Strict rate limiter for authentication routes: 10 requests per 15 minutes per IP
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: standardResponse('Too many login/registration attempts, please try again later'),
});

export default {
  globalLimiter,
  authLimiter,
};

