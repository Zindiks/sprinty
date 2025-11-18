import { ApiError } from "./ApiError";
import { ErrorCodes } from "../constants/errorCodes";
import { HttpStatus } from "../constants/httpStatus";

/**
 * ConflictError - 409 Conflict
 * Used when there's a conflict with the current state of a resource
 */
export class ConflictError extends ApiError {
  constructor(message: string = "Resource conflict", details?: unknown) {
    super(
      message,
      HttpStatus.CONFLICT,
      ErrorCodes.RESOURCE_CONFLICT,
      true,
      details,
    );

    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

/**
 * DuplicateResourceError - 409 Conflict
 * Used when trying to create a resource that already exists
 */
export class DuplicateResourceError extends ApiError {
  constructor(message: string = "Resource already exists", details?: unknown) {
    super(
      message,
      HttpStatus.CONFLICT,
      ErrorCodes.DUPLICATE_RESOURCE,
      true,
      details,
    );

    Object.setPrototypeOf(this, DuplicateResourceError.prototype);
  }
}

/**
 * UsernameAlreadyExistsError - 409 Conflict
 * Used when trying to create a user with an existing username
 */
export class UsernameAlreadyExistsError extends ApiError {
  constructor(message: string = "Username already exists", details?: unknown) {
    super(
      message,
      HttpStatus.CONFLICT,
      ErrorCodes.USERNAME_ALREADY_EXISTS,
      true,
      details,
    );

    Object.setPrototypeOf(this, UsernameAlreadyExistsError.prototype);
  }
}

/**
 * EmailAlreadyExistsError - 409 Conflict
 * Used when trying to create a user with an existing email
 */
export class EmailAlreadyExistsError extends ApiError {
  constructor(message: string = "Email already exists", details?: unknown) {
    super(
      message,
      HttpStatus.CONFLICT,
      ErrorCodes.EMAIL_ALREADY_EXISTS,
      true,
      details,
    );

    Object.setPrototypeOf(this, EmailAlreadyExistsError.prototype);
  }
}
