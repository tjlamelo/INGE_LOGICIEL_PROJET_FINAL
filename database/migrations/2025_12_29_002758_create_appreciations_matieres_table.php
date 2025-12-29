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
        Schema::create('appreciations_matieres', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bulletin_id')->constrained()->onDelete('cascade');
            // L'enseignement nous donne la matière et le contexte
            $table->foreignId('enseignement_id')->constrained()->onDelete('cascade');
            $table->text('appreciation'); // L'appréciation du professeur pour la matière sur le trimestre

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appreciations_matieres');
    }
};
