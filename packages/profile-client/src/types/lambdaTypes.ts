/**
 * Lambda invocation types
 * 
 * These types are temporary and should eventually come from @tutenet/shared
 * when proper package linking between TuteNetClient and TuteNetCDK is established.
 */

/**
 * Service name identifier for DirectInvocationPayload
 */
export type ServiceName = string;

/**
 * Common service names
 */
export const SERVICE_NAMES = {
  AUTH_SERVICE: 'auth-service',
  PROFILE_SERVICE: 'profile-service',
  UPLOAD_SERVICE: 'upload-service',
  RESOURCE_SERVICE: 'resource-service',
  NOTIFICATION_SERVICE: 'notification-service',
  ANALYTICS_SERVICE: 'analytics-service',
} as const;

/**
 * Payload structure for direct Lambda-to-Lambda invocations
 * 
 * This payload is used when one Lambda function directly invokes another
 * using AWS SDK InvokeCommand, bypassing API Gateway.
 * 
 * @template TBody - Type of the request body
 */
export interface DirectInvocationPayload<TBody = unknown> {
  /** Service context metadata for authorization and tracing */
  readonly serviceContext: {
    /** Invocation type discriminator (always 'direct' for Lambda invocations) */
    readonly invocationType: 'direct';
    
    /** Name of the calling service (e.g., 'auth-service') */
    readonly callingService: ServiceName;
    
    /** Unique request ID for distributed tracing */
    readonly requestId: string;
    
    /** User ID if operation is on behalf of a user (optional) */
    readonly userId?: string;
    
    /** User email if available (optional) */
    readonly email?: string;
    
    /** Original user context if operating as another user (optional) */
    readonly originalUser?: {
      readonly userId: string;
      readonly email?: string;
      readonly roles?: string[];
    };
  };
  
  /** Request body containing the actual operation data */
  readonly body: TBody;
}
