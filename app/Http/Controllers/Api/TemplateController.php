<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Template;
use App\Services\TemplateService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class TemplateController extends Controller
{
    protected TemplateService $templateService;

    public function __construct(TemplateService $templateService)
    {
        $this->templateService = $templateService;
    }

    /**
     * Get all available templates
     * Returns templates from database (active templates only)
     */
    public function index()
    {
        $templates = Template::where('is_active', true)
            ->orderBy('name')
            ->get()
            ->map(function ($template) {
                return [
                    'id' => $template->id,
                    'name' => $template->name,
                    'slug' => $template->slug,
                    'description' => $template->description,
                    'preview_image' => $template->preview_image,
                    'is_active' => $template->is_active,
                ];
            });
        
        return response()->json([
            'data' => $templates,
        ]);
    }

    /**
     * Upload and install template from ZIP
     */
    public function upload(Request $request)
    {
        $request->validate([
            'template_zip' => 'required|file|mimes:zip|max:10240', // 10MB max
            'slug' => 'nullable|string|max:255',
        ]);

        $file = $request->file('template_zip');
        $templateSlug = $request->input('slug') ?? Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME));

        // Store uploaded file temporarily
        $tempPath = $file->storeAs('temp', $file->getClientOriginalName(), 'local');

        try {
            $fullPath = storage_path('app/' . $tempPath);
            $this->templateService->installTemplateFromZip($fullPath, $templateSlug);
            
            // Delete temporary file
            Storage::disk('local')->delete($tempPath);

            return response()->json([
                'message' => 'Template installed successfully',
                'data' => [
                    'slug' => $templateSlug,
                ],
            ]);
        } catch (\Exception $e) {
            // Delete temporary file on error
            Storage::disk('local')->delete($tempPath);
            
            return response()->json([
                'message' => 'Failed to install template: ' . $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Get template configuration
     */
    public function show(string $slug)
    {
        $config = $this->templateService->getTemplateConfig($slug);
        
        if (!$config) {
            return response()->json([
                'message' => 'Template not found',
            ], 404);
        }

        return response()->json([
            'data' => $config,
        ]);
    }
}
