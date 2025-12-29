<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\User\GetUserService;

class AdminDashboardController extends Controller
{
    protected GetUserService $userService;

    public function __construct(GetUserService $userService)
    {
        $this->userService = $userService;
    }

    public function index(Request $request)
    {
        $roleFilter = $request->query('role'); // optionnel
        $users = $this->userService->getUsers($roleFilter, 10);

        // Transformer la collection pour Inertia
        $users = $users->through(function($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->roles->pluck('name')->implode(', '),
            ];
        });

        return Inertia::render("Admin/adminDashboard", [
            'users' => $users,
            
        ]);
    }
}
