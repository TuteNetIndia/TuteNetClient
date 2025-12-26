"use strict";
/**
 * TuteNet Profile Client
 *
 * Official TypeScript client for TuteNet Profile Service.
 * Supports both external (public) and internal API gateways.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInternalProfileClient = exports.createExternalProfileClient = exports.createProfileClient = exports.ProfileClient = void 0;
// Client class and factory functions
var profileClient_1 = require("./client/profileClient");
Object.defineProperty(exports, "ProfileClient", { enumerable: true, get: function () { return profileClient_1.ProfileClient; } });
var factory_1 = require("./client/factory");
Object.defineProperty(exports, "createProfileClient", { enumerable: true, get: function () { return factory_1.createProfileClient; } });
Object.defineProperty(exports, "createExternalProfileClient", { enumerable: true, get: function () { return factory_1.createExternalProfileClient; } });
Object.defineProperty(exports, "createInternalProfileClient", { enumerable: true, get: function () { return factory_1.createInternalProfileClient; } });
//# sourceMappingURL=index.js.map