/**
 * Custom operational API Error class
 * Follows Rule 5: failure -> { success: false, error: { code, message, details? } }
 */
export class ApiError extends Error {
  constructor(statusCode, message, code = 'ERROR', details = null) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = 'Bad Request', details = null) {
    return new ApiError(400, message, 'BAD_REQUEST', details);
  }

  static unauthorized(message = 'Unauthorized access', details = null) {
    return new ApiError(401, message, 'UNAUTHORIZED', details);
  }

  static forbidden(message = 'Forbidden action', details = null) {
    return new ApiError(403, message, 'FORBIDDEN', details);
  }

  static notFound(message = 'Resource not found', details = null) {
    return new ApiError(404, message, 'NOT_FOUND', details);
  }

  static conflict(message = 'Resource conflict', details = null) {
    return new ApiError(409, message, 'CONFLICT', details);
  }

  static payloadTooLarge(message = 'Payload too large', details = null) {
    return new ApiError(413, message, 'PAYLOAD_TOO_LARGE', details);
  }

  static unsupportedMediaType(message = 'Unsupported media type', details = null) {
    return new ApiError(415, message, 'UNSUPPORTED_MEDIA_TYPE', details);
  }

  static unprocessable(message = 'Validation or business rule failure', details = null) {
    return new ApiError(422, message, 'UNPROCESSABLE_ENTITY', details);
  }

  static tooManyRequests(message = 'Too many requests, please try again later', details = null) {
    return new ApiError(429, message, 'TOO_MANY_REQUESTS', details);
  }

  static internal(message = 'Internal server error', details = null) {
    return new ApiError(500, message, 'INTERNAL_SERVER_ERROR', details);
  }
}

export default ApiError;

