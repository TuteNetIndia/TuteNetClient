/**
 * Environment configuration for TuteNet clients
 */
/**
 * Supported environments
 */
export declare enum Environment {
    DEVELOPMENT = "development",
    STAGING = "staging",
    PRODUCTION = "production"
}
/**
 * API types (external vs internal)
 */
export declare enum ApiType {
    EXTERNAL = "external",// Public API Gateway
    INTERNAL = "internal"
}
/**
 * Client configuration interface
 */
export interface ClientConfig {
    /** Target environment */
    environment: Environment;
    /** API type (external or internal) */
    apiType: ApiType;
    /** Request timeout in milliseconds */
    timeout?: number;
    /** Number of retry attempts */
    retries?: number;
    /** Enable debug logging */
    debug?: boolean;
    /** Authentication token */
    authToken?: string;
    /** Custom headers */
    headers?: Record<string, string>;
}
/**
 * Environment-specific API endpoints
 * No need to pass these as environment variables - they're built into the client
 */
export declare const ENDPOINTS: {
    readonly development: {
        readonly external: "https://dev-api.tutenet.com/v1";
        readonly internal: "https://dev-internal-api.tutenet.com";
    };
    readonly staging: {
        readonly external: "https://staging-api.tutenet.com/v1";
        readonly internal: "https://staging-internal-api.tutenet.com";
    };
    readonly production: {
        readonly external: "https://api.tutenet.com/v1";
        readonly internal: "https://internal-api.tutenet.com";
    };
};
/**
 * Default client configuration
 */
export declare const DEFAULT_CONFIG: Partial<ClientConfig>;
/**
 * Auto-detect environment from process.env
 */
export declare function detectEnvironment(): Environment;
/**
 * Get API endpoint for environment and type
 */
export declare function getEndpoint(environment: Environment, apiType: ApiType): string;
/**
 * Validate environment configuration
 */
export declare function validateConfig(config: ClientConfig): void;
//# sourceMappingURL=environment.d.ts.map