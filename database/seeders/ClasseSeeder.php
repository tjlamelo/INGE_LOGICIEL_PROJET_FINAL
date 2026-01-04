<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ClasseSeeder extends Seeder
{
    public function run(): void
    {
        // Récupérer tous les IDs des enseignants disponibles
        $enseignantIds = DB::table('enseignants')->pluck('id')->toArray();

        $classes = [
            // 6e
            ['nom' => '6e A', 'niveau' => '6e', 'filiere' => null],
            ['nom' => '6e B', 'niveau' => '6e', 'filiere' => null],

            // 5e
            ['nom' => '5e A', 'niveau' => '5e', 'filiere' => null],
            ['nom' => '5e B', 'niveau' => '5e', 'filiere' => null],

            // 4e
            ['nom' => '4e ESPAGNOLE', 'niveau' => '4e', 'filiere' => 'ESPAGNOLE'],
            ['nom' => '4e ALLEMANDE', 'niveau' => '4e', 'filiere' => 'ALLEMANDE'],
            ['nom' => '4e CHINOISE', 'niveau' => '4e', 'filiere' => 'CHINOISE'],
            ['nom' => '4e LATIN', 'niveau' => '4e', 'filiere' => 'LATIN'],
            ['nom' => '4e BILINGUE', 'niveau' => '4e', 'filiere' => 'BILINGUE'],

            // 3e
            ['nom' => '3e ESPAGNOLE', 'niveau' => '3e', 'filiere' => 'ESPAGNOLE'],
            ['nom' => '3e ALLEMANDE', 'niveau' => '3e', 'filiere' => 'ALLEMANDE'],
            ['nom' => '3e CHINOISE', 'niveau' => '3e', 'filiere' => 'CHINOISE'],
            ['nom' => '3e LATIN', 'niveau' => '3e', 'filiere' => 'LATIN'],
            ['nom' => '3e BILINGUE', 'niveau' => '3e', 'filiere' => 'BILINGUE'],

            // 2nde
            ['nom' => '2nde A', 'niveau' => '2nde', 'filiere' => 'LITTERAIRE'],
            ['nom' => '2nde C', 'niveau' => '2nde', 'filiere' => 'SCIENTIFIQUE'],
            ['nom' => '2nde BILINGUE', 'niveau' => '2nde', 'filiere' => 'LITTERAIRE'],

            // 1ère
            ['nom' => '1ère A1', 'niveau' => '1ère', 'filiere' => 'LITTERAIRE'],
            ['nom' => '1ère A2', 'niveau' => '1ère', 'filiere' => 'LITTERAIRE'],
            ['nom' => '1ère C', 'niveau' => '1ère', 'filiere' => 'SCIENTIFIQUE'],
            ['nom' => '1ère D', 'niveau' => '1ère', 'filiere' => 'SCIENTIFIQUE'],
            ['nom' => '1ère TI', 'niveau' => '1ère', 'filiere' => 'TECHNOLOGIE'],

            // Terminale
            ['nom' => 'Terminale A1', 'niveau' => 'Terminale', 'filiere' => 'LITTERAIRE'],
            ['nom' => 'Terminale C', 'niveau' => 'Terminale', 'filiere' => 'SCIENTIFIQUE'],
            ['nom' => 'Terminale D', 'niveau' => 'Terminale', 'filiere' => 'SCIENTIFIQUE'],
            ['nom' => 'Terminale TI', 'niveau' => 'Terminale', 'filiere' => 'TECHNOLOGIE'],
        ];

        foreach ($classes as $classe) {
            // On pioche un prof titulaire au hasard s'il y en a de disponibles
            $titulaireId = !empty($enseignantIds) ? $enseignantIds[array_rand($enseignantIds)] : null;

            DB::table('classes')->insert([
                'nom' => $classe['nom'],
                'niveau' => $classe['niveau'],
                'filiere' => $classe['filiere'],
                'enseignant_id' => $titulaireId, // Attribution du prof titulaire
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}