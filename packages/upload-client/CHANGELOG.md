# Changelog

All notable changes to the @tutenet/upload-client package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2026-01-05

### Added ⭐ NEW FEATURES

#### Content Access API
- **AccessClient**: New client class for secure content access
- **App-Only Security**: URLs with app-specific security parameters that prevent browser access
- **Shortened Expiration Times**: 30 min for view, 15 min for stream, 1 hour for download
- **Token-Based Validation**: Encrypted access tokens with user/resource context
- **Replay Attack Protection**: Unique nonce and timestamp in each request

#### Security Features
- `getContentAccess()` - Generate secure content access URLs
- `validateSecurityParams()` - Client-side security parameter validation
- `isUrlExpired()` - Check if content URL has expired
- `getTimeUntilExpiration()` - Get seconds remaining until URL expires

#### Content Access Types
- **VIEW**: For viewing documents and images (30 minute expiration)
- **STREAM**: For streaming video content (15 minute expiration)
- **DOWNLOAD**: For downloading files for offline use (1 hour expiration)

#### Enhanced Response Data
- **ContentMetadata**: Comprehensive file information (type, size, dimensions, duration)
- **ViewingOptions**: Security level, offline support, printing/sharing permissions
- **CacheHeaders**: Optimized cache control for client-side caching

### Enhanced

#### API Documentation
- Updated OpenAPI specification to v1.1.0
- Added comprehensive Content Access API documentation
- New Swagger UI examples for all access types
- Added security parameter documentation

#### TypeScript Support
- New types: `ContentAccessType`, `ContentMetadata`, `ViewingOptions`
- Enhanced type safety for content access operations
- Full IntelliSense support for new APIs

#### Client Package
- Updated package description to include content access
- Added security-related keywords
- Enhanced README with comprehensive examples
- Added migration guide from direct S3 URLs

### Security Improvements

#### URL Security
- App-specific security parameters in all content URLs
- Encrypted access tokens with expiration validation
- Resource and user ID binding for access validation
- Security version tracking for future compatibility

#### Mobile App Integration
- Certificate pinning support documentation
- Secure storage recommendations
- User-Agent validation guidelines
- Rate limiting and error handling best practices

### Documentation

#### New Guides
- **Content Access Guide**: Comprehensive integration guide
- **Security Best Practices**: Mobile app security recommendations
- **Migration Guide**: Upgrading from direct S3 URLs
- **Performance Optimization**: Caching and preloading strategies

#### API Reference
- Complete OpenAPI 3.0.3 specification
- Interactive Swagger UI documentation
- Request/response examples for all endpoints
- Error code documentation

### Breaking Changes

None. This release is fully backward compatible.

### Migration Notes

#### For New Content Access Features
```typescript
// Before: Direct S3 URLs (if used)
const directUrl = 'https://bucket.s3.amazonaws.com/file.pdf';

// After: Secure content access
import { AccessClient, ContentAccessType } from '@tutenet/upload-client';

const accessClient = new AccessClient({
  environment: Environment.STAGING,
  accessToken: 'your-jwt-token'
});

const response = await accessClient.getContentAccess(
  'resource-123',
  ContentAccessType.VIEW
);

if (response.success) {
  const { contentUrl } = response.data;
  // Use contentUrl with proper validation
}
```

#### For Existing Upload Operations
No changes required. All existing UploadClient functionality remains unchanged.

### Dependencies

- Requires `@tutenet/client-core` for base client functionality
- Compatible with existing authentication mechanisms
- No new external dependencies added

### Performance

#### Optimizations
- Shortened URL expiration times reduce security exposure
- Client-side validation reduces server round trips
- Enhanced cache headers improve client-side caching
- Batch request support for multiple content URLs

#### Metrics
- Content access API response time: < 500ms (target)
- Security validation: < 10ms client-side
- URL generation: < 300ms server-side

### Testing

#### New Test Coverage
- AccessClient unit tests
- Security parameter validation tests
- URL expiration handling tests
- Error scenario coverage

#### Integration Tests
- End-to-end content access flow
- Security parameter validation
- Rate limiting behavior
- Cache header functionality

---

## [2.0.0] - 2025-12-01

### Added
- Enhanced resource structure API
- Bulk upload operations
- Advanced search capabilities
- Resource analytics integration

### Changed
- Updated to use new API endpoints
- Improved error handling
- Enhanced TypeScript definitions

### Deprecated
- Legacy upload methods (will be removed in v3.0.0)

---

## [1.0.0] - 2025-11-01

### Added
- Initial release
- Basic upload functionality
- Resource CRUD operations
- Authentication support
- TypeScript definitions

---

## Security Advisories

### [2.1.0] Security Enhancements

This release introduces significant security improvements:

1. **App-Only Access**: Content URLs now require app-specific validation
2. **Shortened Expiration**: Reduced URL lifetime minimizes security exposure
3. **Token Validation**: Encrypted tokens prevent unauthorized access
4. **Replay Protection**: Unique nonces prevent replay attacks

**Recommendation**: Upgrade to v2.1.0 immediately to benefit from enhanced security features.

### Migration Timeline

- **Immediate**: New projects should use AccessClient for content access
- **Q1 2026**: Existing projects should migrate from direct S3 URLs
- **Q2 2026**: Direct S3 URL access will be deprecated
- **Q3 2026**: Direct S3 URL access will be removed

---

## Support

For questions about this release:
- **Documentation**: https://docs.tutenet.com/api/v1
- **Support Email**: api-support@tutenet.com
- **GitHub Issues**: https://github.com/tutenet/client/issues

---

**Note**: This changelog follows [Keep a Changelog](https://keepachangelog.com/) format. For the complete version history, see the [releases page](https://github.com/tutenet/client/releases).