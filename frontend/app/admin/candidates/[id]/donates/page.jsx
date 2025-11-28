'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { DataPagination } from '@/components/ui/data-pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DonationDetailModal } from '@/components/donation/DonationDetailModal';
import {
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
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

export default function CandidateDonationsPage() {
  const params = useParams();
  const candidateId = params.id;
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState({
    total_amount: 0,
    total_count: 0,
    pending_amount: 0,
    recent_donors: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, per_page: 15, total: 0, last_page: 1 });

  useEffect(() => {
    if (candidateId) {
      fetchDonations();
    }
  }, [candidateId, pagination.page, pagination.per_page]);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        per_page: pagination.per_page.toString(),
      });

      const res = await api.get(`/candidates/${candidateId}/donations?${params}`);
      setDonations(res.data.data || []);
      setStats(res.data.stats || stats);
      setPagination({
        page: res.data.meta?.current_page || 1,
        per_page: res.data.meta?.per_page || 15,
        total: res.data.meta?.total || 0,
        last_page: res.data.meta?.last_page || 1,
      });
    } catch (error) {
      console.error('Failed to fetch donations:', error);
      toast.error('Failed to load donations');
    } finally {
      setLoading(false);
    }
  };

  const openDetailModal = (donation) => {
    setSelectedDonation(donation);
    setIsDetailOpen(true);
  };

  const handleDonationUpdate = () => {
    fetchDonations();
  };

  return (
    <div className="space-y-5">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold text-primary">
                  {stats.total_amount.toLocaleString()} BDT
                </p>
              </div>
              <DollarSign className="size-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Donations</p>
                <p className="text-2xl font-bold">{stats.total_count}</p>
              </div>
              <TrendingUp className="size-8 text-blue-500/20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Amount</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.pending_amount.toLocaleString()} BDT
                </p>
              </div>
              <Clock className="size-8 text-yellow-500/20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Verified</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.total_count - (stats.pending_amount > 0 ? 1 : 0)}
                </p>
              </div>
              <CheckCircle2 className="size-8 text-green-500/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Donors */}
      {stats.recent_donors && stats.recent_donors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Donors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.recent_donors.map((donor, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{donor.donor_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(donor.created_at), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <p className="font-semibold text-primary">
                    {donor.amount.toLocaleString()} BDT
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Donations Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Donations</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : donations.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              No donations found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Donor</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donations.map((donation) => (
                  <TableRow
                    key={donation.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => openDetailModal(donation)}
                  >
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{donation.donor_name}</div>
                        {donation.donor_phone && (
                          <div className="text-xs text-muted-foreground">
                            {donation.donor_phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold">
                        {donation.amount.toLocaleString()} {donation.currency}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {METHOD_LABELS[donation.method] || donation.method}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={STATUS_COLORS[donation.status] || ''}>
                        {donation.status?.charAt(0).toUpperCase() + donation.status?.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {donation.created_at ? (
                        <div className="text-sm">
                          {format(new Date(donation.created_at), 'MMM dd, yyyy')}
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(donation.created_at), 'hh:mm a')}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      <DataPagination
        pagination={pagination}
        onPageChange={(newPage) => setPagination({ ...pagination, page: newPage })}
        onPerPageChange={(newPerPage) =>
          setPagination({ ...pagination, per_page: newPerPage, page: 1 })
        }
      />

      {/* Donation Detail Modal */}
      <DonationDetailModal
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        donation={selectedDonation}
        onUpdate={handleDonationUpdate}
      />
    </div>
  );
}
