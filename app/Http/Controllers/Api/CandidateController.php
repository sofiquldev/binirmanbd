<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Candidate;
use App\Models\Constituency;
use App\Models\Party;
use App\Models\Template;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Stancl\Tenancy\Database\Models\Domain;
use Stancl\Tenancy\Database\Models\Tenant;

class CandidateController extends Controller
{
    public function index(Request $request)
    {
        $query = Candidate::with(['template', 'tenant', 'party', 'constituency']);

        // Apply search filter
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('name_bn', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        // Apply party filter
        if ($request->filled('party_id')) {
            $query->where('party_id', $request->integer('party_id'));
        }

        // Apply constituency filter
        if ($request->filled('constituency_id')) {
            $query->where('constituency_id', $request->integer('constituency_id'));
        }

        $candidates = $query->latest()->paginate($request->get('per_page', 15));

        return response()->json($candidates);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_bn' => 'nullable|string|max:255',
            'slug' => 'required|string|max:255|unique:candidates,slug',
            'image' => 'nullable|image|max:2048',
            'constituency_id' => 'nullable|exists:constituencies,id',
            'party_id' => 'nullable|exists:parties,id',
            'template_id' => 'nullable|exists:templates,id',
            'about' => 'nullable|string',
            'about_bn' => 'nullable|string',
            'history' => 'nullable|string',
            'history_bn' => 'nullable|string',
            'campaign_slogan' => 'nullable|string|max:255',
            'campaign_slogan_bn' => 'nullable|string|max:255',
            'campaign_goals' => 'nullable|string',
            'campaign_goals_bn' => 'nullable|string',
            'primary_domain' => 'nullable|string|max:255',
            'custom_domain' => 'nullable|string|max:255',
            'whatsapp_number' => 'nullable|string|max:255',
            'default_locale' => 'nullable|string|in:bn,en',
            'supported_languages' => 'nullable|array',
            'supported_languages.*' => 'in:bn,en',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('candidates', 'public');
            $validated['image'] = Storage::disk('public')->url($imagePath);
        }

        // Create tenant
        $tenantId = 'tenant-' . (Candidate::count() + 1);
        $tenant = Tenant::firstOrCreate(
            ['id' => $tenantId],
            ['id' => $tenantId]
        );

        // Create domain if provided
        if (!empty($validated['primary_domain'])) {
            Domain::firstOrCreate(
                ['domain' => $validated['primary_domain']],
                [
                    'domain' => $validated['primary_domain'],
                    'tenant_id' => $tenant->id,
                ]
            );
        }

        $validated['tenant_id'] = $tenant->id;
        $candidate = Candidate::create($validated);
        $candidate->load(['template', 'party', 'constituency', 'tenant']);

        return response()->json($candidate, 201);
    }

    public function show(Candidate $candidate)
    {
        $candidate->load(['template', 'party', 'constituency', 'donations', 'contactMessages', 'events', 'appointments', 'manifestos.category', 'users']);
        return response()->json($candidate);
    }

    public function update(Request $request, Candidate $candidate)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'name_bn' => 'nullable|string|max:255',
            'slug' => 'sometimes|required|string|max:255|unique:candidates,slug,' . $candidate->id,
            'image' => 'nullable|image|max:2048',
            'constituency_id' => 'nullable|exists:constituencies,id',
            'party_id' => 'nullable|exists:parties,id',
            'template_id' => 'nullable|exists:templates,id',
            'about' => 'nullable|string',
            'about_bn' => 'nullable|string',
            'history' => 'nullable|string',
            'history_bn' => 'nullable|string',
            'campaign_slogan' => 'nullable|string|max:255',
            'campaign_slogan_bn' => 'nullable|string|max:255',
            'campaign_goals' => 'nullable|string',
            'campaign_goals_bn' => 'nullable|string',
            'primary_domain' => 'nullable|string|max:255',
            'custom_domain' => 'nullable|string|max:255',
            'whatsapp_number' => 'nullable|string|max:255',
            'default_locale' => 'nullable|string|in:bn,en',
            'supported_languages' => 'nullable|array',
            'supported_languages.*' => 'in:bn,en',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($candidate->image) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $candidate->image));
            }
            $imagePath = $request->file('image')->store('candidates', 'public');
            $validated['image'] = Storage::disk('public')->url($imagePath);
        } else {
            unset($validated['image']);
        }

        $candidate->update($validated);
        $candidate->load(['template', 'party', 'constituency']);

        return response()->json($candidate);
    }

    public function destroy(Candidate $candidate)
    {
        // Delete image if exists
        if ($candidate->image) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $candidate->image));
        }

        $candidate->delete();

        return response()->json(['message' => 'Candidate deleted successfully']);
    }

    public function donations(Candidate $candidate)
    {
        $donations = $candidate->donations()->latest()->paginate(15);
        return response()->json($donations);
    }

    public function feedback(Candidate $candidate)
    {
        $feedback = $candidate->contactMessages()->latest()->paginate(15);
        return response()->json($feedback);
    }

    public function events(Candidate $candidate)
    {
        $events = $candidate->events()->latest()->paginate(15);
        return response()->json($events);
    }

    public function activity(Candidate $candidate)
    {
        // Activity log implementation
        return response()->json(['message' => 'Activity log endpoint']);
    }

    public function checkSlugAvailability(Request $request)
    {
        $request->validate([
            'slug' => 'required|string|max:255',
        ]);

        $slug = $request->input('slug');
        $exists = Candidate::where('slug', $slug)->exists();

        return response()->json([
            'available' => !$exists,
            'slug' => $slug,
        ]);
    }

    /**
     * Sync users assigned to a candidate
     */
    public function syncUsers(Request $request, Candidate $candidate)
    {
        $validated = $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
        ]);

        $candidate->users()->sync($validated['user_ids']);

        $candidate->load('users');

        return response()->json([
            'message' => 'Users assigned successfully',
            'candidate' => $candidate,
        ]);
    }

    /**
     * Get all candidates assigned to the authenticated user
     */
    public function myCandidates(Request $request)
    {
        $user = $request->user();
        
        // Get candidates from both relationships (backward compatibility + many-to-many)
        $candidates = collect();
        
        // From many-to-many relationship
        if ($user->candidates) {
            $candidates = $candidates->merge($user->candidates);
        }
        
        // From single candidate_id (backward compatibility)
        if ($user->candidate) {
            $candidates = $candidates->push($user->candidate);
        }
        
        // Remove duplicates by ID
        $candidates = $candidates->unique('id')->values();

        return response()->json([
            'data' => $candidates,
        ]);
    }
}
