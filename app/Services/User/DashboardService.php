<?php

declare(strict_types=1);

namespace App\Services\User;

use App\Models\Eleve;
use App\Models\Enseignant;
use App\Models\Note;
use App\Models\Bulletin;
use App\Models\Absence;
use App\Models\Classe;
use App\Models\Enseignement;
use App\Models\Trimestre;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

final class DashboardService
{
    /**
     * Obtenir les données du tableau de bord pour l'utilisateur authentifié
     */
    public function getDashboardData(): array
    {
        $user = Auth::user();
        
        if (!$user) {
            return [];
        }

        // Récupérer le rôle de l'utilisateur
        $role = $user->getRoleNames()->first();
        
        switch ($role) {
            case 'admin':
                return $this->getAdminDashboardData();
            case 'student':
                return $this->getStudentDashboardData($user);
            case 'teacher':
                return $this->getTeacherDashboardData($user);
            case 'form_teacher':
                return $this->getFormTeacherDashboardData($user);
            case 'general_supervisor':
                return $this->getGeneralSupervisorDashboardData();
            case 'censor':
                return $this->getCensorDashboardData();
            case 'principal':
                return $this->getPrincipalDashboardData();
            case 'guest':
                return $this->getGuestDashboardData();
            default:
                return [];
        }
    }

    /**
     * Données pour le tableau de bord de l'administrateur
     */
    private function getAdminDashboardData(): array
    {
        return [
            'statistics' => [
                'total_students' => Eleve::count(),
                'total_teachers' => Enseignant::count(),
                'total_classes' => Classe::count(),
                'total_subjects' => DB::table('matieres')->count(),
                'active_trimester' => Trimestre::where('est_actif', true)->first(),
            ],
            'recent_activities' => [
                'recent_notes' => Note::with(['eleve.user', 'enseignement.matiere'])
                    ->orderBy('created_at', 'desc')
                    ->limit(5)
                    ->get(),
                'recent_bulletins' => Bulletin::with(['eleve.user', 'trimestre'])
                    ->orderBy('date_generation', 'desc')
                    ->limit(5)
                    ->get(),
            ],
            'charts_data' => [
                'students_per_class' => Classe::withCount('eleves')
                    ->get()
                    ->pluck('eleves_count', 'nom'),
                'notes_distribution' => $this->getNotesDistribution(),
            ],
        ];
    }

    /**
     * Données pour le tableau de bord de l'élève
     */
    private function getStudentDashboardData($user): array
    {
        $eleve = $user->eleve;
        
        if (!$eleve) {
            return ['error' => 'Profil élève non trouvé'];
        }

        $activeTrimester = Trimestre::where('est_actif', true)->first();
        
        return [
            'student_info' => [
                'name' => $user->name,
                'class' => $eleve->classe ? $eleve->classe->nom : 'Non assigné',
                'matricule' => $eleve->matricule,
            ],
            'academic_info' => [
                'active_trimester' => $activeTrimester,
                'latest_bulletin' => Bulletin::where('eleve_id', $eleve->id)
                    ->orderBy('date_generation', 'desc')
                    ->with('trimestre')
                    ->first(),
                'recent_notes' => Note::where('eleve_id', $eleve->id)
                    ->with(['enseignement.matiere', 'trimestre'])
                    ->orderBy('created_at', 'desc')
                    ->limit(5)
                    ->get(),
            ],
            'attendance_info' => [
                'total_absences' => Absence::where('eleve_id', $eleve->id)
                    ->where('est_justifiee', false)
                    ->sum('nombre_d_heures_manquees'),
                'recent_absences' => Absence::where('eleve_id', $eleve->id)
                    ->orderBy('date_absence', 'desc')
                    ->limit(5)
                    ->get(),
            ],
        ];
    }

    /**
     * Données pour le tableau de bord de l'enseignant
     */
    private function getTeacherDashboardData($user): array
    {
        $enseignant = $user->enseignant;
        
        if (!$enseignant) {
            return ['error' => 'Profil enseignant non trouvé'];
        }

        $activeTrimester = Trimestre::where('est_actif', true)->first();
        
        return [
            'teacher_info' => [
                'name' => $user->name,
                'speciality' => $enseignant->specialite,
                'grade' => $enseignant->grade,
            ],
            'teaching_info' => [
                'active_trimester' => $activeTrimester,
                'classes' => Enseignement::where('enseignant_id', $enseignant->id)
                    ->with('classe')
                    ->distinct('classe_id')
                    ->get()
                    ->pluck('classe.nom'),
                'subjects' => Enseignement::where('enseignant_id', $enseignant->id)
                    ->with('matiere')
                    ->distinct('matiere_id')
                    ->get()
                    ->pluck('matiere.nom'),
            ],
            'recent_activities' => [
                'recent_notes' => Note::whereHas('enseignement', function ($query) use ($enseignant) {
                    $query->where('enseignant_id', $enseignant->id);
                })
                    ->with(['eleve.user', 'enseignement.matiere'])
                    ->orderBy('created_at', 'desc')
                    ->limit(5)
                    ->get(),
            ],
            'schedule' => $this->getTeacherSchedule($enseignant->id),
        ];
    }

    /**
     * Données pour le tableau de bord de l'enseignant titulaire
     */
    private function getFormTeacherDashboardData($user): array
    {
        $enseignant = $user->enseignant;
        
        if (!$enseignant) {
            return ['error' => 'Profil enseignant non trouvé'];
        }

        $managedClass = Classe::where('enseignant_id', $enseignant->id)->first();
        
        if (!$managedClass) {
            return ['error' => 'Aucune classe assignée comme titulaire'];
        }

        $activeTrimester = Trimestre::where('est_actif', true)->first();
        
        return [
            'teacher_info' => [
                'name' => $user->name,
                'managed_class' => $managedClass->nom,
            ],
            'class_info' => [
                'students_count' => $managedClass->eleves()->count(),
                'active_trimester' => $activeTrimester,
                'recent_bulletins' => Bulletin::whereHas('eleve', function ($query) use ($managedClass) {
                    $query->where('classe_id', $managedClass->id);
                })
                    ->with(['eleve.user', 'trimestre'])
                    ->orderBy('date_generation', 'desc')
                    ->limit(5)
                    ->get(),
            ],
            'class_statistics' => [
                'attendance_rate' => $this->getClassAttendanceRate($managedClass->id),
                'average_grade' => $this->getClassAverageGrade($managedClass->id),
                'recent_absences' => Absence::whereHas('eleve', function ($query) use ($managedClass) {
                    $query->where('classe_id', $managedClass->id);
                })
                    ->with(['eleve.user'])
                    ->orderBy('date_absence', 'desc')
                    ->limit(5)
                    ->get(),
            ],
        ];
    }

    /**
     * Données pour le tableau de bord du superviseur général
     */
    private function getGeneralSupervisorDashboardData(): array
    {
        return [
            'statistics' => [
                'total_students' => Eleve::count(),
                'total_teachers' => Enseignant::count(),
                'total_classes' => Classe::count(),
                'active_trimester' => Trimestre::where('est_actif', true)->first(),
            ],
            'academic_overview' => [
                'classes_by_level' => Classe::select('niveau', DB::raw('count(*) as count'))
                    ->groupBy('niveau')
                    ->get(),
                'subjects_by_group' => DB::table('matieres')
                    ->select('groupe', DB::raw('count(*) as count'))
                    ->groupBy('groupe')
                    ->get(),
            ],
            'recent_activities' => [
                'recent_bulletins' => Bulletin::with(['eleve.user', 'trimestre'])
                    ->orderBy('date_generation', 'desc')
                    ->limit(10)
                    ->get(),
            ],
        ];
    }

    /**
     * Données pour le tableau de bord du censeur
     */
    private function getCensorDashboardData(): array
    {
        return [
            'statistics' => [
                'total_bulletins' => Bulletin::count(),
                'validated_bulletins' => Bulletin::where('est_valide', true)->count(),
                'pending_bulletins' => Bulletin::where('est_valide', false)->count(),
            ],
            'recent_activities' => [
                'recent_bulletins' => Bulletin::with(['eleve.user', 'trimestre'])
                    ->orderBy('date_generation', 'desc')
                    ->limit(10)
                    ->get(),
            ],
            'validation_queue' => Bulletin::where('est_valide', false)
                ->with(['eleve.user', 'trimestre'])
                ->orderBy('date_generation', 'asc')
                ->limit(5)
                ->get(),
        ];
    }

    /**
     * Données pour le tableau de bord du principal
     */
    private function getPrincipalDashboardData(): array
    {
        return [
            'statistics' => [
                'total_students' => Eleve::count(),
                'total_teachers' => Enseignant::count(),
                'total_classes' => Classe::count(),
                'active_trimester' => Trimestre::where('est_actif', true)->first(),
            ],
            'academic_performance' => [
                'average_by_class' => $this->getAverageByClass(),
                'attendance_rate' => $this->getOverallAttendanceRate(),
            ],
            'recent_activities' => [
                'recent_bulletins' => Bulletin::with(['eleve.user', 'trimestre'])
                    ->orderBy('date_generation', 'desc')
                    ->limit(10)
                    ->get(),
                'recent_absences' => Absence::with(['eleve.user', 'eleve.classe'])
                    ->orderBy('date_absence', 'desc')
                    ->limit(10)
                    ->get(),
            ],
        ];
    }

    /**
     * Données pour le tableau de bord de l'invité
     */
    private function getGuestDashboardData(): array
    {
        return [
            'general_info' => [
                'school_name' => 'Établissement Scolaire',
                'active_trimester' => Trimestre::where('est_actif', true)->first(),
            ],
            'public_info' => [
                'total_classes' => Classe::count(),
                'total_subjects' => DB::table('matieres')->count(),
            ],
        ];
    }

    /**
     * Obtenir la distribution des notes pour les graphiques
     */
    private function getNotesDistribution(): array
    {
        $distribution = [
            '0-5' => 0,
            '6-10' => 0,
            '11-15' => 0,
            '16-20' => 0,
        ];

        $notes = Note::select('valeur')->get();

        foreach ($notes as $note) {
            $value = $note->valeur;
            if ($value <= 5) {
                $distribution['0-5']++;
            } elseif ($value <= 10) {
                $distribution['6-10']++;
            } elseif ($value <= 15) {
                $distribution['11-15']++;
            } else {
                $distribution['16-20']++;
            }
        }

        return $distribution;
    }

    /**
     * Obtenir l'emploi du temps d'un enseignant
     */
    private function getTeacherSchedule(int $teacherId): array
    {
        // Logique pour récupérer l'emploi du temps de l'enseignant
        // Implémentation à adapter selon la structure de la table seance_cours
        return [];
    }

    /**
     * Calculer le taux de présence d'une classe
     */
    private function getClassAttendanceRate(int $classId): float
    {
        // Logique pour calculer le taux de présence
        // Implémentation à adapter selon les besoins
        return 0.0;
    }

    /**
     * Calculer la moyenne générale d'une classe
     */
    private function getClassAverageGrade(int $classId): float
    {
        // Logique pour calculer la moyenne générale
        // Implémentation à adapter selon les besoins
        return 0.0;
    }

    /**
     * Obtenir la moyenne par classe
     */
    private function getAverageByClass(): array
    {
        // Logique pour obtenir la moyenne par classe
        // Implémentation à adapter selon les besoins
        return [];
    }

    /**
     * Calculer le taux de présence global
     */
    private function getOverallAttendanceRate(): float
    {
        // Logique pour calculer le taux de présence global
        // Implémentation à adapter selon les besoins
        return 0.0;
    }
}