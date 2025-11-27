<?php

use App\Models\Candidate;
use Illuminate\Support\Facades\Route;
use Stancl\Tenancy\Database\Models\Domain;

// Public feedback form by candidate ID: /c/{id}/f
Route::get('/c/{candidate}/f', function (Candidate $candidate) {
    $candidate->load(['party', 'constituency.district']);
    return view('candidate.feedback-form', [
        'candidate' => $candidate,
    ]);
})->whereNumber('candidate')->name('candidate.feedback.form');

// QR code page by candidate slug: /c/{slug}/feedback
Route::get('/c/{slug}/feedback', function ($slug) {
    $candidate = Candidate::where('slug', $slug)
        ->with(['party', 'constituency.district'])
        ->firstOrFail();
    
    $baseUrl = config('app.url') ?? url('/');
    $feedbackUrl = $baseUrl . '/c/' . $candidate->id . '/f';

    return view('candidate.feedback-qr', [
        'candidate' => $candidate,
        'feedbackUrl' => $feedbackUrl,
    ]);
})->name('candidate.feedback.qr');

// Candidate landing page route - /c/{slug}
Route::get('/c/{slug}', function ($slug) {
    $candidate = Candidate::where('slug', $slug)
        ->with(['template', 'party', 'constituency', 'tenant'])
        ->firstOrFail();

    return view('candidate.landing', compact('candidate'));
})->name('candidate.landing');
