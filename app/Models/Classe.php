<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Classe extends Model
{
        protected $table = 'classes';

    protected $fillable = [
        'nom',
        'niveau',
        'filiere',
    ];
}
