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
        Schema::create('absences', function (Blueprint $table) {
            $table->id();
            // Lien vers l'élève absent
            $table->foreignId('eleve_id')->constrained()->onDelete('cascade');

            // Lien vers le cours spécifique manqué (matière, classe, enseignant)
            $table->foreignId('enseignement_id')->constrained()->onDelete('cascade');

            // Lien vers l'enseignant qui a signalé l'absence (traçabilité)
            $table->foreignId('saisie_par_enseignant_id')->nullable()->constrained('enseignants')->onDelete('set null');

            // --- Informations sur l'absence ---

            // Date à laquelle l'absence a eu lieu
            $table->date('date_absence');

            // Nombre d'heures manquées pour ce cours (ex: 2.00)
            $table->decimal('nombre_d_heures_manquees', 4, 2); // 4 chiffres au total, 2 après la virgule (ex: 99.99)

            // --- Gestion de la justification ---

            // Statut de justification (par défaut, non justifiée)
            $table->boolean('est_justifiee')->default(false);

            // Motif fourni (ex: "Maladie", "Problème de transport")
            $table->string('motif')->nullable();

            // Détails de la justification (ex: "Certificat médical fourni le...")
            $table->text('justification')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('absences');
    }
};
