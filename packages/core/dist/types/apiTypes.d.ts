/**
 * Common API response types used across all TuteNet services
 */
/**
 * Standard API response structure
 */
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: Record<string, string>;
    };
    meta: {
        requestId: string;
        timestamp: string;
        version?: string;
    };
}
/**
 * Success response (when success: true)
 */
export interface SuccessResponse<T = any> {
    success: true;
    data: T;
    meta: {
        requestId: string;
        timestamp: string;
        version?: string;
    };
}
/**
 * Error response (when success: false)
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
        version?: string;
    };
}
/**
 * Paginated response structure
 */
export interface PaginatedResponse<T = any> {
    success: true;
    data: {
        items: T[];
        nextCursor?: string;
        previousCursor?: string;
        hasNext: boolean;
        hasPrevious: boolean;
        totalCount?: number;
    };
    meta: {
        requestId: string;
        timestamp: string;
        version?: string;
    };
}
/**
 * Pagination parameters for requests
 */
export interface PaginationParams {
    /** Cursor for pagination (base64 encoded) */
    cursor?: string;
    /** Number of items per page (default: 20, max: 100) */
    limit?: number;
    /** Sort field */
    sortBy?: string;
    /** Sort order */
    sortOrder?: 'asc' | 'desc';
}
/**
 * Common query parameters
 */
export interface QueryParams {
    /** Search query */
    q?: string;
    /** Filter parameters */
    filters?: Record<string, string | string[]>;
    /** Include related data */
    include?: string[];
    /** Exclude fields from response */
    exclude?: string[];
    /** Pagination */
    pagination?: PaginationParams;
}
/**
 * Request metadata
 */
export interface RequestMetadata {
    /** Unique request ID for tracing */
    requestId?: string;
    /** User agent string */
    userAgent?: string;
    /** Client version */
    clientVersion?: string;
    /** Correlation ID for distributed tracing */
    correlationId?: string;
    /** Additional context */
    context?: Record<string, any>;
}
/**
 * Health check response
 */
export interface HealthCheckResponse {
    status: 'healthy' | 'unhealthy' | 'degraded';
    timestamp: string;
    version: string;
    uptime: number;
    checks: {
        [service: string]: {
            status: 'healthy' | 'unhealthy';
            responseTime?: number;
            error?: string;
        };
    };
}
/**
 * Batch operation request
 */
export interface BatchRequest<T = any> {
    operations: Array<{
        id: string;
        operation: 'create' | 'update' | 'delete' | 'get';
        data?: T;
        params?: Record<string, any>;
    }>;
}
/**
 * Batch operation response
 */
export interface BatchResponse<T = any> {
    success: true;
    data: {
        results: Array<{
            id: string;
            success: boolean;
            data?: T;
            error?: {
                code: string;
                message: string;
            };
        }>;
        summary: {
            total: number;
            successful: number;
            failed: number;
        };
    };
    meta: {
        requestId: string;
        timestamp: string;
    };
}
//# sourceMappingURL=apiTypes.d.ts.map