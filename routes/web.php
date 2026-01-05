<?php
use App\Http\Controllers\Academique\CreneauHoraireController;
use App\Http\Controllers\Academique\ClasseController;
use App\Http\Controllers\Academique\SalleController;
use App\Http\Controllers\Academique\EnseignementController;
use App\Http\Controllers\Academique\MatiereController;
use App\Http\Controllers\Academique\TrimestreController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminPermissionController;
use App\Http\Controllers\Evaluation\NoteController;
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

Route::middleware(['auth'])->group(function () {
    Route::resource('matieres', MatiereController::class);
    Route::resource('classes', ClasseController::class);
    Route::resource('salles', SalleController::class);
    Route::resource('creneaux_horaires', CreneauHoraireController::class);
    Route::resource('eleves', EleveController::class)->parameters([
        'eleves' => 'eleve', // ici on s'assure que le paramètre s'appelle 'eleve'
    ]);

    Route::resource('enseignants', EnseignantController::class);

    Route::resource('trimestres', TrimestreController::class);
    Route::resource('enseignements', EnseignementController::class);
    Route::resource('notes', NoteController::class);
});
