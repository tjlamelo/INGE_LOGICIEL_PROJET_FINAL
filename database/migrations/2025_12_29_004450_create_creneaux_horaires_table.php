<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('creneaux_horaires', function (Blueprint $table) {
            $table->id();
            $table->foreignId('matiere_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            // Heure de début et de fin du créneau
            $table->time('heure_debut');
            $table->time('heure_fin');

            // Un libellé pour l'affichage (ex: "C1 8h-9h30")
            $table->string('libelle');

            $table->timestamps();

            // Un créneau horaire doit être unique
            $table->unique(['heure_debut', 'heure_fin']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('creneaux_horaires');
    }
};
