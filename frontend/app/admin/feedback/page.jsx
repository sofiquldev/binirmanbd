'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
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
import { FeedbackDetailModal } from '@/components/feedback/FeedbackDetailModal';
import { EntityDetailModal } from '@/components/common/EntityDetailModal';
import {
  Search,
  Filter,
  X,
  MessageSquare,
  User,
  Eye,
  Calendar,
  MapPin,
  Users,
  ArrowUp,
  ArrowDown,
  ChevronsUpDown,
} from 'lucide-react';
import { useCandidatesStore } from '@/stores/use-candidates-store';
import { usePartiesStore } from '@/stores/use-parties-store';
import { useConstituenciesStore } from '@/stores/use-constituencies-store';

// Static districts list
const STATIC_DISTRICTS = [
  { value: 'dhaka', label: 'ঢাকা' },
  { value: 'gazipur', label: 'গাজীপুর' },
  { value: 'narayanganj', label: 'নারায়ণগঞ্জ' },
  { value: 'tangail', label: 'টাঙ্গাইল' },
  { value: 'manikganj', label: 'মানিকগঞ্জ' },
  { value: 'munshiganj', label: 'মুন্সিগঞ্জ' },
  { value: 'faridpur', label: 'ফরিদপুর' },
  { value: 'madaripur', label: 'মাদারীপুর' },
  { value: 'chittagong', label: 'চট্টগ্রাম' },
  { value: 'cox-bazar', label: 'কক্সবাজার' },
  { value: 'comilla', label: 'কুমিল্লা' },
  { value: 'feni', label: 'ফেনী' },
  { value: 'noakhali', label: 'নোয়াখালী' },
  { value: 'brahmanbaria', label: 'ব্রাহ্মণবাড়িয়া' },
  { value: 'lakshmipur', label: 'লক্ষ্মীপুর' },
  { value: 'rajshahi', label: 'রাজশাহী' },
  { value: 'bogura', label: 'বগুড়া' },
  { value: 'pabna', label: 'পাবনা' },
  { value: 'joypurhat', label: 'জয়পুরহাট' },
  { value: 'chapainawabganj', label: 'চাঁপাইনবাবগঞ্জ' },
  { value: 'natore', label: 'নাটোর' },
  { value: 'sirajganj', label: 'সিরাজগঞ্জ' },
  { value: 'khulna', label: 'খুলনা' },
  { value: 'jashore', label: 'যশোর' },
  { value: 'bagerhat', label: 'বাগেরহাট' },
  { value: 'kushtia', label: 'কুষ্টিয়া' },
  { value: 'meherpur', label: 'মেহেরপুর' },
  { value: 'magura', label: 'মাগুরা' },
  { value: 'barisal', label: 'বরিশাল' },
  { value: 'patuakhali', label: 'পটুয়াখালী' },
  { value: 'bhola', label: 'ভোলা' },
  { value: 'pirojpur', label: 'পিরোজপুর' },
  { value: 'jhalakathi', label: 'ঝালকাঠি' },
  { value: 'barguna', label: 'বরগুনা' },
  { value: 'sylhet', label: 'সিলেট' },
  { value: 'moulvibazar', label: 'মৌলভীবাজার' },
  { value: 'habiganj', label: 'হবিগঞ্জ' },
  { value: 'sunamganj', label: 'সুনামগঞ্জ' },
  { value: 'rangpur', label: 'রংপুর' },
  { value: 'dinajpur', label: 'দিনাজপুর' },
  { value: 'kurigram', label: 'কুড়িগ্রাম' },
  { value: 'lalmonirhat', label: 'লালমনিরহাট' },
  { value: 'nilphamari', label: 'নীলফামারী' },
  { value: 'gaibandha', label: 'গাইবান্ধা' },
  { value: 'thakurgaon', label: 'ঠাকুরগাঁও' },
  { value: 'panchagarh', label: 'পঞ্চগড়' },
  { value: 'mymensingh', label: 'ময়মনসিংহ' },
  { value: 'sherpur', label: 'শেরপুর' },
  { value: 'netrokona', label: 'নেত্রকোণা' },
  { value: 'jamalpur', label: 'জামালপুর' },
];

const STATUS_COLORS = {
  new: 'bg-blue-100 text-blue-800',
  in_review: 'bg-yellow-100 text-yellow-800',
  assigned: 'bg-purple-100 text-purple-800',
  resolved: 'bg-green-100 text-green-800',
};

export default function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, per_page: 15, total: 0, last_page: 1 });
  const [entityModal, setEntityModal] = useState({
    open: false,
    type: null,
    id: null,
  });

  // Filters
  const [search, setSearch] = useState('');
  const [districtSlug, setDistrictSlug] = useState('');
  const [partyId, setPartyId] = useState('');
  const [constituencyId, setConstituencyId] = useState('');
  const [candidateId, setCandidateId] = useState('');
  const [status, setStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({ field: null, direction: 'asc' });

  const { candidates, fetchCandidates } = useCandidatesStore();
  const { parties, fetchParties } = usePartiesStore();
  const { constituencies, fetchConstituencies } = useConstituenciesStore();

  useEffect(() => {
    // Fetch all items for filters (no pagination)
    fetchCandidates({ per_page: 1000 });
    fetchParties({ per_page: 1000 });
    fetchConstituencies({ per_page: 1000 });
  }, []);

  useEffect(() => {
    fetchFeedback();
  }, [pagination.page, pagination.per_page, search, districtSlug, partyId, constituencyId, candidateId, status]);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        per_page: pagination.per_page.toString(),
      });

      if (search) params.append('search', search);
      if (districtSlug) params.append('district_slug', districtSlug);
      if (partyId) params.append('party_id', partyId);
      if (constituencyId) params.append('constituency_id', constituencyId);
      if (candidateId) params.append('candidate_id', candidateId);
      if (status) params.append('status', status);

      const res = await api.get(`/admin/feedback?${params}`);
      setFeedback(res.data.data || []);
      setPagination({
        page: res.data.current_page || 1,
        per_page: res.data.per_page || 15,
        total: res.data.total || 0,
        last_page: res.data.last_page || 1,
      });
    } catch (error) {
      console.error('Failed to fetch feedback:', error);
    } finally {
      setLoading(false);
    }
  };


  const openDetailModal = (feedbackItem) => {
    setSelectedFeedback(feedbackItem);
    setIsDetailOpen(true);
  };

  const handleFeedbackUpdate = () => {
    // Refresh feedback list when feedback is updated
    fetchFeedback();
  };

  // Memoized sorted data - only recalculates when feedback or sortConfig changes
  const sortedFeedback = useMemo(() => {
    if (!sortConfig.field) {
      return feedback;
    }

    return [...feedback].sort((a, b) => {
      let aValue, bValue;

      // Handle nested properties
      switch (sortConfig.field) {
        case 'description':
          aValue = a.description?.toLowerCase() || '';
          bValue = b.description?.toLowerCase() || '';
          break;
        case 'candidate':
          aValue = a.candidate?.name?.toLowerCase() || '';
          bValue = b.candidate?.name?.toLowerCase() || '';
          break;
        case 'location':
          aValue = a.candidate?.constituency?.name?.toLowerCase() || '';
          bValue = b.candidate?.constituency?.name?.toLowerCase() || '';
          break;
        case 'views':
          aValue = a.views || 0;
          bValue = b.views || 0;
          break;
        case 'comments':
          aValue = a.comments_count || 0;
          bValue = b.comments_count || 0;
          break;
        case 'created_at':
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [feedback, sortConfig]);

  const handleSort = (field) => {
    setSortConfig((prev) => {
      if (prev.field === field) {
        // Toggle direction if same field
        return {
          field,
          direction: prev.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      // New field, default to ascending
      return { field, direction: 'asc' };
    });
  };

  const candidateOptions = useMemo(
    () =>
      (candidates || []).map((c) => ({
        value: c.id.toString(),
        label: c.name || `Candidate ${c.id}`,
      })),
    [candidates],
  );

  const partyOptions = useMemo(
    () =>
      (parties || []).map((p) => ({
        value: p.id.toString(),
        label: p.name || `Party ${p.id}`,
      })),
    [parties],
  );

  const constituencyOptions = useMemo(
    () =>
      (constituencies || []).map((c) => ({
        value: c.id.toString(),
        label: c.name || `Constituency ${c.id}`,
      })),
    [constituencies],
  );

  const statusOptions = [
    { value: 'new', label: 'New' },
    { value: 'in_review', label: 'In Review' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'resolved', label: 'Resolved' },
  ];

  const clearFilters = () => {
    setSearch('');
    setDistrictSlug('');
    setPartyId('');
    setConstituencyId('');
    setCandidateId('');
    setStatus('');
  };

  const hasActiveFilters = search || districtSlug || partyId || constituencyId || candidateId || status;

  const toggleSelectItem = (id) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === feedback.length) {
      // Deselect all
      setSelectedItems(new Set());
    } else {
      // Select all
      setSelectedItems(new Set(feedback.map((item) => item.id)));
    }
  };

  const isAllSelected = feedback.length > 0 && selectedItems.size === feedback.length;
  const isIndeterminate = selectedItems.size > 0 && selectedItems.size < feedback.length;
  const selectAllRef = useRef(null);

  useEffect(() => {
    if (selectAllRef.current) {
      // Access the underlying input element
      const input = selectAllRef.current.querySelector('input[type="checkbox"]');
      if (input) {
        input.indeterminate = isIndeterminate;
      }
    }
  }, [isIndeterminate]);

  return (
    <div className="container">
      <div className="grid gap-5 lg:gap-7.5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-mono mb-2">
              Feedback {pagination.total > 0 && <span className="text-muted-foreground">({pagination.total})</span>}
            </h1>
            <p className="text-sm text-secondary-foreground">Manage all feedback messages</p>
          </div>
        </div>

        {/* Search and Filters - Top */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              {/* Search */}
              <div className="relative flex-1 w-full lg:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search feedback..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2 items-center w-full lg:w-auto">
                <Combobox
                  options={STATIC_DISTRICTS}
                  value={districtSlug}
                  onValueChange={setDistrictSlug}
                  placeholder="District..."
                  className="w-full sm:w-[150px]"
                />
                <Combobox
                  options={partyOptions}
                  value={partyId}
                  onValueChange={setPartyId}
                  placeholder="Party..."
                  className="w-full sm:w-[150px]"
                />
                <Combobox
                  options={constituencyOptions}
                  value={constituencyId}
                  onValueChange={setConstituencyId}
                  placeholder="Constituency..."
                  className="w-full sm:w-[150px]"
                />
                <Combobox
                  options={candidateOptions}
                  value={candidateId}
                  onValueChange={setCandidateId}
                  placeholder="Candidate..."
                  className="w-full sm:w-[150px]"
                />
                <Combobox
                  options={statusOptions}
                  value={status}
                  onValueChange={setStatus}
                  placeholder="Status..."
                  className="w-full sm:w-[150px]"
                />
                {hasActiveFilters && (
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    <X className="size-4 me-1" />
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feedback Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : feedback.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-secondary-foreground">No feedback found.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        ref={selectAllRef}
                        checked={isAllSelected || isIndeterminate}
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>
                      <button
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                        onClick={() => handleSort('description')}
                      >
                        Feedback
                        {sortConfig.field === 'description' ? (
                          sortConfig.direction === 'asc' ? (
                            <ArrowUp className="size-3" />
                          ) : (
                            <ArrowDown className="size-3" />
                          )
                        ) : (
                          <ChevronsUpDown className="size-3 opacity-40" />
                        )}
                      </button>
                    </TableHead>
                    <TableHead>
                      <button
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                        onClick={() => handleSort('candidate')}
                      >
                        Candidate
                        {sortConfig.field === 'candidate' ? (
                          sortConfig.direction === 'asc' ? (
                            <ArrowUp className="size-3" />
                          ) : (
                            <ArrowDown className="size-3" />
                          )
                        ) : (
                          <ChevronsUpDown className="size-3 opacity-40" />
                        )}
                      </button>
                    </TableHead>
                    <TableHead>
                      <button
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                        onClick={() => handleSort('created_at')}
                      >
                        Created At
                        {sortConfig.field === 'created_at' ? (
                          sortConfig.direction === 'asc' ? (
                            <ArrowUp className="size-3" />
                          ) : (
                            <ArrowDown className="size-3" />
                          )
                        ) : (
                          <ChevronsUpDown className="size-3 opacity-40" />
                        )}
                      </button>
                    </TableHead>
                    <TableHead>
                      <button
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                        onClick={() => handleSort('views')}
                      >
                        Views / Comments
                        {sortConfig.field === 'views' ? (
                          sortConfig.direction === 'asc' ? (
                            <ArrowUp className="size-3" />
                          ) : (
                            <ArrowDown className="size-3" />
                          )
                        ) : (
                          <ChevronsUpDown className="size-3 opacity-40" />
                        )}
                      </button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedFeedback.map((item) => (
                    <TableRow
                      key={item.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => openDetailModal(item)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedItems.has(item.id)}
                          onCheckedChange={() => toggleSelectItem(item.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item.description}</span>
                            <span className="text-xs text-muted-foreground">#{item.id}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`${STATUS_COLORS[item.status] || ''} text-xs`}>
                              {item.status?.replace('_', ' ').toUpperCase()}
                            </Badge>
                            {item.category && (
                              <Badge variant="outline" className="text-xs">
                                {item.category}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        {item.candidate ? (
                          <div className="space-y-1">
                            <button
                              type="button"
                              className="text-primary hover:underline font-medium text-left"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEntityModal({
                                  open: true,
                                  type: 'candidate',
                                  id: item.candidate.id,
                                });
                              }}
                            >
                              {item.candidate.name}
                            </button>
                            {item.candidate.constituency && (
                              <div>
                                <button
                                  type="button"
                                  className="text-xs text-muted-foreground hover:text-primary hover:underline text-left"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEntityModal({
                                      open: true,
                                      type: 'constituency',
                                      id: item.candidate.constituency.id,
                                    });
                                  }}
                                >
                                  {item.candidate.constituency.name}
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {item.created_at ? (
                          <div className="text-sm">
                            {new Date(item.created_at).toLocaleDateString()}
                            <div className="text-xs text-muted-foreground">
                              {new Date(item.created_at).toLocaleTimeString()}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Eye className="size-4 text-muted-foreground" />
                            <span className="text-sm">{item.views || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="size-4 text-muted-foreground" />
                            <span className="text-sm">{item.comments_count || 0}</span>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Pagination - Bottom */}
        <DataPagination
          pagination={pagination}
          onPageChange={(newPage) => setPagination({ ...pagination, page: newPage })}
          onPerPageChange={(newPerPage) =>
            setPagination({ ...pagination, per_page: newPerPage, page: 1 })
          }
        />

        {/* Feedback Detail Modal */}
        <FeedbackDetailModal
          open={isDetailOpen}
          onOpenChange={setIsDetailOpen}
          feedback={selectedFeedback}
          onFeedbackUpdate={handleFeedbackUpdate}
        />

        {/* Entity Detail Modal (Candidate, Constituency, Party) */}
        <EntityDetailModal
          type={entityModal.type}
          id={entityModal.id}
          open={entityModal.open}
          onOpenChange={(open) =>
            setEntityModal((prev) => ({ ...prev, open }))
          }
        />
      </div>
    </div>
  );
}
