/**
 * TuteNet Profile Client
 *
 * Official TypeScript client for TuteNet Profile Service.
 * Supports both external (public) and internal API gateways.
 */
export { ProfileClient } from './client/profileClient';
export { createProfileClient, createExternalProfileClient, createInternalProfileClient } from './client/factory';
export type { GetProfileRequest, GetProfileResponse, UpdateProfileRequestData, UpdateProfileRequest, UpdateProfileResponse, UploadAvatarRequest, UploadAvatarResponse, CreateProfileFromRegistrationRequest, CreateProfileFromRegistrationResponse, ValidateStatisticsRequest, ValidateStatisticsResponse } from './types/api';
export type { Environment, ApiType, ClientConfig, ClientError } from '@tutenet/client-core';
//# sourceMappingURL=index.d.ts.map