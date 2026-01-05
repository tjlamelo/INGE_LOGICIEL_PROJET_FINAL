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
        Schema::create('enseignants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade');
            $table->string('matricule')->unique(); // Format ENS-25001
            $table->string('specialite');          // Mathématiques, Français, etc.
            $table->string('grade');               // PLEG, PCEG, Vacataire, etc.
 $table->string('statut')->default('Actif');
            $table->string('telephone')->nullable();
            $table->text('adresse')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enseignants');
    }
};
