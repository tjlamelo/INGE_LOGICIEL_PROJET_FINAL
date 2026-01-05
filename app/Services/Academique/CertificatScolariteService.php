<?php

declare(strict_types=1);

namespace App\Services\Academique;

use App\Models\{CertificatsScolarite, Eleve, Classe};
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\{DB, Log, Storage};
use Illuminate\Support\Str;
use Barryvdh\DomPDF\Facade\Pdf;

/**
 * Service pour la gestion des certificats de scolarité.
 */
final class CertificatScolariteService
{
    /**
     * Obtenir tous les certificats avec pagination.
     */
    public function getAllCertificats(int $perPage = 10): LengthAwarePaginator
    {
        return CertificatsScolarite::with('eleve.user')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Obtenir les certificats par statut.
     */
    public function getCertificatsByStatut(string $statut, int $perPage = 10): LengthAwarePaginator
    {
        return CertificatsScolarite::with('eleve.user')
            ->where('statut', $statut)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Obtenir un certificat par son ID.
     */
    public function getCertificatById(int $id): CertificatsScolarite
    {
        return CertificatsScolarite::with('eleve.user')->findOrFail($id);
    }

    /**
     * Obtenir les certificats par année scolaire.
     */
    public function getCertificatsByAnneeScolaire(string $anneeScolaire, int $perPage = 10): LengthAwarePaginator
    {
        return CertificatsScolarite::with('eleve.user')
            ->where('annee_scolaire', $anneeScolaire)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Obtenir les certificats par élève.
     */
    public function getCertificatsByEleve(int $eleveId): Collection
    {
        return CertificatsScolarite::where('eleve_id', $eleveId)
            ->orderBy('annee_scolaire', 'desc')
            ->get();
    }

    /**
     * Créer un nouveau certificat de scolarité.
     */
    public function createCertificat(array $data): CertificatsScolarite
    {
        try {
            // Vérifier si l'élève existe
            $eleve = Eleve::findOrFail($data['eleve_id']);
            
            // Vérifier si un certificat existe déjà pour cet élève et cette année scolaire
            $existingCertificat = CertificatsScolarite::where('eleve_id', $data['eleve_id'])
                ->where('annee_scolaire', $data['annee_scolaire'])
                ->first();

            if ($existingCertificat) {
                throw new \InvalidArgumentException("Un certificat existe déjà pour cet élève pour l'année scolaire {$data['annee_scolaire']}");
            }

            // Générer un numéro de certificat unique
            $numeroCertificat = $this->generateNumeroCertificat($data['annee_scolaire']);

            return DB::transaction(function () use ($data, $numeroCertificat) {
                $certificat = CertificatsScolarite::create([
                    'eleve_id' => $data['eleve_id'],
                    'annee_scolaire' => $data['annee_scolaire'],
                    'numero_certificat' => $numeroCertificat,
                    'statut' => 'brouillon',
                ]);

                Log::info("Certificat de scolarité créé", [
                    'certificat_id' => $certificat->id,
                    'eleve_id' => $data['eleve_id'],
                    'annee_scolaire' => $data['annee_scolaire'],
                ]);

                return $certificat;
            });
        } catch (\Exception $e) {
            Log::error("Erreur lors de la création du certificat de scolarité", [
                'error' => $e->getMessage(),
                'data' => $data,
            ]);

            throw $e;
        }
    }

    /**
     * Mettre à jour un certificat de scolarité.
     */
    public function updateCertificat(int $id, array $data): CertificatsScolarite
    {
        try {
            $certificat = $this->getCertificatById($id);

            // Si le certificat est déjà validé, on ne peut plus le modifier
            if ($certificat->statut === 'valide') {
                throw new \InvalidArgumentException("Impossible de modifier un certificat déjà validé");
            }

            $certificat->update($data);

            Log::info("Certificat de scolarité mis à jour", [
                'certificat_id' => $certificat->id,
            ]);

            return $certificat;
        } catch (\Exception $e) {
            Log::error("Erreur lors de la mise à jour du certificat de scolarité", [
                'error' => $e->getMessage(),
                'certificat_id' => $id,
                'data' => $data,
            ]);

            throw $e;
        }
    }

    /**
     * Supprimer un certificat de scolarité.
     */
    public function deleteCertificat(int $id): bool
    {
        try {
            $certificat = $this->getCertificatById($id);

            // Si le certificat est déjà validé, on ne peut plus le supprimer
            if ($certificat->statut === 'valide') {
                throw new \InvalidArgumentException("Impossible de supprimer un certificat déjà validé");
            }

            // Supprimer le fichier PDF s'il existe
            if ($certificat->chemin_pdf && Storage::disk('public')->exists($certificat->chemin_pdf)) {
                Storage::disk('public')->delete($certificat->chemin_pdf);
            }

            $certificat->delete();

            Log::info("Certificat de scolarité supprimé", [
                'certificat_id' => $certificat->id,
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error("Erreur lors de la suppression du certificat de scolarité", [
                'error' => $e->getMessage(),
                'certificat_id' => $id,
            ]);

            throw $e;
        }
    }

    /**
     * Valider un certificat de scolarité.
     */
    public function validerCertificat(int $id, string $signePar): CertificatsScolarite
    {
        try {
            $certificat = $this->getCertificatById($id);

            // Si le certificat est déjà validé, on ne peut pas le valider à nouveau
            if ($certificat->statut === 'valide') {
                throw new \InvalidArgumentException("Ce certificat est déjà validé");
            }

            // Générer le PDF
            $cheminPdf = $this->generatePdf($certificat);

            $certificat->update([
                'statut' => 'valide',
                'date_signature' => now(),
                'signe_par' => $signePar,
                'chemin_pdf' => $cheminPdf,
            ]);

            Log::info("Certificat de scolarité validé", [
                'certificat_id' => $certificat->id,
                'signe_par' => $signePar,
            ]);

            return $certificat;
        } catch (\Exception $e) {
            Log::error("Erreur lors de la validation du certificat de scolarité", [
                'error' => $e->getMessage(),
                'certificat_id' => $id,
                'signe_par' => $signePar,
            ]);

            throw $e;
        }
    }

    /**
     * Générer un numéro de certificat unique.
     */
    private function generateNumeroCertificat(string $anneeScolaire): string
    {
        $prefix = 'CERT-' . $anneeScolaire . '-';
        
        // Compter le nombre de certificats pour cette année scolaire
        $count = CertificatsScolarite::where('annee_scolaire', $anneeScolaire)->count();
        
        // Générer un numéro séquentiel avec padding
        $numero = str_pad((string) ($count + 1), 4, '0', STR_PAD_LEFT);
        
        return $prefix . $numero;
    }

    /**
     * Générer le PDF du certificat.
     */
    private function generatePdf(CertificatsScolarite $certificat): string
    {
        $eleve = $certificat->eleve;
        
        // Créer le répertoire si nécessaire
        $directory = 'certificats/' . $certificat->annee_scolaire;
        if (!Storage::disk('public')->exists($directory)) {
            Storage::disk('public')->makeDirectory($directory);
        }
        
        // Nom du fichier
        $filename = 'certificat_' . $certificat->numero_certificat . '_' . Str::slug($eleve->user->name) . '.pdf';
        $filepath = $directory . '/' . $filename;
        
        // Générer le PDF
        $pdf = Pdf::loadView('certificats.scolarite', [
            'certificat' => $certificat,
            'eleve' => $eleve,
        ])->setPaper('a4', 'portrait');
        
        // Sauvegarder le fichier
        Storage::disk('public')->put($filepath, $pdf->output());
        
        return $filepath;
    }

    /**
     * Obtenir les années scolaires disponibles.
     */
    public function getAnneesScolaires(): Collection
    {
        return CertificatsScolarite::select('annee_scolaire')
            ->distinct()
            ->orderBy('annee_scolaire', 'desc')
            ->pluck('annee_scolaire');
    }
}