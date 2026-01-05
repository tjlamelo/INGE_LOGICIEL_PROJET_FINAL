<?php

use App\Http\Controllers\Academique\ClasseController;
use App\Http\Controllers\Academique\EnseignementController;
use App\Http\Controllers\Academique\MatiereController;
use App\Http\Controllers\Academique\TrimestreController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminPermissionController;
use App\Http\Controllers\Evaluation\BulletinController;
use App\Http\Controllers\Evaluation\NoteController;
use App\Http\Controllers\Notification\NotificationController;
use App\Http\Controllers\User\DashboardController;
use App\Http\Controllers\User\EleveController;
use App\Http\Controllers\User\EnseignantController;
use App\Models\Bulletin;
use App\Models\Classe;
use App\Models\Eleve;
use App\Models\Trimestre;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

 use Illuminate\Http\Request;  

 
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

 

Route::get('/test/bulletin', function (Request $request) {
    // Récupération des filtres éventuels
    $classeId = $request->query('classe_id');
    $trimestreId = $request->query('trimestre_id');

    // On récupère un bulletin pour test (exemple : le plus récent)
    $query = Bulletin::with(['eleve.user', 'eleve.classe.titulaire.user', 'trimestre']);

    if ($trimestreId) {
        $query->where('trimestre_id', $trimestreId);
    }

    if ($classeId) {
        $query->whereHas('eleve', function ($q) use ($classeId) {
            $q->where('classe_id', $classeId);
        });
    }

    $bulletin = $query->orderBy('created_at', 'desc')->first();

    if (!$bulletin) {
        return "Aucun bulletin trouvé pour ces filtres.";
    }

    // Exemple de données supplémentaires pour ton Blade
    $matieres = $bulletin->moyennes_matieres ?? []; // à adapter selon ton modèle
    $profil = $bulletin->profil ?? []; // idem
    $eleve = $bulletin->eleve;
    $trimestre = $bulletin->trimestre;

    // Affiche le Blade directement
    return view('pdf.bulletin', compact('bulletin', 'eleve', 'trimestre', 'matieres', 'profil'));
});
 
 
// Routes pour les notifications
Route::middleware(['auth', 'verified'])->prefix('notifications')->name('notifications.')->group(function () {
    Route::get('/', [NotificationController::class, 'index'])->name('index');
    Route::get('/{id}', [NotificationController::class, 'show'])->name('show');
    Route::post('/', [NotificationController::class, 'store'])->name('store');
    Route::post('/{id}/read', [NotificationController::class, 'markAsRead'])->name('markAsRead');
    Route::post('/read-all', [NotificationController::class, 'markAllAsRead'])->name('markAllAsRead');
    Route::delete('/{id}', [NotificationController::class, 'destroy'])->name('destroy');
});

// API pour le dropdown de notifications
Route::middleware(['auth', 'verified'])->prefix('api')->group(function () {
    Route::get('/notifications/unread', [NotificationController::class, 'getUnreadNotifications'])->name('notifications.getUnread');
});
 
use App\Http\Controllers\Academique\CertificatScolariteController;

// Routes pour les certificats de scolarité
Route::middleware(['auth', 'verified'])->prefix('certificats')->name('certificats.')->group(function () {
    Route::get('/', [CertificatScolariteController::class, 'index'])->name('index');
    Route::get('/create', [CertificatScolariteController::class, 'create'])->name('create');
    Route::post('/', [CertificatScolariteController::class, 'store'])->name('store');
    Route::get('/{id}', [CertificatScolariteController::class, 'show'])->name('show');
    Route::get('/{id}/edit', [CertificatScolariteController::class, 'edit'])->name('edit');
    Route::put('/{id}', [CertificatScolariteController::class, 'update'])->name('update');
    Route::delete('/{id}', [CertificatScolariteController::class, 'destroy'])->name('destroy');
    Route::post('/{id}/valider', [CertificatScolariteController::class, 'valider'])->name('valider');
    Route::get('/{id}/download', [CertificatScolariteController::class, 'download'])->name('download');
});