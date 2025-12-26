"use strict";
/**
 * Sanitization utilities
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeString = sanitizeString;
exports.sanitizeArray = sanitizeArray;
function sanitizeString(value) {
    if (typeof value !== 'string') {
        return '';
    }
    return value.trim();
}
function sanitizeArray(value) {
    if (!Array.isArray(value)) {
        return [];
    }
    return value.filter(item => item !== null && item !== undefined);
}
//# sourceMappingURL=sanitization.js.map