/**
 * TuteNet Client Core
 *
 * Shared utilities, types, and base client for all TuteNet service clients.
 */
export { Environment, ApiType, detectEnvironment } from './config/environment';
export type { ClientConfig } from './config/environment';
export { BaseClient } from './client/baseClient';
export type { HttpClient, RequestConfig, ResponseData } from './client/baseClient';
export { ClientError, NetworkError, ValidationError, ServerError, AuthenticationError, AuthorizationError, NotFoundError, ConflictError, RateLimitError, ServiceUnavailableError, TimeoutError, createErrorFromResponse, isClientError, isRetryableError } from './errors/clientErrors';
export type { ErrorResponse } from './errors/clientErrors';
export type { ApiResponse, PaginatedResponse, SuccessResponse } from './types/apiTypes';
export { retry, exponentialBackoff } from './utils/retry';
export { validateEmail, validateRequired } from './utils/validation';
export { sanitizeString, sanitizeArray } from './utils/sanitization';
//# sourceMappingURL=index.d.ts.map