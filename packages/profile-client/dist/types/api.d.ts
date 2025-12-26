/**
 * Profile API request/response types
 *
 * These types represent the API contract between clients and the Profile Service.
 */
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
 * Update profile request data (API level - includes userId and metadata)
 */
export interface UpdateProfileRequestData {
    userId: string;
    updateData: UpdateProfileRequest;
    ifMatch?: string;
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
 * Upload avatar request
 */
export interface UploadAvatarRequest {
    file: File | Buffer;
    filename: string;
    contentType: string;
}
/**
 * Upload avatar response
 */
export interface UploadAvatarResponse {
    avatarUrl: string;
    uploadedAt: string;
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
 * Create profile from registration response
 */
export interface CreateProfileFromRegistrationResponse {
    profile: GetProfileResponse;
    isNewProfile: boolean;
}
/**
 * Validate statistics request
 */
export interface ValidateStatisticsRequest {
    userId: string;
    forceRefresh?: boolean;
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
//# sourceMappingURL=api.d.ts.map