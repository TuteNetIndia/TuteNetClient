"use strict";
/**
 * Base client class with common functionality for all TuteNet service clients
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseClient = void 0;
const axios_1 = __importDefault(require("axios"));
const environment_1 = require("../config/environment");
const clientErrors_1 = require("../errors/clientErrors");
const retry_1 = require("../utils/retry");
/**
 * Base client class with common HTTP functionality
 */
class BaseClient {
    constructor(config) {
        // Validate configuration
        (0, environment_1.validateConfig)(config);
        // Merge with defaults
        this.config = { ...environment_1.DEFAULT_CONFIG, ...config };
        // Get base URL for environment and API type
        this.baseUrl = (0, environment_1.getEndpoint)(config.environment, config.apiType);
        // Create axios instance
        this.client = axios_1.default.create({
            baseURL: this.baseUrl,
            timeout: this.config.timeout,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': this.getUserAgent(),
                ...this.config.headers,
            },
        });
        this.setupInterceptors();
    }
    /**
     * GET request
     */
    async get(url, config) {
        return this.request('GET', url, undefined, config);
    }
    /**
     * POST request
     */
    async post(url, data, config) {
        return this.request('POST', url, data, config);
    }
    /**
     * PUT request
     */
    async put(url, data, config) {
        return this.request('PUT', url, data, config);
    }
    /**
     * PATCH request
     */
    async patch(url, data, config) {
        return this.request('PATCH', url, data, config);
    }
    /**
     * DELETE request
     */
    async delete(url, config) {
        return this.request('DELETE', url, undefined, config);
    }
    /**
     * Health check
     */
    async healthCheck() {
        try {
            const response = await this.client.get('/health', {
                timeout: 2000,
            });
            return response.status === 200;
        }
        catch (error) {
            if (this.config.debug) {
                console.warn(`[${this.constructor.name}] Health check failed:`, error);
            }
            return false;
        }
    }
    /**
     * Get client configuration
     */
    getConfig() {
        return { ...this.config };
    }
    /**
     * Get base URL
     */
    getBaseUrl() {
        return this.baseUrl;
    }
    /**
     * Make HTTP request with retry logic
     */
    async request(method, url, data, config) {
        const requestConfig = {
            method,
            url,
            data,
            ...config,
        };
        // Add request metadata
        if (config?.metadata) {
            requestConfig.headers = {
                ...requestConfig.headers,
                'X-Request-ID': config.metadata.requestId,
                'X-Correlation-ID': config.metadata.correlationId,
                'X-Client-Version': config.metadata.clientVersion,
            };
        }
        const operation = () => this.executeRequest(requestConfig);
        // Use retry logic unless explicitly disabled
        if (config?.skipRetry || this.config.retries === 0) {
            return operation();
        }
        return (0, retry_1.retry)(operation, {
            maxAttempts: this.config.retries + 1,
            shouldRetry: clientErrors_1.isRetryableError,
            onRetry: (error, attempt) => {
                if (this.config.debug) {
                    console.warn(`[${this.constructor.name}] Retry attempt ${attempt}:`, error.message);
                }
            },
        });
    }
    /**
     * Execute HTTP request
     */
    async executeRequest(config) {
        try {
            const response = await this.client.request(config);
            return this.handleResponse(response);
        }
        catch (error) {
            throw this.handleError(error, config.url || '');
        }
    }
    /**
     * Handle successful response
     */
    handleResponse(response) {
        const { data, status } = response;
        const requestId = response.headers['x-request-id'];
        // Handle non-JSON responses (like health checks)
        if (typeof data !== 'object' || data === null) {
            return data;
        }
        // Handle API response format
        if ('success' in data) {
            if (!data.success) {
                throw (0, clientErrors_1.createErrorFromResponse)(status, data, requestId);
            }
            if (data.data === undefined) {
                throw new clientErrors_1.ClientError('API returned success but no data', 'NO_DATA', status, undefined, requestId);
            }
            return data.data;
        }
        // Handle raw data responses
        return data;
    }
    /**
     * Handle request errors
     */
    handleError(error, url) {
        const axiosError = error;
        // Network errors
        if (axiosError.code === 'ECONNREFUSED' || axiosError.code === 'ENOTFOUND') {
            return new clientErrors_1.NetworkError(`Unable to connect to ${this.baseUrl}`, axiosError);
        }
        // Timeout errors
        if (axiosError.code === 'ECONNABORTED') {
            return new clientErrors_1.TimeoutError(this.config.timeout);
        }
        // HTTP errors
        if (axiosError.response) {
            const { status, data } = axiosError.response;
            const requestId = axiosError.response.headers['x-request-id'];
            return (0, clientErrors_1.createErrorFromResponse)(status, data, requestId);
        }
        // Unknown errors
        return new clientErrors_1.NetworkError(`Request failed: ${error.message}`, axiosError);
    }
    /**
     * Setup request/response interceptors
     */
    setupInterceptors() {
        // Request interceptor
        this.client.interceptors.request.use((config) => {
            if (this.config.debug) {
                console.log(`[${this.constructor.name}] ${config.method?.toUpperCase()} ${config.url}`);
            }
            // Add authentication token if available
            if (this.config.authToken) {
                config.headers.Authorization = `Bearer ${this.config.authToken}`;
            }
            return config;
        }, (error) => {
            if (this.config.debug) {
                console.error(`[${this.constructor.name}] Request error:`, error.message);
            }
            return Promise.reject(error);
        });
        // Response interceptor
        this.client.interceptors.response.use((response) => {
            if (this.config.debug) {
                console.log(`[${this.constructor.name}] ${response.status} ${response.config.url}`);
            }
            return response;
        }, (error) => {
            if (this.config.debug) {
                console.error(`[${this.constructor.name}] Response error:`, {
                    status: error.response?.status,
                    url: error.config?.url,
                    message: error.message,
                });
            }
            return Promise.reject(error);
        });
    }
    /**
     * Generate User-Agent string
     */
    getUserAgent() {
        const clientName = this.constructor.name.replace('Client', '').toLowerCase();
        const version = '1.0.0'; // TODO: Get from package.json
        const platform = typeof globalThis !== 'undefined' && 'window' in globalThis ? 'browser' : 'node';
        return `tutenet-${clientName}-client/${version} (${platform})`;
    }
}
exports.BaseClient = BaseClient;
//# sourceMappingURL=baseClient.js.map