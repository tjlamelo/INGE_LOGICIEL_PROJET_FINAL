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
    $table->foreignId('classe_id')->constrained('classes')->onDelete('cascade');
    $table->time('heure_debut');
    $table->time('heure_fin');
    $table->string('libelle');
    $table->timestamps();

    $table->unique(['classe_id', 'heure_debut', 'heure_fin']);
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
