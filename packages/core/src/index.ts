/**
 * TuteNet Client Core
 * 
 * Shared utilities, types, and base client for all TuteNet service clients.
 */

// Environment and configuration
export { Environment, ApiType, detectEnvironment } from './config/environment';
export type { ClientConfig } from './config/environment';

// Base client and HTTP utilities
export { BaseClient } from './client/baseClient';
export type { HttpClient, RequestConfig, ResponseData } from './client/baseClient';

// Error handling
export { 
  ClientError, 
  NetworkError, 
  ValidationError, 
  ServerError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  ServiceUnavailableError,
  TimeoutError,
  createErrorFromResponse,
  isClientError,
  isRetryableError
} from './errors/clientErrors';
export type { ErrorResponse } from './errors/clientErrors';

// Common types
export type { ApiResponse, PaginatedResponse, SuccessResponse } from './types/apiTypes';

// Utilities
export { retry, exponentialBackoff } from './utils/retry';
export { validateEmail, validateRequired } from './utils/validation';
export { sanitizeString, sanitizeArray } from './utils/sanitization';