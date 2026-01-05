<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
      Schema::create('seance_cours', function (Blueprint $table) {
    $table->id();
    $table->enum('jour_semaine', ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi']);

    // FK précises avec table argument
    $table->foreignId('creneau_horaire_id')
          ->constrained('creneaux_horaires')
          ->cascadeOnDelete();
    $table->foreignId('salle_id')
          ->constrained('salles')
          ->cascadeOnDelete();
    $table->foreignId('classe_id')
          ->constrained('classes')
          ->cascadeOnDelete();
    $table->foreignId('enseignant_id')
          ->constrained('enseignants')
          ->cascadeOnDelete();
    $table->foreignId('matiere_id')
          ->constrained('matieres')
          ->cascadeOnDelete();

    $table->string('annee_scolaire');

    $table->timestamps();

    // Contraintes d'unicité
// Une salle ne peut avoir qu'un seul cours au même moment
$table->unique(['jour_semaine', 'creneau_horaire_id', 'salle_id'], 'sc_j_cr_salle_unique');

// Une classe ne peut être qu'à un seul endroit au même moment
$table->unique(['jour_semaine', 'creneau_horaire_id', 'classe_id'], 'sc_j_cr_classe_unique');

// Un enseignant ne peut enseigner qu'à un seul groupe au même moment
$table->unique(['jour_semaine', 'creneau_horaire_id', 'enseignant_id'], 'sc_j_cr_ens_unique');


});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('seance_cours');
    }
};
