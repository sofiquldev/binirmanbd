<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CandidateController;
use App\Http\Controllers\Api\ConstituencyController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DonationController;
use App\Http\Controllers\Api\DistrictController;
use App\Http\Controllers\Api\FeedbackController;
use App\Http\Controllers\Api\FeedbackAdminController;
use App\Http\Controllers\Api\FeedController;
use App\Http\Controllers\Api\PartyController;
use App\Http\Controllers\Api\TemplateController;
use App\Http\Controllers\Api\UserController;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Stancl\Tenancy\Middleware\InitializeTenancyByRequestData;

// Public API routes
Route::prefix('v1')->group(function () {
    Route::get('/health', fn () => ['status' => 'ok', 'timestamp' => now()->toIso8601String()]);

    // Authentication routes
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('/auth/me', [AuthController::class, 'me'])->middleware('auth:sanctum');

    // Public feedback submission (by candidate ID, no tenancy required)
    Route::post('/feedback/public', [FeedbackController::class, 'storePublic']);

    // Tenant-specific public routes
    Route::middleware([InitializeTenancyByRequestData::class])->group(function () {
        // Public donation submission (by candidate ID/slug) - No authentication required
        Route::post('/candidates/{candidate}/donations/public', [DonationController::class, 'storePublic']);
        Route::get('/candidates/{candidate}/donation-settings', [DonationController::class, 'getCandidateSettings']);
        
        Route::post('/donations', [DonationController::class, 'store']);
        Route::post('/feedback', [FeedbackController::class, 'store']);
        Route::get('/contacts', [ContactController::class, 'index']);
        Route::get('/feed', FeedController::class);
    });

    // Protected API routes (require authentication)
    Route::middleware(['auth:sanctum'])->group(function () {
        // Dashboard
        Route::get('/dashboard', [DashboardController::class, 'index']);

        // Candidates
        Route::get('/candidates/check-slug', [CandidateController::class, 'checkSlugAvailability']);
        Route::get('/candidates/my-candidates', [CandidateController::class, 'myCandidates']);
        Route::apiResource('candidates', CandidateController::class);
        Route::post('/candidates/{candidate}/sync-users', [CandidateController::class, 'syncUsers']);
        Route::get('/candidates/{candidate}/donations', [DonationController::class, 'getCandidateDonations']);
        Route::get('/candidates/{candidate}/donation-settings', [DonationController::class, 'getCandidateSettings']);
        Route::put('/candidates/{candidate}/donation-settings', [DonationController::class, 'updateCandidateSettings']);
        Route::get('/candidates/{candidate}/feedback', [CandidateController::class, 'feedback']);
        Route::get('/candidates/{candidate}/events', [CandidateController::class, 'events']);
        Route::get('/candidates/{candidate}/activity', [CandidateController::class, 'activity']);
        
        // Donations (Admin)
        Route::get('/admin/donations', [DonationController::class, 'index']);
        Route::get('/admin/donations/{donation}', [DonationController::class, 'show']);
        Route::patch('/admin/donations/{donation}', [DonationController::class, 'update']);

        // Election Manifestos (Admin - All manifestos)
        Route::get('/manifestos', [\App\Http\Controllers\Api\ElectionManifestoController::class, 'indexAll']);

        // Election Manifestos (Candidate-specific)
        Route::prefix('candidates/{candidate}')->group(function () {
            Route::get('/manifestos', [\App\Http\Controllers\Api\ElectionManifestoController::class, 'index']);
            Route::post('/manifestos', [\App\Http\Controllers\Api\ElectionManifestoController::class, 'store']);
            Route::get('/manifestos/{manifesto}', [\App\Http\Controllers\Api\ElectionManifestoController::class, 'show']);
            Route::put('/manifestos/{manifesto}', [\App\Http\Controllers\Api\ElectionManifestoController::class, 'update']);
            Route::delete('/manifestos/{manifesto}', [\App\Http\Controllers\Api\ElectionManifestoController::class, 'destroy']);

            // Landing page content (Page management)
            Route::post('/page-content/upload', [\App\Http\Controllers\Api\CandidatePageContentController::class, 'upload']);
            Route::get('/page-content', [\App\Http\Controllers\Api\CandidatePageContentController::class, 'show']);
            Route::post('/page-content', [\App\Http\Controllers\Api\CandidatePageContentController::class, 'upsert']);
            Route::put('/page-content', [\App\Http\Controllers\Api\CandidatePageContentController::class, 'upsert']);

            // Testimonials
            Route::post('/testimonials/upload', [\App\Http\Controllers\Api\TestimonialController::class, 'upload']);
            Route::get('/testimonials', [\App\Http\Controllers\Api\TestimonialController::class, 'index']);
            Route::post('/testimonials', [\App\Http\Controllers\Api\TestimonialController::class, 'store']);
            Route::get('/testimonials/{testimonial}', [\App\Http\Controllers\Api\TestimonialController::class, 'show']);
            Route::put('/testimonials/{testimonial}', [\App\Http\Controllers\Api\TestimonialController::class, 'update']);
            Route::delete('/testimonials/{testimonial}', [\App\Http\Controllers\Api\TestimonialController::class, 'destroy']);
        });

        // Election Manifesto Categories
        Route::apiResource('election-manifesto-categories', \App\Http\Controllers\Api\ElectionManifestoCategoryController::class);

        // Parties
        Route::apiResource('parties', PartyController::class);

        // Constituencies
        Route::apiResource('constituencies', ConstituencyController::class);

        // Districts (for admin selects)
        Route::get('/districts', [DistrictController::class, 'index']);

        // Templates (list available to all authenticated users, upload/show for super admin only)
        Route::get('/templates', [TemplateController::class, 'index']);
        Route::middleware(['ability:' . User::ROLE_SUPER_ADMIN])->group(function () {
            Route::post('/templates/upload', [TemplateController::class, 'upload']);
            Route::get('/templates/{slug}', [TemplateController::class, 'show']);
        });

        // Users (admin only)
        Route::middleware(['ability:' . User::ROLE_SUPER_ADMIN])->group(function () {
            Route::apiResource('users', UserController::class);
        });

        // Admin feedback management
        Route::get('/admin/feedback', [FeedbackAdminController::class, 'index']);
        Route::get('/admin/feedback/{feedback}', [FeedbackAdminController::class, 'show']);
        Route::patch('/admin/feedback/{feedback}', [FeedbackAdminController::class, 'update']);
        Route::post('/admin/feedback/{feedback}/comments', [FeedbackAdminController::class, 'storeComment']);

        // Payment methods management (admin only)
        Route::apiResource('payment-methods', \App\Http\Controllers\Api\PaymentMethodController::class);
        Route::patch('/payment-methods/{paymentMethod}/toggle-active', [\App\Http\Controllers\Api\PaymentMethodController::class, 'toggleActive']);
    });
});
