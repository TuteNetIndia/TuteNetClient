# @tutenet/upload-client

TypeScript client for the TuteNet Upload Service API. Provides type-safe methods for resource upload operations including file uploads, resource management, and search functionality.

## Installation

```bash
npm install @tutenet/upload-client
```

## Quick Start

```typescript
import { UploadClient, Environment } from '@tutenet/upload-client';

// Create client (auto-detects environment)
const client = new UploadClient({
  accessToken: 'your-jwt-token'
});

// Or specify environment explicitly
const client = new UploadClient({
  environment: Environment.STAGING,
  accessToken: 'your-jwt-token'
});
```

## Upload Workflow

### Basic Upload

```typescript
// 1. Generate presigned URL
const presigned = await client.generatePresignedUrl({
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
const resource = await client.finalizeUpload({
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
const resource = await client.completeUpload(
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
const resource = await client.getResource('resource-123');
console.log(resource.title, resource.downloads);
```

### Update Resource

```typescript
const updated = await client.updateResource('resource-123', {
  title: 'Updated Title',
  tags: ['new-tag'],
  visibility: 'private'
});
```

### Delete Resource

```typescript
const result = await client.deleteResource('resource-123');
console.log(result.message);
```

## Listing and Search

### List Resources

```typescript
// List all resources
const resources = await client.listResources();

// List with filters
const filtered = await client.listResources({
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
  const page = await client.listResources({
    cursor,
    limit: 20
  });
  
  console.log(`Found ${page.items.length} resources`);
  cursor = page.nextCursor;
} while (cursor);
```

### Search Resources

```typescript
const results = await client.searchResources({
  q: 'algebra equations',
  subject: 'Mathematics',
  grade: 'Grade 9',
  limit: 10,
  sortBy: 'relevance'
});

console.log(`Found ${results.totalCount} results in ${results.searchTime}ms`);
```

## Course Structure

### Get Course with Chapters and Materials

```typescript
const course = await client.getCourseStructure('course-123');

console.log(`Course: ${course.course.title}`);
course.chapters.forEach(chapter => {
  console.log(`  Chapter: ${chapter.chapter.title}`);
  chapter.materials.forEach(material => {
    console.log(`    Material: ${material.title}`);
  });
});
```

## Bulk Operations

### Bulk Upload

```typescript
const result = await client.bulkFinalizeUpload({
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
const client = new UploadClient({
  environment: Environment.PRODUCTION,
  useInternalApi: true,  // Use internal API endpoints
  timeout: 30000,        // 30 second timeout
  retries: 3,            // Retry failed requests 3 times
  accessToken: 'jwt-token'
});
```

### Authentication

```typescript
// Set token after creation
client.setAccessToken('new-jwt-token');

// Clear token
client.clearAccessToken();
```

## Error Handling

```typescript
import { ClientError, NetworkError, TimeoutError } from '@tutenet/client-core';

try {
  const resource = await client.getResource('invalid-id');
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
```

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```typescript
import {
  UploadClient,
  ResourceResponse,
  CreateResourceRequest,
  ResourceType,
  ResourceVisibility,
  MaterialType
} from '@tutenet/upload-client';

// All types are exported and fully typed
const request: CreateResourceRequest = {
  type: 'standalone' as ResourceType,
  title: 'My Resource',
  visibility: 'public' as ResourceVisibility,
  // ... other fields with full type checking
};
```

## API Reference

### Client Methods

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

### Utility Methods

- `setAccessToken(token)` - Set authentication token
- `clearAccessToken()` - Clear authentication token
- `healthCheck()` - Check service health
- `getConfig()` - Get client configuration
- `getBaseUrl()` - Get API base URL

## License

MIT