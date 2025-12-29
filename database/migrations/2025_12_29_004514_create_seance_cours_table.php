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
        // Le jour de la semaine où a lieu le cours
            $table->enum('jour_semaine', ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']);

            // Clés étrangères vers les tables de configuration
            $table->foreignId('creneau_horaire_id')->constrained()->onDelete('cascade');
            $table->foreignId('salle_id')->constrained()->onDelete('cascade');

            // Clés étrangères vers les tables métier existantes
            $table->foreignId('classe_id')->constrained()->onDelete('cascade');
            $table->foreignId('enseignant_id')->constrained()->onDelete('cascade');
            $table->foreignId('matiere_id')->constrained()->onDelete('cascade');
            
            // L'emploi du temps est spécifique à une année scolaire
            $table->string('annee_scolaire'); // ex: '2025-2026'

            $table->timestamps();

            // --- CONTRAINTES D'UNICITÉ POUR ÉVITER LES CONFLITS ---
            // Une salle ne peut avoir qu'un seul cours au même moment
            $table->unique(['jour_semaine', 'creneau_horaire_id', 'salle_id']);

            // Une classe ne peut être qu'à un seul endroit au même moment
            $table->unique(['jour_semaine', 'creneau_horaire_id', 'classe_id']);

            // Un enseignant ne peut enseigner qu'à un seul groupe au même moment
            $table->unique(['jour_semaine', 'creneau_horaire_id', 'enseignant_id']);
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
