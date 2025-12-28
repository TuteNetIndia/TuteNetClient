/**
 * Auth API request/response types
 * 
 * These types represent the API contract between clients and the Auth Service.
 */

import {
  SuccessResponse,
  ErrorResponse,
  MessageResponse
} from '@tutenet/client-core';

// Re-export common types for convenience
export { MessageResponse, SuccessResponse, ErrorResponse };

// =============================================================================
// REQUEST TYPES
// =============================================================================

/**
 * User sign up request
 */
export interface SignUpRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  subjects?: string[];
  languages?: string[];
}

/**
 * User sign in request
 */
export interface SignInRequest {
  email: string;
  password: string;
}

/**
 * Token refresh request
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 * Email verification request
 */
export interface VerifyEmailRequest {
  email: string;
  code: string;
}

/**
 * Resend verification code request
 */
export interface ResendVerificationRequest {
  email: string;
}

/**
 * Forgot password request
 */
export interface ForgotPasswordRequest {
  email: string;
}

/**
 * Reset password request
 */
export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

/**
 * Change password request
 */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

/**
 * Delete account request
 */
export interface DeleteAccountRequest {
  password: string;
}

// =============================================================================
// DOMAIN MODELS
// =============================================================================

/**
 * User model (matches auth service User exactly)
 */
export interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  subjects: string[];
  languages: string[];
  emailVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Authentication tokens
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  idToken: string;
}

/**
 * Authentication response with user and tokens
 */
export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// =============================================================================
// FULL API RESPONSE TYPES (using common response structure)
// =============================================================================

/** Sign up API response */
export type SignUpApiResponse = SuccessResponse<AuthResponse> | ErrorResponse;

/** Sign in API response */
export type SignInApiResponse = SuccessResponse<AuthResponse> | ErrorResponse;

/** Token refresh API response */
export type RefreshTokenApiResponse = SuccessResponse<AuthTokens> | ErrorResponse;

/** Email verification API response */
export type VerifyEmailApiResponse = SuccessResponse<MessageResponse> | ErrorResponse;

/** Resend verification API response */
export type ResendVerificationApiResponse = SuccessResponse<MessageResponse> | ErrorResponse;

/** Forgot password API response */
export type ForgotPasswordApiResponse = SuccessResponse<MessageResponse> | ErrorResponse;

/** Reset password API response */
export type ResetPasswordApiResponse = SuccessResponse<MessageResponse> | ErrorResponse;

/** Change password API response */
export type ChangePasswordApiResponse = SuccessResponse<MessageResponse> | ErrorResponse;

/** Delete account API response */
export type DeleteAccountApiResponse = SuccessResponse<MessageResponse> | ErrorResponse;

/** Get current user API response */
export type GetCurrentUserApiResponse = SuccessResponse<User> | ErrorResponse;

// =============================================================================
// DATA-ONLY RESPONSE TYPES (for backward compatibility)
// =============================================================================