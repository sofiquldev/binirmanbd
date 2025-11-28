import {
  LayoutGrid,
  Users,
  FileText,
  Wallet,
  MessageSquare,
  Book,
  Calendar,
  Megaphone,
  CalendarCheck,
  BarChart3,
  Settings,
  UserCircle,
  ScrollText,
  FolderTree,
} from 'lucide-react';
import menuConfig from './menu.json';
import { can, hasRole, canOrHasRole } from '@/lib/permissions';

// Icon mapping
const iconMap = {
  LayoutGrid,
  Users,
  FileText,
  Wallet,
  MessageSquare,
  Book,
  Calendar,
  Megaphone,
  CalendarCheck,
  BarChart3,
  Settings,
  UserCircle,
  ScrollText,
  FolderTree,
};

// Convert JSON menu to React component format
function convertMenuItems(items) {
  return items.map((item) => {
    const converted = {
      ...item,
    };

    // Convert icon string to component
    if (item.icon && typeof item.icon === 'string') {
      converted.icon = iconMap[item.icon];
    }

    // Convert children recursively
    if (item.children && Array.isArray(item.children)) {
      converted.children = convertMenuItems(item.children);
    }

    // Keep both permissions (privileges) and roles for flexibility
    // No conversion needed - we'll use them as-is in filtering

    return converted;
  });
}

// Load menu from JSON
export const APP_MENU = convertMenuItems(menuConfig.menu);

// Helper function to filter menu by user permissions and roles
// Supports both Tyro privileges and roles
export function filterMenuByRole(menu, user) {
  if (!user) {
    // If no user, show only items without restrictions
    return menu.filter((item) => {
      if (item.heading) return true;
      return !item.privileges && !item.roles;
    });
  }

  return menu.filter((item) => {
    // Always show headings
    if (item.heading) return true;
    
    // Show items without restrictions
    if (!item.privileges && !item.roles) return true;
    
    // Check privileges first (more granular)
    if (item.privileges && item.privileges.length > 0) {
      return can(user, item.privileges);
    }
    
    // Fallback to role check
    if (item.roles && item.roles.length > 0) {
      return hasRole(user, item.roles);
    }
    
    return false;
  }).map((item) => {
    // Recursively filter children
    if (item.children) {
      const filteredChildren = filterMenuByRole(item.children, user);
      // Only include parent if it has visible children or no restrictions
      if (filteredChildren.length > 0 || (!item.privileges && !item.roles)) {
        return {
          ...item,
          children: filteredChildren,
        };
      }
      return null;
    }
    return item;
  }).filter(Boolean); // Remove null items
}
