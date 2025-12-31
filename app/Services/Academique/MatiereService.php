<?php

declare(strict_types=1);

namespace App\Services\Academique;

use App\Models\Matiere;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

/**
 * Service pour la gestion des opérations CRUD sur le modèle Matiere.
 */
final class MatiereService
{
    /**
     * Récupère une liste paginée de toutes les matières.
     *
     * @param int $perPage Le nombre d'éléments par page (défaut: 10).
     * @return LengthAwarePaginator
     */
    public function getPaginatedList(int $perPage = 10): LengthAwarePaginator
    {
        return Matiere::query()->orderBy('nom', 'asc')->paginate($perPage);
    }

    /**
     * Trouve une matière par son identifiant.
     *
     * @param int $id L'identifiant de la matière.
     * @return Matiere
     * @throws ModelNotFoundException Si la matière n'est pas trouvée.
     */
    public function findById(int $id): Matiere
    {
        return Matiere::findOrFail($id);
    }

    /**
     * Crée une nouvelle matière.
     *
     * @param array $data Les données de la matière (ex: ['nom' => 'Physique', 'code' => 'PHY']).
     * @return Matiere La matière nouvellement créée.
     */
    public function create(array $data): Matiere
    {
        return Matiere::create($data);
    }

    /**
     * Met à jour une matière existante.
     *
     * @param int $id L'identifiant de la matière à mettre à jour.
     * @param array $data Les nouvelles données de la matière.
     * @return Matiere La matière mise à jour.
     * @throws ModelNotFoundException Si la matière n'est pas trouvée.
     */
    public function update(int $id, array $data): Matiere
    {
        $matiere = $this->findById($id);
        $matiere->update($data);
        
        return $matiere;
    }

    /**
     * Supprime une matière.
     *
     * @param int $id L'identifiant de la matière à supprimer.
     * @return bool True si la suppression a réussi, false sinon.
     * @throws ModelNotFoundException Si la matière n'est pas trouvée.
     */
    public function delete(int $id): bool
    {
        $matiere = $this->findById($id);
        
        return $matiere->delete();
    }
}