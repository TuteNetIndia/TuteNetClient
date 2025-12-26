"use strict";
/**
 * Client error classes for consistent error handling across all TuteNet clients
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeoutError = exports.ServiceUnavailableError = exports.ServerError = exports.RateLimitError = exports.ConflictError = exports.NotFoundError = exports.AuthorizationError = exports.AuthenticationError = exports.ValidationError = exports.NetworkError = exports.ClientError = void 0;
exports.createErrorFromResponse = createErrorFromResponse;
exports.isClientError = isClientError;
exports.isRetryableError = isRetryableError;
/**
 * Base client error class
 */
class ClientError extends Error {
    constructor(message, code, statusCode, details, requestId) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.details = details;
        this.requestId = requestId;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
    /**
     * Convert to JSON for logging/debugging
     */
    toJSON() {
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
exports.ClientError = ClientError;
/**
 * Network-related errors (connection, timeout, etc.)
 */
class NetworkError extends ClientError {
    constructor(message, originalError, requestId) {
        super(message, 'NETWORK_ERROR', undefined, undefined, requestId);
        this.originalError = originalError;
    }
    static isNetworkError(error) {
        return error instanceof NetworkError;
    }
}
exports.NetworkError = NetworkError;
/**
 * Validation errors (400 Bad Request)
 */
class ValidationError extends ClientError {
    constructor(message, details, requestId) {
        super(message, 'VALIDATION_ERROR', 400, details, requestId);
    }
    static isValidationError(error) {
        return error instanceof ValidationError;
    }
}
exports.ValidationError = ValidationError;
/**
 * Authentication errors (401 Unauthorized)
 */
class AuthenticationError extends ClientError {
    constructor(message = 'Authentication required', requestId) {
        super(message, 'AUTHENTICATION_ERROR', 401, undefined, requestId);
    }
    static isAuthenticationError(error) {
        return error instanceof AuthenticationError;
    }
}
exports.AuthenticationError = AuthenticationError;
/**
 * Authorization errors (403 Forbidden)
 */
class AuthorizationError extends ClientError {
    constructor(message = 'Insufficient permissions', requestId) {
        super(message, 'AUTHORIZATION_ERROR', 403, undefined, requestId);
    }
    static isAuthorizationError(error) {
        return error instanceof AuthorizationError;
    }
}
exports.AuthorizationError = AuthorizationError;
/**
 * Not found errors (404 Not Found)
 */
class NotFoundError extends ClientError {
    constructor(resource, identifier, requestId) {
        const message = identifier
            ? `${resource} not found: ${identifier}`
            : `${resource} not found`;
        super(message, 'NOT_FOUND_ERROR', 404, undefined, requestId);
    }
    static isNotFoundError(error) {
        return error instanceof NotFoundError;
    }
}
exports.NotFoundError = NotFoundError;
/**
 * Conflict errors (409 Conflict)
 */
class ConflictError extends ClientError {
    constructor(message, requestId) {
        super(message, 'CONFLICT_ERROR', 409, undefined, requestId);
    }
    static isConflictError(error) {
        return error instanceof ConflictError;
    }
}
exports.ConflictError = ConflictError;
/**
 * Rate limit errors (429 Too Many Requests)
 */
class RateLimitError extends ClientError {
    constructor(message = 'Rate limit exceeded', retryAfter, requestId) {
        super(message, 'RATE_LIMIT_ERROR', 429, undefined, requestId);
        this.retryAfter = retryAfter;
    }
    static isRateLimitError(error) {
        return error instanceof RateLimitError;
    }
}
exports.RateLimitError = RateLimitError;
/**
 * Server errors (5xx)
 */
class ServerError extends ClientError {
    constructor(message, statusCode = 500, requestId) {
        super(message, 'SERVER_ERROR', statusCode, undefined, requestId);
    }
    static isServerError(error) {
        return error instanceof ServerError;
    }
}
exports.ServerError = ServerError;
/**
 * Service unavailable errors (503)
 */
class ServiceUnavailableError extends ClientError {
    constructor(serviceName, requestId) {
        super(`${serviceName} is temporarily unavailable`, 'SERVICE_UNAVAILABLE_ERROR', 503, undefined, requestId);
    }
    static isServiceUnavailableError(error) {
        return error instanceof ServiceUnavailableError;
    }
}
exports.ServiceUnavailableError = ServiceUnavailableError;
/**
 * Timeout errors
 */
class TimeoutError extends ClientError {
    constructor(timeout, requestId) {
        super(`Request timed out after ${timeout}ms`, 'TIMEOUT_ERROR', undefined, undefined, requestId);
    }
    static isTimeoutError(error) {
        return error instanceof TimeoutError;
    }
}
exports.TimeoutError = TimeoutError;
/**
 * Create appropriate error from HTTP response
 */
function createErrorFromResponse(status, data, requestId) {
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
function isClientError(error) {
    return error instanceof ClientError;
}
/**
 * Type guard to check if error should be retried
 */
function isRetryableError(error) {
    if (NetworkError.isNetworkError(error))
        return true;
    if (TimeoutError.isTimeoutError(error))
        return true;
    if (RateLimitError.isRateLimitError(error))
        return true;
    if (ServerError.isServerError(error) && error.statusCode && error.statusCode >= 500)
        return true;
    return false;
}
//# sourceMappingURL=clientErrors.js.map