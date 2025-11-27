'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useReactTable, getCoreRowModel, getPaginationRowModel } from '@tanstack/react-table';
import api from '@/lib/api';
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

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 15,
    total: 0,
  });

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users', {
        params: {
          page: pagination.page,
          per_page: pagination.per_page,
        },
      });
      setUsers(response.data.data || []);
      setPagination((prev) => ({
        ...prev,
        total: response.data.total || response.data.data?.length || 0,
      }));
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (error) {
      alert('Failed to delete user');
    }
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => {
        const user = row.original;
        const avatarProps = getAvatarProps(user, { size: 40, gravatarType: 'mp' });
        
        return (
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarImage 
                src={avatarProps.src} 
                alt={avatarProps.alt} 
              />
              <AvatarFallback>
                {avatarProps.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{user.name || 'N/A'}</div>
              {user.email && (
                <div className="text-sm text-secondary-foreground">{user.email}</div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'roles',
      header: 'Roles',
      cell: ({ row }) => {
        const roles = row.original.roles || [];
        return roles.map((r) => r.slug || r.name).join(', ') || 'No roles';
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              asChild
            >
              <Link href={`/admin/users/${user.id}`}>
                <Eye className="size-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/admin/users/${user.id}/edit`)}
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(user.id)}
            >
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </div>
        );
      },
    },
  ], [router]);

  const table = useReactTable({
    data: users,
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
      setPagination((prev) => ({ ...prev, page: newPagination.pageIndex + 1 }));
    },
  });

  if (loading) {
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
        <div>
          <h1 className="text-2xl font-semibold text-mono mb-2">Users</h1>
          <p className="text-sm text-secondary-foreground">
            Manage all system users
          </p>
        </div>


        <Card>
          <CardHeader>
            <div className="w-full flex items-center justify-between">
              <CardTitle>All Users</CardTitle>
              <Button asChild>
                <Link href="/admin/users/create">
                  <Plus className="size-4 me-2" />
                  Create User
                </Link>
              </Button>
            </div>
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
