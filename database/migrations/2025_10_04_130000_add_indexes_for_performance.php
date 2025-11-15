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
            // Index pour les recherches
            $table->index(['name', 'description'], 'products_search_idx');

            // Index pour les filtres courants
            $table->index('category_id', 'products_category_idx');
            $table->index('is_featured', 'products_featured_idx');
            $table->index('stock_quantity', 'products_stock_idx');
            $table->index('created_at', 'products_created_at_idx');

            // Index pour les slugs (recherches par URL)
            $table->index('slug', 'products_slug_idx');

            // Index composé pour les produits actifs d'une catégorie
            $table->index(['category_id', 'is_featured'], 'products_category_featured_idx');

            // Index pour le suivi utilisateur
            $table->index('created_by', 'products_created_by_idx');
            $table->index('updated_by', 'products_updated_by_idx');
        });

        // Index pour les catégories
        Schema::table('categories', function (Blueprint $table) {
            $table->index('slug', 'categories_slug_idx');
            $table->index('created_by', 'categories_created_by_idx');
            $table->index('updated_by', 'categories_updated_by_idx');
        });

        // Index pour les variantes de produits
        Schema::table('product_variants', function (Blueprint $table) {
            $table->index(['product_id', 'stock_quantity'], 'product_variants_stock_idx');
            $table->index('created_by', 'product_variants_created_by_idx');
            $table->index('updated_by', 'product_variants_updated_by_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Supprimer les index des produits
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex('products_search_idx');
            $table->dropIndex('products_category_idx');
            $table->dropIndex('products_featured_idx');
            $table->dropIndex('products_stock_idx');
            $table->dropIndex('products_created_at_idx');
            $table->dropIndex('products_slug_idx');
            $table->dropIndex('products_category_featured_idx');
            $table->dropIndex('products_created_by_idx');
            $table->dropIndex('products_updated_by_idx');
        });

        // Supprimer les index des catégories
        Schema::table('categories', function (Blueprint $table) {
            $table->dropIndex('categories_slug_idx');
            $table->dropIndex('categories_created_by_idx');
            $table->dropIndex('categories_updated_by_idx');
        });

        // Supprimer les index des variantes
        Schema::table('product_variants', function (Blueprint $table) {
            $table->dropIndex('product_variants_stock_idx');
            $table->dropIndex('product_variants_created_by_idx');
            $table->dropIndex('product_variants_updated_by_idx');
        });
    }
};
