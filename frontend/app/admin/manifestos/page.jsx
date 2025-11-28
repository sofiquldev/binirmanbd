'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
import {
  Search,
  X,
  Eye,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  ArrowUp,
  ArrowDown,
  ChevronsUpDown,
  User,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { EntityDetailModal } from '@/components/common/EntityDetailModal';

export default function AdminManifestosPage() {
  const router = useRouter();
  const [manifestos, setManifestos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedManifesto, setSelectedManifesto] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [entityModal, setEntityModal] = useState({
    open: false,
    type: null,
    id: null,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 15,
    total: 0,
    last_page: 1,
  });

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [candidateFilter, setCandidateFilter] = useState('');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({ field: null, direction: 'asc' });

  useEffect(() => {
    fetchManifestos();
    fetchCategories();
    fetchCandidates();
  }, [pagination.page, pagination.per_page, search, categoryFilter, candidateFilter]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/election-manifesto-categories');
      setCategories(response.data.data || response.data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchCandidates = async () => {
    try {
      const response = await api.get('/candidates', { params: { per_page: 1000 } });
      setCandidates(response.data.data || response.data || []);
    } catch (error) {
      console.error('Failed to fetch candidates:', error);
    }
  };

  const fetchManifestos = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        per_page: pagination.per_page.toString(),
      });

      if (search) params.append('search', search);
      if (categoryFilter) params.append('category_id', categoryFilter);
      if (candidateFilter) params.append('candidate_id', candidateFilter);

      const response = await api.get(`/manifestos?${params}`);
      setManifestos(response.data.data || []);
      setPagination({
        page: response.data.current_page || 1,
        per_page: response.data.per_page || 15,
        total: response.data.total || 0,
        last_page: response.data.last_page || 1,
      });
    } catch (error) {
      console.error('Failed to fetch manifestos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    setSortConfig((prev) => {
      if (prev.field === field) {
        return {
          field,
          direction: prev.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { field, direction: 'asc' };
    });
  };

  const categoryOptions = useMemo(
    () =>
      categories.map((cat) => ({
        value: String(cat.id),
        label: cat.name,
      })),
    [categories]
  );

  const candidateOptions = useMemo(
    () =>
      candidates.map((c) => ({
        value: String(c.id),
        label: c.name,
      })),
    [candidates]
  );

  const clearFilters = () => {
    setSearch('');
    setCategoryFilter('');
    setCandidateFilter('');
  };

  const hasActiveFilters = search || categoryFilter || candidateFilter;

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
    if (selectedItems.size === manifestos.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(manifestos.map((m) => m.id)));
    }
  };

  const isAllSelected =
    manifestos.length > 0 && selectedItems.size === manifestos.length;
  const isIndeterminate =
    selectedItems.size > 0 && selectedItems.size < manifestos.length;
  const selectAllRef = useRef(null);

  useEffect(() => {
    if (selectAllRef.current) {
      const input = selectAllRef.current.querySelector('input[type="checkbox"]');
      if (input) {
        input.indeterminate = isIndeterminate;
      }
    }
  }, [isIndeterminate]);

  const openDetailModal = (manifesto) => {
    setSelectedManifesto(manifesto);
    setIsDetailOpen(true);
    fetchManifestoDetails(manifesto.candidate_id, manifesto.id);
  };

  const fetchManifestoDetails = async (candidateId, manifestoId) => {
    setDetailLoading(true);
    try {
      const res = await api.get(
        `/candidates/${candidateId}/manifestos/${manifestoId}`
      );
      setSelectedManifesto(res.data);
      // Update the manifesto in the list with new view count
      setManifestos((prev) =>
        prev.map((m) => (m.id === manifestoId ? res.data : m))
      );
    } catch (error) {
      console.error('Failed to fetch manifesto details:', error);
      console.error('Error response:', error.response?.data);
      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          'Failed to load manifesto details. Please try again.'
      );
    } finally {
      setDetailLoading(false);
    }
  };

  const handleLike = async (manifesto) => {
    try {
      setSelectedManifesto({
        ...selectedManifesto,
        likes: (selectedManifesto.likes || 0) + 1,
      });
      setManifestos((prev) =>
        prev.map((m) =>
          m.id === manifesto.id ? { ...m, likes: (m.likes || 0) + 1 } : m
        )
      );
    } catch (error) {
      console.error('Failed to like:', error);
    }
  };

  const handleDislike = async (manifesto) => {
    try {
      setSelectedManifesto({
        ...selectedManifesto,
        dislikes: (selectedManifesto.dislikes || 0) + 1,
      });
      setManifestos((prev) =>
        prev.map((m) =>
          m.id === manifesto.id
            ? { ...m, dislikes: (m.dislikes || 0) + 1 }
            : m
        )
      );
    } catch (error) {
      console.error('Failed to dislike:', error);
    }
  };

  useEffect(() => {
    if (!isDetailOpen) {
      setSelectedManifesto(null);
    }
  }, [isDetailOpen]);

  // Filter and sort manifestos
  const sortedManifestos = useMemo(() => {
    if (!sortConfig.field) {
      return manifestos;
    }

    return [...manifestos].sort((a, b) => {
      let aValue, bValue;

      switch (sortConfig.field) {
        case 'title':
          aValue = a.title?.toLowerCase() || '';
          bValue = b.title?.toLowerCase() || '';
          break;
        case 'candidate':
          aValue = a.candidate?.name?.toLowerCase() || '';
          bValue = b.candidate?.name?.toLowerCase() || '';
          break;
        case 'category':
          aValue = a.category?.name?.toLowerCase() || '';
          bValue = b.category?.name?.toLowerCase() || '';
          break;
        case 'views':
          aValue = a.views || 0;
          bValue = b.views || 0;
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
  }, [manifestos, sortConfig]);

  if (loading && manifestos.length === 0) {
    return (
      <div className="container">
        <div className="grid gap-5">
          <Skeleton className="h-12" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="grid gap-5 lg:gap-7.5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-mono mb-2">
              All Manifestos {pagination.total > 0 && <span className="text-muted-foreground">({pagination.total})</span>}
            </h1>
            <p className="text-sm text-secondary-foreground">
              Manage all election manifestos from all candidates
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              {/* Search */}
              <div className="relative flex-1 w-full lg:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search manifestos..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2 items-center w-full lg:w-auto">
                <Combobox
                  options={categoryOptions}
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                  placeholder="Category..."
                  className="w-full sm:w-[150px]"
                />
                <Combobox
                  options={candidateOptions}
                  value={candidateFilter}
                  onValueChange={setCandidateFilter}
                  placeholder="Candidate..."
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

        {/* Manifestos Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Manifestos {pagination.total > 0 && `(${pagination.total})`}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : manifestos.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-secondary-foreground">No manifestos found.</p>
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
                        onClick={() => handleSort('title')}
                      >
                        Title
                        {sortConfig.field === 'title' ? (
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
                        onClick={() => handleSort('category')}
                      >
                        Category
                        {sortConfig.field === 'category' ? (
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
                        Views
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
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedManifestos.map((manifesto) => (
                    <TableRow
                      key={manifesto.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => openDetailModal(manifesto)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedItems.has(manifesto.id)}
                          onCheckedChange={() => toggleSelectItem(manifesto.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{manifesto.title}</div>
                          {manifesto.title_bn && (
                            <div className="text-sm text-muted-foreground">
                              {manifesto.title_bn}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        {manifesto.candidate ? (
                          <div className="space-y-1">
                            <button
                              type="button"
                              className="text-primary hover:underline font-medium text-left"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEntityModal({
                                  open: true,
                                  type: 'candidate',
                                  id: manifesto.candidate.id,
                                });
                              }}
                            >
                              {manifesto.candidate.name}
                            </button>
                            {manifesto.candidate.constituency && (
                              <div>
                                <button
                                  type="button"
                                  className="text-xs text-muted-foreground hover:text-primary hover:underline text-left"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEntityModal({
                                      open: true,
                                      type: 'constituency',
                                      id: manifesto.candidate.constituency.id,
                                    });
                                  }}
                                >
                                  {manifesto.candidate.constituency.name}
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {manifesto.category?.name || 'N/A'}
                          </div>
                          {manifesto.category?.name_bn && (
                            <div className="text-sm text-muted-foreground">
                              {manifesto.category.name_bn}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Eye className="size-4 text-muted-foreground" />
                          <span>{manifesto.views || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            manifesto.is_visible
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                          }
                        >
                          {manifesto.is_visible ? 'Visible' : 'Hidden'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                        >
                          <Link href={`/admin/candidates/${manifesto.candidate_id}/manifesto`}>
                            <Eye className="size-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {manifestos.length > 0 && (
          <DataPagination
            pagination={pagination}
            onPageChange={(newPage) => setPagination({ ...pagination, page: newPage })}
            onPerPageChange={(newPerPage) =>
              setPagination({ ...pagination, per_page: newPerPage, page: 1 })
            }
          />
        )}

        {/* Manifesto Detail Modal */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Manifesto Details</DialogTitle>
              <DialogDescription>
                View and manage manifesto details
              </DialogDescription>
            </DialogHeader>

            {detailLoading ? (
              <div className="py-8 text-center text-muted-foreground">
                Loading...
              </div>
            ) : selectedManifesto ? (
              <div className="space-y-6">
                {/* Manifesto Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        selectedManifesto.is_visible
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }
                    >
                      {selectedManifesto.is_visible ? 'Visible' : 'Hidden'}
                    </Badge>
                    {selectedManifesto.category && (
                      <Badge variant="outline">
                        {selectedManifesto.category.name}
                        {selectedManifesto.category.name_bn &&
                          ` (${selectedManifesto.category.name_bn})`}
                      </Badge>
                    )}
                    {selectedManifesto.candidate && (
                      <Badge variant="outline">
                        <Link
                          href={`/admin/candidates/${selectedManifesto.candidate.id}`}
                          className="hover:underline"
                        >
                          {selectedManifesto.candidate.name}
                        </Link>
                      </Badge>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {selectedManifesto.title}
                    </h3>
                    {selectedManifesto.title_bn && (
                      <h4 className="text-base font-medium text-muted-foreground mb-2">
                        {selectedManifesto.title_bn}
                      </h4>
                    )}
                    <div className="space-y-2">
                      <p className="text-sm text-secondary-foreground whitespace-pre-line">
                        {selectedManifesto.description}
                      </p>
                      {selectedManifesto.description_bn && (
                        <p className="text-sm text-secondary-foreground whitespace-pre-line">
                          {selectedManifesto.description_bn}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Eye className="size-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Views:</span>
                      <span className="font-medium">
                        {selectedManifesto.views || 0}
                      </span>
                    </div>
                    {selectedManifesto.created_at && (
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Created:</span>
                        <span className="font-medium">
                          {new Date(selectedManifesto.created_at).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLike(selectedManifesto)}
                    >
                      <ThumbsUp className="size-4 me-2" />
                      Like ({selectedManifesto.likes || 0})
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDislike(selectedManifesto)}
                    >
                      <ThumbsDown className="size-4 me-2" />
                      Dislike ({selectedManifesto.dislikes || 0})
                    </Button>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Eye className="size-4" />
                      <span>{selectedManifesto.views || 0} views</span>
                    </div>
                  </div>
                </div>

                {/* Comments Section */}
                {selectedManifesto.comments &&
                  selectedManifesto.comments.length > 0 && (
                    <div className="space-y-4 border-t pt-4">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="size-4" />
                        <h3 className="font-semibold">Comments</h3>
                        <Badge variant="outline">
                          {selectedManifesto.comments.length}
                        </Badge>
                      </div>

                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Comment</TableHead>
                            <TableHead>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedManifesto.comments.map((comment) => (
                            <TableRow key={comment.id}>
                              <TableCell>
                                <p className="text-sm">{comment.body}</p>
                              </TableCell>
                              <TableCell>
                                <span className="text-xs text-muted-foreground">
                                  {comment.created_at
                                    ? new Date(comment.created_at).toLocaleString()
                                    : 'N/A'}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No manifesto selected
              </div>
            )}
          </DialogContent>
        </Dialog>

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

