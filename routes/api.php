<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CandidateController;
use App\Http\Controllers\Api\ConstituencyController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DonationController;
use App\Http\Controllers\Api\FeedbackController;
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

    // Tenant-specific public routes
    Route::middleware([InitializeTenancyByRequestData::class])->group(function () {
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
        Route::apiResource('candidates', CandidateController::class);
        Route::get('/candidates/{candidate}/donations', [CandidateController::class, 'donations']);
        Route::get('/candidates/{candidate}/feedback', [CandidateController::class, 'feedback']);
        Route::get('/candidates/{candidate}/events', [CandidateController::class, 'events']);
        Route::get('/candidates/{candidate}/activity', [CandidateController::class, 'activity']);

        // Parties
        Route::apiResource('parties', PartyController::class);

        // Constituencies
        Route::apiResource('constituencies', ConstituencyController::class);

        // Users (admin only)
        Route::middleware(['ability:' . User::ROLE_SUPER_ADMIN])->group(function () {
            Route::apiResource('users', UserController::class);
            Route::apiResource('templates', TemplateController::class);
        });
    });
});
