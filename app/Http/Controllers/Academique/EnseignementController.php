<?php

namespace App\Http\Controllers\Academique;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log; // <-- Ajout pour le logging
use Illuminate\Validation\Rule;
use App\Services\Academique\EnseignementService;
use App\Models\Enseignement;
use App\Models\Enseignant;
use App\Models\Classe;
use App\Models\Matiere;
use Inertia\Inertia;

class EnseignementController extends Controller
{
    protected $enseignementService;

    public function __construct(EnseignementService $enseignementService)
    {
        $this->enseignementService = $enseignementService;
        Log::info('EnseignementController instancié');
    }

    public function index(Request $request)
    {
        Log::info('Méthode index appelée', ['request' => $request->all()]);

        $perPage = $request->get('perPage', 10);
        $enseignements = $this->enseignementService->getPaginatedList((int) $perPage);

        // Log::info('Index - enseignements récupérés', ['count' => $enseignements->count()]);

        return Inertia::render('Academique/Enseignement/Index', [
            'enseignements' => $enseignements,
        ]);
    }

    public function create()
    {
        Log::info('Méthode create appelée');

        $enseignants = Enseignant::with('user')->get()->sortBy(fn($e) => $e->user?->name);
        $classes = Classe::orderBy('nom')->get();
        $matieres = Matiere::orderBy('nom')->get();

        Log::info('Create - données récupérées', [
            'enseignants' => $enseignants->count(),
            'classes' => $classes->count(),
            'matieres' => $matieres->count()
        ]);

        return Inertia::render('Academique/Enseignement/Create', [
            'enseignants' => $enseignants,
            'classes' => $classes,
            'matieres' => $matieres,
        ]);
    }

    public function store(Request $request)
    {
        Log::info('Méthode store appelée', ['request' => $request->all()]);

        $validated = $request->validate([
            'enseignant_id' => 'required|exists:enseignants,id',
            'classe_id' => 'required|exists:classes,id',
            'matiere_id' => 'required|exists:matieres,id',
            'coefficient' => 'required|integer|min:1',
            Rule::unique('enseignements')->where(fn($query) => $query
                ->where('enseignant_id', $request->enseignant_id)
                ->where('classe_id', $request->classe_id)
                ->where('matiere_id', $request->matiere_id)
            ),
        ]);

        $enseignement = $this->enseignementService->create($validated);

        Log::info('Store - enseignement créé', ['id' => $enseignement->id]);

        return redirect()->route('enseignements.index')
            ->with('success', 'Enseignement créé avec succès.');
    }

    public function show(Enseignement $enseignement)
    {
        Log::info('Méthode show appelée', ['enseignement_id' => $enseignement->id]);

        $enseignement = $this->enseignementService->findById($enseignement->id);

        return Inertia::render('Academique/Enseignement/Show', [
            'enseignement' => $enseignement,
        ]);
    }

    public function edit(Enseignement $enseignement)
    {
        Log::info('Méthode edit appelée', ['enseignement_id' => $enseignement->id]);

        $enseignants = Enseignant::with('user')->get()->sortBy(fn($e) => $e->user?->name);
        $classes = Classe::orderBy('nom')->get();
        $matieres = Matiere::orderBy('nom')->get();

        $enseignement = $this->enseignementService->findById($enseignement->id);

        return Inertia::render('Academique/Enseignement/Edit', [
            'enseignement' => $enseignement,
            'enseignants' => $enseignants,
            'classes' => $classes,
            'matieres' => $matieres,
        ]);
    }

    public function update(Request $request, Enseignement $enseignement)
    {
        Log::info('Méthode update appelée', ['enseignement_id' => $enseignement->id, 'request' => $request->all()]);

        $validated = $request->validate([
            'enseignant_id' => 'required|exists:enseignants,id',
            'classe_id' => 'required|exists:classes,id',
            'matiere_id' => 'required|exists:matieres,id',
            'coefficient' => 'required|integer|min:1',
            Rule::unique('enseignements')->where(fn($query) => $query
                ->where('enseignant_id', $request->enseignant_id)
                ->where('classe_id', $request->classe_id)
                ->where('matiere_id', $request->matiere_id)
            )->ignore($enseignement->id),
        ]);

        $updated = $this->enseignementService->update($enseignement->id, $validated);

        Log::info('Update - enseignement mis à jour', ['id' => $updated->id]);

        return redirect()->route('enseignements.index')
            ->with('success', 'Enseignement mis à jour avec succès.');
    }

    public function destroy(Enseignement $enseignement)
    {
        Log::info('Méthode destroy appelée', ['enseignement_id' => $enseignement->id]);

        $deleted = $this->enseignementService->delete($enseignement->id);

        Log::info('Destroy - enseignement supprimé', ['enseignement_id' => $enseignement->id, 'success' => $deleted]);

        return redirect()->route('enseignements.index')
            ->with('success', 'Enseignement supprimé avec succès.');
    }
}
