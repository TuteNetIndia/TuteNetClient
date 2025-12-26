/**
 * Profile Service Client
 *
 * Official client for communicating with TuteNet Profile Service.
 * Supports both external (public) and internal API gateways.
 */
import { BaseClient, ClientConfig, RequestConfig } from '@tutenet/client-core';
import { GetProfileRequest, GetProfileResponse, UpdateProfileRequestData, UpdateProfileResponse, UploadAvatarRequest, UploadAvatarResponse, CreateProfileFromRegistrationRequest, CreateProfileFromRegistrationResponse, ValidateStatisticsRequest, ValidateStatisticsResponse } from '../types/api';
/**
 * Profile Service Client
 *
 * Provides type-safe access to Profile Service APIs with built-in
 * error handling, retries, and request/response validation.
 */
export declare class ProfileClient extends BaseClient {
    constructor(config: ClientConfig);
    /**
     * Get user profile by ID
     */
    getProfile(userId: string, options?: Omit<GetProfileRequest, 'userId'>, config?: RequestConfig): Promise<GetProfileResponse>;
    /**
     * Update user profile
     */
    updateProfile(userId: string, updates: UpdateProfileRequestData, config?: RequestConfig): Promise<UpdateProfileResponse>;
    /**
     * Upload user avatar
     */
    uploadAvatar(userId: string, request: UploadAvatarRequest, config?: RequestConfig): Promise<UploadAvatarResponse>;
    /**
     * Create profile from registration data (internal API only)
     */
    createProfileFromRegistration(data: CreateProfileFromRegistrationRequest, config?: RequestConfig): Promise<CreateProfileFromRegistrationResponse>;
    /**
     * Validate and refresh user statistics
     */
    validateStatistics(userId: string, options?: Omit<ValidateStatisticsRequest, 'userId'>, config?: RequestConfig): Promise<ValidateStatisticsResponse>;
    /**
     * Get multiple profiles by IDs (batch operation)
     */
    getProfiles(userIds: string[], options?: Omit<GetProfileRequest, 'userId'>, config?: RequestConfig): Promise<GetProfileResponse[]>;
    /**
     * Search profiles by criteria
     */
    searchProfiles(query: {
        school?: string;
        city?: string;
        subject?: string;
        isMentor?: boolean;
        limit?: number;
        cursor?: string;
    }, config?: RequestConfig): Promise<{
        profiles: GetProfileResponse[];
        nextCursor?: string;
        hasMore: boolean;
    }>;
    /**
     * Build URL with optional query parameters
     */
    private buildUrl;
    /**
     * Handle profile-specific errors
     */
    private handleProfileError;
}
//# sourceMappingURL=profileClient.d.ts.map