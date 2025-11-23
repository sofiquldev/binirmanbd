<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Template;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TemplateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Template::query();

        // Filter active only
        if ($request->has('active_only') && $request->boolean('active_only')) {
            $query->where('is_active', true);
        }

        // Search
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $templates = $query->latest()
            ->paginate($request->get('per_page', 15));

        return response()->json($templates);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:templates,slug',
            'description' => 'nullable|string|max:500',
            'preview_image' => 'nullable|image|max:2048',
            'is_active' => 'sometimes|boolean',
        ]);

        // Handle preview image upload
        if ($request->hasFile('preview_image')) {
            $imagePath = $request->file('preview_image')->store('templates', 'public');
            $validated['preview_image'] = Storage::disk('public')->url($imagePath);
        }

        $template = Template::create($validated);

        return response()->json($template, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $template = Template::findOrFail($id);
        return response()->json($template);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $template = Template::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'slug' => ['sometimes', 'required', 'string', 'max:255', \Illuminate\Validation\Rule::unique('templates')->ignore($template->id)],
            'description' => 'nullable|string|max:500',
            'preview_image' => 'nullable|image|max:2048',
            'is_active' => 'sometimes|boolean',
        ]);

        // Handle preview image upload
        if ($request->hasFile('preview_image')) {
            // Delete old image if exists
            if ($template->preview_image) {
                $oldPath = str_replace('/storage/', '', parse_url($template->preview_image, PHP_URL_PATH));
                Storage::disk('public')->delete($oldPath);
            }

            $imagePath = $request->file('preview_image')->store('templates', 'public');
            $validated['preview_image'] = Storage::disk('public')->url($imagePath);
        }

        $template->update($validated);

        return response()->json($template);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $template = Template::findOrFail($id);

        // Check if template is being used by any candidates
        if ($template->candidates()->count() > 0) {
            return response()->json([
                'error' => 'Cannot delete template that is assigned to candidates.'
            ], 422);
        }

        // Delete preview image if exists
        if ($template->preview_image) {
            $oldPath = str_replace('/storage/', '', parse_url($template->preview_image, PHP_URL_PATH));
            Storage::disk('public')->delete($oldPath);
        }

        $template->delete();

        return response()->json(['message' => 'Template deleted successfully']);
    }
}
