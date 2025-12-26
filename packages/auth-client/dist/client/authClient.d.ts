/**
 * Auth Service Client
 *
 * Provides methods to interact with the TuteNet Auth Service API.
 * Supports both internal and external API endpoints with automatic environment detection.
 */
import { BaseClient, Environment } from '@tutenet/client-core';
import { SignUpRequest, SignInRequest, RefreshTokenRequest, VerifyEmailRequest, ResendVerificationRequest, ForgotPasswordRequest, ResetPasswordRequest, ChangePasswordRequest, DeleteAccountRequest, AuthResponse, GetCurrentUserResponse, SuccessResponse } from '../types/api';
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
export declare class AuthClient extends BaseClient {
    constructor(config?: AuthClientConfig);
    /**
     * Sign up a new user
     */
    signUp(request: SignUpRequest): Promise<AuthResponse>;
    /**
     * Sign in an existing user
     */
    signIn(request: SignInRequest): Promise<AuthResponse>;
    /**
     * Get current user information
     */
    getCurrentUser(): Promise<GetCurrentUserResponse>;
    /**
     * Refresh authentication tokens
     */
    refreshToken(request: RefreshTokenRequest): Promise<AuthResponse>;
    /**
     * Verify email address
     */
    verifyEmail(request: VerifyEmailRequest): Promise<SuccessResponse>;
    /**
     * Resend verification code
     */
    resendVerification(request: ResendVerificationRequest): Promise<SuccessResponse>;
    /**
     * Request password reset
     */
    forgotPassword(request: ForgotPasswordRequest): Promise<SuccessResponse>;
    /**
     * Reset password with code
     */
    resetPassword(request: ResetPasswordRequest): Promise<SuccessResponse>;
    /**
     * Change password (requires authentication)
     */
    changePassword(request: ChangePasswordRequest): Promise<SuccessResponse>;
    /**
     * Delete user account (requires authentication)
     */
    deleteAccount(request: DeleteAccountRequest): Promise<SuccessResponse>;
    /**
     * Set authentication token for subsequent requests
     */
    setAccessToken(token: string): void;
    /**
     * Clear authentication token
     */
    clearAccessToken(): void;
}
//# sourceMappingURL=authClient.d.ts.map