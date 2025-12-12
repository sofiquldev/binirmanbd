'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Layout, Save, LoaderCircleIcon, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useCandidatesStore } from '@/stores/use-candidates-store';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function TemplateSettingsPage() {
  const params = useParams();
  const candidateId = params.id;
  const { candidate, fetchCandidate, updateCandidate } = useCandidatesStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [defaultLocale, setDefaultLocale] = useState('bn');

  const languageOptions = [
    { value: 'bn', label: 'Bangla (বাংলা)' },
    { value: 'en', label: 'English' },
  ];

  useEffect(() => {
    if (candidateId) {
      fetchCandidate(candidateId).then(() => {
        if (candidate) {
          setSelectedTemplateId(candidate.template_id);
          setDefaultLocale(candidate.default_locale || 'bn');
        }
        setLoading(false);
      });
    }
  }, [candidateId, fetchCandidate]);

  useEffect(() => {
    if (candidate) {
      setSelectedTemplateId(candidate.template_id);
      setDefaultLocale(candidate.default_locale || 'bn');
    }
  }, [candidate]);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await api.get('/templates');
      setTemplates(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
      toast.error('Failed to load templates');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateCandidate(candidateId, { template_id: selectedTemplateId, default_locale: defaultLocale });
      toast.success('Settings updated successfully');
      fetchCandidate(candidateId);
    } catch (error) {
      console.error('Failed to update template:', error);
      toast.error('Failed to update settings');
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
          <Layout className="size-5" />
          Template Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              Select a template for your candidate landing page. The template will determine the design and layout of your public-facing website.
            </p>
            <div className="max-w-md">
              <label className="text-sm font-medium text-foreground mb-2 block">
                Default Language
              </label>
              <Select
                value={defaultLocale}
                onValueChange={(value) => setDefaultLocale(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select default language" />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1.5">
                Visitors will see this language by default. They can still switch using URL parameters (e.g. ?lang=en).
              </p>
            </div>
          </div>

          {templates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No templates available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => {
                const isSelected = selectedTemplateId === template.id;
                return (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplateId(template.id)}
                    className={cn(
                      'relative border-2 rounded-lg p-4 cursor-pointer transition-all',
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <div className="bg-primary text-primary-foreground rounded-full p-1">
                          <Check className="size-4" />
                        </div>
                      </div>
                    )}
                    {template.preview_image ? (
                      <img
                        src={template.preview_image}
                        alt={template.name}
                        className="w-full h-40 object-cover rounded-md mb-3"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-40 bg-muted rounded-md mb-3 flex items-center justify-center">
                        <Layout className="size-12 text-muted-foreground" />
                      </div>
                    )}
                    <h3 className="font-semibold text-sm mb-1">{template.name}</h3>
                    {template.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {template.description}
                      </p>
                    )}
                    {template.author && (
                      <p className="text-xs text-muted-foreground mt-2">
                        by {template.author}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex justify-end pt-4 border-t">
            <Button onClick={handleSave} disabled={saving || !selectedTemplateId}>
              {saving && <LoaderCircleIcon className="mr-2 size-4 animate-spin" />}
              <Save className="mr-2 size-4" />
              Save Template
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
