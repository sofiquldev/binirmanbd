'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RolesSettingsPage() {
  return (
    <div className="container">
      <div className="grid gap-5 lg:gap-7.5">
        <div>
          <h1 className="text-2xl font-semibold text-mono mb-2">Roles & Permissions</h1>
          <p className="text-sm text-secondary-foreground">
            Manage roles and permissions
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Roles & Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-secondary-foreground">
              Roles and permissions management will be available here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

