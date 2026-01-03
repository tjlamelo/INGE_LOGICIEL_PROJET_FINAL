<h2 class="text-2xl font-bold mb-4">Liste des matières</h2>

<a href="{{ route('admin.matieres.create') }}"
   class="inline-block mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
   Ajouter une matière
</a>

<div class="overflow-x-auto">
<table class="min-w-full border border-gray-300">
    <thead class="bg-gray-100">
        <tr>
            <th class="border px-4 py-2">Nom</th>
            <th class="border px-4 py-2">Code</th>
            <th class="border px-4 py-2">Coefficient</th>
            <th class="border px-4 py-2">Actions</th>
        </tr>
    </thead>
    <tbody>
    @foreach($matieres as $matiere)
        <tr class="text-center">
            <td class="border px-4 py-2">{{ $matiere->nom }}</td>
            <td class="border px-4 py-2">{{ $matiere->code }}</td>
            <td class="border px-4 py-2">{{ $matiere->coefficient }}</td>
            <td class="border px-4 py-2 space-x-2">
                <a href="{{ route('admin.matieres.edit', $matiere) }}"
                   class="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                   Modifier
                </a>

                <form method="POST"
                      action="{{ route('admin.matieres.destroy', $matiere) }}"
                      class="inline">
                    @csrf
                    @method('DELETE')
                    <button class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                            onclick="return confirm('Supprimer ?')">
                        Supprimer
                    </button>
                </form>
            </td>
        </tr>
    @endforeach
    </tbody>
</table>
</div>
