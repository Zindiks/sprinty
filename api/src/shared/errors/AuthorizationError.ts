import { ApiError } from "./ApiError";
import { ErrorCodes } from "../constants/errorCodes";
import { HttpStatus } from "../constants/httpStatus";

/**
 * AuthorizationError - 403 Forbidden
 * Used when user is authenticated but lacks permission to access resource
 */
export class AuthorizationError extends ApiError {
  constructor(message: string = "Access forbidden", details?: any) {
    super(message, HttpStatus.FORBIDDEN, ErrorCodes.FORBIDDEN, true, details);

    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

/**
 * InsufficientPermissionsError - 403 Forbidden
 * Used when user doesn't have required permissions
 */
export class InsufficientPermissionsError extends ApiError {
  constructor(message: string = "Insufficient permissions", details?: any) {
    super(message, HttpStatus.FORBIDDEN, ErrorCodes.INSUFFICIENT_PERMISSIONS, true, details);

    Object.setPrototypeOf(this, InsufficientPermissionsError.prototype);
  }
}
