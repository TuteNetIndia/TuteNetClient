# Migration Guide: Service Types to Client Types

This guide explains how to migrate TuteNet backend services from using local API types to importing types from the centralized client packages.

## 🎯 Goal

**Single Source of Truth**: API request/response types should be defined only in client packages. Services should import these types instead of maintaining duplicate definitions.

## 📋 Migration Checklist

### Phase 1: Install Client Dependencies

1. **Add client package dependency** to service `package.json`
2. **Install dependencies** with `npm install`
3. **Verify client package builds** successfully

### Phase 2: Update Type Imports

1. **Identify duplicate types** in service
2. **Replace local imports** with client imports
3. **Update handler signatures** to use client types
4. **Update extractor return types** to use client types

### Phase 3: Remove Duplicate Files

1. **Delete duplicate type files** from service
2. **Update index exports** to remove deleted types
3. **Verify build passes** after cleanup

### Phase 4: Validation

1. **Run all tests** to ensure compatibility
2. **Check handler functionality** remains unchanged
3. **Verify API contracts** are preserved

## 🔧 Step-by-Step Migration

### Example: Profile Service Migration

#### Step 1: Install Client Dependency

```bash
# Add to services/profile-service/package.json
{
  "dependencies": {
    "@tutenet/profile-client": "file:../../../TuteNetClient/packages/profile-client"
  }
}
```

```bash
cd services/profile-service
npm install
```

#### Step 2: Identify Duplicate Types

**Before (local types):**
```typescript
// services/profile-service/src/shared/types/getProfileTypes.ts
export interface GetProfileRequest {
  userId: string;
}

export interface GetProfileResponse {
  id: string;
  name: string;
  email: string;
  // ...
}
```

**After (client types):**
```typescript
// TuteNetClient/packages/profile-client/src/types/api.ts
export interface GetProfileRequest {
  userId: string;
}

export interface GetProfileResponse {
  id: string;
  name: string;
  email: string;
  // ...
}
```

#### Step 3: Update Handler Imports

**Before:**
```typescript
// services/profile-service/src/handlers/getProfile.ts
import { GetProfileRequest, GetProfileResponse } from '../shared/types/getProfileTypes';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Handler implementation
};
```

**After:**
```typescript
// services/profile-service/src/handlers/getProfile.ts
import { GetProfileRequest, GetProfileResponse } from '@tutenet/profile-client';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Handler implementation (unchanged)
};
```

#### Step 4: Update Extractor Imports

**Before:**
```typescript
// services/profile-service/src/extractors/getProfileExtractor.ts
import { GetProfileRequest } from '../shared/types/getProfileTypes';

export function extractGetProfileRequest(event: APIGatewayProxyEvent): { request: GetProfileRequest } {
  // Extractor implementation
}
```

**After:**
```typescript
// services/profile-service/src/extractors/getProfileExtractor.ts
import { GetProfileRequest } from '@tutenet/profile-client';

export function extractGetProfileRequest(event: APIGatewayProxyEvent): { request: GetProfileRequest } {
  // Extractor implementation (unchanged)
}
```

#### Step 5: Update Service Layer

**Before:**
```typescript
// services/profile-service/src/domain/services/profileService.ts
import { GetProfileResponse, UpdateProfileRequest } from '../../shared/types';

export class ProfileService {
  async getProfile(userId: string): Promise<GetProfileResponse> {
    // Service implementation
  }
}
```

**After:**
```typescript
// services/profile-service/src/domain/services/profileService.ts
import { GetProfileResponse, UpdateProfileRequest } from '@tutenet/profile-client';

export class ProfileService {
  async getProfile(userId: string): Promise<GetProfileResponse> {
    // Service implementation (unchanged)
  }
}
```

#### Step 6: Remove Duplicate Files

```bash
# Delete duplicate type files
rm -rf services/profile-service/src/shared/types/getProfileTypes.ts
rm -rf services/profile-service/src/shared/types/updateProfileTypes.ts
rm -rf services/profile-service/src/shared/types/uploadAvatarTypes.ts
rm -rf services/profile-service/src/shared/types/validateStatisticsTypes.ts

# Remove empty directories
rmdir services/profile-service/src/shared/types
rmdir services/profile-service/src/shared  # if empty
```

#### Step 7: Update Index Exports

**Before:**
```typescript
// services/profile-service/src/index.ts
export * from './shared/types';
export * from './domain/models';
```

**After:**
```typescript
// services/profile-service/src/index.ts
export * from './domain/models';  // Keep domain models
// Remove shared/types export (now imported from client)
```

#### Step 8: Verify Build

```bash
cd services/profile-service
npm run build
```

## 🔄 Service-Specific Migrations

### Auth Service Migration

**Types to migrate:**
- `SignUpRequest/Response`
- `SignInRequest/Response`
- `RefreshTokenRequest/Response`
- `VerifyEmailRequest/Response`
- `ForgotPasswordRequest/Response`
- `ResetPasswordRequest/Response`
- `ChangePasswordRequest/Response`
- `DeleteAccountRequest/Response`
- `GetCurrentUserResponse`

**Files to update:**
```
services/auth-service/src/handlers/*.ts
services/auth-service/src/extractors/*.ts
services/auth-service/src/domain/authService.ts
```

**Files to delete:**
```
services/auth-service/src/shared/types/  # entire directory
```

### Upload Service Migration

**Types to migrate:**
- `PresignedUrlRequest/Response`
- `CreateResourceRequest/Response`
- `BulkCreateResourceRequest/Response`
- `UpdateResourceRequest`
- `ResourceResponse`
- `ListResourcesParams/Response`
- `SearchResourcesParams/Response`

**Files to update:**
```
services/upload-service/src/handlers/*.ts
services/upload-service/src/extractors/*.ts
services/upload-service/src/domain/uploadService.ts
```

**Domain models to keep:**
```
services/upload-service/src/domain/models.ts  # Keep internal Resource model
```

## ⚠️ Important Considerations

### Domain Models vs API Types

**Keep in service (domain models):**
```typescript
// services/profile-service/src/domain/models.ts
export interface TeacherProfile {
  // Internal domain model with business logic
  id: string;
  name: string;
  // ... internal fields
  
  // Domain methods
  calculateStatistics(): ProfileStatistics;
  isEligibleForMentor(): boolean;
}
```

**Import from client (API types):**
```typescript
// Import API contract types
import { GetProfileResponse, UpdateProfileRequest } from '@tutenet/profile-client';

// Use for API boundaries
export const handler = async (event: APIGatewayProxyEvent): Promise<GetProfileResponse> => {
  // Convert domain model to API response
  const profile = await profileService.getProfile(userId);
  return mapToApiResponse(profile);
};
```

### Type Mapping

When domain models differ from API types, create mappers:

```typescript
// services/profile-service/src/mappers/profileMapper.ts
import { GetProfileResponse } from '@tutenet/profile-client';
import { TeacherProfile } from '../domain/models';

export function mapToGetProfileResponse(profile: TeacherProfile): GetProfileResponse {
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    // ... map fields
  };
}

export function mapFromUpdateProfileRequest(
  request: UpdateProfileRequest
): Partial<TeacherProfile> {
  return {
    name: request.name,
    school: request.school,
    // ... map fields
  };
}
```

### Handling Breaking Changes

If client types change, services need to be updated:

1. **Update client package** version
2. **Fix TypeScript errors** in service
3. **Update mappers** if needed
4. **Run tests** to verify compatibility
5. **Deploy service** with updated types

## 🧪 Testing Migration

### Before Migration

```bash
# Ensure all tests pass before starting
cd services/profile-service
npm test
```

### During Migration

```bash
# Check build after each step
npm run build

# Run specific test suites
npm test -- --testPathPattern=handlers
npm test -- --testPathPattern=extractors
```

### After Migration

```bash
# Full test suite
npm test

# Integration tests
npm run test:integration

# Type checking
npm run type-check
```

## 🚨 Common Issues

### Issue 1: Import Path Errors

**Problem:**
```typescript
// Error: Cannot find module '@tutenet/profile-client'
import { GetProfileResponse } from '@tutenet/profile-client';
```

**Solution:**
```bash
# Ensure client package is installed
cd services/profile-service
npm install

# Check package.json has correct dependency
cat package.json | grep profile-client
```

### Issue 2: Type Mismatches

**Problem:**
```typescript
// Error: Type 'DomainProfile' is not assignable to type 'GetProfileResponse'
return domainProfile;  // Wrong type
```

**Solution:**
```typescript
// Create mapper function
return mapToGetProfileResponse(domainProfile);
```

### Issue 3: Circular Dependencies

**Problem:**
```typescript
// Error: Circular dependency detected
// Service imports from client, client imports from service
```

**Solution:**
- **Client should never import from services**
- **Services import API types from client**
- **Keep domain models in services**

### Issue 4: Missing Types

**Problem:**
```typescript
// Error: 'SomeType' is not exported from '@tutenet/profile-client'
import { SomeType } from '@tutenet/profile-client';
```

**Solution:**
1. **Check if type exists** in client package
2. **Add missing type** to client if it's an API type
3. **Keep in service** if it's a domain-specific type

## ✅ Validation Checklist

After migration, verify:

- [ ] **All TypeScript errors resolved**
- [ ] **All tests pass**
- [ ] **Build succeeds**
- [ ] **No duplicate type definitions**
- [ ] **API contracts preserved**
- [ ] **Handler functionality unchanged**
- [ ] **Integration tests pass**
- [ ] **No circular dependencies**
- [ ] **Client packages build successfully**
- [ ] **Service can be deployed**

## 🎉 Benefits After Migration

1. **Single Source of Truth** - API types defined once in client packages
2. **Type Safety** - Compile-time verification of API contracts
3. **Consistency** - Same types used by frontend and backend
4. **Maintainability** - Changes to API types automatically propagate
5. **Documentation** - Client packages serve as API documentation
6. **Reusability** - Types can be used by multiple consumers
7. **Versioning** - API changes can be versioned with client packages

## 📞 Support

If you encounter issues during migration:

1. **Check this guide** for common solutions
2. **Review client package documentation**
3. **Run diagnostic commands** (`npm run build`, `npm test`)
4. **Check for TypeScript errors** (`npm run type-check`)
5. **Ask for help** in team channels

---

**Happy migrating! 🚀**