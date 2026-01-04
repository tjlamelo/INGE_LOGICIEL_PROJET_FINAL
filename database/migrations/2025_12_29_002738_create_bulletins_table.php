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
       Schema::create('bulletins', function (Blueprint $table) {
            $table->id();
            $table->foreignId('eleve_id')->constrained()->onDelete('cascade');
            $table->foreignId('trimestre_id')->constrained()->onDelete('cascade');
            
            // Résultats globaux
            $table->decimal('moyenne_generale', 5, 2)->nullable();
            $table->integer('rang')->nullable();
            $table->integer('effectif_classe')->nullable();
            
            // Stockage JSON pour les détails (Matières, Séquences, Profil)
            $table->json('moyennes_matieres')->nullable(); // Détails MGC, Min, Max, Rang/Matière
            $table->json('stats_sequences')->nullable();  // Moyennes Seq1, Seq2...
            $table->json('profil_classe')->nullable();    // MoyGen, MoyPremier, MoyDernier, Taux, Ecart-type
            
            $table->text('appreciation_generale')->nullable();
            $table->boolean('est_valide')->default(false);
            $table->timestamp('date_generation')->nullable();
            $table->string('chemin_pdf')->nullable();
            $table->timestamps();

            $table->unique(['eleve_id', 'trimestre_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bulletins');
    }
};
