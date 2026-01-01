<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Enseignement extends Model
{
    use HasFactory;

    protected $fillable = [
        'enseignant_id',
        'classe_id',
        'matiere_id',
        'coefficient',
    ];

    // Relations

    public function enseignant()
    {
        return $this->belongsTo(User::class, 'enseignant_id');
    }

    public function classe()
    {
        return $this->belongsTo(Classe::class);
    }

    public function matiere()
    {
        return $this->belongsTo(Matiere::class);
    }
}
