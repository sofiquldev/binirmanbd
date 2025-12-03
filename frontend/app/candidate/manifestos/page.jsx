'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Search,
  X,
  ArrowUp,
  ArrowDown,
  ChevronsUpDown,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useSelectedCandidate } from '@/hooks/useSelectedCandidate';

const manifestoSchema = z.object({
  category_id: z.string().min(1, 'Category is required'),
  title: z.string().min(1, 'Title is required'),
  title_bn: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  description_bn: z.string().optional(),
  is_visible: z.boolean().default(true),
});

export default function CandidateManifestosPage() {
  const { user, loading: authLoading } = useAuth();
  const { candidate, loading: candidateLoading } = useSelectedCandidate();
  const [manifestos, setManifestos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingManifesto, setEditingManifesto] = useState(null);
  const [selectedManifesto, setSelectedManifesto] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 15,
    total: 0,
    last_page: 1,
  });

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({ field: null, direction: 'asc' });

  const form = useForm({
    resolver: zodResolver(manifestoSchema),
    defaultValues: {
      category_id: '',
      title: '',
      title_bn: '',
      description: '',
      description_bn: '',
      is_visible: true,
    },
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (authLoading || candidateLoading) return;
    if (!candidate) {
      setLoading(false);
      return;
    }
    fetchManifestos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, candidateLoading, candidate, pagination.page, pagination.per_page, search, categoryFilter, statusFilter]);

  useEffect(() => {
    if (!isDetailOpen) {
      setSelectedManifesto(null);
    }
  }, [isDetailOpen]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/election-manifesto-categories');
      setCategories(response.data.data || response.data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchManifestos = async () => {
    if (!candidate) return;

    setLoading(true);
    try {
      const response = await api.get(`/candidates/${candidate.id}/manifestos`);
      const data = response.data.data || response.data || [];
      setManifestos(data);
      setPagination((prev) => ({
        ...prev,
        total: data.length,
        last_page: 1,
      }));
    } catch (error) {
      console.error('Failed to fetch manifestos:', error);
      toast.error('Failed to load manifestos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingManifesto(null);
    form.reset({
      category_id: '',
      title: '',
      title_bn: '',
      description: '',
      description_bn: '',
      is_visible: true,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (manifesto) => {
    setEditingManifesto(manifesto);
    form.reset({
      category_id: String(manifesto.category_id || ''),
      title: manifesto.title || '',
      title_bn: manifesto.title_bn || '',
      description: manifesto.description || '',
      description_bn: manifesto.description_bn || '',
      is_visible: manifesto.is_visible ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this manifesto?')) return;
    try {
      await api.delete(`/candidates/${candidate.id}/manifestos/${id}`);
      toast.success('Manifesto deleted successfully');
      fetchManifestos();
      setSelectedItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } catch (error) {
      toast.error('Failed to delete manifesto');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) return;

    const count = selectedItems.size;
    const confirmMessage = `Are you sure you want to delete ${count} manifesto${count > 1 ? 's' : ''}?`;

    if (!confirm(confirmMessage)) return;

    try {
      const deletePromises = Array.from(selectedItems).map((id) =>
        api.delete(`/candidates/${candidate.id}/manifestos/${id}`)
      );

      await Promise.all(deletePromises);
      toast.success(`Successfully deleted ${count} manifesto${count > 1 ? 's' : ''}`);
      setSelectedItems(new Set());
      fetchManifestos();
    } catch (error) {
      toast.error('Failed to delete some manifestos');
      console.error('Bulk delete error:', error);
    }
  };

  const openDetailModal = (manifesto) => {
    setSelectedManifesto(manifesto);
    setIsDetailOpen(true);
    fetchManifestoDetails(manifesto.id);
  };

  const fetchManifestoDetails = async (manifestoId) => {
    setDetailLoading(true);
    try {
      const res = await api.get(`/candidates/${candidate.id}/manifestos/${manifestoId}`);
      setSelectedManifesto(res.data);
      setManifestos((prev) =>
        prev.map((m) => (m.id === manifestoId ? res.data : m))
      );
    } catch (error) {
      console.error('Failed to fetch manifesto details:', error);
      toast.error('Failed to load manifesto details');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleManifestoUpdate = () => {
    fetchManifestos();
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
          m.id === manifesto.id ? { ...m, dislikes: (m.dislikes || 0) + 1 } : m
        )
      );
    } catch (error) {
      console.error('Failed to dislike:', error);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingManifesto) {
        await api.put(`/candidates/${candidate.id}/manifestos/${editingManifesto.id}`, data);
        toast.success('Manifesto updated successfully');
      } else {
        await api.post(`/candidates/${candidate.id}/manifestos`, data);
        toast.success('Manifesto created successfully');
      }
      setIsDialogOpen(false);
      fetchManifestos();
      form.reset();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          `Failed to ${editingManifesto ? 'update' : 'create'} manifesto`
      );
    }
  };

  // Filter and sort manifestos
  const filteredAndSortedManifestos = useMemo(() => {
    let filtered = manifestos;

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.title?.toLowerCase().includes(searchLower) ||
          m.title_bn?.toLowerCase().includes(searchLower) ||
          m.description?.toLowerCase().includes(searchLower) ||
          m.category?.name?.toLowerCase().includes(searchLower)
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter((m) => String(m.category_id) === categoryFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter((m) => {
        if (statusFilter === 'visible') return m.is_visible === true;
        if (statusFilter === 'hidden') return m.is_visible === false;
        return true;
      });
    }

    if (sortConfig.field) {
      filtered = [...filtered].sort((a, b) => {
        let aValue, bValue;

        switch (sortConfig.field) {
          case 'title':
            aValue = a.title?.toLowerCase() || '';
            bValue = b.title?.toLowerCase() || '';
            break;
          case 'category':
            aValue = a.category?.name?.toLowerCase() || '';
            bValue = b.category?.name?.toLowerCase() || '';
            break;
          case 'views':
            aValue = a.views || 0;
            bValue = b.views || 0;
            break;
          case 'likes':
            aValue = a.likes || 0;
            bValue = b.likes || 0;
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
    }

    return filtered;
  }, [manifestos, search, categoryFilter, statusFilter, sortConfig]);

  // Paginate filtered results
  const paginatedManifestos = useMemo(() => {
    const start = (pagination.page - 1) * pagination.per_page;
    const end = start + pagination.per_page;
    return filteredAndSortedManifestos.slice(start, end);
  }, [filteredAndSortedManifestos, pagination.page, pagination.per_page]);

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

  const statusOptions = [
    { value: 'visible', label: 'Visible' },
    { value: 'hidden', label: 'Hidden' },
  ];

  const clearFilters = () => {
    setSearch('');
    setCategoryFilter('');
    setStatusFilter('');
  };

  const hasActiveFilters = search || categoryFilter || statusFilter;

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
    if (selectedItems.size === paginatedManifestos.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(paginatedManifestos.map((m) => m.id)));
    }
  };

  const isAllSelected =
    paginatedManifestos.length > 0 && selectedItems.size === paginatedManifestos.length;
  const isIndeterminate =
    selectedItems.size > 0 && selectedItems.size < paginatedManifestos.length;
  const selectAllRef = useRef(null);

  useEffect(() => {
    if (selectAllRef.current) {
      const input = selectAllRef.current.querySelector('input[type="checkbox"]');
      if (input) {
        input.indeterminate = isIndeterminate;
      }
    }
  }, [isIndeterminate]);

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      total: filteredAndSortedManifestos.length,
      last_page: Math.ceil(filteredAndSortedManifestos.length / prev.per_page),
    }));
  }, [filteredAndSortedManifestos.length]);

  if (loading && manifestos.length === 0) {
    return (
      <div className="container">
        <div className="grid gap-5 lg:gap-7.5">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="grid gap-5 lg:gap-7.5">
        <div>
          <h1 className="text-2xl font-semibold text-mono mb-2">
            Manifestos {pagination.total > 0 && <span className="text-muted-foreground">({pagination.total})</span>}
          </h1>
          <p className="text-sm text-secondary-foreground">
            Manage your election manifestos
          </p>
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
                  options={statusOptions}
                  value={statusFilter}
                  onValueChange={setStatusFilter}
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

        {/* Manifestos Table */}
        <Card>
          <CardHeader>
            <div className="w-full flex items-center justify-between">
              <CardTitle>All Manifestos {pagination.total > 0 && `(${pagination.total})`}</CardTitle>
              <div className="flex items-center gap-2">
                {selectedItems.size > 0 && (
                  <Button variant="destructive" onClick={handleBulkDelete}>
                    <Trash2 className="size-4 me-2" />
                    Delete ({selectedItems.size})
                  </Button>
                )}
                <Button onClick={handleCreate}>
                  <Plus className="size-4 me-2" />
                  Add Manifesto
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : paginatedManifestos.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-secondary-foreground">
                  {manifestos.length === 0
                    ? 'No manifestos found. Create your first manifesto to get started.'
                    : 'No manifestos match your filters.'}
                </p>
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
                  {paginatedManifestos.map((manifesto) => (
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
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(manifesto)}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(manifesto.id)}
                          >
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {filteredAndSortedManifestos.length > 0 && (
          <DataPagination
            pagination={pagination}
            onPageChange={(newPage) => setPagination({ ...pagination, page: newPage })}
            onPerPageChange={(newPerPage) =>
              setPagination({
                ...pagination,
                per_page: newPerPage,
                page: 1,
              })
            }
          />
        )}

        {/* Manifesto Detail Modal */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Manifesto Details</DialogTitle>
              <DialogDescription>View and manage manifesto details</DialogDescription>
            </DialogHeader>

            {detailLoading ? (
              <div className="py-8 text-center text-muted-foreground">Loading...</div>
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
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">{selectedManifesto.title}</h3>
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
                      <span className="font-medium">{selectedManifesto.views || 0}</span>
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
                {selectedManifesto.comments && selectedManifesto.comments.length > 0 && (
                  <div className="space-y-4 border-t pt-4">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="size-4" />
                      <h3 className="font-semibold">Comments</h3>
                      <Badge variant="outline">{selectedManifesto.comments.length}</Badge>
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
              <div className="py-8 text-center text-muted-foreground">No manifesto selected</div>
            )}
          </DialogContent>
        </Dialog>

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingManifesto ? 'Edit Manifesto' : 'Create Manifesto'}
              </DialogTitle>
              <DialogDescription>
                {editingManifesto
                  ? 'Update the manifesto details below.'
                  : 'Fill in the details to create a new manifesto.'}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={String(category.id)}>
                              {category.name}
                              {category.name_bn && ` (${category.name_bn})`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title (English)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter title" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="title_bn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title (Bangla)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="শিরোনাম লিখুন" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (English)</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Enter description" rows={4} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description_bn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Bangla)</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="বিবরণ লিখুন" rows={4} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">{editingManifesto ? 'Update' : 'Create'}</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

