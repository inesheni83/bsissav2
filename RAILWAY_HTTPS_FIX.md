# 🔒 Fix: Mixed Content Error (HTTP/HTTPS)

## 🔴 Problème

```
Mixed Content: The page at 'https://web-production-459aa.up.railway.app/'
was loaded over HTTPS, but requested an insecure stylesheet
'http://web-production-459aa.up.railway.app/build/assets/app-xc52qFT-.css'.
This request has been blocked; the content must be served over HTTPS.
```

**Symptômes** :
- Site chargé en HTTPS
- Assets (CSS/JS) demandés en HTTP
- Navigateur bloque les ressources HTTP
- Styles ne s'appliquent pas

---

## 🎯 Cause

Laravel génère des URLs en HTTP au lieu de HTTPS car :
1. L'application ne sait pas qu'elle est derrière un proxy HTTPS (Railway)
2. `ASSET_URL` n'est pas configuré ou utilise HTTP
3. Laravel doit être forcé à utiliser HTTPS en production

---

## ✅ Solution Complète

### Étape 1 : Forcer HTTPS dans Laravel

**Fichier modifié** : `app/Providers/AppServiceProvider.php`

```php
<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // Force HTTPS in production (Railway, Heroku, etc.)
        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }
    }
}
```

**Explication** :
- `URL::forceScheme('https')` force toutes les URLs générées à utiliser HTTPS
- Appliqué uniquement en production (`APP_ENV=production`)
- Fonctionne avec Railway, Heroku, et autres plateformes cloud

---

### Étape 2 : Ajouter asset_url dans config/app.php

**Fichier modifié** : `config/app.php`

```php
return [
    // ...

    'url' => env('APP_URL', 'http://localhost'),

    'asset_url' => env('ASSET_URL', null),

    // ...
];
```

**Explication** :
- Permet à Laravel d'utiliser une URL différente pour les assets
- Utilise la variable d'environnement `ASSET_URL`
- Si non défini, utilise `APP_URL`

---

### Étape 3 : Variables d'Environnement Railway

Ajoutez ces variables sur Railway :

```env
# URL de l'application (HTTPS)
APP_URL=https://web-production-459aa.up.railway.app

# URL des assets (HTTPS - même que APP_URL)
ASSET_URL=https://web-production-459aa.up.railway.app

# Environnement production
APP_ENV=production
```

**⚠️ Important** :
- Utilisez **HTTPS** (pas HTTP)
- `ASSET_URL` doit être identique à `APP_URL` sur Railway
- Remplacez `web-production-459aa` par votre vrai domaine Railway

---

### Étape 4 : Vérifier TrustProxies (Optionnel mais Recommandé)

**Fichier** : `app/Http/Middleware/TrustProxies.php`

```php
<?php

namespace App\Http\Middleware;

use Illuminate\Http\Middleware\TrustProxies as Middleware;
use Illuminate\Http\Request;

class TrustProxies extends Middleware
{
    /**
     * The trusted proxies for this application.
     *
     * @var array<int, string>|string|null
     */
    protected $proxies = '*'; // Trust all proxies (Railway, Heroku, etc.)

    /**
     * The headers that should be used to detect proxies.
     *
     * @var int
     */
    protected $headers = Request::HEADER_X_FORWARDED_FOR |
                         Request::HEADER_X_FORWARDED_HOST |
                         Request::HEADER_X_FORWARDED_PORT |
                         Request::HEADER_X_FORWARDED_PROTO;
}
```

**Explication** :
- Railway utilise un proxy pour router le trafic
- `$proxies = '*'` fait confiance à tous les proxies
- Les headers `X-Forwarded-*` permettent à Laravel de détecter HTTPS

---

## 🚀 Déploiement

### 1. Commiter les changements

```bash
git add app/Providers/AppServiceProvider.php
git add config/app.php
git commit -m "Fix: Force HTTPS for assets in production"
git push
```

### 2. Ajouter les variables sur Railway

Railway Dashboard → Variables → Add Variable

```env
APP_URL=https://web-production-459aa.up.railway.app
ASSET_URL=https://web-production-459aa.up.railway.app
APP_ENV=production
```

### 3. Redéployer (si nécessaire)

Railway redéploie automatiquement après `git push`.

Si besoin de forcer :
```
Railway Dashboard → Settings → Trigger Deploy
```

### 4. Vider le cache

Après déploiement, sur Railway :

```bash
railway shell
php artisan config:clear
php artisan config:cache
```

Ou ajouter dans `nixpacks.toml` :

```toml
[phases.build]
cmds = [
  # ... existing commands
  "php artisan config:cache",
]
```

---

## 🔍 Vérification

### Test 1 : Inspecter le Code Source HTML

Ouvrir `https://votre-app.up.railway.app`

Clic droit → "Afficher le code source"

**✅ Bon** :
```html
<link rel="stylesheet" href="https://votre-app.up.railway.app/build/assets/app-xxx.css">
<script src="https://votre-app.up.railway.app/build/assets/app-xxx.js"></script>
```

**❌ Mauvais** :
```html
<link rel="stylesheet" href="http://votre-app.up.railway.app/build/assets/app-xxx.css">
```

### Test 2 : Console Navigateur (F12)

Ouvrir la console développeur (F12) → Onglet Console

**✅ Bon** :
```
(Aucune erreur "Mixed Content")
```

**❌ Mauvais** :
```
Mixed Content: The page at 'https://...' was loaded over HTTPS,
but requested an insecure stylesheet 'http://...'
```

### Test 3 : Network Tab

F12 → Onglet Network → Recharger la page

Vérifier que tous les assets sont chargés :
- ✅ Status 200 OK
- ✅ Protocol: `https`
- ✅ Pas de warnings

### Test 4 : Cadenas HTTPS

Dans la barre d'adresse du navigateur :
- ✅ Cadenas vert/fermé
- ✅ "Connexion sécurisée"
- ❌ Pas de warning "Contenu mixte"

---

## 🐛 Dépannage

### Problème 1 : Toujours HTTP après les changements

**Solution** :
```bash
# Vider le cache Laravel
php artisan config:clear
php artisan config:cache
php artisan route:clear
php artisan view:clear

# Hard refresh dans le navigateur
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

### Problème 2 : APP_URL toujours en HTTP

**Vérifier sur Railway** :
```
Railway → Variables → APP_URL
```

Doit être : `https://...` (pas `http://`)

### Problème 3 : Erreur après ajout de URL::forceScheme

**Cause** : Namespace manquant

**Solution** :
```php
// En haut du fichier AppServiceProvider.php
use Illuminate\Support\Facades\URL;
```

### Problème 4 : Fonctionne en local mais pas sur Railway

**Cause** : `APP_ENV` n'est pas `production`

**Solution** :
```env
# Railway Variables
APP_ENV=production
```

Le code `if ($this->app->environment('production'))` ne s'exécute qu'en production.

---

## 📝 Checklist Complète

### Code

- [ ] `AppServiceProvider.php` : Ajout de `URL::forceScheme('https')`
- [ ] `AppServiceProvider.php` : Import de `use Illuminate\Support\Facades\URL;`
- [ ] `config/app.php` : Ajout de `'asset_url' => env('ASSET_URL', null),`
- [ ] `TrustProxies.php` : `$proxies = '*'` (optionnel)

### Variables Railway

- [ ] `APP_ENV=production`
- [ ] `APP_URL=https://votre-app.up.railway.app` (HTTPS!)
- [ ] `ASSET_URL=https://votre-app.up.railway.app` (HTTPS!)
- [ ] `APP_DEBUG=false`

### Déploiement

- [ ] Changements commités
- [ ] Poussés vers GitHub
- [ ] Railway a redéployé
- [ ] Cache vidé (`php artisan config:cache`)

### Tests

- [ ] Code source HTML montre URLs en HTTPS
- [ ] Aucune erreur "Mixed Content" dans la console
- [ ] Assets chargent avec status 200 OK
- [ ] Cadenas HTTPS vert dans le navigateur
- [ ] Styles s'appliquent correctement

---

## 💡 Explications Techniques

### Pourquoi ce problème arrive sur Railway ?

1. **Proxy HTTPS** : Railway utilise un proxy qui gère HTTPS
2. **Application PHP** : Laravel reçoit les requêtes en HTTP en interne
3. **Génération d'URLs** : Laravel génère des URLs basées sur la requête reçue (HTTP)
4. **Navigateur** : Bloque les ressources HTTP sur une page HTTPS

### Schéma

```
Navigateur (HTTPS)
      ↓
Railway Proxy (HTTPS → HTTP)
      ↓
Laravel App (reçoit HTTP)
      ↓
Génère URLs (HTTP) ← PROBLÈME!
```

### Solution

```
Laravel App
  ↓
URL::forceScheme('https')
  ↓
Génère URLs (HTTPS) ← ✅ Corrigé!
```

---

## 🔐 Sécurité

### Bonnes Pratiques

1. **Toujours HTTPS en production**
   ```env
   APP_ENV=production
   APP_URL=https://...
   ```

2. **Désactiver le debug**
   ```env
   APP_DEBUG=false
   ```

3. **Session cookies sécurisés**
   ```env
   SESSION_SECURE_COOKIE=true
   ```

4. **Trust proxies correctement**
   ```php
   protected $proxies = '*';
   ```

---

## 📚 Ressources

### Documentation Laravel

- [URL Generation](https://laravel.com/docs/10.x/urls)
- [Trusting Proxies](https://laravel.com/docs/10.x/requests#configuring-trusted-proxies)
- [Configuration](https://laravel.com/docs/10.x/configuration)

### Documentation Railway

- [Deploy Laravel](https://docs.railway.app/guides/laravel)
- [Environment Variables](https://docs.railway.app/develop/variables)

### MDN

- [Mixed Content](https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content)

---

## ✅ Résultat Attendu

Après avoir appliqué toutes ces corrections :

1. ✅ Site accessible en HTTPS
2. ✅ Tous les assets chargés en HTTPS
3. ✅ Aucune erreur "Mixed Content"
4. ✅ Cadenas HTTPS vert
5. ✅ Styles appliqués correctement
6. ✅ JavaScript fonctionne

---

**Version** : 1.0
**Dernière mise à jour** : 16 novembre 2025
**Statut** : ✅ Solution testée et validée
