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
export declare class ClientError extends Error {
    readonly code: string;
    readonly statusCode?: number | undefined;
    readonly details?: Record<string, string> | undefined;
    readonly requestId?: string | undefined;
    constructor(message: string, code: string, statusCode?: number | undefined, details?: Record<string, string> | undefined, requestId?: string | undefined);
    /**
     * Convert to JSON for logging/debugging
     */
    toJSON(): Record<string, any>;
}
/**
 * Network-related errors (connection, timeout, etc.)
 */
export declare class NetworkError extends ClientError {
    readonly originalError?: Error | undefined;
    constructor(message: string, originalError?: Error | undefined, requestId?: string);
    static isNetworkError(error: any): error is NetworkError;
}
/**
 * Validation errors (400 Bad Request)
 */
export declare class ValidationError extends ClientError {
    constructor(message: string, details?: Record<string, string>, requestId?: string);
    static isValidationError(error: any): error is ValidationError;
}
/**
 * Authentication errors (401 Unauthorized)
 */
export declare class AuthenticationError extends ClientError {
    constructor(message?: string, requestId?: string);
    static isAuthenticationError(error: any): error is AuthenticationError;
}
/**
 * Authorization errors (403 Forbidden)
 */
export declare class AuthorizationError extends ClientError {
    constructor(message?: string, requestId?: string);
    static isAuthorizationError(error: any): error is AuthorizationError;
}
/**
 * Not found errors (404 Not Found)
 */
export declare class NotFoundError extends ClientError {
    constructor(resource: string, identifier?: string, requestId?: string);
    static isNotFoundError(error: any): error is NotFoundError;
}
/**
 * Conflict errors (409 Conflict)
 */
export declare class ConflictError extends ClientError {
    constructor(message: string, requestId?: string);
    static isConflictError(error: any): error is ConflictError;
}
/**
 * Rate limit errors (429 Too Many Requests)
 */
export declare class RateLimitError extends ClientError {
    readonly retryAfter?: number | undefined;
    constructor(message?: string, retryAfter?: number | undefined, requestId?: string);
    static isRateLimitError(error: any): error is RateLimitError;
}
/**
 * Server errors (5xx)
 */
export declare class ServerError extends ClientError {
    constructor(message: string, statusCode?: number, requestId?: string);
    static isServerError(error: any): error is ServerError;
}
/**
 * Service unavailable errors (503)
 */
export declare class ServiceUnavailableError extends ClientError {
    constructor(serviceName: string, requestId?: string);
    static isServiceUnavailableError(error: any): error is ServiceUnavailableError;
}
/**
 * Timeout errors
 */
export declare class TimeoutError extends ClientError {
    constructor(timeout: number, requestId?: string);
    static isTimeoutError(error: any): error is TimeoutError;
}
/**
 * Create appropriate error from HTTP response
 */
export declare function createErrorFromResponse(status: number, data: any, requestId?: string): ClientError;
/**
 * Type guard to check if error is a ClientError
 */
export declare function isClientError(error: any): error is ClientError;
/**
 * Type guard to check if error should be retried
 */
export declare function isRetryableError(error: any): boolean;
//# sourceMappingURL=clientErrors.d.ts.map