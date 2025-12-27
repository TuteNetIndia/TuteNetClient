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
  AuthResponse,
  User,
  SuccessResponse,
} from '../types/api';

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
  async signUp(request: SignUpRequest): Promise<AuthResponse> {
    return this.post<AuthResponse>('/auth/signup', request);
  }

  /**
   * Sign in an existing user
   */
  async signIn(request: SignInRequest): Promise<AuthResponse> {
    return this.post<AuthResponse>('/auth/signin', request);
  }

  /**
   * Get current user information
   */
  async getCurrentUser(): Promise<User> {
    return this.get<User>('/auth/me');
  }

  /**
   * Refresh authentication tokens
   */
  async refreshToken(request: RefreshTokenRequest): Promise<AuthResponse> {
    return this.post<AuthResponse>('/auth/refresh', request);
  }

  /**
   * Verify email address
   */
  async verifyEmail(request: VerifyEmailRequest): Promise<SuccessResponse> {
    return this.post<SuccessResponse>('/auth/verify-email', request);
  }

  /**
   * Resend verification code
   */
  async resendVerification(request: ResendVerificationRequest): Promise<SuccessResponse> {
    return this.post<SuccessResponse>('/auth/resend-verification', request);
  }

  /**
   * Request password reset
   */
  async forgotPassword(request: ForgotPasswordRequest): Promise<SuccessResponse> {
    return this.post<SuccessResponse>('/auth/forgot-password', request);
  }

  /**
   * Reset password with code
   */
  async resetPassword(request: ResetPasswordRequest): Promise<SuccessResponse> {
    return this.post<SuccessResponse>('/auth/reset-password', request);
  }

  /**
   * Change password (requires authentication)
   */
  async changePassword(request: ChangePasswordRequest): Promise<SuccessResponse> {
    return this.post<SuccessResponse>('/auth/change-password', request);
  }

  /**
   * Delete user account (requires authentication)
   */
  async deleteAccount(request: DeleteAccountRequest): Promise<SuccessResponse> {
    return this.post<SuccessResponse>('/auth/account', request);
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