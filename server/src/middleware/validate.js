import ApiError from '../utils/ApiError.js';

/**
 * Middleware generator for Zod validation on request data
 * @param {Object} schemas - object containing optional body, query, and params Zod schemas
 */
export const validate = (schemas) => (req, res, next) => {
  const errors = {};

  if (schemas.body) {
    const result = schemas.body.safeParse(req.body);
    if (!result.success) {
      errors.body = result.error.flatten().fieldErrors;
    } else {
      req.body = result.data;
    }
  }

  if (schemas.query) {
    const result = schemas.query.safeParse(req.query);
    if (!result.success) {
      errors.query = result.error.flatten().fieldErrors;
    } else {
      req.query = result.data;
    }
  }

  if (schemas.params) {
    const result = schemas.params.safeParse(req.params);
    if (!result.success) {
      errors.params = result.error.flatten().fieldErrors;
    } else {
      req.params = result.data;
    }
  }

  if (Object.keys(errors).length > 0) {
    return next(new ApiError(400, 'Validation failed', 'VALIDATION_ERROR', errors));
  }

  return next();
};

export default validate;

