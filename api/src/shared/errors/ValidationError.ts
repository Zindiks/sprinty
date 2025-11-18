import { ApiError } from "./ApiError";
import { ErrorCodes } from "../constants/errorCodes";
import { HttpStatus } from "../constants/httpStatus";

/**
 * ValidationError - 400 Bad Request
 * Used when request validation fails (invalid input, missing fields, etc.)
 */
export class ValidationError extends ApiError {
  constructor(message: string = "Validation failed", details?: any) {
    super(
      message,
      HttpStatus.BAD_REQUEST,
      ErrorCodes.VALIDATION_ERROR,
      true,
      details,
    );

    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * InvalidInputError - 400 Bad Request
 * Used when specific input is invalid
 */
export class InvalidInputError extends ApiError {
  constructor(message: string = "Invalid input provided", details?: any) {
    super(
      message,
      HttpStatus.BAD_REQUEST,
      ErrorCodes.INVALID_INPUT,
      true,
      details,
    );

    Object.setPrototypeOf(this, InvalidInputError.prototype);
  }
}
