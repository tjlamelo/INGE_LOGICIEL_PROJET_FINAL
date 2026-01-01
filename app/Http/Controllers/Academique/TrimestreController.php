<?php

namespace App\Http\Controllers\Academique;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\Academique\TrimestreService;
use App\Models\Trimestre;
use Inertia\Inertia;

class TrimestreController extends Controller
{
    /**
     * Le service de gestion des trimestres.
     *
     * @var \App\Services\Academique\TrimestreService
     */
    protected $trimestreService;

    /**
     * Crée une nouvelle instance de contrôleur.
     *
     * @param \App\Services\Academique\TrimestreService $trimestreService
     */
    public function __construct(TrimestreService $trimestreService)
    {
        $this->trimestreService = $trimestreService;
    }

    /**
     * Affiche la liste paginée des trimestres.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $perPage = $request->get('perPage', 10);
        $trimestres = $this->trimestreService->getPaginatedList((int) $perPage);

        return Inertia::render('Academique/Trimestre/Index', [
            'trimestres' => $trimestres,
        ]);
    }

    /**
     * Affiche le formulaire de création d'un nouveau trimestre.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('Academique/Trimestre/Create');
    }

    /**
     * Stocke un nouveau trimestre en base de données.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
$validated = $request->validate([
    'nom' => ['required', 'string', 'max:255', 
              'unique:trimestres,nom,NULL,id,annee_scolaire,' . $request->annee_scolaire],
    'annee_scolaire' => 'required|string|max:20',
]);


        $this->trimestreService->create($validated);

        return redirect()->route('trimestres.index')
            ->with('success', 'Trimestre créé avec succès.');
    }

    /**
     * Affiche les détails d'un trimestre spécifique.
     *
     * @param \App\Models\Trimestre $trimestre
     * @return \Inertia\Response
     */
    public function show(Trimestre $trimestre)
    {
        return Inertia::render('Academique/Trimestre/Show', [
            'trimestre' => $trimestre,
        ]);
    }

    /**
     * Affiche le formulaire d'édition d'un trimestre.
     *
     * @param \App\Models\Trimestre $trimestre
     * @return \Inertia\Response
     */
    public function edit(Trimestre $trimestre)
    {
        return Inertia::render('Academique/Trimestre/Edit', [
            'trimestre' => $trimestre,
        ]);
    }

    /**
     * Met à jour le trimestre spécifié en base de données.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Trimestre $trimestre
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Trimestre $trimestre)
    {
$validated = $request->validate([
    'nom' => ['required', 'string', 'max:255', 
              'unique:trimestres,nom,' . $trimestre->id . ',id,annee_scolaire,' . $request->annee_scolaire],
    'annee_scolaire' => 'required|string|max:20',
]);


        $this->trimestreService->update($trimestre->id, $validated);

        return redirect()->route('trimestres.index')
            ->with('success', 'Trimestre mis à jour avec succès.');
    }

    /**
     * Supprime le trimestre spécifié de la base de données.
     *
     * @param \App\Models\Trimestre $trimestre
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Trimestre $trimestre)
    {
        $this->trimestreService->delete($trimestre->id);

        return redirect()->route('trimestres.index')
            ->with('success', 'Trimestre supprimé avec succès.');
    }
}