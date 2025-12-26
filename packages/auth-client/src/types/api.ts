/**
 * Auth API request/response types
 * 
 * These types represent the API contract between clients and the Auth Service.
 */

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

/**
 * User response model
 */
export interface UserResponse {
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
  user: UserResponse;
  tokens: AuthTokens;
}

/**
 * Success response for operations without data
 */
export interface SuccessResponse {
  success: boolean;
  message: string;
}

/**
 * Get current user response
 */
export interface GetCurrentUserResponse {
  user: UserResponse;
}