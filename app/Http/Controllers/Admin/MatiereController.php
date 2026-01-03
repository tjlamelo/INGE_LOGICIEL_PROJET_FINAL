<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Matiere;

class MatiereController extends Controller
{
    //Affichage des matières
     public function index()
    {
        $matieres = Matiere::all();
        return view('admin.matieres.index', compact('matieres'));
    }

    //Formulaire d'ajout
    public function create()
    {
        return view('admin.matieres.create');
    }

    // Enregistrer une matière
    public function store(Request $request)
    {
        Matiere::create($request->all());
        return redirect()->route('admin.matieres.index');
    }

    // Supprimer
    public function destroy(Matiere $matiere)
    {
        $matiere->delete();
        return redirect()->back();
    }

    //modifier
    public function edit(Matiere $matiere)
    {
        return view('admin.matieres.edit', compact('matiere'));
    }

    public function update(Request $request, Matiere $matiere)
{
    $request->validate([
        'nom' => 'required|string|max:255',
        'code' => 'required|string|max:10',
        'coefficient' => 'required|integer',
    ]);

    $matiere->update([
        'nom' => $request->nom,
        'code' => $request->code,
        'coefficient' => $request->coefficient,
    ]);

    return redirect()->route('admin.matieres.index')
                     ->with('success', 'Matière modifiée avec succès');
}

}
