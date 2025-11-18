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

        $contacts = Contact::where('candidate_id', $candidate->id)
            ->orderBy('priority')
            ->orderBy('name')
            ->get([
                'category',
                'name',
                'designation',
                'organization',
                'phone',
                'email',
                'is_verified',
                'notes',
            ]);

        return response()->json([
            'data' => $contacts,
        ]);
    }
}
