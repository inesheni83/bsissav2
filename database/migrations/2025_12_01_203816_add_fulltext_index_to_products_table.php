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
        // Ajouter un index FULLTEXT pour améliorer les performances de recherche
        // sur les colonnes name et description
        \DB::statement('CREATE FULLTEXT INDEX idx_products_search ON products (name, description)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Supprimer l'index FULLTEXT
        \DB::statement('DROP INDEX idx_products_search ON products');
    }
};
