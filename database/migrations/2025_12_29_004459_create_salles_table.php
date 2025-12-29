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
        Schema::create('salles', function (Blueprint $table) {
            $table->id();
                    // Le nom de la salle doit être unique (ex: "A101", "Labo Chimie")
            $table->string('nom')->unique();

            $table->integer('capacite')->nullable();
            $table->string('type')->nullable(); // ex: 'Salle de cours', 'Laboratoire', 'Informatique'

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('salles');
    }
};
