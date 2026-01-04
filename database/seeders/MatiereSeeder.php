<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MatiereSeeder extends Seeder
{
    public function run(): void
    {
        $matieres = [
            // --- GROUPE 1 : SCIENCES ET TECHNOLOGIES ---
            ['nom' => 'Mathématiques', 'code' => 'MATH', 'groupe' => 1],
            ['nom' => 'Physique', 'code' => 'PHY', 'groupe' => 1],
            ['nom' => 'Chimie', 'code' => 'CHM', 'groupe' => 1],
            ['nom' => 'Sciences de la Vie et de la Terre', 'code' => 'SVT', 'groupe' => 1],
            ['nom' => 'Informatique', 'code' => 'INFO', 'groupe' => 1],
            ['nom' => 'Technologie', 'code' => 'TECH', 'groupe' => 1],
            ['nom' => 'Économie', 'code' => 'ECO', 'groupe' => 1],
            ['nom' => 'Comptabilité', 'code' => 'COMP', 'groupe' => 1],

            // --- GROUPE 2 : LANGUES ET COMMUNICATION ---
            ['nom' => 'Français', 'code' => 'FR', 'groupe' => 2],
            ['nom' => 'Anglais', 'code' => 'EN', 'groupe' => 2],
            ['nom' => 'Langue Vivante II (LVII)', 'code' => 'LV2', 'groupe' => 2],
            ['nom' => 'Latin', 'code' => 'LAT', 'groupe' => 2],
            ['nom' => 'Espagnol', 'code' => 'ESP', 'groupe' => 2],
            ['nom' => 'Allemand', 'code' => 'ALL', 'groupe' => 2],
            ['nom' => 'Chinois', 'code' => 'CHI', 'groupe' => 2],

            // --- GROUPE 3 : SCIENCES HUMAINES & DÉVELOPPEMENT ---
            ['nom' => 'Histoire', 'code' => 'HIST', 'groupe' => 3],
            ['nom' => 'Géographie', 'code' => 'GEOG', 'groupe' => 3],
            ['nom' => 'Éducation à la Citoyenneté et à la Morale', 'code' => 'ECM', 'groupe' => 3],
            ['nom' => 'Éducation Physique et Sportive', 'code' => 'EPS', 'groupe' => 3],
            ['nom' => 'Art et Culture', 'code' => 'ART', 'groupe' => 3],
            ['nom' => 'Philosophie', 'code' => 'PHIL', 'groupe' => 3],
            ['nom' => 'Sciences Sociales', 'code' => 'SS', 'groupe' => 3],
            ['nom' => 'Éducation Civique', 'code' => 'ECIV', 'groupe' => 3],
            ['nom' => 'Musique', 'code' => 'MUS', 'groupe' => 3],
            ['nom' => 'Travail Manuel', 'code' => 'TMAN', 'groupe' => 3],
        ];

        foreach ($matieres as $matiere) {
            DB::table('matieres')->updateOrInsert(
                ['code' => $matiere['code']], 
                [
                    'nom' => $matiere['nom'],
                    'groupe' => $matiere['groupe'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}