/**
 * Profile API request/response types
 *
 * These types represent the API contract between clients and the Profile Service.
 */

import {
  SuccessResponse,
  ErrorResponse
} from '@tutenet/client-core';

// Re-export common types for convenience
export {  SuccessResponse, ErrorResponse};

// =============================================================================
// REQUEST TYPES
// =============================================================================

/**
 * Get profile request parameters
 */
export interface GetProfileRequest {
  /** User ID to retrieve profile for */
  userId: string;

  /** Include statistics in response */
  includeStatistics?: boolean;

  /** Refresh statistics from source */
  refreshStatistics?: boolean;

  /** Maximum age for cached statistics (seconds) */
  statisticsMaxAge?: number;
}

/**
 * Update profile request data (API level - includes userId and metadata)
 */
export interface UpdateProfileRequestData {
  userId: string;
  updateData: UpdateProfileRequest;
  ifMatch?: string; // For optimistic locking (future use)
}

/**
 * Update profile request fields (domain level - just the fields to update)
 */
export interface UpdateProfileRequest {
  name?: string;
  school?: string;
  city?: string;
  bio?: string;
  primarySubject?: string;
  subjects?: string[];
  gradeLevels?: string[];
  yearsTeaching?: number;
}

/**
 * Upload avatar request
 */
export interface UploadAvatarRequest {
  file: File | Buffer;
  filename: string;
  contentType: string;
}

/**
 * Create profile from registration request
 */
export interface CreateProfileFromRegistrationRequest {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  subjects?: string[];
  languages?: string[];
}

/**
 * Validate statistics request
 */
export interface ValidateStatisticsRequest {
  userId: string;
  forceRefresh?: boolean;
}

// =============================================================================
// RESPONSE DATA TYPES (for the 'data' field)
// =============================================================================

/**
 * Get profile API response format
 */
export interface GetProfileResponse {
  userId: string;
  memberSince: string;
  name: string;
  school: string;
  city: string;
  bio?: string;
  avatarUrl?: string;
  primarySubject: string;
  subjects: string[];
  gradeLevels: string[];
  yearsTeaching?: number;
  isMentor: boolean;
  statistics?: {
    resourceCount: number;
    totalDownloads: number;
    totalAppreciations: number;
    averageRating: number;
    uniqueStudents: number;
    teacherRank?: number;
  };
}

/**
 * Update profile response
 */
export interface UpdateProfileResponse {
  message: string;
  profile: {
    userId: string;
    name: string;
    school: string;
    city: string;
    bio?: string;
    avatarUrl?: string;
    primarySubject: string;
    subjects: string[];
    gradeLevels: string[];
    yearsTeaching: number;
    isMentor: boolean;
    memberSince: string;
    updatedAt: string;
  };
}

/**
 * Upload avatar response
 */
export interface UploadAvatarResponse {
  avatarUrl: string;
  uploadedAt: string;
}

/**
 * Create profile from registration response
 */
export interface CreateProfileFromRegistrationResponse {
  profile: GetProfileResponse;
  isNewProfile: boolean;
}

/**
 * Validate statistics response
 */
export interface ValidateStatisticsResponse {
  statistics: {
    resourceCount: number;
    totalDownloads: number;
    totalAppreciations: number;
    lastUpdated: string;
  };
  refreshed: boolean;
}

// =============================================================================
// FULL API RESPONSE TYPES (using common response structure)
// =============================================================================

/** Get profile API response */
export type GetProfileApiResponse = SuccessResponse<GetProfileResponse> | ErrorResponse;

/** Update profile API response */
export type UpdateProfileApiResponse = SuccessResponse<UpdateProfileResponse> | ErrorResponse;

/** Upload avatar API response */
export type UploadAvatarApiResponse = SuccessResponse<UploadAvatarResponse> | ErrorResponse;

/** Create profile from registration API response */
export type CreateProfileFromRegistrationApiResponse = SuccessResponse<CreateProfileFromRegistrationResponse> | ErrorResponse;

/** Validate statistics API response */
export type ValidateStatisticsApiResponse = SuccessResponse<ValidateStatisticsResponse> | ErrorResponse;

// =============================================================================
// DATA-ONLY RESPONSE TYPES (for backward compatibility)
// =============================================================================