/**
 * TuteNet Upload Service API Types
 * 
 * Defines the complete API contract between clients and the TuteNet Upload Service.
 * Used by both frontend clients and backend services for type safety.
 * 
 * @version 2.0.0
 */

import {
  PaginatedResponse,
  SuccessResponse,
  MessageResponse,
  ErrorResponse
} from '@tutenet/client-core';

// Re-export common types for convenience
export { PaginatedResponse, SuccessResponse, MessageResponse, ErrorResponse };

// =============================================================================
// ENUMS AND TYPES
// =============================================================================

/** Resource types: standalone, course, chapter, material */
export type ResourceType = 'standalone' | 'course' | 'chapter' | 'material';

/** Resource visibility: public, private, school */
export type ResourceVisibility = 'public' | 'private' | 'school';

/** Resource status: draft, pending_review, published, rejected, archived */
export type ResourceStatus = 'draft' | 'pending_review' | 'published' | 'rejected' | 'archived';

/** Material types: lecture_notes, assignment, practice_worksheet, video_lecture, reference_material, quiz_test, lab_manual, study_guide, presentation_slides, sample_paper, solution_manual, project, case_study, other */
export type MaterialType = 
  | 'lecture_notes'
  | 'assignment' 
  | 'practice_worksheet'
  | 'video_lecture'
  | 'reference_material'
  | 'quiz_test'
  | 'lab_manual'
  | 'study_guide'
  | 'presentation_slides'
  | 'sample_paper'
  | 'solution_manual'
  | 'project'
  | 'case_study'
  | 'other';

// =============================================================================
// REQUEST TYPES
// =============================================================================

/** Generate presigned URL request */
export interface PresignedUrlRequest {
  filename: string;
  contentType: string;
  idempotencyKey?: string;
}

/** Create resource request */
export interface CreateResourceRequest {
  draftId: string;
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
  userId: string;
  topic?: string;
  license?: string;
  sourceType?: string;
  licenseDetails?: string;
}

/** Bulk create resource request */
export interface BulkCreateResourceRequest {
  resources: CreateResourceRequest[];
  idempotencyKey?: string;
}

/** Update resource request */
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
 * List resources query parameters 
 * 
 * @example
 * ```typescript
 * const params: ListResourcesParams = {
 *   grades: "K,1,2,3", // Comma-separated grades
 *   subject: "Mathematics",
 *   limit: 20
 * };
 * ```
 */
export interface ListResourcesParams {
  type?: ResourceType;
  userId?: string;
  subject?: string;
  grades?: string; // Comma-separated string: "K,1,2,3"
  language?: string;
  status?: ResourceStatus;
  visibility?: ResourceVisibility;
  cursor?: string;
  limit?: number;
}

/** 
 * Search resources query parameters 
 * 
 * @example
 * ```typescript
 * const params: SearchResourcesParams = {
 *   q: "algebra worksheets",
 *   grades: "9,10,11,12", // Comma-separated grades
 *   subject: "Mathematics"
 * };
 * ```
 */
export interface SearchResourcesParams {
  q: string;
  type?: ResourceType;
  subject?: string;
  grades?: string; // Comma-separated string: "K,1,2,3"
  language?: string;
  materialType?: MaterialType;
  cursor?: string;
  limit?: number;
  sortBy?: 'relevance' | 'createdAt' | 'downloads' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

// =============================================================================
// RESPONSE DATA TYPES (for the 'data' field)
// =============================================================================

/** Generate presigned URL response */
export interface PresignedUrlResponse {
  key: string;
  url: string;
  expiresIn: number;
}

/** Resource response model (API-safe, excludes internal backend fields) */
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
  materialType?: MaterialType;
  userId: string;
  teacherName: string;
  teacherSchool: string;
  downloads: number;
  upvotesCount: number;
  rating: number;
  comments: number;
  childCount?: number;
  totalSize?: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  status: ResourceStatus;
  allowOffline: boolean;
  watermarkEnabled: boolean;
  topic?: string;
  license?: string;
  sourceType?: string;
  licenseDetails?: string;
  thumbnailUrl?: string;
  videoDuration?: number;
  videoResolution?: string;
  videoCodec?: string;
  transcodedUrl?: string;
}

/** Create resource response */
export interface CreateResourceResponse {
  resourceId: string;
}

/** Bulk create resource response */
export interface BulkCreateResourceResponse {
  resourceIds: string[];
  successCount: number;
  failureCount: number;
  errors: Array<{
    index: number;
    error: string;
  }>;
}

/** Course structure response */
export interface CourseStructureResponse {
  course: ResourceResponse;
  chapters: Array<{
    chapter: ResourceResponse;
    materials: ResourceResponse[];
  }>;
}

/** List resources response */
export interface ListResourcesResponse {
  items: ResourceResponse[];
  nextCursor?: string;
  hasMore: boolean;
  totalCount?: number;
}

/** Search resources response */
export interface SearchResourcesResponse {
  items: ResourceResponse[];
  nextCursor?: string;
  hasMore: boolean;
  totalCount?: number;
  searchTime: number;
}

/** Delete resource response (data only) */
export interface DeleteResourceResponse {
  message: string;
}

// =============================================================================
// FULL API RESPONSE TYPES (using common response structure)
// =============================================================================

/** Generate presigned URL API response */
export type PresignedUrlApiResponse = SuccessResponse<PresignedUrlResponse> | ErrorResponse;

/** Create resource API response */
export type CreateResourceApiResponse = SuccessResponse<CreateResourceResponse> | ErrorResponse;

/** Bulk create resource API response */
export type BulkCreateResourceApiResponse = SuccessResponse<BulkCreateResourceResponse> | ErrorResponse;

/** Get resource API response */
export type ResourceApiResponse = SuccessResponse<ResourceResponse> | ErrorResponse;

/** Update resource API response */
export type UpdateResourceApiResponse = SuccessResponse<ResourceResponse> | ErrorResponse;

/** List resources API response */
export type ListResourcesApiResponse = PaginatedResponse<ResourceResponse> | ErrorResponse;

/** Search resources API response */
export type SearchResourcesApiResponse = (PaginatedResponse<ResourceResponse> & {
  data: {
    items: ResourceResponse[];
    nextCursor?: string;
    previousCursor?: string;
    hasNext: boolean;
    hasPrevious: boolean;
    totalCount?: number;
    searchTime: number; // Additional field for search responses
  };
}) | ErrorResponse;

/** Delete resource API response */
export type DeleteResourceApiResponse = SuccessResponse<DeleteResourceResponse> | ErrorResponse;

/** Course structure API response */
export type CourseStructureApiResponse = SuccessResponse<CourseStructureResponse> | ErrorResponse;

/** Success operation API response */
export type SuccessApiResponse = SuccessResponse<MessageResponse> | ErrorResponse;