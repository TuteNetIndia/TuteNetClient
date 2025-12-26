"use strict";
/**
 * TuteNet Client Core
 *
 * Shared utilities, types, and base client for all TuteNet service clients.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeArray = exports.sanitizeString = exports.validateRequired = exports.validateEmail = exports.exponentialBackoff = exports.retry = exports.isRetryableError = exports.isClientError = exports.createErrorFromResponse = exports.TimeoutError = exports.ServiceUnavailableError = exports.RateLimitError = exports.ConflictError = exports.NotFoundError = exports.AuthorizationError = exports.AuthenticationError = exports.ServerError = exports.ValidationError = exports.NetworkError = exports.ClientError = exports.BaseClient = exports.detectEnvironment = exports.ApiType = exports.Environment = void 0;
// Environment and configuration
var environment_1 = require("./config/environment");
Object.defineProperty(exports, "Environment", { enumerable: true, get: function () { return environment_1.Environment; } });
Object.defineProperty(exports, "ApiType", { enumerable: true, get: function () { return environment_1.ApiType; } });
Object.defineProperty(exports, "detectEnvironment", { enumerable: true, get: function () { return environment_1.detectEnvironment; } });
// Base client and HTTP utilities
var baseClient_1 = require("./client/baseClient");
Object.defineProperty(exports, "BaseClient", { enumerable: true, get: function () { return baseClient_1.BaseClient; } });
// Error handling
var clientErrors_1 = require("./errors/clientErrors");
Object.defineProperty(exports, "ClientError", { enumerable: true, get: function () { return clientErrors_1.ClientError; } });
Object.defineProperty(exports, "NetworkError", { enumerable: true, get: function () { return clientErrors_1.NetworkError; } });
Object.defineProperty(exports, "ValidationError", { enumerable: true, get: function () { return clientErrors_1.ValidationError; } });
Object.defineProperty(exports, "ServerError", { enumerable: true, get: function () { return clientErrors_1.ServerError; } });
Object.defineProperty(exports, "AuthenticationError", { enumerable: true, get: function () { return clientErrors_1.AuthenticationError; } });
Object.defineProperty(exports, "AuthorizationError", { enumerable: true, get: function () { return clientErrors_1.AuthorizationError; } });
Object.defineProperty(exports, "NotFoundError", { enumerable: true, get: function () { return clientErrors_1.NotFoundError; } });
Object.defineProperty(exports, "ConflictError", { enumerable: true, get: function () { return clientErrors_1.ConflictError; } });
Object.defineProperty(exports, "RateLimitError", { enumerable: true, get: function () { return clientErrors_1.RateLimitError; } });
Object.defineProperty(exports, "ServiceUnavailableError", { enumerable: true, get: function () { return clientErrors_1.ServiceUnavailableError; } });
Object.defineProperty(exports, "TimeoutError", { enumerable: true, get: function () { return clientErrors_1.TimeoutError; } });
Object.defineProperty(exports, "createErrorFromResponse", { enumerable: true, get: function () { return clientErrors_1.createErrorFromResponse; } });
Object.defineProperty(exports, "isClientError", { enumerable: true, get: function () { return clientErrors_1.isClientError; } });
Object.defineProperty(exports, "isRetryableError", { enumerable: true, get: function () { return clientErrors_1.isRetryableError; } });
// Utilities
var retry_1 = require("./utils/retry");
Object.defineProperty(exports, "retry", { enumerable: true, get: function () { return retry_1.retry; } });
Object.defineProperty(exports, "exponentialBackoff", { enumerable: true, get: function () { return retry_1.exponentialBackoff; } });
var validation_1 = require("./utils/validation");
Object.defineProperty(exports, "validateEmail", { enumerable: true, get: function () { return validation_1.validateEmail; } });
Object.defineProperty(exports, "validateRequired", { enumerable: true, get: function () { return validation_1.validateRequired; } });
var sanitization_1 = require("./utils/sanitization");
Object.defineProperty(exports, "sanitizeString", { enumerable: true, get: function () { return sanitization_1.sanitizeString; } });
Object.defineProperty(exports, "sanitizeArray", { enumerable: true, get: function () { return sanitization_1.sanitizeArray; } });
//# sourceMappingURL=index.js.map