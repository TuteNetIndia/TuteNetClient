/**
 * TuteNet Resource Content Access Client
 * 
 * TypeScript client for the TuteNet Resource Content Access API with secure
 * app-only access to educational resource content.
 * 
 * @version 1.0.0
 */

import { 
  BaseClient, 
  ClientConfig, 
  Environment, 
  ApiType, 
  detectEnvironment 
} from '@tutenet/client-core';
import {
  ContentAccessType,
  ResourceContentAccessApiResponse,
} from '../types';

/** Access client configuration options */
export interface AccessClientConfig {
  environment?: Environment;
  useInternalApi?: boolean;
  baseUrl?: string;
  timeout?: number;
  retries?: number;
  accessToken?: string;
}

/**
 * TuteNet Resource Content Access Client
 * 
 * Client class for securely accessing educational resource content with
 * app-only restrictions and comprehensive security features.
 * 
 * Features:
 * - Secure content URL generation with app-specific tokens
 * - Multiple access types (view, stream, download)
 * - Shortened URL expiration for enhanced security
 * - Content metadata and viewing options
 * - Cache headers for optimal performance
 * 
 * @example Basic Usage
 * ```typescript
 * import { AccessClient } from '@tutenet/upload-client';
 * 
 * const client = new AccessClient({
 *   environment: Environment.STAGING,
 *   accessToken: 'your-jwt-token'
 * });
 * 
 * // Get secure content access URL
 * const response = await client.getContentAccess(
 *   'resource-123',
 *   ContentAccessType.VIEW
 * );
 * 
 * if (response.success) {
 *   const { contentUrl, expiresAt, viewingOptions } = response.data;
 *   // Use contentUrl in your app with proper validation
 * }
 * ```
 */
export class AccessClient extends BaseClient {
  constructor(config: AccessClientConfig = {}) {
    const environment = config.environment || detectEnvironment();
    const apiType = config.useInternalApi ? ApiType.INTERNAL : ApiType.EXTERNAL;
    
    const clientConfig: ClientConfig = {
      environment,
      apiType,
      timeout: config.timeout || 30000, // 30 second timeout for content access
      retries: config.retries || 2, // Fewer retries for time-sensitive operations
      authToken: config.accessToken,
    };
    
    super(clientConfig);
  }

  /**
   * Get secure content access URL for a resource
   * 
   * Generates a secure, app-restricted URL for accessing educational resource content.
   * The URL includes app-specific security parameters and has a shortened expiration time.
   * 
   * @param resourceId - The ID of the resource to access
   * @param accessType - Type of access (view, stream, download)
   * @returns Promise resolving to content access response
   * 
   * @example
   * ```typescript
   * // Get viewing access
   * const viewResponse = await client.getContentAccess(
   *   'resource-123',
   *   ContentAccessType.VIEW
   * );
   * 
   * // Get download access
   * const downloadResponse = await client.getContentAccess(
   *   'resource-123', 
   *   ContentAccessType.DOWNLOAD
   * );
   * 
   * // Get streaming access (for videos)
   * const streamResponse = await client.getContentAccess(
   *   'video-resource-456',
   *   ContentAccessType.STREAM
   * );
   * ```
   */
  async getContentAccess(
    resourceId: string,
    accessType: ContentAccessType
  ): Promise<ResourceContentAccessApiResponse> {
    const queryParams = new URLSearchParams({
      accessType: accessType.toString(),
    });
    
    return this.get<ResourceContentAccessApiResponse>(
      `/resources/${resourceId}/access?${queryParams.toString()}`
    );
  }

  /**
   * Validate app security parameters in a content URL
   * 
   * Client-side validation of security parameters to ensure the URL
   * was generated for the current app and user context.
   * 
   * @param contentUrl - The content URL to validate
   * @param expectedResourceId - Expected resource ID
   * @param expectedUserId - Expected user ID
   * @returns Validation result with details
   * 
   * @example
   * ```typescript
   * const validation = client.validateSecurityParams(
   *   contentUrl,
   *   'resource-123',
   *   'user-456'
   * );
   * 
   * if (!validation.isValid) {
   *   console.error('Security validation failed:', validation.reason);
   *   return;
   * }
   * 
   * // Safe to use the URL
   * ```
   */
  validateSecurityParams(
    contentUrl: string,
    expectedResourceId: string,
    expectedUserId: string
  ): {
    isValid: boolean;
    reason?: string;
    tokenData?: any;
  } {
    try {
      const url = new URL(contentUrl);
      
      // Check required security parameters
      const appToken = url.searchParams.get('app_token');
      const resourceId = url.searchParams.get('resource_id');
      const userId = url.searchParams.get('user_id');
      const appId = url.searchParams.get('app_id');
      
      if (!appToken) {
        return { isValid: false, reason: 'Missing app_token parameter' };
      }
      
      if (!resourceId) {
        return { isValid: false, reason: 'Missing resource_id parameter' };
      }
      
      if (!userId) {
        return { isValid: false, reason: 'Missing user_id parameter' };
      }
      
      if (!appId || appId !== 'tutenet_mobile') {
        return { isValid: false, reason: 'Invalid or missing app_id parameter' };
      }
      
      // Validate resource and user IDs match expected values
      if (resourceId !== expectedResourceId) {
        return { isValid: false, reason: 'Resource ID mismatch' };
      }
      
      if (userId !== expectedUserId) {
        return { isValid: false, reason: 'User ID mismatch' };
      }
      
      // Decode and validate app token
      try {
        const tokenData = JSON.parse(atob(appToken));
        
        // Check token expiration
        if (tokenData.expiresAt && Date.now() > tokenData.expiresAt) {
          return { isValid: false, reason: 'App token has expired' };
        }
        
        // Validate token data matches URL parameters
        if (tokenData.resourceId !== resourceId) {
          return { isValid: false, reason: 'Token resource ID mismatch' };
        }
        
        if (tokenData.teacherId !== userId) {
          return { isValid: false, reason: 'Token user ID mismatch' };
        }
        
        return { 
          isValid: true, 
          tokenData 
        };
        
      } catch (tokenError) {
        return { isValid: false, reason: 'Invalid app token format' };
      }
      
    } catch (error) {
      return { isValid: false, reason: 'Invalid URL format' };
    }
  }

  /**
   * Check if a content URL has expired
   * 
   * @param contentUrl - The content URL to check
   * @returns True if the URL has expired
   */
  isUrlExpired(contentUrl: string): boolean {
    try {
      const url = new URL(contentUrl);
      const expiresParam = url.searchParams.get('X-Amz-Expires');
      const dateParam = url.searchParams.get('X-Amz-Date');
      
      if (!expiresParam || !dateParam) {
        return true; // Assume expired if we can't determine expiration
      }
      
      const expiresIn = parseInt(expiresParam, 10);
      const signedDate = new Date(
        dateParam.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/, 
        '$1-$2-$3T$4:$5:$6Z')
      );
      
      const expirationTime = signedDate.getTime() + (expiresIn * 1000);
      return Date.now() > expirationTime;
      
    } catch (error) {
      return true; // Assume expired on error
    }
  }

  /**
   * Get time remaining until URL expires
   * 
   * @param contentUrl - The content URL to check
   * @returns Seconds remaining until expiration, or 0 if expired
   */
  getTimeUntilExpiration(contentUrl: string): number {
    try {
      const url = new URL(contentUrl);
      const expiresParam = url.searchParams.get('X-Amz-Expires');
      const dateParam = url.searchParams.get('X-Amz-Date');
      
      if (!expiresParam || !dateParam) {
        return 0;
      }
      
      const expiresIn = parseInt(expiresParam, 10);
      const signedDate = new Date(
        dateParam.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/, 
        '$1-$2-$3T$4:$5:$6Z')
      );
      
      const expirationTime = signedDate.getTime() + (expiresIn * 1000);
      const remaining = Math.max(0, Math.floor((expirationTime - Date.now()) / 1000));
      
      return remaining;
      
    } catch (error) {
      return 0;
    }
  }

  /** Set authentication token for subsequent requests */
  setAccessToken(token: string): void {
    (this.config as any).authToken = token;
  }

  /** Clear authentication token */
  clearAccessToken(): void {
    delete (this.config as any).authToken;
  }
}