'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  User,
  DollarSign,
  CreditCard,
  Calendar,
  FileText,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  XCircle,
  LoaderCircleIcon,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  verified: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
};

const METHOD_LABELS = {
  sslcommerz: 'SSLCommerz',
  bkash: 'bKash',
  bank: 'Bank Transfer',
  cash: 'Cash',
  nagad: 'Nagad',
  stripe: 'Stripe',
  cheque: 'Cheque',
};

export function DonationDetailModal({ open, onOpenChange, donation, onUpdate }) {
  const [donationDetails, setDonationDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (open && donation) {
      fetchDonationDetails();
      setStatus(donation.status || '');
      setNotes(donation.notes || '');
    }
  }, [open, donation]);

  const fetchDonationDetails = async () => {
    if (!donation?.id) return;

    setLoading(true);
    try {
      const res = await api.get(`/admin/donations/${donation.id}`);
      setDonationDetails(res.data);
      setStatus(res.data.status);
      setNotes(res.data.notes || '');
    } catch (error) {
      console.error('Failed to fetch donation details:', error);
      toast.error('Failed to load donation details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!donation?.id) return;

    setUpdating(true);
    try {
      await api.patch(`/admin/donations/${donation.id}`, {
        status,
        notes,
      });
      toast.success('Donation updated successfully');
      onUpdate?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update donation:', error);
      toast.error('Failed to update donation');
    } finally {
      setUpdating(false);
    }
  };

  const donationData = donationDetails || donation;
  if (!donationData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="size-5" />
            Donation Details
          </DialogTitle>
          <DialogDescription>
            Reference: {donationData.transaction_reference}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Donor Information */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <User className="size-4" />
                Donor Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <Label className="text-xs text-muted-foreground">Name (English)</Label>
                  <p className="font-medium">{donationData.donor_name}</p>
                </div>
                {donationData.donor_name_bn && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Name (Bengali)</Label>
                    <p className="font-medium">{donationData.donor_name_bn}</p>
                  </div>
                )}
                {donationData.donor_phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="size-4 text-muted-foreground" />
                    <div>
                      <Label className="text-xs text-muted-foreground">Phone</Label>
                      <p className="font-medium">{donationData.donor_phone}</p>
                    </div>
                  </div>
                )}
                {donationData.donor_email && (
                  <div className="flex items-center gap-2">
                    <Mail className="size-4 text-muted-foreground" />
                    <div>
                      <Label className="text-xs text-muted-foreground">Email</Label>
                      <p className="font-medium">{donationData.donor_email}</p>
                    </div>
                  </div>
                )}
                {donationData.donor_id_number && (
                  <div>
                    <Label className="text-xs text-muted-foreground">ID Number</Label>
                    <p className="font-medium">{donationData.donor_id_number}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Donation Details */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <DollarSign className="size-4" />
                Donation Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <Label className="text-xs text-muted-foreground">Amount</Label>
                  <p className="text-2xl font-bold text-primary">
                    {donationData.amount.toLocaleString()} {donationData.currency}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Payment Method</Label>
                  <Badge variant="outline" className="mt-1">
                    {METHOD_LABELS[donationData.method] || donationData.method}
                  </Badge>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  <Badge className={`mt-1 ${STATUS_COLORS[donationData.status] || ''}`}>
                    {donationData.status?.charAt(0).toUpperCase() + donationData.status?.slice(1)}
                  </Badge>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Source</Label>
                  <p className="font-medium capitalize">{donationData.source}</p>
                </div>
                {donationData.payment_gateway && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Payment Gateway</Label>
                    <p className="font-medium">{donationData.payment_gateway}</p>
                  </div>
                )}
                {donationData.transaction_reference && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Transaction Reference</Label>
                    <p className="font-medium font-mono text-sm">
                      {donationData.transaction_reference}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Candidate Information */}
            {donationData.candidate && (
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <User className="size-4" />
                  Candidate
                </h3>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="font-medium">
                    {donationData.candidate.name}
                    {donationData.candidate.name_bn && ` (${donationData.candidate.name_bn})`}
                  </p>
                  {donationData.candidate.party && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {donationData.candidate.party.name}
                    </p>
                  )}
                  {donationData.candidate.constituency && (
                    <p className="text-sm text-muted-foreground">
                      {donationData.candidate.constituency.name}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Dates */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Calendar className="size-4" />
                Timeline
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <Label className="text-xs text-muted-foreground">Created At</Label>
                  <p className="font-medium">
                    {donationData.created_at
                      ? format(new Date(donationData.created_at), 'PPpp')
                      : '-'}
                  </p>
                </div>
                {donationData.paid_at && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Paid At</Label>
                    <p className="font-medium">
                      {format(new Date(donationData.paid_at), 'PPpp')}
                    </p>
                  </div>
                )}
                {donationData.verified_at && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Verified At</Label>
                    <p className="font-medium">
                      {format(new Date(donationData.verified_at), 'PPpp')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            {donationData.notes && (
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <FileText className="size-4" />
                  Notes
                </h3>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{donationData.notes}</p>
                </div>
              </div>
            )}

            {/* Update Status */}
            <div className="space-y-3 border-t pt-4">
              <h3 className="font-semibold">Update Status</h3>
              <div className="space-y-4">
                <div>
                  <Label>Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(STATUS_COLORS).map((s) => (
                        <SelectItem key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Notes</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes about this donation..."
                    rows={3}
                  />
                </div>
                <Button onClick={handleStatusUpdate} disabled={updating}>
                  {updating && <LoaderCircleIcon className="mr-2 size-4 animate-spin" />}
                  Update Donation
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

