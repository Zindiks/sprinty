# Shared Module

This module contains shared utilities, constants, and error classes used across the entire API.

## Directory Structure

```
shared/
├── errors/              # Custom error classes
├── constants/           # Application constants
├── middleware/          # Shared middleware
└── README.md           # This file
```

## Error Handling

### Overview

The API uses a centralized error handling system with custom error classes that extend `ApiError`. Each error class has:

- **HTTP Status Code**: The appropriate HTTP status code (400, 401, 404, etc.)
- **Error Code**: A unique string identifier for client-side error handling
- **Message**: Human-readable error description
- **Details** (optional): Additional context or validation errors

### Error Response Format

All errors return a consistent JSON format:

```json
{
  "error": {
    "code": "ERR_RESOURCE_NOT_FOUND",
    "message": "Board not found",
    "details": {
      "boardId": "123"
    }
  }
}
```

### Available Error Classes

#### Validation Errors (400 Bad Request)

```typescript
import { ValidationError, InvalidInputError } from '@/shared/errors';

// Generic validation error
throw new ValidationError('Validation failed', {
  field: 'email',
  issue: 'Invalid format'
});

// Invalid input
throw new InvalidInputError('Email format is invalid');
```

#### Authentication Errors (401 Unauthorized)

```typescript
import {
  AuthenticationError,
  InvalidCredentialsError,
  TokenExpiredError,
  InvalidTokenError
} from '@/shared/errors';

// Generic authentication failure
throw new AuthenticationError('Authentication required');

// Invalid login credentials
throw new InvalidCredentialsError('Username or password is incorrect');

// Expired token
throw new TokenExpiredError('Your session has expired');

// Invalid token
throw new InvalidTokenError('Invalid authentication token');
```

#### Authorization Errors (403 Forbidden)

```typescript
import {
  AuthorizationError,
  InsufficientPermissionsError
} from '@/shared/errors';

// Generic authorization failure
throw new AuthorizationError('You do not have access to this resource');

// Insufficient permissions
throw new InsufficientPermissionsError('Admin role required');
```

#### Not Found Errors (404 Not Found)

```typescript
import {
  NotFoundError,
  UserNotFoundError,
  BoardNotFoundError,
  CardNotFoundError,
  ProfileNotFoundError
} from '@/shared/errors';

// Generic resource not found
throw new NotFoundError('Resource not found');

// Specific resource not found
throw new UserNotFoundError(`User with ID ${userId} not found`);
throw new BoardNotFoundError(`Board with ID ${boardId} not found`);
throw new CardNotFoundError(`Card with ID ${cardId} not found`);
throw new ProfileNotFoundError(`Profile not found`);
```

#### Conflict Errors (409 Conflict)

```typescript
import {
  ConflictError,
  DuplicateResourceError,
  UsernameAlreadyExistsError,
  EmailAlreadyExistsError
} from '@/shared/errors';

// Generic conflict
throw new ConflictError('Resource already exists');

// Duplicate resource
throw new DuplicateResourceError('A board with this name already exists');

// Username conflict
throw new UsernameAlreadyExistsError('Username is already taken');

// Email conflict
throw new EmailAlreadyExistsError('Email is already registered');
```

#### Server Errors (500+)

```typescript
import {
  InternalServerError,
  DatabaseError,
  ServiceUnavailableError
} from '@/shared/errors';

// Generic server error
throw new InternalServerError('An unexpected error occurred');

// Database error
throw new DatabaseError('Failed to connect to database');

// Service unavailable
throw new ServiceUnavailableError('Service is temporarily down');
```

### Using Error Classes in Services

In your service classes, throw the appropriate error:

```typescript
// profile.service.ts
import { UsernameAlreadyExistsError, EmailAlreadyExistsError } from '@/shared/errors';

export class ProfileService {
  async createProfile(data: CreateProfileDto) {
    // Check if username exists
    const existingUsername = await this.repository.findByUsername(data.username);
    if (existingUsername) {
      throw new UsernameAlreadyExistsError();
    }

    // Check if email exists
    const existingEmail = await this.repository.findByEmail(data.email);
    if (existingEmail) {
      throw new EmailAlreadyExistsError();
    }

    return await this.repository.create(data);
  }
}
```

### Using Error Handler Middleware

Register the error handler in your Fastify app:

```typescript
// app.ts
import { errorHandler } from '@/shared/middleware';

const app = fastify();

// Register error handler
app.setErrorHandler(errorHandler);
```

### Controllers No Longer Need Try-Catch

With the error handler middleware, controllers can be simplified:

**Before:**
```typescript
async createProfile(request: FastifyRequest, reply: FastifyReply) {
  try {
    const profile = await this.profileService.createProfile(request.body);
    return reply.status(201).send(profile);
  } catch (err: any) {
    if (err.message === "Username already exists") {
      return reply.status(409).send({ message: err.message });
    }
    return reply.status(500).send(err);
  }
}
```

**After:**
```typescript
async createProfile(request: FastifyRequest, reply: FastifyReply) {
  const profile = await this.profileService.createProfile(request.body);
  return reply.status(201).send(profile);
}
```

The error handler middleware will automatically catch and format all errors!

## Constants

### HTTP Status Codes

```typescript
import { HttpStatus } from '@/shared/constants';

reply.status(HttpStatus.OK).send(data);
reply.status(HttpStatus.CREATED).send(newResource);
reply.status(HttpStatus.NO_CONTENT).send();
```

### Error Codes

```typescript
import { ErrorCodes } from '@/shared/constants';

// Use in custom error handling
if (error.code === ErrorCodes.USERNAME_ALREADY_EXISTS) {
  // Handle specific error
}
```

## Creating Custom Errors

To create a new error class:

1. Create a new file in `shared/errors/`
2. Extend `ApiError`
3. Set appropriate status code and error code
4. Export from `shared/errors/index.ts`

Example:

```typescript
// shared/errors/CustomError.ts
import { ApiError } from './ApiError';
import { HttpStatus } from '../constants/httpStatus';

export class CustomError extends ApiError {
  constructor(message: string = 'Custom error occurred', details?: any) {
    super(
      message,
      HttpStatus.BAD_REQUEST,
      'ERR_CUSTOM_ERROR',
      true,
      details
    );

    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
```

## Best Practices

1. **Always use specific error classes** instead of throwing generic `Error` objects
2. **Provide meaningful error messages** that help users understand what went wrong
3. **Use details parameter** to include additional context (field names, validation errors, etc.)
4. **Let the error handler middleware handle responses** - don't manually send error responses in controllers
5. **Log errors appropriately** - the error handler logs all errors automatically
6. **Use error codes in client-side error handling** instead of parsing error messages

## Migration Guide

To migrate existing code:

1. Replace `throw new Error("message")` with specific error classes
2. Remove try-catch blocks from controllers (unless you need custom handling)
3. Register the error handler middleware in `app.ts`
4. Update tests to expect the new error response format

Example migration:

```diff
// Service
- throw new Error("Username already exists");
+ throw new UsernameAlreadyExistsError();

// Controller
  async createProfile(request, reply) {
-   try {
      const profile = await this.service.createProfile(request.body);
      return reply.status(201).send(profile);
-   } catch (err: any) {
-     if (err.message === "Username already exists") {
-       return reply.status(409).send({ message: err.message });
-     }
-     return reply.status(500).send(err);
-   }
  }
```
