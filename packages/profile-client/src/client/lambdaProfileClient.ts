/**
 * Lambda Profile Client - Direct Lambda-to-Lambda invocation implementation
 * 
 * This client invokes Profile Service Lambda functions directly using AWS SDK,
 * bypassing API Gateway for internal service-to-service communication.
 * 
 * Key features:
 * - Direct Lambda invocation via AWS SDK InvokeCommand
 * - Automatic DirectInvocationPayload construction
 * - Request ID generation and tracing
 * - Debug logging support
 * - Error handling and AWS SDK error wrapping
 * 
 * @see {@link IProfileClient} for the interface contract
 * @see {@link createProfileClientFromEnv} for factory function with auto-detection
 */

import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { ClientError } from '@tutenet/client-core';
import { IProfileClient } from './IProfileClient';
import {
  CreateProfileFromRegistrationRequest,
  CreateProfileFromRegistrationApiResponse,
  GetProfileRequest,
  GetProfileApiResponse,
  UpdateProfileRequestData,
  UpdateProfileApiResponse,
  UploadAvatarRequest,
  UploadAvatarApiResponse,
  ValidateStatisticsRequest,
  ValidateStatisticsApiResponse,
} from '../types';
import { 
  DirectInvocationPayload, 
  ServiceName 
} from '@tutenet/shared';

/**
 * Request configuration for Lambda client operations
 * 
 * Simplified version of RequestConfig for Lambda invocations.
 * Unlike HTTP requests, Lambda invocations don't use most HTTP-specific options.
 */
export interface RequestConfig {
  /** Request ID for tracing (auto-generated if not provided) */
  requestId?: string;
  /** Request timeout in milliseconds (currently not used but kept for compatibility) */
  timeout?: number;
  /** Custom headers (not used in Lambda invocations but kept for interface compatibility) */
  headers?: Record<string, string>;
}

/**
 * Configuration for LambdaProfileClient
 */
export interface LambdaProfileClientConfig {
  /** AWS SDK Lambda client instance */
  lambdaClient: LambdaClient;
  
  /** Lambda function ARNs for each operation */
  functionArns: {
    /** ARN for createProfileFromRegistration Lambda (required) */
    createProfileFromRegistration: string;
    /** ARN for getProfile Lambda (optional) */
    getProfile?: string;
    /** ARN for updateProfile Lambda (optional) */
    updateProfile?: string;
    /** ARN for uploadAvatar Lambda (optional) */
    uploadAvatar?: string;
    /** ARN for validateStatistics Lambda (optional) */
    validateStatistics?: string;
  };
  
  /** Calling service identifier for DirectInvocationPayload */
  callingService: ServiceName;
  
  /** Enable debug logging (default: false) */
  debug?: boolean;
}

/**
 * Lambda Profile Client
 * 
 * Implements IProfileClient interface using direct Lambda-to-Lambda invocation.
 * 
 * @example
 * ```typescript
 * import { LambdaClient } from '@aws-sdk/client-lambda';
 * import { SERVICE_NAMES } from '@tutenet/shared';
 * 
 * const lambdaClient = new LambdaClient({ region: 'ap-south-1' });
 * 
 * const client = new LambdaProfileClient({
 *   lambdaClient,
 *   functionArns: {
 *     createProfileFromRegistration: process.env.PROFILE_CREATE_LAMBDA_ARN!,
 *     getProfile: process.env.PROFILE_GET_LAMBDA_ARN,
 *   },
 *   callingService: SERVICE_NAMES.AUTH_SERVICE,
 *   debug: true
 * });
 * 
 * const profile = await client.createProfileFromRegistration({
 *   userId: 'user-123',
 *   email: 'user@example.com',
 *   firstName: 'John',
 *   lastName: 'Doe'
 * }, { requestId: 'req-123' });
 * ```
 */
export class LambdaProfileClient implements IProfileClient {
  private readonly lambdaClient: LambdaClient;
  private readonly functionArns: LambdaProfileClientConfig['functionArns'];
  private readonly callingService: ServiceName;
  private readonly debug: boolean;

  /**
   * Create a new LambdaProfileClient
   * 
   * @param config - Client configuration
   * @throws {Error} If createProfileFromRegistration ARN is not provided
   */
  constructor(config: LambdaProfileClientConfig) {
    this.lambdaClient = config.lambdaClient;
    this.functionArns = config.functionArns;
    this.callingService = config.callingService;
    this.debug = config.debug ?? false;

    // Validate at least one ARN is provided
    if (!this.functionArns.createProfileFromRegistration && !this.functionArns.getProfile) {
      throw new Error('At least one Lambda ARN (createProfileFromRegistration or getProfile) is required');
    }

    if (this.debug) {
      console.debug('[LambdaProfileClient] Initialized', {
        callingService: this.callingService,
        hasCreateProfile: !!this.functionArns.createProfileFromRegistration,
        hasGetProfile: !!this.functionArns.getProfile,
        hasUpdateProfile: !!this.functionArns.updateProfile,
        hasUploadAvatar: !!this.functionArns.uploadAvatar,
        hasValidateStatistics: !!this.functionArns.validateStatistics,
      });
    }
  }

  /**
   * Create profile from registration data (internal operation)
   * 
   * @implements {IProfileClient.createProfileFromRegistration}
   */
  async createProfileFromRegistration(
    data: CreateProfileFromRegistrationRequest,
    config?: RequestConfig
  ): Promise<CreateProfileFromRegistrationApiResponse> {
    if (!this.functionArns.createProfileFromRegistration) {
      throw new Error('createProfileFromRegistration Lambda ARN not configured');
    }

    return this.invokeLambda<
      CreateProfileFromRegistrationRequest,
      CreateProfileFromRegistrationApiResponse
    >(
      'createProfileFromRegistration',
      this.functionArns.createProfileFromRegistration,
      data,
      {
        userId: data.userId,
        email: data.email,
      },
      config
    );
  }

  /**
   * Get user profile by ID
   * 
   * @implements {IProfileClient.getProfile}
   */
  async getProfile(
    userId: string,
    options?: Omit<GetProfileRequest, 'userId'>,
    config?: RequestConfig
  ): Promise<GetProfileApiResponse> {
    if (!this.functionArns.getProfile) {
      throw new Error('getProfile Lambda ARN not configured');
    }

    return this.invokeLambda<any, GetProfileApiResponse>(
      'getProfile',
      this.functionArns.getProfile,
      { userId, ...options },
      { userId },
      config
    );
  }

  /**
   * Update user profile
   * 
   * @implements {IProfileClient.updateProfile}
   */
  async updateProfile(
    userId: string,
    updates: UpdateProfileRequestData,
    config?: RequestConfig
  ): Promise<UpdateProfileApiResponse> {
    if (!this.functionArns.updateProfile) {
      throw new Error('updateProfile Lambda ARN not configured');
    }

    return this.invokeLambda<any, UpdateProfileApiResponse>(
      'updateProfile',
      this.functionArns.updateProfile,
      { ...updates, userId }, // Spread first, then userId to ensure it's set correctly
      { userId },
      config
    );
  }

  /**
   * Upload user avatar image
   * 
   * @implements {IProfileClient.uploadAvatar}
   */
  async uploadAvatar(
    userId: string,
    request: UploadAvatarRequest,
    config?: RequestConfig
  ): Promise<UploadAvatarApiResponse> {
    if (!this.functionArns.uploadAvatar) {
      throw new Error('uploadAvatar Lambda ARN not configured');
    }

    return this.invokeLambda<any, UploadAvatarApiResponse>(
      'uploadAvatar',
      this.functionArns.uploadAvatar,
      { userId, ...request },
      { userId },
      config
    );
  }

  /**
   * Validate and refresh user statistics
   * 
   * @implements {IProfileClient.validateStatistics}
   */
  async validateStatistics(
    userId: string,
    options?: Omit<ValidateStatisticsRequest, 'userId'>,
    config?: RequestConfig
  ): Promise<ValidateStatisticsApiResponse> {
    if (!this.functionArns.validateStatistics) {
      throw new Error('validateStatistics Lambda ARN not configured');
    }

    return this.invokeLambda<any, ValidateStatisticsApiResponse>(
      'validateStatistics',
      this.functionArns.validateStatistics,
      { userId, ...options },
      { userId },
      config
    );
  }

  /**
   * Core Lambda invocation logic (private helper)
   * 
   * Constructs DirectInvocationPayload, invokes Lambda via AWS SDK,
   * handles errors, and returns typed response.
   * 
   * @param operationName - Name of the operation for logging
   * @param functionArn - Lambda function ARN to invoke
   * @param body - Request body to send
   * @param contextData - Data for serviceContext (userId, email)
   * @param config - Optional request configuration
   * @returns Promise resolving to typed response
   * @throws {ClientError} If invocation fails
   */
  private async invokeLambda<TRequest, TResponse>(
    operationName: string,
    functionArn: string,
    body: TRequest,
    contextData: { userId?: string; email?: string },
    config?: RequestConfig
  ): Promise<TResponse> {
    const requestId = config?.requestId || this.generateRequestId();

    if (this.debug) {
      console.debug(`[LambdaProfileClient] Invoking ${operationName}`, {
        functionArn,
        requestId,
        ...contextData,
      });
    }

    try {
      // Construct DirectInvocationPayload
      const payload: DirectInvocationPayload<TRequest> = {
        serviceContext: {
          invocationType: 'direct',
          callingService: this.callingService,
          requestId,
          userId: contextData.userId,
          email: contextData.email,
        },
        body,
      };

      // Invoke Lambda via AWS SDK
      const command = new InvokeCommand({
        FunctionName: functionArn,
        InvocationType: 'RequestResponse', // Synchronous
        Payload: JSON.stringify(payload),
      });

      const response = await this.lambdaClient.send(command);

      // Check for Lambda execution errors
      if (response.FunctionError) {
        const errorPayload = response.Payload 
          ? JSON.parse(new TextDecoder().decode(response.Payload))
          : {};
        throw new Error(
          `Lambda function error: ${response.FunctionError} - ${JSON.stringify(errorPayload)}`
        );
      }

      // Check for missing payload
      if (!response.Payload) {
        throw new Error('Lambda invocation returned no payload');
      }

      // Decode and parse response
      const payloadString = new TextDecoder().decode(response.Payload);
      const rawResult = JSON.parse(payloadString);

      if (this.debug) {
        console.debug(`[LambdaProfileClient] ${operationName} completed`, {
          requestId,
          statusCode: response.StatusCode,
        });
      }

      // Direct Lambda invocation returns raw business logic result.
      // Wrap in SuccessResponse format to match the IProfileClient interface contract
      // (which expects {success: true, data: ...} like the HTTP client returns).
      // If the result already has a 'success' field, it's already wrapped (shouldn't happen
      // for direct invocations but handle gracefully).
      if (rawResult && typeof rawResult === 'object' && 'success' in rawResult) {
        return rawResult as TResponse;
      }

      return { success: true, data: rawResult } as TResponse;
    } catch (error) {
      if (this.debug) {
        console.error(`[LambdaProfileClient] ${operationName} failed`, {
          error: error instanceof Error ? error.message : String(error),
          requestId,
        });
      }
      throw this.handleLambdaError(error, operationName, requestId);
    }
  }

  /**
   * Generate unique request ID for tracing
   * 
   * Format: timestamp-random
   * Example: 1704652800000-abc123xyz
   * 
   * @returns Unique request ID
   */
  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }

  /**
   * Convert errors to ClientError format
   * 
   * Wraps AWS SDK errors and other errors in consistent ClientError format
   * for uniform error handling across the application.
   * 
   * @param error - Original error
   * @param operation - Operation name
   * @param requestId - Request ID for tracing
   * @returns ClientError instance
   */
  private handleLambdaError(
    error: any,
    operation: string,
    requestId: string
  ): ClientError {
    if (error instanceof ClientError) {
      return error;
    }

    return new ClientError(
      `Lambda ${operation} failed: ${error.message || String(error)}`,
      error.code || 'LAMBDA_INVOCATION_ERROR',
      error.statusCode || 500,
      error.details,
      requestId
    );
  }
}
