<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
    use HasFactory;

    /**
     * Les attributs qui peuvent être assignés en masse.
     *
     * @var array<int, string>
     */
   protected $fillable = [
        'valeur', 'eleve_id', 'enseignement_id', 
        'trimestre_id', 'sequence', 'type_evaluation', 
        'date_evaluation', 'appreciation'
    ];

    /**
     * Les attributs qui doivent être convertis.
     *
     * @var array
     */
    protected $casts = [
        'valeur' => 'decimal:2',
        'date_evaluation' => 'date',
    ];

    /**
     * Obtenir l'élève qui possède cette note.
     */
    public function eleve()
    {
        return $this->belongsTo(Eleve::class);
    }

    /**
     * Obtenir l'enseignement auquel cette note est rattachée.
     */
    public function enseignement()
    {
        return $this->belongsTo(Enseignement::class);
    }

    /**
     * Obtenir le trimestre de cette note.
     */
    public function trimestre()
    {
        return $this->belongsTo(Trimestre::class);
    }
}