'use client';

import { useEffect, useMemo, useState } from 'react';
import { useReactTable, getCoreRowModel, getPaginationRowModel } from '@tanstack/react-table';
import { usePartiesStore } from '@/stores/use-parties-store';
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
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { EntityDetailModal } from '@/components/common/EntityDetailModal';

// Simple slug generator
const generateSlug = (value) =>
  value
    ?.toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || '';

export default function PartiesPage() {
  const {
    parties,
    loading,
    pagination,
    fetchParties,
    deleteParty,
    setPagination,
  } = usePartiesStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingParty, setEditingParty] = useState(null);
  const [entityModal, setEntityModal] = useState({
    open: false,
    type: null,
    id: null,
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    name_bn: '',
    slug: '',
    about: '',
    is_active: true,
  });

  useEffect(() => {
    fetchParties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page]);

  const openCreateModal = () => {
    setEditingParty(null);
    setFormError('');
    setFormData({
      name: '',
      name_bn: '',
      slug: '',
      about: '',
      is_active: true,
    });
    setIsFormOpen(true);
  };

  const openEditModal = (party) => {
    setEditingParty(party);
    setFormError('');
    setFormData({
      name: party.name || '',
      name_bn: party.name_bn || '',
      slug: party.slug || '',
      about: party.about || '',
      is_active: !!party.is_active,
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
        about: formData.about || null,
        is_active: formData.is_active,
      };

      if (editingParty) {
        await usePartiesStore.getState().updateParty(editingParty.id, payload);
      } else {
        await usePartiesStore.getState().createParty(payload);
      }

      setIsFormOpen(false);
    } catch (error) {
      setFormError(error.response?.data?.message || 'Failed to save party');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this party?')) return;
    try {
      await deleteParty(id);
    } catch (error) {
      alert('Failed to delete party');
    }
  };

  const openDetailModal = (party) => {
    setEntityModal({
      open: true,
      type: 'party',
      id: party.id,
    });
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => {
          const party = row.original;
          return (
            <button
              type="button"
              className="text-left font-medium text-primary hover:underline"
              onClick={() => openDetailModal(party)}
            >
              {party.name}
              {party.name_bn && (
                <div className="text-sm text-secondary-foreground">
                  {party.name_bn}
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
    data: parties,
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

  if (loading && parties.length === 0) {
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
            <h1 className="text-2xl font-semibold text-mono mb-2">Parties</h1>
            <p className="text-sm text-secondary-foreground">
              Manage all political parties
            </p>
          </div>
          <Button onClick={openCreateModal}>
            <Plus className="size-4 me-2" />
            Create Party
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Parties</CardTitle>
          </CardHeader>
          <CardContent>
            <DataGrid table={table} isLoading={loading} recordCount={pagination.total}>
              <DataGridContainer>
                <DataGridTable />
                <DataGridPagination />
              </DataGridContainer>
            </DataGrid>
          </CardContent>
        </Card>
      </div>

      {/* Create / Edit Party Modal */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingParty ? 'Edit Party' : 'Create Party'}
            </DialogTitle>
            <DialogDescription>
              {editingParty
                ? 'Update party information.'
                : 'Create a new political party.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="party-name">Name *</Label>
                <Input
                  id="party-name"
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
                <Label htmlFor="party-name-bn">Name (Bangla)</Label>
                <Input
                  id="party-name-bn"
                  value={formData.name_bn}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name_bn: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="party-slug">Slug *</Label>
                <Input
                  id="party-slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, slug: generateSlug(e.target.value) }))
                  }
                  required
                />
              </div>

              <div className="flex items-center gap-3 pt-6">
                <Switch
                  id="party-active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, is_active: checked }))
                  }
                />
                <Label htmlFor="party-active">Active</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="party-about">About</Label>
              <Textarea
                id="party-about"
                rows={4}
                value={formData.about}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, about: e.target.value }))
                }
                placeholder="Write long information about the party..."
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
                  ? editingParty
                    ? 'Saving...'
                    : 'Creating...'
                  : editingParty
                    ? 'Save Changes'
                    : 'Create Party'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Entity Detail Modal */}
      <EntityDetailModal
        type={entityModal.type}
        id={entityModal.id}
        open={entityModal.open}
        onOpenChange={(open) =>
          setEntityModal((prev) => ({ ...prev, open }))
        }
      />
    </div>
  );
}
