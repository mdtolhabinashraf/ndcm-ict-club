<?php

use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Admin\ClubAchievementController;
use App\Http\Controllers\Admin\ClubAdmissionDetailsController;
use App\Http\Controllers\Admin\ClubEventController;
use App\Http\Controllers\Admin\ClubModeratorController;
use App\Http\Controllers\Admin\ClubConfigController;
use App\Http\Controllers\Admin\ClubMissionController;
use App\Http\Controllers\Admin\FAQsController;
use App\Http\Controllers\Admin\GalleryController;
use App\Http\Controllers\Admin\VisitorsController;
use App\Http\Controllers\Admin\WebLearningController;
use App\Http\Controllers\BackupController;
use App\Http\Controllers\ContactMessageController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {

  Route::get('register', [RegisteredUserController::class, 'create'])
    ->name('register');

  Route::post('register', [RegisteredUserController::class, 'store']);

  Route::redirect('admin', '/admin/dashboard')->name('admin.dashboard');

  Route::redirect('admin/dashboard', '/admin/club');

  Route::redirect('admin/club', '/admin/club/details');

  Route::get('admin/club/details', function () {
    return Inertia::render('admin/club/details');
  });
  Route::post('admin/club/details', [ClubConfigController::class, 'update']);

  Route::redirect('admin/gallery', '/admin/gallery/all');

  Route::get('admin/gallery/{requestFor}', [GalleryController::class, 'edit']);
  Route::post('admin/gallery/upload', [GalleryController::class, 'upload']);
  Route::post('admin/gallery/update', [GalleryController::class, 'update']);
  Route::delete('admin/gallery/delete', [GalleryController::class, 'destroy']);

  Route::get('admin/club/moderators', [ClubModeratorController::class, 'edit']);
  Route::post('admin/club/moderators', [ClubModeratorController::class, 'update']);

  Route::get('admin/club/mission', [ClubMissionController::class, 'get']);
  Route::post('admin/club/mission', [ClubMissionController::class, 'update']);

  Route::get('admin/club/admission-details', [ClubAdmissionDetailsController::class, 'get']);
  Route::post('admin/club/admission-details', [ClubAdmissionDetailsController::class, 'update']);

  Route::get('admin/club/achievement', [ClubAchievementController::class, 'get']);
  Route::post('admin/club/achievement', [ClubAchievementController::class, 'update']);

  Route::get('admin/backup', [BackupController::class, 'get']);
  Route::post('admin/backup', [BackupController::class, 'backup']);
  Route::post('admin/backup/load', [BackupController::class, 'load']);
  Route::post('admin/backup/delete', [BackupController::class, 'destroy']);


  Route::redirect('admin/event', '/admin/event/create');

  Route::get('admin/event/create', function () {
    return Inertia::render('admin/event/create');
  })->name(
    'admin.event.create'
  );
  Route::post('admin/event/update', [ClubEventController::class, 'update']);

  Route::get('admin/event/all', [ClubEventController::class, 'show'])->name(
    'admin.event.all'
  );

  Route::get('admin/event/edit/{id}', [ClubEventController::class, 'edit']);
  Route::delete('admin/event/delete/{id}', [ClubEventController::class, 'destroy']);

  Route::redirect('admin/web-learning', '/admin/web-learning/create');

  Route::get('admin/web-learning/create', function () {
    return Inertia::render('admin/web-learning/create');
  })->name('admin.web-learning.create');

  Route::post('admin/web-learning/update', [WebLearningController::class, 'update']);

  Route::get('admin/web-learning/all', [WebLearningController::class, 'show'])->name(
    'admin.web-learning.all'
  );

  Route::get('admin/web-learning/edit/{id}', [WebLearningController::class, 'edit'])->name(
    'admin.web-learning.edit'
  );
  Route::delete('admin/web-learning/delete/{id}', [WebLearningController::class, 'destroy']);

  Route::get('admin/faqs', function () {
    return Inertia::render('admin/faqs');
  });
  Route::post('admin/faqs', [FAQsController::class, 'update']);

  Route::get('admin/contact-messages', [ContactMessageController::class, 'show']);
  Route::get('admin/visitors', [VisitorsController::class, 'show']);
});
