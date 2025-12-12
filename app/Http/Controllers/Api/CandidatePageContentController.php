<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Candidate;
use App\Models\CandidatePageContent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class CandidatePageContentController extends Controller
{
    public function show(Candidate $candidate)
    {
        $content = $candidate->pageContent;

        return response()->json([
            'data' => $content,
        ]);
    }

    public function upload(Request $request, Candidate $candidate)
    {
        Log::info('Page content upload request received', [
            'candidate_id' => $candidate->id,
            'has_file' => $request->hasFile('file'),
            'files' => array_keys($request->allFiles()),
        ]);

        if (!$request->hasFile('file')) {
            return response()->json([
                'message' => 'No file received.',
            ], 422);
        }

        $validated = $request->validate([
            'file' => 'required|file|image|max:20480', // up to ~20MB
        ]);

        $file = $request->file('file');

        if (!$file || !$file->isValid()) {
            Log::warning('Page content upload rejected: invalid file', [
                'candidate_id' => $candidate->id,
                'name' => $file?->getClientOriginalName(),
                'size' => $file?->getSize(),
                'path' => $file?->getRealPath(),
            ]);
            return response()->json([
                'message' => 'Upload failed: invalid file.',
            ], 422);
        }

        try {
            $extension = $file->getClientOriginalExtension() ?: $file->guessExtension() ?: 'bin';
            $filename = uniqid('page-content_', true) . '.' . $extension;
            $path = 'uploads/page-content/' . $filename;

            $rawPath = $file->getRealPath() ?: $file->getPathname();
            if (!$rawPath || !is_file($rawPath)) {
                throw new \RuntimeException('No temporary file path available');
            }

            Storage::disk('public')->put($path, file_get_contents($rawPath));

            $url = Storage::disk('public')->url($path);

            Log::info('Page content upload stored', [
                'candidate_id' => $candidate->id,
                'name' => $file->getClientOriginalName(),
                'size' => $file->getSize(),
                'url' => $url,
                'path' => $path,
            ]);

            return response()->json([
                'url' => $url,
            ]);
        } catch (\Throwable $e) {
            Log::error('Page content upload failed to store', [
                'candidate_id' => $candidate->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'message' => 'Upload failed. Please try again.',
            ], 500);
        }
    }

    public function upsert(Request $request, Candidate $candidate)
    {
        // When sent as multipart/form-data, funfacts arrives as a JSON string.
        // Decode it so the array validation rules can pass.
        if ($request->has('funfacts') && is_string($request->input('funfacts'))) {
            $decoded = json_decode($request->input('funfacts'), true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $request->merge(['funfacts' => $decoded]);
            }
        }

        $uploadFields = [
            'hero_photo' => 5120,
            'about_photo' => 5120,
            'signature_photo' => 2048,
            'brand_logo' => 2048,
            'footer_banner' => 6144,
            'video_thumb' => 4096,
        ];

        $rules = [
            'mission' => 'nullable|string',
            'vision' => 'nullable|string',
            'funfacts' => 'nullable|array',
            'funfacts.*.title' => 'nullable|string|max:255',
            'funfacts.*.number' => 'nullable|string|max:255',
            'funfacts.*.suffix' => 'nullable|string|max:50',
            'video_url' => 'nullable|string|max:500',
            'privacy_policy' => 'nullable|string',
            'about_us' => 'nullable|string',
            'custom_css' => 'nullable|string',
            'custom_js' => 'nullable|string',
        ];

        foreach ($uploadFields as $field => $maxSize) {
            if ($request->hasFile($field)) {
                $rules[$field] = "nullable|image|max:{$maxSize}";
            } elseif ($request->filled($field) && is_string($request->input($field))) {
                $rules[$field] = 'nullable|string|max:500';
            } else {
                $rules[$field] = 'nullable';
            }
        }

        $validated = $request->validate($rules);

        $uploads = array_keys($uploadFields);

        foreach ($uploads as $field) {
            if ($request->hasFile($field)) {
                $file = $request->file($field);

                // Skip invalid uploads to avoid empty temp paths from PHP upload errors.
                if (
                    !$file ||
                    !$file->isValid() ||
                    empty($file->getPathname()) ||
                    empty($file->getRealPath())
                ) {
                    // Ignore invalid upload instead of failing the whole request.
                    unset($validated[$field]);
                    continue;
                }

                try {
                    $path = $file->store('uploads/page-content', 'public');
                    $validated[$field] = Storage::disk('public')->url($path);
                } catch (\Throwable $e) {
                    // If filesystem errors (e.g., empty temp path), skip this file only.
                    unset($validated[$field]);
                    continue;
                }
            } else {
                // If the field is a string path (already uploaded), keep it; otherwise remove.
                if (!($request->filled($field) && is_string($request->input($field)))) {
                    unset($validated[$field]);
                }
            }
        }

        $content = $candidate->pageContent;
        $payload = array_merge(
            $validated,
            ['tenant_id' => $candidate->tenant_id]
        );

        if (!$content) {
            $content = new CandidatePageContent();
            $content->candidate_id = $candidate->id;
        }

        $content->fill($payload);
        $content->save();

        return response()->json([
            'message' => 'Page content saved',
            'data' => $content,
        ]);
    }
}

