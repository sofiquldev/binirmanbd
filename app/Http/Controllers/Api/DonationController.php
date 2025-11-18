<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Candidate;
use App\Models\Donation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DonationController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'donor_name' => ['required', 'string', 'max:255'],
            'donor_id_number' => ['nullable', 'string', 'max:50'],
            'donor_phone' => ['nullable', 'string', 'max:20'],
            'donor_email' => ['nullable', 'email'],
            'amount' => ['required', 'numeric', 'min:10'],
            'currency' => ['nullable', 'in:BDT,USD'],
            'gateway' => ['required', 'in:sslcommerz,bkash,nagad,stripe'],
            'notes' => ['nullable', 'string', 'max:500'],
        ]);

        $candidate = Candidate::where('tenant_id', tenant('id'))->firstOrFail();

        $donation = Donation::create([
            'tenant_id' => tenant('id'),
            'candidate_id' => $candidate->id,
            'donor_name' => $data['donor_name'],
            'donor_id_number' => $data['donor_id_number'] ?? null,
            'donor_phone' => $data['donor_phone'] ?? null,
            'donor_email' => $data['donor_email'] ?? null,
            'source' => 'online',
            'method' => $data['gateway'],
            'amount' => $data['amount'],
            'currency' => $data['currency'] ?? 'BDT',
            'status' => Donation::STATUS_PENDING,
            'payment_gateway' => $data['gateway'],
            'transaction_reference' => 'BNBD-' . Str::uuid(),
            'notes' => $data['notes'] ?? null,
        ]);

        return response()->json([
            'message' => 'Donation created. Redirect user to gateway client-side.',
            'donation' => $donation,
        ], 201);
    }
}
