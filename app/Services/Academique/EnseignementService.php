<?php

declare(strict_types=1);

namespace App\Services\Academique;

use App\Models\Enseignement;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

/**
 * Service pour la gestion des opérations CRUD sur le modèle Enseignement.
 */
final class EnseignementService
{
    /**
     * Récupère une liste paginée de tous les enseignements avec les détails des entités liées.
     * Utilise des jointures pour être efficace et trier par nom de classe et de matière.
     *
     * @param int $perPage Le nombre d'éléments par page (défaut: 10).
     * @return LengthAwarePaginator
     */
    public function getPaginatedList(int $perPage = 10): LengthAwarePaginator
    {
     return Enseignement::query()
    ->join('enseignants', 'enseignements.enseignant_id', '=', 'enseignants.id')
    ->join('users', 'enseignants.user_id', '=', 'users.id') // <-- user_id existe dans enseignants
    ->join('classes', 'enseignements.classe_id', '=', 'classes.id')
    ->join('matieres', 'enseignements.matiere_id', '=', 'matieres.id')
    ->select(
        'enseignements.*', 
        'users.name as enseignant_name', 
        'classes.nom as classe_nom', 
        'matieres.nom as matiere_nom'
    )
    ->orderBy('classe_nom')
    ->orderBy('matiere_nom')
    ->paginate($perPage);

    }

    /**
     * Trouve un enseignement par son identifiant, en chargeant les relations utiles.
     *
     * @param int $id L'identifiant de l'enseignement.
     * @return Enseignement
     * @throws ModelNotFoundException Si l'enseignement n'est pas trouvé.
     */
    public function findById(int $id): Enseignement
    {
        // On charge l'utilisateur lié à l'enseignant pour avoir le nom
        return Enseignement::with('enseignant.user', 'classe', 'matiere')->findOrFail($id);
    }

    /**
     * Crée un nouvel enseignement.
     *
     * @param array $data Les données de l'enseignement.
     * @return Enseignement L'enseignement nouvellement créé.
     */
    public function create(array $data): Enseignement
    {
        return Enseignement::create($data);
    }

    /**
     * Met à jour un enseignement existant.
     *
     * @param int $id L'identifiant de l'enseignement à mettre à jour.
     * @param array $data Les nouvelles données de l'enseignement.
     * @return Enseignement L'enseignement mis à jour.
     * @throws ModelNotFoundException Si l'enseignement n'est pas trouvé.
     */
    public function update(int $id, array $data): Enseignement
    {
        $enseignement = $this->findById($id);
        $enseignement->update($data);
        
        return $enseignement;
    }

    /**
     * Supprime un enseignement.
     *
     * @param int $id L'identifiant de l'enseignement à supprimer.
     * @return bool True si la suppression a réussi, false sinon.
     * @throws ModelNotFoundException Si l'enseignement n'est pas trouvé.
     */
    public function delete(int $id): bool
    {
        $enseignement = $this->findById($id);
        
        return $enseignement->delete();
    }
}