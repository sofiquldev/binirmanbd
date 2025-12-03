'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Users, Save, LoaderCircleIcon, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useCandidatesStore } from '@/stores/use-candidates-store';

export default function UsersSettingsPage() {
  const params = useParams();
  const candidateId = params.id;
  const { candidate, fetchCandidate } = useCandidatesStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [users, setUsers] = useState([]);
  const [assignedUserIds, setAssignedUserIds] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (candidateId) {
      fetchCandidate(candidateId).then(() => {
        if (candidate?.users) {
          setAssignedUserIds(new Set(candidate.users.map(u => u.id)));
        }
        setLoading(false);
      });
    }
  }, [candidateId, fetchCandidate]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users', {
        params: {
          per_page: 1000,
        },
      });
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
    }
  };

  const handleToggleUser = (userId) => {
    setAssignedUserIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post(`/candidates/${candidateId}/sync-users`, {
        user_ids: Array.from(assignedUserIds),
      });
      toast.success('Users assigned successfully');
      
      // Reload candidate to get updated users
      await fetchCandidate(candidateId);
    } catch (error) {
      console.error('Failed to save users:', error);
      toast.error(error.response?.data?.message || 'Failed to assign users');
    } finally {
      setSaving(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="size-5" />
            Assign Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="size-5" />
          Assign Users
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Select users who can manage this candidate. These users will be able to access the candidate management pages.
          </p>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="border rounded-lg max-h-96 overflow-y-auto">
            {filteredUsers.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                {searchQuery ? 'No users found matching your search' : 'No users available'}
              </div>
            ) : (
              <div className="divide-y">
                {filteredUsers.map((user) => {
                  const isAssigned = assignedUserIds.has(user.id);
                  return (
                    <div
                      key={user.id}
                      className="flex items-center gap-3 p-3 hover:bg-accent/50 transition-colors"
                    >
                      <Checkbox
                        checked={isAssigned}
                        onCheckedChange={() => handleToggleUser(user.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user.name || 'No name'}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        {user.roles && user.roles.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {user.roles.slice(0, 2).map((role) => (
                              <span
                                key={role.id}
                                className="text-xs px-1.5 py-0.5 bg-muted rounded"
                              >
                                {role.name || role.slug}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <LoaderCircleIcon className="size-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="size-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

