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
  ErrorResponse,
  EducationalMetadata,
  TeachingGuides,
  UsageInstructions,
  InstructionalStep,
  CommonChallenges,
  Misconception,
  QuickAssessment,
  QuickAssessmentType
} from '@tutenet/client-core';

// Re-export common types for convenience
export { 
  PaginatedResponse, 
  SuccessResponse, 
  MessageResponse, 
  ErrorResponse, 
  EducationalMetadata,
  TeachingGuides,
  UsageInstructions,
  InstructionalStep,
  CommonChallenges,
  Misconception,
  QuickAssessment,
  QuickAssessmentType
};

// =============================================================================
// ENUMS AND TYPES
// =============================================================================

/** Resource types: standalone, course, chapter, material */
export enum ResourceType {
  STANDALONE = 'standalone',
  COURSE = 'course',
  CHAPTER = 'chapter',
  MATERIAL = 'material'
}

/** Resource visibility: public, private, school */
export enum ResourceVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  SCHOOL = 'school'
}

/** Resource status: draft, pending_review, published, rejected, archived */
export enum ResourceStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  PUBLISHED = 'published',
  REJECTED = 'rejected',
  ARCHIVED = 'archived'
}

/** Material types: lecture_notes, assignment, practice_worksheet, video_lecture, reference_material, quiz_test, lab_manual, study_guide, presentation_slides, sample_paper, solution_manual, project, case_study, other */
export enum MaterialType {
  LECTURE_NOTES = 'lecture_notes',
  ASSIGNMENT = 'assignment',
  PRACTICE_WORKSHEET = 'practice_worksheet',
  VIDEO_LECTURE = 'video_lecture',
  REFERENCE_MATERIAL = 'reference_material',
  QUIZ_TEST = 'quiz_test',
  LAB_MANUAL = 'lab_manual',
  STUDY_GUIDE = 'study_guide',
  PRESENTATION_SLIDES = 'presentation_slides',
  SAMPLE_PAPER = 'sample_paper',
  SOLUTION_MANUAL = 'solution_manual',
  PROJECT = 'project',
  CASE_STUDY = 'case_study',
  OTHER = 'other'
}

/** Educational subjects */
export enum Subject {
  MATHEMATICS = 'Mathematics',
  SCIENCE = 'Science',
  ENGLISH = 'English',
  HISTORY = 'History',
  GEOGRAPHY = 'Geography',
  PHYSICS = 'Physics',
  CHEMISTRY = 'Chemistry',
  BIOLOGY = 'Biology',
  COMPUTER_SCIENCE = 'Computer Science',
  ART = 'Art',
  MUSIC = 'Music',
  PHYSICAL_EDUCATION = 'Physical Education',
  SOCIAL_STUDIES = 'Social Studies',
  FOREIGN_LANGUAGE = 'Foreign Language',
  ECONOMICS = 'Economics',
  PSYCHOLOGY = 'Psychology',
  PHILOSOPHY = 'Philosophy',
  LITERATURE = 'Literature',
  OTHER = 'Other'
}

/** Supported languages */
export enum Language {
  ENGLISH = 'English',
  SPANISH = 'Spanish',
  FRENCH = 'French',
  GERMAN = 'German',
  ITALIAN = 'Italian',
  PORTUGUESE = 'Portuguese',
  CHINESE = 'Chinese',
  JAPANESE = 'Japanese',
  KOREAN = 'Korean',
  ARABIC = 'Arabic',
  HINDI = 'Hindi',
  RUSSIAN = 'Russian',
  OTHER = 'Other'
}

/** License types for educational resources */
export enum LicenseType {
  ORIGINAL = 'Original',
  CREATIVE_COMMONS_BY = 'Creative Commons BY',
  CREATIVE_COMMONS_BY_SA = 'Creative Commons BY-SA',
  CREATIVE_COMMONS_BY_NC = 'Creative Commons BY-NC',
  CREATIVE_COMMONS_BY_NC_SA = 'Creative Commons BY-NC-SA',
  PUBLIC_DOMAIN = 'Public Domain',
  FAIR_USE = 'Fair Use',
  PERMISSION_GRANTED = 'Permission Granted',
  OTHER = 'Other'
}

/** Source types for educational resources */
export enum SourceType {
  ORIGINAL = 'original',
  ADAPTED = 'adapted',
  CURATED = 'curated',
  TRANSLATED = 'translated',
  REPUBLISHED = 'republished'
}

/** Search sort options */
export enum SearchSortBy {
  RELEVANCE = 'relevance',
  CREATED_AT = 'createdAt',
  DOWNLOADS = 'downloads',
  RATING = 'rating',
  TITLE = 'title',
  UPDATED_AT = 'updatedAt'
}

/** Sort order options */
export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
}

/** Video resolution options */
export enum VideoResolution {
  SD_480P = '480p',
  HD_720P = '720p',
  FULL_HD_1080P = '1080p',
  UHD_4K = '4K'
}

/** Video codec options */
export enum VideoCodec {
  H264 = 'H.264',
  H265 = 'H.265',
  VP9 = 'VP9',
  AV1 = 'AV1'
}

/** Supported file types (MIME types) */
export enum FileType {
  // Documents
  PDF = 'application/pdf',
  DOC = 'application/msword',
  DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  PPT = 'application/vnd.ms-powerpoint',
  PPTX = 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  XLS = 'application/vnd.ms-excel',
  XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  TXT = 'text/plain',
  RTF = 'application/rtf',
  
  // Images
  JPEG = 'image/jpeg',
  PNG = 'image/png',
  GIF = 'image/gif',
  SVG = 'image/svg+xml',
  WEBP = 'image/webp',
  
  // Videos
  MP4 = 'video/mp4',
  WEBM = 'video/webm',
  AVI = 'video/x-msvideo',
  MOV = 'video/quicktime',
  
  // Audio
  MP3 = 'audio/mpeg',
  WAV = 'audio/wav',
  OGG = 'audio/ogg',
  
  // Archives
  ZIP = 'application/zip',
  RAR = 'application/vnd.rar'
}

/** Structure response types for enhanced resource structure API */
export enum StructureResponseType {
  STANDALONE_RESOURCE = 'standalone_resource',  // Standalone resource response
  COURSE_STRUCTURE = 'course_structure',        // Course with hierarchy
  CHAPTER_CONTEXT = 'chapter_context',          // Chapter with navigation
  MATERIAL_CONTEXT = 'material_context'         // Material with navigation
}

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
  subject: Subject;
  grades: string[];
  tags: string[];
  language: Language;
  visibility: ResourceVisibility;
  s3Key?: string;
  materialType?: MaterialType;
  userId: string;
  topic?: string;
  license?: LicenseType;
  sourceType?: SourceType;
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
  subject?: Subject;
  grades?: string[];
  tags?: string[];
  language?: Language;
  visibility?: ResourceVisibility;
  materialType?: MaterialType;
  topic?: string;
  license?: LicenseType;
  sourceType?: SourceType;
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
 *   subject: Subject.MATHEMATICS,
 *   limit: 20
 * };
 * ```
 */
export interface ListResourcesParams {
  type?: ResourceType;
  userId?: string;
  subject?: Subject;
  grades?: string; // Comma-separated string: "K,1,2,3"
  language?: Language;
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
 *   subject: Subject.MATHEMATICS
 * };
 * ```
 */
export interface SearchResourcesParams {
  q: string;
  type?: ResourceType;
  subject?: Subject;
  grades?: string; // Comma-separated string: "K,1,2,3"
  language?: Language;
  materialType?: MaterialType;
  cursor?: string;
  limit?: number;
  sortBy?: SearchSortBy;
  sortOrder?: SortOrder;
}

// =============================================================================
// ENHANCED RESOURCE STRUCTURE API TYPES
// =============================================================================

/** Breadcrumb item for navigation */
export interface BreadcrumbItem {
  id: string;
  title: string;
  type: ResourceType;
  url?: string;                // Optional URL for clickable breadcrumbs
}

/** Jump-to option for quick navigation */
export interface JumpToOption {
  id: string;
  title: string;
  type: ResourceType;
  section?: string;            // Section within resource (for long content)
}

/** Resource analytics data */
export interface ResourceAnalytics {
  // Essential engagement metrics (always present, never null)
  // These align with existing ResourceResponse analytics fields
  upvotesCount: number;          // Number of upvotes (>= 0) - maps to 'upvotesCount' in ResourceResponse
  commentsCount: number;         // Number of comments (>= 0) - maps to 'comments' in ResourceResponse
  downloadsCount: number;        // Number of downloads (>= 0) - maps to 'downloads' in ResourceResponse
  averageRating: number;         // Average rating 0.0-5.0 (0.0 if no ratings) - maps to 'rating' in ResourceResponse
  
  // User interaction flags (always present for authenticated users)
  upvotedByMe: boolean;          // true if current user upvoted this resource
  bookmarkedByMe?: boolean;      // true if current user bookmarked (optional feature)
  
  // Optional metrics (only when available and tracked)
  viewsCount?: number;           // Total view count (>= 0, undefined if not tracked)
  
  // Additional analytics fields for Task 4.1 (Analytics Format Alignment)
  totalRatings?: number;         // Total number of ratings (>= 0)
  lastViewedAt?: string;         // ISO 8601 timestamp of last view by current user
  lastDownloadedAt?: string;     // ISO 8601 timestamp of last download by current user
}

/** Enhanced teacher object with all required fields for proper nested structure */
export interface EnhancedTeacher {
  // Core identification
  id: string;                    // Teacher/user ID
  name: string;                  // Display name
  school: string;                // School name
  
  // Enhanced fields (Task 3.1 - Teacher Data Aggregation)
  city?: string;                 // Teacher's city (optional)
  primarySubject: string;        // Primary teaching subject
  
  // Performance metrics (Task 3.1)
  resourceCount: number;         // Total resources created by teacher
  totalDownloads: number;        // Total downloads across all teacher's resources
  appreciations: number;         // Total appreciations/likes received
  
  // Status and recognition (Task 3.1)
  isMentor: boolean;             // Whether teacher is a mentor
  isVerified: boolean;           // Whether teacher is verified
  
  // Media (optional)
  avatarUrl?: string;            // Profile picture URL
}

/** Navigation context for hierarchical resources */
export interface NavigationContext {
  // Position within parent container
  position: {
    current: number;             // Current position (1-based index)
    total: number;               // Total items in container
  };
  
  // Adjacent resources for navigation
  adjacent: {
    previous?: { id: string; title: string };  // Previous resource (null if first)
    next?: { id: string; title: string };      // Next resource (null if last)
  };
  
  // Enhanced navigation (when expand=navigation requested)
  breadcrumbs?: BreadcrumbItem[];              // Path from root to current
  jumpTo?: JumpToOption[];                     // Quick navigation options
}

/** Resource context with hierarchical relationships */
export interface ResourceContext {
  // Hierarchical relationships (based on expand parameters)
  course?: ResourceDetails;      // Root course (for chapters and materials)
  chapter?: ResourceDetails;     // Parent chapter (for materials only)
  parent?: ResourceDetails;      // Direct parent (chapter for material, course for chapter)
  children?: ResourceDetails[];  // Direct children (chapters for course, materials for chapter)
  siblings?: ResourceDetails[];  // Resources at same level (same parent)
  ancestors?: ResourceDetails[]; // Complete parent chain (material -> chapter -> course)
  descendants?: ResourceDetails[];// All nested children (course -> chapters -> materials)
  related?: ResourceDetails[];   // Algorithmically related resources (max 10)
  
  // Navigation context (for hierarchical resources)
  navigation?: NavigationContext;
}

/** Enhanced course structure for course resources */
export interface EnhancedCourseStructure {
  chapters: ResourceDetails[];             // All chapters in order (with materials as children)
  totalMaterials: number;                  // Total count of materials across all chapters
  estimatedDuration?: number;              // Total estimated duration in minutes
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
  subject: Subject;
  grades: string[];
  tags: string[];
  language: Language;
  visibility: ResourceVisibility;
  fileName?: string;
  fileType?: FileType;
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
  license?: LicenseType;
  sourceType?: SourceType;
  licenseDetails?: string;
  thumbnailUrl?: string;
  previewUrl?: string;          // Presigned S3 URL for file preview (materials and standalone only, 15-min expiry)
  videoDuration?: number;
  videoResolution?: VideoResolution;
  videoCodec?: VideoCodec;
  transcodedUrl?: string;
}

/** 
 * Resource details model for structure API (excludes analytics and teacher fields)
 * Used specifically by the enhanced resource structure API to avoid duplication
 * with dedicated analytics and teacher objects.
 */
export interface ResourceDetails {
  id: string;
  type: ResourceType;
  parentId?: string;
  rootId?: string;
  orderIndex?: number;
  title: string;
  description?: string;
  subject: Subject;
  grades: string[];
  tags: string[];
  language: Language;
  visibility: ResourceVisibility;
  fileName?: string;
  fileType?: FileType;
  size?: number;
  materialType?: MaterialType;
  userId: string;                       // Keep for ownership reference
  // ❌ EXCLUDED: teacherName, teacherSchool (now in dedicated teacher object)
  // ❌ EXCLUDED: downloads, upvotesCount, rating, comments, upvotedByMe (now in dedicated analytics object)
  childCount?: number;
  totalSize?: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  status: ResourceStatus;
  allowOffline: boolean;
  watermarkEnabled: boolean;
  topic?: string;
  license?: LicenseType;
  sourceType?: SourceType;
  licenseDetails?: string;
  thumbnailUrl?: string;
  previewUrl?: string;          // Presigned S3 URL for file preview (materials and standalone only, 15-min expiry)
  videoDuration?: number;
  videoResolution?: VideoResolution;
  videoCodec?: VideoCodec;
  transcodedUrl?: string;
  
  // Educational metadata (Task 2.2) - using EducationalMetadata interface
  educational?: EducationalMetadata;
  
  // TeachingGuides MVP structure (Task 2.1)
  teachingGuides?: TeachingGuides;   // Optional teaching guidance
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

/** Enhanced resource structure response data */
export interface EnhancedResourceStructureResponse {
  type: StructureResponseType;           // Discriminator for response structure
  resource: ResourceDetails;             // Primary resource (excludes analytics/teacher fields)
  analytics: ResourceAnalytics;          // Analytics data (always present)
  
  // Enhanced teacher object (Task 3.1 - will be populated with enhanced data)
  teacher?: EnhancedTeacher;             // Enhanced teacher information
  
  // Type-specific context (mutually exclusive)
  context?: ResourceContext;             // For chapter_context, material_context
  structure?: EnhancedCourseStructure;   // For course_structure only
  
  // Expanded data (when expand parameters used)
  expandedContext?: {
    [key: string]: ResourceDetails[] | ResourceDetails | any;  // Dynamic based on expand params
  };
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

/** Enhanced resource structure API response */
export type EnhancedResourceStructureApiResponse = SuccessResponse<EnhancedResourceStructureResponse> | ErrorResponse;

/** Success operation API response */
export type SuccessApiResponse = SuccessResponse<MessageResponse> | ErrorResponse;

// =============================================================================
// CONTENT ACCESS API TYPES
// =============================================================================

/** Valid access types for resource content */
export enum ContentAccessType {
  VIEW = 'view',
  STREAM = 'stream',
  DOWNLOAD = 'download'
}

/** Content metadata for different file types */
export interface ContentMetadata {
  fileType: FileType;
  fileSize: number;
  fileName?: string;
  duration?: number; // For video/audio files in seconds
  dimensions?: {
    width: number;
    height: number;
  }; // For images/videos
}

/** Viewing options for content access */
export interface ViewingOptions {
  supportsOffline: boolean;
  supportsStreaming: boolean;
  requiresApp: boolean;
  maxOfflineDays?: number;
  canPrint?: boolean;
  canShare?: boolean;
  watermarkEnabled?: boolean;
  securityLevel?: 'public' | 'app-restricted' | 'device-locked';
  urlExpiration?: number; // Expiration time in seconds
}

/** Resource content access response data */
export interface ResourceContentAccessResponse {
  contentUrl: string;
  accessType: ContentAccessType;
  expiresAt: string; // ISO 8601 timestamp
  contentMetadata: ContentMetadata;
  viewingOptions: ViewingOptions;
  cacheHeaders?: {
    'Cache-Control': string;
    'ETag'?: string;
    'Expires': string;
    'Last-Modified'?: string;
  };
}

/** Resource content access API response */
export type ResourceContentAccessApiResponse = SuccessResponse<ResourceContentAccessResponse> | ErrorResponse;