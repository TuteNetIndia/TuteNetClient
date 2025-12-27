/**
 * TuteNet Upload Client
 * 
 * TypeScript client library for the TuteNet Upload Service API.
 * Provides type-safe methods for educational resource upload operations.
 * 
 * @example Basic Usage
 * ```typescript
 * import { UploadClient } from '@tutenet/upload-client';
 * 
 * const client = new UploadClient({
 *   environment: Environment.STAGING,
 *   accessToken: 'your-jwt-token'
 * });
 * 
 * // Complete upload workflow
 * const result = await client.completeUpload(
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
 * @author TuteNet Backend Team
 * @version 2.0.0
 */

// Re-export everything
export * from './client';
export * from './types';

// Default export for convenience
export { UploadClient as default } from './client/uploadClient';