<?php

declare(strict_types=1);

namespace App\Services\User;

use App\Models\User;
final class PermissionsService
{
    public function assignRole(User $user, string $role): void
    {
        $user->syncRoles($role); // Remplace tous les rôles existants
    }

    public function addRole(User $user, string $role): void
    {
        if (!$user->hasRole($role)) {
            $user->assignRole($role);
        }
    }

    public function removeRole(User $user, string $role): void
    {
        if ($user->hasRole($role)) {
            $user->removeRole($role);
        }
    }

    public function updateRole(User $user, string $newRole): void
    {
        $user->syncRoles($newRole);
    }

    public function hasRole(User $user, string $role): bool
    {
        return $user->hasRole($role);
    }
}
