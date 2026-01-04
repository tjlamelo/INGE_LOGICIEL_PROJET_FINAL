<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1️⃣ Seed des rôles
        $this->call(RoleSeeder::class);

        // 2️⃣ Seed des utilisateurs
        $this->call(UserSeeder::class);

        // 3️⃣ Seed des classes
        $this->call(ClasseSeeder::class);

        // 4️⃣ Seed des matières
        $this->call(MatiereSeeder::class);

        // 5️⃣ Seed des trimestres
        $this->call(TrimestreSeeder::class);

        // 6️⃣ Seed des enseignants
        $this->call(EnseignantSeeder::class);

        // 7️⃣ Seed des élèves
        $this->call(EleveSeeder::class);

        // 8️⃣ Seed des enseignements (Classe × Matière × Enseignant)
        $this->call(EnseignementSeeder::class);
        $this->call(NoteSeeder::class);
    }
}
