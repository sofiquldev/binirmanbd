<?php

use App\Models\Candidate;
use Illuminate\Support\Facades\Route;

// Candidate landing page route - /c/{slug}
Route::get('/c/{slug}', function ($slug) {
    $candidate = Candidate::where('slug', $slug)
        ->with(['template', 'party', 'constituency', 'tenant'])
        ->firstOrFail();
    
    return view('candidate.landing', compact('candidate'));
})->name('candidate.landing');
