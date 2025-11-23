'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardStore } from '@/stores/use-dashboard-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { metrics, trends, loading, fetchDashboard } = useDashboardStore();

  useEffect(() => {
    if (user) {
      fetchDashboard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (loading) {
    return (
      <div className="grid gap-5 lg:gap-7.5">
        <Skeleton className="h-32" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="grid gap-5 lg:gap-7.5">
        <div>
          <h1 className="text-2xl font-semibold text-mono mb-2">Admin Dashboard</h1>
          <p className="text-sm text-secondary-foreground">
            Welcome back, {user?.name}!
          </p>
        </div>

      {metrics && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-secondary-foreground">
                  Total Donations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-mono">
                  ৳{metrics.donation_total?.toLocaleString() || '0'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-secondary-foreground">
                  Online Donations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-mono">
                  ৳{metrics.donation_online?.toLocaleString() || '0'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-secondary-foreground">
                  Feedback Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-mono">
                  {metrics.feedback_total || '0'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-secondary-foreground">
                  Resolution Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-mono">
                  {metrics.resolution_rate || '0'}%
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Donation Trends (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              {trends?.donations && (
                <div className="text-sm text-secondary-foreground">
                  Chart will be displayed here
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
      </div>
    </div>
  );
}

