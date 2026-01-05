<?php

declare(strict_types=1);

namespace App\Services\Notification;

use App\Models\{Classe, Eleve, User};
use Illuminate\Database\Eloquent\Model;
use Illuminate\Mail\Mailable;
use Illuminate\Support\Facades\{Log, Mail, View};
use Spatie\Permission\Models\Role;

/**
 * Service pour gérer l'envoi d'e-mails directs à des groupes ou des entités spécifiques.
 * Ce service utilise les classes Mailable de Laravel pour une flexibilité maximale,
 * ou une vue par défaut pour les notifications simples.
 */
final class MailService
{
    /**
     * Envoie un e-mail à tous les élèves d'une classe.
     *
     * @param int|string|Classe $class L'ID, le nom ou le modèle de la classe.
     * @param Mailable|string $mailable L'instance de l'e-mail (Mailable) ou le sujet de l'e-mail.
     * @param string|null $content Le contenu de l'e-mail si un sujet est fourni.
     * @param array|null $data Données supplémentaires pour la vue.
     * @return bool True en cas de succès, false en cas d'échec.
     */
    public function sendToClass(int|string|Classe $class, Mailable|string $mailable, ?string $content = null, ?array $data = []): bool
    {
        try {
            $classe = $this->resolveClass($class);
            if (!$classe) {
                Log::warning("MailService: Classe non trouvée avec l'ID/le nom : {$class}");
                return false;
            }

            // Récupère les adresses e-mail de tous les élèves de la classe
            $emails = $classe->eleves()
                ->with('user')
                ->get()
                ->pluck('user.email')
                ->filter()
                ->all();

            if (empty($emails)) {
                Log::info("MailService: Aucune adresse e-mail trouvée pour les élèves de la classe {$classe->nom}.");
                return true;
            }

            if ($mailable instanceof Mailable) {
                // Utiliser la classe Mailable fournie
                Mail::to($emails)->send($mailable);
            } else {
                // Utiliser la vue par défaut
                Mail::to($emails)->send($this->createDefaultMail($mailable, $content, $data));
            }

            Log::info("MailService: E-mail envoyé à " . count($emails) . " élève(s) de la classe {$classe->nom}.");
            return true;
        } catch (\Exception $e) {
            Log::error("MailService: Erreur lors de l'envoi à la classe {$class}.", ['exception' => $e]);
            return false;
        }
    }

    /**
     * Envoie un e-mail à tous les utilisateurs ayant un rôle spécifique.
     *
     * @param int|string $role L'ID ou le nom du rôle.
     * @param Mailable|string $mailable L'instance de l'e-mail (Mailable) ou le sujet de l'e-mail.
     * @param string|null $content Le contenu de l'e-mail si un sujet est fourni.
     * @param array|null $data Données supplémentaires pour la vue.
     * @return bool True en cas de succès, false en cas d'échec.
     */
    public function sendToRole(int|string $role, Mailable|string $mailable, ?string $content = null, ?array $data = []): bool
    {
        try {
            $roleModel = $this->resolveRole($role);
            if (!$roleModel) {
                Log::warning("MailService: Rôle non trouvé avec l'ID/le nom : {$role}");
                return false;
            }

            // Récupère les adresses e-mail de tous les utilisateurs avec ce rôle
            $emails = $roleModel->users()->pluck('email')->filter()->all();

            if (empty($emails)) {
                Log::info("MailService: Aucune adresse e-mail trouvée pour les utilisateurs avec le rôle {$roleModel->name}.");
                return true;
            }

            if ($mailable instanceof Mailable) {
                // Utiliser la classe Mailable fournie
                Mail::to($emails)->send($mailable);
            } else {
                // Utiliser la vue par défaut
                Mail::to($emails)->send($this->createDefaultMail($mailable, $content, $data));
            }

            Log::info("MailService: E-mail envoyé à " . count($emails) . " utilisateur(s) avec le rôle {$roleModel->name}.");
            return true;
        } catch (\Exception $e) {
            Log::error("MailService: Erreur lors de l'envoi au rôle {$role}.", ['exception' => $e]);
            return false;
        }
    }

    /**
     * Envoie un e-mail à un utilisateur ou un élève spécifique.
     *
     * @param int|string|User|Eleve $notifiable L'ID, l'email ou le modèle de l'entité.
     * @param Mailable|string $mailable L'instance de l'e-mail (Mailable) ou le sujet de l'e-mail.
     * @param string|null $content Le contenu de l'e-mail si un sujet est fourni.
     * @param array|null $data Données supplémentaires pour la vue.
     * @return bool True en cas de succès, false en cas d'échec.
     */
    public function sendToUser(int|string|User|Eleve $notifiable, Mailable|string $mailable, ?string $content = null, ?array $data = []): bool
    {
        try {
            $model = $this->resolveNotifiable($notifiable);
            if (!$model) {
                Log::warning("MailService: Entité non trouvée pour l'envoi d'e-mail avec l'ID/l'email : {$notifiable}");
                return false;
            }

            $email = $model instanceof User ? $model->email : $model->user->email;

            if (!$email) {
                Log::warning("MailService: L'entité " . get_class($model) . " (ID: {$model->id}) n'a pas d'adresse e-mail.");
                return false;
            }

            if ($mailable instanceof Mailable) {
                // Utiliser la classe Mailable fournie
                Mail::to($email)->send($mailable);
            } else {
                // Utiliser la vue par défaut avec le nom de l'utilisateur
                $data['recipientName'] = $model instanceof User ? $model->name : $model->user->name;
                Mail::to($email)->send($this->createDefaultMail($mailable, $content, $data));
            }

            Log::info("MailService: E-mail envoyé à {$email}.");
            return true;
        } catch (\Exception $e) {
            Log::error("MailService: Erreur lors de l'envoi à l'utilisateur {$notifiable}.", ['exception' => $e]);
            return false;
        }
    }

    /**
     * Crée un e-mail Mailable avec la vue par défaut.
     *
     * @param string $subject Le sujet de l'e-mail.
     * @param string|null $content Le contenu de l'e-mail.
     * @param array $data Données supplémentaires pour la vue.
     * @return Mailable L'e-mail Mailable créé.
     */
    private function createDefaultMail(string $subject, ?string $content, array $data = []): Mailable
    {
        return new class($subject, $content, $data) extends Mailable {
            public function __construct(
                private string $subject,
                private ?string $content,
                private array $data
            ) {}

            public function envelope(): \Illuminate\Mail\Mailables\Envelope
            {
                return new \Illuminate\Mail\Mailables\Envelope(
                    subject: $this->subject,
                );
            }

            public function content(): \Illuminate\Mail\Mailables\Content
            {
                return new \Illuminate\Mail\Mailables\Content(
                    view: 'emails.default',
                    with: array_merge($this->data, [
                        'subject' => $this->subject,
                        'content' => $this->content,
                    ])
                );
            }
        };
    }

    // --- Méthodes de résolution privées ---

    private function resolveClass(int|string|Classe $class): ?Classe
    {
        if ($class instanceof Classe) {
            return $class;
        }
        return is_numeric($class) ? Classe::find($class) : Classe::where('nom', $class)->first();
    }

    private function resolveRole(int|string $role): ?Role
    {
        if ($role instanceof Role) {
            return $role;
        }
        return is_numeric($role) ? Role::find($role) : Role::findByName($role);
    }

    private function resolveNotifiable(int|string|User|Eleve $notifiable): Model|null
    {
        if ($notifiable instanceof Model) {
            return $notifiable;
        }
        if (is_numeric($notifiable)) {
            return User::find($notifiable) ?? Eleve::find($notifiable);
        }
        return User::where('email', $notifiable)->first();
    }
}