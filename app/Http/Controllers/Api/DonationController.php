<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Candidate;
use App\Models\CandidateDonationSetting;
use App\Models\Donation;
use App\Models\PaymentMethod;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class DonationController extends Controller
{
    /**
     * Public donation submission (no authentication required)
     */
    public function storePublic(Request $request, $candidateId): JsonResponse
    {
        $candidate = Candidate::where('id', $candidateId)
            ->orWhere('slug', $candidateId)
            ->firstOrFail();

        // Check if donations are enabled for this candidate
        $settings = $candidate->donationSetting;
        if (!$settings || !$settings->donations_enabled) {
            return response()->json([
                'message' => 'Donations are currently disabled for this candidate.',
            ], 403);
        }

        // Get enabled payment method codes
        $enabledMethodCodes = $candidate->paymentMethods()
            ->wherePivot('is_enabled', true)
            ->pluck('code')
            ->toArray();

        if (empty($enabledMethodCodes)) {
            return response()->json([
                'message' => 'No payment methods are enabled for this candidate.',
            ], 422);
        }

        // Validate amount against settings
        $minAmount = $settings->minimum_amount ?? 10;
        $maxAmount = $settings->maximum_amount;

        $data = $request->validate([
            'donor_name' => ['required', 'string', 'max:255'],
            'donor_name_bn' => $settings->show_donor_name_bn ? ['nullable', 'string', 'max:255'] : ['nullable'],
            'donor_id_number' => $settings->require_donor_id ? ['required', 'string', 'max:50'] : ['nullable', 'string', 'max:50'],
            'donor_phone' => $settings->require_donor_phone ? ['required', 'string', 'max:20'] : ['nullable', 'string', 'max:20'],
            'donor_email' => $settings->require_donor_email ? ['required', 'email', 'max:255'] : ['nullable', 'email', 'max:255'],
            'amount' => [
                'required',
                'numeric',
                "min:{$minAmount}",
                $maxAmount ? "max:{$maxAmount}" : '',
            ],
            'currency' => ['nullable', Rule::in($settings->allowed_currencies ?? ['BDT', 'USD'])],
            'method' => ['required', Rule::in($enabledMethodCodes)],
            'notes' => ['nullable', 'string', 'max:500'],
        ]);

        // Validate payment method is enabled
        if (!$settings->isPaymentMethodEnabled($data['method'])) {
            return response()->json([
                'message' => 'The selected payment method is not available.',
            ], 422);
        }

        // Get payment method and check if credentials are configured
        $paymentMethod = PaymentMethod::where('code', $data['method'])->first();
        if ($paymentMethod && $paymentMethod->requires_credentials) {
            $candidatePaymentMethod = $candidate->paymentMethods()
                ->where('payment_methods.code', $data['method'])
                ->wherePivot('is_enabled', true)
                ->first();

            if (!$candidatePaymentMethod || !$candidatePaymentMethod->pivot->config) {
                return response()->json([
                    'message' => 'This payment method is not properly configured.',
                ], 422);
            }
        }

        $donation = Donation::create([
            'tenant_id' => $candidate->tenant_id,
            'candidate_id' => $candidate->id,
            'donor_name' => $data['donor_name'],
            'donor_name_bn' => $data['donor_name_bn'] ?? null,
            'donor_id_number' => $data['donor_id_number'] ?? null,
            'donor_phone' => $data['donor_phone'] ?? null,
            'donor_email' => $data['donor_email'] ?? null,
            'source' => 'online',
            'method' => $data['method'],
            'amount' => $data['amount'],
            'currency' => $data['currency'] ?? 'BDT',
            'status' => Donation::STATUS_PENDING,
            'payment_gateway' => $data['method'] === 'sslcommerz' ? 'sslcommerz' : null,
            'transaction_reference' => 'BNBD-' . Str::upper(Str::random(12)),
            'notes' => $data['notes'] ?? null,
        ]);

        // If online payment gateway, prepare payment data
        $paymentData = null;
        if ($paymentMethod && $paymentMethod->is_online) {
            $candidatePaymentMethod = $candidate->paymentMethods()
                ->where('payment_methods.code', $data['method'])
                ->first();
            
            $config = $candidatePaymentMethod->pivot->config ?? [];
            
            if ($data['method'] === 'sslcommerz') {
                $paymentData = [
                    'store_id' => $config['sslcommerz_store_id'] ?? null,
                    'store_password' => $config['sslcommerz_store_password'] 
                        ? Crypt::decryptString($config['sslcommerz_store_password']) 
                        : null,
                    'is_sandbox' => $config['sslcommerz_is_sandbox'] ?? true,
                    'donation_id' => $donation->id,
                    'amount' => $donation->amount,
                    'currency' => $donation->currency,
                ];
            }
        }

        return response()->json([
            'message' => 'Donation created successfully.',
            'donation' => $donation->load('candidate:id,name,name_bn'),
            'payment_data' => $paymentData,
        ], 201);
    }

    /**
     * Get all donations (admin panel)
     */
    public function index(Request $request): JsonResponse
    {
        $query = Donation::with(['candidate:id,name,name_bn', 'candidate.party:id,name', 'candidate.constituency:id,name'])
            ->where('tenant_id', tenant('id'));

        // Filter by candidate
        if ($request->has('candidate_id')) {
            $query->where('candidate_id', $request->candidate_id);
        }

        // Filter by date range
        if ($request->has('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->has('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Filter by payment method
        if ($request->has('method')) {
            $query->where('method', $request->method);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('donor_name', 'like', "%{$search}%")
                    ->orWhere('donor_phone', 'like', "%{$search}%")
                    ->orWhere('donor_email', 'like', "%{$search}%")
                    ->orWhere('transaction_reference', 'like', "%{$search}%");
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 15);
        $donations = $query->paginate($perPage);

        // Get summary statistics
        $summary = [
            'total_amount' => Donation::where('tenant_id', tenant('id'))
                ->where('status', Donation::STATUS_VERIFIED)
                ->sum('amount'),
            'total_count' => Donation::where('tenant_id', tenant('id'))->count(),
            'pending_count' => Donation::where('tenant_id', tenant('id'))
                ->where('status', Donation::STATUS_PENDING)
                ->count(),
            'verified_count' => Donation::where('tenant_id', tenant('id'))
                ->where('status', Donation::STATUS_VERIFIED)
                ->count(),
        ];

        return response()->json([
            'data' => $donations->items(),
            'meta' => [
                'current_page' => $donations->currentPage(),
                'last_page' => $donations->lastPage(),
                'per_page' => $donations->perPage(),
                'total' => $donations->total(),
            ],
            'summary' => $summary,
        ]);
    }

    /**
     * Get donation details
     */
    public function show($id): JsonResponse
    {
        $donation = Donation::with([
            'candidate:id,name,name_bn,slug',
            'candidate.party:id,name,name_bn',
            'candidate.constituency:id,name,name_bn',
            'creator:id,name,email',
        ])
            ->where('tenant_id', tenant('id'))
            ->findOrFail($id);

        return response()->json($donation);
    }

    /**
     * Update donation status
     */
    public function update(Request $request, $id): JsonResponse
    {
        $donation = Donation::where('tenant_id', tenant('id'))->findOrFail($id);

        $data = $request->validate([
            'status' => ['required', Rule::in([
                Donation::STATUS_PENDING,
                Donation::STATUS_PROCESSING,
                Donation::STATUS_VERIFIED,
                Donation::STATUS_REJECTED,
                Donation::STATUS_REFUNDED,
            ])],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $donation->update([
            'status' => $data['status'],
            'notes' => $data['notes'] ?? $donation->notes,
            'verified_at' => $data['status'] === Donation::STATUS_VERIFIED ? now() : $donation->verified_at,
        ]);

        return response()->json([
            'message' => 'Donation updated successfully.',
            'donation' => $donation->load('candidate:id,name,name_bn'),
        ]);
    }

    /**
     * Get candidate's donations
     */
    public function getCandidateDonations(Request $request, $candidateId): JsonResponse
    {
        $candidate = Candidate::where('tenant_id', tenant('id'))
            ->findOrFail($candidateId);

        $query = $candidate->donations();

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by date range
        if ($request->has('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->has('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $query->orderBy('created_at', 'desc');

        $perPage = $request->get('per_page', 15);
        $donations = $query->paginate($perPage);

        // Get statistics
        $stats = [
            'total_amount' => $candidate->donations()
                ->where('status', Donation::STATUS_VERIFIED)
                ->sum('amount'),
            'total_count' => $candidate->donations()->count(),
            'pending_amount' => $candidate->donations()
                ->where('status', Donation::STATUS_PENDING)
                ->sum('amount'),
            'recent_donors' => $candidate->donations()
                ->where('status', Donation::STATUS_VERIFIED)
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get(['donor_name', 'amount', 'created_at']),
        ];

        return response()->json([
            'data' => $donations->items(),
            'meta' => [
                'current_page' => $donations->currentPage(),
                'last_page' => $donations->lastPage(),
                'per_page' => $donations->perPage(),
                'total' => $donations->total(),
            ],
            'stats' => $stats,
        ]);
    }

    /**
     * Get candidate donation settings (public access for donation form)
     */
    public function getCandidateSettings($candidateId): JsonResponse
    {
        $candidate = Candidate::where('id', $candidateId)
            ->orWhere('slug', $candidateId)
            ->firstOrFail();

        $settings = $candidate->donationSetting;
        if (!$settings) {
            // Create default settings
            $settings = CandidateDonationSetting::create([
                'tenant_id' => $candidate->tenant_id,
                'candidate_id' => $candidate->id,
                ...CandidateDonationSetting::getDefaults(),
            ]);
        }

        // Get enabled payment methods with their configs
        $enabledPaymentMethods = $candidate->paymentMethods()
            ->wherePivot('is_enabled', true)
            ->orderByPivot('sort_order')
            ->get()
            ->map(function ($method) {
                $config = $method->pivot->config ?? [];
                // Don't expose encrypted credentials
                if (isset($config['sslcommerz_store_password'])) {
                    unset($config['sslcommerz_store_password']);
                }
                return [
                    'id' => $method->id,
                    'code' => $method->code,
                    'name' => $method->name,
                    'name_bn' => $method->name_bn,
                    'is_online' => $method->is_online,
                    'requires_credentials' => $method->requires_credentials,
                    'config' => $config,
                    'is_configured' => $method->requires_credentials 
                        ? !empty($config) 
                        : true,
                ];
            });

        $settingsData = $settings->toArray();
        $settingsData['enabled_payment_methods'] = $enabledPaymentMethods;
        $settingsData['all_payment_methods'] = PaymentMethod::getActive()
            ->map(fn($m) => [
                'id' => $m->id,
                'code' => $m->code,
                'name' => $m->name,
                'name_bn' => $m->name_bn,
                'is_online' => $m->is_online,
                'requires_credentials' => $m->requires_credentials,
            ]);

        return response()->json($settingsData);
    }

    /**
     * Update candidate donation settings
     */
    public function updateCandidateSettings(Request $request, $candidateId): JsonResponse
    {
        $candidate = Candidate::where('tenant_id', tenant('id'))
            ->findOrFail($candidateId);

        $data = $request->validate([
            'donations_enabled' => ['nullable', 'boolean'],
            'enabled_payment_methods' => ['nullable', 'array'],
            'enabled_payment_methods.*' => ['in:bank,bkash,sslcommerz,default,nagad,rocket,cash'],
            'payment_method_configs' => ['nullable', 'array'],
            'payment_method_configs.*' => ['nullable', 'array'],
            // Individual config fields for backward compatibility
            'sslcommerz_store_id' => ['nullable', 'string'],
            'sslcommerz_store_password' => ['nullable', 'string'],
            'sslcommerz_is_sandbox' => ['nullable', 'boolean'],
            'bank_name' => ['nullable', 'string', 'max:255'],
            'bank_account_name' => ['nullable', 'string', 'max:255'],
            'bank_account_number' => ['nullable', 'string', 'max:50'],
            'bank_routing_number' => ['nullable', 'string', 'max:50'],
            'bank_branch' => ['nullable', 'string', 'max:255'],
            'bkash_number' => ['nullable', 'string', 'max:20'],
            'bkash_account_type' => ['nullable', 'in:personal,merchant'],
            // Other donation settings
            'form_title' => ['nullable', 'string', 'max:255'],
            'success_message' => ['nullable', 'string'],
            'minimum_amount' => ['nullable', 'numeric', 'min:0'],
            'maximum_amount' => ['nullable', 'numeric', 'min:0'],
            'default_currency' => ['nullable', 'string', 'max:3'],
            'show_donor_name_bn' => ['nullable', 'boolean'],
            'require_donor_phone' => ['nullable', 'boolean'],
            'require_donor_email' => ['nullable', 'boolean'],
            'require_donor_id' => ['nullable', 'boolean'],
            'suggested_amounts' => ['nullable', 'array'],
        ]);

        $settings = $candidate->donationSetting;
        if (!$settings) {
            $settings = CandidateDonationSetting::create([
                'tenant_id' => $candidate->tenant_id,
                'candidate_id' => $candidate->id,
                ...CandidateDonationSetting::getDefaults(),
            ]);
        }

        // Handle encrypted fields
        if (isset($data['sslcommerz_store_id'])) {
            $settings->setEncryptedStoreId($data['sslcommerz_store_id']);
            unset($data['sslcommerz_store_id']);
        }
        if (isset($data['sslcommerz_store_password'])) {
            $settings->setEncryptedStorePassword($data['sslcommerz_store_password']);
            unset($data['sslcommerz_store_password']);
        }

        $settings->update($data);

        // Sync payment methods with their configs
        if (isset($data['enabled_payment_methods'])) {
            $paymentMethodConfigs = $request->input('payment_method_configs', []);
            $syncData = [];

            foreach ($data['enabled_payment_methods'] as $methodCode) {
                $paymentMethod = \App\Models\PaymentMethod::where('code', $methodCode)->first();
                if (!$paymentMethod) {
                    continue;
                }

                $config = $paymentMethodConfigs[$methodCode] ?? [];

                // Handle SSLCommerz config
                if ($methodCode === 'sslcommerz') {
                    if (isset($data['sslcommerz_store_id'])) {
                        $config['sslcommerz_store_id'] = $data['sslcommerz_store_id'];
                    }
                    if (isset($data['sslcommerz_store_password'])) {
                        $config['sslcommerz_store_password'] = \Illuminate\Support\Facades\Crypt::encryptString($data['sslcommerz_store_password']);
                    }
                    if (isset($data['sslcommerz_is_sandbox'])) {
                        $config['sslcommerz_is_sandbox'] = $data['sslcommerz_is_sandbox'];
                    }
                }

                // Handle Bank config
                if ($methodCode === 'bank') {
                    if (isset($data['bank_name'])) {
                        $config['bank_name'] = $data['bank_name'];
                    }
                    if (isset($data['bank_account_name'])) {
                        $config['bank_account_name'] = $data['bank_account_name'];
                    }
                    if (isset($data['bank_account_number'])) {
                        $config['bank_account_number'] = $data['bank_account_number'];
                    }
                    if (isset($data['bank_routing_number'])) {
                        $config['bank_routing_number'] = $data['bank_routing_number'];
                    }
                    if (isset($data['bank_branch'])) {
                        $config['bank_branch'] = $data['bank_branch'];
                    }
                }

                // Handle bKash config
                if ($methodCode === 'bkash') {
                    if (isset($data['bkash_number'])) {
                        $config['bkash_number'] = $data['bkash_number'];
                    }
                    if (isset($data['bkash_account_type'])) {
                        $config['bkash_account_type'] = $data['bkash_account_type'];
                    }
                }

                // Handle common fields for all methods
                if (isset($config['name'])) {
                    // Custom display name
                }
                if (isset($config['icon_url'])) {
                    // Icon URL
                }
                if (isset($config['endpoint']) || isset($config['api_endpoint'])) {
                    $config['endpoint'] = $config['endpoint'] ?? $config['api_endpoint'] ?? null;
                    unset($config['api_endpoint']); // Normalize to 'endpoint'
                }
                if (isset($config['merchant_id'])) {
                    // Merchant ID
                }
                if (isset($config['webhook_url'])) {
                    // Webhook URL
                }
                if (isset($config['notes'])) {
                    // Notes
                }

                $syncData[$paymentMethod->id] = [
                    'config' => $config,
                    'is_enabled' => true,
                ];
            }

            // Sync payment methods
            $candidate->paymentMethods()->sync($syncData);
        }

        // Don't expose encrypted credentials
        $settingsData = $settings->toArray();
        unset($settingsData['sslcommerz_store_id']);
        unset($settingsData['sslcommerz_store_password']);
        $settingsData['sslcommerz_configured'] = !empty($settings->sslcommerz_store_id);

        return response()->json([
            'message' => 'Settings updated successfully.',
            'settings' => $settingsData,
        ]);
    }

    /**
     * Get QR code URL for candidate
     */
    public function getQrCode($candidateId): JsonResponse
    {
        $candidate = Candidate::where('tenant_id', tenant('id'))
            ->findOrFail($candidateId);

        $settings = $candidate->donationSetting;
        if (!$settings || !$settings->donations_enabled) {
            return response()->json([
                'message' => 'Donations are disabled for this candidate.',
            ], 403);
        }

        // Generate QR code URL if not exists
        if (!$settings->qr_code_url) {
            $baseUrl = config('app.frontend_url', 'http://localhost:3000');
            $qrCodeUrl = "{$baseUrl}/donate/{$candidate->slug}";
            $settings->update(['qr_code_url' => $qrCodeUrl]);
        }

        return response()->json([
            'qr_code_url' => $settings->qr_code_url,
            'candidate' => [
                'id' => $candidate->id,
                'name' => $candidate->name,
                'slug' => $candidate->slug,
            ],
        ]);
    }
}
