<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Classe;
use App\Models\Eleve;
use App\Services\User\EleveService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EleveController extends Controller
{
    protected EleveService $eleveService;

    public function __construct(EleveService $eleveService)
    {
        $this->eleveService = $eleveService;
    }

    public function index(Request $request)
    {
        $perPage = $request->get('perPage', 10);
        $eleves = $this->eleveService->getPaginatedList((int) $perPage);

        return Inertia::render('User/Eleve/Index', [
            'eleves' => $eleves,
        ]);
    }

    public function create()
    {
        $classes = Classe::orderBy('niveau')->orderBy('nom')->get();
        $users = User::orderBy('name')->get();

        return Inertia::render('User/Eleve/Create', [
            'classes' => $classes,
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id|unique:eleves,user_id',
            'matricule' => 'required|string|max:255|unique:eleves,matricule',
            'date_naissance' => 'required|date',
            'lieu_naissance' => 'nullable|string|max:255',
            'sexe' => 'required|string|in:M,F',
            'nom_tuteur' => 'nullable|string|max:255',
            'contact_tuteur' => 'nullable|string|max:255',
            'classe_id' => 'nullable|exists:classes,id',
        ]);

        $this->eleveService->create($validated);

        return redirect()->route('eleves.index')
            ->with('success', 'Élève créé avec succès.');
    }

   public function show($id)
{
    try {
        $eleve = $this->eleveService->findById((int) $id);

        return Inertia::render('User/Eleve/Show', [
            'eleve' => $eleve->load('user', 'classe'),
        ]);
    } catch (\Exception $e) {
        return redirect()->route('eleves.index')
            ->with('error', $e->getMessage());
    }
}


public function edit(Eleve $eleve)
{
    $eleve = $this->eleveService->findById($eleve->id);
// dd($eleve);

    // if (!$eleve) {
    //     return redirect()->route('eleves.index')
    //         ->with('error', 'Élève non trouvé.');
    // }

    $classes = Classe::orderBy('niveau')->orderBy('nom')->get();
    $users = User::orderBy('name')->get();

    return Inertia::render('User/Eleve/Edit', [
        'eleve' => [
            ...$eleve->toArray(),
            'user' => $eleve->user ? $eleve->user->toArray() : ['id' => null, 'name' => 'Non défini', 'email' => ''],
            'classe' => $eleve->classe ? $eleve->classe->toArray() : ['id' => null, 'nom' => 'Non assignée'],
        ],
        'classes' => $classes,
        'users' => $users,
    ]);
}


    public function update(Request $request, Eleve $eleve)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id|unique:eleves,user_id,' . $eleve->id,
            'matricule' => 'required|string|max:255|unique:eleves,matricule,' . $eleve->id,
            'date_naissance' => 'required|date',
            'lieu_naissance' => 'nullable|string|max:255',
            'sexe' => 'required|string|in:M,F',
            'nom_tuteur' => 'nullable|string|max:255',
            'contact_tuteur' => 'nullable|string|max:255',
            'classe_id' => 'nullable|exists:classes,id',
        ]);

        $this->eleveService->update($eleve->id, $validated);

        return redirect()->route('eleves.index')
            ->with('success', 'Élève mis à jour avec succès.');
    }

    public function destroy(Eleve $eleve)
    {
        $this->eleveService->delete($eleve->id);

        return redirect()->route('eleves.index')
            ->with('success', 'Élève supprimé avec succès.');
    }
}
