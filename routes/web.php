<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminPermissionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\User\Import\ImportController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});


require __DIR__ . '/settings.php';

Route::get('/user/import', [ImportController::class, 'index'])
    ->name('user.import.index');
Route::post('/user/import/upload', [ImportController::class, 'upload'])
    ->name('user.import.upload');
Route::get('admin/dashboard', [AdminDashboardController::class, 'index'])
    ->name('admin.dashboard');

 
Route::get('/admin/permissions', [AdminPermissionController::class, 'index'])
    ->name('admin.permissions.index');
 
Route::put('/admin/users/{user}/role', [AdminPermissionController::class, 'updateRole'])
    ->name('admin.permissions.updateRole');