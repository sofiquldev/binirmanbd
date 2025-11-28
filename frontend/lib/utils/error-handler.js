/**
 * Error Handler Utilities
 * Centralized error handling and formatting
 */

import { ERROR_MESSAGES } from '@/lib/constants';

/**
 * Format error message for display
 * @param {Error|object} error - Error object
 * @returns {string} User-friendly error message
 */
export function formatErrorMessage(error) {
  if (!error) return ERROR_MESSAGES.SERVER_ERROR;

  // Handle Axios errors
  if (error.response) {
    const { status, data } = error.response;

    // Handle validation errors (422)
    if (status === 422 && data.errors) {
      const firstError = Object.values(data.errors)[0];
      return Array.isArray(firstError) ? firstError[0] : firstError;
    }

    // Handle specific error messages
    if (data?.message) {
      return data.message;
    }

    // Handle status codes
    switch (status) {
      case 401:
        return ERROR_MESSAGES.UNAUTHORIZED;
      case 404:
        return ERROR_MESSAGES.NOT_FOUND;
      case 500:
        return ERROR_MESSAGES.SERVER_ERROR;
      default:
        return data?.error || ERROR_MESSAGES.SERVER_ERROR;
    }
  }

  // Handle network errors
  if (error.request) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  // Handle generic errors
  if (error.message) {
    return error.message;
  }

  return ERROR_MESSAGES.SERVER_ERROR;
}

/**
 * Log error for debugging
 * @param {Error|object} error - Error object
 * @param {string} context - Context where error occurred
 */
export function logError(error, context = '') {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[Error${context ? ` in ${context}` : ''}]:`, error);
  }
  // In production, you might want to send to error tracking service
  // e.g., Sentry, LogRocket, etc.
}

/**
 * Handle API error with user notification
 * @param {Error|object} error - Error object
 * @param {function} showToast - Toast notification function
 * @param {string} context - Context where error occurred
 */
export function handleApiError(error, showToast, context = '') {
  const message = formatErrorMessage(error);
  logError(error, context);
  
  if (showToast) {
    showToast({
      title: 'Error',
      description: message,
      variant: 'destructive',
    });
  }
  
  return message;
}

