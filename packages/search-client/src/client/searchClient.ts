/**
 * TuteNet Search Service Client
 * 
 * TypeScript client for the TuteNet Search Service API.
 * Provides unified search for resources and teachers, dedicated teacher search,
 * and search suggestions/autocomplete.
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
  SearchParams,
  TeacherSearchParams,
  SuggestionsParams,
  UnifiedSearchResponse,
  ResourceSearchResponse,
  TeacherSearchResponse,
  SuggestionsResponse,
} from '../types';

/** Search client configuration options */
export interface SearchClientConfig {
  environment?: Environment;
  baseUrl?: string;
  timeout?: number;
  retries?: number;
  accessToken?: string;
}

/**
 * TuteNet Search Service Client
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
 * // Unified search (resources + teachers)
 * const results = await client.search({ q: 'algebra', type: 'all' });
 * 
 * // Teacher search
 * const teachers = await client.searchTeachers({ q: 'Pankaj' });
 * 
 * // Suggestions
 * const suggestions = await client.getSuggestions({ prefix: 'mat' });
 * ```
 */
export class SearchClient extends BaseClient {
  constructor(config: SearchClientConfig = {}) {
    const environment = config.environment || detectEnvironment();

    const clientConfig: ClientConfig = {
      environment,
      apiType: ApiType.EXTERNAL,
      timeout: config.timeout || 10000,
      retries: config.retries || 1,
      authToken: config.accessToken,
    };

    super(clientConfig);
  }

  /**
   * Unified search — returns resources and/or teachers based on `type` parameter.
   * 
   * GET /v1/search?q=...&type=all|resources|teachers&subject=...&sort=...&limit=...&cursor=...
   */
  async search(params: SearchParams): Promise<UnifiedSearchResponse | ResourceSearchResponse | TeacherSearchResponse> {
    const queryParams = this.buildSearchQueryParams(params);

    if (params.type === 'all' || !params.type) {
      return this.get<UnifiedSearchResponse>(`/search?${queryParams}`);
    } else if (params.type === 'resources') {
      return this.get<ResourceSearchResponse>(`/search?${queryParams}`);
    } else {
      return this.get<TeacherSearchResponse>(`/search?${queryParams}`);
    }
  }

  /**
   * Search resources only.
   * 
   * GET /v1/search?type=resources&q=...
   */
  async searchResources(params: Omit<SearchParams, 'type'>): Promise<ResourceSearchResponse> {
    const queryParams = this.buildSearchQueryParams({ ...params, type: 'resources' });
    return this.get<ResourceSearchResponse>(`/search?${queryParams}`);
  }

  /**
   * Search teachers — dedicated endpoint.
   * 
   * GET /v1/search/teachers?q=...&subject=...&sort=...&limit=...&cursor=...
   */
  async searchTeachers(params: TeacherSearchParams): Promise<TeacherSearchResponse> {
    const queryParams = this.buildTeacherQueryParams(params);
    return this.get<TeacherSearchResponse>(`/search/teachers?${queryParams}`);
  }

  /**
   * Get search suggestions/autocomplete.
   * 
   * GET /v1/search/suggestions?prefix=...
   */
  async getSuggestions(params: SuggestionsParams): Promise<SuggestionsResponse> {
    const queryParams = new URLSearchParams({ prefix: params.prefix }).toString();
    return this.get<SuggestionsResponse>(`/search/suggestions?${queryParams}`);
  }

  /**
   * Build URL query string from search parameters
   */
  private buildSearchQueryParams(params: SearchParams): string {
    const searchParams = new URLSearchParams();

    if (params.q) searchParams.set('q', params.q);
    if (params.type) searchParams.set('type', params.type);
    if (params.subject) searchParams.set('subject', params.subject);
    if (params.grades) searchParams.set('grades', params.grades);
    if (params.language) searchParams.set('language', params.language);
    if (params.sort) searchParams.set('sort', params.sort);
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.cursor) searchParams.set('cursor', params.cursor);

    return searchParams.toString();
  }

  /**
   * Build URL query string from teacher search parameters
   */
  private buildTeacherQueryParams(params: TeacherSearchParams): string {
    const searchParams = new URLSearchParams();

    if (params.q) searchParams.set('q', params.q);
    if (params.subject) searchParams.set('subject', params.subject);
    if (params.sort) searchParams.set('sort', params.sort);
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.cursor) searchParams.set('cursor', params.cursor);

    return searchParams.toString();
  }
}
