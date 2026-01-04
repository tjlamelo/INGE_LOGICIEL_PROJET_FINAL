<?php

declare(strict_types=1);

namespace App\Services\Evaluation;

use App\Models\{Bulletin, Classe, Eleve, Note, Trimestre};
use Illuminate\Support\Facades\{DB, Log};
use Illuminate\Support\Collection;

/**
 * Service dynamique pour la gestion des bulletins.
 * Supporte les recalculs post-revendication.
 */
final class BulletinService
{
    /**
     * Point d'entrée principal : Génère ou Recalcule les bulletins.
     */
    public function processClasse(Classe $classe, Trimestre $trimestre): void
    {
        // 1. Extraction des données nécessaires
        $eleves = $classe->eleves()->with('user')->get();
        $notesClasse = $this->getNotesForClasse($eleves->pluck('id')->toArray(), $trimestre->id);

        // 2. Calculs statistiques globaux (Profil et Matières)
        $moyennesGlobales = $this->calculateAllStudentAverages($notesClasse);
        $profilClasse = $this->calculateClassProfile($moyennesGlobales);
        $statsMatieres = $this->calculateSubjectStats($notesClasse);

        // 3. Persistance transactionnelle
        DB::transaction(function () use ($eleves, $notesClasse, $trimestre, $moyennesGlobales, $profilClasse, $statsMatieres) {
            foreach ($eleves as $eleve) {
                $notesEleve = $notesClasse->get($eleve->id, collect());

                // Si le bulletin est déjà validé, on ignore le recalcul (Robustesse)
                $bulletinExistant = Bulletin::where('eleve_id', $eleve->id)
                    ->where('trimestre_id', $trimestre->id)->first();

                if ($bulletinExistant && $bulletinExistant->est_valide) {
                    continue;
                }

                if ($notesEleve->isEmpty())
                    continue;

                $this->saveBulletin($eleve, $trimestre, $notesEleve, $moyennesGlobales, $profilClasse, $statsMatieres);
            }
        });
    }

    /**
     * Sauvegarde ou Mise à jour d'un bulletin individuel (Dynamicité)
     */
    private function saveBulletin($eleve, $trimestre, $notesEleve, $moyennesGlobales, $profilClasse, $statsMatieres): void
    {
        $moyennePerso = $moyennesGlobales[$eleve->id] ?? 0;

        Bulletin::updateOrCreate(
            ['eleve_id' => $eleve->id, 'trimestre_id' => $trimestre->id],
            [
                'moyenne_generale' => $moyennePerso,
                'rang' => $this->calculateRank($eleve->id, $moyennesGlobales),
                'effectif_classe' => count($moyennesGlobales),
                'moyennes_matieres' => $this->formatSubjectDetails($notesEleve, $statsMatieres, $eleve->id),
                'stats_sequences' => $this->getSequenceStats($notesEleve, $trimestre), // Passer le trimestre
                'profil_classe' => $profilClasse,
                'appreciation_generale' => $this->genererAppreciation($moyennePerso),
                'date_generation' => now(),
            ]
        );
    }

    /**
     * Calcul de la moyenne pondérée (Robustesse)
     */
    private function calculateWeightedAverage(Collection $notes): float
    {
        $points = $notes->sum(fn($n) => (float) $n->valeur * (int) $n->enseignement->coefficient);
        $coeffs = $notes->sum(fn($n) => (int) $n->enseignement->coefficient);
        // Utilisation de round pour la moyenne générale
        return $coeffs > 0 ? round($points / $coeffs, 2) : 0.00;
    }
    /**
     * Statistiques par matière (MGC, Min, Max, Rang interne)
     */
    private function calculateSubjectStats(Collection $notesClasse): Collection
    {
        return $notesClasse->flatten()->groupBy('enseignement_id')->map(function ($notes) {
            $moyennes = $notes->groupBy('eleve_id')->map(fn($n) => round($n->avg('valeur'), 2));
            return [
                'mgc' => round($moyennes->avg(), 2),
                'min' => round($moyennes->min(), 2),
                'max' => round($moyennes->max(), 2),
                'distribution' => $moyennes->sortDesc()->values()
            ];
        });
    }

    /**
     * Profil de la classe (Moy Premier, Dernier, Ecart-type)
     */
    private function calculateClassProfile(Collection $moyennes): array
    {
        if ($moyennes->isEmpty())
            return [];

        $moyGen = round($moyennes->avg(), 2);
        // Calcul de l'écart-type arrondi
        $ecart = sqrt($moyennes->map(fn($m) => pow($m - $moyGen, 2))->avg());

        return [
            'moy_gen' => $moyGen,
            'moy_premier' => round($moyennes->max(), 2),
            'moy_dernier' => round($moyennes->min(), 2),
            'taux_reussite' => round(($moyennes->filter(fn($m) => $m >= 10)->count() / $moyennes->count()) * 100, 2),
            'ecart_type' => round($ecart, 2)
        ];
    }

    // --- Helpers de Données ---

    private function getNotesForClasse(array $eleveIds, int $trimestreId): Collection
    {
        return Note::whereIn('eleve_id', $eleveIds)
            ->where('trimestre_id', $trimestreId)
            ->with(['enseignement.matiere', 'enseignement.enseignant.user'])
            ->get()
            ->groupBy('eleve_id');
    }

    private function calculateAllStudentAverages(Collection $notesGrouped): Collection
    {
        return $notesGrouped->map(fn($notes) => $this->calculateWeightedAverage($notes))->sortDesc();
    }

    private function calculateRank(int $eleveId, Collection $moyennes): int
    {
        return $moyennes->keys()->search($eleveId) + 1;
    }

    private function formatSubjectDetails(Collection $notes, Collection $stats, int $eleveId): array
    {
        return $notes->groupBy('enseignement_id')->map(function ($n) use ($stats, $eleveId) {
            $ens = $n->first()->enseignement;
            $moy = round($n->avg('valeur'), 2);

            return [
                'matiere' => $ens->matiere->nom,
                'matiere_id' => $ens->id,
                'groupe' => $ens->matiere->groupe,
                'coeff' => $ens->coefficient,
                'moyenne' => $moy,
                'total' => round($moy * $ens->coefficient, 2), // Points totaux arrondis
                'mgc' => round($stats[$ens->id]['mgc'] ?? 0, 2),
                'min' => round($stats[$ens->id]['min'] ?? 0, 2),
                'max' => round($stats[$ens->id]['max'] ?? 0, 2),
                'rang' => isset($stats[$ens->id]) ? ($stats[$ens->id]['distribution']->search($moy) + 1) : '-',
                'enseignant' => $ens->enseignant->user->name ?? ''
            ];
        })->values()->toArray();
    }
    private function getSequenceStats(Collection $notes, Trimestre $trimestre): array
    {
        if ($notes->isEmpty())
            return [];

        $sequencesDuTrimestre = $this->getSequencesByTrimestre($trimestre->nom);
        $sequences = array_fill_keys($sequencesDuTrimestre, []);

        $notesParSequence = $notes->groupBy('sequence')->filter(function ($notesSequence, $sequenceId) use ($sequencesDuTrimestre) {
            return in_array($sequenceId, $sequencesDuTrimestre);
        });

        foreach ($notesParSequence as $sequenceId => $notesSequence) {
            $matieres = $notesSequence->groupBy('enseignement_id')->map(function ($notesMatiere) {
                $points = $notesMatiere->sum(fn($n) => (float) $n->valeur * (int) $n->enseignement->coefficient);
                $coeffs = $notesMatiere->sum(fn($n) => (int) $n->enseignement->coefficient);

                return [
                    'matiere_id' => $notesMatiere->first()->enseignement_id,
                    'matiere' => $notesMatiere->first()->enseignement->matiere->nom,
                    'moyenne' => $coeffs > 0 ? round($points / $coeffs, 2) : 0.00,
                    'coefficient' => $notesMatiere->first()->enseignement->coefficient,
                ];
            });

            $sequences[$sequenceId] = $matieres->keyBy('matiere_id')->toArray();
        }

        return $sequences;
    }
    /**
     * Détermine les séquences appartenant à un trimestre
     */
    private function getSequencesByTrimestre(string $nomTrimestre): array
    {
        switch ($nomTrimestre) {
            case '1er Trimestre':
                return [1, 2];
            case '2ème Trimestre':
                return [3, 4];
            case '3ème Trimestre':
                return [5, 6];
            default:
                \Log::warning("Nom de trimestre non reconnu: $nomTrimestre");
                return [1, 2]; // Par défaut
        }
    }
    private function genererAppreciation(float $moy): string
    {
        if ($moy >= 16)
            return "Excellent travail";
        if ($moy >= 12)
            return "Satisfaisant";
        if ($moy >= 10)
            return "Juste Moyen";
        return "Efforts nécessaires";
    }
}