'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Copy, Check, Save, LoaderCircleIcon, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { HexagonBadge } from '@/components/common/HexagonBadge';

export default function DonationSettingsPage() {
  const params = useParams();
  const candidateId = params.id;
  const [settings, setSettings] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    donations_enabled: true,
    form_title: '',
    success_message: '',
    minimum_amount: 10,
    maximum_amount: null,
    default_currency: 'BDT',
    show_donor_name_bn: false,
    require_donor_phone: false,
    require_donor_email: false,
    require_donor_id: false,
    suggested_amounts: [],
    enabled_payment_methods: [],
    payment_method_configs: {}, // Store configs for each payment method
  });

  useEffect(() => {
    fetchSettings();
    fetchPaymentMethods();
  }, [candidateId]);

  const fetchSettings = async () => {
    try {
      const res = await api.get(`/candidates/${candidateId}/donation-settings`);
      const data = res.data;
      setSettings(data);
      // Build payment method configs from enabled methods
      const paymentConfigs = {};
      if (data.enabled_payment_methods) {
        data.enabled_payment_methods.forEach((method) => {
          paymentConfigs[method.code] = method.config || {};
        });
      }

      setFormData((prev) => ({
        ...prev,
        donations_enabled: data.donations_enabled ?? true,
        form_title: data.form_title || '',
        success_message: data.success_message || '',
        minimum_amount: data.minimum_amount || 10,
        maximum_amount: data.maximum_amount || null,
        default_currency: data.default_currency || 'BDT',
        show_donor_name_bn: data.show_donor_name_bn ?? false,
        require_donor_phone: data.require_donor_phone ?? false,
        require_donor_email: data.require_donor_email ?? false,
        require_donor_id: data.require_donor_id ?? false,
        suggested_amounts: data.suggested_amounts || [],
        enabled_payment_methods: data.enabled_payment_methods?.map((m) => m.code) || [],
        payment_method_configs: paymentConfigs,
      }));
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      toast.error('Failed to load donation settings');
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const res = await api.get('/payment-methods?per_page=100');
      const data = res.data.data || res.data || [];
      setPaymentMethods(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch payment methods:', error);
    }
  };

  const handleCopy = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://binirman.test/api/v1';
    const baseUrl = apiUrl.replace('/api/v1', '');
    const donationUrl = `${baseUrl}/c/${candidateId}/donate`;
    navigator.clipboard.writeText(donationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const togglePaymentMethod = (methodCode) => {
    const current = formData.enabled_payment_methods || [];
    if (current.includes(methodCode)) {
      setFormData({
        ...formData,
        enabled_payment_methods: current.filter((m) => m !== methodCode),
      });
    } else {
      setFormData({
        ...formData,
        enabled_payment_methods: [...current, methodCode],
        // Initialize config if not exists
        payment_method_configs: {
          ...formData.payment_method_configs,
          [methodCode]: formData.payment_method_configs[methodCode] || {},
        },
      });
    }
  };

  const updatePaymentMethodConfig = (methodCode, field, value) => {
    setFormData({
      ...formData,
      payment_method_configs: {
        ...formData.payment_method_configs,
        [methodCode]: {
          ...(formData.payment_method_configs[methodCode] || {}),
          [field]: value,
        },
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Prepare payment method configs for submission
      // Extract configs for each enabled payment method
      const paymentMethodConfigs = {};
      formData.enabled_payment_methods.forEach((methodCode) => {
        const config = formData.payment_method_configs[methodCode] || {};
        paymentMethodConfigs[methodCode] = config;
      });

      const submitData = {
        donations_enabled: formData.donations_enabled,
        form_title: formData.form_title,
        success_message: formData.success_message,
        minimum_amount: formData.minimum_amount,
        maximum_amount: formData.maximum_amount,
        default_currency: formData.default_currency,
        show_donor_name_bn: formData.show_donor_name_bn,
        require_donor_phone: formData.require_donor_phone,
        require_donor_email: formData.require_donor_email,
        require_donor_id: formData.require_donor_id,
        suggested_amounts: formData.suggested_amounts,
        enabled_payment_methods: formData.enabled_payment_methods,
        // Send payment method configs
        payment_method_configs: paymentMethodConfigs,
        // Also send individual config fields for backward compatibility
        ...(paymentMethodConfigs.sslcommerz && {
          sslcommerz_store_id: paymentMethodConfigs.sslcommerz.sslcommerz_store_id,
          sslcommerz_store_password: paymentMethodConfigs.sslcommerz.sslcommerz_store_password,
          sslcommerz_is_sandbox: paymentMethodConfigs.sslcommerz.sslcommerz_is_sandbox,
        }),
        ...(paymentMethodConfigs.bank && {
          bank_name: paymentMethodConfigs.bank.bank_name,
          bank_account_name: paymentMethodConfigs.bank.bank_account_name,
          bank_account_number: paymentMethodConfigs.bank.bank_account_number,
          bank_routing_number: paymentMethodConfigs.bank.bank_routing_number,
          bank_branch: paymentMethodConfigs.bank.bank_branch,
        }),
        ...(paymentMethodConfigs.bkash && {
          bkash_number: paymentMethodConfigs.bkash.bkash_number,
          bkash_account_type: paymentMethodConfigs.bkash.bkash_account_type,
        }),
      };

      await api.put(`/candidates/${candidateId}/donation-settings`, submitData);
      toast.success('Donation settings saved successfully');
      fetchSettings();
    } catch (error) {
      console.error('Failed to save settings:', error);
      const errorMessage =
        error.response?.data?.message || 'Failed to save donation settings';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-32" />
        </CardContent>
      </Card>
    );
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://binirman.test/api/v1';
  const baseUrl = apiUrl.replace('/api/v1', '');
  const donationUrl = `${baseUrl}/c/${candidateId}/donate`;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          Donation Settings
        </CardTitle>
        <div className="flex items-center gap-2">
          <Label htmlFor="donations-enabled" className="text-sm">
            Publish
          </Label>
          <Switch
            id="donations-enabled"
            checked={formData.donations_enabled}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, donations_enabled: checked })
            }
          />
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Public Donation URL */}
          <div className="space-y-4">
            <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
              <Label className="max-w-56 text-foreground font-normal">Donation URL</Label>
              <div className="flex-1 flex items-center gap-2">
                <Input
                  type="text"
                  value={donationUrl}
                  readOnly
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="size-4 text-green-600" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Share this URL or generate a QR code for public donations. Anyone can use this
              link to donate to this candidate.
            </p>
          </div>

          {/* Form Settings */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">Form Settings</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="form_title">Form Title</Label>
                <Input
                  id="form_title"
                  value={formData.form_title}
                  onChange={(e) =>
                    setFormData({ ...formData, form_title: e.target.value })
                  }
                  placeholder="Support This Campaign"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="success_message">Success Message</Label>
                <Textarea
                  id="success_message"
                  rows={3}
                  value={formData.success_message}
                  onChange={(e) =>
                    setFormData({ ...formData, success_message: e.target.value })
                  }
                  placeholder="Thank you for your donation!"
                />
              </div>
            </div>
          </div>

          {/* Amount Settings */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">Amount Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minimum_amount">Minimum Amount</Label>
                <Input
                  id="minimum_amount"
                  type="number"
                  value={formData.minimum_amount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minimum_amount: parseFloat(e.target.value) || 0,
                    })
                  }
                  min="0"
                  step="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maximum_amount">Maximum Amount (Optional)</Label>
                <Input
                  id="maximum_amount"
                  type="number"
                  value={formData.maximum_amount || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maximum_amount: e.target.value ? parseFloat(e.target.value) : null,
                    })
                  }
                  min="0"
                  step="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="default_currency">Default Currency</Label>
                <select
                  id="default_currency"
                  value={formData.default_currency}
                  onChange={(e) =>
                    setFormData({ ...formData, default_currency: e.target.value })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="BDT">BDT (৳)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Field Settings */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">Field Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Bengali Name Field</Label>
                  <p className="text-sm text-muted-foreground">
                    Display an additional field for donor name in Bengali
                  </p>
                </div>
                <Switch
                  checked={formData.show_donor_name_bn}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, show_donor_name_bn: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require Phone Number</Label>
                  <p className="text-sm text-muted-foreground">
                    Make phone number a required field
                  </p>
                </div>
                <Switch
                  checked={formData.require_donor_phone}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, require_donor_phone: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Make email a required field
                  </p>
                </div>
                <Switch
                  checked={formData.require_donor_email}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, require_donor_email: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require ID Number</Label>
                  <p className="text-sm text-muted-foreground">
                    Require NID/Passport number for donations
                  </p>
                </div>
                <Switch
                  checked={formData.require_donor_id}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, require_donor_id: checked })
                  }
                />
              </div>
            </div>
          </div>

          {/* Payment Methods - Accordion with Privacy Settings Style */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">Payment Methods</h3>
            <Card>
              <CardContent className="p-0">
                {paymentMethods.length === 0 ? (
                  <div className="p-6 text-center text-sm text-muted-foreground">
                    No payment methods available. Please add payment methods from Settings.
                  </div>
                ) : (
                  <Accordion type="multiple" className="w-full">
                    {paymentMethods.map((method) => {
                      const isEnabled = formData.enabled_payment_methods?.includes(method.code);
                      const methodConfig = formData.payment_method_configs[method.code] || {};
                      const Icon = CreditCard; // You can customize this based on method type

                      return (
                        <AccordionItem key={method.id} value={`method-${method.id}`} className="border-b border-border">
                          <div className="flex items-center justify-between py-4 gap-2.5 px-6">
                            <div className="flex items-center gap-3.5 flex-1">
                              <HexagonBadge
                                stroke="stroke-input"
                                fill="fill-muted/30"
                                size="size-[50px]"
                                badge={<Icon className="text-xl text-muted-foreground" />}
                              />
                              <div className="flex flex-col gap-1.5 flex-1">
                                <span className="flex items-center gap-1.5 leading-none font-medium text-sm text-mono">
                                  {methodConfig.name || method.name}
                                  {method.name_bn && !methodConfig.name && ` (${method.name_bn})`}
                                </span>
                                <span className="text-sm text-secondary-foreground">
                                  {method.description || `Configure ${methodConfig.name || method.name} payment settings`}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2.5">
                              <Label htmlFor={`publish-${method.id}`} className="text-sm">
                                Publish
                              </Label>
                              <Switch
                                id={`publish-${method.id}`}
                                size="sm"
                                checked={isEnabled}
                                onCheckedChange={() => togglePaymentMethod(method.code)}
                                disabled={method.code === 'default'}
                              />
                            </div>
                          </div>
                          <AccordionContent className="px-6 pb-4">
                            <div className="space-y-4 pt-2">
                              {/* Common Fields for All Payment Methods */}
                              <div className="space-y-4 border-b border-border pb-4">
                                <h4 className="text-sm font-semibold text-foreground">
                                  General Settings
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor={`name-${method.id}`}>
                                      Display Name <span className="text-muted-foreground">(Optional)</span>
                                    </Label>
                                    <Input
                                      id={`name-${method.id}`}
                                      type="text"
                                      value={methodConfig.name || method.name || ''}
                                      onChange={(e) =>
                                        updatePaymentMethodConfig(method.code, 'name', e.target.value)
                                      }
                                      placeholder={method.name || 'Enter display name'}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                      Custom name for this payment method (defaults to system name)
                                    </p>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`icon-${method.id}`}>Icon URL</Label>
                                    <Input
                                      id={`icon-${method.id}`}
                                      type="text"
                                      value={methodConfig.icon_url || method.icon || ''}
                                      onChange={(e) =>
                                        updatePaymentMethodConfig(
                                          method.code,
                                          'icon_url',
                                          e.target.value
                                        )
                                      }
                                      placeholder="https://example.com/icon.png"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                      URL to the payment method icon/image
                                    </p>
                                  </div>
                                  <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor={`endpoint-${method.id}`}>
                                      API Endpoint <span className="text-muted-foreground">(Optional)</span>
                                    </Label>
                                    <Input
                                      id={`endpoint-${method.id}`}
                                      type="text"
                                      value={methodConfig.endpoint || methodConfig.api_endpoint || ''}
                                      onChange={(e) =>
                                        updatePaymentMethodConfig(
                                          method.code,
                                          'endpoint',
                                          e.target.value
                                        )
                                      }
                                      placeholder="https://api.example.com/payment"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                      Payment gateway API endpoint URL
                                    </p>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`merchant-id-${method.id}`}>
                                      Merchant ID <span className="text-muted-foreground">(Optional)</span>
                                    </Label>
                                    <Input
                                      id={`merchant-id-${method.id}`}
                                      type="text"
                                      value={methodConfig.merchant_id || ''}
                                      onChange={(e) =>
                                        updatePaymentMethodConfig(
                                          method.code,
                                          'merchant_id',
                                          e.target.value
                                        )
                                      }
                                      placeholder="Enter merchant ID"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`webhook-url-${method.id}`}>
                                      Webhook URL <span className="text-muted-foreground">(Optional)</span>
                                    </Label>
                                    <Input
                                      id={`webhook-url-${method.id}`}
                                      type="text"
                                      value={methodConfig.webhook_url || ''}
                                      onChange={(e) =>
                                        updatePaymentMethodConfig(
                                          method.code,
                                          'webhook_url',
                                          e.target.value
                                        )
                                      }
                                      placeholder="https://your-domain.com/webhook/payment"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                      URL to receive payment callbacks
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Method-Specific Configuration */}
                              <div className="space-y-4 pt-2">
                                <h4 className="text-sm font-semibold text-foreground">
                                  Method-Specific Settings
                                </h4>

                                {/* SSLCommerz Configuration */}
                              {method.code === 'sslcommerz' && (
                                <>
                                  <div className="space-y-2">
                                    <Label htmlFor={`store-id-${method.id}`}>Store ID</Label>
                                    <Input
                                      id={`store-id-${method.id}`}
                                      type="text"
                                      value={methodConfig.sslcommerz_store_id || ''}
                                      onChange={(e) =>
                                        updatePaymentMethodConfig(
                                          method.code,
                                          'sslcommerz_store_id',
                                          e.target.value
                                        )
                                      }
                                      placeholder="Enter SSLCommerz Store ID"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`store-password-${method.id}`}>
                                      Store Password
                                    </Label>
                                    <Input
                                      id={`store-password-${method.id}`}
                                      type="password"
                                      value={methodConfig.sslcommerz_store_password || ''}
                                      onChange={(e) =>
                                        updatePaymentMethodConfig(
                                          method.code,
                                          'sslcommerz_store_password',
                                          e.target.value
                                        )
                                      }
                                      placeholder="Enter SSLCommerz Store Password"
                                    />
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                      <Label>Sandbox Mode</Label>
                                      <p className="text-sm text-muted-foreground">
                                        Use sandbox environment for testing
                                      </p>
                                    </div>
                                    <Switch
                                      checked={methodConfig.sslcommerz_is_sandbox ?? true}
                                      onCheckedChange={(checked) =>
                                        updatePaymentMethodConfig(
                                          method.code,
                                          'sslcommerz_is_sandbox',
                                          checked
                                        )
                                      }
                                    />
                                  </div>
                                </>
                              )}

                              {/* Bank Transfer Configuration */}
                              {method.code === 'bank' && (
                                <>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor={`bank-name-${method.id}`}>Bank Name</Label>
                                      <Input
                                        id={`bank-name-${method.id}`}
                                        type="text"
                                        value={methodConfig.bank_name || ''}
                                        onChange={(e) =>
                                          updatePaymentMethodConfig(
                                            method.code,
                                            'bank_name',
                                            e.target.value
                                          )
                                        }
                                        placeholder="Enter bank name"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`account-name-${method.id}`}>
                                        Account Name
                                      </Label>
                                      <Input
                                        id={`account-name-${method.id}`}
                                        type="text"
                                        value={methodConfig.bank_account_name || ''}
                                        onChange={(e) =>
                                          updatePaymentMethodConfig(
                                            method.code,
                                            'bank_account_name',
                                            e.target.value
                                          )
                                        }
                                        placeholder="Enter account name"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`account-number-${method.id}`}>
                                        Account Number
                                      </Label>
                                      <Input
                                        id={`account-number-${method.id}`}
                                        type="text"
                                        value={methodConfig.bank_account_number || ''}
                                        onChange={(e) =>
                                          updatePaymentMethodConfig(
                                            method.code,
                                            'bank_account_number',
                                            e.target.value
                                          )
                                        }
                                        placeholder="Enter account number"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`routing-number-${method.id}`}>
                                        Routing Number
                                      </Label>
                                      <Input
                                        id={`routing-number-${method.id}`}
                                        type="text"
                                        value={methodConfig.bank_routing_number || ''}
                                        onChange={(e) =>
                                          updatePaymentMethodConfig(
                                            method.code,
                                            'bank_routing_number',
                                            e.target.value
                                          )
                                        }
                                        placeholder="Enter routing number"
                                      />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                      <Label htmlFor={`bank-branch-${method.id}`}>Branch</Label>
                                      <Input
                                        id={`bank-branch-${method.id}`}
                                        type="text"
                                        value={methodConfig.bank_branch || ''}
                                        onChange={(e) =>
                                          updatePaymentMethodConfig(
                                            method.code,
                                            'bank_branch',
                                            e.target.value
                                          )
                                        }
                                        placeholder="Enter branch name"
                                      />
                                    </div>
                                  </div>
                                </>
                              )}

                              {/* bKash Configuration */}
                              {method.code === 'bkash' && (
                                <>
                                  <div className="space-y-2">
                                    <Label htmlFor={`bkash-number-${method.id}`}>bKash Number</Label>
                                    <Input
                                      id={`bkash-number-${method.id}`}
                                      type="text"
                                      value={methodConfig.bkash_number || ''}
                                      onChange={(e) =>
                                        updatePaymentMethodConfig(
                                          method.code,
                                          'bkash_number',
                                          e.target.value
                                        )
                                      }
                                      placeholder="01XXXXXXXXX"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`bkash-type-${method.id}`}>
                                      Account Type
                                    </Label>
                                    <select
                                      id={`bkash-type-${method.id}`}
                                      value={methodConfig.bkash_account_type || 'personal'}
                                      onChange={(e) =>
                                        updatePaymentMethodConfig(
                                          method.code,
                                          'bkash_account_type',
                                          e.target.value
                                        )
                                      }
                                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    >
                                      <option value="personal">Personal</option>
                                      <option value="merchant">Merchant</option>
                                    </select>
                                  </div>
                                </>
                              )}

                              {/* Generic API Key / Auth fields for other methods */}
                              {method.requires_credentials &&
                                method.code !== 'sslcommerz' &&
                                method.code !== 'bank' &&
                                method.code !== 'bkash' && (
                                  <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label htmlFor={`api-key-${method.id}`}>API Key</Label>
                                        <Input
                                          id={`api-key-${method.id}`}
                                          type="password"
                                          value={methodConfig.api_key || ''}
                                          onChange={(e) =>
                                            updatePaymentMethodConfig(
                                              method.code,
                                              'api_key',
                                              e.target.value
                                            )
                                          }
                                          placeholder="Enter API key"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor={`api-secret-${method.id}`}>
                                          API Secret
                                        </Label>
                                        <Input
                                          id={`api-secret-${method.id}`}
                                          type="password"
                                          value={methodConfig.api_secret || ''}
                                          onChange={(e) =>
                                            updatePaymentMethodConfig(
                                              method.code,
                                              'api_secret',
                                              e.target.value
                                            )
                                          }
                                          placeholder="Enter API secret"
                                        />
                                      </div>
                                    </div>
                                  </>
                                )}

                                {/* Additional Notes/Description */}
                                <div className="space-y-2 pt-2">
                                  <Label htmlFor={`notes-${method.id}`}>
                                    Notes <span className="text-muted-foreground">(Optional)</span>
                                  </Label>
                                  <Textarea
                                    id={`notes-${method.id}`}
                                    rows={3}
                                    value={methodConfig.notes || ''}
                                    onChange={(e) =>
                                      updatePaymentMethodConfig(method.code, 'notes', e.target.value)
                                    }
                                    placeholder="Add any additional notes or instructions for this payment method..."
                                  />
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={saving}>
              {saving && <LoaderCircleIcon className="mr-2 size-4 animate-spin" />}
              <Save className="mr-2 size-4" />
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
