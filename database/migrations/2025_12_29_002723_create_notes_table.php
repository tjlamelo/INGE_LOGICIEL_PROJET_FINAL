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
            $table->decimal('valeur', 5, 2); // ex: 15.50, 20.00
            $table->foreignId('eleve_id')->constrained()->onDelete('cascade');
            // L'enseignement nous donne la matière, la classe et l'enseignant
            $table->foreignId('enseignement_id')->constrained()->onDelete('cascade');
            $table->foreignId('trimestre_id')->constrained()->onDelete('cascade');
            $table->string('type_evaluation')->nullable(); // ex: 'Devoir', 'Examen'
            $table->date('date_evaluation');
            $table->text('appreciation')->nullable();
            $table->timestamps();
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
