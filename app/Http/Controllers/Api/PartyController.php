<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Party;
use Illuminate\Http\Request;

class PartyController extends Controller
{
    public function index(Request $request)
    {
        $parties = Party::latest()
            ->when($request->has('is_active'), fn($q) => $q->where('is_active', $request->is_active))
            ->paginate($request->get('per_page', 15));

        return response()->json($parties);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_bn' => 'nullable|string|max:255',
            'slug' => 'required|string|max:255|unique:parties,slug',
            'logo' => 'nullable|image|max:2048',
            'about' => 'nullable|string',
            'about_bn' => 'nullable|string',
            'history' => 'nullable|string',
            'history_bn' => 'nullable|string',
            'website' => 'nullable|url|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('parties', 'public');
            $validated['logo'] = \Illuminate\Support\Facades\Storage::disk('public')->url($logoPath);
        }

        $validated['is_active'] = $request->has('is_active') ? (bool)$request->is_active : true;

        $party = Party::create($validated);

        return response()->json($party, 201);
    }

    public function show(Party $party)
    {
        $party->load('candidates');
        return response()->json($party);
    }

    public function update(Request $request, Party $party)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'name_bn' => 'nullable|string|max:255',
            'slug' => 'sometimes|required|string|max:255|unique:parties,slug,' . $party->id,
            'logo' => 'nullable|image|max:2048',
            'about' => 'nullable|string',
            'about_bn' => 'nullable|string',
            'history' => 'nullable|string',
            'history_bn' => 'nullable|string',
            'website' => 'nullable|url|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('logo')) {
            if ($party->logo) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete(str_replace('/storage/', '', $party->logo));
            }
            $logoPath = $request->file('logo')->store('parties', 'public');
            $validated['logo'] = \Illuminate\Support\Facades\Storage::disk('public')->url($logoPath);
        } else {
            unset($validated['logo']);
        }

        if ($request->has('is_active')) {
            $validated['is_active'] = (bool)$request->is_active;
        }

        $party->update($validated);

        return response()->json($party);
    }

    public function destroy(Party $party)
    {
        if ($party->logo) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete(str_replace('/storage/', '', $party->logo));
        }

        $party->delete();

        return response()->json(['message' => 'Party deleted successfully']);
    }
}
