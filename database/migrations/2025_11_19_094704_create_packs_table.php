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
        Schema::create('packs', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description');
            $table->string('main_image')->nullable();
            $table->longText('main_image_data')->nullable();
            $table->string('main_image_mime_type')->nullable();
            $table->json('gallery_images')->nullable(); // Tableau d'images
            $table->decimal('price', 10, 2);
            $table->decimal('reference_price', 10, 2)->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('stock_quantity')->default(0);
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();

            $table->index('slug');
            $table->index('is_active');
            $table->index('created_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('packs');
    }
};
