"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = void 0;
// Re-export everything
__exportStar(require("./client"), exports);
__exportStar(require("./types"), exports);
// Default export for convenience
var uploadClient_1 = require("./client/uploadClient");
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return uploadClient_1.UploadClient; } });
//# sourceMappingURL=index.js.map