<?php

declare(strict_types=1);

namespace App\Services\Academique;

use App\Models\Classe;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Service pour la gestion des opérations CRUD sur le modèle Classe.
 */
final class ClasseService
{
    public function getPaginatedList(int $perPage = 10): LengthAwarePaginator
    {
        $classes = Classe::query()
            ->withCount('eleves') // Ajout du comptage d'élèves
            ->orderBy('niveau', 'asc')
            ->orderBy('nom', 'asc')
            ->paginate($perPage);

        Log::info('Liste paginée des classes récupérée', [
            'perPage' => $perPage,
            'count' => $classes->count(),
        ]);

        return $classes;
    }

    public function getStatistics(): array
    {
        // Statistiques générales
        $totalClasses = Classe::count();
        $totalStudents = DB::table('eleves')->count();
        $averageStudentsPerClass = $totalClasses > 0 ? $totalStudents / $totalClasses : 0;

        // Classes par niveau
        $classesByLevel = DB::table('classes')
            ->select('niveau', DB::raw('count(*) as count'))
            ->groupBy('niveau')
            ->get()
            ->map(function ($item) {
                $studentsCount = DB::table('eleves')
                    ->join('classes', 'eleves.classe_id', '=', 'classes.id')
                    ->where('classes.niveau', $item->niveau)
                    ->count();
                
                return [
                    'niveau' => $item->niveau,
                    'count' => $item->count,
                    'students_count' => $studentsCount
                ];
            });

        // Classes par filière
        $classesByFiliere = DB::table('classes')
            ->select('filiere', DB::raw('count(*) as count'))
            ->whereNotNull('filiere')
            ->groupBy('filiere')
            ->get()
            ->map(function ($item) {
                $studentsCount = DB::table('eleves')
                    ->join('classes', 'eleves.classe_id', '=', 'classes.id')
                    ->where('classes.filiere', $item->filiere)
                    ->count();
                
                return [
                    'filiere' => $item->filiere,
                    'count' => $item->count,
                    'students_count' => $studentsCount
                ];
            });

        // Classe la plus peuplée
        $mostPopulatedClass = Classe::withCount('eleves')
            ->orderBy('eleves_count', 'desc')
            ->first();

        // Classe la moins peuplée
        $leastPopulatedClass = Classe::withCount('eleves')
            ->orderBy('eleves_count', 'asc')
            ->first();

        $statistics = [
            'total_classes' => $totalClasses,
            'total_students' => $totalStudents,
            'average_students_per_class' => $averageStudentsPerClass,
            'classes_by_level' => $classesByLevel->toArray(),
            'classes_by_filiere' => $classesByFiliere->toArray(),
            'most_populated_class' => $mostPopulatedClass,
            'least_populated_class' => $leastPopulatedClass,
        ];

        Log::info('Statistiques des classes récupérées', $statistics);

        return $statistics;
    }

    public function findById(int $id): Classe
    {
        $classe = Classe::withCount('eleves')->findOrFail($id);

        Log::info('Classe trouvée par ID', [
            'id' => $id,
            'classe' => $classe->toArray(),
        ]);

        return $classe;
    }

    public function create(array $data): Classe
    {
        $classe = Classe::create($data);

        Log::info('Nouvelle classe créée', [
            'data' => $data,
            'classe' => $classe->toArray(),
        ]);

        return $classe;
    }

    public function update(int $id, array $data): Classe
    {
        $classe = $this->findById($id);
        $classe->update($data);

        Log::info('Classe mise à jour', [
            'id' => $id,
            'updated_data' => $data,
            'classe' => $classe->toArray(),
        ]);

        return $classe;
    }

    public function delete(int $id): bool
    {
        $classe = $this->findById($id);
        $success = $classe->delete();

        Log::info('Classe supprimée', [
            'id' => $id,
            'success' => $success,
        ]);

        return $success;
    }
}