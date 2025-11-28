'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from 'lucide-react';

export default function TemplateSettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layout className="size-5" />
          Template Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Template management will be available here.
        </p>
      </CardContent>
    </Card>
  );
}

