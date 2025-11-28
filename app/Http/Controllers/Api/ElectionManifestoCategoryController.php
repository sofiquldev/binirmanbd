<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ElectionManifestoCategory;
use Illuminate\Http\Request;

class ElectionManifestoCategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = ElectionManifestoCategory::withCount('manifestos');

        // Filter by active status if provided
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $categories = $query
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return response()->json(['data' => $categories]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_bn' => 'nullable|string|max:255',
            'slug' => 'required|string|max:255|unique:election_manifesto_categories,slug',
            'description' => 'nullable|string',
            'description_bn' => 'nullable|string',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $validated['is_active'] = $validated['is_active'] ?? true;
        $validated['sort_order'] = $validated['sort_order'] ?? 0;

        $category = ElectionManifestoCategory::create($validated);

        return response()->json($category, 201);
    }

    public function show(ElectionManifestoCategory $category)
    {
        return response()->json($category);
    }

    public function update(Request $request, ElectionManifestoCategory $category)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'name_bn' => 'nullable|string|max:255',
            'slug' => 'sometimes|required|string|max:255|unique:election_manifesto_categories,slug,' . $category->id,
            'description' => 'nullable|string',
            'description_bn' => 'nullable|string',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $category->update($validated);

        return response()->json($category);
    }

    public function destroy(ElectionManifestoCategory $category)
    {
        // Check if category has manifestos
        if ($category->manifestos()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete category with existing manifestos',
            ], 422);
        }

        $category->delete();

        return response()->json(['message' => 'Category deleted successfully']);
    }
}
