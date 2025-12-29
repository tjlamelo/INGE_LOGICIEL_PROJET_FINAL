<?php

declare(strict_types=1);

namespace App\Services\User;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class GetUserService
{
    /**
     * Get paginated users or filter by role.
     *
     * @param string|null $role
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getUsers(?string $role = null, int $perPage = 10): LengthAwarePaginator
    {
        $query = User::query();

        if ($role) {
            $query->role($role); // Filtrer par rôle si fourni
        }

        // Charger les rôles pour chaque utilisateur
        $query->with('roles');

        return $query->paginate($perPage);
    }
}
