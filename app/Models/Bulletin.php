<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bulletin extends Model
{
    use HasFactory;

    /**
     * Les attributs qui peuvent être assignés en masse.
     *
     * @var array<int, string>
     */
    protected $fillable = [
    'eleve_id',
    'trimestre_id',
    'moyenne_generale',
    'moyennes_matieres',
    'stats_sequences', // AJOUT ICI
    'profil_classe',   // AJOUT ICI
    'rang',
    'effectif_classe',
    'appreciation_generale',
    'est_valide',
    'date_generation',
    'chemin_pdf',
];





    /**
     * Les attributs qui doivent être convertis en types natifs.
     *
     * @var array
     */
   protected $casts = [
    'moyenne_generale' => 'decimal:2',
    'est_valide' => 'boolean',
    'moyennes_matieres' => 'array', // Déjà présent
    'stats_sequences' => 'array',   // AJOUT ICI
    'profil_classe' => 'array',     // AJOUT ICI
    'date_generation' => 'datetime',
];

    /**
     * Obtenir l'élève propriétaire du bulletin.
     */
    public function eleve()
    {
        return $this->belongsTo(Eleve::class);
    }

    /**
     * Obtenir le trimestre du bulletin.
     */
    public function trimestre()
    {
        return $this->belongsTo(Trimestre::class);
    }
}