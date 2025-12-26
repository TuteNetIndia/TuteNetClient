# Backend Usage Examples

This directory contains examples of how to use TuteNet clients in backend services.

## Installation

```bash
# Install only the clients you need
npm install @tutenet/profile-client
npm install @tutenet/auth-client
npm install @tutenet/upload-client
```

## Basic Usage

### Profile Service Client (Internal API)

```typescript
import { createInternalProfileClient, Environment } from '@tutenet/profile-client';

// Auto-detect environment or specify explicitly
const profileClient = createInternalProfileClient(Environment.STAGING);

// Use in auth service to get user profile
export class AuthService {
  async getCurrentUser(accessToken: string): Promise<User> {
    // Get user ID from token
    const userId = this.extractUserIdFromToken(accessToken);
    
    // Get profile from Profile Service
    const profile = await profileClient.getProfile(userId);
    
    // Convert to User format for backward compatibility
    return this.convertProfileToUser(profile);
  }
}
```

### Auth Service Client (Internal API)

```typescript
import { createInternalAuthClient, Environment } from '@tutenet/auth-client';

// Create client for internal service-to-service communication
const authClient = createInternalAuthClient(Environment.STAGING);

// Use in upload service to validate tokens
export class UploadService {
  async validateUserToken(token: string): Promise<User> {
    try {
      return await authClient.validateToken(token);
    } catch (error) {
      if (AuthClientError.isAuthenticationError(error)) {
        throw new UnauthorizedError('Invalid token');
      }
      throw error;
    }
  }
}
```

## Environment Detection

```typescript
import { detectEnvironment } from '@tutenet/client-core';
import { createInternalProfileClient } from '@tutenet/profile-client';

// Auto-detect environment from NODE_ENV or STAGE
const environment = detectEnvironment(); // development | staging | production
const profileClient = createInternalProfileClient(environment);

console.log(`Using ${environment} environment`);
console.log(`API endpoint: ${profileClient.getBaseUrl()}`);
```

## Error Handling

```typescript
import { 
  createInternalProfileClient, 
  ProfileClientError 
} from '@tutenet/profile-client';

const profileClient = createInternalProfileClient(Environment.STAGING);

try {
  const profile = await profileClient.getProfile(userId);
  return profile;
} catch (error) {
  if (ProfileClientError.isProfileNotFound(error)) {
    throw new NotFoundError('User profile not found');
  }
  
  if (ProfileClientError.isAuthenticationError(error)) {
    throw new UnauthorizedError('Authentication required');
  }
  
  // Log unexpected errors
  logger.error('Profile service error', error);
  throw new InternalError('Failed to get profile');
}
```

## Configuration

```typescript
import { createInternalProfileClient, Environment } from '@tutenet/profile-client';

// Custom configuration
const profileClient = createInternalProfileClient(Environment.STAGING, {
  timeout: 5000,
  retries: 3,
  debug: true,
  headers: {
    'X-Service-Name': 'auth-service',
    'X-Service-Version': '1.0.0',
  },
});
```

## Testing

```typescript
import { createTestProfileClient } from '@tutenet/profile-client';

describe('AuthService', () => {
  let authService: AuthService;
  let mockProfileClient: ProfileClient;

  beforeEach(() => {
    // Create test client with mock endpoints
    mockProfileClient = createTestProfileClient({
      baseUrl: 'http://localhost:3001', // Mock server
      timeout: 1000,
      retries: 0,
    });
    
    authService = new AuthService(mockProfileClient);
  });

  it('should get current user', async () => {
    // Test implementation
  });
});
```

## Service-to-Service Communication

### Auth Service → Profile Service

```typescript
// services/auth-service/src/domain/authService.ts
import { createInternalProfileClient, Environment } from '@tutenet/profile-client';

export class AuthService {
  private profileClient = createInternalProfileClient(Environment.STAGING);

  async signUp(request: SignUpRequest): Promise<AuthResponse> {
    // Create user in Cognito
    const cognitoResult = await this.createCognitoUser(request);
    
    // Create profile in Profile Service
    const profile = await this.profileClient.createProfileFromRegistration({
      userId: cognitoResult.userId,
      email: request.email,
      firstName: request.firstName,
      lastName: request.lastName,
      subjects: request.subjects,
      languages: request.languages,
    });

    return {
      user: this.convertProfileToUser(profile.profile),
      tokens: cognitoResult.tokens,
    };
  }
}
```

### Upload Service → Profile Service

```typescript
// services/upload-service/src/domain/uploadService.ts
import { createInternalProfileClient, Environment } from '@tutenet/profile-client';

export class UploadService {
  private profileClient = createInternalProfileClient(Environment.STAGING);

  async finalizeUpload(request: FinalizeUploadRequest): Promise<Resource> {
    // Get user profile to validate permissions
    const profile = await this.profileClient.getProfile(request.userId);
    
    // Validate user can upload
    if (!this.canUserUpload(profile)) {
      throw new ForbiddenError('User cannot upload resources');
    }

    // Create resource
    return this.createResource(request, profile);
  }
}
```

## No Environment Variables Needed

```typescript
// ❌ OLD WAY: Required environment variables
const profileServiceUrl = process.env.PROFILE_SERVICE_URL; // Error-prone
const client = new ProfileServiceClient({ baseUrl: profileServiceUrl });

// ✅ NEW WAY: Built-in endpoints
const client = createInternalProfileClient(Environment.STAGING); // Just works
```

## Health Checks

```typescript
import { createInternalProfileClient } from '@tutenet/profile-client';

const profileClient = createInternalProfileClient(Environment.STAGING);

// Health check endpoint
app.get('/health', async (req, res) => {
  const checks = {
    profileService: await profileClient.healthCheck(),
    // ... other service checks
  };

  const allHealthy = Object.values(checks).every(Boolean);
  
  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? 'healthy' : 'unhealthy',
    checks,
  });
});
```