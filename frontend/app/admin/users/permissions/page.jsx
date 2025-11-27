'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      // Assuming there's a permissions endpoint, adjust if needed
      const response = await api.get('/permissions');
      setPermissions(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch permissions:', error);
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="grid gap-5 lg:gap-7.5">
          <Skeleton className="h-12" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="grid gap-5 lg:gap-7.5">
        <div>
          <h1 className="text-2xl font-semibold text-mono mb-2">Permissions</h1>
          <p className="text-sm text-secondary-foreground">
            Manage system permissions
          </p>
        </div>


        <Card>
          <CardHeader>
            <CardTitle>All Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            {permissions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No permissions found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {permissions.map((permission) => (
                  <div
                    key={permission.id}
                    className="p-4 border border-border rounded-lg"
                  >
                    <h3 className="font-semibold">{permission.name}</h3>
                    {permission.description && (
                      <p className="text-sm text-muted-foreground mt-1">{permission.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

