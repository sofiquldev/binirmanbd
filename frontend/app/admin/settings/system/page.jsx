'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SystemSettingsPage() {
  return (
    <div className="container">
      <div className="grid gap-5 lg:gap-7.5">
        <div>
          <h1 className="text-2xl font-semibold text-mono mb-2">System Settings</h1>
          <p className="text-sm text-secondary-foreground">
            Manage system configuration
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>System Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-secondary-foreground">
              System settings configuration will be available here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

