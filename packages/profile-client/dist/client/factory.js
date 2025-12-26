"use strict";
/**
 * Factory functions for creating Profile Service clients
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProfileClient = createProfileClient;
exports.createExternalProfileClient = createExternalProfileClient;
exports.createInternalProfileClient = createInternalProfileClient;
exports.createAutoProfileClient = createAutoProfileClient;
exports.createTestProfileClient = createTestProfileClient;
const client_core_1 = require("@tutenet/client-core");
const profileClient_1 = require("./profileClient");
/**
 * Create Profile Service client with custom configuration
 */
function createProfileClient(environment, apiType = client_core_1.ApiType.EXTERNAL, options) {
    const config = {
        environment,
        apiType,
        ...options,
    };
    return new profileClient_1.ProfileClient(config);
}
/**
 * Create external (public) Profile Service client
 */
function createExternalProfileClient(environment, options) {
    return createProfileClient(environment, client_core_1.ApiType.EXTERNAL, options);
}
/**
 * Create internal Profile Service client
 */
function createInternalProfileClient(environment, options) {
    return createProfileClient(environment, client_core_1.ApiType.INTERNAL, options);
}
/**
 * Create Profile Service client with auto-detected environment
 */
function createAutoProfileClient(apiType = client_core_1.ApiType.EXTERNAL, options) {
    const environment = (0, client_core_1.detectEnvironment)();
    return createProfileClient(environment, apiType, options);
}
/**
 * Create Profile Service client for testing
 */
function createTestProfileClient(options) {
    return createProfileClient(client_core_1.Environment.DEVELOPMENT, client_core_1.ApiType.EXTERNAL, {
        debug: true,
        timeout: 5000,
        retries: 0,
        ...options,
    });
}
//# sourceMappingURL=factory.js.map