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
            $table->decimal('moyenne_generale', 5, 2)->nullable();
            $table->integer('rang')->nullable();
            $table->integer('effectif_classe')->nullable();
            $table->text('appreciation_generale')->nullable(); // Du conseil de classe
            $table->boolean('est_valide')->default(false); // Pour la validation par l'admin
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
