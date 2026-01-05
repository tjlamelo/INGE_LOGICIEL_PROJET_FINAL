<?php

namespace App\Http\Controllers\Academique;

use App\Http\Controllers\Controller;
use App\Models\{CertificatsScolarite, Eleve};
use App\Services\Academique\CertificatScolariteService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class CertificatScolariteController extends Controller
{
    public function __construct(
        private CertificatScolariteService $certificatService
    ) {}

    /**
     * Afficher la liste des certificats de scolarité.
     */
    public function index(Request $request): Response
    {
        $filters = $request->only(['statut', 'annee_scolaire', 'search']);
        
        $certificats = $this->certificatService->getAllCertificats(15);
        
        if (!empty($filters['statut'])) {
            $certificats = $this->certificatService->getCertificatsByStatut($filters['statut'], 15);
        }
        
        if (!empty($filters['annee_scolaire'])) {
            $certificats = $this->certificatService->getCertificatsByAnneeScolaire($filters['annee_scolaire'], 15);
        }

        return Inertia::render('Academique/Certificats/Index', [
            'certificats' => $certificats,
            'filters' => $filters,
            'anneesScolaires' => $this->certificatService->getAnneesScolaires(),
        ]);
    }

    /**
     * Afficher le formulaire de création d'un certificat.
     */
    public function create(): Response
    {
        return Inertia::render('Academique/Certificats/Create', [
            'eleves' => Eleve::with('user')->orderBy('user.name')->get(),
            'anneesScolaires' => $this->getAvailableAnneesScolaires(),
        ]);
    }

    /**
     * Enregistrer un nouveau certificat de scolarité.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'eleve_id' => 'required|exists:eleves,id',
            'annee_scolaire' => 'required|string|max:20',
        ]);

        try {
            $certificat = $this->certificatService->createCertificat($request->all());
            
            return redirect()->route('certificats.show', $certificat->id)
                ->with('success', 'Certificat de scolarité créé avec succès.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage())->withInput();
        }
    }

    /**
     * Afficher les détails d'un certificat.
     */
    public function show(int $id): Response
    {
        $certificat = $this->certificatService->getCertificatById($id);
        
        return Inertia::render('Academique/Certificats/Show', [
            'certificat' => $certificat,
        ]);
    }

    /**
     * Afficher le formulaire d'édition d'un certificat.
     */
    public function edit(int $id): Response
    {
        $certificat = $this->certificatService->getCertificatById($id);
        
        return Inertia::render('Academique/Certificats/Edit', [
            'certificat' => $certificat,
            'eleves' => Eleve::with('user')->orderBy('user.name')->get(),
            'anneesScolaires' => $this->getAvailableAnneesScolaires(),
        ]);
    }

    /**
     * Mettre à jour un certificat.
     */
    public function update(Request $request, int $id): RedirectResponse
    {
        $request->validate([
            'eleve_id' => 'required|exists:eleves,id',
            'annee_scolaire' => 'required|string|max:20',
        ]);

        try {
            $certificat = $this->certificatService->updateCertificat($id, $request->all());
            
            return redirect()->route('certificats.show', $certificat->id)
                ->with('success', 'Certificat de scolarité mis à jour avec succès.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage())->withInput();
        }
    }

    /**
     * Supprimer un certificat.
     */
    public function destroy(int $id): RedirectResponse
    {
        try {
            $this->certificatService->deleteCertificat($id);
            
            return redirect()->route('certificats.index')
                ->with('success', 'Certificat de scolarité supprimé avec succès.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Valider un certificat.
     */
    public function valider(Request $request, int $id): RedirectResponse
    {
        $request->validate([
            'signe_par' => 'required|string|max:100',
        ]);

        try {
            $certificat = $this->certificatService->validerCertificat($id, $request->signe_par);
            
            return redirect()->route('certificats.show', $certificat->id)
                ->with('success', 'Certificat de scolarité validé avec succès.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Télécharger le PDF d'un certificat.
     */
    public function download(int $id): StreamedResponse
    {
        $certificat = $this->certificatService->getCertificatById($id);
        
        if (!$certificat->chemin_pdf || !Storage::disk('public')->exists($certificat->chemin_pdf)) {
            abort(404, 'Le fichier PDF n\'existe pas.');
        }
        
        $filename = 'certificat_' . $certificat->numero_certificat . '.pdf';
        
        return Storage::disk('public')->download($certificat->chemin_pdf, $filename);
    }

    /**
     * Obtenir les années scolaires disponibles.
     */
    private function getAvailableAnneesScolaires(): array
    {
        $currentYear = date('Y');
        $nextYear = $currentYear + 1;
        
        return [
            $currentYear . '/' . $nextYear,
            ($currentYear - 1) . '/' . $currentYear,
            ($currentYear - 2) . '/' . ($currentYear - 1),
        ];
    }
}