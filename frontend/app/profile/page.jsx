'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function ProfilePage() {
  const { user } = useAuth();

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="container">
      <div className="grid gap-5 lg:gap-7.5">
      <div>
        <h1 className="text-2xl font-semibold text-mono mb-2">Profile</h1>
        <p className="text-sm text-secondary-foreground">
          Manage your profile information
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="size-20 border-2 border-green-500">
              <AvatarFallback className="bg-accent/60 text-foreground font-semibold text-xl">
                {getUserInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold text-mono">{user?.name}</h2>
              <p className="text-sm text-secondary-foreground">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-secondary-foreground">Name</label>
              <p className="text-sm text-mono">{user?.name || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-secondary-foreground">Email</label>
              <p className="text-sm text-mono">{user?.email || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-secondary-foreground">Roles</label>
              <p className="text-sm text-mono">
                {user?.roles?.map((r) => r.slug || r.name).join(', ') || 'No roles'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}

