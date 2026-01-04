<?php

use App\Http\Controllers\Academique\ClasseController;
use App\Http\Controllers\Academique\EnseignementController;
use App\Http\Controllers\Academique\MatiereController;
use App\Http\Controllers\Academique\TrimestreController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminPermissionController;
use App\Http\Controllers\Evaluation\BulletinController;
use App\Http\Controllers\Evaluation\NoteController;
use App\Http\Controllers\User\DashboardController;
use App\Http\Controllers\User\EleveController;
use App\Http\Controllers\User\EnseignantController;
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
    // Route::get('dashboard', function () {
    //     return Inertia::render('dashboard');
    // })->name('dashboard');
    Route::get('dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');
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

Route::middleware(['auth'])->group(function () {
        Route::resource('notes', NoteController::class);

    Route::resource('matieres', MatiereController::class);
    Route::resource('classes', ClasseController::class);
    Route::resource('eleves', EleveController::class)->parameters([
        'eleves' => 'eleve', // ici on s'assure que le paramètre s'appelle 'eleve'
    ]);

    Route::resource('enseignants', EnseignantController::class);

    Route::resource('trimestres', TrimestreController::class);
    Route::resource('enseignements', EnseignementController::class);

 

// Routes pour les bulletins - Pattern RESTful
Route::resource('bulletins', BulletinController::class);

// Routes supplémentaires avec le pattern exact comme dans votre exemple
Route::get('/bulletins/{eleve}/{trimestre}', [BulletinController::class, 'show'])->name('bulletins.show');
Route::get('/bulletins/{eleve}/{trimestre}/pdf', [BulletinController::class, 'downloadPdf'])->name('bulletins.pdf');
Route::get('/bulletins/bulk-print/{classe}/{trimestre}', [BulletinController::class, 'bulkPrint'])->name('bulletins.bulk-print');
});

 
 
Route::get('/bulletins/bulk-download/{classe}/{trimestre}', [BulletinController::class, 'bulkDownload'])
    ->name('bulletins.bulk.download')
    ->middleware(['auth', 'verified']); // Assurez-vous que la protection est adéquate