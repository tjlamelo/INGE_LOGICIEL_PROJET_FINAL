<h2>Modifier la matière</h2>

<form method="POST" action="{{ route('admin.matieres.update', $matiere) }}">
    @csrf
    @method('PUT')

    <input type="text" name="nom" value="{{ $matiere->nom }}">
    <input type="text" name="code" value="{{ $matiere->code }}">
    <input type="number" name="coefficient" value="{{ $matiere->coefficient }}">

    <button>Mettre à jour</button>
</form>
