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
        Schema::table('cart_items', function (Blueprint $table) {
            // Make product_id nullable since cart items can have either a product or a pack
            $table->foreignId('product_id')->nullable()->change();

            // Add pack_id and weight_variant_id columns if they don't exist
            if (!Schema::hasColumn('cart_items', 'pack_id')) {
                $table->foreignId('pack_id')->nullable()->after('product_id')->constrained()->cascadeOnDelete();
            }
            if (!Schema::hasColumn('cart_items', 'weight_variant_id')) {
                $table->foreignId('weight_variant_id')->nullable()->after('pack_id')->constrained('product_weight_variants')->cascadeOnDelete();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cart_items', function (Blueprint $table) {
            $table->dropForeign(['pack_id']);
            $table->dropColumn('pack_id');
            $table->dropForeign(['weight_variant_id']);
            $table->dropColumn('weight_variant_id');
        });
    }
};
