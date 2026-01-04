<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\{Note, Eleve, Enseignement, Trimestre};
use Faker\Factory as Faker;

class NoteSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();
        
        $trimestre1 = Trimestre::where('nom', 'LIKE', '%1er%')->first();

        if (!$trimestre1) {
            $this->command->error("1er Trimestre non trouvé.");
            return;
        }

        // On utilise get() ici
        $eleves = Eleve::with('classe')->get();
        // On récupère les enseignements groupés par classe pour gagner en performance
        $enseignements = Enseignement::all();

        foreach ($eleves as $eleve) {
            $mesEnseignements = $enseignements->where('classe_id', $eleve->classe_id);

            foreach ($mesEnseignements as $enseignement) {
                // Séquence 1
                $this->creerNote($eleve, $enseignement, $trimestre1->id, 1, $faker);
                
                // Séquence 2
                $this->creerNote($eleve, $enseignement, $trimestre1->id, 2, $faker);
            }
        }

        $this->command->info("Notes des Séquences 1 et 2 générées avec succès.");
    }

private function creerNote($eleve, $enseignement, $trimestreId, $seq, $faker)
    {
        Note::create([
            'valeur'          => $this->genererNoteRealiste($faker),
            'eleve_id'        => $eleve->id,
            'enseignement_id' => $enseignement->id,
            'trimestre_id'    => $trimestreId,
            'sequence'        => $seq,
            // 'Examen' est plus souvent présent dans les enums par défaut que 'Composition'
            'type_evaluation' => 'Examen', 
            'date_evaluation' => ($seq == 1) ? '2025-10-15' : '2025-11-30',
            'appreciation'    => $this->getAppreciation($faker),
        ]);
    }

    private function genererNoteRealiste($faker) {
        $rand = rand(1, 100);
        if ($rand <= 15) return $faker->randomFloat(2, 2, 8);
        if ($rand <= 75) return $faker->randomFloat(2, 9, 14);
        return $faker->randomFloat(2, 15, 19.5);
    }

    private function getAppreciation($faker) {
        return $faker->randomElement(['A encourager', 'Bien', 'Passable', 'Excellent', 'Insuffisant']);
    }
}