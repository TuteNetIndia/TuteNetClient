/**
 * Environment configuration for TuteNet clients
 */

/**
 * Supported environments
 */
export enum Environment {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
}

/**
 * API types (external vs internal)
 */
export enum ApiType {
  EXTERNAL = 'external', // Public API Gateway
  INTERNAL = 'internal', // Internal API Gateway
}

/**
 * Client configuration interface
 */
export interface ClientConfig {
  /** Target environment */
  environment: Environment;
  
  /** API type (external or internal) */
  apiType: ApiType;
  
  /** Request timeout in milliseconds */
  timeout?: number;
  
  /** Number of retry attempts */
  retries?: number;
  
  /** Enable debug logging */
  debug?: boolean;
  
  /** Authentication token */
  authToken?: string;
  
  /** Custom headers */
  headers?: Record<string, string>;
}

/**
 * Environment-specific API endpoints
 * Updated with actual deployed AWS API Gateway endpoints
 */
export const ENDPOINTS = {
  [Environment.DEVELOPMENT]: {
    [ApiType.EXTERNAL]: 'https://dev-api.tutenet.com/v1',
    [ApiType.INTERNAL]: 'https://dev-internal-api.tutenet.com',
  },
  [Environment.STAGING]: {
    // Actual deployed API Gateway endpoints for staging
    [ApiType.EXTERNAL]: 'https://32d6gfn27g.execute-api.ap-south-1.amazonaws.com/staging/v1',
    [ApiType.INTERNAL]: 'https://nenm54vjg3.execute-api.ap-south-1.amazonaws.com/staging',
  },
  [Environment.PRODUCTION]: {
    [ApiType.EXTERNAL]: 'https://api.tutenet.com/v1',
    [ApiType.INTERNAL]: 'https://internal-api.tutenet.com',
  },
} as const;

/**
 * Default client configuration
 */
export const DEFAULT_CONFIG: Partial<ClientConfig> = {
  timeout: 10000, // 10 seconds
  retries: 2,
  debug: false,
  apiType: ApiType.EXTERNAL,
};

/**
 * Auto-detect environment from process.env
 */
export function detectEnvironment(): Environment {
  // Check STAGE first (AWS deployment convention)
  const stage = process.env.STAGE?.toLowerCase();
  if (stage === 'prod' || stage === 'production') {
    return Environment.PRODUCTION;
  }
  if (stage === 'staging') {
    return Environment.STAGING;
  }
  if (stage === 'dev' || stage === 'development') {
    return Environment.DEVELOPMENT;
  }

  // Check NODE_ENV
  const nodeEnv = process.env.NODE_ENV?.toLowerCase();
  if (nodeEnv === 'production') {
    return Environment.PRODUCTION;
  }
  if (nodeEnv === 'staging') {
    return Environment.STAGING;
  }

  // Default to development
  return Environment.DEVELOPMENT;
}

/**
 * Get API endpoint for environment and type
 */
export function getEndpoint(environment: Environment, apiType: ApiType): string {
  const endpoint = ENDPOINTS[environment]?.[apiType];
  if (!endpoint) {
    throw new Error(`No endpoint configured for ${environment}/${apiType}`);
  }
  return endpoint;
}

/**
 * Validate environment configuration
 */
export function validateConfig(config: ClientConfig): void {
  if (!Object.values(Environment).includes(config.environment)) {
    throw new Error(`Invalid environment: ${config.environment}`);
  }
  
  if (!Object.values(ApiType).includes(config.apiType)) {
    throw new Error(`Invalid API type: ${config.apiType}`);
  }
  
  if (config.timeout && (config.timeout < 1000 || config.timeout > 60000)) {
    throw new Error('Timeout must be between 1000ms and 60000ms');
  }
  
  if (config.retries && (config.retries < 0 || config.retries > 5)) {
    throw new Error('Retries must be between 0 and 5');
  }
}