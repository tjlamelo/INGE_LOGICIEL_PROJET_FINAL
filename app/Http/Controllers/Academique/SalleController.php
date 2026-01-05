<?php

namespace App\Http\Controllers\Academique;

use App\Http\Controllers\Controller;
use App\Models\Salle;
use App\Services\Academique\SalleService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SalleController extends Controller
{
    protected SalleService $salleService;

    public function __construct(SalleService $salleService)
    {
        $this->salleService = $salleService;
    }

    public function index(Request $request)
    {
        $perPage = $request->get('perPage', 10);
        $salles = $this->salleService->getPaginatedList($perPage);

        return Inertia::render('Academique/Salle/Index', [
            'salles' => $salles,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Academique/Salle/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255|unique:salles,nom',
            'capacite' => 'nullable|integer',
            'type' => 'nullable|string|max:100',
        ]);

        $this->salleService->create($validated);

        return redirect()->route('salles.index')
            ->with('success', 'Salle créée avec succès.');
    }

    public function edit(Salle $salle)
    {
        return Inertia::render('Academique/Salle/Edit', [
            'salle' => $salle,
        ]);
    }

    public function update(Request $request, Salle $salle)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255|unique:salles,nom,' . $salle->id,
            'capacite' => 'nullable|integer',
            'type' => 'nullable|string|max:100',
        ]);

        $this->salleService->update($salle->id, $validated);

        return redirect()->route('salles.index')
            ->with('success', 'Salle mise à jour avec succès.');
    }

    public function destroy(Salle $salle)
    {
        $this->salleService->delete($salle->id);

        return redirect()->route('salles.index')
            ->with('success', 'Salle supprimée avec succès.');
    }
}
