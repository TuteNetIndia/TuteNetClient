/**
 * TuteNet Contributions Client
 *
 * TypeScript client for the TuteNet Contributions Service — the read-only BFF
 * backing the "Contributions & Earnings" page (content performance + earnings).
 *
 * @example
 * ```typescript
 * import { ContributionsClient } from '@tutenet/contributions-client';
 * import { Environment } from '@tutenet/client-core';
 *
 * const client = new ContributionsClient({
 *   environment: Environment.STAGING,
 *   accessToken: 'your-jwt-token',
 * });
 *
 * const page = await client.getContributions({ limit: 20 });
 * ```
 *
 * @author TuteNet Backend Team
 * @version 1.0.0
 */

export * from './client';
export * from './types';

export { Environment, ApiType } from '@tutenet/client-core';
export type { ClientConfig, ClientError } from '@tutenet/client-core';

export { ContributionsClient as default } from './client/contributionsClient';
