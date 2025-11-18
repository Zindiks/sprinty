import { ApiError } from "./ApiError";
import { ErrorCodes } from "../constants/errorCodes";
import { HttpStatus } from "../constants/httpStatus";

/**
 * AuthenticationError - 401 Unauthorized
 * Used when authentication fails or is required
 */
export class AuthenticationError extends ApiError {
  constructor(message: string = "Authentication failed", details?: any) {
    super(
      message,
      HttpStatus.UNAUTHORIZED,
      ErrorCodes.AUTHENTICATION_FAILED,
      true,
      details,
    );

    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

/**
 * InvalidCredentialsError - 401 Unauthorized
 * Used when login credentials are invalid
 */
export class InvalidCredentialsError extends ApiError {
  constructor(message: string = "Invalid credentials", details?: any) {
    super(
      message,
      HttpStatus.UNAUTHORIZED,
      ErrorCodes.INVALID_CREDENTIALS,
      true,
      details,
    );

    Object.setPrototypeOf(this, InvalidCredentialsError.prototype);
  }
}

/**
 * TokenExpiredError - 401 Unauthorized
 * Used when authentication token has expired
 */
export class TokenExpiredError extends ApiError {
  constructor(message: string = "Token has expired", details?: any) {
    super(
      message,
      HttpStatus.UNAUTHORIZED,
      ErrorCodes.TOKEN_EXPIRED,
      true,
      details,
    );

    Object.setPrototypeOf(this, TokenExpiredError.prototype);
  }
}

/**
 * InvalidTokenError - 401 Unauthorized
 * Used when authentication token is invalid
 */
export class InvalidTokenError extends ApiError {
  constructor(message: string = "Invalid token", details?: any) {
    super(
      message,
      HttpStatus.UNAUTHORIZED,
      ErrorCodes.TOKEN_INVALID,
      true,
      details,
    );

    Object.setPrototypeOf(this, InvalidTokenError.prototype);
  }
}
