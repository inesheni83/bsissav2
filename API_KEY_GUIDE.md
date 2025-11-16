# 🔐 Guide de Gestion des API Keys - Bsissa

## 📋 Table des Matières

1. [Génération d'API Keys](#génération-dapi-keys)
2. [Utilisation dans l'Application](#utilisation-dans-lapplication)
3. [Stockage Sécurisé](#stockage-sécurisé)
4. [Best Practices](#best-practices)
5. [Rotation des Clés](#rotation-des-clés)

---

## 🔑 Génération d'API Keys

### Méthode 1 : Scripts Fournis (Recommandé)

```bash
# PHP Script
php generate-api-key.php

# Avec longueur personnalisée
php generate-api-key.php 128

# Bash Script (Linux/macOS)
./generate-api-key.sh

# Avec longueur personnalisée
./generate-api-key.sh 128
```

### Méthode 2 : Ligne de Commande

#### OpenSSL (Disponible partout)

```bash
# Hex (64 caractères)
openssl rand -hex 32

# Base64 (43 caractères)
openssl rand -base64 32

# Base64 URL-safe
openssl rand -base64 32 | tr '+/' '-_' | tr -d '='
```

#### Laravel Artisan

```bash
# Via Tinker
php artisan tinker
>>> Str::random(64)
>>> exit

# UUID
php artisan tinker
>>> Str::uuid()
>>> exit
```

#### Node.js

```bash
# Random bytes
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# UUID v4
node -e "console.log(require('crypto').randomUUID())"
```

#### Python

```bash
# Secure random
python3 -c "import secrets; print(secrets.token_hex(32))"

# URL-safe
python3 -c "import secrets; print(secrets.token_urlsafe(32))"

# UUID
python3 -c "import uuid; print(uuid.uuid4())"
```

### Méthode 3 : Services en Ligne

⚠️ **Non recommandé pour production** (utilisez uniquement pour dev/test)

- https://randomkeygen.com/
- https://www.uuidgenerator.net/
- https://generate-random.org/api-key-generator

---

## 💻 Utilisation dans l'Application

### Configuration Laravel

#### 1. Ajouter dans .env

```env
# API Key principale
API_KEY=votre_cle_generee_ici

# Clés multiples (optionnel)
API_KEY_ADMIN=admin_cle_ici
API_KEY_CLIENT=client_cle_ici
API_KEY_VENDOR=vendor_cle_ici

# Avec préfixe pour identifier
API_KEY=bsissa_a586319b105e26ec36d3388a010f8b2734d84f6221f61c2e3a223115e90ab6b7
```

#### 2. Configuration dans config/app.php

```php
<?php

return [
    // ... autres configurations

    'api_key' => env('API_KEY'),

    // Ou clés multiples
    'api_keys' => [
        'admin' => env('API_KEY_ADMIN'),
        'client' => env('API_KEY_CLIENT'),
        'vendor' => env('API_KEY_VENDOR'),
    ],
];
```

#### 3. Création d'un Middleware

Créez `app/Http/Middleware/ValidateApiKey.php`:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ValidateApiKey
{
    public function handle(Request $request, Closure $next)
    {
        $apiKey = $request->header('X-API-Key')
               ?? $request->query('api_key')
               ?? $request->bearerToken();

        if (!$apiKey || $apiKey !== config('app.api_key')) {
            return response()->json([
                'error' => 'Invalid or missing API key'
            ], 401);
        }

        return $next($request);
    }
}
```

Enregistrez dans `app/Http/Kernel.php`:

```php
protected $middlewareAliases = [
    // ... autres middleware
    'api.key' => \App\Http\Middleware\ValidateApiKey::class,
];
```

#### 4. Utilisation dans les Routes

```php
// routes/api.php

// Route protégée par API key
Route::middleware('api.key')->group(function () {
    Route::get('/products', [ProductController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
});

// Route protégée avec multiple middlewares
Route::middleware(['api.key', 'throttle:60,1'])->group(function () {
    Route::apiResource('products', ProductController::class);
});
```

#### 5. Appel de l'API

```bash
# Méthode 1: Header (recommandé)
curl -H "X-API-Key: votre_cle_api" https://api.bsissa.com/products

# Méthode 2: Bearer Token
curl -H "Authorization: Bearer votre_cle_api" https://api.bsissa.com/products

# Méthode 3: Query parameter (moins sécurisé)
curl https://api.bsissa.com/products?api_key=votre_cle_api
```

---

## 🔒 Stockage Sécurisé

### ✅ À FAIRE

1. **Utiliser .env pour le développement**
   ```env
   API_KEY=votre_cle_dev
   ```

2. **Variables d'environnement pour la production**
   ```bash
   # Railway
   export API_KEY="votre_cle_prod"

   # Docker
   docker run -e API_KEY="votre_cle_prod" ...
   ```

3. **Gestionnaires de secrets (Production)**
   - AWS Secrets Manager
   - Google Cloud Secret Manager
   - Azure Key Vault
   - HashiCorp Vault

4. **Chiffrement des clés en base de données**
   ```php
   use Illuminate\Support\Facades\Crypt;

   // Chiffrer
   $encrypted = Crypt::encryptString($apiKey);

   // Déchiffrer
   $decrypted = Crypt::decryptString($encrypted);
   ```

### ❌ À NE PAS FAIRE

1. ❌ **Ne JAMAIS committer dans git**
   ```bash
   # Assurez-vous que .env est dans .gitignore
   echo ".env" >> .gitignore
   ```

2. ❌ **Ne JAMAIS hardcoder dans le code**
   ```php
   // MAUVAIS
   $apiKey = 'abc123def456';

   // BON
   $apiKey = config('app.api_key');
   ```

3. ❌ **Ne JAMAIS logger les clés complètes**
   ```php
   // MAUVAIS
   Log::info('API Key: ' . $apiKey);

   // BON
   Log::info('API Key: ' . substr($apiKey, 0, 8) . '...');
   ```

4. ❌ **Ne JAMAIS exposer dans les erreurs**
   ```php
   // MAUVAIS
   throw new Exception("Invalid API Key: {$apiKey}");

   // BON
   throw new Exception("Invalid API Key");
   ```

---

## 📚 Best Practices

### 1. Longueur et Format

```bash
# Minimum recommandé
32 caractères (128 bits)

# Optimal
64 caractères (256 bits)

# Formats recommandés
- Hexadécimal: a1b2c3d4e5f6...
- Base64 URL-safe: Ab12_Cd34-Ef56...
- UUID v4: 550e8400-e29b-41d4-a716-446655440000
```

### 2. Clés par Environnement

```env
# .env.local (développement)
API_KEY=dev_1234567890abcdef

# .env.staging (staging)
API_KEY=staging_abcdef1234567890

# .env.production (production)
API_KEY=prod_fedcba0987654321
```

### 3. Clés par Rôle/Scope

```env
# Différentes clés selon les permissions
API_KEY_ADMIN=admin_xxx
API_KEY_VENDOR=vendor_xxx
API_KEY_CLIENT=client_xxx
API_KEY_READONLY=readonly_xxx
```

### 4. Rate Limiting

```php
// routes/api.php
Route::middleware(['api.key', 'throttle:60,1'])->group(function () {
    // 60 requêtes par minute
});

// Différent rate limit selon le rôle
Route::middleware(['api.key:admin', 'throttle:1000,1'])->group(function () {
    // 1000 requêtes par minute pour admin
});
```

### 5. Logging et Monitoring

```php
// Middleware pour logger les accès API
public function handle(Request $request, Closure $next)
{
    $apiKey = $request->header('X-API-Key');

    // Logger uniquement les 8 premiers caractères
    Log::info('API Request', [
        'key_prefix' => substr($apiKey, 0, 8) . '...',
        'ip' => $request->ip(),
        'endpoint' => $request->path(),
        'method' => $request->method(),
    ]);

    return $next($request);
}
```

### 6. Validation Avancée

```php
use Illuminate\Support\Facades\Cache;

class ValidateApiKey
{
    public function handle(Request $request, Closure $next)
    {
        $apiKey = $request->header('X-API-Key');

        // Vérifier si la clé est révoquée
        if (Cache::has("revoked_key:{$apiKey}")) {
            return response()->json(['error' => 'API key revoked'], 401);
        }

        // Vérifier la clé
        $user = User::where('api_key', $apiKey)->first();

        if (!$user) {
            return response()->json(['error' => 'Invalid API key'], 401);
        }

        // Vérifier l'expiration
        if ($user->api_key_expires_at && now()->isAfter($user->api_key_expires_at)) {
            return response()->json(['error' => 'API key expired'], 401);
        }

        // Attacher l'utilisateur à la requête
        $request->merge(['api_user' => $user]);

        return $next($request);
    }
}
```

---

## 🔄 Rotation des Clés

### Pourquoi Faire la Rotation?

- ✅ Sécurité renforcée
- ✅ Limite l'impact d'une fuite
- ✅ Conformité aux standards de sécurité
- ✅ Best practice DevSecOps

### Fréquence Recommandée

- **Développement**: Tous les 6 mois
- **Staging**: Tous les 3 mois
- **Production**: Tous les mois (ou après incident)

### Procédure de Rotation

#### 1. Générer une nouvelle clé

```bash
php generate-api-key.php > new-api-key.txt
```

#### 2. Double clé temporaire

```env
# .env - Période de transition
API_KEY_OLD=ancienne_cle
API_KEY_NEW=nouvelle_cle
```

```php
// Middleware acceptant les deux clés
public function handle(Request $request, Closure $next)
{
    $apiKey = $request->header('X-API-Key');
    $validKeys = [
        config('app.api_key_old'),
        config('app.api_key_new'),
    ];

    if (!in_array($apiKey, $validKeys)) {
        return response()->json(['error' => 'Invalid API key'], 401);
    }

    return $next($request);
}
```

#### 3. Communication aux utilisateurs

```php
// Envoyer email de notification
Mail::to($users)->send(new ApiKeyRotationNotice([
    'old_key_expiry' => now()->addDays(30),
    'new_key' => $newKey,
]));
```

#### 4. Période de grâce (30 jours)

```php
// Logger les utilisations de l'ancienne clé
if ($apiKey === config('app.api_key_old')) {
    Log::warning('Old API key used', [
        'ip' => $request->ip(),
        'user' => $user->email ?? 'unknown',
    ]);
}
```

#### 5. Révocation de l'ancienne clé

```env
# Après 30 jours
API_KEY=nouvelle_cle
# Supprimer API_KEY_OLD
```

### Script de Rotation Automatique

```bash
#!/bin/bash
# rotate-api-key.sh

OLD_KEY=$(grep "^API_KEY=" .env | cut -d'=' -f2)
NEW_KEY=$(openssl rand -hex 32)

echo "Rotation de l'API Key"
echo "====================="
echo ""
echo "Ancienne clé: ${OLD_KEY:0:8}..."
echo "Nouvelle clé: ${NEW_KEY:0:8}..."
echo ""

# Backup
cp .env .env.backup.$(date +%Y%m%d)

# Mettre à jour
sed -i.bak "s/API_KEY=.*/API_KEY=${NEW_KEY}/" .env

echo "✓ Clé mise à jour dans .env"
echo "✓ Backup créé: .env.backup.$(date +%Y%m%d)"
echo ""
echo "⚠️  N'oubliez pas de:"
echo "  1. Mettre à jour Railway/Production"
echo "  2. Notifier les utilisateurs de l'API"
echo "  3. Tester la nouvelle clé"
echo "  4. Supprimer les backups après vérification"
```

---

## 🔍 Audit et Surveillance

### 1. Table d'Audit

```php
Schema::create('api_key_usage', function (Blueprint $table) {
    $table->id();
    $table->string('key_prefix', 16); // Premiers caractères seulement
    $table->string('ip_address');
    $table->string('endpoint');
    $table->string('method');
    $table->integer('response_code');
    $table->timestamp('created_at');
});
```

### 2. Monitoring Dashboard

```php
// Statistiques d'utilisation
DB::table('api_key_usage')
    ->select('key_prefix', DB::raw('COUNT(*) as requests'))
    ->where('created_at', '>=', now()->subDays(7))
    ->groupBy('key_prefix')
    ->get();
```

### 3. Alertes de Sécurité

```php
// Détecter usage anormal
$suspiciousActivity = DB::table('api_key_usage')
    ->where('ip_address', $ip)
    ->where('created_at', '>=', now()->subMinutes(5))
    ->count();

if ($suspiciousActivity > 100) {
    // Bloquer l'IP temporairement
    Cache::put("blocked_ip:{$ip}", true, now()->addHours(1));

    // Envoyer alerte
    Notification::send($admins, new SuspiciousApiActivity($ip));
}
```

---

## 📝 Checklist de Sécurité

- [ ] API Keys générées avec cryptographiquement sécurisé (random_bytes, openssl)
- [ ] Longueur minimum de 32 caractères (64 recommandé)
- [ ] Clés stockées dans .env ou gestionnaire de secrets
- [ ] .env dans .gitignore
- [ ] Clés différentes pour dev/staging/prod
- [ ] Middleware de validation installé
- [ ] Rate limiting configuré
- [ ] Logging des accès (sans exposer les clés)
- [ ] Rotation planifiée (au moins tous les 6 mois)
- [ ] Monitoring et alertes configurés
- [ ] Documentation pour les utilisateurs de l'API
- [ ] Plan de révocation d'urgence en place

---

## 🆘 En Cas de Fuite

### Actions Immédiates (< 1h)

1. **Révoquer la clé compromise**
   ```bash
   # Ajouter à la blacklist
   redis-cli SADD revoked_keys "cle_compromise"
   ```

2. **Générer et déployer nouvelle clé**
   ```bash
   php generate-api-key.php > emergency-key.txt
   # Déployer immédiatement sur tous les environnements
   ```

3. **Analyser les logs**
   ```bash
   # Rechercher utilisations suspectes
   grep "cle_compromise" /var/log/api/*.log
   ```

### Actions à court terme (< 24h)

1. Notifier tous les utilisateurs
2. Forcer rotation de toutes les clés
3. Audit complet de sécurité
4. Mise à jour documentation

### Actions à moyen terme (< 1 semaine)

1. Post-mortem de l'incident
2. Amélioration des procédures
3. Formation équipe
4. Tests de sécurité

---

**Version**: 1.0
**Dernière mise à jour**: 16 novembre 2025
**Auteur**: Équipe Bsissa
