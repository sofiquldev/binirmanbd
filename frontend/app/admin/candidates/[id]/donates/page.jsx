'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CandidateDonatesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Donations</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-secondary-foreground">
          Donation list will be displayed here.
        </p>
      </CardContent>
    </Card>
  );
}

