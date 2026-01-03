<h2 class="text-2xl font-bold mb-4">
    {{ isset($matiere) ? 'Modifier' : 'Ajouter' }} une matière
</h2>

<form method="POST"
      action="{{ isset($matiere)
        ? route('admin.matieres.update', $matiere)
        : route('admin.matieres.store') }}"
      class="max-w-md space-y-4">

    @csrf
    @if(isset($matiere))
        @method('PUT')
    @endif

    <div>
        <label class="block mb-1">Nom</label>
        <input type="text" name="nom"
               value="{{ old('nom', $matiere->nom ?? '') }}"
               class="w-full border px-3 py-2 rounded">
    </div>

    <div>
        <label class="block mb-1">Code</label>
        <input type="text" name="code"
               value="{{ old('code', $matiere->code ?? '') }}"
               class="w-full border px-3 py-2 rounded">
    </div>

    <div>
        <label class="block mb-1">Coefficient</label>
        <input type="number" name="coefficient"
               value="{{ old('coefficient', $matiere->coefficient ?? '') }}"
               class="w-full border px-3 py-2 rounded">
    </div>

    <div class="flex gap-2">
        <button class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Enregistrer
        </button>

        <a href="{{ route('admin.matieres.index') }}"
           class="px-4 py-2 bg-gray-400 text-white rounded">
           Annuler
        </a>
    </div>
</form>
