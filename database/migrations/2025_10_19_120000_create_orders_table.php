<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('session_id', 100)->nullable()->index();
            $table->string('reference', 20)->unique();
            $table->string('first_name', 100);
            $table->string('last_name', 100);
            $table->string('address', 255);
            $table->string('country', 120);
            $table->string('region', 120);
            $table->string('city', 120);
            $table->string('postal_code', 10);
            $table->string('phone', 20);
            $table->decimal('subtotal', 10, 2);
            $table->unsignedInteger('items_count');
            $table->json('items');
            $table->string('status', 20)->default('pending');
            $table->timestamps();

            $table->index(['user_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
