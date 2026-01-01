<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Trimestre extends Model
{
    use HasFactory;

    /**
     * Les champs pouvant être assignés en masse.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nom',
        'annee_scolaire',
    ];

    /**
     * Indique si le modèle doit gérer automatiquement les colonnes created_at / updated_at.
     *
     * @var bool
     */
    public $timestamps = true;
}
