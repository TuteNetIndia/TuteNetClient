# @tutenet/upload-client

TypeScript client for the TuteNet Upload Service API. Provides type-safe methods for resource upload operations, secure content access, and comprehensive resource management.

## Features

- 🚀 **Upload Management**: Secure file uploads via presigned URLs
- 🔒 **Content Access**: App-only secure content access with advanced security
- 📚 **Resource Management**: Full CRUD operations for educational resources
- 🔍 **Search & Discovery**: Advanced search with filtering and pagination
- 📱 **Mobile-First**: Optimized for mobile app integration
- 🛡️ **Security**: JWT authentication, rate limiting, and app-restricted URLs
- 📊 **Analytics**: Resource analytics and engagement metrics
- 🌐 **Multi-Environment**: Support for dev, staging, and production

## Installation

```bash
npm install @tutenet/upload-client
```

## Quick Start

### Upload Client

```typescript
import { UploadClient, Environment } from '@tutenet/upload-client';

// Create client (auto-detects environment)
const uploadClient = new UploadClient({
  accessToken: 'your-jwt-token'
});

// Or specify environment explicitly
const uploadClient = new UploadClient({
  environment: Environment.STAGING,
  accessToken: 'your-jwt-token'
});
```

### Access Client ⭐ NEW

```typescript
import { AccessClient, ContentAccessType } from '@tutenet/upload-client';

// Create access client for secure content access
const accessClient = new AccessClient({
  environment: Environment.STAGING,
  accessToken: 'your-jwt-token'
});

// Get secure content access
const response = await accessClient.getContentAccess(
  'resource-123',
  ContentAccessType.VIEW
);

if (response.success) {
  const { contentUrl, expiresAt, viewingOptions } = response.data;
  
  // Validate security parameters before use
  const validation = accessClient.validateSecurityParams(
    contentUrl,
    'resource-123',
    'user-456'
  );
  
  if (validation.isValid) {
    // Safe to use URL in your app
    displayContent(contentUrl);
  }
}
```

## Content Access API ⭐ NEW

### Secure Content Access

The new Content Access API provides app-only access to educational resources with advanced security features:

- **App-Restricted URLs**: Contains security parameters that prevent browser access
- **Shortened Expiration**: 30 min for view, 15 min for stream, 1 hour for download
- **Token-Based Validation**: Encrypted tokens with user/resource context
- **Replay Attack Protection**: Unique nonce and timestamp in each request

### Access Types

```typescript
// View access (30 minutes) - for documents and images
const viewResponse = await accessClient.getContentAccess(
  'document-123',
  ContentAccessType.VIEW
);

// Stream access (15 minutes) - for video content
const streamResponse = await accessClient.getContentAccess(
  'video-456',
  ContentAccessType.STREAM
);

// Download access (1 hour) - for offline storage
const downloadResponse = await accessClient.getContentAccess(
  'worksheet-789',
  ContentAccessType.DOWNLOAD
);
```

### Security Validation

Always validate security parameters before using content URLs:

```typescript
const validation = accessClient.validateSecurityParams(
  contentUrl,
  expectedResourceId,
  expectedUserId
);

if (!validation.isValid) {
  console.error('Security validation failed:', validation.reason);
  return;
}

// Check if URL has expired
if (accessClient.isUrlExpired(contentUrl)) {
  // Request new URL
  const newResponse = await accessClient.getContentAccess(resourceId, accessType);
}

// Get time remaining until expiration
const secondsRemaining = accessClient.getTimeUntilExpiration(contentUrl);
console.log(`URL expires in ${secondsRemaining} seconds`);
```

### Content Metadata

Each content access response includes comprehensive metadata:

```typescript
const response = await accessClient.getContentAccess('resource-123', ContentAccessType.VIEW);

if (response.success) {
  const { contentMetadata, viewingOptions, cacheHeaders } = response.data;
  
  console.log('File type:', contentMetadata.fileType);
  console.log('File size:', contentMetadata.fileSize);
  console.log('Supports offline:', viewingOptions.supportsOffline);
  console.log('Security level:', viewingOptions.securityLevel);
  console.log('Cache control:', cacheHeaders['Cache-Control']);
}
```

## Upload Workflow

### Basic Upload

```typescript
// 1. Generate presigned URL
const presigned = await uploadClient.generatePresignedUrl({
  filename: 'document.pdf',
  contentType: 'application/pdf'
});

// 2. Upload file to S3 (using fetch or axios)
const response = await fetch(presigned.url, {
  method: 'PUT',
  body: fileBuffer,
  headers: { 'Content-Type': 'application/pdf' }
});

// 3. Finalize upload and create resource
const resource = await uploadClient.finalizeUpload({
  type: 'standalone',
  title: 'Mathematics Worksheet',
  subject: 'Mathematics',
  grades: ['Grade 9'],
  tags: ['algebra', 'equations'],
  language: 'English',
  visibility: 'public',
  teacherId: 'teacher-123',
  s3Key: presigned.key
});
```

### Convenience Method

```typescript
// Complete upload in one call
const resource = await uploadClient.completeUpload(
  fileBuffer,
  'document.pdf',
  'application/pdf',
  {
    type: 'standalone',
    title: 'Mathematics Worksheet',
    subject: 'Mathematics',
    grades: ['Grade 9'],
    tags: ['algebra'],
    language: 'English',
    visibility: 'public',
    teacherId: 'teacher-123'
  },
  (progress) => console.log(`Upload progress: ${progress}%`)
);
```

## Resource Management

### Get Resource

```typescript
const resource = await uploadClient.getResource('resource-123');
console.log(resource.title, resource.downloads);
```

### Update Resource

```typescript
const updated = await uploadClient.updateResource('resource-123', {
  title: 'Updated Title',
  tags: ['new-tag'],
  visibility: 'private'
});
```

### Delete Resource

```typescript
const result = await uploadClient.deleteResource('resource-123');
console.log(result.message);
```

## Listing and Search

### List Resources

```typescript
// List all resources
const resources = await uploadClient.listResources();

// List with filters
const filtered = await uploadClient.listResources({
  teacherId: 'teacher-123',
  subject: 'Mathematics',
  type: 'standalone',
  limit: 20,
  sortBy: 'createdAt',
  sortOrder: 'desc'
});

// Pagination
let cursor = undefined;
do {
  const page = await uploadClient.listResources({
    cursor,
    limit: 20
  });
  
  console.log(`Found ${page.items.length} resources`);
  cursor = page.nextCursor;
} while (cursor);
```

### Search Resources

```typescript
const results = await uploadClient.searchResources({
  q: 'algebra equations',
  subject: 'Mathematics',
  grade: 'Grade 9',
  limit: 10,
  sortBy: 'relevance'
});

console.log(`Found ${results.totalCount} results in ${results.searchTime}ms`);
```

## Enhanced Resource Structure

### Get Resource with Contextual Information

The enhanced resource structure API provides comprehensive resource information with hierarchical context, analytics, and navigation data in a single call.

```typescript
// Get basic resource structure (mobile-optimized)
const resource = await uploadClient.getResourceStructure('course-123');

// Get desktop-optimized structure
const resource = await uploadClient.getResourceStructure('course-123', 'desktop');

// Get custom expansions
const resource = await uploadClient.getResourceStructure('course-123', 'children.full,siblings,navigation');

console.log(`Resource: ${resource.data.resource.title}`);
console.log(`Type: ${resource.data.type}`);
console.log(`Analytics: ${resource.data.analytics.upvotesCount} upvotes`);

// Access hierarchical context
if (resource.data.context?.children) {
  resource.data.context.children.forEach(child => {
    console.log(`  Child: ${child.title}`);
  });
}
```

## Bulk Operations

### Bulk Upload

```typescript
const result = await uploadClient.bulkFinalizeUpload({
  resources: [
    {
      type: 'material',
      parentId: 'chapter-123',
      title: 'Lesson 1',
      subject: 'Mathematics',
      grades: ['Grade 9'],
      tags: ['algebra'],
      language: 'English',
      visibility: 'public',
      teacherId: 'teacher-123',
      s3Key: 'uploads/file1.pdf'
    },
    {
      type: 'material',
      parentId: 'chapter-123',
      title: 'Lesson 2',
      subject: 'Mathematics',
      grades: ['Grade 9'],
      tags: ['geometry'],
      language: 'English',
      visibility: 'public',
      teacherId: 'teacher-123',
      s3Key: 'uploads/file2.pdf'
    }
  ]
});

console.log(`Created ${result.successCount} resources, ${result.failureCount} failed`);
```

## Configuration

### Environment Detection

The client automatically detects the environment from:
1. `STAGE` environment variable (`prod`, `staging`, `dev`)
2. `NODE_ENV` environment variable
3. Defaults to `development`

### Custom Configuration

```typescript
// Upload Client
const uploadClient = new UploadClient({
  environment: Environment.PRODUCTION,
  useInternalApi: true,  // Use internal API endpoints
  timeout: 30000,        // 30 second timeout
  retries: 3,            // Retry failed requests 3 times
  accessToken: 'jwt-token'
});

// Access Client
const accessClient = new AccessClient({
  environment: Environment.PRODUCTION,
  timeout: 60000,        // 60 second timeout for large files
  retries: 2,            // Fewer retries for time-sensitive operations
  accessToken: 'jwt-token'
});
```

### Authentication

```typescript
// Set token after creation
uploadClient.setAccessToken('new-jwt-token');
accessClient.setAccessToken('new-jwt-token');

// Clear token
uploadClient.clearAccessToken();
accessClient.clearAccessToken();
```

## Error Handling

```typescript
import { ClientError, NetworkError, TimeoutError } from '@tutenet/client-core';

try {
  const resource = await uploadClient.getResource('invalid-id');
} catch (error) {
  if (error instanceof ClientError) {
    console.error(`API Error: ${error.message} (${error.code})`);
    if (error.statusCode === 404) {
      console.log('Resource not found');
    }
  } else if (error instanceof NetworkError) {
    console.error('Network error:', error.message);
  } else if (error instanceof TimeoutError) {
    console.error('Request timed out');
  }
}

// Content access specific error handling
try {
  const response = await accessClient.getContentAccess('resource-123', ContentAccessType.VIEW);
  
  if (!response.success) {
    switch (response.error.code) {
      case 'NOT_FOUND':
        console.error('Resource not found or access denied');
        break;
      case 'FORBIDDEN':
        console.error('Insufficient permissions');
        break;
      case 'RATE_LIMIT_EXCEEDED':
        console.error('Too many requests. Please try again later.');
        break;
      default:
        console.error('Content access failed:', response.error.message);
    }
  }
} catch (error) {
  console.error('Network error during content access:', error);
}
```

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```typescript
import {
  UploadClient,
  AccessClient,
  ResourceResponse,
  CreateResourceRequest,
  ResourceType,
  ResourceVisibility,
  MaterialType,
  ContentAccessType,
  ResourceContentAccessResponse
} from '@tutenet/upload-client';

// All types are exported and fully typed
const request: CreateResourceRequest = {
  type: 'standalone' as ResourceType,
  title: 'My Resource',
  visibility: 'public' as ResourceVisibility,
  // ... other fields with full type checking
};

// Content access types
const accessType: ContentAccessType = ContentAccessType.VIEW;
```

## API Reference

### UploadClient Methods

- `generatePresignedUrl(request)` - Generate S3 presigned URL
- `finalizeUpload(request)` - Create resource after S3 upload
- `bulkFinalizeUpload(request)` - Create multiple resources
- `getResource(id)` - Get resource by ID
- `updateResource(id, updates)` - Update resource
- `deleteResource(id)` - Delete resource
- `listResources(params?)` - List resources with filtering
- `searchResources(params)` - Search resources
- `getCourseStructure(courseId)` - Get course with chapters/materials
- `uploadFile(file, filename, contentType, onProgress?)` - Upload file to S3
- `completeUpload(file, filename, contentType, resourceData, onProgress?)` - Complete upload workflow

### AccessClient Methods ⭐ NEW

- `getContentAccess(resourceId, accessType)` - Get secure content access URL
- `validateSecurityParams(url, resourceId, userId)` - Validate URL security parameters
- `isUrlExpired(url)` - Check if content URL has expired
- `getTimeUntilExpiration(url)` - Get seconds remaining until URL expires

### Utility Methods

- `setAccessToken(token)` - Set authentication token
- `clearAccessToken()` - Clear authentication token
- `healthCheck()` - Check service health
- `getConfig()` - Get client configuration
- `getBaseUrl()` - Get API base URL

## Security Best Practices

### Mobile App Integration

1. **Always Validate Security Parameters**
   ```typescript
   const validation = accessClient.validateSecurityParams(url, resourceId, userId);
   if (!validation.isValid) {
     throw new Error(`Security validation failed: ${validation.reason}`);
   }
   ```

2. **Implement Certificate Pinning**
   ```typescript
   // Pin TuteNet API certificates in your mobile app
   const pinnedCertificates = [
     'sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
     'sha256/BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB='
   ];
   ```

3. **Use Secure Storage**
   ```typescript
   // Store tokens securely
   await SecureStorage.setItem('access_token', token);
   ```

4. **Handle URL Expiration**
   ```typescript
   if (accessClient.isUrlExpired(contentUrl)) {
     const newResponse = await accessClient.getContentAccess(resourceId, accessType);
     contentUrl = newResponse.data.contentUrl;
   }
   ```

## Performance Optimization

### Preload Content URLs

```typescript
// Preload URLs for better UX
const preloadPromises = resources.map(resource => 
  accessClient.getContentAccess(resource.id, ContentAccessType.VIEW)
);

const responses = await Promise.allSettled(preloadPromises);
```

### Implement Caching

```typescript
// Use cache headers for optimal performance
const { cacheHeaders } = response.data;
const maxAge = extractMaxAge(cacheHeaders['Cache-Control']);
cacheContent(contentUrl, maxAge);
```

## Migration Guide

### From Direct S3 URLs

If you're currently using direct S3 URLs:

```typescript
// OLD: Direct S3 URL (insecure)
const directUrl = 'https://bucket.s3.amazonaws.com/file.pdf';

// NEW: Secure content access
const response = await accessClient.getContentAccess(resourceId, ContentAccessType.VIEW);
const secureUrl = response.data.contentUrl;
```

## API Documentation

For complete API documentation, see:
- **[OpenAPI Specification](../../TuteNetCDK/docs/api/v1/openapi.yaml)** - Complete API specification
- **[Interactive Swagger UI](../../TuteNetCDK/docs/api/v1/swagger-ui.html)** - Interactive documentation with testing capabilities
- **[Content Access Guide](../../TuteNetCDK/docs/api/v1/guides/CONTENT_ACCESS_GUIDE.md)** - Comprehensive guide for secure content access

### Testing the Documentation

To test the Swagger UI locally:

```bash
# Navigate to the API docs directory
cd TuteNetCDK/docs/api/v1

# Start a local server
python3 -m http.server 8080

# Open in browser
open http://localhost:8080/swagger-ui.html
```

The documentation includes:
- ✅ Complete OpenAPI 3.0 specification
- ✅ Interactive Swagger UI with testing capabilities
- ✅ Comprehensive examples and guides
- ✅ All path references properly resolved
- ✅ Security documentation for app-only access
- ✅ Client integration examples

## License

MIT