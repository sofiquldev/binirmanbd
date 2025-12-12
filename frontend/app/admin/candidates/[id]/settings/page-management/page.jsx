'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, FileText, LoaderCircleIcon } from 'lucide-react';
import { toast } from 'sonner';

const emptyFunfacts = Array.from({ length: 4 }, () => ({ title: '', number: '', suffix: '' }));

const buildPreview = (file) => (file ? URL.createObjectURL(file) : '');

const normalizeFunfacts = (items = []) => {
  const normalized = items.slice(0, 4).map((item) => ({
    title: item?.title ?? item?.label ?? '',
    number: item?.number ?? item?.value ?? '',
    suffix: item?.suffix ?? '',
  }));

  return normalized.concat(emptyFunfacts).slice(0, 4);
};

const DropzoneInput = ({ label, field, fileUrl, onUpload, hint, heightClass = 'h-32', accept = 'image/*' }) => {
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) onUpload(field, file);
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onUpload(field, file);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border border-dashed rounded-md bg-muted/20 flex items-center justify-center text-sm text-muted-foreground cursor-pointer ${heightClass} relative overflow-hidden`}
      >
        {fileUrl ? (
          <img src={fileUrl} alt={label} className="w-full h-full object-cover" />
        ) : (
          <div className="text-center px-3">
            <p className="font-medium">Click or drop an image</p>
            <p className="text-xs">Accepted: images</p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default function PageManagementSettingsPage() {
  const params = useParams();
  const candidateId = params.id;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [defaultLocale, setDefaultLocale] = useState('bn');
  const [form, setForm] = useState({
    mission: '',
    vision: '',
    privacy_policy: '',
    about_us: '',
    video_url: '',
    custom_css: '',
    custom_js: '',
    funfacts: emptyFunfacts,
    hero_photo: null,
    about_photo: null,
    signature_photo: null,
    brand_logo: null,
    footer_banner: null,
    video_thumb: null,
    hero_photo_url: '',
    about_photo_url: '',
    signature_photo_url: '',
    brand_logo_url: '',
    footer_banner_url: '',
    video_thumb_url: '',
  });

  useEffect(() => {
    if (!candidateId) return;
    fetchContent();
  }, [candidateId]);

  const languageOptions = [
    { value: 'bn', label: 'Bangla (বাংলা)' },
    { value: 'en', label: 'English' },
  ];

  const fetchContent = async () => {
    try {
      const candidateRes = await api.get(`/candidates/${candidateId}`);
      setDefaultLocale(candidateRes.data?.default_locale || 'bn');

      const res = await api.get(`/candidates/${candidateId}/page-content`);
      const data = res.data?.data;
      if (data) {
        setForm((prev) => ({
          ...prev,
          mission: data.mission || '',
          vision: data.vision || '',
          privacy_policy: data.privacy_policy || '',
          about_us: data.about_us || '',
          video_url: data.video_url || '',
        custom_css: data.custom_css || '',
        custom_js: data.custom_js || '',
          funfacts: data.funfacts?.length ? normalizeFunfacts(data.funfacts) : emptyFunfacts,
          hero_photo_url: data.hero_photo || '',
          about_photo_url: data.about_photo || '',
          signature_photo_url: data.signature_photo || '',
        brand_logo_url: data.brand_logo || '',
        footer_banner_url: data.footer_banner || '',
          video_thumb_url: data.video_thumb || '',
        }));
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load page content');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFunfactChange = (index, key, value) => {
    setForm((prev) => {
      const updated = [...prev.funfacts];
      updated[index] = { ...updated[index], [key]: value };
      return { ...prev, funfacts: updated };
    });
  };

  const handleFile = (field, file) => {
    const previewField = `${field}_url`;
    setForm((prev) => ({
      ...prev,
      [field]: file || null,
      [previewField]: file ? buildPreview(file) : prev[previewField],
    }));
  };

  const uploadAndSet = async (field, file) => {
    const previewField = `${field}_url`;
    // Optimistic preview
    setForm((prev) => ({
      ...prev,
      [previewField]: buildPreview(file),
      [field]: file,
    }));

    try {
      const data = new FormData();
      data.append('file', file);
      const res = await api.post(`/candidates/${candidateId}/page-content/upload`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const url = res.data?.url;
      if (url) {
        setForm((prev) => ({
          ...prev,
          [field]: null,
          [previewField]: url,
        }));
      }
    } catch (error) {
      console.error(error);
      toast.error('Upload failed. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!candidateId) return;
    setSaving(true);
    try {
      console.log('Page content submit started', { candidateId, form });
      const body = new FormData();
      body.append('mission', form.mission || '');
      body.append('vision', form.vision || '');
      body.append('privacy_policy', form.privacy_policy || '');
      body.append('about_us', form.about_us || '');
      body.append('video_url', form.video_url || '');
      body.append('custom_css', form.custom_css || '');
      body.append('custom_js', form.custom_js || '');
      body.append('funfacts', JSON.stringify(form.funfacts));

      ['hero_photo', 'about_photo', 'signature_photo', 'brand_logo', 'footer_banner', 'video_thumb'].forEach((field) => {
        if (form[field] instanceof File) {
          body.append(field, form[field]);
        } else if (form[`${field}_url`]) {
          body.append(field, form[`${field}_url`]);
        }
      });

      await api.post(`/candidates/${candidateId}/page-content`, body, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      await api.put(`/candidates/${candidateId}`, { default_locale: defaultLocale });

      console.log('Page content submit success');
      toast.success('Page content saved');
      fetchContent();
    } catch (error) {
      console.error(error);
      const message = error?.response?.data?.message || 'Failed to save content';
      toast.error(message);
    } finally {
      console.log('Page content submit finished');
      setSaving(false);
    }
  };

  if (loading) {
    return <Skeleton className="h-96 w-full" />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="size-5" />
            Landing Page
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your landing page content, images, and settings
          </p>
        </CardHeader>
        <CardContent>
          <div className="mb-6 max-w-md">
            <Label className="mb-2 block text-sm font-medium">Default Language</Label>
            <Select value={defaultLocale} onValueChange={(value) => setDefaultLocale(value)}>
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
              Visitors will see this language by default. They can still switch via URL parameter (e.g. ?lang=en).
            </p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground">Story</h3>
                <div className="grid gap-4">
                  <div>
                    <Label>Mission</Label>
                    <Textarea value={form.mission} onChange={(e) => handleChange('mission', e.target.value)} rows={3} />
                  </div>
                  <div>
                    <Label>Vision</Label>
                    <Textarea value={form.vision} onChange={(e) => handleChange('vision', e.target.value)} rows={3} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground">Brand & Images</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DropzoneInput
                    label="Logo"
                    hint="200x50 to 250x70"
                    field="brand_logo"
                    fileUrl={form.brand_logo_url}
                    onUpload={uploadAndSet}
                    heightClass="h-20"
                  />
                  <DropzoneInput
                    label="Hero Photo"
                    hint="Suggested 16:9"
                    field="hero_photo"
                    fileUrl={form.hero_photo_url}
                    onUpload={uploadAndSet}
                    heightClass="h-28"
                  />
                  <DropzoneInput
                    label="About Photo"
                    hint="Landscape recommended"
                    field="about_photo"
                    fileUrl={form.about_photo_url}
                    onUpload={uploadAndSet}
                    heightClass="h-28"
                  />
                  <DropzoneInput
                    label="Signature Photo"
                    hint="Transparent PNG preferred"
                    field="signature_photo"
                    fileUrl={form.signature_photo_url}
                    onUpload={uploadAndSet}
                    heightClass="h-24"
                  />
                  <div className="sm:col-span-2">
                    <DropzoneInput
                      label="Footer Banner"
                      hint="16:7 ratio, full width"
                      field="footer_banner"
                      fileUrl={form.footer_banner_url}
                      onUpload={uploadAndSet}
                      heightClass="h-36"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground">About & Policy</h3>
                <div className="space-y-4">
                  <div>
                    <Label>About Us</Label>
                    <Textarea value={form.about_us} onChange={(e) => handleChange('about_us', e.target.value)} rows={4} />
                  </div>
                  <div>
                    <Label>Privacy Policy</Label>
                    <Textarea value={form.privacy_policy} onChange={(e) => handleChange('privacy_policy', e.target.value)} rows={4} />
                  </div>
                </div>
              </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground">Video & Custom Code</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Video URL</Label>
                  <Input
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={form.video_url}
                    onChange={(e) => handleChange('video_url', e.target.value)}
                  />
                </div>
                <DropzoneInput
                  label="Video Thumbnail"
                  hint="Image, square/16:9 works"
                  field="video_thumb"
                  fileUrl={form.video_thumb_url}
                  onUpload={uploadAndSet}
                  heightClass="h-28"
                />
                <div className="space-y-2">
                  <Label>Custom Styles (CSS)</Label>
                  <Textarea
                    placeholder="/* Optional page-specific CSS */"
                    value={form.custom_css || ''}
                    onChange={(e) => handleChange('custom_css', e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Custom Scripts (JS)</Label>
                  <Textarea
                    placeholder="// Optional page-specific JS"
                    value={form.custom_js || ''}
                    onChange={(e) => handleChange('custom_js', e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Fun Facts (up to 4)</Label>
                <span className="text-xs text-muted-foreground">Title, number, optional suffix (e.g., K, %)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {form.funfacts.map((fact, idx) => (
                  <div key={idx} className="grid grid-cols-3 gap-2">
                    <Input placeholder="Title" value={fact.title} onChange={(e) => handleFunfactChange(idx, 'title', e.target.value)} />
                    <Input placeholder="Number" value={fact.number} onChange={(e) => handleFunfactChange(idx, 'number', e.target.value)} />
                    <Input placeholder="Suffix" value={fact.suffix} onChange={(e) => handleFunfactChange(idx, 'suffix', e.target.value)} />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <LoaderCircleIcon className="size-4 mr-2 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="size-4 mr-2" /> Save
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

