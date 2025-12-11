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
        Schema::table('gallery_images', function (Blueprint $table) {
            // Supprimer les colonnes base64 pour améliorer les performances
            // Les images sont maintenant stockées uniquement sur disque
            $table->dropColumn(['image_data', 'image_mime_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('gallery_images', function (Blueprint $table) {
            // Restaurer les colonnes en cas de rollback
            $table->longText('image_data')->nullable();
            $table->string('image_mime_type')->nullable();
        });
    }
};
