<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TrimestreSeeder extends Seeder
{
    public function run(): void
    {
        $anneeScolaire = '2025/2026';

        $trimestres = [
            [
                'nom' => '1er Trimestre', 
                'annee_scolaire' => $anneeScolaire, 
                'est_actif' => true, // On active le premier par défaut
                'sequence_active' => 1,
                'created_at' => now(), 
                'updated_at' => now()
            ],
            [
                'nom' => '2ème Trimestre', 
                'annee_scolaire' => $anneeScolaire, 
                'est_actif' => false, 
                'sequence_active' => 3,
                'created_at' => now(), 
                'updated_at' => now()
            ],
            [
                'nom' => '3ème Trimestre', 
                'annee_scolaire' => $anneeScolaire, 
                'est_actif' => false, 
                'sequence_active' => 4,
                'created_at' => now(), 
                'updated_at' => now()
            ],
        ];

        foreach ($trimestres as $trim) {
            DB::table('trimestres')->updateOrInsert(
                [
                    'nom' => $trim['nom'], 
                    'annee_scolaire' => $trim['annee_scolaire']
                ],
                $trim
            );
        }
    }
}