<?php

namespace App\Http\Controllers\Academique;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
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

    /**
     * Récupère l'ID de l'enseignant connecté
     */
    protected function getEnseignantId(): ?int
    {
        $user = auth()->user();

        // Si l'utilisateur n'est pas enseignant → null
        if (!$user || !$user->enseignant) {
            return null;
        }

        return $user->enseignant->id;
    }

    /**
     * Vérifie si l'utilisateur est un enseignant
     */
    protected function isEnseignant(): bool
    {
        $user = auth()->user();
        return $user && $user->enseignant !== null;
    }

    public function index(Request $request)
    {
        Log::info('Méthode index appelée', ['request' => $request->all()]);

        $perPage = (int) $request->get('perPage', 10);
        $enseignantId = $this->getEnseignantId();
        
        // Si c'est un enseignant, ne récupérer que ses enseignements
        if ($this->isEnseignant()) {
            $enseignements = $this->enseignementService->getPaginatedListForTeacher($enseignantId, $perPage);
            $stats = $this->enseignementService->getStatisticsForTeacher($enseignantId);
        } else {
            // Sinon, récupérer tous les enseignements (pour les administrateurs)
            $enseignements = $this->enseignementService->getPaginatedList($perPage);
            $stats = $this->enseignementService->getStatistics();
        }

        return Inertia::render('Academique/Enseignement/Index', [
            'enseignements' => $enseignements,
            'stats' => $stats,
            'is_teacher' => $this->isEnseignant(),
        ]);
    }

    public function create()
    {
        Log::info('Méthode create appelée');
        
        $enseignantId = $this->getEnseignantId();
        
        // Si c'est un enseignant, il ne peut créer que pour lui-même
        if ($this->isEnseignant()) {
            $enseignants = Enseignant::where('id', $enseignantId)
                ->with('user')
                ->get();
        } else {
            // Sinon, récupérer tous les enseignants (pour les administrateurs)
            $enseignants = Enseignant::with('user')
                ->get()
                ->sortBy(fn($e) => $e->user?->name)
                ->values();
        }
        
        $classes = Classe::orderBy('nom')->get();
        $matieres = Matiere::orderBy('nom')->get();

        Log::info('Create - données récupérées', [
            'enseignants' => $enseignants->count(),
            'classes' => $classes->count(),
            'matieres' => $matieres->count(),
            'is_teacher' => $this->isEnseignant(),
        ]);

        return Inertia::render('Academique/Enseignement/Create', [
            'enseignants' => $enseignants,
            'classes' => $classes,
            'matieres' => $matieres,
            'is_teacher' => $this->isEnseignant(),
            'current_teacher_id' => $enseignantId,
        ]);
    }

    public function store(Request $request)
    {
        Log::info('Méthode store appelée', ['request' => $request->all()]);
        
        $enseignantId = $this->getEnseignantId();
        
        // Si c'est un enseignant, forcer l'enseignant_id à son propre ID
        if ($this->isEnseignant()) {
            $request->merge(['enseignant_id' => $enseignantId]);
        }

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

        // Vérification de sécurité supplémentaire pour les enseignants
        if ($this->isEnseignant() && $validated['enseignant_id'] !== $enseignantId) {
            abort(403, "Vous ne pouvez créer des enseignements que pour vous-même.");
        }

        $enseignement = $this->enseignementService->create($validated);

        Log::info('Store - enseignement créé', ['id' => $enseignement->id]);

        return redirect()->route('enseignements.index')
            ->with('success', 'Enseignement créé avec succès.');
    }

    public function show(Enseignement $enseignement)
    {
        Log::info('Méthode show appelée', ['enseignement_id' => $enseignement->id]);
        
        // Vérifier si l'enseignant a le droit de voir cet enseignement
        if ($this->isEnseignant() && $enseignement->enseignant_id !== $this->getEnseignantId()) {
            abort(403, "Vous n'avez pas l'autorisation de voir cet enseignement.");
        }

        $enseignement = $this->enseignementService->findById($enseignement->id);

        return Inertia::render('Academique/Enseignement/Show', [
            'enseignement' => $enseignement,
        ]);
    }

    public function edit(Enseignement $enseignement)
    {
        Log::info('Méthode edit appelée', ['enseignement_id' => $enseignement->id]);
        
        // Vérifier si l'enseignant a le droit de modifier cet enseignement
        if ($this->isEnseignant() && $enseignement->enseignant_id !== $this->getEnseignantId()) {
            abort(403, "Vous n'avez pas l'autorisation de modifier cet enseignement.");
        }

        $enseignantId = $this->getEnseignantId();
        
        // Si c'est un enseignant, il ne peut modifier que pour lui-même
        if ($this->isEnseignant()) {
            $enseignants = Enseignant::where('id', $enseignantId)
                ->with('user')
                ->get();
        } else {
            // Sinon, récupérer tous les enseignants (pour les administrateurs)
            $enseignants = Enseignant::with('user')
                ->get()
                ->sortBy(fn($e) => $e->user?->name)
                ->values();
        }
        
        $classes = Classe::orderBy('nom')->get();
        $matieres = Matiere::orderBy('nom')->get();

        $enseignement = $this->enseignementService->findById($enseignement->id);

        return Inertia::render('Academique/Enseignement/Edit', [
            'enseignement' => $enseignement,
            'enseignants' => $enseignants,
            'classes' => $classes,
            'matieres' => $matieres,
            'is_teacher' => $this->isEnseignant(),
            'current_teacher_id' => $enseignantId,
        ]);
    }

    public function update(Request $request, Enseignement $enseignement)
    {
        Log::info('Méthode update appelée', ['enseignement_id' => $enseignement->id, 'request' => $request->all()]);
        
        $enseignantId = $this->getEnseignantId();
        
        // Vérifier si l'enseignant a le droit de modifier cet enseignement
        if ($this->isEnseignant() && $enseignement->enseignant_id !== $enseignantId) {
            abort(403, "Vous n'avez pas l'autorisation de modifier cet enseignement.");
        }
        
        // Si c'est un enseignant, forcer l'enseignant_id à son propre ID
        if ($this->isEnseignant()) {
            $request->merge(['enseignant_id' => $enseignantId]);
        }

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

        // Vérification de sécurité supplémentaire pour les enseignants
        if ($this->isEnseignant() && $validated['enseignant_id'] !== $enseignantId) {
            abort(403, "Vous ne pouvez modifier des enseignements que pour vous-même.");
        }

        $updated = $this->enseignementService->update($enseignement->id, $validated);

        Log::info('Update - enseignement mis à jour', ['id' => $updated->id]);

        return redirect()->route('enseignements.index')
            ->with('success', 'Enseignement mis à jour avec succès.');
    }

    public function destroy(Enseignement $enseignement)
    {
        Log::info('Méthode destroy appelée', ['enseignement_id' => $enseignement->id]);
        
        // Vérifier si l'enseignant a le droit de supprimer cet enseignement
        if ($this->isEnseignant() && $enseignement->enseignant_id !== $this->getEnseignantId()) {
            abort(403, "Vous n'avez pas l'autorisation de supprimer cet enseignement.");
        }

        $deleted = $this->enseignementService->delete($enseignement->id);

        Log::info('Destroy - enseignement supprimé', ['enseignement_id' => $enseignement->id, 'success' => $deleted]);

        return redirect()->route('enseignements.index')
            ->with('success', 'Enseignement supprimé avec succès.');
    }
}