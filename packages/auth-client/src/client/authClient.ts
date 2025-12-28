/**
 * Auth Service Client
 * 
 * Provides methods to interact with the TuteNet Auth Service API.
 * Supports both internal and external API endpoints with automatic environment detection.
 */

import { 
  BaseClient, 
  ClientConfig,
  Environment, 
  ApiType, 
  detectEnvironment 
} from '@tutenet/client-core';
import {
  SignUpRequest,
  SignInRequest,
  RefreshTokenRequest,
  VerifyEmailRequest,
  ResendVerificationRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  DeleteAccountRequest,
  SignUpApiResponse,
  SignInApiResponse,
  RefreshTokenApiResponse,
  VerifyEmailApiResponse,
  ResendVerificationApiResponse,
  ForgotPasswordApiResponse,
  ResetPasswordApiResponse,
  ChangePasswordApiResponse,
  DeleteAccountApiResponse,
  GetCurrentUserApiResponse,
} from '../types';

/**
 * Auth client configuration
 */
export interface AuthClientConfig {
  /** Environment to use (auto-detected if not provided) */
  environment?: Environment;
  
  /** Use internal API endpoints */
  useInternalApi?: boolean;
  
  /** Custom base URL (overrides environment detection) */
  baseUrl?: string;
  
  /** Request timeout in milliseconds */
  timeout?: number;
  
  /** Number of retry attempts */
  retries?: number;
  
  /** Authentication token for protected endpoints */
  accessToken?: string;
}

/**
 * Auth Service Client
 */
export class AuthClient extends BaseClient {
  constructor(config: AuthClientConfig = {}) {
    const environment = config.environment || detectEnvironment();
    const apiType = config.useInternalApi ? ApiType.INTERNAL : ApiType.EXTERNAL;
    
    const clientConfig: ClientConfig = {
      environment,
      apiType,
      timeout: config.timeout,
      retries: config.retries,
      authToken: config.accessToken,
    };
    
    super(clientConfig);
  }

  /**
   * Sign up a new user
   */
  async signUp(request: SignUpRequest): Promise<SignUpApiResponse> {
    return this.post<SignUpApiResponse>('/auth/signup', request);
  }

  /**
   * Sign in an existing user
   */
  async signIn(request: SignInRequest): Promise<SignInApiResponse> {
    return this.post<SignInApiResponse>('/auth/signin', request);
  }

  /**
   * Get current user information
   */
  async getCurrentUser(): Promise<GetCurrentUserApiResponse> {
    return this.get<GetCurrentUserApiResponse>('/auth/me');
  }

  /**
   * Refresh authentication tokens
   */
  async refreshToken(request: RefreshTokenRequest): Promise<RefreshTokenApiResponse> {
    return this.post<RefreshTokenApiResponse>('/auth/refresh', request);
  }

  /**
   * Verify email address
   */
  async verifyEmail(request: VerifyEmailRequest): Promise<VerifyEmailApiResponse> {
    return this.post<VerifyEmailApiResponse>('/auth/verify-email', request);
  }

  /**
   * Resend verification code
   */
  async resendVerification(request: ResendVerificationRequest): Promise<ResendVerificationApiResponse> {
    return this.post<ResendVerificationApiResponse>('/auth/resend-verification', request);
  }

  /**
   * Request password reset
   */
  async forgotPassword(request: ForgotPasswordRequest): Promise<ForgotPasswordApiResponse> {
    return this.post<ForgotPasswordApiResponse>('/auth/forgot-password', request);
  }

  /**
   * Reset password with code
   */
  async resetPassword(request: ResetPasswordRequest): Promise<ResetPasswordApiResponse> {
    return this.post<ResetPasswordApiResponse>('/auth/reset-password', request);
  }

  /**
   * Change password (requires authentication)
   */
  async changePassword(request: ChangePasswordRequest): Promise<ChangePasswordApiResponse> {
    return this.post<ChangePasswordApiResponse>('/auth/change-password', request);
  }

  /**
   * Delete user account (requires authentication)
   */
  async deleteAccount(request: DeleteAccountRequest): Promise<DeleteAccountApiResponse> {
    return this.post<DeleteAccountApiResponse>('/auth/account', request);
  }

  /**
   * Set authentication token for subsequent requests
   */
  setAccessToken(token: string): void {
    // Update the axios instance headers directly
    (this as any).client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Clear authentication token
   */
  clearAccessToken(): void {
    delete (this as any).client.defaults.headers.common['Authorization'];
  }
}