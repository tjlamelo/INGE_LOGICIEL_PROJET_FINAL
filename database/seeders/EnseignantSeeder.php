<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User; // Utilisation du modèle User
use App\Models\Enseignant; // Utilisation du modèle Enseignant
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class EnseignantSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('fr_FR');

        $nomsCamer = ['Ngassa', 'Mbarga', 'Tchouassi', 'Fonkoua', 'Etoundi', 'Nkou', 'Oben', 'Fomunyoh', 'Tita', 'Mendomo', 'Nguimfack', 'Abanda', 'Kouam', 'Tchouate', 'Fokou', 'Bello', 'Etoa', 'Ndoumbe'];
        $prenomsCamer = ['Jean', 'Emmanuel', 'Christelle', 'Yannick', 'Patricia', 'Brice', 'Sandra', 'Michel', 'Lionel', 'Carine', 'Samuel', 'Estelle', 'Dieudonné', 'Marie', 'Thérèse'];

        $specialites = ['Mathématiques', 'Français', 'Anglais', 'Histoire-Géographie', 'Physique-Chimie', 'SVT', 'Informatique', 'Philosophie', 'EPS', 'Allemand', 'Espagnol'];
        $gradesCamer = ['PLEG', 'PCEG', 'PCET', 'Contractuel d\'administration', 'Vacataire'];
        $statuts = ['Actif', 'Actif', 'Actif', 'En congé', 'Inactif'];

        $totalEnseignants = 45;
        $anneePrefixe = "25"; 

        for ($i = 1; $i <= $totalEnseignants; $i++) {
            
            $kNom = array_rand($nomsCamer, 2);
            $nomComplet = $nomsCamer[$kNom[0]] . ' ' . $nomsCamer[$kNom[1]];

            $kPrenom = array_rand($prenomsCamer, 2);
            $prenomComplet = $prenomsCamer[$kPrenom[0]] . ' ' . $prenomsCamer[$kPrenom[1]];

            $matricule = 'ENS-' . $anneePrefixe . str_pad($i, 3, '0', STR_PAD_LEFT);
            $email = strtolower(str_replace(' ', '.', $nomsCamer[$kNom[0]])) . $i . '@school.cm';

            // 1. Création du compte User via Eloquent
            $user = User::create([
                'name' => $nomComplet . ' ' . $prenomComplet,
                'email' => $email,
                'password' => Hash::make('profs2026'),
            ]);

            // --- ATTRIBUTION DU RÔLE ICI ---
            // On attribue le rôle 'teacher' par défaut
            $user->assignRole('teacher');

        
            // 2. Création de l'Enseignant lié
            Enseignant::create([
                'user_id' => $user->id,
                'matricule' => $matricule,
                'specialite' => $specialites[array_rand($specialites)],
                'grade' => $gradesCamer[array_rand($gradesCamer)],
                'statut' => $statuts[array_rand($statuts)],
                'telephone' => '6' . $faker->regexify('[5-9][0-9]{7}'),
                'adresse' => $faker->city . ', ' . $faker->streetName,
            ]);
        }
    }
}