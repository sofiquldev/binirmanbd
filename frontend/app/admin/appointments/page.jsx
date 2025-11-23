'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminAppointmentsPage() {
  return (
    <div className="container">
      <div className="grid gap-5 lg:gap-7.5">
        <div>
          <h1 className="text-2xl font-semibold text-mono mb-2">Appointments</h1>
          <p className="text-sm text-secondary-foreground">
            Manage all appointments
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-secondary-foreground">
              Appointments list will be displayed here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

