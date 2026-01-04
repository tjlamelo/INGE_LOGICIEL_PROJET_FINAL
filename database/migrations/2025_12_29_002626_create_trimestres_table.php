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
        Schema::create('trimestres', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('annee_scolaire');
            $table->boolean('est_actif')->default(false); // <--- Trimestre en cours
            $table->boolean('est_cloture')->default(false);
            $table->integer('sequence_active')->default(1);
            $table->timestamps();
            $table->unique(['nom', 'annee_scolaire']);

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trimestres');
    }
};
