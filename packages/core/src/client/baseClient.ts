/**
 * Base client class with common functionality for all TuteNet service clients
 */

import axios, { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import { 
  ClientConfig, 
  Environment, 
  ApiType, 
  getEndpoint, 
  validateConfig, 
  DEFAULT_CONFIG 
} from '../config/environment';
import { 
  ClientError, 
  NetworkError, 
  TimeoutError, 
  createErrorFromResponse,
  isRetryableError 
} from '../errors/clientErrors';
import { ApiResponse, RequestMetadata } from '../types/apiTypes';
import { retry } from '../utils/retry';

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
export abstract class BaseClient implements HttpClient {
  protected readonly client: AxiosInstance;
  protected readonly config: ClientConfig;
  protected readonly baseUrl: string;

  constructor(config: ClientConfig) {
    // Validate configuration
    validateConfig(config);
    
    // Merge with defaults
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    // Get base URL for environment and API type
    this.baseUrl = getEndpoint(config.environment, config.apiType);
    
    // Create axios instance
    this.client = axios.create({
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
  async get<T>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>('GET', url, undefined, config);
  }

  /**
   * POST request
   */
  async post<T>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>('POST', url, data, config);
  }

  /**
   * PUT request
   */
  async put<T>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>('PUT', url, data, config);
  }

  /**
   * PATCH request
   */
  async patch<T>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>('PATCH', url, data, config);
  }

  /**
   * DELETE request
   */
  async delete<T>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>('DELETE', url, undefined, config);
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/health', {
        timeout: 2000,
      });
      return response.status === 200;
    } catch (error) {
      if (this.config.debug) {
        console.warn(`[${this.constructor.name}] Health check failed:`, error);
      }
      return false;
    }
  }

  /**
   * Get client configuration
   */
  getConfig(): ClientConfig {
    return { ...this.config };
  }

  /**
   * Get base URL
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Make HTTP request with retry logic
   */
  private async request<T>(
    method: string,
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<T> {
    const requestConfig: AxiosRequestConfig = {
      method,
      url,
      data,
      ...config,
      // Properly merge headers from config with existing headers
      headers: {
        ...config?.headers,
      },
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

    // Log request in debug mode only
    if (this.config.debug) {
      console.debug(`[${this.constructor.name}] ${method} ${url}`);
    }

    const operation = () => this.executeRequest<T>(requestConfig);

    // Use retry logic unless explicitly disabled
    if (config?.skipRetry || this.config.retries === 0) {
      return operation();
    }

    return retry(operation, {
      maxAttempts: this.config.retries! + 1,
      shouldRetry: isRetryableError,
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
  private async executeRequest<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.request(config);
      return this.handleResponse(response);
    } catch (error) {
      // Check if this is an HTTP error with a response body
      const axiosError = error as AxiosError;
      if (axiosError.response && axiosError.response.data) {
        const responseData = axiosError.response.data;
        
        // If the response has the API format with success: false, return it as-is
        if (typeof responseData === 'object' && responseData !== null && 'success' in responseData && !responseData.success) {
          return responseData as T;
        }
      }
      
      // For other errors (network, timeout, etc.), throw as before
      throw this.handleError(error, config.url || '');
    }
  }

  /**
   * Handle successful response
   */
  private handleResponse<T>(response: AxiosResponse<T>): T {
    const { data, status } = response;
    const requestId = response.headers['x-request-id'];

    // Handle non-JSON responses (like health checks)
    if (typeof data !== 'object' || data === null) {
      return data as unknown as T;
    }

    // Handle API response format - return full response (including error responses)
    if ('success' in data) {
      // Return the full API response (both success and error responses)
      // This allows clients to handle union types properly
      return data as T;
    }

    // Handle raw data responses
    return data as unknown as T;
  }

  /**
   * Handle request errors
   */
  private handleError(error: any, url: string): ClientError {
    const axiosError = error as AxiosError;

    // Log errors in debug mode only
    if (this.config.debug) {
      console.error(`[${this.constructor.name}] Request failed:`, {
        url: url,
        status: axiosError.response?.status,
        errorCode: axiosError.code,
        errorMessage: axiosError.message,
      });
    }

    // Network errors
    if (axiosError.code === 'ECONNREFUSED' || axiosError.code === 'ENOTFOUND') {
      return new NetworkError(
        `Unable to connect to ${this.baseUrl}`,
        axiosError
      );
    }

    // Timeout errors
    if (axiosError.code === 'ECONNABORTED') {
      return new TimeoutError(this.config.timeout!);
    }

    // HTTP errors
    if (axiosError.response) {
      const { status, data } = axiosError.response;
      const requestId = axiosError.response.headers['x-request-id'];
      return createErrorFromResponse(status, data, requestId);
    }

    // Unknown errors
    return new NetworkError(
      `Request failed: ${error.message}`,
      axiosError
    );
  }

  /**
   * Setup request/response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        if (this.config.debug) {
          console.debug(`[${this.constructor.name}] → ${config.method?.toUpperCase()} ${config.url}`);
        }

        // Add authentication token if available
        if (this.config.authToken) {
          config.headers.Authorization = `Bearer ${this.config.authToken}`;
        }

        return config;
      },
      (error) => {
        if (this.config.debug) {
          console.error(`[${this.constructor.name}] Request interceptor error:`, error.message);
        }
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        if (this.config.debug) {
          console.debug(`[${this.constructor.name}] ← ${response.status} ${response.config.url}`);
        }
        return response;
      },
      (error) => {
        if (this.config.debug) {
          console.error(`[${this.constructor.name}] Response error:`, {
            status: error.response?.status,
            url: error.config?.url,
            message: error.message,
          });
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Generate User-Agent string
   */
  private getUserAgent(): string {
    const clientName = this.constructor.name.replace('Client', '').toLowerCase();
    const version = '1.0.0'; // TODO: Get from package.json
    const platform = typeof globalThis !== 'undefined' && 'window' in globalThis ? 'browser' : 'node';
    
    return `tutenet-${clientName}-client/${version} (${platform})`;
  }
}