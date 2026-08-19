/**
 * TuteNet Search Client
 * 
 * TypeScript client library for the TuteNet Search Service API.
 * Provides unified search for resources and teachers, dedicated teacher search,
 * and search suggestions/autocomplete.
 * 
 * @example
 * ```typescript
 * import { SearchClient } from '@tutenet/search-client';
 * 
 * const client = new SearchClient({
 *   environment: Environment.STAGING,
 *   accessToken: 'your-jwt-token',
 * });
 * 
 * // Unified search
 * const results = await client.search({ q: 'algebra', type: 'all' });
 * 
 * // Teacher search
 * const teachers = await client.searchTeachers({ q: 'Pankaj', subject: 'Mathematics' });
 * 
 * // Suggestions
 * const suggestions = await client.getSuggestions({ prefix: 'mat' });
 * ```
 * 
 * @version 1.0.0
 */

export * from './client';
export * from './types';

export { SearchClient as default } from './client/searchClient';
