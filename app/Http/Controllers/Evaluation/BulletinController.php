<?php

namespace App\Http\Controllers\Evaluation;

use App\Http\Controllers\Controller;
use App\Models\{Classe, Eleve, Trimestre, Bulletin, Note};
use App\Services\Evaluation\BulletinService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Str;
use ZipArchive;

class BulletinController extends Controller
{
    protected $bulletinService;

    public function __construct(BulletinService $bulletinService)
    {
        $this->bulletinService = $bulletinService;
    }

    /**
     * Affiche la liste des bulletins disponibles
     */
    public function index(Request $request)
    {
        $query = Bulletin::with(['eleve.user', 'trimestre']);
        
        // Filtrer par trimestre si spécifié
        if ($request->has('trimestre_id') && $request->trimestre_id) {
            $query->where('trimestre_id', $request->trimestre_id);
        }
        
        // Filtrer par classe si spécifié
        if ($request->has('classe_id') && $request->classe_id) {
            $query->whereHas('eleve', function($q) use ($request) {
                $q->where('classe_id', $request->classe_id);
            });
        }
        
        $bulletins = $query->orderBy('created_at', 'desc')->paginate(10);
        
        return Inertia::render('Evaluation/Bulletin/Index', [
            'bulletins' => $bulletins,
            'filters' => $request->only(['trimestre_id', 'classe_id']),
            'trimestres' => Trimestre::orderBy('created_at', 'desc')->get(),
            'classes' => Classe::orderBy('nom')->get(),
        ]);
    }

    /**
     * Affiche le formulaire de génération des bulletins
     */
    public function create()
    {
        return Inertia::render('Evaluation/Bulletin/Create', [
            'classes' => Classe::orderBy('nom')->get(),
            'trimestres' => Trimestre::orderBy('created_at', 'desc')->get(),
        ]);
    }

    /**
     * Génère ou Recalcule les bulletins pour une classe entière
     */
    public function store(Request $request)
    {
        $request->validate([
            'classe_id' => 'required|exists:classes,id',
            'trimestre_id' => 'required|exists:trimestres,id',
        ]);

        $classe = Classe::findOrFail($request->classe_id);
        $trimestre = Trimestre::findOrFail($request->trimestre_id);

        try {
            // Appel au service que vous avez défini pour traiter les calculs
            $this->bulletinService->processClasse($classe, $trimestre);
            
            return redirect()->route('bulletins.index')->with('success', "Les bulletins pour la {$classe->nom} ont été générés.");
        } catch (\Exception $e) {
            return back()->with('error', "Erreur lors du calcul : " . $e->getMessage());
        }
    }

    /**
     * Affiche le bulletin dans l'interface React (Aperçu fidèle)
     */
    /**
 * Affiche le bulletin dans l'interface React (Aperçu fidèle)
 */
public function show(Eleve $eleve, Trimestre $trimestre)
{
    // DEBUG : Vérifier les notes brutes de l'élève
    $notesBrutes = Note::where('eleve_id', $eleve->id)
        ->where('trimestre_id', $trimestre->id)
        ->with(['enseignement.matiere'])
        ->get(['id', 'valeur', 'sequence', 'enseignement_id', 'eleve_id']);
    
    \Log::info('Notes brutes pour élève ' . $eleve->user->name . ' - Trimestre ' . $trimestre->nom . ':', $notesBrutes->toArray());
    
    // Regrouper par séquence pour voir
    $notesParSequence = $notesBrutes->groupBy('sequence');
    \Log::info('Notes par séquence:', $notesParSequence->map(fn($notes) => $notes->count())->toArray());
    
    // Vérifier si le bulletin existe déjà
    $bulletin = Bulletin::where('eleve_id', $eleve->id)
        ->where('trimestre_id', $trimestre->id)
        ->first();

    // Si le bulletin n'existe pas OU s'il n'est pas validé, le recalculer
    if (!$bulletin || !$bulletin->est_valide) {
        \Log::info('Recalcul du bulletin pour élève ' . $eleve->user->name);
        
        // Récupérer la classe de l'élève
        $classe = $eleve->classe;
        
        // Regénérer les bulletins pour cette classe
        $this->bulletinService->processClasse($classe, $trimestre);
        
        // Récupérer le bulletin fraîchement mis à jour
        $bulletin = Bulletin::where('eleve_id', $eleve->id)
            ->where('trimestre_id', $trimestre->id)
            ->firstOrFail();
            
        // Log::info('Bulletin après recalcul - stats_sequences:', $bulletin->stats_sequences);
    } else {
        \Log::info('Bulletin existant - stats_sequences:', $bulletin->stats_sequences);
    }

    // Charger l'élève avec sa classe et le professeur titulaire
    $eleveWithDetails = Eleve::with([
        'user', 
        'classe.titulaire.user'
    ])->findOrFail($eleve->id);

    return Inertia::render('Evaluation/Bulletin/Show', [
        'bulletin' => $bulletin,
        'eleve' => $eleveWithDetails,
        'trimestre' => $trimestre,
        'moyennesMatieres' => $bulletin->moyennes_matieres ?? [], 
        'profilClasse' => $bulletin->profil_classe,
    ]);
}
    /**
     * Affiche le formulaire d'édition d'un bulletin
     */
    public function edit(Bulletin $bulletin)
    {
        $bulletin->load(['eleve.user', 'trimestre']);
        
        return Inertia::render('Evaluation/Bulletin/Edit', [
            'bulletin' => $bulletin,
            'eleve' => $bulletin->eleve,
            'trimestre' => $bulletin->trimestre,
        ]);
    }

    /**
     * Met à jour un bulletin
     */
    public function update(Request $request, Bulletin $bulletin)
    {
        $request->validate([
            'appreciation_generale' => 'nullable|string',
            'est_valide' => 'boolean',
        ]);

        $bulletin->update($request->only(['appreciation_generale', 'est_valide']));
        
        return redirect()->route('bulletins.show', [$bulletin->eleve_id, $bulletin->trimestre_id])
            ->with('success', 'Bulletin mis à jour avec succès.');
    }

    /**
     * Supprime un bulletin
     */
    public function destroy(Bulletin $bulletin)
    {
        $eleveName = $bulletin->eleve->user->name;
        $trimestreNom = $bulletin->trimestre->nom;
        
        $bulletin->delete();
        
        return redirect()->route('bulletins.index')
            ->with('success', "Le bulletin de {$eleveName} pour le {$trimestreNom} a été supprimé.");
    }

    /**
     * Génère le fichier PDF officiel (Format A4)
     */
    public function downloadPdf(Eleve $eleve, Trimestre $trimestre)
    {
        $bulletin = Bulletin::where('eleve_id', $eleve->id)
            ->where('trimestre_id', $trimestre->id)
            ->firstOrFail();

        // Charger l'élève avec sa classe et le professeur titulaire
        $eleveWithDetails = Eleve::with([
            'user', 
            'classe.titulaire.user' // Correction ici : utiliser 'titulaire' au lieu de 'enseignantPrincipal'
        ])->findOrFail($eleve->id);

        $data = [
            'bulletin' => $bulletin,
            'eleve' => $eleveWithDetails,
            'trimestre'=> $trimestre,
            'matieres' => $bulletin->moyennes_matieres,
            'profil'   => $bulletin->profil_classe,
            'config'   => [
                'annee' => '2025/2026',
                'etablissement' => 'Collège Catholique Bilingue Saint Benoit'
            ]
        ];

        // Rendu via une vue Blade dédiée au PDF pour une compatibilité parfaite
        $pdf = Pdf::loadView('pdf.bulletin', $data)
                  ->setPaper('a4', 'portrait')
                  ->setOptions([
                      'isHtml5ParserEnabled' => true,
                      'isRemoteEnabled' => true, // Pour charger le logo
                  ]);

        $name = "Bulletin_{$trimestre->nom}_{$eleveWithDetails->user->name}.pdf";
        return $pdf->download($name);
    }

    /**
     * Impression groupée de tous les bulletins d'une classe en un seul PDF
     */
    public function bulkPrint(Classe $classe, Trimestre $trimestre)
    {
        $bulletins = Bulletin::whereHas('eleve', fn($q) => $q->where('classe_id', $classe->id))
            ->where('trimestre_id', $trimestre->id)
            ->with(['eleve.user', 'eleve.classe.titulaire.user']) // Correction ici : utiliser 'titulaire' au lieu de 'enseignantPrincipal'
            ->get();

        $pdf = Pdf::loadView('pdf.bulk_bulletins', [
            'bulletins' => $bulletins,
            'trimestre' => $trimestre,
            'classe'    => $classe
        ])->setPaper('a4', 'portrait');

        return $pdf->stream("Recueil_Bulletins_{$classe->nom}.pdf");
    }
 

/**
 * Télécharge en masse tous les bulletins d'une classe pour un trimestre donné dans un fichier ZIP.
 */
public function bulkDownload(Classe $classe, Trimestre $trimestre)
{
    Log::info('Début bulkDownload', [
        'classe_id' => $classe->id,
        'trimestre_id' => $trimestre->id
    ]);

    $bulletins = Bulletin::whereHas('eleve', fn($q) => $q->where('classe_id', $classe->id))
        ->where('trimestre_id', $trimestre->id)
        ->with(['eleve.user', 'eleve.classe.titulaire.user'])
        ->get();

    Log::info('Bulletins récupérés', [
        'count' => $bulletins->count()
    ]);

    if ($bulletins->isEmpty()) {
        Log::warning('Aucun bulletin trouvé');
        return back()->with('error', "Aucun bulletin trouvé pour la classe {$classe->nom} au {$trimestre->nom}.");
    }

    // Dossier temp
    $tempPath = storage_path('app/temp');
    if (!is_dir($tempPath)) {
        mkdir($tempPath, 0755, true);
        Log::info('Dossier temp créé');
    }

    $zipFileName = Str::slug("Bulletins {$classe->nom} {$trimestre->nom} " . now()->format('Y-m-d')) . '.zip';
    $zipFilePath = "{$tempPath}/{$zipFileName}";

    if (!class_exists(ZipArchive::class)) {
        Log::critical('ZipArchive non disponible');
        return back()->with('error', 'Extension ZIP non activée sur le serveur.');
    }

    $zip = new ZipArchive();
    $opened = $zip->open($zipFilePath, ZipArchive::CREATE | ZipArchive::OVERWRITE);

    if ($opened !== true) {
        Log::error('Impossible d’ouvrir le ZIP', ['code' => $opened]);
        return back()->with('error', 'Impossible de créer le fichier ZIP.');
    }

 foreach ($bulletins as $bulletin) {
    $studentName = Str::slug($bulletin->eleve->user->name);
    $pdfFileName = "Bulletin_{$trimestre->nom}_{$studentName}.pdf";

    Log::info('Génération PDF', ['eleve' => $studentName]);

    $pdf = Pdf::loadView('pdf.bulletin', [
        'bulletin' => $bulletin,
        'eleve' => $bulletin->eleve,
        'trimestre' => $trimestre,
        'matieres' => $bulletin->moyennes_matieres,
        'profil' => $bulletin->profil_classe,
        'config' => [
            'annee' => '2025/2026',
            'etablissement' => 'Collège Catholique Bilingue Saint Benoit'
        ]
    ])->setPaper('a4');

    // 🔥 AJOUT DIRECT DANS LE ZIP (sans fichier temporaire)
    $zip->addFromString($pdfFileName, $pdf->output());
}


    $zip->close();
    Log::info('ZIP généré avec succès');

 

    return response()->download($zipFilePath)->deleteFileAfterSend(true);
}

}