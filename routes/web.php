<?php

use App\Http\Controllers\Admin\ClubEventController;
use App\Http\Controllers\ContactMessageController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('web/index');
})->name('home');

Route::get('/club-admission', function () {
    return Inertia::render('web/club-admission');
})->name('club-admission');

Route::get('/gallery', function () {
    return Inertia::render('web/gallery');
})->name('gallery');

Route::get('/events', function () {
    return Inertia::render('web/events');
})->name('events');

Route::get('events/{id}', [ClubEventController::class, 'find']);

Route::get('/mission', function () {
    return Inertia::render('web/mission');
})->name('mission');

Route::get('/achievement', function () {
    return Inertia::render('web/achievement');
})->name('achievement');

Route::get('/web-learning', function () {
    return Inertia::render('web/web-learning');
})->name('web-learning');

// Route::get('/join', function () {
//     return Inertia::render('web/join');
// })->name('join');

Route::post('/contact-message/submit', [ContactMessageController::class, 'submit']);

require __DIR__ . '/auth.php';
require __DIR__ . '/settings.php';
require __DIR__ . '/admin.php';
