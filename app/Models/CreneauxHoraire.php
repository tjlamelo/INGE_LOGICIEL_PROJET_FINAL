<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CreneauHoraire extends Model
{
    use HasFactory;

    protected $table = 'creneaux_horaires';

    protected $fillable = [
        'heure_debut',
        'heure_fin',
        'libelle',
    ];
}
