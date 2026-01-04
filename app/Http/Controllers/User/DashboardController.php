<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Services\User\DashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    protected $dashboardService;

    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    /**
     * Afficher le tableau de bord approprié en fonction du rôle
     */
    public function index(Request $request)
    {
        $dashboardData = $this->dashboardService->getDashboardData();
        
        // Récupérer le rôle de l'utilisateur pour déterminer quelle vue afficher
        $user = $request->user();
        $role = $user->getRoleNames()->first() ?? 'guest';
        
        return Inertia::render('Dashboard/Index', [
            'dashboardData' => $dashboardData,
            'userRole' => $role,
            'userName' => $user->name,
        ]);
    }
}