/**
 * Abstract Profile Client Interface
 * 
 * Defines the contract for all profile service operations.
 * Allows swapping between Lambda and HTTP implementations using the strategy pattern.
 * 
 * All methods support optional RequestConfig for fine-grained control over:
 * - Request timeouts
 * - Retry behavior
 * - Custom headers
 * - Request tracing metadata
 */

import { RequestConfig } from '@tutenet/client-core';
import {
  CreateProfileFromRegistrationRequest,
  CreateProfileFromRegistrationApiResponse,
  GetProfileRequest,
  GetProfileApiResponse,
  UpdateProfileRequestData,
  UpdateProfileApiResponse,
  UploadAvatarRequest,
  UploadAvatarApiResponse,
  ValidateStatisticsRequest,
  ValidateStatisticsApiResponse,
} from '../types';

/**
 * Profile Service Client Interface
 * 
 * Abstract interface for Profile Service operations.
 * Enables strategy pattern for swapping between Lambda and HTTP implementations.
 * 
 * @example
 * ```typescript
 * // Use with Lambda implementation
 * const client: IProfileClient = new LambdaProfileClient(config);
 * 
 * // Or use with HTTP implementation
 * const client: IProfileClient = new HttpProfileClient(config);
 * 
 * // Both provide the same interface
 * const profile = await client.getProfile('user-123');
 * ```
 */
export interface IProfileClient {
  /**
   * Create profile from registration data (internal operation)
   * 
   * Creates a new user profile using data from the registration process.
   * This is typically called by the Auth Service after successful user registration.
   * 
   * @param data - Profile data from user registration
   * @param data.userId - Unique user identifier from auth system
   * @param data.email - User's email address
   * @param data.firstName - User's first name
   * @param data.lastName - User's last name
   * @param data.subjects - Optional array of teaching subjects
   * @param data.languages - Optional array of languages spoken
   * @param config - Optional request configuration (requestId, timeout, headers, etc)
   * 
   * @returns Promise resolving to profile creation response
   * @returns Returns { success: true, data: { profile, isNewProfile } } on success
   * @returns Returns { success: false, error } on failure
   * 
   * @throws {ValidationError} If input validation fails (400)
   * @throws {ConflictError} If profile already exists (409)
   * @throws {InternalError} If server error occurs (500)
   * 
   * @example
   * ```typescript
   * const result = await client.createProfileFromRegistration({
   *   userId: 'user-123',
   *   email: 'teacher@example.com',
   *   firstName: 'John',
   *   lastName: 'Doe',
   *   subjects: ['Mathematics', 'Physics'],
   *   languages: ['English', 'Hindi']
   * }, { requestId: 'req-123' });
   * 
   * if (result.success) {
   *   console.log('Profile created:', result.data.profile);
   * }
   * ```
   */
  createProfileFromRegistration(
    data: CreateProfileFromRegistrationRequest,
    config?: RequestConfig
  ): Promise<CreateProfileFromRegistrationApiResponse>;

  /**
   * Get user profile by ID
   * 
   * Retrieves a complete user profile including optional statistics.
   * Statistics can be cached for performance - use statisticsMaxAge to control freshness.
   * 
   * @param userId - User identifier to retrieve profile for
   * @param options - Optional query parameters
   * @param options.includeStatistics - Include user statistics in response (default: false)
   * @param options.refreshStatistics - Force refresh statistics from source (default: false)
   * @param options.statisticsMaxAge - Maximum age for cached statistics in seconds
   * @param config - Optional request configuration (requestId, timeout, headers, etc)
   * 
   * @returns Promise resolving to profile response
   * @returns Returns { success: true, data: profile } on success
   * @returns Returns { success: false, error } on failure
   * 
   * @throws {ValidationError} If userId is invalid (400)
   * @throws {NotFoundError} If profile doesn't exist (404)
   * @throws {InternalError} If server error occurs (500)
   * 
   * @example
   * ```typescript
   * // Basic profile retrieval
   * const result = await client.getProfile('user-123');
   * 
   * // Include statistics with cache control
   * const resultWithStats = await client.getProfile('user-123', {
   *   includeStatistics: true,
   *   statisticsMaxAge: 3600 // 1 hour cache
   * }, {
   *   requestId: 'req-456',
   *   timeout: 5000
   * });
   * 
   * if (resultWithStats.success) {
   *   console.log('Profile:', resultWithStats.data);
   *   console.log('Statistics:', resultWithStats.data.statistics);
   * }
   * ```
   */
  getProfile(
    userId: string,
    options?: Omit<GetProfileRequest, 'userId'>,
    config?: RequestConfig
  ): Promise<GetProfileApiResponse>;

  /**
   * Update user profile
   * 
   * Updates one or more profile fields for a user.
   * Only provided fields will be updated; omitted fields remain unchanged.
   * 
   * @param userId - User identifier whose profile to update
   * @param updates - Profile fields to update (partial update)
   * @param updates.updateData - Fields to update (name, school, bio, etc)
   * @param updates.ifMatch - Optional ETag for optimistic locking (future use)
   * @param config - Optional request configuration (requestId, timeout, headers, etc)
   * 
   * @returns Promise resolving to updated profile response
   * @returns Returns { success: true, data: { message, profile } } on success
   * @returns Returns { success: false, error } on failure
   * 
   * @throws {ValidationError} If update data is invalid (400)
   * @throws {NotFoundError} If profile doesn't exist (404)
   * @throws {ConflictError} If optimistic lock fails (409)
   * @throws {InternalError} If server error occurs (500)
   * 
   * @example
   * ```typescript
   * const result = await client.updateProfile('user-123', {
   *   userId: 'user-123',
   *   updateData: {
   *     name: 'John Smith',
   *     school: 'ABC High School',
   *     bio: 'Experienced math teacher',
   *     subjects: ['Mathematics', 'Physics'],
   *     yearsTeaching: 5
   *   }
   * }, { requestId: 'req-789' });
   * 
   * if (result.success) {
   *   console.log('Profile updated:', result.data.profile);
   * }
   * ```
   */
  updateProfile(
    userId: string,
    updates: UpdateProfileRequestData,
    config?: RequestConfig
  ): Promise<UpdateProfileApiResponse>;

  /**
   * Upload user avatar image
   * 
   * Uploads a new avatar image for the user's profile.
   * Image is processed, resized, and stored in cloud storage.
   * 
   * @param userId - User identifier whose avatar to update
   * @param request - Avatar upload request
   * @param request.file - Image file (File or Buffer)
   * @param request.filename - Original filename
   * @param request.contentType - MIME type (e.g., 'image/jpeg', 'image/png')
   * @param config - Optional request configuration (requestId, timeout, headers, etc)
   * 
   * @returns Promise resolving to avatar upload response
   * @returns Returns { success: true, data: { avatarUrl, uploadedAt } } on success
   * @returns Returns { success: false, error } on failure
   * 
   * @throws {ValidationError} If file is invalid or too large (400)
   * @throws {NotFoundError} If profile doesn't exist (404)
   * @throws {InternalError} If upload fails (500)
   * 
   * @example
   * ```typescript
   * // Browser environment with File object
   * const file = document.getElementById('avatar').files[0];
   * const result = await client.uploadAvatar('user-123', {
   *   file: file,
   *   filename: file.name,
   *   contentType: file.type
   * });
   * 
   * // Node.js environment with Buffer
   * const fileBuffer = fs.readFileSync('avatar.jpg');
   * const result = await client.uploadAvatar('user-123', {
   *   file: fileBuffer,
   *   filename: 'avatar.jpg',
   *   contentType: 'image/jpeg'
   * }, {
   *   timeout: 30000 // 30 second timeout for large uploads
   * });
   * 
   * if (result.success) {
   *   console.log('Avatar uploaded:', result.data.avatarUrl);
   * }
   * ```
   */
  uploadAvatar(
    userId: string,
    request: UploadAvatarRequest,
    config?: RequestConfig
  ): Promise<UploadAvatarApiResponse>;

  /**
   * Validate and refresh user statistics
   * 
   * Validates user statistics and optionally forces a refresh from source data.
   * Useful for ensuring statistics accuracy after bulk operations.
   * 
   * @param userId - User identifier whose statistics to validate
   * @param options - Optional validation parameters
   * @param options.forceRefresh - Force refresh from source (default: false)
   * @param config - Optional request configuration (requestId, timeout, headers, etc)
   * 
   * @returns Promise resolving to validation response
   * @returns Returns { success: true, data: { statistics, refreshed } } on success
   * @returns Returns { success: false, error } on failure
   * 
   * @throws {ValidationError} If userId is invalid (400)
   * @throws {NotFoundError} If profile doesn't exist (404)
   * @throws {InternalError} If validation fails (500)
   * 
   * @example
   * ```typescript
   * // Validate without forcing refresh
   * const result = await client.validateStatistics('user-123');
   * 
   * // Force refresh from source
   * const forceResult = await client.validateStatistics('user-123', {
   *   forceRefresh: true
   * }, {
   *   requestId: 'req-999',
   *   timeout: 10000 // Longer timeout for refresh
   * });
   * 
   * if (forceResult.success) {
   *   console.log('Statistics:', forceResult.data.statistics);
   *   console.log('Was refreshed:', forceResult.data.refreshed);
   * }
   * ```
   */
  validateStatistics(
    userId: string,
    options?: Omit<ValidateStatisticsRequest, 'userId'>,
    config?: RequestConfig
  ): Promise<ValidateStatisticsApiResponse>;
}
