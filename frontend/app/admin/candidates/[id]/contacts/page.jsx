'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CandidateContactsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contacts</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-secondary-foreground">
          Contact list will be displayed here.
        </p>
      </CardContent>
    </Card>
  );
}

