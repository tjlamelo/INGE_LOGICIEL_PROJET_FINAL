<?php

declare(strict_types=1);

namespace App\Services\User;

use App\Models\Enseignant;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

/**
 * Service pour la gestion des opérations CRUD sur le modèle Enseignant.
 */
final class EnseignantService
{
    /**
     * Récupère une liste paginée de tous les enseignants avec leur utilisateur associé.
     *
     * @param int $perPage Le nombre d'éléments par page (défaut: 10).
     * @return LengthAwarePaginator
     */
    public function getPaginatedList(int $perPage = 10): LengthAwarePaginator
    {
        return Enseignant::query()
            ->join('users', 'enseignants.user_id', '=', 'users.id')
            ->select('enseignants.*', 'users.name as user_name', 'users.email as user_email')
            ->orderBy('user_name', 'asc')
            ->paginate($perPage);
    }

    /**
     * Trouve un enseignant par son identifiant, en chargeant la relation utilisateur.
     *
     * @param int $id L'identifiant de l'enseignant.
     * @return Enseignant
     * @throws ModelNotFoundException Si l'enseignant n'est pas trouvé.
     */
    public function findById(int $id): Enseignant
    {
        return Enseignant::with('user')->findOrFail($id);
    }

    /**
     * Crée un nouvel enseignant.
     *
     * @param array $data Les données de l'enseignant.
     * @return Enseignant L'enseignant nouvellement créé.
     */
    public function create(array $data): Enseignant
    {
        return Enseignant::create($data);
    }

    /**
     * Met à jour un enseignant existant.
     *
     * @param int $id L'identifiant de l'enseignant à mettre à jour.
     * @param array $data Les nouvelles données de l'enseignant.
     * @return Enseignant L'enseignant mis à jour.
     * @throws ModelNotFoundException Si l'enseignant n'est pas trouvé.
     */
    public function update(int $id, array $data): Enseignant
    {
        $enseignant = $this->findById($id);
        $enseignant->update($data);
        
        return $enseignant;
    }

    /**
     * Supprime un enseignant.
     * Attention : La suppression de l'enseignant entraînera aussi la suppression de l'utilisateur associé
     * à cause de la contrainte `onDelete('cascade')` sur la clé `user_id`.
     *
     * @param int $id L'identifiant de l'enseignant à supprimer.
     * @return bool True si la suppression a réussi, false sinon.
     * @throws ModelNotFoundException Si l'enseignant n'est pas trouvé.
     */
    public function delete(int $id): bool
    {
        $enseignant = $this->findById($id);
        
        return $enseignant->delete();
    }
}