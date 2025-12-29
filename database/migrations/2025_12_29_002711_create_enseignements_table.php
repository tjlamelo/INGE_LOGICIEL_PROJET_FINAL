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
        Schema::create('enseignements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('enseignant_id')->constrained()->onDelete('cascade');
            $table->foreignId('classe_id')->constrained()->onDelete('cascade');
            $table->foreignId('matiere_id')->constrained()->onDelete('cascade');
            $table->integer('coefficient')->default(1);
        

            // Un enseignant n'enseigne qu'une seule matière dans une classe donnée
            $table->unique(['enseignant_id', 'classe_id', 'matiere_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enseignements');
    }
};
