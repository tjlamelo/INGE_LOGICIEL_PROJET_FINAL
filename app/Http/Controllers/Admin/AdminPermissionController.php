<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Services\User\PermissionsService;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class AdminPermissionController extends Controller
{
    protected PermissionsService $permissionsService;

    public function __construct(PermissionsService $permissionsService)
    {
        $this->permissionsService = $permissionsService;
        // $this->middleware(['auth', 'role:admin']);
    }

    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $search = $request->get('search', '');
        $role = $request->get('role', 'all');
        
        $query = User::with('roles');
        
        // Apply search filter
        if (!empty($search)) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('email', 'like', '%' . $search . '%');
            });
        }
        
        // Apply role filter
        if ($role !== 'all') {
            if ($role === 'none') {
                $query->whereDoesntHave('roles');
            } else {
                $query->whereHas('roles', function($q) use ($role) {
                    $q->where('name', $role);
                });
            }
        }
        
        $users = $query->paginate($perPage);
        
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
        $validator = Validator::make($request->all(), [
            'role' => 'required|string|exists:roles,name',
        ]);
        
        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }
        
        $this->permissionsService->addRole($user, $request->role);
        
        return redirect()->back()->with('success', "Role '{$request->role}' assigned to {$user->name}.");
    }

    public function removeRole(Request $request, User $user)
    {
        $validator = Validator::make($request->all(), [
            'role' => 'required|string|exists:roles,name',
        ]);
        
        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }
        
        $this->permissionsService->removeRole($user, $request->role);
        
        return redirect()->back()->with('success', "Role '{$request->role}' removed from {$user->name}.");
    }

    public function updateRole(Request $request, User $user)
    {
        $validator = Validator::make($request->all(), [
            'role' => 'nullable|string|exists:roles,name',
        ]);
        
        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }
        
        $role = $request->role;
        $this->permissionsService->updateRole($user, $role);
        
        $message = $role 
            ? "Role for {$user->name} updated to '{$role}'." 
            : "Role removed from {$user->name}.";
            
        return redirect()->back()->with('success', $message);
    }
}