/**
 * TuteNet Library Service API Types
 *
 * Defines the complete API contract between clients and the Library Service.
 * Matches the backend domain models and handler request/response shapes.
 *
 * @version 1.0.0
 */

import { SuccessResponse, ErrorResponse, PaginatedResponse } from '@tutenet/client-core';

// Re-export common types for convenience
export { SuccessResponse, ErrorResponse, PaginatedResponse };

// =============================================================================
// ENUMS AND TYPES
// =============================================================================

/** How the resource entered the library */
export type LibrarySource = 'created' | 'purchased' | 'saved';

/** Lifecycle state of a library item */
export type LibraryState = 'active' | 'archived';

// =============================================================================
// DOMAIN MODELS
// =============================================================================

/**
 * Library item — a resource in a teacher's personal library
 */
export interface LibraryItem {
  /** User who owns this library item */
  userId: string;

  /** Resource ID this item references */
  resourceId: string;

  /** How the resource was added to the library */
  source: LibrarySource;

  /** Lifecycle state */
  state: LibraryState;

  /** When the resource was added to the library (ISO 8601) */
  addedAt: string;

  /** Curriculum placement path "subject/chapter/topic" or null if unsorted */
  curriculumPlacement: string | null;

  /** Collection IDs this item belongs to */
  collectionIds: string[];

  // Denormalized resource metadata
  resourceTitle: string;
  resourceSubject: string;
  resourceGrade: string;
  resourceFileType: string;
  resourceThumbnailUrl: string | null;

  /** Total earnings (only for source="created", null otherwise) */
  totalEarnings: number | null;

  /** Purchase count (only for source="created", null otherwise) */
  purchaseCount: number | null;
}

/**
 * User-defined collection of library items
 */
export interface LibraryCollection {
  collectionId: string;
  userId: string;
  name: string;
  description: string | null;
  itemCount: number;
  createdAt: string;
}

// =============================================================================
// REQUEST TYPES
// =============================================================================

/** Query parameters for GET /v1/library */
export interface GetLibraryItemsParams {
  /** Filter by source */
  source?: LibrarySource;
  /** Filter by state (defaults to "active") */
  state?: LibraryState;
  /** Pagination cursor */
  cursor?: string;
  /** Page size (default 20, max 100) */
  limit?: number;
}

/** Request body for POST /v1/library */
export interface SaveToLibraryRequest {
  resourceId: string;
}

/** Request body for PATCH /v1/library/{resourceId}/placement */
export interface UpdatePlacementRequest {
  /** Curriculum placement in "subject/chapter/topic" format, or null to unset */
  curriculumPlacement: string | null;
}

/** Request body for PATCH /v1/library/{resourceId}/state */
export interface UpdateStateRequest {
  state: LibraryState;
}

/** Request body for POST /v1/library/collections */
export interface CreateCollectionRequest {
  name: string;
  description?: string;
}

/** Request body for POST /v1/library/collections/{collectionId}/items */
export interface AddToCollectionRequest {
  resourceId: string;
}

// =============================================================================
// RESPONSE DATA TYPES (for the 'data' field)
// =============================================================================

/** Paginated library items response data */
export interface LibraryItemsResponseData {
  items: LibraryItem[];
  nextCursor?: string;
  hasMore: boolean;
}

/** Collections list response data */
export interface CollectionsResponseData {
  items: LibraryCollection[];
}

// =============================================================================
// FULL API RESPONSE TYPES (using common response structure)
// =============================================================================

/** GET /v1/library response */
export type GetLibraryItemsApiResponse = SuccessResponse<LibraryItemsResponseData> | ErrorResponse;

/** POST /v1/library response (201 Created) */
export type SaveToLibraryApiResponse = SuccessResponse<LibraryItem> | ErrorResponse;

/** DELETE /v1/library/{resourceId} response (204 wrapped) */
export type RemoveFromLibraryApiResponse = SuccessResponse<{ message: string }> | ErrorResponse;

/** PATCH /v1/library/{resourceId}/placement response */
export type UpdatePlacementApiResponse = SuccessResponse<LibraryItem> | ErrorResponse;

/** PATCH /v1/library/{resourceId}/state response */
export type UpdateStateApiResponse = SuccessResponse<LibraryItem> | ErrorResponse;

/** GET /v1/library/collections response */
export type GetCollectionsApiResponse = SuccessResponse<CollectionsResponseData> | ErrorResponse;

/** POST /v1/library/collections response (201 Created) */
export type CreateCollectionApiResponse = SuccessResponse<LibraryCollection> | ErrorResponse;

/** DELETE /v1/library/collections/{collectionId} response */
export type DeleteCollectionApiResponse = SuccessResponse<{ message: string }> | ErrorResponse;

/** POST /v1/library/collections/{collectionId}/items response */
export type AddToCollectionApiResponse = SuccessResponse<LibraryItem> | ErrorResponse;

/** DELETE /v1/library/collections/{collectionId}/items/{resourceId} response */
export type RemoveFromCollectionApiResponse = SuccessResponse<{ message: string }> | ErrorResponse;
