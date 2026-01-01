<?php

declare(strict_types=1);

namespace App\Services\Evaluation;

use App\Models\Note;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

/**
 * Service pour la gestion des opérations CRUD sur le modèle Note.
 */
final class NoteService
{
    /**
     * Récupère une liste paginée de toutes les notes avec les détails des entités liées.
     * Cette requête est complexe mais très efficace pour l'affichage.
     *
     * @param int $perPage Le nombre d'éléments par page (défaut: 10).
     * @return LengthAwarePaginator
     */
    public function getPaginatedList(int $perPage = 10): LengthAwarePaginator
    {
        return Note::query()
            ->join('eleves', 'notes.eleve_id', '=', 'eleves.id')
            ->join('users', 'eleves.user_id', '=', 'users.id')
            ->join('enseignements', 'notes.enseignement_id', '=', 'enseignements.id')
            ->join('matieres', 'enseignements.matiere_id', '=', 'matieres.id')
            ->join('classes', 'enseignements.classe_id', '=', 'classes.id')
            ->join('trimestres', 'notes.trimestre_id', '=', 'trimestres.id')
            ->select(
                'notes.*',
                'users.name as eleve_name',
                'matieres.nom as matiere_nom',
                'classes.nom as classe_nom',
                'trimestres.nom as trimestre_nom',
                'trimestres.annee_scolaire'
            )
            ->orderBy('trimestres.annee_scolaire', 'desc')
            ->orderBy('classe_nom')
            ->orderBy('eleve_name')
            ->orderBy('matiere_nom')
            ->paginate($perPage);
    }

    /**
     * Trouve une note par son identifiant, en chargeant toutes les relations utiles.
     *
     * @param int $id L'identifiant de la note.
     * @return Note
     * @throws ModelNotFoundException Si la note n'est pas trouvée.
     */
    public function findById(int $id): Note
    {
        return Note::with(
            'eleve.user',
            'enseignement.classe',
            'enseignement.matiere',
            'enseignement.enseignant.user',
            'trimestre'
        )->findOrFail($id);
    }

    /**
     * Crée une nouvelle note.
     *
     * @param array $data Les données de la note.
     * @return Note La note nouvellement créée.
     */
    public function create(array $data): Note
    {
        return Note::create($data);
    }

    /**
     * Met à jour une note existante.
     *
     * @param int $id L'identifiant de la note à mettre à jour.
     * @param array $data Les nouvelles données de la note.
     * @return Note La note mise à jour.
     * @throws ModelNotFoundException Si la note n'est pas trouvée.
     */
    public function update(int $id, array $data): Note
    {
        $note = $this->findById($id);
        $note->update($data);
        
        return $note;
    }

    /**
     * Supprime une note.
     *
     * @param int $id L'identifiant de la note à supprimer.
     * @return bool True si la suppression a réussi, false sinon.
     * @throws ModelNotFoundException Si la note n'est pas trouvée.
     */
    public function delete(int $id): bool
    {
        $note = $this->findById($id);
        
        return $note->delete();
    }
}