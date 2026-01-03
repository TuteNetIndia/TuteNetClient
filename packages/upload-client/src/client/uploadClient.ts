/**
 * TuteNet Upload Service Client
 * 
 * TypeScript client for the TuteNet Upload Service API with comprehensive
 * upload workflow management, resource CRUD operations, and search capabilities.
 * 
 * @version 2.0.0
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
  PresignedUrlApiResponse,
  BulkCreateResourceRequest,
  BulkCreateResourceApiResponse,
  UpdateResourceRequest,
  ResourceApiResponse,
  ListResourcesParams,
  ListResourcesApiResponse,
  SearchResourcesParams,
  SearchResourcesApiResponse,
  DeleteResourceApiResponse,
  SuccessApiResponse,
  EnhancedResourceStructureApiResponse,
} from '../types';

/** Upload client configuration options */
export interface UploadClientConfig {
  environment?: Environment;
  useInternalApi?: boolean;
  baseUrl?: string;
  timeout?: number;
  retries?: number;
  accessToken?: string;
}

/**
 * TuteNet Upload Service Client
 * 
 * Main client class for interacting with the Upload Service API.
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

  /** Generate presigned URL for file upload */
  async generatePresignedUrl(request: PresignedUrlRequest): Promise<PresignedUrlApiResponse> {
    return this.post<PresignedUrlApiResponse>('/upload/presign', request);
  }

  /** Bulk finalize uploads and create multiple resources */
  async bulkFinalizeUpload(request: BulkCreateResourceRequest): Promise<BulkCreateResourceApiResponse> {
    return this.post<BulkCreateResourceApiResponse>('/resources', request);
  }

  /** Get resource by ID */
  async getResource(resourceId: string): Promise<ResourceApiResponse> {
    return this.get<ResourceApiResponse>(`/resources/${resourceId}`);
  }

  /** Update resource metadata */
  async updateResource(resourceId: string, request: UpdateResourceRequest): Promise<ResourceApiResponse> {
    return this.patch<ResourceApiResponse>(`/resources/${resourceId}`, request);
  }

  /** Delete resource */
  async deleteResource(resourceId: string): Promise<DeleteResourceApiResponse> {
    return this.delete<DeleteResourceApiResponse>(`/resources/${resourceId}`);
  }

  /** List resources with filtering and pagination */
  async listResources(params?: ListResourcesParams): Promise<ListResourcesApiResponse> {
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
    return this.get<ListResourcesApiResponse>(url);
  }

  /** Search resources with full-text search */
  async searchResources(params: SearchResourcesParams): Promise<SearchResourcesApiResponse> {
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
    
    return this.get<SearchResourcesApiResponse>(`/search?${queryParams.toString()}`);
  }

  /** Get enhanced resource structure with contextual information and analytics */
  async getResourceStructure(
    resourceId: string, 
    expand?: string
  ): Promise<EnhancedResourceStructureApiResponse> {
    const queryParams = new URLSearchParams();
    
    if (expand) {
      queryParams.append('expand', expand);
    }
    
    const url = `/resources/${resourceId}/structure${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.get<EnhancedResourceStructureApiResponse>(url);
  }

  /** Validate S3 upload (internal use) */
  async validateS3Upload(s3Key: string): Promise<SuccessApiResponse> {
    return this.post<SuccessApiResponse>('/upload/validate', { s3Key });
  }

  /** Process video (trigger video processing) */
  async processVideo(resourceId: string): Promise<SuccessApiResponse> {
    return this.post<SuccessApiResponse>(`/resources/${resourceId}/process-video`);
  }

  /** Cleanup orphaned files (admin operation) */
  async cleanupOrphanedFiles(): Promise<SuccessApiResponse> {
    return this.post<SuccessApiResponse>('/admin/cleanup-orphaned-files');
  }

  /** Set authentication token for subsequent requests */
  setAccessToken(token: string): void {
    (this.config as any).authToken = token;
  }

  /** Clear authentication token */
  clearAccessToken(): void {
    delete (this.config as any).authToken;
  }

  /** Upload file directly to S3 using presigned URL */
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

    // Check if response is successful
    if (!presignedResponse.success) {
      throw new Error(`Failed to generate presigned URL: ${presignedResponse.error.message}`);
    }

    // Upload to S3
    try {
      const response = await fetch(presignedResponse.data.url, {
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

      return presignedResponse.data.key;
    } catch (error) {
      throw new Error(`Failed to upload file to S3: ${error}`);
    }
  }
}
