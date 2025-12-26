/**
 * Factory functions for creating Profile Service clients
 */
import { Environment, ApiType, ClientConfig } from '@tutenet/client-core';
import { ProfileClient } from './profileClient';
/**
 * Create Profile Service client with custom configuration
 */
export declare function createProfileClient(environment: Environment, apiType?: ApiType, options?: Partial<ClientConfig>): ProfileClient;
/**
 * Create external (public) Profile Service client
 */
export declare function createExternalProfileClient(environment: Environment, options?: Partial<ClientConfig>): ProfileClient;
/**
 * Create internal Profile Service client
 */
export declare function createInternalProfileClient(environment: Environment, options?: Partial<ClientConfig>): ProfileClient;
/**
 * Create Profile Service client with auto-detected environment
 */
export declare function createAutoProfileClient(apiType?: ApiType, options?: Partial<ClientConfig>): ProfileClient;
/**
 * Create Profile Service client for testing
 */
export declare function createTestProfileClient(options?: Partial<ClientConfig>): ProfileClient;
//# sourceMappingURL=factory.d.ts.map