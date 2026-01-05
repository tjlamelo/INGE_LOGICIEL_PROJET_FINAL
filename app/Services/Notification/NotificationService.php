<?php

declare(strict_types=1);


namespace App\Services\Notification;


use App\Models\{Classe, Eleve, User};
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\{Log, Notification as NotificationFacade};
use Spatie\Permission\Models\Role;

/**
 * Service pour gérer l'envoi de notifications à des groupes ou des entités spécifiques.
 */
final class NotificationService
{
    /**
     * Envoie une notification à tous les élèves d'une classe.
     *
     * @param int|string|Classe $class L'ID ou le modèle de la classe.
     * @param Notification $notification L'instance de la notification à envoyer.
     * @return bool True en cas de succès, false en cas d'échec.
     */
    public function notifyClass(int|string|Classe $class, Notification $notification): bool
    {
        try {
            $classe = $this->resolveClass($class);
            if (!$classe) {
                Log::warning("NotificationService: Classe non trouvée avec l'ID/le nom : {$class}");
                return false;
            }

            $eleves = $classe->eleves;
            if ($eleves->isEmpty()) {
                Log::info("NotificationService: Aucun élève trouvé dans la classe {$classe->nom} pour la notification.");
                return true; // Considéré comme un succès, rien à notifier.
            }

            NotificationFacade::send($eleves, $notification);
            Log::info("NotificationService: Notification envoyée à {$eleves->count()} élève(s) de la classe {$classe->nom}.");
            return true;
        } catch (\Exception $e) {
            Log::error("NotificationService: Erreur lors de l'envoi à la classe {$class}.", ['exception' => $e]);
            return false;
        }
    }

    /**
     * Envoie une notification à tous les utilisateurs ayant un rôle spécifique.
     *
     * @param int|string $role L'ID ou le nom du rôle.
     * @param Notification $notification L'instance de la notification à envoyer.
     * @return bool True en cas de succès, false en cas d'échec.
     */
    public function notifyRole(int|string $role, Notification $notification): bool
    {
        try {
            $roleModel = $this->resolveRole($role);
            if (!$roleModel) {
                Log::warning("NotificationService: Rôle non trouvé avec l'ID/le nom : {$role}");
                return false;
            }

            $users = $roleModel->users;
            if ($users->isEmpty()) {
                Log::info("NotificationService: Aucun utilisateur trouvé avec le rôle {$roleModel->name} pour la notification.");
                return true;
            }

            NotificationFacade::send($users, $notification);
            Log::info("NotificationService: Notification envoyée à {$users->count()} utilisateur(s) avec le rôle {$roleModel->name}.");
            return true;
        } catch (\Exception $e) {
            Log::error("NotificationService: Erreur lors de l'envoi au rôle {$role}.", ['exception' => $e]);
            return false;
        }
    }

    /**
     * Envoie une notification à un utilisateur ou un élève spécifique.
     *
     * @param int|string|User|Eleve $notifiable L'ID, l'email ou le modèle de l'entité notifiable.
     * @param Notification $notification L'instance de la notification à envoyer.
     * @return bool True en cas de succès, false en cas d'échec.
     */
    public function notifyUser(int|string|User|Eleve $notifiable, Notification $notification): bool
    {
        try {
            $model = $this->resolveNotifiable($notifiable);
            if (!$model) {
                Log::warning("NotificationService: Entité notifiable non trouvée avec l'ID/l'email : {$notifiable}");
                return false;
            }

            $model->notify($notification);
            Log::info("NotificationService: Notification envoyée à l'entité " . get_class($model) . " (ID: {$model->id}).");
            return true;
        } catch (\Exception $e) {
            Log::error("NotificationService: Erreur lors de l'envoi à l'utilisateur {$notifiable}.", ['exception' => $e]);
            return false;
        }
    }

    /**
     * Résout le modèle de la classe à partir d'un ID ou d'une chaîne.
     */
    private function resolveClass(int|string|Classe $class): ?Classe
    {
        if ($class instanceof Classe) {
            return $class;
        }
        // Tente de trouver par ID, puis par nom si c'est une chaîne
        return is_numeric($class) ? Classe::find($class) : Classe::where('nom', $class)->first();
    }

    /**
     * Résout le modèle de rôle à partir d'un ID ou d'une chaîne.
     */
    private function resolveRole(int|string $role): ?Role
    {
        if ($role instanceof Role) {
            return $role;
        }
        // Tente de trouver par ID, puis par nom
        return is_numeric($role) ? Role::find($role) : Role::findByName($role);
    }

    /**
     * Résout le modèle notifiable (User ou Eleve) à partir d'un ID, d'un email ou d'un modèle.
     */
    private function resolveNotifiable(int|string|User|Eleve $notifiable): Model|null
    {
        if ($notifiable instanceof Model) {
            return $notifiable;
        }

        // Si c'est numérique, cherche d'abord dans User, puis Eleve
        if (is_numeric($notifiable)) {
            return User::find($notifiable) ?? Eleve::find($notifiable);
        }

        // Si c'est une chaîne (probablement un email), cherche dans User
        return User::where('email', $notifiable)->first();
    }
}