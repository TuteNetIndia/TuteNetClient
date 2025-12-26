/**
 * TuteNet Upload Client
 * 
 * TypeScript client for the TuteNet Upload Service API.
 * Provides type-safe methods for resource upload operations.
 * 
 * @example
 * ```typescript
 * import { UploadClient } from '@tutenet/upload-client';
 * 
 * const client = new UploadClient({
 *   environment: Environment.STAGING,
 *   accessToken: 'your-jwt-token'
 * });
 * 
 * // Generate presigned URL
 * const presigned = await client.generatePresignedUrl({
 *   filename: 'document.pdf',
 *   contentType: 'application/pdf'
 * });
 * 
 * // Create resource after upload
 * const resource = await client.finalizeUpload({
 *   type: 'standalone',
 *   title: 'My Document',
 *   subject: 'Mathematics',
 *   grades: ['Grade 9'],
 *   tags: ['algebra'],
 *   language: 'English',
 *   visibility: 'public',
 *   teacherId: 'teacher-123',
 *   s3Key: presigned.key
 * });
 * ```
 */

// Re-export everything
export * from './client';
export * from './types';

// Default export for convenience
export { UploadClient as default } from './client/uploadClient';