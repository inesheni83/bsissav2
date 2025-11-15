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
        Schema::table('product_weight_variants', function (Blueprint $table) {
            // Changer weight_value de decimal à integer (sans décimales)
            $table->integer('weight_value')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_weight_variants', function (Blueprint $table) {
            // Remettre weight_value en decimal
            $table->decimal('weight_value', 10, 2)->change();
        });
    }
};
