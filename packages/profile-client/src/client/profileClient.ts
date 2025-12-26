/**
 * Profile Service Client
 * 
 * Official client for communicating with TuteNet Profile Service.
 * Supports both external (public) and internal API gateways.
 */

import { 
  BaseClient, 
  ClientConfig, 
  RequestConfig,
  ClientError 
} from '@tutenet/client-core';
import { 
  GetProfileRequest, 
  GetProfileResponse,
  UpdateProfileRequestData,
  UpdateProfileResponse,
  UploadAvatarRequest,
  UploadAvatarResponse,
  CreateProfileFromRegistrationRequest,
  CreateProfileFromRegistrationResponse,
  ValidateStatisticsRequest,
  ValidateStatisticsResponse 
} from '../types/api';

/**
 * Profile Service Client
 * 
 * Provides type-safe access to Profile Service APIs with built-in
 * error handling, retries, and request/response validation.
 */
export class ProfileClient extends BaseClient {
  constructor(config: ClientConfig) {
    super(config);
  }

  /**
   * Get user profile by ID
   */
  async getProfile(
    userId: string, 
    options?: Omit<GetProfileRequest, 'userId'>,
    config?: RequestConfig
  ): Promise<GetProfileResponse> {
    try {
      const params = new URLSearchParams();
      if (options?.includeStatistics) params.append('includeStatistics', 'true');
      if (options?.refreshStatistics) params.append('refreshStatistics', 'true');
      if (options?.statisticsMaxAge) params.append('statisticsMaxAge', options.statisticsMaxAge.toString());

      const url = this.buildUrl(`/profile/${userId}`, params);
      const response = await this.get<GetProfileResponse>(url, config);
      
      return response;
    } catch (error) {
      throw this.handleProfileError(error, 'getProfile');
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string, 
    updates: UpdateProfileRequestData,
    config?: RequestConfig
  ): Promise<UpdateProfileResponse> {
    try {
      const url = this.buildUrl(`/profile/${userId}`);
      return await this.put<UpdateProfileResponse>(url, updates, config);
    } catch (error) {
      throw this.handleProfileError(error, 'updateProfile');
    }
  }

  /**
   * Upload user avatar
   */
  async uploadAvatar(
    userId: string,
    request: UploadAvatarRequest,
    config?: RequestConfig
  ): Promise<UploadAvatarResponse> {
    try {
      const formData = new FormData();
      formData.append('file', request.file);
      formData.append('filename', request.filename);
      formData.append('contentType', request.contentType);

      const url = this.buildUrl(`/profile/${userId}/avatar`);
      return await this.post<UploadAvatarResponse>(url, formData, {
        ...config,
        headers: {
          'Content-Type': 'multipart/form-data',
          ...config?.headers,
        },
      });
    } catch (error) {
      throw this.handleProfileError(error, 'uploadAvatar');
    }
  }

  /**
   * Create profile from registration data (internal API only)
   */
  async createProfileFromRegistration(
    data: CreateProfileFromRegistrationRequest,
    config?: RequestConfig
  ): Promise<CreateProfileFromRegistrationResponse> {
    try {
      const url = this.buildUrl('/profile/from-registration');
      return await this.post<CreateProfileFromRegistrationResponse>(url, data, config);
    } catch (error) {
      throw this.handleProfileError(error, 'createProfileFromRegistration');
    }
  }

  /**
   * Validate and refresh user statistics
   */
  async validateStatistics(
    userId: string,
    options?: Omit<ValidateStatisticsRequest, 'userId'>,
    config?: RequestConfig
  ): Promise<ValidateStatisticsResponse> {
    try {
      const params = new URLSearchParams();
      if (options?.forceRefresh) params.append('forceRefresh', 'true');

      const url = this.buildUrl(`/profile/${userId}/statistics/validate`, params);
      return await this.post<ValidateStatisticsResponse>(url, {}, config);
    } catch (error) {
      throw this.handleProfileError(error, 'validateStatistics');
    }
  }

  /**
   * Get multiple profiles by IDs (batch operation)
   */
  async getProfiles(
    userIds: string[],
    options?: Omit<GetProfileRequest, 'userId'>,
    config?: RequestConfig
  ): Promise<GetProfileResponse[]> {
    try {
      const params = new URLSearchParams();
      userIds.forEach(id => params.append('userIds', id));
      if (options?.includeStatistics) params.append('includeStatistics', 'true');
      if (options?.refreshStatistics) params.append('refreshStatistics', 'true');
      if (options?.statisticsMaxAge) params.append('statisticsMaxAge', options.statisticsMaxAge.toString());

      const url = this.buildUrl('/profiles', params);
      const responses = await this.get<GetProfileResponse[]>(url, config);
      
      return responses;
    } catch (error) {
      throw this.handleProfileError(error, 'getProfiles');
    }
  }

  /**
   * Search profiles by criteria
   */
  async searchProfiles(
    query: {
      school?: string;
      city?: string;
      subject?: string;
      isMentor?: boolean;
      limit?: number;
      cursor?: string;
    },
    config?: RequestConfig
  ): Promise<{
    profiles: GetProfileResponse[];
    nextCursor?: string;
    hasMore: boolean;
  }> {
    try {
      const params = new URLSearchParams();
      if (query.school) params.append('school', query.school);
      if (query.city) params.append('city', query.city);
      if (query.subject) params.append('subject', query.subject);
      if (query.isMentor !== undefined) params.append('isMentor', query.isMentor.toString());
      if (query.limit) params.append('limit', query.limit.toString());
      if (query.cursor) params.append('cursor', query.cursor);

      const url = this.buildUrl('/profiles/search', params);
      const response = await this.get<{
        items: GetProfileResponse[];
        nextCursor?: string;
        hasMore: boolean;
      }>(url, config);
      
      return {
        profiles: response.items,
        nextCursor: response.nextCursor,
        hasMore: response.hasMore,
      };
    } catch (error) {
      throw this.handleProfileError(error, 'searchProfiles');
    }
  }

  /**
   * Build URL with optional query parameters
   */
  private buildUrl(path: string, params?: URLSearchParams): string {
    const clientConfig = this.getConfig();
    const baseUrl = clientConfig.apiType === 'internal' ? '/internal' : '';
    const fullPath = `${baseUrl}${path}`;
    return params && params.toString() ? `${fullPath}?${params.toString()}` : fullPath;
  }

  /**
   * Handle profile-specific errors
   */
  private handleProfileError(error: any, operation: string): ClientError {
    if (error instanceof ClientError) {
      return error;
    }

    return new ClientError(
      `Profile ${operation} failed: ${error.message}`,
      error.code || 'UNKNOWN_ERROR',
      error.statusCode,
      error.details,
      error.requestId
    );
  }
}