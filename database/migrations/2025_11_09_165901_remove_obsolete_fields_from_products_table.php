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
            // Drop the index first before dropping the column
            $table->dropIndex('products_stock_idx');
            $table->dropColumn(['price', 'promotional_price', 'weight_kg', 'stock_quantity']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->decimal('price', 10, 2)->after('image');
            $table->decimal('promotional_price', 10, 2)->nullable()->after('price');
            $table->decimal('weight_kg', 10, 2)->nullable()->after('promotional_price');
            $table->integer('stock_quantity')->default(0)->after('is_featured');
            // Recreate the index
            $table->index('stock_quantity', 'products_stock_idx');
        });
    }
};
