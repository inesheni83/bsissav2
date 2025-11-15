<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "Test de création de produit...\n";

try {
    $product = new App\Models\Product([
        'name' => 'Test Produit',
        'price' => 29.99,
        'description' => 'Description test'
    ]);

    $product->save();

    echo "Produit créé avec succès: " . $product->name . " (ID: " . $product->id . ")\n";
    echo "Slug généré: " . $product->slug . "\n";

    // Nettoyer le produit de test
    $product->delete();
    echo "Produit de test supprimé.\n";

} catch (Exception $e) {
    echo "Erreur: " . $e->getMessage() . "\n";
}

echo "Test terminé.\n";
