import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { ApiError } from "../errors/ApiError";
import { HttpStatus } from "../constants/httpStatus";
import { ErrorCodes } from "../constants/errorCodes";

/**
 * Fastify error handler middleware
 * Catches all errors and formats them into a consistent response
 */
export async function errorHandler(
  error: FastifyError | ApiError | Error,
  request: FastifyRequest,
  reply: FastifyReply
) {
  // Log the error for debugging
  request.log.error(error);

  // If it's our custom ApiError, use its properties
  if (error instanceof ApiError) {
    return reply.status(error.statusCode).send(error.toJSON());
  }

  // Handle Fastify validation errors
  if ((error as FastifyError).validation) {
    return reply.status(HttpStatus.BAD_REQUEST).send({
      error: {
        code: ErrorCodes.VALIDATION_ERROR,
        message: error.message,
        details: (error as FastifyError).validation,
      },
    });
  }

  // Handle Fastify errors with statusCode
  if ((error as FastifyError).statusCode) {
    const statusCode = (error as FastifyError).statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    return reply.status(statusCode).send({
      error: {
        code: `ERR_${statusCode}`,
        message: error.message,
      },
    });
  }

  // Default to 500 Internal Server Error for unknown errors
  return reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
    error: {
      code: ErrorCodes.INTERNAL_SERVER_ERROR,
      message: "An unexpected error occurred",
      // Only include error details in development mode
      ...(process.env.NODE_ENV === "development" && {
        details: error.message,
        stack: error.stack,
      }),
    },
  });
}
