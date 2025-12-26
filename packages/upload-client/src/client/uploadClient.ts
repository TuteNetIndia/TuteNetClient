/**
 * Upload Service Client
 * 
 * Provides methods to interact with the TuteNet Upload Service API.
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
  PresignedUrlRequest,
  PresignedUrlResponse,
  CreateResourceRequest,
  CreateResourceResponse,
  BulkCreateResourceRequest,
  BulkCreateResourceResponse,
  UpdateResourceRequest,
  ResourceResponse,
  CourseStructureResponse,
  ListResourcesParams,
  ListResourcesResponse,
  SearchResourcesParams,
  SearchResourcesResponse,
  DeleteResourceResponse,
  SuccessResponse,
} from '../types/api';

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
export class UploadClient extends BaseClient {
  constructor(config: UploadClientConfig = {}) {
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
   * Generate presigned URL for file upload
   */
  async generatePresignedUrl(request: PresignedUrlRequest): Promise<PresignedUrlResponse> {
    return this.post<PresignedUrlResponse>('/upload/presign', request);
  }

  /**
   * Finalize upload and create resource
   */
  async finalizeUpload(request: CreateResourceRequest): Promise<CreateResourceResponse> {
    return this.post<CreateResourceResponse>('/resources', request);
  }

  /**
   * Bulk finalize uploads and create multiple resources
   */
  async bulkFinalizeUpload(request: BulkCreateResourceRequest): Promise<BulkCreateResourceResponse> {
    return this.post<BulkCreateResourceResponse>('/resources/bulk', request);
  }

  /**
   * Get resource by ID
   */
  async getResource(resourceId: string): Promise<ResourceResponse> {
    return this.get<ResourceResponse>(`/resources/${resourceId}`);
  }

  /**
   * Update resource
   */
  async updateResource(resourceId: string, request: UpdateResourceRequest): Promise<ResourceResponse> {
    return this.patch<ResourceResponse>(`/resources/${resourceId}`, request);
  }

  /**
   * Delete resource
   */
  async deleteResource(resourceId: string): Promise<DeleteResourceResponse> {
    return this.delete<DeleteResourceResponse>(`/resources/${resourceId}`);
  }

  /**
   * List resources with filtering and pagination
   */
  async listResources(params?: ListResourcesParams): Promise<ListResourcesResponse> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => queryParams.append(key, v.toString()));
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });
    }
    
    const url = `/resources${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.get<ListResourcesResponse>(url);
  }

  /**
   * Search resources
   */
  async searchResources(params: SearchResourcesParams): Promise<SearchResourcesResponse> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => queryParams.append(key, v.toString()));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });
    
    return this.get<SearchResourcesResponse>(`/search?${queryParams.toString()}`);
  }

  /**
   * Get course structure (course with chapters and materials)
   */
  async getCourseStructure(courseId: string): Promise<CourseStructureResponse> {
    return this.get<CourseStructureResponse>(`/courses/${courseId}/structure`);
  }

  /**
   * Validate S3 upload (internal use)
   */
  async validateS3Upload(s3Key: string): Promise<SuccessResponse> {
    return this.post<SuccessResponse>('/upload/validate', { s3Key });
  }

  /**
   * Process video (trigger video processing)
   */
  async processVideo(resourceId: string): Promise<SuccessResponse> {
    return this.post<SuccessResponse>(`/resources/${resourceId}/process-video`);
  }

  /**
   * Cleanup orphaned files (admin operation)
   */
  async cleanupOrphanedFiles(): Promise<SuccessResponse> {
    return this.post<SuccessResponse>('/admin/cleanup-orphaned-files');
  }

  /**
   * Set authentication token for subsequent requests
   */
  setAccessToken(token: string): void {
    // Update the config and recreate client with new token
    (this.config as any).authToken = token;
  }

  /**
   * Clear authentication token
   */
  clearAccessToken(): void {
    // Clear the token from config
    delete (this.config as any).authToken;
  }

  /**
   * Upload file directly to S3 using presigned URL
   * 
   * This is a convenience method that combines presigned URL generation
   * and direct upload to S3.
   */
  async uploadFile(
    file: File | Buffer,
    filename: string,
    contentType: string,
    onProgress?: (progress: number) => void
  ): Promise<string> {
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
    } catch (error) {
      throw new Error(`Failed to upload file to S3: ${error}`);
    }
  }

  /**
   * Complete upload workflow: generate presigned URL, upload to S3, and finalize
   * 
   * This is a convenience method for the full upload workflow.
   */
  async completeUpload(
    file: File | Buffer,
    filename: string,
    contentType: string,
    resourceData: Omit<CreateResourceRequest, 's3Key'>,
    onProgress?: (progress: number) => void
  ): Promise<CreateResourceResponse> {
    // Step 1: Upload file to S3
    const s3Key = await this.uploadFile(file, filename, contentType, onProgress);

    // Step 2: Finalize upload and create resource
    return this.finalizeUpload({
      ...resourceData,
      s3Key,
    });
  }
}