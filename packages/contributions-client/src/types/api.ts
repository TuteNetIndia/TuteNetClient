/**
 * TuteNet Contributions Service API Types
 *
 * API contract for the "Contributions & Earnings" page. Served by the
 * read-only contributions-service (a BFF composing content + earnings).
 *
 * Endpoint: GET /v1/creator/contributions (owner-scoped via Cognito; no userId param)
 *
 * @version 1.0.0
 */

import { SuccessResponse, ErrorResponse } from '@tutenet/client-core';

export { SuccessResponse, ErrorResponse };

// =============================================================================
// DOMAIN MODELS
// =============================================================================

/** Summary header — creator aggregate across all resources */
export interface ContributionsSummary {
  /** Total accrued earnings (NOT withdrawable — labeled as accrued) */
  totalAccruedEarnings: number;
  /** Total number of completed sales across all resources */
  totalPurchases: number;
  /** Currency code */
  currency: 'INR';
  /** Platform-fixed creator share percentage (currently 80) */
  creatorEarningsPercent: number;
  /** Total resources returned in the current page window */
  resourceCount: number;
  /** Resources in "published" status in the current page window */
  publishedCount: number;
}

/** One row in the per-resource performance list */
export interface ContributionItem {
  resourceId: string;
  title: string;
  /** Price (null = free resource) */
  price: number | null;
  /** Lifecycle status */
  status: string;
  /** Public credibility signal */
  purchaseCount: number;
  /** Public credibility signal (may lag until per-resource counter is wired) */
  downloads: number;
  /** Public credibility signal */
  upvotes: number;
  /** Private, owner-scoped accrued earnings (0 if no sales) */
  accruedEarnings: number;
  revoked: boolean;
  /** ISO 8601 */
  createdAt: string;
  /**
   * Moderator's reason when `status === 'rejected'`. Owner-scoped and safe
   * here (this endpoint is Cognito-identity resolved, no cross-user param).
   * Absent for any non-rejected status.
   */
  rejectionReason?: string;
}

// =============================================================================
// REQUEST TYPES
// =============================================================================

/** Query parameters for GET /v1/creator/contributions */
export interface GetContributionsParams {
  /** Pagination cursor */
  cursor?: string;
  /** Page size (default 20, max 100) */
  limit?: number;
}

// =============================================================================
// RESPONSE DATA TYPES (the 'data' field)
// =============================================================================

/** Page-shaped Contributions response data */
export interface ContributionsResponseData {
  summary: ContributionsSummary;
  items: ContributionItem[];
  nextCursor?: string;
  hasMore: boolean;
}

// =============================================================================
// FULL API RESPONSE TYPES
// =============================================================================

/** GET /v1/creator/contributions response */
export type GetContributionsApiResponse =
  | SuccessResponse<ContributionsResponseData>
  | ErrorResponse;
