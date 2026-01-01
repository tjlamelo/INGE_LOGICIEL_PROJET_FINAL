<?php

declare(strict_types=1);

namespace App\Services\Academique;

use App\Models\Trimestre;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

/**
 * Service pour la gestion des opérations CRUD sur le modèle Trimestre.
 */
final class TrimestreService
{
    /**
     * Récupère une liste paginée de tous les trimestres.
     * On ordonne par année scolaire (la plus récente d'abord) puis par nom.
     *
     * @param int $perPage Le nombre d'éléments par page (défaut: 10).
     * @return LengthAwarePaginator
     */
    public function getPaginatedList(int $perPage = 10): LengthAwarePaginator
    {
        return Trimestre::query()
            ->orderBy('annee_scolaire', 'desc')
            ->orderBy('nom', 'asc')
            ->paginate($perPage);
    }

    /**
     * Trouve un trimestre par son identifiant.
     *
     * @param int $id L'identifiant du trimestre.
     * @return Trimestre
     * @throws ModelNotFoundException Si le trimestre n'est pas trouvé.
     */
    public function findById(int $id): Trimestre
    {
        return Trimestre::findOrFail($id);
    }

    /**
     * Crée un nouveau trimestre.
     *
     * @param array $data Les données du trimestre (ex: ['nom' => '1er Trimestre', 'annee_scolaire' => '2023-2024']).
     * @return Trimestre Le trimestre nouvellement créé.
     */
    public function create(array $data): Trimestre
    {
        return Trimestre::create($data);
    }

    /**
     * Met à jour un trimestre existant.
     *
     * @param int $id L'identifiant du trimestre à mettre à jour.
     * @param array $data Les nouvelles données du trimestre.
     * @return Trimestre Le trimestre mis à jour.
     * @throws ModelNotFoundException Si le trimestre n'est pas trouvé.
     */
    public function update(int $id, array $data): Trimestre
    {
        $trimestre = $this->findById($id);
        $trimestre->update($data);
        
        return $trimestre;
    }

    /**
     * Supprime un trimestre.
     *
     * @param int $id L'identifiant du trimestre à supprimer.
     * @return bool True si la suppression a réussi, false sinon.
     * @throws ModelNotFoundException Si le trimestre n'est pas trouvé.
     */
    public function delete(int $id): bool
    {
        $trimestre = $this->findById($id);
        
        return $trimestre->delete();
    }
}