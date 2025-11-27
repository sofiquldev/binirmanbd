<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Candidate;
use App\Models\Feedback;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FeedbackController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'email' => ['nullable', 'email'],
            'category' => ['required', 'string', 'max:100'],
            'description' => ['required', 'string', 'min:10'],
            'attachment' => ['nullable', 'file', 'max:4096'],
        ]);

        $candidate = Candidate::where('tenant_id', tenant('id'))->firstOrFail();

        $attachmentPath = $request->file('attachment')
            ? $request->file('attachment')->store('feedback', 'public')
            : null;

        $feedback = Feedback::create([
            'tenant_id' => tenant('id'),
            'candidate_id' => $candidate->id,
            'name' => $data['name'] ?? null,
            'phone' => $data['phone'] ?? null,
            'email' => $data['email'] ?? null,
            'category' => $data['category'],
            'description' => $data['description'],
            'status' => Feedback::STATUS_NEW,
            'attachment_path' => $attachmentPath ? Storage::disk('public')->url($attachmentPath) : null,
        ]);

        return response()->json([
            'message' => 'Feedback submitted successfully.',
            'reference' => $feedback->id,
        ], 201);
    }

    /**
     * Public feedback submission by candidate ID (no tenancy required)
     */
    public function storePublic(Request $request): JsonResponse
    {
        $data = $request->validate([
            'candidate_id' => ['required', 'integer', 'exists:candidates,id'],
            'name' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'email' => ['nullable', 'email'],
            'category' => ['required', 'string', 'max:100'],
            'description' => ['required', 'string', 'min:10'],
            'attachment' => ['nullable', 'file', 'max:4096'],
        ]);

        $candidate = Candidate::findOrFail($data['candidate_id']);

        $attachmentPath = $request->file('attachment')
            ? $request->file('attachment')->store('feedback', 'public')
            : null;

        $feedback = Feedback::create([
            'tenant_id' => $candidate->tenant_id,
            'candidate_id' => $candidate->id,
            'name' => $data['name'] ?? null,
            'phone' => $data['phone'] ?? null,
            'email' => $data['email'] ?? null,
            'category' => $data['category'],
            'description' => $data['description'],
            'status' => Feedback::STATUS_NEW,
            'attachment_path' => $attachmentPath ? Storage::disk('public')->url($attachmentPath) : null,
        ]);

        return response()->json([
            'message' => 'Feedback submitted successfully.',
            'reference' => $feedback->id,
        ], 201);
    }
}
