'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Save, LoaderCircleIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useCandidatesStore } from '@/stores/use-candidates-store';

export default function ProfileSettingsPage() {
  const params = useParams();
  const candidateId = params.id;
  const { candidate, fetchCandidate } = useCandidatesStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    name_bn: '',
    email: '',
    phone: '',
    bio: '',
    bio_bn: '',
  });

  useEffect(() => {
    if (candidateId) {
      fetchCandidate(candidateId).then(() => {
        if (candidate) {
          setFormData({
            name: candidate.name || '',
            name_bn: candidate.name_bn || '',
            email: candidate.email || '',
            phone: candidate.phone || '',
            bio: candidate.bio || '',
            bio_bn: candidate.bio_bn || '',
          });
        }
        setLoading(false);
      });
    }
  }, [candidateId, fetchCandidate]);

  useEffect(() => {
    if (candidate) {
      setFormData({
        name: candidate.name || '',
        name_bn: candidate.name_bn || '',
        email: candidate.email || '',
        phone: candidate.phone || '',
        bio: candidate.bio || '',
        bio_bn: candidate.bio_bn || '',
      });
    }
  }, [candidate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/candidates/${candidateId}`, formData);
      toast.success('Profile settings saved successfully');
      fetchCandidate(candidateId);
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast.error('Failed to save profile settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-32" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="size-5" />
          Profile Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="name">Name (English) *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name_bn">Name (Bengali)</Label>
              <Input
                id="name_bn"
                value={formData.name_bn}
                onChange={(e) => setFormData({ ...formData, name_bn: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio (English)</Label>
            <Textarea
              id="bio"
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio_bn">Bio (Bengali)</Label>
            <Textarea
              id="bio_bn"
              rows={4}
              value={formData.bio_bn}
              onChange={(e) => setFormData({ ...formData, bio_bn: e.target.value })}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving && <LoaderCircleIcon className="mr-2 size-4 animate-spin" />}
              <Save className="mr-2 size-4" />
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

