/**
 * Base client class with common functionality for all TuteNet service clients
 */
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ClientConfig } from '../config/environment';
import { RequestMetadata } from '../types/apiTypes';
/**
 * HTTP client interface
 */
export interface HttpClient {
    get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
    post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
}
/**
 * Request configuration
 */
export interface RequestConfig extends AxiosRequestConfig {
    /** Skip retry logic */
    skipRetry?: boolean;
    /** Custom timeout for this request */
    timeout?: number;
    /** Request metadata */
    metadata?: RequestMetadata;
}
/**
 * Response data wrapper
 */
export interface ResponseData<T> {
    data: T;
    status: number;
    headers: Record<string, string>;
    requestId?: string;
}
/**
 * Base client class with common HTTP functionality
 */
export declare abstract class BaseClient implements HttpClient {
    protected readonly client: AxiosInstance;
    protected readonly config: ClientConfig;
    protected readonly baseUrl: string;
    constructor(config: ClientConfig);
    /**
     * GET request
     */
    get<T>(url: string, config?: RequestConfig): Promise<T>;
    /**
     * POST request
     */
    post<T>(url: string, data?: any, config?: RequestConfig): Promise<T>;
    /**
     * PUT request
     */
    put<T>(url: string, data?: any, config?: RequestConfig): Promise<T>;
    /**
     * PATCH request
     */
    patch<T>(url: string, data?: any, config?: RequestConfig): Promise<T>;
    /**
     * DELETE request
     */
    delete<T>(url: string, config?: RequestConfig): Promise<T>;
    /**
     * Health check
     */
    healthCheck(): Promise<boolean>;
    /**
     * Get client configuration
     */
    getConfig(): ClientConfig;
    /**
     * Get base URL
     */
    getBaseUrl(): string;
    /**
     * Make HTTP request with retry logic
     */
    private request;
    /**
     * Execute HTTP request
     */
    private executeRequest;
    /**
     * Handle successful response
     */
    private handleResponse;
    /**
     * Handle request errors
     */
    private handleError;
    /**
     * Setup request/response interceptors
     */
    private setupInterceptors;
    /**
     * Generate User-Agent string
     */
    private getUserAgent;
}
//# sourceMappingURL=baseClient.d.ts.map