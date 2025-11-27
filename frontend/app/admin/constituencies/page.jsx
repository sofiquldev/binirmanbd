'use client';

import { useEffect, useMemo, useState } from 'react';
import { useReactTable, getCoreRowModel, getPaginationRowModel } from '@tanstack/react-table';
import { useConstituenciesStore } from '@/stores/use-constituencies-store';
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
import { Combobox } from '@/components/ui/combobox';
import { Plus, Pencil, Trash2 } from 'lucide-react';

// Static list of districts (Bangla + slug), grouped by division
const STATIC_DISTRICTS = [
  {
    division: 'ঢাকা',
    items: ['ঢাকা', 'গাজীপুর', 'নারায়ণগঞ্জ', 'টাঙ্গাইল', 'মানিকগঞ্জ', 'মুন্সিগঞ্জ', 'ফরিদপুর', 'মাদারীপুর'],
  },
  {
    division: 'চট্টগ্রাম',
    items: ['চট্টগ্রাম', 'কক্সবাজার', 'কুমিল্লা', 'ফেনী', 'নোয়াখালী', 'ব্রাহ্মণবাড়িয়া', 'লক্ষ্মীপুর'],
  },
  {
    division: 'রাজশাহী',
    items: ['রাজশাহী', 'বগুড়া', 'পাবনা', 'জয়পুরহাট', 'চাঁপাইনবাবগঞ্জ', 'নাটোর', 'সিরাজগঞ্জ'],
  },
  {
    division: 'খুলনা',
    items: ['খুলনা', 'যশোর', 'বাগেরহাট', 'কুষ্টিয়া', 'মেহেরপুর', 'মাগুরা'],
  },
  {
    division: 'বরিশাল',
    items: ['বরিশাল', 'পটুয়াখালী', 'ভোলা', 'পিরোজপুর', 'ঝালকাঠি', 'বরগুনা'],
  },
  {
    division: 'সিলেট',
    items: ['সিলেট', 'মৌলভীবাজার', 'হবিগঞ্জ', 'সুনামগঞ্জ'],
  },
  {
    division: 'রংপুর',
    items: ['রংপুর', 'দিনাজপুর', 'কুড়িগ্রাম', 'লালমনিরহাট', 'নীলফামারী', 'গাইবান্ধা', 'ঠাকুরগাঁও', 'পঞ্চগড়'],
  },
  {
    division: 'ময়মনসিংহ',
    items: ['ময়মনসিংহ', 'শেরপুর', 'নেত্রকোণা', 'জামালপুর'],
  },
];

const generateSlug = (value) =>
  value
    ?.toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || '';

export default function ConstituenciesPage() {
  const {
    constituencies,
    loading,
    pagination,
    fetchConstituencies,
    deleteConstituency,
    setPagination,
  } = useConstituenciesStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [detailItem, setDetailItem] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    name_bn: '',
    slug: '',
    district_slug: '',
    population: '',
    about: '',
    is_active: true,
  });

  const districtOptions = useMemo(
    () =>
      STATIC_DISTRICTS.flatMap((group) =>
        group.items.map((nameBn) => ({
          value: generateSlug(nameBn),
          // Show district name (Bangla) only
          label: nameBn,
        })),
      ),
    [],
  );

  useEffect(() => {
    fetchConstituencies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page]);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormError('');
    setFormData({
      name: '',
      name_bn: '',
      slug: '',
      district_slug: '',
      population: '',
      about: '',
      is_active: true,
    });
    setIsFormOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormError('');
    setFormData({
      name: item.name || '',
      name_bn: item.name_bn || '',
      slug: item.slug || '',
      district_slug: item.district?.slug || '',
      population: item.population || '',
      about: item.about || '',
      is_active: !!item.is_active,
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
        district_slug: formData.district_slug || null,
        population: formData.population ? Number(formData.population) : null,
        about: formData.about || null,
        is_active: formData.is_active,
      };

      if (editingItem) {
        await useConstituenciesStore
          .getState()
          .updateConstituency(editingItem.id, payload);
      } else {
        await useConstituenciesStore.getState().createConstituency(payload);
      }

      setIsFormOpen(false);
    } catch (error) {
      setFormError(error.response?.data?.message || 'Failed to save constituency');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this constituency?')) return;
    try {
      await deleteConstituency(id);
    } catch (error) {
      alert('Failed to delete constituency');
    }
  };

  const openDetailModal = async (item) => {
    try {
      const response = await api.get(`/constituencies/${item.id}`);
      setDetailItem(response.data);
      setIsDetailOpen(true);
    } catch (error) {
      alert('Failed to load constituency details');
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => {
          const item = row.original;
          return (
            <button
              type="button"
              className="text-left"
              onClick={() => openDetailModal(item)}
            >
              <div className="font-medium text-primary hover:underline">
                {item.name}
              </div>
              {item.name_bn && (
                <div className="text-sm text-secondary-foreground">
                  {item.name_bn}
                </div>
              )}
            </button>
          );
        },
      },
      {
        accessorKey: 'district',
        header: 'District',
        cell: ({ row }) => {
          const d = row.original.district;
          if (!d) return 'N/A';
          return (
            <div>
              {d.name}
              {d.name_bn && (
                <div className="text-sm text-secondary-foreground">
                  {d.name_bn}
                </div>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: 'population',
        header: 'Population',
        cell: ({ row }) => row.original.population?.toLocaleString() || 'N/A',
      },
      {
        accessorKey: 'is_active',
        header: 'Status',
        cell: ({ row }) => (
          <span
            className={row.original.is_active ? 'text-success' : 'text-muted-foreground'}
          >
            {row.original.is_active ? 'Active' : 'Inactive'}
          </span>
        ),
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
    [],
  );

  const table = useReactTable({
    data: constituencies,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(pagination.total / pagination.per_page),
    state: {
      pagination: {
        pageIndex: pagination.page - 1,
        pageSize: pagination.per_page,
      },
    },
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === 'function'
          ? updater({ pageIndex: pagination.page - 1, pageSize: pagination.per_page })
          : updater;
      setPagination({ page: newPagination.pageIndex + 1 });
    },
  });

  if (loading && constituencies.length === 0) {
    return (
      <div className="grid gap-5">
        <Skeleton className="h-12" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="container">
      <div className="grid gap-5 lg:gap-7.5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-mono mb-2">Constituencies</h1>
            <p className="text-sm text-secondary-foreground">
              Manage all constituencies
            </p>
          </div>
          <Button onClick={openCreateModal}>
            <Plus className="size-4 me-2" />
            Create Constituency
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Constituencies</CardTitle>
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

      {/* Create / Edit Constituency Modal */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit Constituency' : 'Create Constituency'}
            </DialogTitle>
            <DialogDescription>
              {editingItem
                ? 'Update constituency information.'
                : 'Create a new constituency.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="const-name">Name *</Label>
                <Input
                  id="const-name"
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
                <Label htmlFor="const-name-bn">Name (Bangla)</Label>
                <Input
                  id="const-name-bn"
                  value={formData.name_bn}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name_bn: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="const-slug">Slug *</Label>
                <Input
                  id="const-slug"
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
                <Label>District</Label>
                <Combobox
                  options={districtOptions}
                  value={formData.district_slug}
                  onValueChange={(val) =>
                    setFormData((prev) => ({
                      ...prev,
                      district_slug: val || '',
                    }))
                  }
                  placeholder="Select district"
                  searchPlaceholder="Search district..."
                  emptyText="No district found"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="const-population">Population</Label>
                <Input
                  id="const-population"
                  type="number"
                  value={formData.population}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      population: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="flex items-center gap-3 pt-6">
                <Switch
                  id="const-active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, is_active: checked }))
                  }
                />
                <Label htmlFor="const-active">Active</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="const-about">About</Label>
              <Textarea
                id="const-about"
                rows={4}
                value={formData.about}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, about: e.target.value }))
                }
                placeholder="Write long information about the constituency..."
              />
            </div>

            {formError && (
              <p className="text-sm text-destructive">{formError}</p>
            )}

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
                  ? editingItem
                    ? 'Saving...'
                    : 'Creating...'
                  : editingItem
                    ? 'Save Changes'
                    : 'Create Constituency'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Constituency Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{detailItem?.name}</DialogTitle>
            {detailItem?.name_bn && (
              <DialogDescription>{detailItem.name_bn}</DialogDescription>
            )}
          </DialogHeader>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {detailItem?.district && (
              <div className="text-sm">
                <span className="font-semibold">District: </span>
                <span>{detailItem.district.name}</span>
                {detailItem.district.name_bn && (
                  <span className="text-secondary-foreground">
                    {' '}
                    ({detailItem.district.name_bn})
                  </span>
                )}
              </div>
            )}

            {detailItem?.about && (
              <div>
                <h3 className="text-sm font-semibold mb-1">About</h3>
                <p className="text-sm text-secondary-foreground whitespace-pre-line">
                  {detailItem.about}
                </p>
              </div>
            )}

            {Array.isArray(detailItem?.candidates) &&
              detailItem.candidates.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-2">
                    Candidates ({detailItem.candidates.length})
                  </h3>
                  <div className="space-y-1">
                    {detailItem.candidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        className="flex items-center justify-between text-sm border-b border-border/60 py-1.5"
                      >
                        <div>
                          <div className="font-medium">
                            {candidate.name || 'Unnamed candidate'}
                          </div>
                          {candidate.slug && (
                            <div className="text-xs text-secondary-foreground">
                              {candidate.slug}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {!detailItem?.about &&
              (!detailItem?.candidates || detailItem.candidates.length === 0) && (
                <p className="text-sm text-muted-foreground">
                  No additional information available for this constituency yet.
                </p>
              )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
