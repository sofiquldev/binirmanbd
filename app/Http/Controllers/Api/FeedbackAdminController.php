<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use App\Models\District;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FeedbackAdminController extends Controller
{
    /**
     * List feedbacks with filters and search.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Feedback::with([
            'candidate.party',
            'candidate.constituency.district',
            'assignee',
        ])->withCount('comments')->latest();

        if ($request->filled('candidate_id')) {
            $query->where('candidate_id', $request->integer('candidate_id'));
        }

        if ($request->filled('party_id')) {
            $partyId = $request->integer('party_id');
            $query->whereHas('candidate.party', fn($q) => $q->where('id', $partyId));
        }

        if ($request->filled('constituency_id')) {
            $constituencyId = $request->integer('constituency_id');
            $query->whereHas('candidate.constituency', fn($q) => $q->where('id', $constituencyId));
        }

        if ($request->filled('district_slug')) {
            $slug = $request->get('district_slug');
            $query->whereHas('candidate.constituency.district', fn($q) => $q->where('slug', $slug));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->get('status'));
        }

        if ($request->filled('visible')) {
            $visible = filter_var($request->get('visible'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            if (!is_null($visible)) {
                $query->where('is_visible', $visible);
            }
        }

        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $perPage = (int) $request->get('per_page', 15);
        $feedback = $query->paginate($perPage);

        return response()->json($feedback);
    }

    /**
     * Show a single feedback with comments.
     */
    public function show(Feedback $feedback): JsonResponse
    {
        $feedback->load([
            'candidate.party',
            'candidate.constituency.district',
            'assignee',
            'comments.user',
        ]);

        // Increment views
        $feedback->increment('views');

        return response()->json($feedback);
    }

    /**
     * Update feedback (status, visibility, like/dislike).
     */
    public function update(Request $request, Feedback $feedback): JsonResponse
    {
        $action = $request->get('action');

        if ($action === 'toggle_visibility') {
            $feedback->is_visible = !$feedback->is_visible;
            $feedback->save();
        } elseif ($action === 'like') {
            $feedback->increment('likes');
        } elseif ($action === 'dislike') {
            $feedback->increment('dislikes');
        } elseif ($action === 'status') {
            $validated = $request->validate([
                'status' => 'required|in:new,in_review,assigned,resolved',
            ]);
            $feedback->status = $validated['status'];
            $feedback->save();
        } else {
            $validated = $request->validate([
                'status' => 'sometimes|in:new,in_review,assigned,resolved',
                'is_visible' => 'sometimes|boolean',
            ]);
            $feedback->fill($validated);
            $feedback->save();
        }

        return response()->json($feedback->fresh());
    }

    /**
     * Store a comment for a feedback.
     */
    public function storeComment(Request $request, Feedback $feedback): JsonResponse
    {
        $data = $request->validate([
            'body' => 'required|string|min:2',
        ]);

        $comment = $feedback->comments()->create([
            'tenant_id' => $feedback->tenant_id,
            'user_id' => $request->user()?->id,
            'body' => $data['body'],
            'meta' => null,
        ]);

        $comment->load('user');

        return response()->json($comment, 201);
    }
}
