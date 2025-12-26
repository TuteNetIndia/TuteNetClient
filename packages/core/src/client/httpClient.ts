/**
 * HTTP Client interface and types
 */

export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  data?: any;
}

export interface ResponseData<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export interface HttpClient {
  get<T = any>(url: string, config?: RequestConfig): Promise<ResponseData<T>>;
  post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ResponseData<T>>;
  put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ResponseData<T>>;
  patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ResponseData<T>>;
  delete<T = any>(url: string, config?: RequestConfig): Promise<ResponseData<T>>;
}