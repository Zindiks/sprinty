// Base error class
export * from './ApiError';

// Validation errors (400)
export * from './ValidationError';

// Authentication errors (401)
export * from './AuthenticationError';

// Authorization errors (403)
export * from './AuthorizationError';

// Not found errors (404)
export * from './NotFoundError';

// Conflict errors (409)
export * from './ConflictError';

// Server errors (500+)
export * from './InternalServerError';
