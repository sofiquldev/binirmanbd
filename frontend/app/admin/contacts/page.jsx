'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminContactsPage() {
  return (
    <div className="container">
      <div className="grid gap-5 lg:gap-7.5">
        <div>
          <h1 className="text-2xl font-semibold text-mono mb-2">Contacts</h1>
          <p className="text-sm text-secondary-foreground">
            Manage all contacts
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-secondary-foreground">
              Contacts list will be displayed here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

