'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel } from '@tanstack/react-table';
import { useCandidatesStore } from '@/stores/use-candidates-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataGrid, DataGridContainer } from '@/components/ui/data-grid';
import { DataGridTable } from '@/components/ui/data-grid-table';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Eye, Pencil, Trash2, Search, X, Filter, ArrowUp, ArrowDown, ChevronsUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Combobox } from '@/components/ui/combobox';
import { usePartiesStore } from '@/stores/use-parties-store';
import { useConstituenciesStore } from '@/stores/use-constituencies-store';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getAvatarProps } from '@/lib/utils/avatar';
import { EntityDetailModal } from '@/components/common/EntityDetailModal';

export default function CandidatesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    candidates,
    loading,
    pagination,
    fetchCandidates,
    deleteCandidate,
    setPagination,
  } = useCandidatesStore();
  const { parties, fetchParties } = usePartiesStore();
  const { constituencies, fetchConstituencies } = useConstituenciesStore();
  const [entityModal, setEntityModal] = useState({
    open: false,
    type: null,
    id: null,
  });
  const [search, setSearch] = useState('');
  const [partyFilter, setPartyFilter] = useState('');
  const [constituencyFilter, setConstituencyFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const setEntityModalRef = useRef(setEntityModal);

  useEffect(() => {
    setEntityModalRef.current = setEntityModal;
  }, [setEntityModal]);

  useEffect(() => {
    fetchParties({ per_page: 1000 });
    fetchConstituencies({ per_page: 1000 });
  }, []);

  // Read URL query parameters and set filters
  useEffect(() => {
    const partyId = searchParams.get('party_id');
    const constituencyId = searchParams.get('constituency_id');
    
    if (partyId) {
      setPartyFilter(partyId);
    }
    if (constituencyId) {
      setConstituencyFilter(constituencyId);
    }
  }, [searchParams]);

  useEffect(() => {
    // Reset to page 1 when filters change
    if (search || partyFilter || constituencyFilter) {
      setPagination({ page: 1 });
    }
  }, [search, partyFilter, constituencyFilter]);

  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (partyFilter) params.party_id = partyFilter;
    if (constituencyFilter) params.constituency_id = constituencyFilter;
    fetchCandidates(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, search, partyFilter, constituencyFilter]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this candidate?')) return;
    try {
      await deleteCandidate(id);
    } catch (error) {
      alert('Failed to delete candidate');
    }
  };

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

  const clearFilters = () => {
    setSearch('');
    setPartyFilter('');
    setConstituencyFilter('');
  };

  const hasActiveFilters = search || partyFilter || constituencyFilter;

  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1 hover:text-foreground transition-colors"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Name
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="size-3" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="size-3" />
            ) : (
              <ChevronsUpDown className="size-3 opacity-40" />
            )}
          </button>
        );
      },
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
              <button
                type="button"
                className="font-medium text-primary hover:underline text-left"
                onClick={(e) => {
                  e.stopPropagation();
                  setEntityModalRef.current({
                    open: true,
                    type: 'candidate',
                    id: candidate.id,
                  });
                }}
              >
                {candidate.name || 'N/A'}
              </button>
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
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1 hover:text-foreground transition-colors"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Party
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="size-3" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="size-3" />
            ) : (
              <ChevronsUpDown className="size-3 opacity-40" />
            )}
          </button>
        );
      },
      sortingFn: (rowA, rowB) => {
        const a = rowA.original.party?.name || '';
        const b = rowB.original.party?.name || '';
        return a.localeCompare(b);
      },
      cell: ({ row }) => {
        const candidate = row.original;
        if (!candidate.party) return 'N/A';
        return (
          <button
            type="button"
            className="text-primary hover:underline text-left"
            onClick={(e) => {
              e.stopPropagation();
              setEntityModalRef.current({
                open: true,
                type: 'party',
                id: candidate.party.id,
              });
            }}
          >
            {candidate.party.name}
          </button>
        );
      },
    },
    {
      accessorKey: 'constituency',
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1 hover:text-foreground transition-colors"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Constituency
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="size-3" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="size-3" />
            ) : (
              <ChevronsUpDown className="size-3 opacity-40" />
            )}
          </button>
        );
      },
      sortingFn: (rowA, rowB) => {
        const a = rowA.original.constituency?.name || '';
        const b = rowB.original.constituency?.name || '';
        return a.localeCompare(b);
      },
      cell: ({ row }) => {
        const candidate = row.original;
        if (!candidate.constituency) return 'N/A';
        return (
          <button
            type="button"
            className="text-primary hover:underline text-left"
            onClick={(e) => {
              e.stopPropagation();
              setEntityModalRef.current({
                open: true,
                type: 'constituency',
                id: candidate.constituency.id,
              });
            }}
          >
            {candidate.constituency.name}
          </button>
        );
      },
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
  ], []);

  const table = useReactTable({
    data: candidates,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSorting: true,
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
          <h1 className="text-2xl font-semibold text-mono mb-2">
            Candidates {pagination.total > 0 && `(${pagination.total})`}
          </h1>
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

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            {/* Search */}
            <div className="relative flex-1 w-full lg:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search candidates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 items-center w-full lg:w-auto">
              <Combobox
                options={partyOptions}
                value={partyFilter}
                onValueChange={setPartyFilter}
                placeholder="Party..."
                className="w-full sm:w-[150px]"
              />
              <Combobox
                options={constituencyOptions}
                value={constituencyFilter}
                onValueChange={setConstituencyFilter}
                placeholder="Constituency..."
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
