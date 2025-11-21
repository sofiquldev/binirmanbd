<?php

declare(strict_types=1);

use App\Models\Candidate;
use Illuminate\Support\Facades\Route;
use Stancl\Tenancy\Middleware\InitializeTenancyByDomain;
use Stancl\Tenancy\Middleware\PreventAccessFromCentralDomains;

/*
|--------------------------------------------------------------------------
| Tenant Routes
|--------------------------------------------------------------------------
|
| Here you can register the tenant routes for your application.
| These routes are loaded by the TenantRouteServiceProvider.
|
| Feel free to customize them however you want. Good luck!
|
*/

Route::middleware([
    'web',
    InitializeTenancyByDomain::class,
    PreventAccessFromCentralDomains::class,
])->group(function () {
    Route::get('/', function () {
        $candidate = Candidate::with('template')->where('tenant_id', tenant('id'))->firstOrFail();
        $templateSlug = $candidate->template?->slug ?? 'modern';

        return view('tenant.templates.'.$templateSlug, [
            'candidate' => $candidate,
        ]);
    })->name('tenant.home');

    Route::get('/donate', function () {
        $candidate = Candidate::where('tenant_id', tenant('id'))->firstOrFail();

        return view('tenant.donate', [
            'candidate' => $candidate,
        ]);
    })->name('tenant.donate');

    Route::get('/feedback', function () {
        $candidate = Candidate::where('tenant_id', tenant('id'))->firstOrFail();

        return view('tenant.feedback', [
            'candidate' => $candidate,
        ]);
    })->name('tenant.feedback');

    Route::get('/appointments', function () {
        $candidate = Candidate::where('tenant_id', tenant('id'))->firstOrFail();
        return view('tenant.appointments', ['candidate' => $candidate]);
    })->name('tenant.appointments');

    Route::get('/events', function () {
        $candidate = Candidate::where('tenant_id', tenant('id'))->firstOrFail();
        return view('tenant.events', ['candidate' => $candidate]);
    })->name('tenant.events');

    Route::get('/contact', function () {
        $candidate = Candidate::where('tenant_id', tenant('id'))->firstOrFail();
        return view('tenant.contact', ['candidate' => $candidate]);
    })->name('tenant.contact');
});
