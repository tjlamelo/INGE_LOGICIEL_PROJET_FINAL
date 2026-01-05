<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CertificatsScolarite extends Model
{
    use HasFactory;

    /**
     * Les attributs qui sont mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'eleve_id',
        'annee_scolaire',
        'numero_certificat',
        'statut',
        'date_generation',
        'date_signature',
        'signe_par',
        'chemin_pdf',
    ];

    /**
     * Les attributs qui doivent être convertis en types natifs.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'id' => 'integer',
        'eleve_id' => 'integer',
        'date_generation' => 'datetime',
        'date_signature' => 'datetime',
    ];

    /**
     * Obtenir l'élève associé à ce certificat.
     */
    public function eleve(): BelongsTo
    {
        return $this->belongsTo(Eleve::class);
    }

    /**
     * Obtenir le statut formaté du certificat.
     */
    public function getStatutFormattedAttribute(): string
    {
        return match($this->statut) {
            'brouillon' => 'Brouillon',
            'valide' => 'Validé',
            default => 'Inconnu',
        };
    }

    /**
     * Obtenir l'URL du certificat PDF.
     */
    public function getPdfUrlAttribute(): ?string
    {
        return $this->chemin_pdf ? asset('storage/' . $this->chemin_pdf) : null;
    }
}