<?php

declare(strict_types=1);

namespace App\Services\Academique;

use App\Models\Enseignement;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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
            ->join('users', 'enseignants.user_id', '=', 'users.id')
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
     * Récupère une liste paginée des enseignements pour un enseignant spécifique
     *
     * @param int $enseignantId L'ID de l'enseignant
     * @param int $perPage Le nombre d'éléments par page (défaut: 10).
     * @return LengthAwarePaginator
     */
    public function getPaginatedListForTeacher(int $enseignantId, int $perPage = 10): LengthAwarePaginator
    {
        // Créer une requête de base
        $query = Enseignement::query()
            ->where('enseignements.enseignant_id', $enseignantId)
            ->join('enseignants', 'enseignements.enseignant_id', '=', 'enseignants.id')
            ->join('users', 'enseignants.user_id', '=', 'users.id')
            ->join('classes', 'enseignements.classe_id', '=', 'classes.id')
            ->join('matieres', 'enseignements.matiere_id', '=', 'matieres.id')
            ->select(
                'enseignements.*', 
                'users.name as enseignant_name', 
                'classes.nom as classe_nom', 
                'matieres.nom as matiere_nom'
            )
            ->orderBy('classe_nom')
            ->orderBy('matiere_nom');

        // Vérifier s'il y a des enseignements pour cet enseignant
        $count = $query->count();
        
        if ($count === 0) {
            // Retourner une pagination vide avec les bonnes propriétés
            return new \Illuminate\Pagination\LengthAwarePaginator(
                [],
                0,
                $perPage,
                1,
                [
                    'path' => request()->url(),
                    'pageName' => 'page',
                ]
            );
        }

        return $query->paginate($perPage);
    }

    /**
     * Récupère les statistiques sur les enseignements
     *
     * @return array
     */
    public function getStatistics(): array
    {
        // Statistiques générales
        $totalEnseignements = Enseignement::count();
        $totalEnseignants = DB::table('enseignants')->count();
        $totalClasses = DB::table('classes')->count();
        $totalMatieres = DB::table('matieres')->count();
        
        // Coefficient moyen
        $averageCoefficient = Enseignement::avg('coefficient') ?? 0;
        
        // Enseignements par classe
        $enseignementsByClass = DB::table('enseignements')
            ->join('classes', 'enseignements.classe_id', '=', 'classes.id')
            ->select('classes.nom as classe_nom', DB::raw('count(*) as count'), DB::raw('avg(coefficient) as avg_coefficient'))
            ->groupBy('classes.nom')
            ->orderBy('count', 'desc')
            ->get();
        
        // Enseignements par matière
        $enseignementsBySubject = DB::table('enseignements')
            ->join('matieres', 'enseignements.matiere_id', '=', 'matieres.id')
            ->select('matieres.nom as matiere_nom', DB::raw('count(*) as count'), DB::raw('avg(coefficient) as avg_coefficient'))
            ->groupBy('matieres.nom')
            ->orderBy('count', 'desc')
            ->get();
        
        // Enseignements par enseignant
        $enseignementsByTeacher = DB::table('enseignements')
            ->join('enseignants', 'enseignements.enseignant_id', '=', 'enseignants.id')
            ->join('users', 'enseignants.user_id', '=', 'users.id')
            ->select('users.name as enseignant_name', DB::raw('count(*) as count'), DB::raw('avg(coefficient) as avg_coefficient'))
            ->groupBy('users.name')
            ->orderBy('count', 'desc')
            ->get();
        
        // Matières avec coefficients extrêmes
        $highestCoefficientSubject = DB::table('enseignements')
            ->join('matieres', 'enseignements.matiere_id', '=', 'matieres.id')
            ->select('matieres.nom')
            ->orderBy('coefficient', 'desc')
            ->value('matieres.nom');
            
        $lowestCoefficientSubject = DB::table('enseignements')
            ->join('matieres', 'enseignements.matiere_id', '=', 'matieres.id')
            ->select('matieres.nom')
            ->orderBy('coefficient', 'asc')
            ->value('matieres.nom');

        $statistics = [
            'total_enseignements' => $totalEnseignements,
            'total_enseignants' => $totalEnseignants,
            'total_classes' => $totalClasses,
            'total_matieres' => $totalMatieres,
            'average_coefficient' => (float) $averageCoefficient,
            'enseignements_by_class' => $enseignementsByClass->toArray(),
            'enseignements_by_subject' => $enseignementsBySubject->toArray(),
            'enseignements_by_teacher' => $enseignementsByTeacher->toArray(),
            'highest_coefficient_subject' => $highestCoefficientSubject,
            'lowest_coefficient_subject' => $lowestCoefficientSubject,
        ];

        Log::info('Statistiques des enseignements récupérées', $statistics);

        return $statistics;
    }

    /**
     * Récupère les statistiques sur les enseignements pour un enseignant spécifique
     *
     * @param int $enseignantId L'ID de l'enseignant
     * @return array
     */
    public function getStatisticsForTeacher(int $enseignantId): array
    {
        // Statistiques pour l'enseignant spécifique
        $totalEnseignements = Enseignement::where('enseignant_id', $enseignantId)->count();
        
        // Si l'enseignant n'a aucun enseignement, retourner des statistiques vides
        if ($totalEnseignements === 0) {
            return [
                'total_enseignements' => 0,
                'total_classes' => 0,
                'total_matieres' => 0,
                'average_coefficient' => 0,
                'enseignements_by_class' => [],
                'enseignements_by_subject' => [],
                'highest_coefficient_subject' => null,
                'lowest_coefficient_subject' => null,
            ];
        }
        
        // Coefficient moyen pour cet enseignant
        $averageCoefficient = Enseignement::where('enseignant_id', $enseignantId)->avg('coefficient') ?? 0;
        
        // Enseignements par classe pour cet enseignant
        $enseignementsByClass = DB::table('enseignements')
            ->where('enseignements.enseignant_id', $enseignantId)
            ->join('classes', 'enseignements.classe_id', '=', 'classes.id')
            ->select('classes.nom as classe_nom', DB::raw('count(*) as count'), DB::raw('avg(coefficient) as avg_coefficient'))
            ->groupBy('classes.nom')
            ->orderBy('count', 'desc')
            ->get();
        
        // Enseignements par matière pour cet enseignant
        $enseignementsBySubject = DB::table('enseignements')
            ->where('enseignements.enseignant_id', $enseignantId)
            ->join('matieres', 'enseignements.matiere_id', '=', 'matieres.id')
            ->select('matieres.nom as matiere_nom', DB::raw('count(*) as count'), DB::raw('avg(coefficient) as avg_coefficient'))
            ->groupBy('matieres.nom')
            ->orderBy('count', 'desc')
            ->get();
        
        // Matières avec coefficients extrêmes pour cet enseignant
        $highestCoefficientSubject = DB::table('enseignements')
            ->where('enseignements.enseignant_id', $enseignantId)
            ->join('matieres', 'enseignements.matiere_id', '=', 'matieres.id')
            ->select('matieres.nom')
            ->orderBy('coefficient', 'desc')
            ->value('matieres.nom');
            
        $lowestCoefficientSubject = DB::table('enseignements')
            ->where('enseignements.enseignant_id', $enseignantId)
            ->join('matieres', 'enseignements.matiere_id', '=', 'matieres.id')
            ->select('matieres.nom')
            ->orderBy('coefficient', 'asc')
            ->value('matieres.nom');

        $statistics = [
            'total_enseignements' => $totalEnseignements,
            'total_classes' => $enseignementsByClass->count(),
            'total_matieres' => $enseignementsBySubject->count(),
            'average_coefficient' => (float) $averageCoefficient,
            'enseignements_by_class' => $enseignementsByClass->toArray(),
            'enseignements_by_subject' => $enseignementsBySubject->toArray(),
            'highest_coefficient_subject' => $highestCoefficientSubject,
            'lowest_coefficient_subject' => $lowestCoefficientSubject,
        ];

        Log::info('Statistiques des enseignements récupérées pour l\'enseignant', [
            'enseignant_id' => $enseignantId,
            'statistics' => $statistics,
        ]);

        return $statistics;
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
        $enseignement = Enseignement::create($data);
        
        Log::info('Nouvel enseignement créé', [
            'data' => $data,
            'enseignement_id' => $enseignement->id,
        ]);

        return $enseignement;
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
        
        Log::info('Enseignement mis à jour', [
            'id' => $id,
            'updated_data' => $data,
        ]);
        
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
        $success = $enseignement->delete();
        
        Log::info('Enseignement supprimé', [
            'id' => $id,
            'success' => $success,
        ]);
        
        return $success;
    }
}