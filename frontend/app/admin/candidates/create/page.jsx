'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Combobox } from '@/components/ui/combobox';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

// Helper function to generate slug from name
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

// Helper function to get hostname from URL
const getHostnameFromUrl = (url) => {
  if (!url) return 'root.com';
  try {
    // If URL doesn't have protocol, add it for parsing
    const urlWithProtocol = url.startsWith('http://') || url.startsWith('https://') 
      ? url 
      : `https://${url}`;
    const urlObj = new URL(urlWithProtocol);
    return urlObj.hostname;
  } catch (e) {
    // If parsing fails, try to extract hostname manually
    const cleaned = url.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    return cleaned || 'root.com';
  }
};

// Get hostname from environment variable
const getRootDomain = () => {
  const url = process.env.NEXT_PUBLIC_URL || process.env.NEXT_PUBLIC_API_URL || '';
  return getHostnameFromUrl(url);
};

export default function CreateCandidatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [slugCheckLoading, setSlugCheckLoading] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState(null); // null = not checked, true = available, false = not available
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    name_bn: '',
    slug: '',
    constituency_id: '',
    party_id: '',
    template_id: '',
    about: '',
    history: '',
    campaign_slogan: '',
    campaign_goals: '',
    primary_domain: '',
    whatsapp_number: '',
  });
  const [parties, setParties] = useState([]);
  const [constituencies, setConstituencies] = useState([]);
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    // Fetch parties, constituencies, templates
    Promise.all([
      api.get('/parties?per_page=100'),
      api.get('/constituencies?per_page=100'),
      api.get('/templates?per_page=100'),
    ]).then(([partiesRes, constituenciesRes, templatesRes]) => {
      setParties(partiesRes.data.data || []);
      setConstituencies(constituenciesRes.data.data || []);
      setTemplates(templatesRes.data.data || []);
    });
  }, []);

  // Auto-generate slug from name
  useEffect(() => {
    if (formData.name && !slugManuallyEdited) {
      const generatedSlug = generateSlug(formData.name);
      if (generatedSlug !== formData.slug) {
        setFormData((prev) => ({ ...prev, slug: generatedSlug }));
        // Check availability when slug is auto-generated
        checkSlugAvailability(generatedSlug);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.name]);

  // Check slug availability
  const checkSlugAvailability = async (slug) => {
    if (!slug || slug.trim() === '') {
      setSlugAvailable(null);
      return;
    }

    setSlugCheckLoading(true);
    try {
      const response = await api.get('/candidates/check-slug', {
        params: { slug: slug.trim() },
      });
      setSlugAvailable(response.data.available);
    } catch (err) {
      // If error, assume not available
      setSlugAvailable(false);
    } finally {
      setSlugCheckLoading(false);
    }
  };

  // Handle slug change
  const handleSlugChange = (e) => {
    const newSlug = e.target.value;
    setFormData({ ...formData, slug: newSlug });
    setSlugManuallyEdited(true);
    setSlugAvailable(null); // Reset availability until blur
  };

  // Handle slug blur - recheck availability
  const handleSlugBlur = () => {
    if (formData.slug) {
      checkSlugAvailability(formData.slug);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/candidates', formData);
      router.push(`/admin/candidates/${response.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create candidate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="grid gap-5 lg:gap-7.5">
      <div>
        <h1 className="text-2xl font-semibold text-mono mb-2">Create Candidate</h1>
        <p className="text-sm text-secondary-foreground">
          Add a new candidate to the system
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Candidate Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    // Reset manual edit flag when name changes to allow auto-generation
                    if (slugManuallyEdited && !formData.slug) {
                      setSlugManuallyEdited(false);
                    }
                  }}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name_bn">Name (Bangla)</Label>
                <Input
                  id="name_bn"
                  value={formData.name_bn}
                  onChange={(e) => setFormData({ ...formData, name_bn: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <div className="space-y-1.5">
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={handleSlugChange}
                    onBlur={handleSlugBlur}
                    required
                    className={slugAvailable === false ? 'border-destructive' : slugAvailable === true ? 'border-green-500' : ''}
                  />
                  {formData.slug && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">
                        {formData.slug}.{getRootDomain()}
                      </span>
                      {slugCheckLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      ) : slugAvailable === true ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Available</span>
                        </div>
                      ) : slugAvailable === false ? (
                        <div className="flex items-center gap-1 text-destructive">
                          <XCircle className="h-4 w-4" />
                          <span>Not Available</span>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="constituency_id">Constituency</Label>
                <Combobox
                  options={constituencies.map((constituency) => ({
                    value: String(constituency.id),
                    label: constituency.name,
                  }))}
                  value={formData.constituency_id}
                  onValueChange={(value) => setFormData({ ...formData, constituency_id: value })}
                  placeholder="Select constituency"
                  searchPlaceholder="Search constituency..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="party_id">Party</Label>
                <Combobox
                  options={parties.map((party) => ({
                    value: String(party.id),
                    label: party.name,
                  }))}
                  value={formData.party_id}
                  onValueChange={(value) => setFormData({ ...formData, party_id: value })}
                  placeholder="Select party"
                  searchPlaceholder="Search party..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="template_id">Template</Label>
                <Combobox
                  options={templates.map((template) => ({
                    value: String(template.id),
                    label: template.name || `Template ${template.id}`,
                  }))}
                  value={formData.template_id}
                  onValueChange={(value) => setFormData({ ...formData, template_id: value })}
                  placeholder="Select template"
                  searchPlaceholder="Search template..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="about">About</Label>
              <Textarea
                id="about"
                value={formData.about}
                onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="history">History</Label>
              <Textarea
                id="history"
                value={formData.history}
                onChange={(e) => setFormData({ ...formData, history: e.target.value })}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="campaign_slogan">Campaign Slogan</Label>
                <Input
                  id="campaign_slogan"
                  value={formData.campaign_slogan}
                  onChange={(e) => setFormData({ ...formData, campaign_slogan: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
                <Input
                  id="whatsapp_number"
                  value={formData.whatsapp_number}
                  onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="campaign_goals">Campaign Goals</Label>
              <Textarea
                id="campaign_goals"
                value={formData.campaign_goals}
                onChange={(e) => setFormData({ ...formData, campaign_goals: e.target.value })}
                rows={3}
              />
            </div>

            <div className="flex items-center gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading || slugAvailable === false || slugCheckLoading}
              >
                {loading ? 'Creating...' : 'Create Candidate'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}

