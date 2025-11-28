'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { LoaderCircleIcon, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const settingsSchema = z.object({
  donations_enabled: z.boolean(),
  enabled_payment_methods: z.array(z.enum(['bank', 'bkash', 'sslcommerz'])),
  sslcommerz_store_id: z.string().optional(),
  sslcommerz_store_password: z.string().optional(),
  sslcommerz_is_sandbox: z.boolean(),
  bank_name: z.string().optional(),
  bank_account_name: z.string().optional(),
  bank_account_number: z.string().optional(),
  bank_routing_number: z.string().optional(),
  bank_branch: z.string().optional(),
  bkash_number: z.string().optional(),
  bkash_account_type: z.enum(['personal', 'merchant']).optional(),
});

export function DonationSettings({ candidateId, onUpdate }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const form = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      donations_enabled: true,
      enabled_payment_methods: ['bank', 'bkash'],
      sslcommerz_store_id: '',
      sslcommerz_store_password: '',
      sslcommerz_is_sandbox: true,
      bank_name: '',
      bank_account_name: '',
      bank_account_number: '',
      bank_routing_number: '',
      bank_branch: '',
      bkash_number: '',
      bkash_account_type: 'personal',
    },
  });

  useEffect(() => {
    if (candidateId) {
      fetchSettings();
    }
  }, [candidateId]);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/candidates/${candidateId}/donation-settings`);
      const settings = res.data;
      form.reset({
        donations_enabled: settings.donations_enabled ?? true,
        enabled_payment_methods: settings.enabled_payment_methods || ['bank', 'bkash'],
        sslcommerz_store_id: '',
        sslcommerz_store_password: '',
        sslcommerz_is_sandbox: settings.sslcommerz_is_sandbox ?? true,
        bank_name: settings.bank_name || '',
        bank_account_name: settings.bank_account_name || '',
        bank_account_number: settings.bank_account_number || '',
        bank_routing_number: settings.bank_routing_number || '',
        bank_branch: settings.bank_branch || '',
        bkash_number: settings.bkash_number || '',
        bkash_account_type: settings.bkash_account_type || 'personal',
      });
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      toast.error('Failed to load donation settings');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      await api.put(`/candidates/${candidateId}/donation-settings`, data);
      toast.success('Settings saved successfully');
      onUpdate?.();
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const enabledMethods = form.watch('enabled_payment_methods') || [];
  const donationsEnabled = form.watch('donations_enabled');

  const togglePaymentMethod = (method) => {
    const current = enabledMethods;
    if (current.includes(method)) {
      form.setValue(
        'enabled_payment_methods',
        current.filter((m) => m !== method)
      );
    } else {
      form.setValue('enabled_payment_methods', [...current, method]);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Donation Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Enable/Disable Donations */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="donations_enabled"
              checked={donationsEnabled}
              onCheckedChange={(checked) => form.setValue('donations_enabled', checked)}
            />
            <Label htmlFor="donations_enabled" className="font-medium cursor-pointer">
              Enable Donations
            </Label>
          </div>

          {donationsEnabled && (
            <>
              {/* Payment Methods */}
              <div className="space-y-3">
                <Label>Enabled Payment Methods</Label>
                <div className="flex flex-wrap gap-3">
                  {['bank', 'bkash', 'sslcommerz'].map((method) => (
                    <div key={method} className="flex items-center space-x-2">
                      <Checkbox
                        id={method}
                        checked={enabledMethods.includes(method)}
                        onCheckedChange={() => togglePaymentMethod(method)}
                      />
                      <Label htmlFor={method} className="cursor-pointer capitalize">
                        {method === 'sslcommerz' ? 'SSLCommerz' : method === 'bkash' ? 'bKash' : 'Bank Transfer'}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bank Transfer Details */}
              {enabledMethods.includes('bank') && (
                <div className="space-y-4 p-4 border rounded-lg">
                  <h3 className="font-semibold">Bank Transfer Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Bank Name</Label>
                      <Input {...form.register('bank_name')} placeholder="e.g., Sonali Bank" />
                    </div>
                    <div>
                      <Label>Account Name</Label>
                      <Input {...form.register('bank_account_name')} placeholder="Account holder name" />
                    </div>
                    <div>
                      <Label>Account Number</Label>
                      <Input {...form.register('bank_account_number')} placeholder="Account number" />
                    </div>
                    <div>
                      <Label>Routing Number</Label>
                      <Input {...form.register('bank_routing_number')} placeholder="Routing number" />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Branch</Label>
                      <Input {...form.register('bank_branch')} placeholder="Branch name" />
                    </div>
                  </div>
                </div>
              )}

              {/* bKash Details */}
              {enabledMethods.includes('bkash') && (
                <div className="space-y-4 p-4 border rounded-lg">
                  <h3 className="font-semibold">bKash Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>bKash Number</Label>
                      <Input {...form.register('bkash_number')} placeholder="01XXXXXXXXX" />
                    </div>
                    <div>
                      <Label>Account Type</Label>
                      <select
                        {...form.register('bkash_account_type')}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="personal">Personal</option>
                        <option value="merchant">Merchant</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* SSLCommerz Configuration */}
              {enabledMethods.includes('sslcommerz') && (
                <div className="space-y-4 p-4 border rounded-lg">
                  <h3 className="font-semibold">SSLCommerz Configuration</h3>
                  <Alert>
                    <AlertIcon />
                    <AlertTitle>
                      Your SSLCommerz credentials will be encrypted and stored securely.
                    </AlertTitle>
                  </Alert>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Store ID</Label>
                      <Input
                        {...form.register('sslcommerz_store_id')}
                        type="password"
                        placeholder="Enter store ID"
                      />
                    </div>
                    <div>
                      <Label>Store Password</Label>
                      <Input
                        {...form.register('sslcommerz_store_password')}
                        type="password"
                        placeholder="Enter store password"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="sslcommerz_is_sandbox"
                          checked={form.watch('sslcommerz_is_sandbox')}
                          onCheckedChange={(checked) =>
                            form.setValue('sslcommerz_is_sandbox', checked)
                          }
                        />
                        <Label htmlFor="sslcommerz_is_sandbox" className="cursor-pointer">
                          Use Sandbox (Test Mode)
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          <Button type="submit" disabled={saving}>
            {saving && <LoaderCircleIcon className="mr-2 size-4 animate-spin" />}
            <Save className="mr-2 size-4" />
            Save Settings
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

