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
        Schema::table('products', function (Blueprint $table) {
            // Champs de commerce
            $table->decimal('weight_kg', 6, 3)->nullable()->after('price');

            // Détails complémentaires
            $table->text('ingredients')->nullable()->after('description');
            $table->string('marketing_tags', 500)->nullable()->after('ingredients');

            // Valeurs nutritionnelles (pour 100g)
            $table->decimal('calories_kcal', 6, 1)->nullable()->after('stock_quantity');
            $table->decimal('protein_g', 5, 1)->nullable()->after('calories_kcal');
            $table->decimal('carbs_g', 5, 1)->nullable()->after('protein_g');
            $table->decimal('fat_g', 5, 1)->nullable()->after('carbs_g');
            $table->decimal('fiber_g', 5, 1)->nullable()->after('fat_g');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'weight_kg',
                'ingredients',
                'marketing_tags',
                'calories_kcal',
                'protein_g',
                'carbs_g',
                'fat_g',
                'fiber_g',
            ]);
        });
    }
};
