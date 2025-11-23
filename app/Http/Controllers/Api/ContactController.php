<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Candidate;
use App\Models\Contact;
use Illuminate\Http\JsonResponse;

class ContactController extends Controller
{
    public function index(): JsonResponse
    {
        $candidate = Candidate::where('tenant_id', tenant('id'))->firstOrFail();

        $contacts = Contact::with(['category', 'organization'])
            ->where('candidate_id', $candidate->id)
            ->orderBy('priority')
            ->orderBy('name')
            ->get();

        return response()->json([
            'data' => $contacts,
        ]);
    }
}
