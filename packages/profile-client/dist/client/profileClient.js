"use strict";
/**
 * Profile Service Client
 *
 * Official client for communicating with TuteNet Profile Service.
 * Supports both external (public) and internal API gateways.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileClient = void 0;
const client_core_1 = require("@tutenet/client-core");
/**
 * Profile Service Client
 *
 * Provides type-safe access to Profile Service APIs with built-in
 * error handling, retries, and request/response validation.
 */
class ProfileClient extends client_core_1.BaseClient {
    constructor(config) {
        super(config);
    }
    /**
     * Get user profile by ID
     */
    async getProfile(userId, options, config) {
        try {
            const params = new URLSearchParams();
            if (options?.includeStatistics)
                params.append('includeStatistics', 'true');
            if (options?.refreshStatistics)
                params.append('refreshStatistics', 'true');
            if (options?.statisticsMaxAge)
                params.append('statisticsMaxAge', options.statisticsMaxAge.toString());
            const url = this.buildUrl(`/profile/${userId}`, params);
            const response = await this.get(url, config);
            return response;
        }
        catch (error) {
            throw this.handleProfileError(error, 'getProfile');
        }
    }
    /**
     * Update user profile
     */
    async updateProfile(userId, updates, config) {
        try {
            const url = this.buildUrl(`/profile/${userId}`);
            return await this.put(url, updates, config);
        }
        catch (error) {
            throw this.handleProfileError(error, 'updateProfile');
        }
    }
    /**
     * Upload user avatar
     */
    async uploadAvatar(userId, request, config) {
        try {
            const formData = new FormData();
            formData.append('file', request.file);
            formData.append('filename', request.filename);
            formData.append('contentType', request.contentType);
            const url = this.buildUrl(`/profile/${userId}/avatar`);
            return await this.post(url, formData, {
                ...config,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    ...config?.headers,
                },
            });
        }
        catch (error) {
            throw this.handleProfileError(error, 'uploadAvatar');
        }
    }
    /**
     * Create profile from registration data (internal API only)
     */
    async createProfileFromRegistration(data, config) {
        try {
            const url = this.buildUrl('/profile/from-registration');
            return await this.post(url, data, config);
        }
        catch (error) {
            throw this.handleProfileError(error, 'createProfileFromRegistration');
        }
    }
    /**
     * Validate and refresh user statistics
     */
    async validateStatistics(userId, options, config) {
        try {
            const params = new URLSearchParams();
            if (options?.forceRefresh)
                params.append('forceRefresh', 'true');
            const url = this.buildUrl(`/profile/${userId}/statistics/validate`, params);
            return await this.post(url, {}, config);
        }
        catch (error) {
            throw this.handleProfileError(error, 'validateStatistics');
        }
    }
    /**
     * Get multiple profiles by IDs (batch operation)
     */
    async getProfiles(userIds, options, config) {
        try {
            const params = new URLSearchParams();
            userIds.forEach(id => params.append('userIds', id));
            if (options?.includeStatistics)
                params.append('includeStatistics', 'true');
            if (options?.refreshStatistics)
                params.append('refreshStatistics', 'true');
            if (options?.statisticsMaxAge)
                params.append('statisticsMaxAge', options.statisticsMaxAge.toString());
            const url = this.buildUrl('/profiles', params);
            const responses = await this.get(url, config);
            return responses;
        }
        catch (error) {
            throw this.handleProfileError(error, 'getProfiles');
        }
    }
    /**
     * Search profiles by criteria
     */
    async searchProfiles(query, config) {
        try {
            const params = new URLSearchParams();
            if (query.school)
                params.append('school', query.school);
            if (query.city)
                params.append('city', query.city);
            if (query.subject)
                params.append('subject', query.subject);
            if (query.isMentor !== undefined)
                params.append('isMentor', query.isMentor.toString());
            if (query.limit)
                params.append('limit', query.limit.toString());
            if (query.cursor)
                params.append('cursor', query.cursor);
            const url = this.buildUrl('/profiles/search', params);
            const response = await this.get(url, config);
            return {
                profiles: response.items,
                nextCursor: response.nextCursor,
                hasMore: response.hasMore,
            };
        }
        catch (error) {
            throw this.handleProfileError(error, 'searchProfiles');
        }
    }
    /**
     * Build URL with optional query parameters
     */
    buildUrl(path, params) {
        const clientConfig = this.getConfig();
        const baseUrl = clientConfig.apiType === 'internal' ? '/internal' : '';
        const fullPath = `${baseUrl}${path}`;
        return params && params.toString() ? `${fullPath}?${params.toString()}` : fullPath;
    }
    /**
     * Handle profile-specific errors
     */
    handleProfileError(error, operation) {
        if (error instanceof client_core_1.ClientError) {
            return error;
        }
        return new client_core_1.ClientError(`Profile ${operation} failed: ${error.message}`, error.code || 'UNKNOWN_ERROR', error.statusCode, error.details, error.requestId);
    }
}
exports.ProfileClient = ProfileClient;
//# sourceMappingURL=profileClient.js.map