/**
 * Wraps asynchronous Express route handlers to forward errors to next()
 * @param {Function} fn - async handler function
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;

