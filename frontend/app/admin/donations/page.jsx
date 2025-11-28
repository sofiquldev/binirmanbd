'use client';

import React, { useEffect, useState, useMemo } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { DataPagination } from '@/components/ui/data-pagination';
import { Combobox } from '@/components/ui/combobox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DonationDetailModal } from '@/components/donation/DonationDetailModal';
import { EntityDetailModal } from '@/components/common/EntityDetailModal';
import {
  Search,
  Filter,
  X,
  DollarSign,
  Calendar,
  CreditCard,
  User,
  ArrowUp,
  ArrowDown,
  ChevronsUpDown,
} from 'lucide-react';
import { useCandidatesStore } from '@/stores/use-candidates-store';
import { format } from 'date-fns';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  verified: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
};

const METHOD_LABELS = {
  default: 'Default',
  sslcommerz: 'SSLCommerz',
  bkash: 'bKash',
  bank: 'Bank Transfer',
  cash: 'Cash',
  nagad: 'Nagad',
  rocket: 'Rocket',
  stripe: 'Stripe',
  cheque: 'Cheque',
};

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, per_page: 15, total: 0, last_page: 1 });
  const [summary, setSummary] = useState({
    total_amount: 0,
    total_count: 0,
    pending_count: 0,
    verified_count: 0,
  });
  const [entityModal, setEntityModal] = useState({
    open: false,
    type: null,
    id: null,
  });

  // Filters
  const [search, setSearch] = useState('');
  const [candidateId, setCandidateId] = useState('');
  const [method, setMethod] = useState('');
  const [status, setStatus] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({ field: null, direction: 'asc' });

  const { candidates, fetchCandidates } = useCandidatesStore();

  useEffect(() => {
    fetchCandidates({ per_page: 1000 });
  }, []);

  useEffect(() => {
    fetchDonations();
  }, [pagination.page, pagination.per_page, search, candidateId, method, status, dateFrom, dateTo]);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        per_page: pagination.per_page.toString(),
      });

      if (search) params.append('search', search);
      if (candidateId) params.append('candidate_id', candidateId);
      if (method) params.append('method', method);
      if (status) params.append('status', status);
      if (dateFrom) params.append('date_from', dateFrom);
      if (dateTo) params.append('date_to', dateTo);
      if (sortConfig.field) {
        params.append('sort_by', sortConfig.field);
        params.append('sort_order', sortConfig.direction);
      }

      const res = await api.get(`/admin/donations?${params}`);
      
      // Handle response format
      const donationsData = res.data.data || res.data || [];
      const summaryData = res.data.summary || {
        total_amount: 0,
        total_count: 0,
        pending_count: 0,
        verified_count: 0,
      };
      const metaData = res.data.meta || {
        current_page: 1,
        per_page: 15,
        total: 0,
        last_page: 1,
      };

      setDonations(Array.isArray(donationsData) ? donationsData : []);
      setSummary(summaryData);
      setPagination({
        page: metaData.current_page || 1,
        per_page: metaData.per_page || 15,
        total: metaData.total || 0,
        last_page: metaData.last_page || 1,
      });
    } catch (error) {
      console.error('Failed to fetch donations:', error);
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

  const toggleSelectItem = (id) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === donations.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(donations.map((d) => d.id)));
    }
  };

  const handleSort = (field) => {
    setSortConfig((prev) => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const clearFilters = () => {
    setSearch('');
    setCandidateId('');
    setMethod('');
    setStatus('');
    setDateFrom('');
    setDateTo('');
    setSelectedItems(new Set());
  };

  const candidateOptions = useMemo(
    () =>
      candidates.map((c) => ({
        value: c.id.toString(),
        label: `${c.name}${c.name_bn ? ` (${c.name_bn})` : ''}`,
      })),
    [candidates]
  );

  const SortIcon = ({ field }) => {
    if (sortConfig.field !== field) {
      return <ChevronsUpDown className="size-4 text-muted-foreground" />;
    }
    return sortConfig.direction === 'asc' ? (
      <ArrowUp className="size-4" />
    ) : (
      <ArrowDown className="size-4" />
    );
  };

  return (
    <div className="container">
      <div className="grid gap-5 lg:gap-7.5">
        <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-mono mb-2">Donations</h1>
          <p className="text-sm text-secondary-foreground">
              Total: {summary.total_count} • Verified: {summary.verified_count} • Amount:{' '}
              {summary.total_amount.toLocaleString()} BDT
          </p>
          </div>
        </div>

      {/* Filters */}
        <Card>
          <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="size-5" />
              Filters
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? 'Hide' : 'Show'} Filters
              </Button>
              {(search || candidateId || method || status || dateFrom || dateTo) && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="size-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>
          </CardHeader>
        {showFilters && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, phone, email, reference..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Combobox
                options={candidateOptions}
                value={candidateId}
                onValueChange={setCandidateId}
                placeholder="Select candidate"
              />
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">All Payment Methods</option>
                {Object.entries(METHOD_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">All Statuses</option>
                {Object.keys(STATUS_COLORS).map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
              <Input
                type="date"
                placeholder="Date From"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
              <Input
                type="date"
                placeholder="Date To"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Donations Table */}
      <Card>
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
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedItems.size === donations.length && donations.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort('donor_name')}
                  >
                    <div className="flex items-center gap-2">
                      Donor
                      <SortIcon field="donor_name" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort('candidate_id')}
                  >
                    <div className="flex items-center gap-2">
                      Candidate
                      <SortIcon field="candidate_id" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort('amount')}
                  >
                    <div className="flex items-center gap-2">
                      Amount
                      <SortIcon field="amount" />
                    </div>
                  </TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-2">
                      Status
                      <SortIcon field="status" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort('created_at')}
                  >
                    <div className="flex items-center gap-2">
                      Date
                      <SortIcon field="created_at" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donations.map((donation) => (
                  <TableRow
                    key={donation.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => openDetailModal(donation)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedItems.has(donation.id)}
                        onCheckedChange={() => toggleSelectItem(donation.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{donation.donor_name}</div>
                        {donation.donor_phone && (
                          <div className="text-xs text-muted-foreground">
                            {donation.donor_phone}
                          </div>
                        )}
                        {donation.donor_email && (
                          <div className="text-xs text-muted-foreground">
                            {donation.donor_email}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      {donation.candidate ? (
                        <button
                          onClick={() => {
                            setEntityModal({
                              open: true,
                              type: 'candidate',
                              id: donation.candidate.id,
                            });
                          }}
                          className="text-primary hover:underline text-left"
                        >
                          {donation.candidate.name}
                          {donation.candidate.name_bn && ` (${donation.candidate.name_bn})`}
                        </button>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
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

      {/* Entity Detail Modal */}
      <EntityDetailModal
        open={entityModal.open}
        onOpenChange={(open) => setEntityModal({ ...entityModal, open })}
        type={entityModal.type}
        id={entityModal.id}
      />
      </div>
    </div>
  );
}
