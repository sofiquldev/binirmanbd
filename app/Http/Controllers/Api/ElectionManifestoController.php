<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Candidate;
use App\Models\ElectionManifesto;
use Illuminate\Http\Request;

class ElectionManifestoController extends Controller
{
    public function indexAll(Request $request)
    {
        $query = ElectionManifesto::with(['category', 'candidate.constituency'])
            ->latest();

        // Apply filters
        if ($request->has('candidate_id')) {
            $query->where('candidate_id', $request->candidate_id);
        }

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('title_bn', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $manifestos = $query->paginate($request->get('per_page', 15));

        return response()->json($manifestos);
    }

    public function index(Candidate $candidate)
    {
        $manifestos = $candidate->manifestos()
            ->with('category')
            ->latest()
            ->get();

        return response()->json(['data' => $manifestos]);
    }

    public function store(Request $request, Candidate $candidate)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:election_manifesto_categories,id',
            'title' => 'required|string|max:255',
            'title_bn' => 'nullable|string|max:255',
            'description' => 'required|string',
            'description_bn' => 'nullable|string',
            'is_visible' => 'boolean',
        ]);

        $validated['tenant_id'] = $candidate->tenant_id;
        $validated['candidate_id'] = $candidate->id;
        $validated['is_visible'] = $validated['is_visible'] ?? true;

        $manifesto = ElectionManifesto::create($validated);
        $manifesto->load('category');

        return response()->json($manifesto, 201);
    }

    public function show(Candidate $candidate, $manifestoId)
    {
        try {
            // Find manifesto scoped to the candidate
            $manifesto = ElectionManifesto::where('id', $manifestoId)
                ->where('candidate_id', $candidate->id)
                ->firstOrFail();

            // Increment view count
            $manifesto->increment('views');
            
            // Refresh the model to get updated view count
            $manifesto->refresh();

            // Load relationships
            $manifesto->load('category');
            
            // Load comments (without user relationship for now to avoid potential issues)
            $manifesto->load('comments');
            
            return response()->json($manifesto);
        } catch (\Exception $e) {
            \Log::error('Error fetching manifesto details: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Failed to fetch manifesto details',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function update(Request $request, Candidate $candidate, $manifestoId)
    {
        // Find manifesto scoped to the candidate
        $manifesto = ElectionManifesto::where('id', $manifestoId)
            ->where('candidate_id', $candidate->id)
            ->firstOrFail();

        $validated = $request->validate([
            'category_id' => 'sometimes|required|exists:election_manifesto_categories,id',
            'title' => 'sometimes|required|string|max:255',
            'title_bn' => 'nullable|string|max:255',
            'description' => 'sometimes|required|string',
            'description_bn' => 'nullable|string',
            'is_visible' => 'boolean',
        ]);

        $manifesto->update($validated);
        $manifesto->load('category');

        return response()->json($manifesto);
    }

    public function destroy(Candidate $candidate, $manifestoId)
    {
        // Find manifesto scoped to the candidate
        $manifesto = ElectionManifesto::where('id', $manifestoId)
            ->where('candidate_id', $candidate->id)
            ->firstOrFail();

        $manifesto->delete();

        return response()->json(['message' => 'Manifesto deleted successfully']);
    }
}
