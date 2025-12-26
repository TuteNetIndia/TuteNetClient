/**
 * Retry utilities with exponential backoff
 */
/**
 * Retry configuration
 */
export interface RetryConfig {
    /** Maximum number of attempts (including initial attempt) */
    maxAttempts: number;
    /** Initial delay in milliseconds */
    initialDelay?: number;
    /** Maximum delay in milliseconds */
    maxDelay?: number;
    /** Backoff multiplier */
    backoffMultiplier?: number;
    /** Add random jitter to delays */
    jitter?: boolean;
    /** Function to determine if error should be retried */
    shouldRetry?: (error: any) => boolean;
    /** Callback called before each retry */
    onRetry?: (error: any, attempt: number) => void;
}
/**
 * Retry an async operation with exponential backoff
 */
export declare function retry<T>(operation: () => Promise<T>, config?: Partial<RetryConfig>): Promise<T>;
/**
 * Calculate delay with exponential backoff
 */
export declare function calculateDelay(attempt: number, initialDelay: number, maxDelay: number, multiplier: number, jitter: boolean): number;
/**
 * Exponential backoff delay generator
 */
export declare function exponentialBackoff(initialDelay?: number, maxDelay?: number, multiplier?: number, jitter?: boolean): Generator<number, never, never>;
/**
 * Sleep for specified milliseconds
 */
export declare function sleep(ms: number): Promise<void>;
/**
 * Retry with specific backoff strategy
 */
export declare function retryWithBackoff<T>(operation: () => Promise<T>, delays: number[]): Promise<T>;
/**
 * Create a retry decorator for methods
 */
export declare function retryable(config?: Partial<RetryConfig>): (target: any, propertyName: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
/**
 * Predefined retry strategies
 */
export declare const RetryStrategies: {
    /**
     * Quick retry for fast operations
     */
    readonly quick: {
        readonly maxAttempts: 2;
        readonly initialDelay: 100;
        readonly maxDelay: 1000;
        readonly backoffMultiplier: 2;
    };
    /**
     * Standard retry for most operations
     */
    readonly standard: {
        readonly maxAttempts: 3;
        readonly initialDelay: 1000;
        readonly maxDelay: 10000;
        readonly backoffMultiplier: 2;
    };
    /**
     * Aggressive retry for critical operations
     */
    readonly aggressive: {
        readonly maxAttempts: 5;
        readonly initialDelay: 500;
        readonly maxDelay: 30000;
        readonly backoffMultiplier: 2;
    };
    /**
     * Patient retry for slow operations
     */
    readonly patient: {
        readonly maxAttempts: 3;
        readonly initialDelay: 2000;
        readonly maxDelay: 60000;
        readonly backoffMultiplier: 3;
    };
};
//# sourceMappingURL=retry.d.ts.map