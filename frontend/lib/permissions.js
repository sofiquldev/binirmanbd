/**
 * Permission helper functions for Tyro-based authorization
 * 
 * Tyro uses a role-privilege system:
 * - Roles: "super-admin", "candidate-admin", "team-member", "volunteer"
 * - Privileges: "candidates.create", "candidates.view", "users.manage", etc.
 * 
 * Users inherit privileges through their roles.
 */

/**
 * Check if user has a specific privilege
 * @param {Object} user - User object with roles and privileges
 * @param {string|string[]} privilege - Privilege(s) to check
 * @returns {boolean}
 */
export function can(user, privilege) {
  if (!user) return false;

  // Get privileges from user object
  const userPrivileges = user.privileges || [];
  
  // If no privileges, user can't do anything
  if (!userPrivileges || userPrivileges.length === 0) {
    return false;
  }

  // If checking multiple privileges, user must have ALL of them
  if (Array.isArray(privilege)) {
    return privilege.every((p) => userPrivileges.includes(p));
  }

  // Check single privilege
  return userPrivileges.includes(privilege);
}

/**
 * Check if user has any of the specified privileges
 * @param {Object} user - User object with roles and privileges
 * @param {string[]} privileges - Privileges to check
 * @returns {boolean}
 */
export function canAny(user, privileges) {
  if (!user || !privileges || privileges.length === 0) return false;

  const userPrivileges = user.privileges || [];
  return privileges.some((p) => userPrivileges.includes(p));
}

/**
 * Check if user has a specific role
 * @param {Object} user - User object with roles
 * @param {string|string[]} role - Role(s) to check
 * @returns {boolean}
 */
export function hasRole(user, role) {
  if (!user) return false;

  // Get roles from user object
  const userRoles = user.roles?.map((r) => r.slug || r.name) || 
                    user.abilities || 
                    [];

  if (Array.isArray(role)) {
    return role.some((r) => userRoles.includes(r));
  }

  return userRoles.includes(role);
}

/**
 * Check if user has all of the specified roles
 * @param {Object} user - User object with roles
 * @param {string[]} roles - Roles to check
 * @returns {boolean}
 */
export function hasAllRoles(user, roles) {
  if (!user || !roles || roles.length === 0) return false;

  const userRoles = user.roles?.map((r) => r.slug || r.name) || 
                    user.abilities || 
                    [];

  return roles.every((r) => userRoles.includes(r));
}

/**
 * Check if user has any of the specified privileges or roles
 * Useful for menu items that can be accessed by either privilege or role
 * @param {Object} user - User object with roles and privileges
 * @param {string[]} privileges - Privileges to check
 * @param {string[]} roles - Roles to check (fallback)
 * @returns {boolean}
 */
export function canOrHasRole(user, privileges = [], roles = []) {
  if (!user) return false;

  // If no restrictions, allow access
  if (privileges.length === 0 && roles.length === 0) {
    return true;
  }

  // Check privileges first
  if (privileges.length > 0 && canAny(user, privileges)) {
    return true;
  }

  // Fallback to role check
  if (roles.length > 0 && hasRole(user, roles)) {
    return true;
  }

  return false;
}

