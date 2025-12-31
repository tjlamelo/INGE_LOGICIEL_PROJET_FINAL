<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Eleve extends Model
{
    protected $table = 'eleves';

    protected $fillable = [
        'user_id',
        'matricule',
        'date_naissance',
        'lieu_naissance',
        'sexe',
        'nom_tuteur',
        'contact_tuteur',
        'classe_id',
    ];

    protected $casts = [
        'date_naissance' => 'date',
    ];

    /**
     * L'élève appartient à un utilisateur.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * L'élève appartient à une classe.
     */
    public function classe(): BelongsTo
    {
        return $this->belongsTo(Classe::class);
    }
}
