<?php

namespace App\Services\Academique;

use App\Models\Salle;

class SalleService
{
    public function getPaginatedList(int $perPage = 10)
    {
        return Salle::paginate($perPage);
    }

    public function create(array $data)
    {
        return Salle::create($data);
    }

    public function update(int $id, array $data)
    {
        $salle = Salle::findOrFail($id);
        $salle->update($data);
        return $salle;
    }

    public function delete(int $id)
    {
        $salle = Salle::findOrFail($id);
        $salle->delete();
        return true;
    }
}
