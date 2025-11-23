'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CandidateContactsPage() {
  return (
    <div className="container">
      <div className="grid gap-5 lg:gap-7.5">
      <div>
        <h1 className="text-2xl font-semibold text-mono mb-2">Contacts</h1>
        <p className="text-sm text-secondary-foreground">
          Manage your contacts
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-secondary-foreground">
            Contacts will be displayed here.
          </p>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}

