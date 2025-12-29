<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Services\User\PermissionsService;
use Inertia\Inertia;
class AdminPermissionController extends Controller
{
    protected PermissionsService $permissionsService;

    public function __construct(PermissionsService $permissionsService)
    {
        $this->permissionsService = $permissionsService;
    }

public function index()
{
    $users = User::with('roles')->paginate(10);

    // Transformer les users pour ne garder que le rôle principal (ou le premier)
    $users->getCollection()->transform(function ($user) {
        $user->role = $user->roles->first()?->name ?? null;
        return $user;
    });

    // Récupérer tous les rôles existants
    $roles = \Spatie\Permission\Models\Role::pluck('name');

    return Inertia::render('Admin/permissions/indexPermissions', [
        'users' => $users,
        'roles' => $roles,
    ]);
}


    public function assignRole(Request $request, User $user)
    {
        $request->validate(['role' => 'required|string|exists:roles,name']);
        $this->permissionsService->addRole($user, $request->role);
        return redirect()->back()->with('success', "Role '{$request->role}' assigned to {$user->name}.");
    }

    public function removeRole(Request $request, User $user)
    {
        $request->validate(['role' => 'required|string|exists:roles,name']);
        $this->permissionsService->removeRole($user, $request->role);
        return redirect()->back()->with('success', "Role '{$request->role}' removed from {$user->name}.");
    }

  public function updateRole(Request $request, User $user)
{
    $request->validate(['role' => 'required|string|exists:roles,name']);
    $this->permissionsService->updateRole($user, $request->role);

    return Inertia::render('Admin/permissions/indexPermissions', [
        'users' => User::with('roles')->paginate(10),
        'roles' => \Spatie\Permission\Models\Role::pluck('name'),
        'flash' => [
            'success' => "Role for {$user->name} updated to '{$request->role}'."
        ]
    ]);
}
}
