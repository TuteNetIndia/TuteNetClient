"use strict";
/**
 * Retry utilities with exponential backoff
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetryStrategies = void 0;
exports.retry = retry;
exports.calculateDelay = calculateDelay;
exports.exponentialBackoff = exponentialBackoff;
exports.sleep = sleep;
exports.retryWithBackoff = retryWithBackoff;
exports.retryable = retryable;
/**
 * Default retry configuration
 */
const DEFAULT_RETRY_CONFIG = {
    maxAttempts: 3,
    initialDelay: 1000,
    maxDelay: 30000,
    backoffMultiplier: 2,
    jitter: true,
    shouldRetry: () => true,
    onRetry: () => { },
};
/**
 * Retry an async operation with exponential backoff
 */
async function retry(operation, config = {}) {
    const finalConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
    let lastError;
    for (let attempt = 1; attempt <= finalConfig.maxAttempts; attempt++) {
        try {
            return await operation();
        }
        catch (error) {
            lastError = error;
            // Don't retry on last attempt
            if (attempt === finalConfig.maxAttempts) {
                break;
            }
            // Check if error should be retried
            if (!finalConfig.shouldRetry(error)) {
                break;
            }
            // Call retry callback
            finalConfig.onRetry(error, attempt);
            // Calculate delay with exponential backoff
            const delay = calculateDelay(attempt - 1, finalConfig.initialDelay, finalConfig.maxDelay, finalConfig.backoffMultiplier, finalConfig.jitter);
            // Wait before retrying
            await sleep(delay);
        }
    }
    throw lastError;
}
/**
 * Calculate delay with exponential backoff
 */
function calculateDelay(attempt, initialDelay, maxDelay, multiplier, jitter) {
    // Calculate exponential delay
    let delay = initialDelay * Math.pow(multiplier, attempt);
    // Cap at maximum delay
    delay = Math.min(delay, maxDelay);
    // Add jitter (±25% randomness)
    if (jitter) {
        const jitterAmount = delay * 0.25;
        delay = delay + (Math.random() * 2 - 1) * jitterAmount;
    }
    return Math.max(delay, 0);
}
/**
 * Exponential backoff delay generator
 */
function* exponentialBackoff(initialDelay = 1000, maxDelay = 30000, multiplier = 2, jitter = true) {
    let attempt = 0;
    while (true) {
        const delay = calculateDelay(attempt, initialDelay, maxDelay, multiplier, jitter);
        yield delay;
        attempt++;
    }
}
/**
 * Sleep for specified milliseconds
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
/**
 * Retry with specific backoff strategy
 */
async function retryWithBackoff(operation, delays) {
    let lastError;
    // Try initial operation
    try {
        return await operation();
    }
    catch (error) {
        lastError = error;
    }
    // Retry with specified delays
    for (const delay of delays) {
        await sleep(delay);
        try {
            return await operation();
        }
        catch (error) {
            lastError = error;
        }
    }
    throw lastError;
}
/**
 * Create a retry decorator for methods
 */
function retryable(config = {}) {
    return function (target, propertyName, descriptor) {
        const method = descriptor.value;
        descriptor.value = async function (...args) {
            return retry(() => method.apply(this, args), config);
        };
        return descriptor;
    };
}
/**
 * Predefined retry strategies
 */
exports.RetryStrategies = {
    /**
     * Quick retry for fast operations
     */
    quick: {
        maxAttempts: 2,
        initialDelay: 100,
        maxDelay: 1000,
        backoffMultiplier: 2,
    },
    /**
     * Standard retry for most operations
     */
    standard: {
        maxAttempts: 3,
        initialDelay: 1000,
        maxDelay: 10000,
        backoffMultiplier: 2,
    },
    /**
     * Aggressive retry for critical operations
     */
    aggressive: {
        maxAttempts: 5,
        initialDelay: 500,
        maxDelay: 30000,
        backoffMultiplier: 2,
    },
    /**
     * Patient retry for slow operations
     */
    patient: {
        maxAttempts: 3,
        initialDelay: 2000,
        maxDelay: 60000,
        backoffMultiplier: 3,
    },
};
//# sourceMappingURL=retry.js.map