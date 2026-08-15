/**
 * TuteNet Library Service Client
 *
 * TypeScript client for the Library Service API.
 * Provides type-safe methods for managing a teacher's personal library:
 * items, collections, curriculum placement, and state management.
 *
 * @version 1.0.0
 */

import {
  BaseClient,
  ClientConfig,
  Environment,
  ApiType,
  detectEnvironment,
} from '@tutenet/client-core';
import {
  GetLibraryItemsParams,
  GetLibraryItemsApiResponse,
  SaveToLibraryRequest,
  SaveToLibraryApiResponse,
  RemoveFromLibraryApiResponse,
  UpdatePlacementRequest,
  UpdatePlacementApiResponse,
  UpdateStateRequest,
  UpdateStateApiResponse,
  GetCollectionsApiResponse,
  CreateCollectionRequest,
  CreateCollectionApiResponse,
  DeleteCollectionApiResponse,
  AddToCollectionRequest,
  AddToCollectionApiResponse,
  RemoveFromCollectionApiResponse,
} from '../types';

/** Library client configuration options */
export interface LibraryClientConfig {
  environment?: Environment;
  timeout?: number;
  retries?: number;
  accessToken?: string;
  debug?: boolean;
}

/**
 * TuteNet Library Service Client
 *
 * Main client class for interacting with the Library Service API.
 *
 * @example
 * ```typescript
 * import { LibraryClient } from '@tutenet/library-client';
 * import { Environment } from '@tutenet/client-core';
 *
 * const client = new LibraryClient({
 *   environment: Environment.STAGING,
 *   accessToken: 'jwt-token',
 * });
 *
 * // List active library items
 * const response = await client.getLibraryItems({ state: 'active' });
 * if (response.success) {
 *   console.log(response.data.items);
 * }
 * ```
 */
export class LibraryClient extends BaseClient {
  constructor(config: LibraryClientConfig = {}) {
    const environment = config.environment || detectEnvironment();

    const clientConfig: ClientConfig = {
      environment,
      apiType: ApiType.EXTERNAL,
      timeout: config.timeout,
      retries: config.retries,
      authToken: config.accessToken,
      debug: config.debug,
    };

    super(clientConfig);
  }

  // =========================================================================
  // Library Items
  // =========================================================================

  /**
   * Get paginated library items for the authenticated user.
   *
   * @param params - Optional filter and pagination parameters
   * @returns Paginated list of library items
   */
  async getLibraryItems(params?: GetLibraryItemsParams): Promise<GetLibraryItemsApiResponse> {
    const queryParams = new URLSearchParams();

    if (params) {
      if (params.source) queryParams.append('source', params.source);
      if (params.state) queryParams.append('state', params.state);
      if (params.cursor) queryParams.append('cursor', params.cursor);
      if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
    }

    const url = `/library${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.get<GetLibraryItemsApiResponse>(url);
  }

  /**
   * Save a resource to the authenticated user's library.
   *
   * @param request - Resource ID to save
   * @returns Created library item (201) or error (409 if duplicate)
   */
  async saveToLibrary(request: SaveToLibraryRequest): Promise<SaveToLibraryApiResponse> {
    return this.post<SaveToLibraryApiResponse>('/library', request);
  }

  /**
   * Remove a saved resource from the library.
   * Only items with source="saved" can be removed (403 otherwise).
   *
   * @param resourceId - Resource ID to remove
   * @returns Success message (204 equivalent) or error
   */
  async removeFromLibrary(resourceId: string): Promise<RemoveFromLibraryApiResponse> {
    return this.delete<RemoveFromLibraryApiResponse>(`/library/${resourceId}`);
  }

  /**
   * Update the curriculum placement for a library item.
   *
   * @param resourceId - Resource ID to update
   * @param request - New placement ("subject/chapter/topic") or null to unset
   * @returns Updated library item
   */
  async updatePlacement(
    resourceId: string,
    request: UpdatePlacementRequest
  ): Promise<UpdatePlacementApiResponse> {
    return this.patch<UpdatePlacementApiResponse>(`/library/${resourceId}/placement`, request);
  }

  /**
   * Update the state (active/archived) of a library item.
   *
   * @param resourceId - Resource ID to update
   * @param request - New state
   * @returns Updated library item
   */
  async updateState(
    resourceId: string,
    request: UpdateStateRequest
  ): Promise<UpdateStateApiResponse> {
    return this.patch<UpdateStateApiResponse>(`/library/${resourceId}/state`, request);
  }

  // =========================================================================
  // Collections
  // =========================================================================

  /**
   * Get all collections for the authenticated user.
   *
   * @returns List of collections
   */
  async getCollections(): Promise<GetCollectionsApiResponse> {
    return this.get<GetCollectionsApiResponse>('/library/collections');
  }

  /**
   * Create a new collection.
   *
   * @param request - Collection name and optional description
   * @returns Created collection (201) or error (409 if duplicate name)
   */
  async createCollection(request: CreateCollectionRequest): Promise<CreateCollectionApiResponse> {
    return this.post<CreateCollectionApiResponse>('/library/collections', request);
  }

  /**
   * Delete a collection. Removes the collection ID from all associated items.
   *
   * @param collectionId - Collection to delete
   * @returns Success message (204 equivalent) or error
   */
  async deleteCollection(collectionId: string): Promise<DeleteCollectionApiResponse> {
    return this.delete<DeleteCollectionApiResponse>(`/library/collections/${collectionId}`);
  }

  /**
   * Add a library item to a collection.
   *
   * @param collectionId - Target collection
   * @param request - Resource ID to add
   * @returns Updated library item with new collectionIds
   */
  async addToCollection(
    collectionId: string,
    request: AddToCollectionRequest
  ): Promise<AddToCollectionApiResponse> {
    return this.post<AddToCollectionApiResponse>(
      `/library/collections/${collectionId}/items`,
      request
    );
  }

  /**
   * Remove a library item from a collection.
   *
   * @param collectionId - Collection to remove from
   * @param resourceId - Resource ID to remove
   * @returns Success message (204 equivalent) or error
   */
  async removeFromCollection(
    collectionId: string,
    resourceId: string
  ): Promise<RemoveFromCollectionApiResponse> {
    return this.delete<RemoveFromCollectionApiResponse>(
      `/library/collections/${collectionId}/items/${resourceId}`
    );
  }

  // =========================================================================
  // Utility
  // =========================================================================

  /** Set authentication token for subsequent requests */
  setAccessToken(token: string): void {
    (this.config as any).authToken = token;
  }

  /** Clear authentication token */
  clearAccessToken(): void {
    delete (this.config as any).authToken;
  }
}
