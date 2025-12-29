<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('certificats_scolarites', function (Blueprint $table) {
            $table->id();
              // Lien vers l'élève concerné
            $table->foreignId('eleve_id')->constrained()->onDelete('cascade');

            // L'année scolaire pour laquelle le certificat est émis
            $table->string('annee_scolaire');

            // Numéro unique et lisible pour le certificat (ex: "CERT-2025-0001")
            $table->string('numero_certificat')->unique();

            // --- Workflow et traçabilité ---
            $table->enum('statut', ['brouillon', 'valide'])->default('brouillon');
            $table->timestamp('date_generation')->useCurrent(); // Date de création du brouillon
            $table->timestamp('date_signature')->nullable(); // Date de validation par l'admin
            $table->string('signe_par')->nullable(); // Nom et titre du signataire

            // Le chemin vers le fichier PDF final sur le serveur
            $table->string('chemin_pdf')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('certificats_scolarites');
    }
};
