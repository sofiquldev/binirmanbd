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

  const handleCopy = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://binirman.test/api/v1';
    const baseUrl = apiUrl.replace('/api/v1', '');
    const donationUrl = `${baseUrl}/c/${candidateId}/donate`;
    
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(donationUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Fallback for older browsers or non-HTTPS contexts
        const textArea = document.createElement('textarea');
        textArea.value = donationUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          const successful = document.execCommand('copy');
          if (successful) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } else {
            toast.error('Failed to copy URL');
          }
        } catch (err) {
          toast.error('Failed to copy URL');
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy URL');
    }
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
            <Card className="border-none">
              <CardContent className="p-0">
                {paymentMethods.length === 0 ? (
                  <div className="p-6 text-center text-sm text-muted-foreground">
                    No payment methods available. Please add payment methods from Settings.
                  </div>
                ) : (
                  <Accordion type="multiple" className="w-full space-y-3" indicator="none">
                    {paymentMethods.map((method) => {
                      const isEnabled = formData.enabled_payment_methods?.includes(method.code);
                      const methodConfig = formData.payment_method_configs[method.code] || {};
                      const Icon = CreditCard; // You can customize this based on method type
                      const isOnline = method.is_online;

                      return (
                        <AccordionItem 
                          key={method.id} 
                          value={`method-${method.id}`} 
                          className="border border-border rounded-lg bg-card"
                        >
                          <div className="flex items-center justify-between px-6 py-4 gap-4">
                            <AccordionTrigger className="flex-1 hover:no-underline py-0 text-left">
                              <div className="flex items-center gap-4 flex-1 min-w-0 text-left">
                                <HexagonBadge
                                  stroke="stroke-input"
                                  fill="fill-muted/30"
                                  size="size-[50px]"
                                  badge={<Icon className="text-xl text-muted-foreground" />}
                                />
                                <div className="flex flex-col gap-1 flex-1 min-w-0 text-left">
                                  <span className="font-medium text-sm text-foreground leading-tight text-left">
                                    {methodConfig.name || method.name}
                                    {method.name_bn && !methodConfig.name && (
                                      <span className="text-muted-foreground font-normal"> ({method.name_bn})</span>
                                    )}
                                  </span>
                                  <span className="text-sm text-muted-foreground leading-tight text-left">
                                    {method.description || `Configure ${methodConfig.name || method.name} payment settings`}
                                  </span>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <div className="flex items-center gap-2.5 shrink-0">
                              <Label htmlFor={`publish-${method.id}`} className="text-sm whitespace-nowrap text-left">
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
                          <AccordionContent className="px-6 pb-4 text-left">
                            <div className="space-y-4 pt-2 text-left">
                              {/* Online Payment Gateway Configuration */}
                              {isOnline && (
                                <div className="space-y-4 border-b border-border pb-4">
                                  <h4 className="text-sm font-semibold text-foreground">
                                    Payment Gateway Configuration
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor={`api-key-${method.id}`}>
                                        API Key / Secret Key
                                      </Label>
                                      <Input
                                        id={`api-key-${method.id}`}
                                        type="password"
                                        value={methodConfig.api_key || methodConfig.key || ''}
                                        onChange={(e) =>
                                          updatePaymentMethodConfig(
                                            method.code,
                                            'api_key',
                                            e.target.value
                                          )
                                        }
                                        placeholder="Enter API key"
                                      />
                                      <p className="text-xs text-muted-foreground">
                                        Your payment gateway API key
                                      </p>
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`gateway-id-${method.id}`}>
                                        Gateway ID / Merchant ID
                                      </Label>
                                      <Input
                                        id={`gateway-id-${method.id}`}
                                        type="text"
                                        value={methodConfig.gateway_id || methodConfig.merchant_id || methodConfig.id || ''}
                                        onChange={(e) =>
                                          updatePaymentMethodConfig(
                                            method.code,
                                            'gateway_id',
                                            e.target.value
                                          )
                                        }
                                        placeholder="Enter gateway/merchant ID"
                                      />
                                      <p className="text-xs text-muted-foreground">
                                        Your payment gateway merchant/gateway ID
                                      </p>
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`webhook-${method.id}`}>
                                        Webhook URL
                                      </Label>
                                      <Input
                                        id={`webhook-${method.id}`}
                                        type="text"
                                        value={methodConfig.webhook || methodConfig.webhook_url || ''}
                                        onChange={(e) =>
                                          updatePaymentMethodConfig(
                                            method.code,
                                            'webhook',
                                            e.target.value
                                          )
                                        }
                                        placeholder="https://your-domain.com/webhook/payment"
                                      />
                                      <p className="text-xs text-muted-foreground">
                                        URL to receive payment webhooks
                                      </p>
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`callback-${method.id}`}>
                                        Callback URL
                                      </Label>
                                      <Input
                                        id={`callback-${method.id}`}
                                        type="text"
                                        value={methodConfig.callback || methodConfig.callback_url || ''}
                                        onChange={(e) =>
                                          updatePaymentMethodConfig(
                                            method.code,
                                            'callback',
                                            e.target.value
                                          )
                                        }
                                        placeholder="https://your-domain.com/payment/callback"
                                      />
                                      <p className="text-xs text-muted-foreground">
                                        URL for payment success/failure callbacks
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Offline Payment Method Configuration */}
                              {!isOnline && 
                                method.code !== 'bkash' && 
                                method.code !== 'nagad' && 
                                method.code !== 'rocket' &&
                                method.code !== 'bank' && (
                                <div className="space-y-4 border-b border-border pb-4">
                                  <h4 className="text-sm font-semibold text-foreground">
                                    Payment Method Configuration
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor={`name-${method.id}`}>
                                        Name / Account Name
                                      </Label>
                                      <Input
                                        id={`name-${method.id}`}
                                        type="text"
                                        value={methodConfig.name || methodConfig.account_name || ''}
                                        onChange={(e) =>
                                          updatePaymentMethodConfig(
                                            method.code,
                                            'name',
                                            e.target.value
                                          )
                                        }
                                        placeholder="Enter account/payment name"
                                      />
                                      <p className="text-xs text-muted-foreground">
                                        Name for this payment method
                                      </p>
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`id-${method.id}`}>
                                        ID / Account Number
                                      </Label>
                                      <Input
                                        id={`id-${method.id}`}
                                        type="text"
                                        value={methodConfig.id || methodConfig.account_number || methodConfig.account_id || ''}
                                        onChange={(e) =>
                                          updatePaymentMethodConfig(
                                            method.code,
                                            'id',
                                            e.target.value
                                          )
                                        }
                                        placeholder="Enter account number or ID"
                                      />
                                      <p className="text-xs text-muted-foreground">
                                        Account number, phone number, or payment ID
                                      </p>
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`type-${method.id}`}>
                                        Type
                                      </Label>
                                      <Input
                                        id={`type-${method.id}`}
                                        type="text"
                                        value={methodConfig.type || ''}
                                        onChange={(e) =>
                                          updatePaymentMethodConfig(
                                            method.code,
                                            'type',
                                            e.target.value
                                          )
                                        }
                                        placeholder="Personal, Merchant, etc."
                                      />
                                      <p className="text-xs text-muted-foreground">
                                        Payment account type
                                      </p>
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`branch-${method.id}`}>
                                        Branch / Location
                                      </Label>
                                      <Input
                                        id={`branch-${method.id}`}
                                        type="text"
                                        value={methodConfig.branch || methodConfig.location || ''}
                                        onChange={(e) =>
                                          updatePaymentMethodConfig(
                                            method.code,
                                            'branch',
                                            e.target.value
                                          )
                                        }
                                        placeholder="Enter branch or location"
                                      />
                                      <p className="text-xs text-muted-foreground">
                                        Branch name or location (for bank transfers)
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Method-Specific Configuration */}
                              <div className="space-y-4 pt-2">
                                <h4 className="text-sm font-semibold text-foreground">
                                  Additional Settings
                                </h4>

                                {/* SSLCommerz Specific Configuration */}
                                {method.code === 'sslcommerz' && (
                                  <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label htmlFor={`store-id-${method.id}`}>Store ID</Label>
                                        <Input
                                          id={`store-id-${method.id}`}
                                          type="text"
                                          value={methodConfig.sslcommerz_store_id || methodConfig.gateway_id || ''}
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
                                          value={methodConfig.sslcommerz_store_password || methodConfig.api_key || ''}
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

                                {/* Bank Transfer Specific Configuration */}
                                {method.code === 'bank' && (
                                  <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label htmlFor={`bank-name-${method.id}`}>Bank Name</Label>
                                        <Input
                                          id={`bank-name-${method.id}`}
                                          type="text"
                                          value={methodConfig.bank_name || methodConfig.name || ''}
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
                                          value={methodConfig.bank_account_name || methodConfig.account_name || ''}
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
                                          value={methodConfig.bank_account_number || methodConfig.id || methodConfig.account_number || ''}
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
                                          value={methodConfig.bank_branch || methodConfig.branch || ''}
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

                                {/* bKash, Nagad, Rocket Specific Configuration */}
                                {(method.code === 'bkash' || method.code === 'nagad' || method.code === 'rocket') && (
                                  <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label htmlFor={`number-${method.id}`}>
                                          {method.code === 'bkash' ? 'bKash' : method.code === 'nagad' ? 'Nagad' : 'Rocket'} Number
                                        </Label>
                                        <Input
                                          id={`number-${method.id}`}
                                          type="text"
                                          value={methodConfig[`${method.code}_number`] || methodConfig.id || methodConfig.number || ''}
                                          onChange={(e) =>
                                            updatePaymentMethodConfig(
                                              method.code,
                                              `${method.code}_number`,
                                              e.target.value
                                            )
                                          }
                                          placeholder="01XXXXXXXXX"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor={`type-${method.id}`}>
                                          Account Type
                                        </Label>
                                        <select
                                          id={`type-${method.id}`}
                                          value={methodConfig[`${method.code}_account_type`] || methodConfig.type || 'personal'}
                                          onChange={(e) =>
                                            updatePaymentMethodConfig(
                                              method.code,
                                              `${method.code}_account_type`,
                                              e.target.value
                                            )
                                          }
                                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        >
                                          <option value="personal">Personal</option>
                                          <option value="agent">Agent</option>
                                          <option value="merchant">Merchant</option>
                                        </select>
                                      </div>
                                    </div>
                                  </>
                                )}

                                {/* Generic API Key / Auth fields for other online methods */}
                                {isOnline &&
                                  method.requires_credentials &&
                                  method.code !== 'sslcommerz' && (
                                    <>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
