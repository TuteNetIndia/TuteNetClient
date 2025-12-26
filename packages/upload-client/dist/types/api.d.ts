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
    parentId?: string;
    rootId?: string;
    orderIndex?: number;
    title: string;
    description?: string;
    subject: string;
    grades: string[];
    tags: string[];
    language: string;
    visibility: ResourceVisibility;
    s3Key?: string;
    materialType?: MaterialType;
    teacherId: string;
    topic?: string;
    license?: string;
    sourceType?: string;
    licenseDetails?: string;
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
    id: string;
    type: ResourceType;
    parentId?: string;
    rootId?: string;
    orderIndex?: number;
    title: string;
    description?: string;
    subject: string;
    grades: string[];
    tags: string[];
    language: string;
    visibility: ResourceVisibility;
    fileName?: string;
    fileType?: string;
    size?: number;
    s3Key?: string;
    materialType?: MaterialType;
    teacherId: string;
    teacherName: string;
    teacherSchool: string;
    downloads: number;
    upvotesCount: number;
    rating: number;
    comments: number;
    childCount?: number;
    totalSize?: number;
    titleTokens: string[];
    contentTokens: string[];
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
    version: number;
    status: ResourceStatus;
    revoked: boolean;
    allowOffline: boolean;
    cacheTtlSec: number;
    watermarkEnabled: boolean;
    submittedForReviewAt?: string;
    reviewedAt?: string;
    reviewedBy?: string;
    rejectionReason?: string;
    topic?: string;
    license?: string;
    sourceType?: string;
    licenseDetails?: string;
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
    type?: ResourceType;
    teacherId?: string;
    subject?: string;
    grade?: string;
    language?: string;
    status?: ResourceStatus;
    visibility?: ResourceVisibility;
    parentId?: string;
    rootId?: string;
    search?: string;
    tags?: string[];
    cursor?: string;
    limit?: number;
    sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'downloads' | 'rating';
    sortOrder?: 'asc' | 'desc';
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
    q: string;
    type?: ResourceType;
    subject?: string;
    grade?: string;
    language?: string;
    materialType?: MaterialType;
    cursor?: string;
    limit?: number;
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
//# sourceMappingURL=api.d.ts.map