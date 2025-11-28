/**
 * Validation Utilities
 * Common validation functions
 */

import { VALIDATION } from '@/lib/constants';

/**
 * Validate email
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export function isValidEmail(email) {
  if (!email) return false;
  return VALIDATION.EMAIL_REGEX.test(email);
}

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
export function isValidPhone(phone) {
  if (!phone) return false;
  return VALIDATION.PHONE_REGEX.test(phone);
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} Validation result with isValid and errors
 */
export function validatePassword(password) {
  const errors = [];

  if (!password) {
    return { isValid: false, errors: ['Password is required'] };
  }

  if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
    errors.push(`Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`);
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate name
 * @param {string} name - Name to validate
 * @returns {object} Validation result
 */
export function validateName(name) {
  if (!name || name.trim().length < VALIDATION.NAME_MIN_LENGTH) {
    return {
      isValid: false,
      error: `Name must be at least ${VALIDATION.NAME_MIN_LENGTH} characters`,
    };
  }

  if (name.length > VALIDATION.NAME_MAX_LENGTH) {
    return {
      isValid: false,
      error: `Name must be less than ${VALIDATION.NAME_MAX_LENGTH} characters`,
    };
  }

  return { isValid: true };
}

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid
 */
export function isValidUrl(url) {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

