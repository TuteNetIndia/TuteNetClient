/**
 * TuteNet Contributions Service Client
 *
 * Type-safe client for the "Contributions & Earnings" page. Wraps the read-only
 * contributions-service BFF endpoint that composes content performance + earnings.
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
  GetContributionsParams,
  GetContributionsApiResponse,
} from '../types';

/** Contributions client configuration options */
export interface ContributionsClientConfig {
  environment?: Environment;
  timeout?: number;
  retries?: number;
  accessToken?: string;
  debug?: boolean;
}

/**
 * TuteNet Contributions Service Client
 *
 * @example
 * ```typescript
 * import { ContributionsClient } from '@tutenet/contributions-client';
 * import { Environment } from '@tutenet/client-core';
 *
 * const client = new ContributionsClient({
 *   environment: Environment.STAGING,
 *   accessToken: 'jwt-token',
 * });
 *
 * const response = await client.getContributions({ limit: 20 });
 * if (response.success) {
 *   console.log(response.data.summary.totalAccruedEarnings);
 *   console.log(response.data.items);
 * }
 * ```
 */
export class ContributionsClient extends BaseClient {
  constructor(config: ContributionsClientConfig = {}) {
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

  /**
   * Get the authenticated creator's Contributions & Earnings page (owner-scoped).
   *
   * The endpoint resolves the subject from the auth token — there is no userId param.
   *
   * @param params - Optional pagination parameters
   * @returns Page-shaped contributions data (summary + items + cursor)
   */
  async getContributions(
    params?: GetContributionsParams,
  ): Promise<GetContributionsApiResponse> {
    const queryParams = new URLSearchParams();

    if (params) {
      if (params.cursor) queryParams.append('cursor', params.cursor);
      if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
    }

    const url = `/creator/contributions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.get<GetContributionsApiResponse>(url);
  }

  /** Set authentication token for subsequent requests */
  setAccessToken(token: string): void {
    (this.config as { authToken?: string }).authToken = token;
  }

  /** Clear authentication token */
  clearAccessToken(): void {
    delete (this.config as { authToken?: string }).authToken;
  }
}
