<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Constituency;
use Illuminate\Http\Request;

class ConstituencyController extends Controller
{
    public function index(Request $request)
    {
        $constituencies = Constituency::latest()
            ->when($request->has('is_active'), fn($q) => $q->where('is_active', $request->is_active))
            ->paginate($request->get('per_page', 15));

        return response()->json($constituencies);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_bn' => 'nullable|string|max:255',
            'slug' => 'required|string|max:255|unique:constituencies,slug',
            'district' => 'nullable|string|max:255',
            'district_bn' => 'nullable|string|max:255',
            'population' => 'nullable|integer',
            'about' => 'nullable|string',
            'about_bn' => 'nullable|string',
            'history' => 'nullable|string',
            'history_bn' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $validated['is_active'] = $request->has('is_active') ? (bool)$request->is_active : true;

        $constituency = Constituency::create($validated);

        return response()->json($constituency, 201);
    }

    public function show(Constituency $constituency)
    {
        $constituency->load('candidates');
        return response()->json($constituency);
    }

    public function update(Request $request, Constituency $constituency)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'name_bn' => 'nullable|string|max:255',
            'slug' => 'sometimes|required|string|max:255|unique:constituencies,slug,' . $constituency->id,
            'district' => 'nullable|string|max:255',
            'district_bn' => 'nullable|string|max:255',
            'population' => 'nullable|integer',
            'about' => 'nullable|string',
            'about_bn' => 'nullable|string',
            'history' => 'nullable|string',
            'history_bn' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

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
