/**
 * Factory functions for creating Profile Service clients
 */

import { LambdaClient } from '@aws-sdk/client-lambda';
import { 
  Environment, 
  ApiType, 
  ClientConfig, 
  detectEnvironment 
} from '@tutenet/client-core';
import { SERVICE_NAMES, ServiceName } from '@tutenet/shared';
import { IProfileClient } from './IProfileClient';
import { ProfileClient } from './profileClient';
import { LambdaProfileClient } from './lambdaProfileClient';

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

/**
 * Create Profile Service client with automatic implementation selection based on environment.
 * 
 * This factory function automatically detects the runtime environment and creates the appropriate
 * client implementation:
 * - **Lambda Environment**: If PROFILE_CREATE_LAMBDA_ARN is set, creates LambdaProfileClient for
 *   direct Lambda-to-Lambda invocation via AWS SDK
 * - **HTTP Environment**: Otherwise, creates HttpProfileClient for REST API calls via HTTP
 * 
 * This enables seamless switching between Lambda direct invocation (for internal service-to-service
 * communication) and HTTP-based API calls (for external clients or local development) without
 * changing business logic code.
 * 
 * **Decision Logic:**
 * 1. Check if `PROFILE_CREATE_LAMBDA_ARN` environment variable exists
 * 2. If yes → Create LambdaClient with region from AWS_REGION/REGION (default: 'ap-south-1')
 * 3. If yes → Return new LambdaProfileClient with all detected Lambda ARNs
 * 4. If no → Detect environment (dev/staging/prod) or use provided value
 * 5. If no → Return new HttpProfileClient (ProfileClient) with detected/provided config
 * 
 * **Lambda ARN Environment Variables:**
 * - `PROFILE_CREATE_LAMBDA_ARN` (required for Lambda mode) - Create profile Lambda ARN
 * - `PROFILE_GET_LAMBDA_ARN` (optional) - Get profile Lambda ARN
 * - `PROFILE_UPDATE_LAMBDA_ARN` (optional) - Update profile Lambda ARN
 * - `PROFILE_UPLOAD_AVATAR_LAMBDA_ARN` (optional) - Upload avatar Lambda ARN
 * - `PROFILE_VALIDATE_STATISTICS_LAMBDA_ARN` (optional) - Validate statistics Lambda ARN
 * 
 * **Region Detection (for Lambda mode):**
 * - First checks `AWS_REGION` environment variable
 * - Then checks `REGION` environment variable
 * - Defaults to `'ap-south-1'` if neither is set
 * 
 * @param callingService - Service identifier for Lambda invocations (e.g., 'auth-service', 'upload-service')
 *                        Used in DirectInvocationPayload.serviceContext.callingService for request tracing
 *                        Should use values from SERVICE_NAMES constants (e.g., SERVICE_NAMES.AUTH_SERVICE)
 * 
 * @param options - Optional configuration overrides
 * @param options.environment - Environment override (DEVELOPMENT, STAGING, PRODUCTION)
 *                             Only used in HTTP mode when PROFILE_CREATE_LAMBDA_ARN is not set
 *                             If not provided, auto-detects from NODE_ENV or ENVIRONMENT variables
 * @param options.apiType - API type override (EXTERNAL)
 *                         Only used in HTTP mode when PROFILE_CREATE_LAMBDA_ARN is not set
 *                         Defaults to ApiType.EXTERNAL if not provided
 * @param options.debug - Enable debug logging for requests and responses
 *                       Works for both Lambda and HTTP modes
 *                       Defaults to false if not provided
 * 
 * @returns IProfileClient - Abstract interface implemented by either LambdaProfileClient or HttpProfileClient
 *                          Consumers should only depend on the IProfileClient interface,
 *                          not the concrete implementation types
 * 
 * @example
 * ```typescript
 * // Example 1: Lambda environment (Auth Service calling Profile Service)
 * // Environment variables set:
 * //   AWS_REGION=ap-south-1
 * //   PROFILE_CREATE_LAMBDA_ARN=arn:aws:lambda:ap-south-1:123456789:function:dev-profile-create
 * //   PROFILE_GET_LAMBDA_ARN=arn:aws:lambda:ap-south-1:123456789:function:dev-profile-get
 * 
 * import { createProfileClientFromEnv } from '@tutenet/profile-client';
 * import { SERVICE_NAMES } from '@tutenet/shared';
 * 
 * const client = createProfileClientFromEnv(SERVICE_NAMES.AUTH_SERVICE, {
 *   debug: process.env.LOG_LEVEL === 'DEBUG'
 * });
 * // Returns: LambdaProfileClient (uses AWS SDK InvokeCommand for direct invocation)
 * 
 * const profile = await client.createProfileFromRegistration({
 *   userId: 'user-123',
 *   email: 'user@example.com',
 *   firstName: 'John',
 *   lastName: 'Doe'
 * });
 * ```
 * 
 * @example
 * ```typescript
 * // Example 2: Local development (no Lambda ARNs configured)
 * // Environment variables set:
 * //   NODE_ENV=development
 * //   (PROFILE_CREATE_LAMBDA_ARN not set)
 * 
 * import { createProfileClientFromEnv } from '@tutenet/profile-client';
 * import { SERVICE_NAMES } from '@tutenet/shared';
 * 
 * const client = createProfileClientFromEnv(SERVICE_NAMES.AUTH_SERVICE);
 * // Returns: HttpProfileClient (makes REST API calls via axios)
 * 
 * const profile = await client.getProfile('user-123');
 * ```
 * 
 * @example
 * ```typescript
 * // Example 3: Explicit configuration overrides for HTTP mode
 * import { Environment, ApiType } from '@tutenet/client-core';
 * 
 * const client = createProfileClientFromEnv(SERVICE_NAMES.UPLOAD_SERVICE, {
 *   environment: Environment.STAGING,
 *   apiType: ApiType.EXTERNAL,
 *   debug: true
 * });
 * // If no Lambda ARNs: Returns HttpProfileClient with staging external API
 * // If Lambda ARNs exist: Returns LambdaProfileClient (env/apiType ignored)
 * ```
 * 
 * @example
 * ```typescript
 * // Example 4: Using the abstract interface (strategy pattern)
 * import { IProfileClient } from '@tutenet/profile-client';
 * 
 * class AuthService {
 *   private profileClient: IProfileClient; // Interface type, not concrete
 * 
 *   constructor() {
 *     // Factory decides implementation based on environment
 *     this.profileClient = createProfileClientFromEnv(SERVICE_NAMES.AUTH_SERVICE);
 *   }
 * 
 *   async signUp(data: SignUpRequest) {
 *     // Works with either Lambda or HTTP implementation
 *     const profile = await this.profileClient.createProfileFromRegistration(data);
 *     return profile;
 *   }
 * }
 * ```
 * 
 * @see {@link IProfileClient} for the complete interface contract
 * @see {@link LambdaProfileClient} for Lambda implementation details (Task 2)
 * @see {@link ProfileClient} for HTTP implementation (existing)
 * 
 * @since 1.1.0 - Added for lambda-client-direct-invocation feature
 */
export function createProfileClientFromEnv(
  callingService: ServiceName,
  options?: {
    environment?: Environment;
    apiType?: ApiType;
    debug?: boolean;
  }
): IProfileClient {
  // Read Lambda ARN environment variables
  const createProfileLambdaArn = process.env.PROFILE_CREATE_LAMBDA_ARN;
  const getProfileLambdaArn = process.env.PROFILE_GET_LAMBDA_ARN;
  const updateProfileLambdaArn = process.env.PROFILE_UPDATE_LAMBDA_ARN;
  const uploadAvatarLambdaArn = process.env.PROFILE_UPLOAD_AVATAR_LAMBDA_ARN;
  const validateStatisticsLambdaArn = process.env.PROFILE_VALIDATE_STATISTICS_LAMBDA_ARN;

  // If any Lambda ARN exists, create Lambda client
  // PROFILE_CREATE_LAMBDA_ARN is the primary signal, but functions that only need
  // getProfile (signIn, getCurrentUser) will only have PROFILE_GET_LAMBDA_ARN.
  const primaryLambdaArn = createProfileLambdaArn || getProfileLambdaArn;
  if (primaryLambdaArn) {
    // Detect region from environment variables (default to 'ap-south-1')
    const region = process.env.AWS_REGION || process.env.REGION || 'ap-south-1';
    
    // Create new LambdaClient with detected region
    const lambdaClient = new LambdaClient({ region });

    // Return new LambdaProfileClient with all detected ARNs
    return new LambdaProfileClient({
      lambdaClient,
      functionArns: {
        createProfileFromRegistration: createProfileLambdaArn || '',
        getProfile: getProfileLambdaArn,
        updateProfile: updateProfileLambdaArn,
        uploadAvatar: uploadAvatarLambdaArn,
        validateStatistics: validateStatisticsLambdaArn,
      },
      callingService,
      debug: options?.debug,
    });
  }

  // If no Lambda ARNs exist, fall back to HTTP client
  // Detect environment and apiType (default to ApiType.EXTERNAL)
  const environment = options?.environment || detectEnvironment();
  const apiType = options?.apiType || ApiType.EXTERNAL;

  const config: ClientConfig = {
    environment,
    apiType,
    debug: options?.debug,
  };

  // Return new HttpProfileClient with ClientConfig
  return new ProfileClient(config);
}