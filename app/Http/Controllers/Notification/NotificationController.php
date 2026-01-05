<?php

namespace App\Http\Controllers\Notification;

use App\Http\Controllers\Controller;
use App\Models\{User, Eleve, Classe};
use App\Notifications\CustomNotification;
use App\Services\Notification\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Role;

class NotificationController extends Controller
{
    public function __construct(
        private NotificationService $notificationService
    ) {
    }

    /**
     * Affiche la page des notifications pour l'utilisateur connecté.
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        // Récupère les notifications non lues et les 10 dernières notifications
        $unreadNotifications = $user->unreadNotifications;
        $recentNotifications = $user->notifications()->latest()->limit(10)->get();

        return Inertia::render('Notifications/Index', [
            'unreadNotifications' => $unreadNotifications,
            'recentNotifications' => $recentNotifications,
            'unreadCount' => $unreadNotifications->count(),
            'classes' => Classe::orderBy('nom')->get(),
            'roles' => Role::orderBy('name')->get(),
            'users' => User::orderBy('name')->get(),
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    /**
     * Affiche les détails d'une notification spécifique.
     */
    public function show(Request $request, string $id)
    {
        $notification = $request->user()->notifications()->findOrFail($id);
        
        // Marquer la notification comme lue si elle ne l'est pas déjà
        if (!$notification->read_at) {
            $notification->markAsRead();
        }

        return Inertia::render('Notifications/Show', [
            'notification' => $notification,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    /**
     * Crée et envoie une nouvelle notification.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'target_type' => 'required|in:user,role,class',
            'target_id' => 'required_if:target_type,user,role,class|integer',
            'send_email' => 'boolean',
        ]);

        try {
            $notification = new CustomNotification(
                $request->title,
                $request->message,
                $request->input('url'), // Plus de valeur par défaut
                $request->boolean('send_email', false)
            );

            $success = false;
            $targetName = '';

            switch ($request->target_type) {
                case 'class':
                    $classe = Classe::findOrFail($request->target_id);
                    $success = $this->notificationService->notifyClass($classe, $notification);
                    $targetName = "classe {$classe->nom}";
                    break;
                case 'role':
                    $role = Role::findOrFail($request->target_id);
                    $success = $this->notificationService->notifyRole($role->id, $notification);
                    $targetName = "rôle {$role->name}";
                    break;
                case 'user':
                    $user = User::findOrFail($request->target_id);
                    $success = $this->notificationService->notifyUser($user, $notification);
                    $targetName = "utilisateur {$user->name}";
                    break;
            }

            if ($success) {
                return redirect()->route('notifications.index')
                    ->with('success', "Notification envoyée avec succès à la {$targetName}.");
            } else {
                return redirect()->back()
                    ->with('error', "Une erreur est survenue lors de l'envoi de la notification.");
            }
        } catch (\Exception $e) {
            \Log::error("Erreur lors de l'envoi de la notification", [
                'error' => $e->getMessage(),
                'request' => $request->all()
            ]);

            return redirect()->back()
                ->with('error', "Une erreur est survenue: " . $e->getMessage());
        }
    }

    /**
     * Marque une notification comme lue.
     */
    public function markAsRead(Request $request, string $id): JsonResponse
    {
        $notification = $request->user()->notifications()->findOrFail($id);
        $notification->markAsRead();

        return response()->json([
            'success' => true,
            'message' => 'Notification marquée comme lue.'
        ]);
    }

    /**
     * Marque toutes les notifications comme lues.
     */
    public function markAllAsRead(Request $request): JsonResponse
    {
        $request->user()->unreadNotifications->markAsRead();

        return response()->json([
            'success' => true,
            'message' => 'Toutes les notifications ont été marquées comme lues.'
        ]);
    }

    /**
     * Supprime une notification.
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $notification = $request->user()->notifications()->findOrFail($id);
        $notification->delete();

        return response()->json([
            'success' => true,
            'message' => 'Notification supprimée avec succès.'
        ]);
    }

    /**
     * API pour récupérer les notifications non lues (pour le dropdown de notifications).
     */
    public function getUnreadNotifications(Request $request): JsonResponse
    {
        $notifications = $request->user()->unreadNotifications()->limit(5)->get();

        return response()->json([
            'notifications' => $notifications,
            'count' => $request->user()->unreadNotifications->count(),
        ]);
    }
}