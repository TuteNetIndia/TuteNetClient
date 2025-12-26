# TuteNet Service Clients

TypeScript clients for all TuteNet backend services. This monorepo contains individual service clients that provide type-safe, environment-aware access to TuteNet APIs.

## 📦 Packages

| Package | Description | Version |
|---------|-------------|---------|
| [`@tutenet/client-core`](./packages/core) | Shared utilities, base client, error handling | 1.0.0 |
| [`@tutenet/profile-client`](./packages/profile-client) | Profile service client | 1.0.0 |
| [`@tutenet/auth-client`](./packages/auth-client) | Authentication service client | 1.0.0 |
| [`@tutenet/upload-client`](./packages/upload-client) | Upload service client | 1.0.0 |

## 🚀 Quick Start

### Installation

Install individual clients as needed:

```bash
# For authentication
npm install @tutenet/auth-client

# For profile management
npm install @tutenet/profile-client

# For file uploads
npm install @tutenet/upload-client
```

### Basic Usage

```typescript
import { AuthClient } from '@tutenet/auth-client';
import { ProfileClient } from '@tutenet/profile-client';
import { UploadClient } from '@tutenet/upload-client';

// Clients auto-detect environment (dev/staging/prod)
const authClient = new AuthClient();
const profileClient = new ProfileClient();
const uploadClient = new UploadClient();

// Sign in user
const authResult = await authClient.signIn({
  email: 'user@example.com',
  password: 'password123'
});

// Get user profile
const profile = await profileClient.getProfile(authResult.user.userId);

// Upload a file
const uploadResult = await uploadClient.completeUpload(
  fileBuffer,
  'document.pdf',
  'application/pdf',
  {
    type: 'standalone',
    title: 'My Document',
    subject: 'Mathematics',
    grades: ['Grade 9'],
    tags: ['algebra'],
    language: 'English',
    visibility: 'public',
    teacherId: authResult.user.userId
  }
);
```

## 🏗️ Architecture

### Design Principles

1. **Individual Service Clients**: Each service has its own client package
2. **Shared Core**: Common functionality in `@tutenet/client-core`
3. **Environment Awareness**: Auto-detection of dev/staging/prod environments
4. **Type Safety**: Full TypeScript support with comprehensive type definitions
5. **Error Handling**: Consistent error handling across all clients
6. **Single Source of Truth**: API types defined in client packages, not services

### Environment Detection

Clients automatically detect the environment from:

1. `STAGE` environment variable (`prod`, `staging`, `dev`)
2. `NODE_ENV` environment variable
3. Defaults to `development`

### Built-in Endpoints

No need to configure endpoints - they're built into the clients:

```typescript
// Development
const endpoints = {
  external: 'https://dev-api.tutenet.com/v1',
  internal: 'https://dev-internal-api.tutenet.com'
};

// Staging
const endpoints = {
  external: 'https://staging-api.tutenet.com/v1',
  internal: 'https://staging-internal-api.tutenet.com'
};

// Production
const endpoints = {
  external: 'https://api.tutenet.com/v1',
  internal: 'https://internal-api.tutenet.com'
};
```

## 🔧 Configuration

### Basic Configuration

```typescript
import { AuthClient, Environment } from '@tutenet/auth-client';

const client = new AuthClient({
  environment: Environment.STAGING,
  accessToken: 'jwt-token',
  timeout: 30000,
  retries: 3
});
```

### Internal API Usage

```typescript
const client = new ProfileClient({
  useInternalApi: true,  // Use internal endpoints
  accessToken: 'service-token'
});
```

### Custom Configuration

```typescript
const client = new UploadClient({
  baseUrl: 'https://custom-api.example.com',  // Override endpoint
  timeout: 60000,
  retries: 5,
  debug: true  // Enable debug logging
});
```

## 🛡️ Error Handling

All clients use consistent error handling:

```typescript
import { ClientError, NetworkError, TimeoutError } from '@tutenet/client-core';

try {
  const result = await client.someOperation();
} catch (error) {
  if (error instanceof ClientError) {
    console.error(`API Error: ${error.message} (${error.code})`);
    
    // Handle specific status codes
    switch (error.statusCode) {
      case 400:
        console.log('Validation error:', error.details);
        break;
      case 401:
        console.log('Authentication required');
        break;
      case 404:
        console.log('Resource not found');
        break;
      case 500:
        console.log('Server error');
        break;
    }
  } else if (error instanceof NetworkError) {
    console.error('Network error:', error.message);
  } else if (error instanceof TimeoutError) {
    console.error('Request timed out');
  }
}
```

## 🔐 Authentication

### Setting Tokens

```typescript
// Set token after client creation
client.setAccessToken('new-jwt-token');

// Clear token
client.clearAccessToken();

// Or pass during construction
const client = new AuthClient({
  accessToken: 'jwt-token'
});
```

### Token Management

```typescript
// Sign in and get tokens
const authResult = await authClient.signIn({
  email: 'user@example.com',
  password: 'password123'
});

// Use tokens with other clients
profileClient.setAccessToken(authResult.tokens.accessToken);
uploadClient.setAccessToken(authResult.tokens.accessToken);

// Refresh tokens when needed
const refreshResult = await authClient.refreshToken({
  refreshToken: authResult.tokens.refreshToken
});

// Update all clients with new token
const newToken = refreshResult.tokens.accessToken;
profileClient.setAccessToken(newToken);
uploadClient.setAccessToken(newToken);
```

## 📊 Usage Examples

### Complete Authentication Flow

```typescript
import { AuthClient } from '@tutenet/auth-client';

const authClient = new AuthClient();

// Sign up
const signUpResult = await authClient.signUp({
  email: 'user@example.com',
  password: 'SecurePass123',
  firstName: 'John',
  lastName: 'Doe',
  subjects: ['Mathematics'],
  languages: ['English']
});

// Verify email
await authClient.verifyEmail({
  email: 'user@example.com',
  code: '123456'
});

// Sign in
const signInResult = await authClient.signIn({
  email: 'user@example.com',
  password: 'SecurePass123'
});

console.log('User:', signInResult.user);
console.log('Tokens:', signInResult.tokens);
```

### Profile Management

```typescript
import { ProfileClient } from '@tutenet/profile-client';

const profileClient = new ProfileClient({
  accessToken: 'jwt-token'
});

// Get profile
const profile = await profileClient.getProfile('user-123');

// Update profile
const updated = await profileClient.updateProfile('user-123', {
  name: 'John Smith',
  school: 'New School',
  city: 'New York',
  subject: 'Physics'
});

// Upload avatar
const avatarResult = await profileClient.uploadAvatar('user-123', {
  filename: 'avatar.jpg',
  contentType: 'image/jpeg',
  fileData: imageBuffer
});
```

### File Upload Workflow

```typescript
import { UploadClient } from '@tutenet/upload-client';

const uploadClient = new UploadClient({
  accessToken: 'jwt-token'
});

// Method 1: Step-by-step upload
const presigned = await uploadClient.generatePresignedUrl({
  filename: 'document.pdf',
  contentType: 'application/pdf'
});

// Upload to S3
const response = await fetch(presigned.url, {
  method: 'PUT',
  body: fileBuffer,
  headers: { 'Content-Type': 'application/pdf' }
});

// Finalize upload
const resource = await uploadClient.finalizeUpload({
  type: 'standalone',
  title: 'Mathematics Worksheet',
  subject: 'Mathematics',
  grades: ['Grade 9'],
  tags: ['algebra'],
  language: 'English',
  visibility: 'public',
  teacherId: 'teacher-123',
  s3Key: presigned.key
});

// Method 2: Complete upload in one call
const resource2 = await uploadClient.completeUpload(
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
  (progress) => console.log(`Upload: ${progress}%`)
);
```

## 🧪 Testing

### Unit Testing

```typescript
import { AuthClient } from '@tutenet/auth-client';
import { ClientError } from '@tutenet/client-core';

describe('AuthClient', () => {
  let client: AuthClient;

  beforeEach(() => {
    client = new AuthClient({
      environment: Environment.DEVELOPMENT
    });
  });

  it('should sign in successfully', async () => {
    const result = await client.signIn({
      email: 'test@example.com',
      password: 'password123'
    });

    expect(result.user.email).toBe('test@example.com');
    expect(result.tokens.accessToken).toBeDefined();
  });

  it('should handle invalid credentials', async () => {
    await expect(client.signIn({
      email: 'test@example.com',
      password: 'wrong-password'
    })).rejects.toThrow(ClientError);
  });
});
```

### Integration Testing

```typescript
describe('Client Integration', () => {
  let authClient: AuthClient;
  let profileClient: ProfileClient;

  beforeEach(() => {
    authClient = new AuthClient({ environment: Environment.STAGING });
    profileClient = new ProfileClient({ environment: Environment.STAGING });
  });

  it('should complete full user flow', async () => {
    // Sign in
    const authResult = await authClient.signIn({
      email: 'test@example.com',
      password: 'password123'
    });

    // Set token for profile client
    profileClient.setAccessToken(authResult.tokens.accessToken);

    // Get profile
    const profile = await profileClient.getProfile(authResult.user.userId);
    
    expect(profile.id).toBe(authResult.user.userId);
  });
});
```

## 🔄 Migration Guide

### From Service-Specific Types to Client Types

**Before (in service):**
```typescript
// services/auth-service/src/domain/authModels.ts
export interface SignUpRequest {
  email: string;
  password: string;
  // ...
}
```

**After (using client):**
```typescript
// Import from client package
import { SignUpRequest } from '@tutenet/auth-client';

// Use the imported type
const request: SignUpRequest = {
  email: 'user@example.com',
  password: 'password123',
  // ...
};
```

### Service Migration Steps

1. **Install client package** in service
2. **Import API types** from client instead of local definitions
3. **Remove duplicate type files** from service
4. **Update handlers and extractors** to use imported types
5. **Keep domain models** in service (only API types move to client)

## 🏗️ Development

### Building All Packages

```bash
# Build all packages
npm run build

# Build individual packages
npm run build:core
npm run build:auth
npm run build:profile
npm run build:upload

# Watch mode for development
npm run dev
```

### Adding New Clients

1. Create new package directory: `packages/new-service-client/`
2. Copy structure from existing client
3. Update root `package.json` workspaces
4. Add build script: `"build:new-service": "npm run build -w @tutenet/new-service-client"`
5. Export types and client in package index

### Package Structure

```
packages/service-client/
├── src/
│   ├── client/
│   │   ├── serviceClient.ts    # Main client class
│   │   └── index.ts           # Client exports
│   ├── types/
│   │   ├── api.ts             # API request/response types
│   │   └── index.ts           # Type exports
│   └── index.ts               # Package main export
├── package.json
├── tsconfig.json
└── README.md
```

## 📝 Contributing

1. **Follow TypeScript standards** - strict mode, no `any` types
2. **Maintain API compatibility** - don't break existing interfaces
3. **Add comprehensive tests** - unit and integration tests
4. **Update documentation** - README and JSDoc comments
5. **Follow semantic versioning** - major.minor.patch

## 📄 License

MIT

---

**Built with ❤️ by the TuteNet Team**