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

            // Matière + classe + enseignant
            $table->foreignId('enseignement_id')
                ->constrained()
                ->onDelete('cascade');

            // ✅ Trimestre concerné
            $table->foreignId('trimestre_id')
                ->constrained()
                ->onDelete('cascade');

            // ✅ Séquence dans le trimestre (1 à 3)
            $table->unsignedTinyInteger('sequence')
                ->comment('Numéro de l’évaluation dans le trimestre (1 à 3)');

            $table->enum('type_evaluation', [
                'Interrogation',
                'Devoir',
                'Examen',
            ])->nullable();

            $table->date('date_evaluation');
            $table->text('appreciation')->nullable();

            $table->timestamps();

            // 🚫 Empêcher deux notes identiques pour une même séquence
            $table->unique([
                'eleve_id',
                'enseignement_id',
                'trimestre_id',
                'sequence',
                'type_evaluation'
            ], 'unique_note_trimestre_sequence');
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
