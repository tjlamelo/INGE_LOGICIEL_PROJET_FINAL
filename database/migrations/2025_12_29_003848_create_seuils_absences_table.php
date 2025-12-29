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
        Schema::create('seuils_absences', function (Blueprint $table) {
            $table->id();
                // --- Définition de la règle ---

            // Le nombre d'heures maximales autorisées avant de déclencher une alerte
            $table->decimal('nombre_d_heures_max', 5, 2); // ex: 15.00 heures

            // La période sur laquelle le seuil s'applique
            $table->enum('periode', ['trimestre', 'annee']);

            // --- Portée de la règle ---

            // Lien optionnel vers une classe spécifique.
            // Si NULL, le seuil s'applique à tout l'établissement.
            $table->foreignId('classe_id')->nullable()->constrained()->onDelete('cascade');

            $table->timestamps();

            // Contrainte d'unicité pour éviter les règles contradictoires.
            // On ne peut avoir qu'un seul seuil par classe et par période.
            // La combinaison (classe_id: NULL, periode: 'trimestre') sera unique,
            // permettant un seuil général pour le trimestre.
            $table->unique(['classe_id', 'periode']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('seuils_absences');
    }
};
