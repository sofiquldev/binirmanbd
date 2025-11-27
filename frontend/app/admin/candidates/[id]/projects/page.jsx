'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CandidateProjectsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-secondary-foreground">
          Projects list will be displayed here.
        </p>
      </CardContent>
    </Card>
  );
}

