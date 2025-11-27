'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CandidateFeedbacksPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Feedbacks</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-secondary-foreground">
          Feedback list will be displayed here.
        </p>
      </CardContent>
    </Card>
  );
}

