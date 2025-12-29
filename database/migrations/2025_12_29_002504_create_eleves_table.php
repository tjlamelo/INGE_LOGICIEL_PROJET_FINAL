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
        Schema::create('eleves', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade');
            $table->string('matricule')->unique(); // Matricule de l'élève
            $table->date('date_naissance');
            $table->string('lieu_naissance')->nullable();
            $table->string('sexe'); // M ou F
            $table->string('nom_tuteur')->nullable();
            $table->string('contact_tuteur')->nullable();
            // Lien vers la classe actuelle de l'élève
            $table->foreignId('classe_id')->nullable()->constrained()->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('eleves');
    }
};
