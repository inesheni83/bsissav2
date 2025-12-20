<?php

require_once __DIR__ . '/vendor/autoload.php';

use Illuminate\Http\Request;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\NewPasswordController;

echo "=== Test de la fonctionnalité Forgot Password ===\n\n";

// Test 1: Vérification des routes
echo "1. Vérification des routes...\n";
$routes = [
    'forgot-password (GET)' => route('password.request'),
    'forgot-password (POST)' => route('password.email'),
    'reset-password (GET)' => route('password.reset', ['token' => 'test-token']),
    'reset-password (POST)' => route('password.store'),
];

foreach ($routes as $name => $url) {
    echo "   ✓ $name: $url\n";
}

// Test 2: Vérification de la table password_resets
echo "\n2. Vérification de la table password_resets...\n";
try {
    $schema = \Illuminate\Support\Facades\Schema::hasTable('password_resets');
    if ($schema) {
        echo "   ✓ Table password_resets existe\n";
        
        // Vérifier les colonnes
        $columns = \Illuminate\Support\Facades\Schema::getColumnListing('password_resets');
        $requiredColumns = ['email', 'token', 'created_at'];
        foreach ($requiredColumns as $column) {
            if (in_array($column, $columns)) {
                echo "   ✓ Colonne '$column' existe\n";
            } else {
                echo "   ✗ Colonne '$column' manquante\n";
            }
        }
    } else {
        echo "   ✗ Table password_resets n'existe pas\n";
    }
} catch (Exception $e) {
    echo "   ✗ Erreur: " . $e->getMessage() . "\n";
}

// Test 3: Vérification de la configuration email
echo "\n3. Vérification de la configuration email...\n";
$mailConfig = [
    'MAIL_MAILER' => env('MAIL_MAILER'),
    'MAIL_HOST' => env('MAIL_HOST'),
    'MAIL_PORT' => env('MAIL_PORT'),
    'MAIL_ENCRYPTION' => env('MAIL_ENCRYPTION'),
    'MAIL_FROM_ADDRESS' => env('MAIL_FROM_ADDRESS'),
];

foreach ($mailConfig as $key => $value) {
    if ($value) {
        echo "   ✓ $key: " . str_replace(substr($value, 0, 3), '***', $value) . "\n";
    } else {
        echo "   ✗ $key: non configuré\n";
    }
}

// Test 4: Vérification des contrôleurs
echo "\n4. Vérification des contrôleurs...\n";
$controllers = [
    'PasswordResetLinkController' => class_exists('App\Http\Controllers\Auth\PasswordResetLinkController'),
    'NewPasswordController' => class_exists('App\Http\Controllers\Auth\NewPasswordController'),
];

foreach ($controllers as $controller => $exists) {
    if ($exists) {
        echo "   ✓ $controller existe\n";
    } else {
        echo "   ✗ $controller n'existe pas\n";
    }
}

// Test 5: Vérification de la configuration Fortify
echo "\n5. Vérification de la configuration Fortify...\n";
$fortifyConfig = config('fortify.features');
if (in_array(\Laravel\Fortify\Features::resetPasswords(), $fortifyConfig)) {
    echo "   ✓ Feature resetPasswords activée\n";
} else {
    echo "   ✗ Feature resetPasswords désactivée\n";
}

echo "\n=== Test terminé ===\n";
echo "Pour tester manuellement:\n";
echo "1. Accédez à: " . route('password.request') . "\n";
echo "2. Entrez un email d'utilisateur existant\n";
echo "3. Vérifiez les logs ou l'email reçu\n";
echo "4. Suivez le lien de réinitialisation\n";
echo "5. Testez le nouveau mot de passe\n";
