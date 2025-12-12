<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Candidate;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class TestimonialController extends Controller
{
    public function index(Candidate $candidate)
    {
        $testimonials = $candidate->testimonials()
            ->latest()
            ->get();

        return response()->json(['data' => $testimonials]);
    }

    public function upload(Request $request, Candidate $candidate)
    {
        if (!$request->hasFile('file')) {
            return response()->json([
                'message' => 'No file received.',
            ], 422);
        }

        $validated = $request->validate([
            'file' => 'required|file|image|max:5120', // up to ~5MB
        ]);

        $file = $request->file('file');

        if (!$file || !$file->isValid()) {
            return response()->json([
                'message' => 'Upload failed: invalid file.',
            ], 422);
        }

        try {
            $extension = $file->getClientOriginalExtension() ?: $file->guessExtension() ?: 'bin';
            $filename = uniqid('testimonial_', true) . '.' . $extension;
            $path = 'uploads/testimonials/' . $filename;

            $rawPath = $file->getRealPath() ?: $file->getPathname();
            if (!$rawPath || !is_file($rawPath)) {
                throw new \RuntimeException('No temporary file path available');
            }

            Storage::disk('public')->put($path, file_get_contents($rawPath));

            $url = Storage::disk('public')->url($path);

            return response()->json([
                'url' => $url,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Upload failed. Please try again.',
            ], 500);
        }
    }

    public function store(Request $request, Candidate $candidate)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'author_name_bn' => 'nullable|string|max:255',
            'designation' => 'nullable|string|max:255',
            'author_designation_bn' => 'nullable|string|max:255',
            'quote' => 'required|string',
            'content_bn' => 'nullable|string',
            'photo_url' => 'nullable',
            'avatar_url' => 'nullable',
            'is_featured' => 'boolean',
        ]);

        $validated['tenant_id'] = $candidate->tenant_id;
        $validated['candidate_id'] = $candidate->id;
        $validated['is_featured'] = $validated['is_featured'] ?? false;

        // Handle file uploads (if files are sent directly)
        if ($request->hasFile('photo_url')) {
            $file = $request->file('photo_url');
            $extension = $file->getClientOriginalExtension() ?: $file->guessExtension() ?: 'bin';
            $filename = uniqid('testimonial_', true) . '.' . $extension;
            $path = 'uploads/testimonials/' . $filename;
            
            $rawPath = $file->getRealPath() ?: $file->getPathname();
            if ($rawPath && is_file($rawPath)) {
                Storage::disk('public')->put($path, file_get_contents($rawPath));
                $validated['photo_url'] = Storage::disk('public')->url($path);
            }
        } elseif ($request->filled('photo_url') && is_string($request->input('photo_url'))) {
            // URL already uploaded via upload endpoint
            $validated['photo_url'] = $request->input('photo_url');
        } else {
            $validated['photo_url'] = null;
        }

        if ($request->hasFile('avatar_url')) {
            $file = $request->file('avatar_url');
            $path = $this->storeResizedAvatar($file);
            if ($path) {
                $validated['avatar_url'] = Storage::disk('public')->url($path);
            }
        } elseif ($request->filled('avatar_url') && is_string($request->input('avatar_url'))) {
            // URL already uploaded via upload endpoint
            $validated['avatar_url'] = $request->input('avatar_url');
        } else {
            $validated['avatar_url'] = null;
        }

        $testimonial = Testimonial::create($validated);

        return response()->json($testimonial, 201);
    }

    public function show(Candidate $candidate, $testimonialId)
    {
        $testimonial = Testimonial::where('id', $testimonialId)
            ->where('candidate_id', $candidate->id)
            ->firstOrFail();

        return response()->json($testimonial);
    }

    public function update(Request $request, Candidate $candidate, $testimonialId)
    {
        $testimonial = Testimonial::where('id', $testimonialId)
            ->where('candidate_id', $candidate->id)
            ->firstOrFail();

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'author_name_bn' => 'nullable|string|max:255',
            'designation' => 'nullable|string|max:255',
            'author_designation_bn' => 'nullable|string|max:255',
            'quote' => 'sometimes|required|string',
            'content_bn' => 'nullable|string',
            'photo_url' => 'nullable',
            'avatar_url' => 'nullable',
            'is_featured' => 'boolean',
        ]);

        // Handle file uploads (if files are sent directly)
        if ($request->hasFile('photo_url')) {
            // Delete old photo if exists
            if ($testimonial->photo_url) {
                $oldPath = str_replace(Storage::disk('public')->url(''), '', $testimonial->photo_url);
                Storage::disk('public')->delete($oldPath);
            }
            
            $file = $request->file('photo_url');
            $extension = $file->getClientOriginalExtension() ?: $file->guessExtension() ?: 'bin';
            $filename = uniqid('testimonial_', true) . '.' . $extension;
            $path = 'uploads/testimonials/' . $filename;
            
            $rawPath = $file->getRealPath() ?: $file->getPathname();
            if ($rawPath && is_file($rawPath)) {
                Storage::disk('public')->put($path, file_get_contents($rawPath));
                $validated['photo_url'] = Storage::disk('public')->url($path);
            }
        } elseif ($request->filled('photo_url') && is_string($request->input('photo_url'))) {
            // URL already uploaded via upload endpoint
            // Only delete old file if URL changed
            if ($testimonial->photo_url && $testimonial->photo_url !== $request->input('photo_url')) {
                $oldPath = str_replace(Storage::disk('public')->url(''), '', $testimonial->photo_url);
                Storage::disk('public')->delete($oldPath);
            }
            $validated['photo_url'] = $request->input('photo_url');
        } elseif ($request->has('photo_url') && empty($request->input('photo_url'))) {
            // Explicitly clearing the photo
            if ($testimonial->photo_url) {
                $oldPath = str_replace(Storage::disk('public')->url(''), '', $testimonial->photo_url);
                Storage::disk('public')->delete($oldPath);
            }
            $validated['photo_url'] = null;
        }

        if ($request->hasFile('avatar_url')) {
            // Delete old avatar if exists
            if ($testimonial->avatar_url) {
                $oldPath = str_replace(Storage::disk('public')->url(''), '', $testimonial->avatar_url);
                Storage::disk('public')->delete($oldPath);
            }
            
            $file = $request->file('avatar_url');
            $path = $this->storeResizedAvatar($file);
            if ($path) {
                $validated['avatar_url'] = Storage::disk('public')->url($path);
            }
        } elseif ($request->filled('avatar_url') && is_string($request->input('avatar_url'))) {
            // URL already uploaded via upload endpoint
            // Only delete old file if URL changed
            if ($testimonial->avatar_url && $testimonial->avatar_url !== $request->input('avatar_url')) {
                $oldPath = str_replace(Storage::disk('public')->url(''), '', $testimonial->avatar_url);
                Storage::disk('public')->delete($oldPath);
            }
            $validated['avatar_url'] = $request->input('avatar_url');
        } elseif ($request->has('avatar_url') && empty($request->input('avatar_url'))) {
            // Explicitly clearing the avatar
            if ($testimonial->avatar_url) {
                $oldPath = str_replace(Storage::disk('public')->url(''), '', $testimonial->avatar_url);
                Storage::disk('public')->delete($oldPath);
            }
            $validated['avatar_url'] = null;
        }

        $testimonial->update($validated);

        return response()->json($testimonial);
    }

    public function destroy(Candidate $candidate, $testimonialId)
    {
        $testimonial = Testimonial::where('id', $testimonialId)
            ->where('candidate_id', $candidate->id)
            ->firstOrFail();

        // Delete associated files
        if ($testimonial->photo_url) {
            $oldPath = str_replace(Storage::disk('public')->url(''), '', $testimonial->photo_url);
            Storage::disk('public')->delete($oldPath);
        }
        if ($testimonial->avatar_url) {
            $oldPath = str_replace(Storage::disk('public')->url(''), '', $testimonial->avatar_url);
            Storage::disk('public')->delete($oldPath);
        }

        $testimonial->delete();

        return response()->json(['message' => 'Testimonial deleted successfully']);
    }

    /**
     * Resize avatar to 80x80 and store to public disk.
     */
    private function storeResizedAvatar(UploadedFile $file): ?string
    {
        $rawPath = $file->getRealPath() ?: $file->getPathname();
        if (!$rawPath || !is_file($rawPath)) {
            return null;
        }

        $imageData = file_get_contents($rawPath);
        if ($imageData === false) {
            return null;
        }

        $source = @imagecreatefromstring($imageData);
        if ($source === false) {
            return null;
        }

        $width = imagesx($source);
        $height = imagesy($source);

        $size = min($width, $height);
        $x = (int) max(0, ($width - $size) / 2);
        $y = (int) max(0, ($height - $size) / 2);

        $cropped = imagecrop($source, ['x' => $x, 'y' => $y, 'width' => $size, 'height' => $size]);
        if ($cropped === false) {
            imagedestroy($source);
            return null;
        }

        $target = imagecreatetruecolor(80, 80);
        imagealphablending($target, false);
        imagesavealpha($target, true);

        if (!imagecopyresampled($target, $cropped, 0, 0, 0, 0, 80, 80, $size, $size)) {
            imagedestroy($source);
            imagedestroy($cropped);
            imagedestroy($target);
            return null;
        }

        ob_start();
        imagepng($target);
        $pngData = ob_get_clean();

        imagedestroy($source);
        imagedestroy($cropped);
        imagedestroy($target);

        if (!$pngData) {
            return null;
        }

        $filename = uniqid('testimonial_avatar_', true) . '.png';
        $path = 'uploads/testimonials/' . $filename;
        Storage::disk('public')->put($path, $pngData);

        return $path;
    }
}

