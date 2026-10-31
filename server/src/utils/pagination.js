/**
 * Helper to parse pagination and sorting parameters from Express request queries
 * Follows Rule 4: returns { data, meta: { page, limit, total, totalPages } }
 */

export const getPaginationParams = (query, defaultLimit = 10, maxLimit = 100) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const rawLimit = parseInt(query.limit, 10) || defaultLimit;
  const limit = Math.min(Math.max(1, rawLimit), maxLimit);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

/**
 * Builds the standard pagination metadata object
 */
export const buildPaginationMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit) || 1;
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

/**
 * Formats a paginated list response according to Rule 4 and Rule 5
 */
export const formatPaginatedResponse = (data, total, page, limit) => {
  return {
    success: true,
    data,
    meta: buildPaginationMeta(total, page, limit),
  };
};

