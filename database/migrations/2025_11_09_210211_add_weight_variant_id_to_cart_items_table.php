<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Vider la table cart_items pour éviter les problèmes de contraintes
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('cart_items')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Ajouter la colonne weight_variant_id sans contrainte unique pour l'instant
        Schema::table('cart_items', function (Blueprint $table) {
            $table->foreignId('weight_variant_id')
                ->nullable()
                ->after('product_id')
                ->constrained('product_weight_variants')
                ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cart_items', function (Blueprint $table) {
            // Supprimer la colonne weight_variant_id
            $table->dropForeign(['weight_variant_id']);
            $table->dropColumn('weight_variant_id');
        });
    }
};
