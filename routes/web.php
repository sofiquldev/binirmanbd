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

// Public donation form by candidate ID: /c/{id}/donate
Route::get('/c/{candidate}/donate', function (Candidate $candidate) {
    $candidate->load(['party', 'constituency.district']);
    $baseUrl = config('app.url') ?? url('/');
    
    return view('candidate.donation-form', [
        'candidate' => $candidate,
        'baseUrl' => $baseUrl,
    ]);
})->whereNumber('candidate')->name('candidate.donation.form');

// Donation QR code page by candidate slug: /c/{slug}/donation
Route::get('/c/{slug}/donation', function ($slug) {
    $candidate = Candidate::where('slug', $slug)
        ->with(['party', 'constituency.district'])
        ->firstOrFail();
    
    $baseUrl = config('app.url') ?? url('/');
    $donationUrl = $baseUrl . '/c/' . $candidate->id . '/donate';

    return view('candidate.donation-qr', [
        'candidate' => $candidate,
        'donationUrl' => $donationUrl,
        'baseUrl' => $baseUrl,
    ]);
})->name('candidate.donation.qr');

// Candidate landing page route - /c/{slug}
Route::get('/c/{slug}', function ($slug) {
    $candidate = Candidate::where('slug', $slug)
        ->with(['template', 'party', 'constituency', 'tenant'])
        ->firstOrFail();

    $templateService = app(\App\Services\TemplateService::class);
    
    try {
        $html = $templateService->renderTemplate($candidate);
        return response($html)->header('Content-Type', 'text/html');
    } catch (\Exception $e) {
        // Fallback to default view if template rendering fails
        return view('candidate.landing', compact('candidate'));
    }
})->name('candidate.landing');
