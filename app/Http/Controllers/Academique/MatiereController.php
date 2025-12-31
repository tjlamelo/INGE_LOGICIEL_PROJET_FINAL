<?php

namespace App\Http\Controllers\Academique;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Services\Academique\MatiereService;
use App\Models\Matiere;
use Inertia\Inertia;

class MatiereController extends Controller
{
    /**
     * Le service de gestion des matières.
     * L'injection de dépendances dans le constructeur est une meilleure pratique.
     *
     * @var \App\Services\Academique\MatiereService
     */
    protected $matiereService;

    /**
     * Crée une nouvelle instance de contrôleur.
     *
     * @param \App\Services\Academique\MatiereService $matiereService
     */
    public function __construct(MatiereService $matiereService)
    {
        $this->matiereService = $matiereService;
    }

    /**
     * Affiche la liste paginée des matières.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        // Récupère le nombre d'éléments par page depuis la requête (ex: ?perPage=20)
        // Par défaut, 10 si non spécifié.
        $perPage = $request->get('perPage', 10);

        $matieres = $this->matiereService->getPaginatedList((int) $perPage);

        return Inertia::render('Academique/Matiere/Index', [
            'matieres' => $matieres,
        ]);
    }

    /**
     * Affiche le formulaire de création d'une nouvelle matière.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('Academique/Matiere/Create');
    }

    /**
     * Stocke une nouvelle matière en base de données.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'code' => 'required|string|max:10|unique:matieres,code',
        ]);

        $this->matiereService->create($validated);

        return redirect()->route('matieres.index')
            ->with('success', 'Matière créée avec succès.');
    }

    /**
     * Affiche les détails d'une matière spécifique.
     * Ici, on utilise le "Route Model Binding" de Laravel qui est très efficace.
     *
     * @param \App\Models\Matiere $matiere
     * @return \Inertia\Response
     */
    public function show(Matiere $matiere)
    {
        return Inertia::render('Academique/Matiere/Show', [
            'matiere' => $matiere,
        ]);
    }

    /**
     * Affiche le formulaire d'édition d'une matière.
     *
     * @param \App\Models\Matiere $matiere
     * @return \Inertia\Response
     */
    public function edit(Matiere $matiere)
    {
        return Inertia::render('Academique/Matiere/Edit', [
            'matiere' => $matiere,
        ]);
    }

    /**
     * Met à jour la matière spécifiée en base de données.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Matiere $matiere
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Matiere $matiere)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            // La règle 'unique' ignore l'ID de la matière actuelle lors de la vérification
            'code' => 'required|string|max:10|unique:matieres,code,' . $matiere->id,
        ]);

        $this->matiereService->update($matiere->id, $validated);

        return redirect()->route('matieres.index')
            ->with('success', 'Matière mise à jour avec succès.');
    }

    /**
     * Supprime la matière spécifiée de la base de données.
     *
     * @param \App\Models\Matiere $matiere
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Matiere $matiere)
    {
        $this->matiereService->delete($matiere->id);

        return redirect()->route('matieres.index')
            ->with('success', 'Matière supprimée avec succès.');
    }
}