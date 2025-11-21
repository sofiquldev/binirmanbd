<?php

use Illuminate\Support\Facades\Route;

Route::view('/', 'welcome');

Route::view('dashboard', 'dashboard')
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware(['auth', 'verified', 'role:'.\App\Models\User::ROLE_SUPER_ADMIN])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::view('/dashboard', 'admin.dashboard')->name('dashboard');
    });

Route::middleware([
    'auth',
    'verified',
    'role:'.implode('|', [
        \App\Models\User::ROLE_CANDIDATE_ADMIN,
        \App\Models\User::ROLE_TEAM_MEMBER,
    ]),
])->prefix('candidate')->name('candidate.')->group(function () {
    Route::view('/templates', 'candidate.templates')->name('templates');
    Route::view('/donations', 'candidate.donations')->name('donations');
    Route::view('/feedback', 'candidate.feedback')->name('feedback');
    Route::view('/contacts', 'candidate.contacts')->name('contacts');
    Route::view('/knowledge', 'candidate.knowledge')->name('knowledge');
    Route::view('/appointments', 'candidate.appointments')->name('appointments');
    Route::view('/announcements', 'candidate.announcements')->name('announcements');
    Route::view('/events', 'candidate.events')->name('events');
    Route::view('/polls', 'candidate.polls')->name('polls');
    Route::view('/engagement', 'candidate.engagement')->name('engagement');
});

Route::view('profile', 'profile')
    ->middleware(['auth'])
    ->name('profile');

require __DIR__.'/auth.php';
