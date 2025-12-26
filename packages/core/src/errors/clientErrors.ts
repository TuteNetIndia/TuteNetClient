/**
 * Client error classes for consistent error handling across all TuteNet clients
 */

/**
 * Error response structure from TuteNet APIs
 */
export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string>;
  };
  meta: {
    requestId: string;
    timestamp: string;
  };
}

/**
 * Base client error class
 */
export class ClientError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode?: number,
    public readonly details?: Record<string, string>,
    public readonly requestId?: string
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Convert to JSON for logging/debugging
   */
  toJSON(): Record<string, any> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
      requestId: this.requestId,
      stack: this.stack,
    };
  }
}

/**
 * Network-related errors (connection, timeout, etc.)
 */
export class NetworkError extends ClientError {
  constructor(
    message: string,
    public readonly originalError?: Error,
    requestId?: string
  ) {
    super(message, 'NETWORK_ERROR', undefined, undefined, requestId);
  }

  static isNetworkError(error: any): error is NetworkError {
    return error instanceof NetworkError;
  }
}

/**
 * Validation errors (400 Bad Request)
 */
export class ValidationError extends ClientError {
  constructor(
    message: string,
    details?: Record<string, string>,
    requestId?: string
  ) {
    super(message, 'VALIDATION_ERROR', 400, details, requestId);
  }

  static isValidationError(error: any): error is ValidationError {
    return error instanceof ValidationError;
  }
}

/**
 * Authentication errors (401 Unauthorized)
 */
export class AuthenticationError extends ClientError {
  constructor(message: string = 'Authentication required', requestId?: string) {
    super(message, 'AUTHENTICATION_ERROR', 401, undefined, requestId);
  }

  static isAuthenticationError(error: any): error is AuthenticationError {
    return error instanceof AuthenticationError;
  }
}

/**
 * Authorization errors (403 Forbidden)
 */
export class AuthorizationError extends ClientError {
  constructor(message: string = 'Insufficient permissions', requestId?: string) {
    super(message, 'AUTHORIZATION_ERROR', 403, undefined, requestId);
  }

  static isAuthorizationError(error: any): error is AuthorizationError {
    return error instanceof AuthorizationError;
  }
}

/**
 * Not found errors (404 Not Found)
 */
export class NotFoundError extends ClientError {
  constructor(resource: string, identifier?: string, requestId?: string) {
    const message = identifier 
      ? `${resource} not found: ${identifier}`
      : `${resource} not found`;
    super(message, 'NOT_FOUND_ERROR', 404, undefined, requestId);
  }

  static isNotFoundError(error: any): error is NotFoundError {
    return error instanceof NotFoundError;
  }
}

/**
 * Conflict errors (409 Conflict)
 */
export class ConflictError extends ClientError {
  constructor(message: string, requestId?: string) {
    super(message, 'CONFLICT_ERROR', 409, undefined, requestId);
  }

  static isConflictError(error: any): error is ConflictError {
    return error instanceof ConflictError;
  }
}

/**
 * Rate limit errors (429 Too Many Requests)
 */
export class RateLimitError extends ClientError {
  constructor(
    message: string = 'Rate limit exceeded',
    public readonly retryAfter?: number,
    requestId?: string
  ) {
    super(message, 'RATE_LIMIT_ERROR', 429, undefined, requestId);
  }

  static isRateLimitError(error: any): error is RateLimitError {
    return error instanceof RateLimitError;
  }
}

/**
 * Server errors (5xx)
 */
export class ServerError extends ClientError {
  constructor(
    message: string,
    statusCode: number = 500,
    requestId?: string
  ) {
    super(message, 'SERVER_ERROR', statusCode, undefined, requestId);
  }

  static isServerError(error: any): error is ServerError {
    return error instanceof ServerError;
  }
}

/**
 * Service unavailable errors (503)
 */
export class ServiceUnavailableError extends ClientError {
  constructor(serviceName: string, requestId?: string) {
    super(`${serviceName} is temporarily unavailable`, 'SERVICE_UNAVAILABLE_ERROR', 503, undefined, requestId);
  }

  static isServiceUnavailableError(error: any): error is ServiceUnavailableError {
    return error instanceof ServiceUnavailableError;
  }
}

/**
 * Timeout errors
 */
export class TimeoutError extends ClientError {
  constructor(timeout: number, requestId?: string) {
    super(`Request timed out after ${timeout}ms`, 'TIMEOUT_ERROR', undefined, undefined, requestId);
  }

  static isTimeoutError(error: any): error is TimeoutError {
    return error instanceof TimeoutError;
  }
}

/**
 * Create appropriate error from HTTP response
 */
export function createErrorFromResponse(
  status: number,
  data: any,
  requestId?: string
): ClientError {
  const errorData = data?.error;
  const message = errorData?.message || `HTTP ${status} error`;
  const details = errorData?.details;

  switch (status) {
    case 400:
      return new ValidationError(message, details, requestId);
    case 401:
      return new AuthenticationError(message, requestId);
    case 403:
      return new AuthorizationError(message, requestId);
    case 404:
      return new NotFoundError(message, undefined, requestId);
    case 409:
      return new ConflictError(message, requestId);
    case 429:
      return new RateLimitError(message, undefined, requestId);
    case 503:
      return new ServiceUnavailableError(message, requestId);
    default:
      if (status >= 500) {
        return new ServerError(message, status, requestId);
      }
      return new ClientError(message, 'HTTP_ERROR', status, details, requestId);
  }
}

/**
 * Type guard to check if error is a ClientError
 */
export function isClientError(error: any): error is ClientError {
  return error instanceof ClientError;
}

/**
 * Type guard to check if error should be retried
 */
export function isRetryableError(error: any): boolean {
  if (NetworkError.isNetworkError(error)) return true;
  if (TimeoutError.isTimeoutError(error)) return true;
  if (RateLimitError.isRateLimitError(error)) return true;
  if (ServerError.isServerError(error) && error.statusCode && error.statusCode >= 500) return true;
  return false;
}