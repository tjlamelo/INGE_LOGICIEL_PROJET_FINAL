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
        Schema::create('notes', function (Blueprint $table) {
            $table->id();

            $table->decimal('valeur', 5, 2); // ex: 15.50

            $table->foreignId('eleve_id')
                ->constrained()
                ->onDelete('cascade');

            // Matière + classe + enseignant (Lien vers la table pivot enseignements)
            $table->foreignId('enseignement_id')
                ->constrained()
                ->onDelete('cascade');

            // ✅ Trimestre concerné (1, 2 ou 3)
            $table->foreignId('trimestre_id')
                ->constrained()
                ->onDelete('cascade');

            // ✅ Séquence de l'année (1 à 6)
            $table->unsignedTinyInteger('sequence')
                ->comment('Numéro de la séquence sur l’année scolaire (1 à 6)');

            $table->enum('type_evaluation', [
                'Interrogation',
                'Devoir',
                'Examen',
            ])->nullable();

            $table->date('date_evaluation');
            $table->text('appreciation')->nullable();

            $table->timestamps();

            // 🚫 Empêcher d'avoir deux fois la même note pour un élève dans la même séquence/matière
            // J'ai gardé trimestre_id dans l'index pour la performance des recherches par bulletin
            $table->unique([
                'eleve_id',
                'enseignement_id',
                'trimestre_id',
                'sequence',
                'type_evaluation'
            ], 'unique_note_eleve_sequence');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notes');
    }
};