"use strict";
/**
 * Environment configuration for TuteNet clients
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_CONFIG = exports.ENDPOINTS = exports.ApiType = exports.Environment = void 0;
exports.detectEnvironment = detectEnvironment;
exports.getEndpoint = getEndpoint;
exports.validateConfig = validateConfig;
/**
 * Supported environments
 */
var Environment;
(function (Environment) {
    Environment["DEVELOPMENT"] = "development";
    Environment["STAGING"] = "staging";
    Environment["PRODUCTION"] = "production";
})(Environment || (exports.Environment = Environment = {}));
/**
 * API types (external vs internal)
 */
var ApiType;
(function (ApiType) {
    ApiType["EXTERNAL"] = "external";
    ApiType["INTERNAL"] = "internal";
})(ApiType || (exports.ApiType = ApiType = {}));
/**
 * Environment-specific API endpoints
 * No need to pass these as environment variables - they're built into the client
 */
exports.ENDPOINTS = {
    [Environment.DEVELOPMENT]: {
        [ApiType.EXTERNAL]: 'https://dev-api.tutenet.com/v1',
        [ApiType.INTERNAL]: 'https://dev-internal-api.tutenet.com',
    },
    [Environment.STAGING]: {
        [ApiType.EXTERNAL]: 'https://staging-api.tutenet.com/v1',
        [ApiType.INTERNAL]: 'https://staging-internal-api.tutenet.com',
    },
    [Environment.PRODUCTION]: {
        [ApiType.EXTERNAL]: 'https://api.tutenet.com/v1',
        [ApiType.INTERNAL]: 'https://internal-api.tutenet.com',
    },
};
/**
 * Default client configuration
 */
exports.DEFAULT_CONFIG = {
    timeout: 10000, // 10 seconds
    retries: 2,
    debug: false,
    apiType: ApiType.EXTERNAL,
};
/**
 * Auto-detect environment from process.env
 */
function detectEnvironment() {
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
function getEndpoint(environment, apiType) {
    const endpoint = exports.ENDPOINTS[environment]?.[apiType];
    if (!endpoint) {
        throw new Error(`No endpoint configured for ${environment}/${apiType}`);
    }
    return endpoint;
}
/**
 * Validate environment configuration
 */
function validateConfig(config) {
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
//# sourceMappingURL=environment.js.map