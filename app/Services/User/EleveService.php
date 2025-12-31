<?php

declare(strict_types=1);

namespace App\Services\User;

use App\Models\Eleve;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

final class EleveService
{
    /**
     * Récupère une liste paginée de tous les élèves avec leurs relations.
     *
     * @param int $perPage
     * @return LengthAwarePaginator
     */
 public function getPaginatedList(int $perPage = 10)
{
    return Eleve::with(['user', 'classe'])
        ->paginate($perPage)
        ->through(function ($eleve) {
            return [
                'id' => $eleve->id,
                'matricule' => $eleve->matricule,
                'date_naissance' => $eleve->date_naissance,
                'lieu_naissance' => $eleve->lieu_naissance,
                'sexe' => $eleve->sexe,
                'nom_tuteur' => $eleve->nom_tuteur,
                'contact_tuteur' => $eleve->contact_tuteur,
                'user_name' => $eleve->user?->name,
                'user_email' => $eleve->user?->email,
                'classe_nom' => $eleve->classe?->nom,
            ];
        });
}

    /**
     * Trouve un élève par son ID avec ses relations.
     *
     * @param int $id
     * @return Eleve
     * @throws ModelNotFoundException
     */
public function findById(?int $id): ?Eleve
{
    if (!$id) {
        return null;
    }

    return Eleve::with(['user', 'classe'])->find($id); // ⚡️ on charge les relations
}


    /**
     * Crée un nouvel élève.
     */
    public function create(array $data): Eleve
    {
        return Eleve::create($data);
    }

    /**
     * Met à jour un élève existant.
     */
    public function update(int $id, array $data): Eleve
    {
        $eleve = $this->findById($id);
        $eleve->update($data);
        return $eleve;
    }

    /**
     * Supprime un élève.
     */
    public function delete(int $id): bool
    {
        $eleve = $this->findById($id);
        return $eleve->delete();
    }
}
