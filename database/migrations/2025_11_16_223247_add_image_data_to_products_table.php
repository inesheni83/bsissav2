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
            // Add LONGTEXT column to store base64 encoded image
            // LONGTEXT can store up to 4GB, suitable for images
            $table->longText('image_data')->nullable()->after('image');

            // Optional: Add mime_type to know the image format
            $table->string('image_mime_type')->nullable()->after('image_data');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['image_data', 'image_mime_type']);
        });
    }
};
