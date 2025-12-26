/**
 * Factory functions for creating Profile Service clients
 */

import { 
  Environment, 
  ApiType, 
  ClientConfig, 
  detectEnvironment 
} from '@tutenet/client-core';
import { ProfileClient } from './profileClient';

/**
 * Create Profile Service client with custom configuration
 */
export function createProfileClient(
  environment: Environment,
  apiType: ApiType = ApiType.EXTERNAL,
  options?: Partial<ClientConfig>
): ProfileClient {
  const config: ClientConfig = {
    environment,
    apiType,
    ...options,
  };

  return new ProfileClient(config);
}

/**
 * Create external (public) Profile Service client
 */
export function createExternalProfileClient(
  environment: Environment,
  options?: Partial<ClientConfig>
): ProfileClient {
  return createProfileClient(environment, ApiType.EXTERNAL, options);
}

/**
 * Create internal Profile Service client
 */
export function createInternalProfileClient(
  environment: Environment,
  options?: Partial<ClientConfig>
): ProfileClient {
  return createProfileClient(environment, ApiType.INTERNAL, options);
}

/**
 * Create Profile Service client with auto-detected environment
 */
export function createAutoProfileClient(
  apiType: ApiType = ApiType.EXTERNAL,
  options?: Partial<ClientConfig>
): ProfileClient {
  const environment = detectEnvironment();
  return createProfileClient(environment, apiType, options);
}

/**
 * Create Profile Service client for testing
 */
export function createTestProfileClient(
  options?: Partial<ClientConfig>
): ProfileClient {
  return createProfileClient(Environment.DEVELOPMENT, ApiType.EXTERNAL, {
    debug: true,
    timeout: 5000,
    retries: 0,
    ...options,
  });
}