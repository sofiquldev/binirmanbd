'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CandidateNoticesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notices</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-secondary-foreground">
          Notices list will be displayed here.
        </p>
      </CardContent>
    </Card>
  );
}

