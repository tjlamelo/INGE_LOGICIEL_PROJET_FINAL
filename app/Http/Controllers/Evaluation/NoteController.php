<?php

namespace App\Http\Controllers\Evaluation;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\Evaluation\NoteService;
use App\Models\Note;
use App\Models\Eleve;
use App\Models\Enseignement;
use App\Models\Trimestre;
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
    public function index(Request $request)
    {
        $perPage = $request->get('perPage', 10);
        $notes = $this->noteService->getPaginatedList((int) $perPage);

        return Inertia::render('Evaluation/Note/Index', [
            'notes' => $notes,
        ]);
    }

    /**
     * Affiche le formulaire de création d'une nouvelle note.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        // Récupération des données pour les menus déroulants
        $eleves = Eleve::with('user')
            ->get()
            ->sortBy(fn($eleve) => $eleve->user?->name);

        $enseignements = Enseignement::with('classe', 'matiere', 'enseignant.user')
            ->get()
            ->map(function ($enseignement) {

                $enseignantName = $enseignement->enseignant?->user?->name;
                $enseignantName = $enseignantName ?: 'Non assigné';

                return [
                    'id' => $enseignement->id,
                    'display_name' =>
                        ($enseignement->matiere?->nom ?? 'Matière inconnue') . ' - ' .
                        ($enseignement->classe?->nom ?? 'Classe inconnue') . ' (' .
                        $enseignantName . ')',
                ];
            });

        $trimestres = Trimestre::orderBy('annee_scolaire', 'desc')->orderBy('nom')->get();

        return Inertia::render('Evaluation/Note/Create', [
            'eleves' => $eleves,
            'enseignements' => $enseignements,
            'trimestres' => $trimestres,
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
        $validated = $request->validate([
            'valeur' => 'required|numeric|min:0|max:20',
            'eleve_id' => 'required|exists:eleves,id',
            'enseignement_id' => 'required|exists:enseignements,id',
            'trimestre_id' => 'required|exists:trimestres,id',
            'type_evaluation' => 'nullable|string|max:255',
            'date_evaluation' => 'required|date',
            'appreciation' => 'nullable|string',
        ]);

        $this->noteService->create($validated);

        return redirect()->route('notes.index')
            ->with('success', 'Note créée avec succès.');
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
        // Récupération des données pour les menus déroulants
        $eleves = Eleve::with('user')
            ->get()
            ->sortBy(fn($eleve) => $eleve->user?->name);

        $enseignements = Enseignement::with('classe', 'matiere', 'enseignant.user')
            ->get()
            ->map(function ($enseignement) {

                $enseignantName = $enseignement->enseignant?->user?->name;
                $enseignantName = $enseignantName ?: 'Non assigné';

                return [
                    'id' => $enseignement->id,
                    'display_name' =>
                        ($enseignement->matiere?->nom ?? 'Matière inconnue') . ' - ' .
                        ($enseignement->classe?->nom ?? 'Classe inconnue') . ' (' .
                        $enseignantName . ')',
                ];
            });


        $trimestres = Trimestre::orderBy('annee_scolaire', 'desc')->orderBy('nom')->get();

        $note = $this->noteService->findById($note->id);

        return Inertia::render('Evaluation/Note/Edit', [
            'note' => $note,
            'eleves' => $eleves,
            'enseignements' => $enseignements,
            'trimestres' => $trimestres,
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
        $validated = $request->validate([
            'valeur' => 'required|numeric|min:0|max:20',
            'eleve_id' => 'required|exists:eleves,id',
            'enseignement_id' => 'required|exists:enseignements,id',
            'trimestre_id' => 'required|exists:trimestres,id',
            'type_evaluation' => 'nullable|string|max:255',
            'date_evaluation' => 'required|date',
            'appreciation' => 'nullable|string',
        ]);

        $this->noteService->update($note->id, $validated);

        return redirect()->route('notes.index')
            ->with('success', 'Note mise à jour avec succès.');
    }

    /**
     * Supprime la note spécifiée de la base de données.
     *
     * @param \App\Models\Note $note
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Note $note)
    {
        $this->noteService->delete($note->id);

        return redirect()->route('notes.index')
            ->with('success', 'Note supprimée avec succès.');
    }
}