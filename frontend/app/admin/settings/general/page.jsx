'use client';

import { useEffect, useState, useMemo } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Power,
  PowerOff,
  LoaderCircleIcon,
  Settings,
} from 'lucide-react';
import { toast } from 'sonner';

const paymentMethodSchema = z.object({
  code: z.string().min(1, 'Code is required').max(50),
  name: z.string().min(1, 'Name is required').max(255),
  name_bn: z.string().optional(),
  description: z.string().optional(),
  description_bn: z.string().optional(),
  icon: z.string().optional(),
  is_active: z.boolean().default(true),
  requires_credentials: z.boolean().default(false),
  is_online: z.boolean().default(false),
  config_fields: z.array(z.string()).optional(),
  sort_order: z.number().int().default(0),
});

export default function GeneralSettingsPage() {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, per_page: 15, total: 0, last_page: 1 });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);
  const [deletingMethod, setDeletingMethod] = useState(null);

  const form = useForm({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      code: '',
      name: '',
      name_bn: '',
      description: '',
      description_bn: '',
      icon: '',
      is_active: true,
      requires_credentials: false,
      is_online: false,
      config_fields: [],
      sort_order: 0,
    },
  });

  useEffect(() => {
    fetchPaymentMethods();
  }, [pagination.page, pagination.per_page, search]);

  const fetchPaymentMethods = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        per_page: pagination.per_page.toString(),
      });

      if (search) params.append('search', search);

      const res = await api.get(`/payment-methods?${params}`);
      const data = res.data.data || res.data || [];
      setPaymentMethods(Array.isArray(data) ? data : []);
      
      // Update pagination if meta exists
      if (res.data.meta) {
        setPagination({
          page: res.data.meta.current_page || 1,
          per_page: res.data.meta.per_page || 15,
          total: res.data.meta.total || 0,
          last_page: res.data.meta.last_page || 1,
        });
      }
    } catch (error) {
      console.error('Failed to fetch payment methods:', error);
      toast.error('Failed to load payment methods');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingMethod(null);
    form.reset({
      code: '',
      name: '',
      name_bn: '',
      description: '',
      description_bn: '',
      icon: '',
      is_active: true,
      requires_credentials: false,
      is_online: false,
      config_fields: [],
      sort_order: 0,
    });
    setIsFormOpen(true);
  };

  const openEditModal = (method) => {
    setEditingMethod(method);
    form.reset({
      code: method.code,
      name: method.name,
      name_bn: method.name_bn || '',
      description: method.description || '',
      description_bn: method.description_bn || '',
      icon: method.icon || '',
      is_active: method.is_active ?? true,
      requires_credentials: method.requires_credentials ?? false,
      is_online: method.is_online ?? false,
      config_fields: method.config_fields || [],
      sort_order: method.sort_order || 0,
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        config_fields: data.config_fields || [],
      };

      if (editingMethod) {
        await api.put(`/payment-methods/${editingMethod.id}`, payload);
        toast.success('Payment method updated successfully');
      } else {
        await api.post('/payment-methods', payload);
        toast.success('Payment method created successfully');
      }
      setIsFormOpen(false);
      fetchPaymentMethods();
    } catch (error) {
      console.error('Failed to save payment method:', error);
      const message = error.response?.data?.message || 'Failed to save payment method';
      toast.error(message);
      
      // Set form errors if validation fails
      if (error.response?.status === 422 && error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((key) => {
          form.setError(key, {
            type: 'server',
            message: errors[key][0],
          });
        });
      }
    }
  };

  const handleDelete = async (method) => {
    if (!confirm(`Are you sure you want to delete "${method.name}"?`)) {
      return;
    }

    try {
      await api.delete(`/payment-methods/${method.id}`);
      toast.success('Payment method deleted successfully');
      fetchPaymentMethods();
    } catch (error) {
      console.error('Failed to delete payment method:', error);
      const message = error.response?.data?.message || 'Failed to delete payment method';
      toast.error(message);
    }
  };

  const handleToggleActive = async (method) => {
    try {
      await api.patch(`/payment-methods/${method.id}/toggle-active`, {});
      toast.success(`Payment method ${method.is_active ? 'deactivated' : 'activated'}`);
      fetchPaymentMethods();
    } catch (error) {
      console.error('Failed to toggle payment method:', error);
      const message = error.response?.data?.message || 'Failed to update payment method';
      toast.error(message);
    }
  };

  const filteredMethods = useMemo(() => {
    if (!search) return paymentMethods;
    const searchLower = search.toLowerCase();
    return paymentMethods.filter(
      (method) =>
        method.name?.toLowerCase().includes(searchLower) ||
        method.name_bn?.toLowerCase().includes(searchLower) ||
        method.code?.toLowerCase().includes(searchLower)
    );
  }, [paymentMethods, search]);

  return (
    <div className="container">
      <div className="grid gap-5 lg:gap-7.5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-mono mb-2">General Settings</h1>
            <p className="text-sm text-secondary-foreground">
              Manage payment methods and general system settings
            </p>
          </div>
          <Button onClick={openCreateModal}>
            <Plus className="size-4 me-2" />
            Add Payment Method
          </Button>
        </div>

        {/* Payment Methods Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="size-5" />
              Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search payment methods..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : filteredMethods.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No payment methods found
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMethods.map((method) => (
                    <TableRow key={method.id}>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {method.code}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{method.name}</div>
                          {method.name_bn && (
                            <div className="text-xs text-muted-foreground">{method.name_bn}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {method.is_online && (
                            <Badge variant="outline" className="text-xs w-fit">
                              Online
                            </Badge>
                          )}
                          {method.requires_credentials && (
                            <Badge variant="outline" className="text-xs w-fit">
                              Requires Credentials
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            method.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }
                        >
                          {method.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>{method.sort_order}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleActive(method)}
                            disabled={method.code === 'default'}
                            title={method.code === 'default' ? 'Cannot deactivate default method' : ''}
                          >
                            {method.is_active ? (
                              <PowerOff className="size-4" />
                            ) : (
                              <Power className="size-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditModal(method)}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(method)}
                            disabled={method.code === 'default'}
                            title={method.code === 'default' ? 'Cannot delete default method' : ''}
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

        {/* Create/Edit Modal */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingMethod ? 'Edit Payment Method' : 'Create Payment Method'}
              </DialogTitle>
              <DialogDescription>
                {editingMethod
                  ? 'Update payment method details'
                  : 'Add a new payment method to the system'}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Code *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., upay, paypal"
                            {...field}
                            disabled={!!editingMethod}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sort_order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sort Order</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name (English) *</FormLabel>
                        <FormControl>
                          <Input placeholder="Payment method name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="name_bn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name (Bengali)</FormLabel>
                        <FormControl>
                          <Input placeholder="পেমেন্ট পদ্ধতির নাম" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Description in English" rows={3} {...field} />
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
                        <FormLabel>Description (Bengali)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="বাংলা বর্ণনা" rows={3} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon</FormLabel>
                      <FormControl>
                        <Input placeholder="Icon class or path" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Active</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="requires_credentials"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Requires Credentials</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="is_online"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Online Gateway</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsFormOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && (
                      <LoaderCircleIcon className="mr-2 size-4 animate-spin" />
                    )}
                    {editingMethod ? 'Update' : 'Create'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
