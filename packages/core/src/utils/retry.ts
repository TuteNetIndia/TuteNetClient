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
 * Default retry configuration
 */
const DEFAULT_RETRY_CONFIG: Required<RetryConfig> = {
  maxAttempts: 3,
  initialDelay: 1000,
  maxDelay: 30000,
  backoffMultiplier: 2,
  jitter: true,
  shouldRetry: () => true,
  onRetry: () => {},
};

/**
 * Retry an async operation with exponential backoff
 */
export async function retry<T>(
  operation: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const finalConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
  let lastError: any;
  
  for (let attempt = 1; attempt <= finalConfig.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
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
      const delay = calculateDelay(
        attempt - 1,
        finalConfig.initialDelay,
        finalConfig.maxDelay,
        finalConfig.backoffMultiplier,
        finalConfig.jitter
      );
      
      // Wait before retrying
      await sleep(delay);
    }
  }
  
  throw lastError;
}

/**
 * Calculate delay with exponential backoff
 */
export function calculateDelay(
  attempt: number,
  initialDelay: number,
  maxDelay: number,
  multiplier: number,
  jitter: boolean
): number {
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
export function* exponentialBackoff(
  initialDelay: number = 1000,
  maxDelay: number = 30000,
  multiplier: number = 2,
  jitter: boolean = true
): Generator<number, never, never> {
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
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry with specific backoff strategy
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  delays: number[]
): Promise<T> {
  let lastError: any;
  
  // Try initial operation
  try {
    return await operation();
  } catch (error) {
    lastError = error;
  }
  
  // Retry with specified delays
  for (const delay of delays) {
    await sleep(delay);
    
    try {
      return await operation();
    } catch (error) {
      lastError = error;
    }
  }
  
  throw lastError;
}

/**
 * Create a retry decorator for methods
 */
export function retryable(config: Partial<RetryConfig> = {}) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value;
    
    descriptor.value = async function (...args: any[]) {
      return retry(() => method.apply(this, args), config);
    };
    
    return descriptor;
  };
}

/**
 * Predefined retry strategies
 */
export const RetryStrategies = {
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
} as const;