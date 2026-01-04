<?php

namespace App\Http\Controllers\Academique;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\Academique\ClasseService;
use App\Models\Classe;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ClasseController extends Controller
{
    /**
     * Le service de gestion des classes.
     *
     * @var \App\Services\Academique\ClasseService
     */
    protected $classeService;

    /**
     * Crée une nouvelle instance de contrôleur.
     *
     * @param \App\Services\Academique\ClasseService $classeService
     */
    public function __construct(ClasseService $classeService)
    {
        $this->classeService = $classeService;
    }

    /**
     * Affiche la liste paginée des classes avec statistiques.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $perPage = $request->get('perPage', 10);
        $classes = $this->classeService->getPaginatedList((int) $perPage);
        $stats = $this->classeService->getStatistics();

        return Inertia::render('Academique/Classe/Index', [
            'classes' => $classes,
            'stats' => $stats,
        ]);
    }

    /**
     * Affiche le formulaire de création d'une nouvelle classe.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('Academique/Classe/Create');
    }

    /**
     * Stocke une nouvelle classe en base de données.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255|unique:classes,nom',
            'niveau' => 'required|string|max:255',
            'filiere' => 'nullable|string|max:255',
        ]);

        $this->classeService->create($validated);

        return redirect()->route('classes.index')
            ->with('success', 'Classe créée avec succès.');
    }

    /**
     * Affiche les détails d'une classe spécifique.
     *
     * @param \App\Models\Classe $classe
     * @return \Inertia\Response
     */
    public function show(Classe $class)
    {
        Log::info('Classe show:', ['classe' => $class->toArray()]);
        return Inertia::render('Academique/Classe/Show', [
            'classe' => $class,
        ]);
    }

    /**
     * Affiche le formulaire d'édition d'une classe.
     *
     * @param \App\Models\Classe $classe
     * @return \Inertia\Response
     */
    public function edit(Classe $class)
    {
        return Inertia::render('Academique/Classe/Edit', [
            'classe' => $class,
        ]);
    }

    /**
     * Met à jour la classe spécifiée en base de données.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Classe $classe
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Classe $classe)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255|unique:classes,nom,' . $classe->id,
            'niveau' => 'required|string|max:255',
            'filiere' => 'nullable|string|max:255',
        ]);

        $this->classeService->update($classe->id, $validated);

        return redirect()->route('classes.index')
            ->with('success', 'Classe mise à jour avec succès.');
    }

    /**
     * Supprime la classe spécifiée de la base de données.
     *
     * @param \App\Models\Classe $classe
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Classe $class)
    {
        $this->classeService->delete($class->id);

        return redirect()->route('classes.index')
            ->with('success', 'Classe supprimée avec succès.');
    }
}