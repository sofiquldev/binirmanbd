'use client';

import { useEffect, useMemo, useState } from 'react';
import { useReactTable, getCoreRowModel, getPaginationRowModel } from '@tanstack/react-table';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataGrid, DataGridContainer } from '@/components/ui/data-grid';
import { DataGridTable } from '@/components/ui/data-grid-table';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, FileText } from 'lucide-react';

// Simple slug generator
const generateSlug = (value) =>
  value
    ?.toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || '';

export default function ManifestoCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 15,
    total: 0,
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [detailCategory, setDetailCategory] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    name_bn: '',
    slug: '',
    description: '',
    description_bn: '',
    is_active: true,
    sort_order: 0,
  });

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get('/election-manifesto-categories', {
        params: {
          page: pagination.page,
          per_page: pagination.per_page,
        },
      });
      const data = response.data.data || response.data || [];
      setCategories(data);
      setPagination((prev) => ({
        ...prev,
        total: Array.isArray(data) ? data.length : data.total || 0,
      }));
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormError('');
    setFormData({
      name: '',
      name_bn: '',
      slug: '',
      description: '',
      description_bn: '',
      is_active: true,
      sort_order: 0,
    });
    setIsFormOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setFormError('');
    setFormData({
      name: category.name || '',
      name_bn: category.name_bn || '',
      slug: category.slug || '',
      description: category.description || '',
      description_bn: category.description_bn || '',
      is_active: category.is_active ?? true,
      sort_order: category.sort_order || 0,
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError('');

    try {
      const payload = {
        name: formData.name,
        name_bn: formData.name_bn || null,
        slug: formData.slug || generateSlug(formData.name),
        description: formData.description || null,
        description_bn: formData.description_bn || null,
        is_active: formData.is_active,
        sort_order: formData.sort_order || 0,
      };

      if (editingCategory) {
        await api.put(`/election-manifesto-categories/${editingCategory.id}`, payload);
      } else {
        await api.post('/election-manifesto-categories', payload);
      }

      setIsFormOpen(false);
      fetchCategories();
    } catch (error) {
      setFormError(error.response?.data?.message || 'Failed to save category');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await api.delete(`/election-manifesto-categories/${id}`);
      fetchCategories();
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Failed to delete category. It may have associated manifestos.';
      alert(message);
    }
  };

  const openDetailModal = async (category) => {
    try {
      const response = await api.get(`/election-manifesto-categories/${category.id}`);
      setDetailCategory(response.data);
      setIsDetailOpen(true);
    } catch (error) {
      alert('Failed to load category details');
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => {
          const category = row.original;
          return (
            <button
              type="button"
              className="text-left"
              onClick={() => openDetailModal(category)}
            >
              <div className="font-medium text-primary hover:underline">
                {category.name}
              </div>
              {category.name_bn && (
                <div className="text-sm text-secondary-foreground">
                  {category.name_bn}
                </div>
              )}
            </button>
          );
        },
      },
      {
        accessorKey: 'slug',
        header: 'Slug',
      },
      {
        accessorKey: 'manifestos_count',
        header: 'Manifestos',
        cell: ({ row }) => {
          const count = row.original.manifestos_count || 0;
          return (
            <div className="flex items-center gap-2">
              <FileText className="size-4 text-muted-foreground" />
              <Badge variant="outline">{count}</Badge>
            </div>
          );
        },
      },
      {
        accessorKey: 'is_active',
        header: 'Status',
        cell: ({ row }) => (
          <span
            className={
              row.original.is_active ? 'text-success' : 'text-muted-foreground'
            }
          >
            {row.original.is_active ? 'Active' : 'Inactive'}
          </span>
        ),
      },
      {
        accessorKey: 'sort_order',
        header: 'Sort Order',
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openEditModal(row.original)}
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(row.original.id)}
            >
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: categories,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
  });

  if (loading && categories.length === 0) {
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
              Manifesto Categories
            </h1>
            <p className="text-sm text-secondary-foreground">
              Manage all manifesto categories
            </p>
          </div>
          <Button onClick={openCreateModal}>
            <Plus className="size-4 me-2" />
            Create Category
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <DataGrid
              table={table}
              isLoading={loading}
              recordCount={pagination.total}
            >
              <DataGridContainer>
                <DataGridTable />
                <DataGridPagination />
              </DataGridContainer>
            </DataGrid>
          </CardContent>
        </Card>
      </div>

      {/* Create / Edit Category Modal */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Create Category'}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? 'Update category information.'
                : 'Create a new manifesto category.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category-name">Name *</Label>
                <Input
                  id="category-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      name: e.target.value,
                      slug: prev.slug || generateSlug(e.target.value),
                    }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category-name-bn">Name (Bangla)</Label>
                <Input
                  id="category-name-bn"
                  value={formData.name_bn}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name_bn: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category-slug">Slug *</Label>
                <Input
                  id="category-slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      slug: generateSlug(e.target.value),
                    }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category-sort-order">Sort Order</Label>
                <Input
                  id="category-sort-order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      sort_order: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>

              <div className="flex items-center gap-3 pt-6">
                <Switch
                  id="category-active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, is_active: checked }))
                  }
                />
                <Label htmlFor="category-active">Active</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-description">Description</Label>
              <Textarea
                id="category-description"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Write description about the category..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-description-bn">Description (Bangla)</Label>
              <Textarea
                id="category-description-bn"
                rows={3}
                value={formData.description_bn}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description_bn: e.target.value,
                  }))
                }
                placeholder="বিবরণ লিখুন..."
              />
            </div>

            {formError && <p className="text-sm text-destructive">{formError}</p>}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={formSubmitting}>
                {formSubmitting
                  ? editingCategory
                    ? 'Saving...'
                    : 'Creating...'
                  : editingCategory
                    ? 'Save Changes'
                    : 'Create Category'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Category Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{detailCategory?.name}</DialogTitle>
            {detailCategory?.name_bn && (
              <DialogDescription>{detailCategory.name_bn}</DialogDescription>
            )}
          </DialogHeader>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {detailCategory?.description && (
              <div>
                <h3 className="text-sm font-semibold mb-1">Description</h3>
                <p className="text-sm text-secondary-foreground whitespace-pre-line">
                  {detailCategory.description}
                </p>
              </div>
            )}

            {detailCategory?.description_bn && (
              <div>
                <h3 className="text-sm font-semibold mb-1">Description (Bangla)</h3>
                <p className="text-sm text-secondary-foreground whitespace-pre-line">
                  {detailCategory.description_bn}
                </p>
              </div>
            )}

            <div className="flex items-center gap-2">
              <FileText className="size-4 text-muted-foreground" />
              <span className="text-sm font-semibold">Manifestos:</span>
              <Badge variant="outline">
                {detailCategory?.manifestos_count || 0}
              </Badge>
            </div>

            {!detailCategory?.description &&
              !detailCategory?.description_bn && (
                <p className="text-sm text-muted-foreground">
                  No additional information available for this category yet.
                </p>
              )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

