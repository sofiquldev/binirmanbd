import CryptoJS from 'crypto-js';

/**
 * Gravatar avatar types
 * 
 * Available types:
 * - identicon: Geometric pattern based on email hash (default)
 * - monsterid: Generated monster with different colors, faces, etc
 * - wavatar: Generated faces with differing features and backgrounds
 * - retro: Awesome generated, 8-bit arcade-style pixelated faces
 * - robohash: A generated robot with different colors, faces, etc
 * - blank: A transparent PNG image
 * - mp: A simple, cartoon-style silhouetted outline of a person
 * - 404: Returns HTTP 404 (File Not Found) error
 * 
 * Usage example:
 * ```js
 * import { getGravatarUrl, GRAVATAR_TYPES } from '@/lib/utils/gravatar';
 * 
 * // Use identicon (default)
 * const url1 = getGravatarUrl('user@example.com');
 * 
 * // Use monsterid
 * const url2 = getGravatarUrl('user@example.com', { default: GRAVATAR_TYPES.MONSTERID });
 * 
 * // Use wavatar
 * const url3 = getGravatarUrl('user@example.com', { default: GRAVATAR_TYPES.WAVATAR });
 * ```
 */
export const GRAVATAR_TYPES = {
  IDENTICON: 'identicon',
  MONSTERID: 'monsterid',
  WAVATAR: 'wavatar',
  RETRO: 'retro',
  ROBOHASH: 'robohash',
  BLANK: 'blank',
  MP: 'mp',
  NOT_FOUND: '404',
};

/**
 * Generate Gravatar URL from email
 * @param {string} email - User email address
 * @param {object} options - Gravatar options
 * @param {number} options.size - Image size in pixels (default: 40)
 * @param {string} options.default - Default image type (default: 'identicon')
 * @param {string} options.rating - Image rating: g, pg, r, x (default: 'g')
 * @returns {string|null} Gravatar URL or null if email is invalid
 */
export const getGravatarUrl = (email, options = {}) => {
  if (!email || typeof email !== 'string') return null;

  try {
    // Generate MD5 hash of email (lowercased and trimmed)
    const hash = CryptoJS.MD5(email.toLowerCase().trim()).toString();

    // Default options
    const {
      size = 40,
      default: defaultType = GRAVATAR_TYPES.IDENTICON,
      rating = 'g',
    } = options;

    // Build query parameters
    const params = new URLSearchParams({
      s: size.toString(),
      d: defaultType,
      r: rating,
    });

    return `https://www.gravatar.com/avatar/${hash}?${params.toString()}`;
  } catch (e) {
    console.error('Error generating Gravatar URL:', e);
    return null;
  }
};

/**
 * Get user avatar URL (Gravatar or fallback)
 * @param {object} user - User object
 * @param {string} user.email - User email
 * @param {string} user.image - User custom image URL (optional)
 * @param {object} options - Gravatar options
 * @returns {string|null} Avatar URL or null
 */
export const getUserAvatarUrl = (user, options = {}) => {
  if (!user) return null;

  // If user has custom image, use it
  if (user.image) {
    return user.image;
  }

  // Otherwise use Gravatar
  if (user.email) {
    return getGravatarUrl(user.email, options);
  }

  return null;
};

