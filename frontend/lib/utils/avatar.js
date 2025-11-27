import { getUserAvatarUrl } from './gravatar';

/**
 * Get user initials for avatar fallback
 * @param {object} user - User object
 * @param {string} user.name - User name
 * @param {string} user.email - User email (fallback)
 * @param {number} count - Number of initials to return (default: 2)
 * @returns {string} User initials
 */
export const getUserInitials = (user, count = 2) => {
  if (!user) return 'U';

  if (user.name && typeof user.name === 'string') {
    const parts = user.name.trim().split(/\s+/);
    if (parts.length >= count) {
      return parts
        .slice(0, count)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');
    }
    return parts.map((part) => part.charAt(0).toUpperCase()).join('');
  }

  if (user.email) {
    return user.email.charAt(0).toUpperCase();
  }

  return 'U';
};

/**
 * Get avatar props for Avatar component
 * @param {object} user - User object
 * @param {object} options - Options
 * @param {number} options.size - Avatar size (default: 40)
 * @param {string} options.gravatarType - Gravatar type (default: 'identicon')
 * @returns {object} Avatar props
 */
export const getAvatarProps = (user, options = {}) => {
  const { size = 40, gravatarType = 'identicon' } = options;

  return {
    src: getUserAvatarUrl(user, { size, default: gravatarType }),
    alt: user?.name || user?.email || 'User',
    initials: getUserInitials(user),
  };
};

