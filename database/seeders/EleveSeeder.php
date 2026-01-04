<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User; // Import du modèle User
use App\Models\Eleve; // Import du modèle Eleve
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\Hash;

class EleveSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('fr_FR');

        $nomsPossibles = [
            'Ngassa', 'Mbarga', 'Tchouassi', 'Fonkoua', 'Etoundi', 'Nkou', 'Oben', 'Fomunyoh', 
            'Tita', 'Mendomo', 'Nguimfack', 'Abanda', 'Kouam', 'Tchouate', 'Fokou', 'Moudiki', 
            'Ewane', 'Bello', 'Souaibou', 'Abdoulaye', 'Kamga', 'Etoa', 'Ndoumbe', 'Ekotto', 
            'Talla', 'Mouliom', 'Njoh', 'Ashu', 'Egbe', 'Biya', 'Atangana', 'Zogo', 'Yombi'
        ];

        $prenomsPossibles = [
            'Jean', 'Emmanuel', 'Christelle', 'Yannick', 'Patricia', 'Brice', 'Sandra', 'Michel', 
            'Fatou', 'Lionel', 'Carine', 'Samuel', 'Estelle', 'Alice', 'Dieudonné', 'Marie', 
            'Thérèse', 'Junior', 'Kevin', 'Brenda', 'Vanessa', 'Aboubakar', 'Aminatou', 'Franck', 
            'Arnaud', 'Cédric', 'Dimitri', 'Sonia', 'Tatiana', 'Raissa', 'Boris', 'Paulette'
        ];

        $classes = DB::table('classes')->pluck('id', 'nom');
        
        $globalStudentCount = 1;
        $anneeEnCours = "25"; 

        foreach ($classes as $nomClasse => $classe_id) {
            $nbEleves = rand(5, 6); 

            for ($i = 1; $i <= $nbEleves; $i++) {
                
                $randomNoms = array_rand($nomsPossibles, 2);
                $nom = $nomsPossibles[$randomNoms[0]] . ' ' . $nomsPossibles[$randomNoms[1]];

                $randomPrenoms = array_rand($prenomsPossibles, 2);
                $prenom = $prenomsPossibles[$randomPrenoms[0]] . ' ' . $prenomsPossibles[$randomPrenoms[1]];

                $sexe = rand(0, 1) ? 'M' : 'F';

                // --- Gestion des âges par classe ---
                $ageMin = 10; $ageMax = 20;
                if (strpos($nomClasse, '6e') !== false) { $ageMin=10; $ageMax=12; }
                elseif (strpos($nomClasse, '5e') !== false) { $ageMin=11; $ageMax=13; }
                elseif (strpos($nomClasse, '4e') !== false) { $ageMin=12; $ageMax=14; }
                elseif (strpos($nomClasse, '3e') !== false) { $ageMin=13; $ageMax=15; }
                elseif (strpos($nomClasse, '2nde') !== false) { $ageMin=14; $ageMax=17; }
                elseif (strpos($nomClasse, '1ère') !== false) { $ageMin=15; $ageMax = 18; }
                elseif (strpos($nomClasse, 'Terminale') !== false) { $ageMin=16; $ageMax=20; }

                $dateNaissance = $faker->dateTimeBetween('-'.$ageMax.' years', '-'.$ageMin.' years')->format('Y-m-d');
                $matricule = $anneeEnCours . str_pad($globalStudentCount, 3, '0', STR_PAD_LEFT);

                // 1️⃣ Créer le user pour l'élève via Eloquent
                $emailBase = strtolower(str_replace(' ', '.', $prenom));
                $user = User::create([
                    'name' => $prenom . ' ' . $nom,
                    'email' => $emailBase . '.' . $globalStudentCount . '@school.cm',
                    'password' => Hash::make('password123'),
                ]);

                // 2️⃣ ATTRIBUTION DU RÔLE 'student'
                $user->assignRole('student');

                // 3️⃣ Créer l'élève lié
                Eleve::create([
                    'user_id' => $user->id,
                    'matricule' => $matricule,
                    'date_naissance' => $dateNaissance,
                    'lieu_naissance' => $faker->city,
                    'sexe' => $sexe,
                    'nom_tuteur' => $nomsPossibles[array_rand($nomsPossibles)] . ' ' . $prenomsPossibles[array_rand($prenomsPossibles)],
                    'contact_tuteur' => $faker->phoneNumber,
                    'classe_id' => $classe_id,
                ]);

                $globalStudentCount++;
            }
        }
    }
}