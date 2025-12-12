<?php

use App\Models\Candidate;
use Illuminate\Support\Facades\Route;
use Stancl\Tenancy\Database\Models\Domain;

// Public feedback form by candidate ID: /c/{id}/f
Route::get('/c/{candidate}/f', function (Candidate $candidate) {
    $candidate->load(['template', 'party', 'constituency', 'tenant']);
    $baseUrl = config('app.url') ?? url('/');
    $apiUrl = $baseUrl . '/api/v1/feedback/public';
    
    $templateService = app(\App\Services\TemplateService::class);
    $data = $templateService->prepareTemplateData($candidate, null, [
        'title' => 'Submit Feedback - ' . $candidate->name,
        'heading' => 'Submit Your Feedback',
        'description' => 'We value your feedback. Please share your thoughts, suggestions, or concerns.',
        'api_url' => $apiUrl,
    ]);
    
    return view('templates.minimal.layout', array_merge($data, [
        'pageView' => 'templates.minimal.pages.feedback-form',
    ]));
})->whereNumber('candidate')->name('candidate.feedback.form');

// QR code page by candidate slug: /c/{slug}/feedback
Route::get('/c/{slug}/feedback', function ($slug) {
    $candidate = Candidate::where('slug', $slug)
        ->with(['template', 'party', 'constituency', 'tenant'])
        ->firstOrFail();
    
    $baseUrl = config('app.url') ?? url('/');
    $feedbackUrl = $baseUrl . '/c/' . $candidate->id . '/f';
    $qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=' . urlencode($feedbackUrl);

    $templateService = app(\App\Services\TemplateService::class);
    $data = $templateService->prepareTemplateData($candidate, null, [
        'title' => 'Feedback QR Code - ' . $candidate->name,
        'heading' => 'Scan to Submit Feedback',
        'description' => 'Scan this QR code with your mobile device to submit feedback.',
        'qr_url' => $qrUrl,
        'feedback_url' => $feedbackUrl,
    ]);
    
    return view('templates.minimal.layout', array_merge($data, [
        'pageView' => 'templates.minimal.pages.feedback-qr',
    ]));
})->name('candidate.feedback.qr');

// Public donation form by candidate ID: /c/{id}/donate
Route::get('/c/{candidate}/donate', function (Candidate $candidate) {
    $candidate->load(['template', 'party', 'constituency', 'tenant']);
    $baseUrl = config('app.url') ?? url('/');
    $apiUrl = $baseUrl . '/api/v1/candidates/' . $candidate->id . '/donations/public';
    $settingsUrl = $baseUrl . '/api/v1/candidates/' . $candidate->id . '/donation-settings';
    
    $templateService = app(\App\Services\TemplateService::class);
    $data = $templateService->prepareTemplateData($candidate, null, [
        'title' => 'Make a Donation - ' . $candidate->name,
        'heading' => 'Make a Donation',
        'description' => 'Support our campaign by making a donation. Every contribution helps us make a difference.',
        'api_url' => $apiUrl,
        'settings_url' => $settingsUrl,
    ]);
    
    return view('templates.minimal.layout', array_merge($data, [
        'pageView' => 'templates.minimal.pages.donate-form',
    ]));
})->whereNumber('candidate')->name('candidate.donation.form');

// Donation QR code page by candidate slug: /c/{slug}/donation
Route::get('/c/{slug}/donation', function ($slug) {
    $candidate = Candidate::where('slug', $slug)
        ->with(['template', 'party', 'constituency', 'tenant'])
        ->firstOrFail();
    
    $baseUrl = config('app.url') ?? url('/');
    $donationUrl = $baseUrl . '/c/' . $candidate->id . '/donate';
    $qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=' . urlencode($donationUrl);

    $templateService = app(\App\Services\TemplateService::class);
    $data = $templateService->prepareTemplateData($candidate, null, [
        'title' => 'Donation QR Code - ' . $candidate->name,
        'heading' => 'Scan to Donate',
        'description' => 'Scan this QR code with your mobile device to make a donation.',
        'qr_url' => $qrUrl,
        'donation_url' => $donationUrl,
    ]);
    
    return view('templates.minimal.layout', array_merge($data, [
        'pageView' => 'templates.minimal.pages.donate-qr',
    ]));
})->name('candidate.donation.qr');

// Candidate landing page route - /c/{slug}
Route::get('/c/{slug}', function ($slug) {
    $candidate = Candidate::where('slug', $slug)
        ->with(['template', 'party', 'constituency', 'tenant'])
        ->firstOrFail();

    $templateService = app(\App\Services\TemplateService::class);
    
    try {
        $data = $templateService->prepareTemplateData($candidate, null, [
            'title' => $candidate->name . ' - Political Campaign',
        ]);
        
        return view('templates.minimal.layout', array_merge($data, [
            'pageView' => 'templates.minimal.pages.home',
        ]));
    } catch (\Exception $e) {
        // Fallback to default view if template rendering fails
        return view('candidate.landing', compact('candidate'));
    }
})->name('candidate.landing');
