/**
 * Upload API request/response types
 * 
 * These types represent the API contract between clients and the Upload Service.
 */

/**
 * Resource types supported by the upload service
 */
export type ResourceType = 'standalone' | 'course' | 'chapter' | 'material';

/**
 * Resource visibility levels
 */
export type ResourceVisibility = 'public' | 'private' | 'school';

/**
 * Resource status values
 */
export type ResourceStatus = 'draft' | 'pending_review' | 'published' | 'rejected' | 'archived';

/**
 * Material types for educational resources
 */
export type MaterialType = 'lecture' | 'worksheet' | 'assignment' | 'quiz' | 'reference' | 'other';

/**
 * Generate presigned URL request
 */
export interface PresignedUrlRequest {
  filename: string;
  contentType: string;
  idempotencyKey?: string;
}

/**
 * Generate presigned URL response
 */
export interface PresignedUrlResponse {
  key: string;
  url: string;
  expiresIn: number;
}

/**
 * Create resource request
 */
export interface CreateResourceRequest {
  type: ResourceType;
  
  // Hierarchy (required for chapter/material)
  parentId?: string;
  rootId?: string;
  orderIndex?: number;
  
  // Core metadata
  title: string;
  description?: string;
  subject: string;
  grades: string[];
  tags: string[];
  language: string;
  visibility: ResourceVisibility;
  
  // File info (required for standalone/material)
  s3Key?: string;
  
  // Material-specific
  materialType?: MaterialType;
  
  // Teacher info
  teacherId: string;
  
  // Optional metadata
  topic?: string;
  license?: string;
  sourceType?: string;
  licenseDetails?: string;
  
  // Idempotency
  idempotencyKey?: string;
}

/**
 * Bulk create resource request
 */
export interface BulkCreateResourceRequest {
  resources: CreateResourceRequest[];
  idempotencyKey?: string;
}

/**
 * Resource response model
 */
export interface ResourceResponse {
  // Identity & Type
  id: string;
  type: ResourceType;
  
  // Hierarchy (optional - null for standalone/course)
  parentId?: string;
  rootId?: string;
  orderIndex?: number;
  
  // Core metadata
  title: string;
  description?: string;
  subject: string;
  grades: string[];
  tags: string[];
  language: string;
  visibility: ResourceVisibility;
  
  // File info (optional - null for course/chapter containers)
  fileName?: string;
  fileType?: string;
  size?: number;
  s3Key?: string;
  
  // Material classification
  materialType?: MaterialType;
  
  // Teacher info
  teacherId: string;
  teacherName: string;
  teacherSchool: string;
  
  // Stats
  downloads: number;
  upvotesCount: number;
  rating: number;
  comments: number;
  
  // Container stats (optional - only for course/chapter)
  childCount?: number;
  totalSize?: number;
  
  // Search optimization
  titleTokens: string[];
  contentTokens: string[];
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  
  // Version for optimistic locking
  version: number;
  
  // Status
  status: ResourceStatus;
  revoked: boolean;
  allowOffline: boolean;
  cacheTtlSec: number;
  watermarkEnabled: boolean;
  
  // Approval workflow
  submittedForReviewAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  
  // Optional metadata
  topic?: string;
  license?: string;
  sourceType?: string;
  licenseDetails?: string;
  
  // Video-specific
  thumbnailUrl?: string;
  videoDuration?: number;
  videoResolution?: string;
  videoCodec?: string;
  transcodedUrl?: string;
  videoProcessingFailed?: boolean;
}

/**
 * Create resource response
 */
export interface CreateResourceResponse {
  resourceId: string;
}

/**
 * Bulk create resource response
 */
export interface BulkCreateResourceResponse {
  resourceIds: string[];
  successCount: number;
  failureCount: number;
  errors: Array<{
    index: number;
    error: string;
  }>;
}

/**
 * Update resource request
 */
export interface UpdateResourceRequest {
  title?: string;
  description?: string;
  subject?: string;
  grades?: string[];
  tags?: string[];
  language?: string;
  visibility?: ResourceVisibility;
  materialType?: MaterialType;
  topic?: string;
  license?: string;
  sourceType?: string;
  licenseDetails?: string;
  status?: ResourceStatus;
  orderIndex?: number;
}

/**
 * Course structure response
 */
export interface CourseStructureResponse {
  course: ResourceResponse;
  chapters: Array<{
    chapter: ResourceResponse;
    materials: ResourceResponse[];
  }>;
}

/**
 * List resources query parameters
 */
export interface ListResourcesParams {
  // Filtering
  type?: ResourceType;
  teacherId?: string;
  subject?: string;
  grade?: string;
  language?: string;
  status?: ResourceStatus;
  visibility?: ResourceVisibility;
  parentId?: string;
  rootId?: string;
  
  // Search
  search?: string;
  tags?: string[];
  
  // Pagination
  cursor?: string;
  limit?: number;
  
  // Sorting
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'downloads' | 'rating';
  sortOrder?: 'asc' | 'desc';
  
  // Include related data
  includeStats?: boolean;
  includeChildren?: boolean;
}

/**
 * List resources response
 */
export interface ListResourcesResponse {
  items: ResourceResponse[];
  nextCursor?: string;
  hasMore: boolean;
  totalCount?: number;
}

/**
 * Search resources query parameters
 */
export interface SearchResourcesParams {
  // Search query
  q: string;
  
  // Filters
  type?: ResourceType;
  subject?: string;
  grade?: string;
  language?: string;
  materialType?: MaterialType;
  
  // Pagination
  cursor?: string;
  limit?: number;
  
  // Sorting
  sortBy?: 'relevance' | 'createdAt' | 'downloads' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Search resources response
 */
export interface SearchResourcesResponse {
  items: ResourceResponse[];
  nextCursor?: string;
  hasMore: boolean;
  totalCount?: number;
  searchTime: number;
}

/**
 * Delete resource response
 */
export interface DeleteResourceResponse {
  success: boolean;
  message: string;
}

/**
 * Success response for operations without specific data
 */
export interface SuccessResponse {
  success: boolean;
  message: string;
}