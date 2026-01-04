<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enseignant extends Model
{
    use HasFactory;

    /**
     * Les attributs qui peuvent être assignés en masse.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'matricule',
        'telephone',
        'adresse',
    ];

    /**
     * Obtenir l'utilisateur associé à cet enseignant.
     * Relation One-to-One : Un enseignant est un utilisateur.
     */
  public function user()
{
    return $this->belongsTo(User::class);
}

}