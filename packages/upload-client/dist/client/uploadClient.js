"use strict";
/**
 * Upload Service Client
 *
 * Provides methods to interact with the TuteNet Upload Service API.
 * Supports both internal and external API endpoints with automatic environment detection.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadClient = void 0;
const client_core_1 = require("@tutenet/client-core");
/**
 * Upload Service Client
 */
class UploadClient extends client_core_1.BaseClient {
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
     * Generate presigned URL for file upload
     */
    async generatePresignedUrl(request) {
        return this.post('/upload/presign', request);
    }
    /**
     * Finalize upload and create resource
     */
    async finalizeUpload(request) {
        return this.post('/resources', request);
    }
    /**
     * Bulk finalize uploads and create multiple resources
     */
    async bulkFinalizeUpload(request) {
        return this.post('/resources/bulk', request);
    }
    /**
     * Get resource by ID
     */
    async getResource(resourceId) {
        return this.get(`/resources/${resourceId}`);
    }
    /**
     * Update resource
     */
    async updateResource(resourceId, request) {
        return this.patch(`/resources/${resourceId}`, request);
    }
    /**
     * Delete resource
     */
    async deleteResource(resourceId) {
        return this.delete(`/resources/${resourceId}`);
    }
    /**
     * List resources with filtering and pagination
     */
    async listResources(params) {
        const queryParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    if (Array.isArray(value)) {
                        value.forEach(v => queryParams.append(key, v.toString()));
                    }
                    else {
                        queryParams.append(key, value.toString());
                    }
                }
            });
        }
        const url = `/resources${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return this.get(url);
    }
    /**
     * Search resources
     */
    async searchResources(params) {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (Array.isArray(value)) {
                    value.forEach(v => queryParams.append(key, v.toString()));
                }
                else {
                    queryParams.append(key, value.toString());
                }
            }
        });
        return this.get(`/search?${queryParams.toString()}`);
    }
    /**
     * Get course structure (course with chapters and materials)
     */
    async getCourseStructure(courseId) {
        return this.get(`/courses/${courseId}/structure`);
    }
    /**
     * Validate S3 upload (internal use)
     */
    async validateS3Upload(s3Key) {
        return this.post('/upload/validate', { s3Key });
    }
    /**
     * Process video (trigger video processing)
     */
    async processVideo(resourceId) {
        return this.post(`/resources/${resourceId}/process-video`);
    }
    /**
     * Cleanup orphaned files (admin operation)
     */
    async cleanupOrphanedFiles() {
        return this.post('/admin/cleanup-orphaned-files');
    }
    /**
     * Set authentication token for subsequent requests
     */
    setAccessToken(token) {
        // Update the config and recreate client with new token
        this.config.authToken = token;
    }
    /**
     * Clear authentication token
     */
    clearAccessToken() {
        // Clear the token from config
        delete this.config.authToken;
    }
    /**
     * Upload file directly to S3 using presigned URL
     *
     * This is a convenience method that combines presigned URL generation
     * and direct upload to S3.
     */
    async uploadFile(file, filename, contentType, onProgress) {
        // Generate presigned URL
        const presignedResponse = await this.generatePresignedUrl({
            filename,
            contentType,
        });
        // Upload to S3
        try {
            const response = await fetch(presignedResponse.url, {
                method: 'PUT',
                body: file,
                headers: {
                    'Content-Type': contentType,
                },
            });
            if (!response.ok) {
                throw new Error(`S3 upload failed: ${response.statusText}`);
            }
            // Call progress callback if provided (100% on completion)
            if (onProgress) {
                onProgress(100);
            }
            return presignedResponse.key;
        }
        catch (error) {
            throw new Error(`Failed to upload file to S3: ${error}`);
        }
    }
    /**
     * Complete upload workflow: generate presigned URL, upload to S3, and finalize
     *
     * This is a convenience method for the full upload workflow.
     */
    async completeUpload(file, filename, contentType, resourceData, onProgress) {
        // Step 1: Upload file to S3
        const s3Key = await this.uploadFile(file, filename, contentType, onProgress);
        // Step 2: Finalize upload and create resource
        return this.finalizeUpload({
            ...resourceData,
            s3Key,
        });
    }
}
exports.UploadClient = UploadClient;
//# sourceMappingURL=uploadClient.js.map