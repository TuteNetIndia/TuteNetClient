"use strict";
/**
 * Auth Service Client
 *
 * Provides methods to interact with the TuteNet Auth Service API.
 * Supports both internal and external API endpoints with automatic environment detection.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthClient = void 0;
const client_core_1 = require("@tutenet/client-core");
/**
 * Auth Service Client
 */
class AuthClient extends client_core_1.BaseClient {
    constructor(config = {}) {
        const environment = config.environment || (0, client_core_1.detectEnvironment)();
        const apiType = config.useInternalApi ? client_core_1.ApiType.INTERNAL : client_core_1.ApiType.EXTERNAL;
        const clientConfig = {
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
    async signUp(request) {
        return this.post('/auth/signup', request);
    }
    /**
     * Sign in an existing user
     */
    async signIn(request) {
        return this.post('/auth/signin', request);
    }
    /**
     * Get current user information
     */
    async getCurrentUser() {
        return this.get('/auth/me');
    }
    /**
     * Refresh authentication tokens
     */
    async refreshToken(request) {
        return this.post('/auth/refresh', request);
    }
    /**
     * Verify email address
     */
    async verifyEmail(request) {
        return this.post('/auth/verify-email', request);
    }
    /**
     * Resend verification code
     */
    async resendVerification(request) {
        return this.post('/auth/resend-verification', request);
    }
    /**
     * Request password reset
     */
    async forgotPassword(request) {
        return this.post('/auth/forgot-password', request);
    }
    /**
     * Reset password with code
     */
    async resetPassword(request) {
        return this.post('/auth/reset-password', request);
    }
    /**
     * Change password (requires authentication)
     */
    async changePassword(request) {
        return this.post('/auth/change-password', request);
    }
    /**
     * Delete user account (requires authentication)
     */
    async deleteAccount(request) {
        return this.post('/auth/account', request);
    }
    /**
     * Set authentication token for subsequent requests
     */
    setAccessToken(token) {
        // Update the axios instance headers directly
        this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    /**
     * Clear authentication token
     */
    clearAccessToken() {
        delete this.client.defaults.headers.common['Authorization'];
    }
}
exports.AuthClient = AuthClient;
//# sourceMappingURL=authClient.js.map