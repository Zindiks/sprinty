import { ApiError } from './ApiError';
import { ErrorCodes } from '../constants/errorCodes';
import { HttpStatus } from '../constants/httpStatus';

/**
 * InternalServerError - 500 Internal Server Error
 * Used for unexpected server errors
 */
export class InternalServerError extends ApiError {
  constructor(message: string = 'Internal server error', details?: any) {
    super(
      message,
      HttpStatus.INTERNAL_SERVER_ERROR,
      ErrorCodes.INTERNAL_SERVER_ERROR,
      true,
      details
    );

    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}

/**
 * DatabaseError - 500 Internal Server Error
 * Used when database operations fail
 */
export class DatabaseError extends ApiError {
  constructor(message: string = 'Database error occurred', details?: any) {
    super(
      message,
      HttpStatus.INTERNAL_SERVER_ERROR,
      ErrorCodes.DATABASE_ERROR,
      true,
      details
    );

    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}

/**
 * ServiceUnavailableError - 503 Service Unavailable
 * Used when a service is temporarily unavailable
 */
export class ServiceUnavailableError extends ApiError {
  constructor(message: string = 'Service temporarily unavailable', details?: any) {
    super(
      message,
      HttpStatus.SERVICE_UNAVAILABLE,
      ErrorCodes.SERVICE_UNAVAILABLE,
      true,
      details
    );

    Object.setPrototypeOf(this, ServiceUnavailableError.prototype);
  }
}
