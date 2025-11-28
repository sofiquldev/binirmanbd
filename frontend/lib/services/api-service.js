/**
 * API Service
 * Centralized API service with caching and error handling
 */

import api from '@/lib/api';
import { getCache, setCache, clearCacheByPattern } from '@/lib/utils/cache';
import { CACHE_CONFIG } from '@/lib/constants';

/**
 * Generic API request with caching
 * @param {string} endpoint - API endpoint
 * @param {object} options - Request options
 * @param {boolean} useCache - Whether to use cache (default: true)
 * @returns {Promise<any>} API response
 */
export async function apiRequest(endpoint, options = {}, useCache = true) {
  const { method = 'GET', data, params, cacheKey } = options;

  // Generate cache key if not provided
  const key = cacheKey || `api:${method}:${endpoint}:${JSON.stringify(params || {})}`;

  // Try to get from cache for GET requests
  if (useCache && method === 'GET') {
    const cached = getCache(key, CACHE_CONFIG.STALE_TIME);
    if (cached) {
      return cached;
    }
  }

  try {
    let response;

    switch (method.toUpperCase()) {
      case 'GET':
        response = await api.get(endpoint, { params });
        break;
      case 'POST':
        response = await api.post(endpoint, data);
        break;
      case 'PUT':
        response = await api.put(endpoint, data);
        break;
      case 'PATCH':
        response = await api.patch(endpoint, data);
        break;
      case 'DELETE':
        response = await api.delete(endpoint);
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }

    // Cache GET responses
    if (useCache && method === 'GET' && response.data) {
      setCache(key, response.data);
    }

    return response.data;
  } catch (error) {
    console.error(`API Error [${method} ${endpoint}]:`, error);
    throw error;
  }
}

/**
 * Invalidate cache for a specific endpoint pattern
 * @param {string} pattern - Pattern to match cache keys
 */
export function invalidateCache(pattern) {
  clearCacheByPattern(pattern);
}

/**
 * Candidate Service
 */
export const candidateService = {
  getAll: (params) => apiRequest('/candidates', { params }),
  getById: (id) => apiRequest(`/candidates/${id}`),
  create: (data) => apiRequest('/candidates', { method: 'POST', data }, false),
  update: (id, data) => apiRequest(`/candidates/${id}`, { method: 'PUT', data }, false),
  delete: (id) => apiRequest(`/candidates/${id}`, { method: 'DELETE' }, false),
  invalidateCache: () => invalidateCache('api:GET:/candidates'),
};

/**
 * Party Service
 */
export const partyService = {
  getAll: (params) => apiRequest('/parties', { params }),
  getById: (id) => apiRequest(`/parties/${id}`),
  create: (data) => apiRequest('/parties', { method: 'POST', data }, false),
  update: (id, data) => apiRequest(`/parties/${id}`, { method: 'PUT', data }, false),
  delete: (id) => apiRequest(`/parties/${id}`, { method: 'DELETE' }, false),
  invalidateCache: () => invalidateCache('api:GET:/parties'),
};

/**
 * Constituency Service
 */
export const constituencyService = {
  getAll: (params) => apiRequest('/constituencies', { params }),
  getById: (id) => apiRequest(`/constituencies/${id}`),
  create: (data) => apiRequest('/constituencies', { method: 'POST', data }, false),
  update: (id, data) => apiRequest(`/constituencies/${id}`, { method: 'PUT', data }, false),
  delete: (id) => apiRequest(`/constituencies/${id}`, { method: 'DELETE' }, false),
  invalidateCache: () => invalidateCache('api:GET:/constituencies'),
};

/**
 * Feedback Service
 */
export const feedbackService = {
  getAll: (params) => apiRequest('/feedback', { params }),
  getById: (id) => apiRequest(`/feedback/${id}`),
  create: (data) => apiRequest('/feedback', { method: 'POST', data }, false),
  update: (id, data) => apiRequest(`/feedback/${id}`, { method: 'PUT', data }, false),
  delete: (id) => apiRequest(`/feedback/${id}`, { method: 'DELETE' }, false),
  invalidateCache: () => invalidateCache('api:GET:/feedback'),
};

/**
 * Manifesto Service
 */
export const manifestoService = {
  getAll: (params) => apiRequest('/manifestos', { params }),
  getById: (id) => apiRequest(`/manifestos/${id}`),
  getByCandidate: (candidateId, params) =>
    apiRequest(`/candidates/${candidateId}/manifestos`, { params }),
  create: (data) => apiRequest('/manifestos', { method: 'POST', data }, false),
  update: (id, data) => apiRequest(`/manifestos/${id}`, { method: 'PUT', data }, false),
  delete: (id) => apiRequest(`/manifestos/${id}`, { method: 'DELETE' }, false),
  invalidateCache: () => invalidateCache('api:GET:/manifestos'),
};

