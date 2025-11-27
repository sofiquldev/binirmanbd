'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const userMenuItems = [
  {
    title: 'All Users',
    path: '/admin/users',
    privileges: ['users.view'],
  },
  {
    title: 'Create User',
    path: '/admin/users/create',
    privileges: ['users.create'],
  },
  {
    title: 'Roles',
    path: '/admin/users/roles',
    privileges: ['users.roles'],
  },
  {
    title: 'Permissions',
    path: '/admin/users/permissions',
    privileges: ['users.permissions'],
  },
];

export function PageNavbar() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 border-b border-border">
      {userMenuItems.map((item) => {
        const isActive = pathname === item.path || 
          (item.path !== '/admin/users' && pathname?.startsWith(item.path));
        
        return (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              'px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px',
              isActive
                ? 'text-primary border-primary'
                : 'text-muted-foreground border-transparent hover:text-foreground hover:border-muted-foreground/50'
            )}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}

