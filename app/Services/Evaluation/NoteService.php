<?php

declare(strict_types=1);

namespace App\Services\Evaluation;

use App\Models\Note;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Service pour la gestion des opérations CRUD sur le modèle Note.
 */
final class NoteService
{
    /**
     * Récupère une liste paginée de toutes les notes avec les détails des entités liées.
     * La requête est mise à jour pour inclure et trier par séquence.
     *
     * @param int $perPage Le nombre d'éléments par page (défaut: 10).
     * @return LengthAwarePaginator
     */
    public function getPaginatedList(int $perPage = 10, ?int $enseignantId = null): LengthAwarePaginator
    {
        $query = Note::query()
            // Utilisation de leftJoin si certaines relations peuvent être nulles, 
            // mais join est plus performant si les données sont obligatoires.
            ->join('eleves', 'notes.eleve_id', '=', 'eleves.id')
            ->join('users', 'eleves.user_id', '=', 'users.id')
            ->join('enseignements', 'notes.enseignement_id', '=', 'enseignements.id')
            ->join('matieres', 'enseignements.matiere_id', '=', 'matieres.id')
            ->join('classes', 'enseignements.classe_id', '=', 'classes.id')
            ->join('trimestres', 'notes.trimestre_id', '=', 'trimestres.id');

        if ($enseignantId) {
            $query->where('enseignements.enseignant_id', $enseignantId);
        }

        return $query->select(
                'notes.id', // On précise l'ID de la note explicitement
                'notes.valeur',
                'notes.sequence',
                'notes.type_evaluation',
                'notes.date_evaluation',
                'users.name as eleve_name',
                'matieres.nom as matiere_nom',
                'classes.nom as classe_nom',
                'trimestres.nom as trimestre_nom',
                'trimestres.annee_scolaire' // Ajouté pour l'affichage complet dans React
            )
            // Tri par année scolaire puis par trimestre pour une liste logique
            ->orderBy('trimestres.annee_scolaire', 'desc')
            ->orderBy('trimestres.id', 'desc')
            ->orderBy('notes.created_at', 'desc') 
            ->paginate($perPage)
            ->withQueryString(); // Garde les paramètres de recherche (perPage, page) dans les liens
    }

    /**
     * Récupère les statistiques sur les notes
     *
     * @param int|null $enseignantId
     * @return array
     */
    public function getStatistics(?int $enseignantId = null): array
    {
        // Requête de base pour les notes
        $query = Note::query()
            ->join('eleves', 'notes.eleve_id', '=', 'eleves.id')
            ->join('users', 'eleves.user_id', '=', 'users.id')
            ->join('enseignements', 'notes.enseignement_id', '=', 'enseignements.id')
            ->join('matieres', 'enseignements.matiere_id', '=', 'matieres.id')
            ->join('classes', 'enseignements.classe_id', '=', 'classes.id');

        if ($enseignantId) {
            $query->where('enseignements.enseignant_id', $enseignantId);
        }

        // Statistiques générales
        $totalNotes = $query->count();
        $averageGrade = $query->avg('notes.valeur') ?? 0;
        $highestGrade = $query->max('notes.valeur') ?? 0;
        $lowestGrade = $query->min('notes.valeur') ?? 0;
        
        // Taux de réussite (notes >= 10)
        $passingCount = $query->where('notes.valeur', '>=', 10)->count();
        $passingRate = $totalNotes > 0 ? ($passingCount / $totalNotes) * 100 : 0;
        
        // Répartition des notes par catégorie
        $excellentCount = $query->where('notes.valeur', '>=', 16)->count();
        $goodCount = $query->whereBetween('notes.valeur', [14, 15.99])->count();
        $satisfactoryCount = $query->whereBetween('notes.valeur', [12, 13.99])->count();
        $fairCount = $query->whereBetween('notes.valeur', [10, 11.99])->count();
        $insufficientCount = $query->where('notes.valeur', '<', 10)->count();
        
        // Notes par matière
        $notesBySubject = DB::table('notes')
            ->join('enseignements', 'notes.enseignement_id', '=', 'enseignements.id')
            ->join('matieres', 'enseignements.matiere_id', '=', 'matieres.id')
            ->when($enseignantId, function ($query) use ($enseignantId) {
                return $query->where('enseignements.enseignant_id', $enseignantId);
            })
            ->select(
                'matieres.nom as matiere_nom', 
                DB::raw('count(*) as count'), 
                DB::raw('avg(notes.valeur) as average')
            )
            ->groupBy('matieres.nom')
            ->orderBy('average', 'desc')
            ->get();
        
        // Notes par classe
        $notesByClass = DB::table('notes')
            ->join('enseignements', 'notes.enseignement_id', '=', 'enseignements.id')
            ->join('classes', 'enseignements.classe_id', '=', 'classes.id')
            ->when($enseignantId, function ($query) use ($enseignantId) {
                return $query->where('enseignements.enseignant_id', $enseignantId);
            })
            ->select(
                'classes.nom as classe_nom', 
                DB::raw('count(*) as count'), 
                DB::raw('avg(notes.valeur) as average')
            )
            ->groupBy('classes.nom')
            ->orderBy('average', 'desc')
            ->get();
        
        // Notes par séquence
        $notesBySequence = DB::table('notes')
            ->join('enseignements', 'notes.enseignement_id', '=', 'enseignements.id')
            ->when($enseignantId, function ($query) use ($enseignantId) {
                return $query->where('enseignements.enseignant_id', $enseignantId);
            })
            ->select(
                'notes.sequence', 
                DB::raw('count(*) as count'), 
                DB::raw('avg(notes.valeur) as average')
            )
            ->groupBy('notes.sequence')
            ->orderBy('notes.sequence', 'asc')
            ->get();
        
        // Notes par type d'évaluation
        $notesByType = DB::table('notes')
            ->join('enseignements', 'notes.enseignement_id', '=', 'enseignements.id')
            ->when($enseignantId, function ($query) use ($enseignantId) {
                return $query->where('enseignements.enseignant_id', $enseignantId);
            })
            ->select(
                'notes.type_evaluation', 
                DB::raw('count(*) as count'), 
                DB::raw('avg(notes.valeur) as average')
            )
            ->whereNotNull('notes.type_evaluation')
            ->groupBy('notes.type_evaluation')
            ->orderBy('average', 'desc')
            ->get();

        $statistics = [
            'total_notes' => $totalNotes,
            'average_grade' => (float) $averageGrade,
            'highest_grade' => (float) $highestGrade,
            'lowest_grade' => (float) $lowestGrade,
            'passing_rate' => (float) $passingRate,
            'notes_by_subject' => $notesBySubject->toArray(),
            'notes_by_class' => $notesByClass->toArray(),
            'notes_by_sequence' => $notesBySequence->toArray(),
            'notes_by_type' => $notesByType->toArray(),
            'grade_distribution' => [
                'excellent' => $excellentCount,
                'good' => $goodCount,
                'satisfactory' => $satisfactoryCount,
                'fair' => $fairCount,
                'insufficient' => $insufficientCount,
            ],
        ];

        Log::info('Statistiques des notes récupérées', [
            'enseignant_id' => $enseignantId,
            'total_notes' => $totalNotes,
        ]);

        return $statistics;
    }

    /**
     * Trouve une note par son identifiant, en chargeant toutes les relations utiles.
     *
     * @param int $id L'identifiant de la note.
     * @return Note
     * @throws ModelNotFoundException Si la note n'est pas trouvée.
     */
    public function findById(int $id, ?int $enseignantId = null): Note
    {
        // Ajout de la relation enseignant.user
        $query = Note::with([
            'eleve.user', 
            'eleve.classe', 
            'trimestre', 
            'enseignement.matiere',
            'enseignement.classe',
            'enseignement.enseignant.user' // <--- Ligne ajoutée
        ]);
        
        $note = $query->findOrFail($id);

        // SÉCURITÉ
        if ($enseignantId && $note->enseignement->enseignant_id !== $enseignantId) {
            abort(403, "Vous n'avez pas accès à cette note.");
        }

        return $note;
    }

    /**
     * Crée une nouvelle note. (Aucune modification nécessaire)
     *
     * @param array $data Les données de la note.
     * @return Note La note nouvellement créée.
     */
    public function create(array $data): Note
    {
        return Note::create($data);
    }

    /**
     * Met à jour une note existante. (Aucune modification nécessaire)
     *
     * @param int $id L'identifiant de la note à mettre à jour.
     * @param array $data Les nouvelles données de la note.
     * @return Note La note mise à jour.
     * @throws ModelNotFoundException Si la note n'est pas trouvée.
     */
    public function update(int $id, array $data, ?int $enseignantId = null): Note
    {
        $note = $this->findById($id, $enseignantId); // La vérification d'accès est déjà dans findById
        $note->update($data);
        return $note;
    }

    /**
     * Supprime une note. (Aucune modification nécessaire)
     *
     * @param int $id L'identifiant de la note à supprimer.
     * @return bool True si la suppression a réussi, false sinon.
     * @throws ModelNotFoundException Si la note n'est pas trouvée.
     */
    // Modifie la ligne pour accepter le 2ème paramètre optionnel
    public function delete(int $id, ?int $enseignantId = null): bool
    {
        // findById utilise déjà le $enseignantId pour vérifier la sécurité
        $note = $this->findById($id, $enseignantId);
        
        return $note->delete();
    }
}