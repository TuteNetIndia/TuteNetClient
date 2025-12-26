/**
 * Upload Service Client
 *
 * Provides methods to interact with the TuteNet Upload Service API.
 * Supports both internal and external API endpoints with automatic environment detection.
 */
import { BaseClient, Environment } from '@tutenet/client-core';
import { PresignedUrlRequest, PresignedUrlResponse, CreateResourceRequest, CreateResourceResponse, BulkCreateResourceRequest, BulkCreateResourceResponse, UpdateResourceRequest, ResourceResponse, CourseStructureResponse, ListResourcesParams, ListResourcesResponse, SearchResourcesParams, SearchResourcesResponse, DeleteResourceResponse, SuccessResponse } from '../types/api';
/**
 * Upload client configuration
 */
export interface UploadClientConfig {
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
 * Upload Service Client
 */
export declare class UploadClient extends BaseClient {
    constructor(config?: UploadClientConfig);
    /**
     * Generate presigned URL for file upload
     */
    generatePresignedUrl(request: PresignedUrlRequest): Promise<PresignedUrlResponse>;
    /**
     * Finalize upload and create resource
     */
    finalizeUpload(request: CreateResourceRequest): Promise<CreateResourceResponse>;
    /**
     * Bulk finalize uploads and create multiple resources
     */
    bulkFinalizeUpload(request: BulkCreateResourceRequest): Promise<BulkCreateResourceResponse>;
    /**
     * Get resource by ID
     */
    getResource(resourceId: string): Promise<ResourceResponse>;
    /**
     * Update resource
     */
    updateResource(resourceId: string, request: UpdateResourceRequest): Promise<ResourceResponse>;
    /**
     * Delete resource
     */
    deleteResource(resourceId: string): Promise<DeleteResourceResponse>;
    /**
     * List resources with filtering and pagination
     */
    listResources(params?: ListResourcesParams): Promise<ListResourcesResponse>;
    /**
     * Search resources
     */
    searchResources(params: SearchResourcesParams): Promise<SearchResourcesResponse>;
    /**
     * Get course structure (course with chapters and materials)
     */
    getCourseStructure(courseId: string): Promise<CourseStructureResponse>;
    /**
     * Validate S3 upload (internal use)
     */
    validateS3Upload(s3Key: string): Promise<SuccessResponse>;
    /**
     * Process video (trigger video processing)
     */
    processVideo(resourceId: string): Promise<SuccessResponse>;
    /**
     * Cleanup orphaned files (admin operation)
     */
    cleanupOrphanedFiles(): Promise<SuccessResponse>;
    /**
     * Set authentication token for subsequent requests
     */
    setAccessToken(token: string): void;
    /**
     * Clear authentication token
     */
    clearAccessToken(): void;
    /**
     * Upload file directly to S3 using presigned URL
     *
     * This is a convenience method that combines presigned URL generation
     * and direct upload to S3.
     */
    uploadFile(file: File | Buffer, filename: string, contentType: string, onProgress?: (progress: number) => void): Promise<string>;
    /**
     * Complete upload workflow: generate presigned URL, upload to S3, and finalize
     *
     * This is a convenience method for the full upload workflow.
     */
    completeUpload(file: File | Buffer, filename: string, contentType: string, resourceData: Omit<CreateResourceRequest, 's3Key'>, onProgress?: (progress: number) => void): Promise<CreateResourceResponse>;
}
//# sourceMappingURL=uploadClient.d.ts.map