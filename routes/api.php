<?php

use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\DonationController;
use App\Http\Controllers\Api\FeedController;
use App\Http\Controllers\Api\FeedbackController;
use Illuminate\Support\Facades\Route;
use Stancl\Tenancy\Middleware\InitializeTenancyByRequestData;

Route::prefix('v1')->group(function () {
    Route::get('/health', fn () => ['status' => 'ok', 'timestamp' => now()->toIso8601String()]);

    Route::middleware([InitializeTenancyByRequestData::class])->group(function () {
        Route::post('/donations', [DonationController::class, 'store']);
        Route::post('/feedback', [FeedbackController::class, 'store']);
        Route::get('/contacts', [ContactController::class, 'index']);
        Route::get('/feed', FeedController::class);
    });
});


