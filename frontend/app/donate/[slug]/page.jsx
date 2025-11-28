'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LoaderCircleIcon, Heart, CheckCircle2 } from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const donationSchema = z.object({
  donor_name: z.string().min(2, 'Name must be at least 2 characters'),
  donor_name_bn: z.string().optional(),
  donor_id_number: z.string().optional(),
  donor_phone: z.string().optional(),
  donor_email: z.string().email('Invalid email address').optional().or(z.literal('')),
  amount: z.coerce.number().min(10, 'Minimum donation amount is 10'),
  currency: z.enum(['BDT', 'USD']).default('BDT'),
  method: z.enum(['sslcommerz', 'bkash', 'bank', 'cash']),
  notes: z.string().max(500).optional(),
});

export default function PublicDonationPage() {
  const params = useParams();
  const slug = params?.slug;
  const [candidate, setCandidate] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [donation, setDonation] = useState(null);

  const form = useForm({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      donor_name: '',
      donor_name_bn: '',
      donor_id_number: '',
      donor_phone: '',
      donor_email: '',
      amount: 100,
      currency: 'BDT',
      method: 'bank',
      notes: '',
    },
  });

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        // Fetch candidate and settings
        const [candidateRes, settingsRes] = await Promise.all([
          api.get(`/candidates/${slug}`).catch(() => null),
          api.get(`/candidates/${slug}/donation-settings`).catch(() => null),
        ]);

        if (candidateRes?.data) {
          setCandidate(candidateRes.data);
        }

        if (settingsRes?.data) {
          setSettings(settingsRes.data);
          // Set default payment method based on enabled methods
          const enabledMethods = settingsRes.data.enabled_payment_methods || [];
          if (enabledMethods.length > 0) {
            form.setValue('method', enabledMethods[0]);
          }
        }
      } catch (error) {
        console.error('Failed to load candidate:', error);
        toast.error('Failed to load donation page');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, form]);

  const onSubmit = async (data) => {
    if (!candidate) return;

    setSubmitting(true);
    try {
      const response = await api.post(
        `/candidates/${candidate.id}/donations/public`,
        data
      );

      setDonation(response.data.donation);
      setSuccess(true);

      // If SSLCommerz, redirect to payment gateway
      if (data.method === 'sslcommerz' && response.data.payment_data) {
        // TODO: Implement SSLCommerz redirect
        toast.info('Redirecting to payment gateway...');
      } else {
        toast.success('Donation submitted successfully!');
      }
    } catch (error) {
      console.error('Donation submission error:', error);
      const message =
        error.response?.data?.message || 'Failed to submit donation';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-6 text-center">
            <Alert variant="destructive">
              <AlertIcon />
              <AlertTitle>Candidate not found</AlertTitle>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!settings || !settings.donations_enabled) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-6 text-center">
            <Alert>
              <AlertIcon />
              <AlertTitle>Donations are currently disabled for this candidate</AlertTitle>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  const enabledMethods = settings.enabled_payment_methods || [];

  if (success && donation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-6 text-center space-y-4">
            <CheckCircle2 className="size-16 mx-auto text-green-500" />
            <h2 className="text-2xl font-bold">Thank You for Your Donation!</h2>
            <p className="text-muted-foreground">
              Your donation of {donation.amount} {donation.currency} has been
              recorded.
            </p>
            <p className="text-sm text-muted-foreground">
              Reference: {donation.transaction_reference}
            </p>
            {donation.method !== 'sslcommerz' && (
              <Alert>
                <AlertIcon />
                <AlertTitle>
                  Please complete your payment using the method you selected.
                </AlertTitle>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4 py-10">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="size-6 text-primary" />
            <CardTitle className="text-2xl">Support {candidate.name}</CardTitle>
          </div>
          {candidate.party && (
            <p className="text-sm text-muted-foreground">
              {candidate.party.name}
              {candidate.constituency && ` • ${candidate.constituency.name}`}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="donor_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name (English) *</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="donor_name_bn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name (Bengali)</FormLabel>
                      <FormControl>
                        <Input placeholder="আপনার নাম" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="donor_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="01XXXXXXXXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="donor_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="donor_id_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID Number (NID/Passport)</FormLabel>
                    <FormControl>
                      <Input placeholder="Optional" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="10"
                          step="1"
                          placeholder="100"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="BDT">BDT (৳)</SelectItem>
                          <SelectItem value="USD">USD ($)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {enabledMethods.includes('bank') && (
                          <SelectItem value="bank">Bank Transfer</SelectItem>
                        )}
                        {enabledMethods.includes('bkash') && (
                          <SelectItem value="bkash">bKash</SelectItem>
                        )}
                        {enabledMethods.includes('sslcommerz') &&
                          settings.sslcommerz_configured && (
                            <SelectItem value="sslcommerz">SSLCommerz (Online)</SelectItem>
                          )}
                        {enabledMethods.includes('cash') && (
                          <SelectItem value="cash">Cash</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch('method') === 'bank' && settings.bank_account_number && (
                <Alert>
                  <AlertIcon />
                  <AlertTitle>
                    Bank Details: {settings.bank_name} - Account: {settings.bank_account_number}
                    {settings.bank_routing_number && ` (Routing: ${settings.bank_routing_number})`}
                  </AlertTitle>
                </Alert>
              )}

              {form.watch('method') === 'bkash' && settings.bkash_number && (
                <Alert>
                  <AlertIcon />
                  <AlertTitle>bKash Number: {settings.bkash_number}</AlertTitle>
                </Alert>
              )}

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional information..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting && <LoaderCircleIcon className="mr-2 size-4 animate-spin" />}
                Submit Donation
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

