<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\User\EnseignantService;
use App\Models\Enseignant;
use App\Models\User; // Nécessaire pour le formulaire
use Inertia\Inertia;

class EnseignantController extends Controller
{
    /**
     * Le service de gestion des enseignants.
     *
     * @var \App\Services\User\EnseignantService
     */
    protected $enseignantService;

    /**
     * Crée une nouvelle instance de contrôleur.
     *
     * @param \App\Services\User\EnseignantService $enseignantService
     */
    public function __construct(EnseignantService $enseignantService)
    {
        $this->enseignantService = $enseignantService;
    }

    /**
     * Affiche la liste paginée des enseignants.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $perPage = $request->get('perPage', 10);
        $enseignants = $this->enseignantService->getPaginatedList((int) $perPage);

        return Inertia::render('User/Enseignant/Index', [
            'enseignants' => $enseignants,
        ]);
    }

    /**
     * Affiche le formulaire de création d'un nouvel enseignant.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        // On récupère les utilisateurs qui n'ont pas encore de profil enseignant
        $users = User::whereDoesntHave('enseignant')->orderBy('name')->get();

        return Inertia::render('User/Enseignant/Create', [
            'users' => $users,
        ]);
    }

    /**
     * Stocke un nouvel enseignant en base de données.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id|unique:enseignants,user_id',
            'matricule' => 'required|string|max:255|unique:enseignants,matricule',
            'telephone' => 'nullable|string|max:20',
            'adresse' => 'nullable|string|max:255',
        ]);

        $this->enseignantService->create($validated);

        return redirect()->route('enseignants.index')
            ->with('success', 'Enseignant créé avec succès.');
    }

    /**
     * Affiche les détails d'un enseignant spécifique.
     *
     * @param \App\Models\Enseignant $enseignant
     * @return \Inertia\Response
     */
    public function show(Enseignant $enseignant)
    {
        $enseignant->load('user');

        return Inertia::render('User/Enseignant/Show', [
            'enseignant' => $enseignant,
        ]);
    }

    /**
     * Affiche le formulaire d'édition d'un enseignant.
     *
     * @param \App\Models\Enseignant $enseignant
     * @return \Inertia\Response
     */
    public function edit(Enseignant $enseignant)
    {
        $enseignant->load('user');
        // Pour l'édition, on récupère tous les utilisateurs au cas où on veut changer l'association
        $users = User::orderBy('name')->get();

        return Inertia::render('User/Enseignant/Edit', [
            'enseignant' => $enseignant,
            'users' => $users,
        ]);
    }

    /**
     * Met à jour l'enseignant spécifié en base de données.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Enseignant $enseignant
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Enseignant $enseignant)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id|unique:enseignants,user_id,' . $enseignant->id,
            'matricule' => 'required|string|max:255|unique:enseignants,matricule,' . $enseignant->id,
            'telephone' => 'nullable|string|max:20',
            'adresse' => 'nullable|string|max:255',
        ]);

        $this->enseignantService->update($enseignant->id, $validated);

        return redirect()->route('enseignants.index')
            ->with('success', 'Enseignant mis à jour avec succès.');
    }

    /**
     * Supprime l'enseignant spécifié de la base de données.
     *
     * @param \App\Models\Enseignant $enseignant
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Enseignant $enseignant)
    {
        $this->enseignantService->delete($enseignant->id);

        return redirect()->route('enseignants.index')
            ->with('success', 'Enseignant supprimé avec succès.');
    }
}