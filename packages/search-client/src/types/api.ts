/**
 * Search API Types
 * 
 * Defines the API request/response contracts for the TuteNet Search Service.
 */

import { ApiResponse } from '@tutenet/client-core';

// ──────────────────────────────────────────────────
// Search Query Parameters
// ──────────────────────────────────────────────────

export type SearchType = 'all' | 'resources' | 'teachers';
export type SearchSortOrder = 'relevance' | 'newest' | 'popular';

export interface SearchParams {
  /** Search query text (max 200 chars) */
  q?: string;
  /** Type of search results to return */
  type?: SearchType;
  /** Filter by subject */
  subject?: string;
  /** Filter by grades (comma-separated) */
  grades?: string;
  /** Filter by language */
  language?: string;
  /** Sort order */
  sort?: SearchSortOrder;
  /** Results per page (1-100, default 20) */
  limit?: number;
  /** Pagination cursor */
  cursor?: string;
}

export interface TeacherSearchParams {
  /** Search query text (max 200 chars) */
  q?: string;
  /** Filter by subject */
  subject?: string;
  /** Sort order */
  sort?: SearchSortOrder;
  /** Results per page (1-50, default 20) */
  limit?: number;
  /** Pagination cursor */
  cursor?: string;
}

export interface SuggestionsParams {
  /** Prefix to autocomplete (min 2 chars) */
  prefix: string;
}

// ──────────────────────────────────────────────────
// Response Types
// ──────────────────────────────────────────────────

export interface ResourceSearchItem {
  id: string;
  title: string;
  description?: string;
  subject: string;
  grade: string;
  language: string;
  tags: string[];
  teacherId: string;
  teacherName: string;
  downloads: number;
  upvotesCount: number;
  rating: number;
  fileType?: string;
  thumbnailUrl?: string;
  createdAt: string;
  previewUrl?: string;
  isPurchased?: boolean;
  topic?: string;
  license?: string;
  sourceType?: string;
}

export interface TeacherSearchItem {
  id: string;
  name: string;
  school: string;
  city: string;
  subject: string;
  resourceCount: number;
  totalDownloads: number;
  rating: number;
  isMentor: boolean;
  avatarUrl?: string;
  appreciations: number;
  badges: string[];
}

export interface PaginatedData<T> {
  items: T[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface UnifiedSearchData {
  resources: PaginatedData<ResourceSearchItem>;
  teachers: PaginatedData<TeacherSearchItem>;
  partialSuccess?: boolean;
  errors?: string[];
}

export interface SearchSuggestion {
  text: string;
  category: 'recent' | 'popular' | 'subject';
}

export interface SuggestionsData {
  suggestions: SearchSuggestion[];
}

// ──────────────────────────────────────────────────
// API Response types (using ApiResponse from core)
// ──────────────────────────────────────────────────

export type UnifiedSearchResponse = ApiResponse<UnifiedSearchData>;
export type ResourceSearchResponse = ApiResponse<PaginatedData<ResourceSearchItem>>;
export type TeacherSearchResponse = ApiResponse<PaginatedData<TeacherSearchItem>>;
export type SuggestionsResponse = ApiResponse<SuggestionsData>;
