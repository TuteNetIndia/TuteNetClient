"use strict";
/**
 * Validation utilities
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmail = validateEmail;
exports.validateRequired = validateRequired;
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function validateRequired(value, fieldName) {
    if (value === null || value === undefined || value === '') {
        throw new Error(`${fieldName} is required`);
    }
}
//# sourceMappingURL=validation.js.map