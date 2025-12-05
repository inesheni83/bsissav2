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
        // Vérifier si l'index existe avant de le supprimer
        $indexExists = \DB::select("SHOW INDEX FROM products WHERE Key_name = 'idx_name_description'");

        if (!empty($indexExists)) {
            Schema::table('products', function (Blueprint $table) {
                // Supprimer l'ancien index qui utilise description sans préfixe
                $table->dropIndex('idx_name_description');
            });
        }

        // Recréer l'index avec préfixe pour la colonne TEXT (255 caractères)
        \DB::statement('CREATE INDEX idx_name_description ON products (name, description(255))');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Supprimer l'index avec préfixe
            $table->dropIndex('idx_name_description');

            // Restaurer l'index sans préfixe (si description était VARCHAR)
            $table->index(['name', 'description'], 'idx_name_description');
        });
    }
};
