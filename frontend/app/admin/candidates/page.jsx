'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useReactTable, getCoreRowModel, getPaginationRowModel } from '@tanstack/react-table';
import { useCandidatesStore } from '@/stores/use-candidates-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataGrid, DataGridContainer } from '@/components/ui/data-grid';
import { DataGridTable } from '@/components/ui/data-grid-table';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Eye, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getAvatarProps } from '@/lib/utils/avatar';

export default function CandidatesPage() {
  const router = useRouter();
  const {
    candidates,
    loading,
    pagination,
    fetchCandidates,
    deleteCandidate,
    setPagination,
  } = useCandidatesStore();

  useEffect(() => {
    fetchCandidates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this candidate?')) return;
    try {
      await deleteCandidate(id);
    } catch (error) {
      alert('Failed to delete candidate');
    }
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => {
        const candidate = row.original;
        const avatarUser = {
          name: candidate.name,
          // Use slug or id to generate a stable gravatar hash if no image
          email: candidate.slug || String(candidate.id || candidate.name || ''),
          image: candidate.image,
        };
        const avatarProps = getAvatarProps(avatarUser, { size: 40, gravatarType: 'mp' });

        return (
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              {avatarProps.src && (
                <AvatarImage 
                  src={avatarProps.src} 
                  alt={avatarProps.alt} 
                />
              )}
              <AvatarFallback>
                {avatarProps.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{candidate.name || 'N/A'}</div>
              {candidate.name_bn && (
                <div className="text-sm text-secondary-foreground">{candidate.name_bn}</div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'party',
      header: 'Party',
      cell: ({ row }) => row.original.party?.name || 'N/A',
    },
    {
      accessorKey: 'constituency',
      header: 'Constituency',
      cell: ({ row }) => row.original.constituency?.name || 'N/A',
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const candidate = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              asChild
            >
              <Link href={`/admin/candidates/${candidate.id}`}>
                <Eye className="size-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/admin/candidates/${candidate.id}/edit`)}
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(candidate.id)}
            >
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </div>
        );
      },
    },
  ], [router]);

  const table = useReactTable({
    data: candidates,
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

  if (loading && candidates.length === 0) {
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
          <h1 className="text-2xl font-semibold text-mono mb-2">Candidates</h1>
          <p className="text-sm text-secondary-foreground">
            Manage all candidates
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/candidates/create">
            <Plus className="size-4 me-2" />
            Create Candidate
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Candidates</CardTitle>
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
