<?php

declare(strict_types=1);

namespace App\Services\Academique;

use App\Models\Classe;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;

/**
 * Service pour la gestion des opérations CRUD sur le modèle Classe.
 */
final class ClasseService
{
    public function getPaginatedList(int $perPage = 10): LengthAwarePaginator
    {
        $classes = Classe::query()
            ->orderBy('niveau', 'asc')
            ->orderBy('nom', 'asc')
            ->paginate($perPage);

        Log::info('Liste paginée des classes récupérée', [
            'perPage' => $perPage,
            'count' => $classes->count(),
        ]);

        return $classes;
    }

    public function findById(int $id): Classe
    {
        $classe = Classe::findOrFail($id);

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
