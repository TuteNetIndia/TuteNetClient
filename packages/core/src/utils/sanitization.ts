/**
 * Sanitization utilities
 */

export function sanitizeString(value: string): string {
  if (typeof value !== 'string') {
    return '';
  }
  return value.trim();
}

export function sanitizeArray(value: any[]): any[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter(item => item !== null && item !== undefined);
}