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
        // Index pour les produits
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex('products_search_idx');
            $table->index(['name', 'description'], 'products_search_idx');
        });
    }
};
