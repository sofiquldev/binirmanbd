'use client';

import { useEffect, useMemo } from 'react';
import { useReactTable, getCoreRowModel, getPaginationRowModel } from '@tanstack/react-table';
import { useConstituenciesStore } from '@/stores/use-constituencies-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataGrid, DataGridContainer } from '@/components/ui/data-grid';
import { DataGridTable } from '@/components/ui/data-grid-table';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export default function ConstituenciesPage() {
  const {
    constituencies,
    loading,
    pagination,
    fetchConstituencies,
    deleteConstituency,
    setPagination,
  } = useConstituenciesStore();

  useEffect(() => {
    fetchConstituencies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this constituency?')) return;
    try {
      await deleteConstituency(id);
    } catch (error) {
      alert('Failed to delete constituency');
    }
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.name}</div>
          {row.original.name_bn && (
            <div className="text-sm text-secondary-foreground">{row.original.name_bn}</div>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'district',
      header: 'District',
      cell: ({ row }) => (
        <div>
          {row.original.district}
          {row.original.district_bn && (
            <div className="text-sm text-secondary-foreground">{row.original.district_bn}</div>
          )}
        </div>
      ),
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
        <span className={row.original.is_active ? 'text-success' : 'text-muted-foreground'}>
          {row.original.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
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
  ], []);

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
      const newPagination = typeof updater === 'function' 
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
        <Button>
          <Plus className="size-4 me-2" />
          Create Constituency
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Constituencies</CardTitle>
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
    </div>
  );
}
