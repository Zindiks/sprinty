import { ApiError } from "./ApiError";
import { ErrorCodes } from "../constants/errorCodes";
import { HttpStatus } from "../constants/httpStatus";

/**
 * NotFoundError - 404 Not Found
 * Used when a requested resource cannot be found
 */
export class NotFoundError extends ApiError {
  constructor(message: string = "Resource not found", details?: unknown) {
    super(
      message,
      HttpStatus.NOT_FOUND,
      ErrorCodes.RESOURCE_NOT_FOUND,
      true,
      details,
    );

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * UserNotFoundError - 404 Not Found
 * Used when a specific user cannot be found
 */
export class UserNotFoundError extends ApiError {
  constructor(message: string = "User not found", details?: unknown) {
    super(
      message,
      HttpStatus.NOT_FOUND,
      ErrorCodes.USER_NOT_FOUND,
      true,
      details,
    );

    Object.setPrototypeOf(this, UserNotFoundError.prototype);
  }
}

/**
 * BoardNotFoundError - 404 Not Found
 * Used when a specific board cannot be found
 */
export class BoardNotFoundError extends ApiError {
  constructor(message: string = "Board not found", details?: unknown) {
    super(
      message,
      HttpStatus.NOT_FOUND,
      ErrorCodes.BOARD_NOT_FOUND,
      true,
      details,
    );

    Object.setPrototypeOf(this, BoardNotFoundError.prototype);
  }
}

/**
 * CardNotFoundError - 404 Not Found
 * Used when a specific card cannot be found
 */
export class CardNotFoundError extends ApiError {
  constructor(message: string = "Card not found", details?: unknown) {
    super(
      message,
      HttpStatus.NOT_FOUND,
      ErrorCodes.CARD_NOT_FOUND,
      true,
      details,
    );

    Object.setPrototypeOf(this, CardNotFoundError.prototype);
  }
}

/**
 * ProfileNotFoundError - 404 Not Found
 * Used when a specific profile cannot be found
 */
export class ProfileNotFoundError extends ApiError {
  constructor(message: string = "Profile not found", details?: unknown) {
    super(
      message,
      HttpStatus.NOT_FOUND,
      ErrorCodes.PROFILE_NOT_FOUND,
      true,
      details,
    );

    Object.setPrototypeOf(this, ProfileNotFoundError.prototype);
  }
}
