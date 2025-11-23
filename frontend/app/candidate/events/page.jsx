'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CandidateEventsPage() {
  return (
    <div className="container">
      <div className="grid gap-5 lg:gap-7.5">
      <div>
        <h1 className="text-2xl font-semibold text-mono mb-2">Events</h1>
        <p className="text-sm text-secondary-foreground">
          Manage campaign events
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Events</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-secondary-foreground">
            Events will be displayed here.
          </p>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}

