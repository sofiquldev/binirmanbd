'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CandidateTemplatesPage() {
  return (
    <div className="container">
      <div className="grid gap-5 lg:gap-7.5">
      <div>
        <h1 className="text-2xl font-semibold text-mono mb-2">Templates</h1>
        <p className="text-sm text-secondary-foreground">
          Manage your campaign templates
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-secondary-foreground">
            Templates will be displayed here.
          </p>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}

