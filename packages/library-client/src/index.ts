/**
 * TuteNet Library Client
 *
 * TypeScript client library for the TuteNet Library Service API.
 * Provides type-safe methods for managing a teacher's personal library,
 * including items, collections, curriculum placement, and state management.
 *
 * @example
 * ```typescript
 * import { LibraryClient } from '@tutenet/library-client';
 * import { Environment } from '@tutenet/client-core';
 *
 * const client = new LibraryClient({
 *   environment: Environment.STAGING,
 *   accessToken: 'your-jwt-token',
 * });
 *
 * // List active library items
 * const items = await client.getLibraryItems({ state: 'active', limit: 20 });
 *
 * // Save a resource
 * const saved = await client.saveToLibrary({ resourceId: 'res-123' });
 *
 * // Manage collections
 * const collection = await client.createCollection({ name: 'Exam Prep' });
 * await client.addToCollection(collection.data.collectionId, { resourceId: 'res-123' });
 * ```
 *
 * @author TuteNet Backend Team
 * @version 1.0.0
 */

// Re-export everything
export * from './client';
export * from './types';

// Re-export core types commonly used with this client
export { Environment, ApiType } from '@tutenet/client-core';
export type { ClientConfig, ClientError } from '@tutenet/client-core';

// Default export for convenience
export { LibraryClient as default } from './client/libraryClient';
