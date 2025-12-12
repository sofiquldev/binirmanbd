'use client';

import { useEffect, useState, useMemo, useRef } from 'react'; 
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { DataPagination } from '@/components/ui/data-pagination';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  Search,
  X,
  ArrowUp,
  ArrowDown,
  ChevronsUpDown,
  Calendar,
  User,
  Star,
  Image as ImageIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';

const buildPreview = (file) => (file ? URL.createObjectURL(file) : '');

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
      <div>
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

const testimonialSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  author_name_bn: z.string().optional(),
  designation: z.string().optional(),
  author_designation_bn: z.string().optional(),
  quote: z.string().min(1, 'Quote is required'),
  content_bn: z.string().optional(),
  photo_url: z.string().optional(),
  avatar_url: z.string().optional(),
  is_featured: z.boolean().default(false),
});

export default function CandidateTestimonialsPage() {
  const params = useParams();
  const candidateId = params.id;
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 15,
    total: 0,
    last_page: 1,
  });

  // Filters
  const [search, setSearch] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState('');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({ field: null, direction: 'asc' });

  const [photoUrl, setPhotoUrl] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const form = useForm({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      name: '',
      author_name_bn: '',
      designation: '',
      author_designation_bn: '',
      quote: '',
      content_bn: '',
      photo_url: '',
      avatar_url: '',
      is_featured: false,
    },
  });

  useEffect(() => {
    if (candidateId) {
      fetchTestimonials();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidateId, pagination.page, pagination.per_page, search, featuredFilter]);

  useEffect(() => {
    if (!isDetailOpen) {
      setSelectedTestimonial(null);
    }
  }, [isDetailOpen]);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/candidates/${candidateId}/testimonials`);
      const data = response.data.data || response.data || [];
      setTestimonials(data);
      setPagination((prev) => ({
        ...prev,
        total: data.length,
        last_page: 1,
      }));
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingTestimonial(null);
    setPhotoUrl('');
    setAvatarUrl('');
    form.reset({
      name: '',
      author_name_bn: '',
      designation: '',
      author_designation_bn: '',
      quote: '',
      content_bn: '',
      photo_url: '',
      avatar_url: '',
      is_featured: false,
    });
    setIsDialogOpen(true);
  };

  const uploadAndSet = async (field, file) => {
    const previewField = field === 'photo_url' ? 'photoUrl' : 'avatarUrl';
    // Optimistic preview
    if (field === 'photo_url') {
      setPhotoUrl(buildPreview(file));
    } else {
      setAvatarUrl(buildPreview(file));
    }

    try {
      const data = new FormData();
      data.append('file', file);
      const res = await api.post(`/candidates/${candidateId}/testimonials/upload`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const url = res.data?.url;
      if (url) {
        if (field === 'photo_url') {
          setPhotoUrl(url);
          form.setValue('photo_url', url);
        } else {
          setAvatarUrl(url);
          form.setValue('avatar_url', url);
        }
        toast.success('Image uploaded successfully');
      }
    } catch (error) {
      console.error(error);
      toast.error('Upload failed. Please try again.');
      // Reset preview on error
      if (field === 'photo_url') {
        setPhotoUrl(form.getValues('photo_url') || '');
      } else {
        setAvatarUrl(form.getValues('avatar_url') || '');
      }
    }
  };

  const handleEdit = (testimonial) => {
    setEditingTestimonial(testimonial);
    setPhotoUrl(testimonial.photo_url || '');
    setAvatarUrl(testimonial.avatar_url || '');
    form.reset({
      name: testimonial.name || '',
      author_name_bn: testimonial.author_name_bn || '',
      designation: testimonial.designation || '',
      author_designation_bn: testimonial.author_designation_bn || '',
      quote: testimonial.quote || '',
      content_bn: testimonial.content_bn || '',
      photo_url: testimonial.photo_url || '',
      avatar_url: testimonial.avatar_url || '',
      is_featured: testimonial.is_featured ?? false,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await api.delete(`/candidates/${candidateId}/testimonials/${id}`);
      toast.success('Testimonial deleted successfully');
      fetchTestimonials();
      setSelectedItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } catch (error) {
      toast.error('Failed to delete testimonial');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) return;
    
    const count = selectedItems.size;
    const confirmMessage = `Are you sure you want to delete ${count} testimonial${count > 1 ? 's' : ''}?`;
    
    if (!confirm(confirmMessage)) return;
    
    try {
      const deletePromises = Array.from(selectedItems).map((id) =>
        api.delete(`/candidates/${candidateId}/testimonials/${id}`)
      );
      
      await Promise.all(deletePromises);
      
      setSelectedItems(new Set());
      toast.success(`${count} testimonial${count > 1 ? 's' : ''} deleted successfully`);
      fetchTestimonials();
    } catch (error) {
      toast.error('Failed to delete some testimonials');
      console.error('Bulk delete error:', error);
    }
  };

  const openDetailModal = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsDetailOpen(true);
    fetchTestimonialDetails(testimonial.id);
  };

  const fetchTestimonialDetails = async (testimonialId) => {
    setDetailLoading(true);
    try {
      const res = await api.get(
        `/candidates/${candidateId}/testimonials/${testimonialId}`
      );
      setSelectedTestimonial(res.data);
      setTestimonials((prev) =>
        prev.map((t) => (t.id === testimonialId ? res.data : t))
      );
    } catch (error) {
      console.error('Failed to fetch testimonial details:', error);
      toast.error('Failed to load testimonial details');
    } finally {
      setDetailLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      if (data.author_name_bn) formData.append('author_name_bn', data.author_name_bn);
      if (data.designation) formData.append('designation', data.designation);
      if (data.author_designation_bn) formData.append('author_designation_bn', data.author_designation_bn);
      formData.append('quote', data.quote);
      if (data.content_bn) formData.append('content_bn', data.content_bn);
      formData.append('is_featured', data.is_featured ? '1' : '0');

      // Send URLs (already uploaded via upload endpoint)
      if (data.photo_url) {
        formData.append('photo_url', data.photo_url);
      }
      if (data.avatar_url) {
        formData.append('avatar_url', data.avatar_url);
      }

      if (editingTestimonial) {
        // Use POST with method override so Laravel can parse multipart/form-data
        formData.append('_method', 'PUT');
        await api.post(
          `/candidates/${candidateId}/testimonials/${editingTestimonial.id}`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        toast.success('Testimonial updated successfully');
      } else {
        await api.post(`/candidates/${candidateId}/testimonials`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Testimonial created successfully');
      }
      setIsDialogOpen(false);
      fetchTestimonials();
      form.reset();
      setPhotoUrl('');
      setAvatarUrl('');
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          `Failed to ${editingTestimonial ? 'update' : 'create'} testimonial`
      );
    }
  };

  // Filter and sort testimonials
  const filteredAndSortedTestimonials = useMemo(() => {
    let filtered = testimonials;

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.name?.toLowerCase().includes(searchLower) ||
          t.author_name_bn?.toLowerCase().includes(searchLower) ||
          t.quote?.toLowerCase().includes(searchLower) ||
          t.designation?.toLowerCase().includes(searchLower)
      );
    }

    // Apply featured filter
    if (featuredFilter) {
      filtered = filtered.filter((t) => {
        if (featuredFilter === 'featured') return t.is_featured === true;
        if (featuredFilter === 'not_featured') return t.is_featured === false;
        return true;
      });
    }

    // Apply sorting
    if (sortConfig.field) {
      filtered = [...filtered].sort((a, b) => {
        let aValue, bValue;

        switch (sortConfig.field) {
          case 'name':
            aValue = a.name?.toLowerCase() || '';
            bValue = b.name?.toLowerCase() || '';
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
  }, [testimonials, search, featuredFilter, sortConfig]);

  // Paginate filtered results
  const paginatedTestimonials = useMemo(() => {
    const start = (pagination.page - 1) * pagination.per_page;
    const end = start + pagination.per_page;
    return filteredAndSortedTestimonials.slice(start, end);
  }, [filteredAndSortedTestimonials, pagination.page, pagination.per_page]);

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

  const featuredOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'not_featured', label: 'Not Featured' },
  ];

  const clearFilters = () => {
    setSearch('');
    setFeaturedFilter('');
  };

  const hasActiveFilters = search || featuredFilter;

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
    if (selectedItems.size === paginatedTestimonials.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(paginatedTestimonials.map((t) => t.id)));
    }
  };

  const isAllSelected =
    paginatedTestimonials.length > 0 &&
    selectedItems.size === paginatedTestimonials.length;
  const isIndeterminate =
    selectedItems.size > 0 && selectedItems.size < paginatedTestimonials.length;
  const selectAllRef = useRef(null);

  useEffect(() => {
    if (selectAllRef.current) {
      const input = selectAllRef.current.querySelector('input[type="checkbox"]');
      if (input) {
        input.indeterminate = isIndeterminate;
      }
    }
  }, [isIndeterminate]);

  // Update pagination total when filtered results change
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      total: filteredAndSortedTestimonials.length,
      last_page: Math.ceil(filteredAndSortedTestimonials.length / prev.per_page),
    }));
  }, [filteredAndSortedTestimonials.length]);

  if (loading && testimonials.length === 0) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-5 lg:gap-7.5">
        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              {/* Search */}
              <div className="relative flex-1 w-full lg:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search testimonials..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2 items-center w-full lg:w-auto">
                <select
                  value={featuredFilter}
                  onChange={(e) => setFeaturedFilter(e.target.value)}
                  className="flex h-9 w-full sm:w-[150px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">All Status</option>
                  {featuredOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
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

        {/* Testimonials Table */}
        <Card>
          <CardHeader>
            <div className="w-full flex items-center justify-between">
              <CardTitle>All Testimonials {pagination.total > 0 && `(${pagination.total})`}</CardTitle>
              <div className="flex items-center gap-2">
                {selectedItems.size > 0 && (
                  <Button
                    variant="destructive"
                    onClick={handleBulkDelete}
                  >
                    <Trash2 className="size-4 me-2" />
                    Delete ({selectedItems.size})
                  </Button>
                )}
                <Button onClick={handleCreate}>
                  <Plus className="size-4 me-2" />
                  Add Testimonial
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
            ) : paginatedTestimonials.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-secondary-foreground">
                  {testimonials.length === 0
                    ? 'No testimonials found. Create your first testimonial to get started.'
                    : 'No testimonials match your filters.'}
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
                        onClick={() => handleSort('name')}
                      >
                        Name
                        {sortConfig.field === 'name' ? (
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
                    <TableHead>Quote</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTestimonials.map((testimonial) => (
                    <TableRow
                      key={testimonial.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => openDetailModal(testimonial)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedItems.has(testimonial.id)}
                          onCheckedChange={() => toggleSelectItem(testimonial.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{testimonial.name}</div>
                          {testimonial.author_name_bn && (
                            <div className="text-sm text-muted-foreground">
                              {testimonial.author_name_bn}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-md truncate">
                          {testimonial.quote}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {testimonial.designation || 'N/A'}
                          </div>
                          {testimonial.author_designation_bn && (
                            <div className="text-sm text-muted-foreground">
                              {testimonial.author_designation_bn}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            testimonial.is_featured
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                          }
                        >
                          {testimonial.is_featured ? (
                            <span className="flex items-center gap-1">
                              <Star className="size-3 fill-current" />
                              Featured
                            </span>
                          ) : (
                            'Not Featured'
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(testimonial)}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(testimonial.id)}
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
        {filteredAndSortedTestimonials.length > 0 && (
          <DataPagination
            pagination={pagination}
            onPageChange={(newPage) =>
              setPagination({ ...pagination, page: newPage })
            }
            onPerPageChange={(newPerPage) =>
              setPagination({
                ...pagination,
                per_page: newPerPage,
                page: 1,
              })
            }
          />
        )}

        {/* Testimonial Detail Modal */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Testimonial Details</DialogTitle>
              <DialogDescription>
                View testimonial details
              </DialogDescription>
            </DialogHeader>

            {detailLoading ? (
              <div className="py-8 text-center text-muted-foreground">
                Loading...
              </div>
            ) : selectedTestimonial ? (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        selectedTestimonial.is_featured
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }
                    >
                      {selectedTestimonial.is_featured ? (
                        <span className="flex items-center gap-1">
                          <Star className="size-3 fill-current" />
                          Featured
                        </span>
                      ) : (
                        'Not Featured'
                      )}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedTestimonial.photo_url && (
                      <div>
                        <img
                          src={selectedTestimonial.photo_url}
                          alt={selectedTestimonial.name}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    {selectedTestimonial.avatar_url && (
                      <div>
                        <img
                          src={selectedTestimonial.avatar_url}
                          alt={selectedTestimonial.name}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {selectedTestimonial.name}
                    </h3>
                    {selectedTestimonial.author_name_bn && (
                      <h4 className="text-base font-medium text-muted-foreground mb-2">
                        {selectedTestimonial.author_name_bn}
                      </h4>
                    )}
                    {selectedTestimonial.designation && (
                      <p className="text-sm text-muted-foreground mb-4">
                        {selectedTestimonial.designation}
                        {selectedTestimonial.author_designation_bn &&
                          ` (${selectedTestimonial.author_designation_bn})`}
                      </p>
                    )}
                    <div className="space-y-2">
                      <p className="text-sm text-secondary-foreground whitespace-pre-line">
                        "{selectedTestimonial.quote}"
                      </p>
                      {selectedTestimonial.content_bn && (
                        <p className="text-sm text-secondary-foreground whitespace-pre-line">
                          "{selectedTestimonial.content_bn}"
                        </p>
                      )}
                    </div>
                  </div>

                  {selectedTestimonial.created_at && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="size-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Created:</span>
                      <span className="font-medium">
                        {new Date(selectedTestimonial.created_at).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No testimonial selected
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Create/Edit Dialog */}
        <Dialog 
          open={isDialogOpen} 
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setPhotoUrl('');
              setAvatarUrl('');
              form.reset();
            }
          }}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTestimonial ? 'Edit Testimonial' : 'Create Testimonial'}
              </DialogTitle>
              <DialogDescription>
                {editingTestimonial
                  ? 'Update the testimonial details below.'
                  : 'Fill in the details to create a new testimonial.'}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name (English)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="author_name_bn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name (Bangla)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="নাম লিখুন" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="designation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Designation (English)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter designation" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="author_designation_bn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Designation (Bangla)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="পদবী লিখুন" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="quote"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quote (English)</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Enter quote"
                            rows={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="content_bn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quote (Bangla)</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="উক্তি লিখুন"
                            rows={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="photo_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <DropzoneInput
                            label="Photo"
                            hint="Large image for testimonial display"
                            field="photo_url"
                            fileUrl={photoUrl}
                            onUpload={uploadAndSet}
                            heightClass="h-32"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="avatar_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <DropzoneInput
                            label="Avatar"
                            hint="Small profile image"
                            field="avatar_url"
                            fileUrl={avatarUrl}
                            onUpload={uploadAndSet}
                            heightClass="h-32"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="is_featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Featured</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingTestimonial ? 'Update' : 'Create'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

