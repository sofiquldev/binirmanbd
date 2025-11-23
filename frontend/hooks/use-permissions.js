/**
 * React hook for permission checking
 * Provides easy access to permission helpers in components
 */

import { useAuth } from '@/contexts/AuthContext';
import { can, hasRole, canAny, hasAllRoles, canOrHasRole } from '@/lib/permissions';

export function usePermissions() {
  const { user } = useAuth();

  return {
    can: (privilege) => can(user, privilege),
    canAny: (privileges) => canAny(user, privileges),
    hasRole: (role) => hasRole(user, role),
    hasAllRoles: (roles) => hasAllRoles(user, roles),
    canOrHasRole: (privileges, roles) => canOrHasRole(user, privileges, roles),
    user,
  };
}

