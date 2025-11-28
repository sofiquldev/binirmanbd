'use client';

import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { User, DollarSign, Layout, FileText, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const SIDEBAR_ITEMS = [
  { id: 'profile', label: 'Profile', icon: User, path: 'profile' },
  { id: 'donation', label: 'Donation', icon: DollarSign, path: 'donation' },
  { id: 'template', label: 'Template', icon: Layout, path: 'template' },
  { id: 'page-management', label: 'Page Management', icon: FileText, path: 'page-management' },
];

export default function SettingsLayout({ children }) {
  const params = useParams();
  const pathname = usePathname();
  const candidateId = params.id;

  // Determine active section from pathname
  const activeSection = pathname?.split('/').pop() || 'profile';

  return (
    <div className="container">
      <div className="grid gap-5 lg:gap-7.5">
        <div>
          <h1 className="text-2xl font-semibold text-mono mb-2">Settings</h1>
          <p className="text-sm text-secondary-foreground">
            Manage candidate settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 lg:gap-7.5">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-0">
                <nav className="flex flex-col">
                  {SIDEBAR_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.path;
                    const href = `/admin/candidates/${candidateId}/settings/${item.path}`;
                    
                    return (
                      <Link
                        key={item.id}
                        href={href}
                        className={cn(
                          'flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-accent text-primary border-l-2 border-primary'
                            : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                        )}
                      >
                        <Icon className="size-4" />
                        <span className="flex-1 text-left">{item.label}</span>
                        {isActive && <ChevronRight className="size-4" />}
                      </Link>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">{children}</div>
        </div>
      </div>
    </div>
  );
}

