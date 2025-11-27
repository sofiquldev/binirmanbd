<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Constituency;
use App\Models\District;
use Illuminate\Http\Request;

class ConstituencyController extends Controller
{
    public function index(Request $request)
    {
        $constituencies = Constituency::with('district')
            ->latest()
            ->when($request->has('district_id'), fn ($q) => $q->where('district_id', $request->district_id))
            ->when($request->has('is_active'), fn ($q) => $q->where('is_active', $request->is_active))
            ->paginate($request->get('per_page', 15));

        return response()->json($constituencies);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_bn' => 'nullable|string|max:255',
            'slug' => 'required|string|max:255|unique:constituencies,slug',
            'district_id' => 'nullable|exists:districts,id',
            'district_slug' => 'nullable|string|max:255',
            'population' => 'nullable|integer',
            'about' => 'nullable|string',
            'about_bn' => 'nullable|string',
            'history' => 'nullable|string',
            'history_bn' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        // Map district_slug to district_id if provided (allows static frontend list)
        if ($request->filled('district_slug')) {
            $district = District::where('slug', $request->district_slug)->first();
            $validated['district_id'] = $district?->id;
        }

        $validated['is_active'] = $request->has('is_active') ? (bool) $request->is_active : true;

        $constituency = Constituency::create($validated);

        return response()->json($constituency, 201);
    }

    public function show(Constituency $constituency)
    {
        $constituency->load(['district', 'candidates']);
        return response()->json($constituency);
    }

    public function update(Request $request, Constituency $constituency)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'name_bn' => 'nullable|string|max:255',
            'slug' => 'sometimes|required|string|max:255|unique:constituencies,slug,' . $constituency->id,
            'district_id' => 'nullable|exists:districts,id',
            'district_slug' => 'nullable|string|max:255',
            'population' => 'nullable|integer',
            'about' => 'nullable|string',
            'about_bn' => 'nullable|string',
            'history' => 'nullable|string',
            'history_bn' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        // Map district_slug to district_id if provided
        if ($request->filled('district_slug')) {
            $district = District::where('slug', $request->district_slug)->first();
            $validated['district_id'] = $district?->id;
        }

        if ($request->has('is_active')) {
            $validated['is_active'] = (bool)$request->is_active;
        }

        $constituency->update($validated);

        return response()->json($constituency);
    }

    public function destroy(Constituency $constituency)
    {
        $constituency->delete();

        return response()->json(['message' => 'Constituency deleted successfully']);
    }
}
