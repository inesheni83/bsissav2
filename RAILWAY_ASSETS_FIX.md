# 🎨 Fix: Assets CSS/JS Non Chargés sur Railway

## 🔴 Problème

Pages affichées en noir, CSS/JS en rouge (404) dans la console.

## 🎯 Cause

Les assets Vite ne sont pas buildés ou accessibles sur Railway.

---

## ✅ Solution Complète

### Étape 1 : Vérifier que le Build Fonctionne Localement

```bash
# Nettoyer les anciens builds
rm -rf public/build

# Builder les assets
npm run build

# Vérifier que les fichiers sont créés
ls -la public/build/
```

Vous devriez voir :
```
public/build/
├── manifest.json
└── assets/
    ├── app-xxxxx.js
    ├── app-xxxxx.css
    └── ...
```

### Étape 2 : Mettre à Jour nixpacks.toml

Le fichier existe déjà, mais vérifions qu'il est correct :

```toml
[phases.setup]
nixPkgs = ["nodejs_20", "php82", "php82Packages.composer"]

[phases.install]
cmds = [
  "composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist"
]

[phases.build]
cmds = [
  "npm ci --include=dev",
  "npm run build",
  "php artisan config:cache",
  "php artisan route:cache",
  "php artisan view:cache"
]

[start]
cmd = "php artisan serve --host=0.0.0.0 --port=${PORT:-8080}"

[variables]
NODE_ENV = "production"
```

**Points importants** :
- `npm ci --include=dev` : Installe AUSSI les devDependencies (vite, etc.)
- `npm run build` : Build les assets
- Ordre correct : install → build → cache

### Étape 3 : Vérifier les Variables d'Environnement Railway

Ajoutez ces variables sur Railway :

```env
# Asset URL (Important!)
ASSET_URL=https://votre-app.up.railway.app

# Ou si vous utilisez un domaine custom
ASSET_URL=https://votre-domaine.com

# Vite
VITE_APP_NAME="${APP_NAME}"
```

### Étape 4 : Modifier config/app.php (Si Nécessaire)

```php
return [
    // ...

    'asset_url' => env('ASSET_URL', null),

    // ...
];
```

### Étape 5 : Créer un Procfile (Optionnel)

Créez `Procfile` à la racine :

```
web: php artisan serve --host=0.0.0.0 --port=$PORT
```

### Étape 6 : Vérifier .gitignore

Assurez-vous que `public/build` est DANS le `.gitignore` :

```gitignore
/public/build
/public/hot
```

C'est normal, les assets seront buildés sur Railway.

### Étape 7 : Ajouter un Script Post-Deploy

Créez `deploy.sh` :

```bash
#!/bin/bash

echo "🚀 Deployment started..."

# Clear caches
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

# Rebuild caches
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Link storage
php artisan storage:link

echo "✅ Deployment completed!"
```

Rendez-le exécutable :
```bash
chmod +x deploy.sh
```

---

## 🔍 Diagnostic des Problèmes

### Problème 1 : "manifest.json not found"

**Cause** : Build n'a pas été exécuté

**Solution** :
```bash
# Sur Railway, vérifier les logs de build
# Devrait contenir: "npm run build"

# Si absent, mettre à jour nixpacks.toml
```

### Problème 2 : Assets 404

**Cause** : Mauvaise URL des assets

**Solution** :
```env
# Railway Variables
ASSET_URL=https://votre-app.up.railway.app
APP_URL=https://votre-app.up.railway.app
```

### Problème 3 : "vite not found"

**Cause** : devDependencies pas installées

**Solution** :
```toml
# nixpacks.toml
[phases.build]
cmds = [
  "npm ci --include=dev",  # <-- Important!
  "npm run build"
]
```

### Problème 4 : Build réussit mais assets toujours 404

**Cause** : public/build pas accessible

**Solution** :
```bash
# Vérifier que public/ a les bonnes permissions
# Ajouter dans nixpacks.toml après le build:

[phases.build]
cmds = [
  "npm ci --include=dev",
  "npm run build",
  "chmod -R 755 public/build"
]
```

---

## 🚀 Configuration Railway Complète

### Variables Obligatoires

```env
# Application
APP_NAME=Bsissa
APP_ENV=production
APP_KEY=base64:VotreCléIci=
APP_DEBUG=false
APP_URL=https://bsissa.up.railway.app

# Assets (IMPORTANT!)
ASSET_URL=https://bsissa.up.railway.app

# Database
DB_CONNECTION=mysql
DB_HOST=${MYSQLHOST}
DB_PORT=${MYSQLPORT}
DB_DATABASE=${MYSQLDATABASE}
DB_USERNAME=${MYSQLUSER}
DB_PASSWORD=${MYSQLPASSWORD}

# Cache
CACHE_STORE=database
SESSION_DRIVER=database
QUEUE_CONNECTION=database

# Debug
DEBUGBAR_ENABLED=false
LOG_LEVEL=error

# Vite
VITE_APP_NAME="${APP_NAME}"
```

### nixpacks.toml Final

```toml
[phases.setup]
nixPkgs = ["nodejs_20", "php82", "php82Packages.composer"]

[phases.install]
cmds = [
  "composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist"
]

[phases.build]
cmds = [
  # Installer les dépendances (y compris dev pour vite)
  "npm ci --include=dev",

  # Builder les assets
  "npm run build",

  # Permissions
  "chmod -R 755 public/build",
  "chmod -R 775 storage bootstrap/cache",

  # Cache Laravel
  "php artisan config:cache",
  "php artisan route:cache",
  "php artisan view:cache"
]

[start]
cmd = "php artisan serve --host=0.0.0.0 --port=${PORT:-8080}"

[variables]
NODE_ENV = "production"
```

---

## 🧪 Tests

### Test 1 : Vérifier Build Local

```bash
npm run build
ls public/build/manifest.json
```

### Test 2 : Vérifier les Assets dans le HTML

Inspectez le code source de votre page Railway :
```html
<!-- Devrait contenir -->
<link rel="stylesheet" href="https://votre-app.up.railway.app/build/assets/app-xxxxx.css">
<script src="https://votre-app.up.railway.app/build/assets/app-xxxxx.js"></script>
```

### Test 3 : Tester les URLs d'Assets

```bash
# Ces URLs doivent être accessibles (200 OK)
curl -I https://votre-app.up.railway.app/build/manifest.json
curl -I https://votre-app.up.railway.app/build/assets/app-xxxxx.css
```

---

## 📝 Checklist de Déploiement

Avant de redéployer sur Railway :

- [ ] `npm run build` fonctionne localement
- [ ] `public/build/manifest.json` existe après build
- [ ] `nixpacks.toml` contient `npm ci --include=dev`
- [ ] `nixpacks.toml` contient `npm run build`
- [ ] Variable `ASSET_URL` ajoutée sur Railway
- [ ] Variable `APP_URL` correspond à l'URL Railway
- [ ] `DEBUGBAR_ENABLED=false`
- [ ] `.gitignore` contient `/public/build`
- [ ] Commit et push vers GitHub
- [ ] Railway redéploie automatiquement
- [ ] Vérifier les logs de build (doit voir "npm run build")
- [ ] Tester le site (CSS doit être chargé)

---

## 🆘 Dépannage Avancé

### Forcer un Rebuild sur Railway

1. Railway Dashboard → Settings
2. Trigger Deploy → Redeploy

Ou avec CLI :
```bash
railway up
```

### Voir les Logs en Direct

```bash
railway logs
```

### Vérifier le Contenu de public/build

Si vous avez accès SSH :
```bash
railway shell
ls -la public/build/
cat public/build/manifest.json
```

### Debug Vite

Ajoutez temporairement dans `.env` (Railway) :
```env
VITE_DEBUG=true
```

Et vérifiez les logs.

---

## 🔄 Commandes Utiles

### Nettoyer et Rebuilder

```bash
# Local
rm -rf node_modules public/build
npm install
npm run build

# Vérifier
ls public/build/
```

### Tester le Build de Production

```bash
# Build
npm run build

# Serveur PHP local
php artisan serve

# Ouvrir http://localhost:8000
```

---

## 💡 Astuces

### Astuce 1 : CDN pour Assets (Performance)

Pour améliorer les performances, utilisez un CDN :

```env
# Railway Variables
ASSET_URL=https://cdn.votre-domaine.com
```

Configurez votre CDN pour pointer vers `https://votre-app.up.railway.app/build/`

### Astuce 2 : Versioning des Assets

Vite gère automatiquement le versioning des assets avec des hash.

### Astuce 3 : Monitoring

Ajoutez dans `app.blade.php` pour debugger :

```html
<!-- Mode debug temporaire -->
@if(app()->environment('production') && config('app.debug'))
    <script>
        console.log('Asset URL:', '{{ config('app.asset_url') }}');
        console.log('Environment:', '{{ app()->environment() }}');
    </script>
@endif
```

---

## ✅ Résultat Attendu

Après avoir appliqué ces corrections :

1. ✅ CSS chargé correctement
2. ✅ JS chargé correctement
3. ✅ Site s'affiche normalement
4. ✅ Pas d'erreurs 404 dans la console
5. ✅ Styles Tailwind appliqués
6. ✅ React fonctionne

---

**Version** : 1.0
**Dernière mise à jour** : 16 novembre 2025
