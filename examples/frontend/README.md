# Frontend Usage Examples

This directory contains examples of how to use TuteNet clients in frontend applications.

## Installation

```bash
# Install clients for frontend use
npm install @tutenet/auth-client
npm install @tutenet/profile-client
npm install @tutenet/upload-client
```

## React Application

### Authentication Flow

```typescript
// src/services/authService.ts
import { createExternalAuthClient, Environment } from '@tutenet/auth-client';

const authClient = createExternalAuthClient(Environment.PRODUCTION);

export class AuthService {
  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      return await authClient.signIn({ email, password });
    } catch (error) {
      if (AuthClientError.isAuthenticationError(error)) {
        throw new Error('Invalid email or password');
      }
      throw new Error('Sign in failed. Please try again.');
    }
  }

  async signUp(userData: SignUpRequest): Promise<AuthResponse> {
    return await authClient.signUp(userData);
  }

  async getCurrentUser(token: string): Promise<User> {
    return await authClient.getCurrentUser(token);
  }
}
```

### Profile Management

```typescript
// src/services/profileService.ts
import { createExternalProfileClient, Environment } from '@tutenet/profile-client';

const profileClient = createExternalProfileClient(Environment.PRODUCTION);

export class ProfileService {
  async getProfile(userId: string): Promise<TeacherProfile> {
    return await profileClient.getProfile(userId, {
      includeStatistics: true,
    });
  }

  async updateProfile(userId: string, updates: UpdateProfileRequest): Promise<void> {
    await profileClient.updateProfile(userId, updates);
  }

  async uploadAvatar(userId: string, file: File): Promise<string> {
    const result = await profileClient.uploadAvatar(userId, {
      file,
      filename: file.name,
      contentType: file.type,
    });
    return result.avatarUrl;
  }
}
```

### React Hooks

```typescript
// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { AuthService } from '../services/authService';

const authService = new AuthService();

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      authService.getCurrentUser(token)
        .then(setUser)
        .catch(() => localStorage.removeItem('accessToken'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    const response = await authService.signIn(email, password);
    localStorage.setItem('accessToken', response.tokens.accessToken);
    localStorage.setItem('refreshToken', response.tokens.refreshToken);
    setUser(response.user);
    return response;
  };

  const signOut = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  return { user, loading, signIn, signOut };
}
```

```typescript
// src/hooks/useProfile.ts
import { useState, useEffect } from 'react';
import { ProfileService } from '../services/profileService';

const profileService = new ProfileService();

export function useProfile(userId: string) {
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    profileService.getProfile(userId)
      .then(setProfile)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [userId]);

  const updateProfile = async (updates: UpdateProfileRequest) => {
    await profileService.updateProfile(userId, updates);
    // Refresh profile
    const updatedProfile = await profileService.getProfile(userId);
    setProfile(updatedProfile);
  };

  return { profile, loading, error, updateProfile };
}
```

## Vue.js Application

```typescript
// src/composables/useAuth.ts
import { ref, computed } from 'vue';
import { createExternalAuthClient, Environment } from '@tutenet/auth-client';

const authClient = createExternalAuthClient(Environment.PRODUCTION);

const user = ref<User | null>(null);
const loading = ref(false);

export function useAuth() {
  const isAuthenticated = computed(() => !!user.value);

  const signIn = async (email: string, password: string) => {
    loading.value = true;
    try {
      const response = await authClient.signIn({ email, password });
      user.value = response.user;
      localStorage.setItem('accessToken', response.tokens.accessToken);
      return response;
    } finally {
      loading.value = false;
    }
  };

  const signOut = () => {
    user.value = null;
    localStorage.removeItem('accessToken');
  };

  return {
    user: readonly(user),
    loading: readonly(loading),
    isAuthenticated,
    signIn,
    signOut,
  };
}
```

## Angular Service

```typescript
// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { createExternalAuthClient, Environment, User, AuthResponse } from '@tutenet/auth-client';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authClient = createExternalAuthClient(Environment.PRODUCTION);
  private userSubject = new BehaviorSubject<User | null>(null);
  
  public user$ = this.userSubject.asObservable();

  async signIn(email: string, password: string): Promise<AuthResponse> {
    const response = await this.authClient.signIn({ email, password });
    this.userSubject.next(response.user);
    localStorage.setItem('accessToken', response.tokens.accessToken);
    return response;
  }

  async signOut(): Promise<void> {
    this.userSubject.next(null);
    localStorage.removeItem('accessToken');
  }

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;

    try {
      const user = await this.authClient.getCurrentUser(token);
      this.userSubject.next(user);
      return user;
    } catch (error) {
      localStorage.removeItem('accessToken');
      return null;
    }
  }
}
```

## Environment Configuration

```typescript
// src/config/environment.ts
import { Environment } from '@tutenet/client-core';

export const getEnvironment = (): Environment => {
  const hostname = window.location.hostname;
  
  if (hostname === 'tutenet.com' || hostname === 'www.tutenet.com') {
    return Environment.PRODUCTION;
  }
  
  if (hostname === 'staging.tutenet.com') {
    return Environment.STAGING;
  }
  
  return Environment.DEVELOPMENT;
};

// Usage
import { createExternalAuthClient } from '@tutenet/auth-client';
import { getEnvironment } from './config/environment';

const authClient = createExternalAuthClient(getEnvironment());
```

## Error Handling

```typescript
// src/utils/errorHandler.ts
import { 
  AuthClientError, 
  ProfileClientError,
  NetworkError,
  ValidationError 
} from '@tutenet/auth-client';

export function handleApiError(error: any): string {
  if (NetworkError.isNetworkError(error)) {
    return 'Network error. Please check your connection.';
  }
  
  if (ValidationError.isValidationError(error)) {
    return error.details ? 
      Object.values(error.details).join(', ') : 
      'Please check your input.';
  }
  
  if (AuthClientError.isAuthenticationError(error)) {
    return 'Please sign in to continue.';
  }
  
  if (ProfileClientError.isProfileNotFound(error)) {
    return 'Profile not found.';
  }
  
  return error.message || 'An unexpected error occurred.';
}
```

## TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

## Bundle Size Optimization

```typescript
// Only import what you need for smaller bundle size
import { createExternalAuthClient } from '@tutenet/auth-client';
import { createExternalProfileClient } from '@tutenet/profile-client';

// Don't import the entire client-core package
import type { Environment } from '@tutenet/client-core';
```