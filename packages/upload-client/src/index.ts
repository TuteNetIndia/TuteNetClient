/**
 * TuteNet Upload Client
 * 
 * TypeScript client library for the TuteNet Upload Service API.
 * Provides type-safe methods for educational resource upload operations
 * and secure content access.
 * 
 * @example Upload Client Usage
 * ```typescript
 * import { UploadClient } from '@tutenet/upload-client';
 * 
 * const uploadClient = new UploadClient({
 *   environment: Environment.STAGING,
 *   accessToken: 'your-jwt-token'
 * });
 * 
 * // Complete upload workflow
 * const result = await uploadClient.completeUpload(
 *   file,
 *   'worksheet.pdf',
 *   'application/pdf',
 *   {
 *     type: 'standalone',
 *     title: 'Grade 9 Algebra Worksheet',
 *     subject: 'Mathematics',
 *     grades: ['Grade 9'],
 *     tags: ['algebra'],
 *     language: 'English',
 *     visibility: 'public',
 *     userId: 'teacher-123'
 *   }
 * );
 * ```
 * 
 * @example Access Client Usage
 * ```typescript
 * import { AccessClient, ContentAccessType } from '@tutenet/upload-client';
 * 
 * const accessClient = new AccessClient({
 *   environment: Environment.STAGING,
 *   accessToken: 'your-jwt-token'
 * });
 * 
 * // Get secure content access
 * const response = await accessClient.getContentAccess(
 *   'resource-123',
 *   ContentAccessType.VIEW
 * );
 * 
 * if (response.success) {
 *   const { contentUrl, expiresAt, viewingOptions } = response.data;
 *   
 *   // Validate security parameters
 *   const validation = accessClient.validateSecurityParams(
 *     contentUrl,
 *     'resource-123',
 *     'user-456'
 *   );
 *   
 *   if (validation.isValid) {
 *     // Safe to use URL in your app
 *   }
 * }
 * ```
 * 
 * @author TuteNet Backend Team
 * @version 2.1.0
 */

// Re-export everything
export * from './client';
export * from './types';

// Default export for convenience
export { UploadClient as default } from './client/uploadClient';