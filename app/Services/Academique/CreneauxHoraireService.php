<?php

namespace App\Services\Academique;

use App\Models\CreneauHoraire;

class CreneauHoraireService
{
    public function getPaginatedList(int $perPage = 10)
    {
        return CreneauHoraire::paginate($perPage);
    }

    public function create(array $data): CreneauHoraire
    {
        return CreneauHoraire::create($data);
    }

    public function update(int $id, array $data): bool
    {
        $creneau = CreneauHoraire::findOrFail($id);
        return $creneau->update($data);
    }

    public function delete(int $id): bool
    {
        $creneau = CreneauHoraire::findOrFail($id);
        return $creneau->delete();
    }
}
