/**
 * TuteNet Profile Client
 * 
 * Official TypeScript client for TuteNet Profile Service.
 * Supports both external (public) and internal API gateways.
 */

// Client class and factory functions
export { ProfileClient } from './client/profileClient';
export { 
  createProfileClient, 
  createExternalProfileClient, 
  createInternalProfileClient 
} from './client/factory';

// Types and interfaces
export type { 
  GetProfileRequest, 
  GetProfileResponse,
  UpdateProfileRequestData,
  UpdateProfileRequest,
  UpdateProfileResponse,
  UploadAvatarRequest,
  UploadAvatarResponse,
  CreateProfileFromRegistrationRequest,
  CreateProfileFromRegistrationResponse,
  ValidateStatisticsRequest,
  ValidateStatisticsResponse
} from './types/api';

// Re-export core types that are commonly used
export type { 
  Environment, 
  ApiType, 
  ClientConfig,
  ClientError 
} from '@tutenet/client-core';