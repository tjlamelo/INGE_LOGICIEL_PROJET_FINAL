<?php

namespace App\Http\Controllers\Evaluation;

use App\Http\Controllers\Controller;
use App\Models\Enseignant;
use Illuminate\Http\Request;
use App\Services\Evaluation\NoteService;
use App\Models\Note;
use App\Models\Eleve;
use App\Models\Enseignement;
use App\Models\Trimestre;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NoteController extends Controller
{
    /**
     * Le service de gestion des notes.
     *
     * @var \App\Services\Evaluation\NoteService
     */
    protected $noteService;

    /**
     * Crée une nouvelle instance de contrôleur.
     *
     * @param \App\Services\Evaluation\NoteService $noteService
     */
    public function __construct(NoteService $noteService)
    {
        $this->noteService = $noteService;
    }

    /**
     * Affiche la liste paginée des notes.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Inertia\Response
     */
    protected function getEnseignantId(): ?int
    {
        $user = auth()->user();

        // Si l'utilisateur n'est pas enseignant → pas de filtre
        if (!$user || !$user->enseignant) {
            return null;
        }

        return $user->enseignant->id;
    }

    public function index(Request $request)
    {
        $perPage = (int) $request->get('perPage', 10);

        $enseignantId = $this->getEnseignantId(); // int|null

        $notes = $this->noteService->getPaginatedList(
            $perPage,
            $enseignantId
        );
        
        $stats = $this->noteService->getStatistics($enseignantId);

        return Inertia::render('Evaluation/Note/Index', [
            'notes' => $notes,
            'stats' => $stats,
        ]);
    }

    /**
     * Affiche le formulaire de création d'une nouvelle note.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        $enseignantId = $this->getEnseignantId();
        $trimestreActif = Trimestre::where('est_actif', true)->firstOrFail();

        $enseignements = Enseignement::where('enseignant_id', $enseignantId)
            ->with(['classe', 'matiere'])
            ->get();

        $classeIds = $enseignements->pluck('classe_id')->unique();
        $eleves = Eleve::whereIn('classe_id', $classeIds)
            ->with('user')
            ->get()
            ->sortBy('user.name')
            ->values();

        return Inertia::render('Evaluation/Note/Create', [
            'eleves' => $eleves,
            'enseignements' => $enseignements->map(fn($e) => [
                'id' => $e->id,
                'display_name' => "{$e->matiere->nom} - {$e->classe->nom}"
            ]),
            'trimestre_actif' => $trimestreActif,
            'sequence_active' => $trimestreActif->sequence_active, // On envoie la séquence précise
            // On peut restreindre les séquences selon le trimestre ici si besoin
            'sequences_possibles' => [1, 2, 3, 4, 5, 6], 
        ]);
    }

    /**
     * Stocke une nouvelle note en base de données.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $enseignantId = $this->getEnseignantId();

        $validated = $request->validate([
            'valeur' => 'required|numeric|min:0|max:20',
            'eleve_id' => 'required|exists:eleves,id',
            'enseignement_id' => [
                'required',
                // SÉCURITÉ : Vérifie que l'enseignement appartient bien à ce prof
                function ($attribute, $value, $fail) use ($enseignantId) {
                    $exists = Enseignement::where('id', $value)
                        ->where('enseignant_id', $enseignantId)
                        ->exists();
                    if (!$exists) $fail("Cet enseignement ne vous appartient pas.");
                },
            ],
            'trimestre_id' => 'required|exists:trimestres,id',
            'sequence' => 'required|integer|between:1,6',
            'type_evaluation' => 'required|in:Interrogation,Devoir,Examen',
            'date_evaluation' => 'required|date',
        ]);

        $this->noteService->create($validated);

        return redirect()->route('notes.index')->with('success', 'Note ajoutée.');
    }

    /**
     * Affiche les détails d'une note spécifique.
     *
     * @param \App\Models\Note $note
     * @return \Inertia\Response
     */
    public function show(Note $note)
    {
        $note = $this->noteService->findById($note->id);

        return Inertia::render('Evaluation/Note/Show', [
            'note' => $note,
        ]);
    }

    /**
     * Affiche le formulaire d'édition d'une note.
     *
     * @param \App\Models\Note $note
     * @return \Inertia\Response
     */
    public function edit(Note $note)
    {
        $enseignantId = $this->getEnseignantId();
        $trimestreActif = Trimestre::where('est_actif', true)->first();

        // SÉCURITÉ : On ne peut éditer que si c'est notre note ET que c'est le trimestre actif
    //  if ($note->enseignement->enseignant_id !== $enseignantId || $note->trimestre_id !== $trimestreActif?->id) {
    //     return redirect()->route('notes.index')->with('error', 'Modification impossible.');
    // }

        $enseignements = Enseignement::where('enseignant_id', $enseignantId)
            ->with(['classe', 'matiere'])
            ->get();

        $classeIds = $enseignements->pluck('classe_id')->unique();
        $eleves = Eleve::whereIn('classe_id', $classeIds)
            ->with('user')->get()->sortBy('user.name')->values();

        return Inertia::render('Evaluation/Note/Edit', [
            'note' => $this->noteService->findById($note->id, $enseignantId),
            'eleves' => $eleves,
            'enseignements' => $enseignements->map(fn($e) => [
                'id' => $e->id,
                'display_name' => "{$e->matiere->nom} - {$e->classe->nom}"
            ]),
            'trimestre_actif' => $trimestreActif,
        ]);
    }

    /**
     * Met à jour la note spécifiée en base de données.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Note $note
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Note $note)
    {
        $enseignantId = $this->getEnseignantId();
        $trimestreActif = Trimestre::where('est_actif', true)->first();

        // SÉCURITÉ STRICTE
        if ($note->enseignement->enseignant_id !== $enseignantId || $note->trimestre_id !== $trimestreActif?->id) {
            abort(403, "Action interdite sur un ancien trimestre.");
        }

        $validated = $request->validate([
            'valeur' => 'required|numeric|min:0|max:20',
            'eleve_id' => 'required|exists:eleves,id',
            'enseignement_id' => [
                'required',
                function ($attribute, $value, $fail) use ($enseignantId) {
                    $exists = Enseignement::where('id', $value)->where('enseignant_id', $enseignantId)->exists();
                    if (!$exists) $fail("Cet enseignement ne vous appartient pas.");
                },
            ],
            'trimestre_id' => 'required|in:' . $trimestreActif->id, // Force le trimestre actif
            'sequence' => 'required|integer|between:1,6',
            'type_evaluation' => 'required|in:Interrogation,Devoir,Examen',
            'date_evaluation' => 'required|date',
            'appreciation' => 'nullable|string',
        ]);

        $this->noteService->update($note->id, $validated, $enseignantId);

        return redirect()->route('notes.index')->with('success', 'Note mise à jour.');
    }

    /**
     * Supprime la note spécifiée de la base de données.
     *
     * @param \App\Models\Note $note
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Note $note)
    {
        $enseignantId = $this->getEnseignantId();
        $trimestreActif = Trimestre::where('est_actif', true)->first();

        if ($note->enseignement->enseignant_id !== $enseignantId || $note->trimestre_id !== $trimestreActif?->id) {
            abort(403, "Impossible de supprimer une note d'un trimestre passé.");
        }

        $this->noteService->delete($note->id, $enseignantId);
        return redirect()->route('notes.index')->with('success', 'Note supprimée.');
    }
}