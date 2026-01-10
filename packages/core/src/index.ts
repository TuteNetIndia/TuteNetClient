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

// Common types
export type { 
  ApiResponse, 
  PaginatedResponse, 
  SuccessResponse,
  MessageResponse,
  ErrorResponse
} from './types/apiTypes';

// Educational types
export type {
  EducationalMetadata,
  LicenseInfo
} from './types/educationalTypes';
export {
  DifficultyLevel,
  SubjectType,
  ResourceType,
  MaterialType,
  LicenseType
} from './types/educationalTypes';
export type { GradeType, LanguageCode } from './types/educationalTypes';

// Teaching types
export type {
  TeachingGuides,
  UsageInstructions,
  InstructionalStep,
  CommonChallenges,
  Misconception,
  QuickAssessment
} from './types/teachingTypes';
export {
  QuickAssessmentType,
  FormativeAssessmentType,
  SummativeAssessmentType,
  SelfAssessmentType,
  AssessmentTiming,
  PedagogicalApproach,
  StudentGroup,
  ManagementCategory,
  PreparationCategory,
  DeliveryTiming,
  FollowUpType
} from './types/teachingTypes';

// Utilities
export { retry, exponentialBackoff } from './utils/retry';
export { validateEmail, validateRequired } from './utils/validation';
export { sanitizeString, sanitizeArray } from './utils/sanitization';