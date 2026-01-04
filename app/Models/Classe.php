<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Classe extends Model
{
    protected $table = 'classes';

    protected $fillable = [
        'nom',
        'niveau',
        'filiere',
        'enseignant_id'
    ];
    
    /**
     * Obtenir le professeur titulaire de la classe.
     */
    public function titulaire(): BelongsTo
    {
        return $this->belongsTo(Enseignant::class, 'enseignant_id');
    }
    
    /**
     * Obtenir les élèves de cette classe.
     */
    public function eleves(): HasMany
    {
        return $this->hasMany(Eleve::class);
    }
    
    /**
     * Obtenir les enseignements pour cette classe.
     */
    public function enseignements(): HasMany
    {
        return $this->hasMany(Enseignement::class);
    }
}