<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PaymentMethod;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PaymentMethodController extends Controller
{
    /**
     * Get all payment methods (admin)
     */
    public function index(Request $request): JsonResponse
    {
        $query = PaymentMethod::query();

        // Filter by active status
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('name_bn', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            });
        }

        $paymentMethods = $query->orderBy('sort_order')->orderBy('name')->get();

        return response()->json([
            'data' => $paymentMethods,
        ]);
    }

    /**
     * Get single payment method
     */
    public function show($id): JsonResponse
    {
        $paymentMethod = PaymentMethod::findOrFail($id);

        return response()->json($paymentMethod);
    }

    /**
     * Create new payment method
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'code' => ['required', 'string', 'max:50', 'unique:payment_methods,code'],
            'name' => ['required', 'string', 'max:255'],
            'name_bn' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'description_bn' => ['nullable', 'string'],
            'icon' => ['nullable', 'string', 'max:255'],
            'is_active' => ['nullable', 'boolean'],
            'requires_credentials' => ['nullable', 'boolean'],
            'is_online' => ['nullable', 'boolean'],
            'config_fields' => ['nullable', 'array'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        $paymentMethod = PaymentMethod::create($data);

        return response()->json([
            'message' => 'Payment method created successfully.',
            'data' => $paymentMethod,
        ], 201);
    }

    /**
     * Update payment method
     */
    public function update(Request $request, $id): JsonResponse
    {
        $paymentMethod = PaymentMethod::findOrFail($id);

        $data = $request->validate([
            'code' => ['sometimes', 'string', 'max:50', Rule::unique('payment_methods', 'code')->ignore($id)],
            'name' => ['sometimes', 'string', 'max:255'],
            'name_bn' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'description_bn' => ['nullable', 'string'],
            'icon' => ['nullable', 'string', 'max:255'],
            'is_active' => ['sometimes', 'boolean'],
            'requires_credentials' => ['sometimes', 'boolean'],
            'is_online' => ['sometimes', 'boolean'],
            'config_fields' => ['nullable', 'array'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        $paymentMethod->update($data);

        return response()->json([
            'message' => 'Payment method updated successfully.',
            'data' => $paymentMethod,
        ]);
    }

    /**
     * Delete payment method
     */
    public function destroy($id): JsonResponse
    {
        $paymentMethod = PaymentMethod::findOrFail($id);

        // Prevent deletion of default payment method
        if ($paymentMethod->code === 'default') {
            return response()->json([
                'message' => 'Cannot delete the default payment method.',
            ], 422);
        }

        // Check if any candidates are using this payment method
        $usageCount = $paymentMethod->candidates()->count();
        if ($usageCount > 0) {
            return response()->json([
                'message' => "Cannot delete payment method. It is being used by {$usageCount} candidate(s).",
            ], 422);
        }

        $paymentMethod->delete();

        return response()->json([
            'message' => 'Payment method deleted successfully.',
        ]);
    }

    /**
     * Toggle active status
     */
    public function toggleActive($id): JsonResponse
    {
        $paymentMethod = PaymentMethod::findOrFail($id);

        // Prevent deactivating default payment method
        if ($paymentMethod->code === 'default' && $paymentMethod->is_active) {
            return response()->json([
                'message' => 'Cannot deactivate the default payment method.',
            ], 422);
        }

        $paymentMethod->update([
            'is_active' => !$paymentMethod->is_active,
        ]);

        return response()->json([
            'message' => 'Payment method status updated successfully.',
            'data' => $paymentMethod,
        ]);
    }
}
