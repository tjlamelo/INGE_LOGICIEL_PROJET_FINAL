<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EnseignementSeeder extends Seeder
{
    public function run(): void
    {
        $classes = DB::table('classes')->get();
        $matieres = DB::table('matieres')->get();
        $enseignants = DB::table('enseignants')->get();

        foreach ($classes as $classe) {
            $filiere = $classe->filiere;
            $niveau = $classe->niveau; // '6e', '5e', '4e', etc.

            foreach ($matieres as $matiere) {
                // Par défaut, coefficient de base pour toutes les matières
                $coefficient = 1; 

                // --- 1. GROUPE SCIENCES (Pour tous) ---
                if (in_array($matiere->code, ['MATH', 'SVT', 'INFO'])) {
                    $coefficient = ($filiere === 'SCIENTIFIQUE') ? 4 : 2;
                }
                
                // Physique & Chimie (Obligatoire pour tous au 1er cycle)
                if (in_array($matiere->code, ['PHY', 'CHM'])) {
                    $coefficient = ($filiere === 'SCIENTIFIQUE') ? 3 : 1;
                }

                // --- 2. GROUPE LANGUES (Pour tous) ---
                if (in_array($matiere->code, ['FR', 'EN'])) {
                    $coefficient = ($filiere === 'LITTERAIRE') ? 4 : 3;
                }

                // LATIN : Activé dès la 6e et 5e
                if ($matiere->code === 'LAT') {
                    if (in_array($niveau, ['6e', '5e', '4e', '3e'])) {
                        $coefficient = 2; // Coef important au premier cycle
                    } else {
                        $coefficient = ($filiere === 'LITTERAIRE') ? 3 : 0; // Optionnel ou supprimé en terminale C
                    }
                }

                // AUTRES LANGUES (LV2: All, Esp, Chi) : Généralement à partir de la 4e
                if (in_array($matiere->code, ['LV2', 'ALL', 'ESP', 'CHI'])) {
                    if (in_array($niveau, ['6e', '5e'])) {
                        $coefficient = 0; // Pas encore de LV2 en 6e/5e
                    } else {
                        $coefficient = 2;
                    }
                }

                // --- 3. GROUPE HUMAINES & DIVERS ---
                if (in_array($matiere->code, ['HIST', 'GEOG', 'ECM', 'EPS'])) {
                    $coefficient = 2;
                }

                // Matières d'éveil (Art, Musique, Travail Manuel)
                if (in_array($matiere->code, ['ART', 'MUS', 'TMAN', 'TECH'])) {
                    $coefficient = 1;
                }

                // --- INSERTION ---
                if ($coefficient > 0) {
                    $enseignant = $enseignants->random();
                    
                    DB::table('enseignements')->updateOrInsert(
                        ['classe_id' => $classe->id, 'matiere_id' => $matiere->id],
                        [
                            'enseignant_id' => $enseignant->id,
                            'coefficient'   => $coefficient,
                            'updated_at'    => now(),
                        ]
                    );
                }
            }
        }
    }
}