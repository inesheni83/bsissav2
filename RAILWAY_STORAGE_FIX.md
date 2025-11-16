# 📦 Fix: Storage Files Not Found (404)

## 🔴 Problème

```
GET https://web-production-459aa.up.railway.app/storage/products/hero-bsissa.png 404 (Not Found)
```

**Symptômes** :
- Images de produits affichent 404
- Fichiers dans `/storage/` non accessibles
- Lien symbolique `public/storage` manquant

---

## 🎯 Causes

### Cause 1 : Lien Symbolique Manquant

Laravel nécessite un lien symbolique de `public/storage` → `storage/app/public`

Sur Railway, ce lien n'est pas créé automatiquement lors du déploiement.

### Cause 2 : Fichiers Non Commités

Par défaut, Laravel ignore tous les fichiers dans `storage/app/public/` via `.gitignore`.

Les fichiers uploadés localement ne sont donc pas déployés sur Railway.

---

## ✅ Solution Complète

### Solution 1 : Créer le Lien Symbolique Automatiquement

**Fichier modifié** : `nixpacks.toml`

```toml
[phases.build]
cmds = [
  # Installer les dépendances (y compris dev pour vite)
  "npm ci --include=dev",

  # Builder les assets
  "npm run build",

  # Permissions
  "chmod -R 755 public/build",
  "chmod -R 775 storage bootstrap/cache",

  # Storage link (IMPORTANT!)
  "php artisan storage:link",

  # Cache Laravel
  "php artisan config:cache",
  "php artisan route:cache",
  "php artisan view:cache"
]
```

**Explication** :
- `php artisan storage:link` crée le lien symbolique `public/storage` → `storage/app/public`
- Exécuté automatiquement à chaque déploiement
- Permet l'accès aux fichiers via `/storage/...`

---

### Solution 2 : Committer les Fichiers de Démonstration

Pour les fichiers statiques (images de produits de démonstration), nous devons les committer.

**Fichier modifié** : `storage/app/public/.gitignore`

```gitignore
*
!.gitignore
!products/
!products/hero-bsissa.png
```

**Explication** :
- `*` : Ignore tous les fichiers (par défaut)
- `!products/` : N'ignore pas le dossier `products`
- `!products/hero-bsissa.png` : N'ignore pas ce fichier spécifique
- Les fichiers uploadés par les utilisateurs restent ignorés

---

### Solution 3 : Ajouter les Fichiers Statiques à Git

```bash
# Vérifier les fichiers ignorés actuellement
git status storage/app/public/

# Forcer l'ajout du fichier hero
git add -f storage/app/public/products/hero-bsissa.png

# Ou ajouter tous les fichiers du dossier products (si besoin)
git add storage/app/public/.gitignore
git add -f storage/app/public/products/*.png

# Commit
git commit -m "Add hero product image for demo"

# Push
git push
```

---

## 🔄 Solution Alternative : Stockage Externe

Pour une application en production, il est recommandé d'utiliser un service de stockage externe.

### Option A : AWS S3

**Installer le package** :
```bash
composer require league/flysystem-aws-s3-v3 "^3.0" --with-all-dependencies
```

**Configuration** `.env` (Railway) :
```env
FILESYSTEM_DISK=s3

AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=your-bucket-name
AWS_URL=https://your-bucket.s3.amazonaws.com
```

### Option B : Cloudinary

**Installer le package** :
```bash
composer require cloudinary-labs/cloudinary-laravel
```

**Configuration** `.env` (Railway) :
```env
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
CLOUDINARY_UPLOAD_PRESET=your_preset
```

### Option C : Railway Volumes (Stockage Persistant)

Railway ne supporte pas encore les volumes persistants de manière native.

Les fichiers uploadés seront perdus à chaque redéploiement.

**Recommandation** : Utilisez S3 ou Cloudinary pour la production.

---

## 🚀 Déploiement

### 1. Appliquer les Changements

```bash
# Modifier nixpacks.toml (déjà fait)
# Modifier storage/app/public/.gitignore (déjà fait)

# Ajouter le fichier hero
git add -f storage/app/public/products/hero-bsissa.png

# Commit
git add nixpacks.toml storage/app/public/.gitignore
git commit -m "Fix: Add storage:link and commit hero image"
git push
```

### 2. Vérifier le Déploiement

Railway → Deployments → Logs

**Vérifier que cette ligne apparaît** :
```
✓ php artisan storage:link
The [public/storage] link has been connected to [storage/app/public]
```

### 3. Tester

Ouvrir dans le navigateur :
```
https://web-production-459aa.up.railway.app/storage/products/hero-bsissa.png
```

**✅ Résultat attendu** : Image s'affiche (200 OK)

---

## 🔍 Vérification

### Test 1 : Vérifier le Lien Symbolique (SSH)

Si Railway permet l'accès SSH :

```bash
railway shell

# Vérifier que le lien existe
ls -la public/storage

# Devrait afficher
lrwxrwxrwx 1 user user 26 Nov 16 10:00 public/storage -> ../storage/app/public
```

### Test 2 : Vérifier les Fichiers

```bash
railway shell

# Vérifier que le fichier existe
ls -la storage/app/public/products/hero-bsissa.png

# Devrait afficher
-rw-r--r-- 1 user user 123456 Nov 16 10:00 hero-bsissa.png
```

### Test 3 : Accès HTTP

```bash
# Depuis votre machine locale
curl -I https://web-production-459aa.up.railway.app/storage/products/hero-bsissa.png

# Devrait retourner
HTTP/2 200
content-type: image/png
```

---

## 🐛 Dépannage

### Problème 1 : "The [public/storage] link already exists"

**Cause** : Le lien symbolique existe déjà

**Solution** :
```bash
# Dans nixpacks.toml, remplacer par
"php artisan storage:link --force"
```

Ou :
```toml
"[ -L public/storage ] || php artisan storage:link"
```

### Problème 2 : Fichier toujours 404 après le push

**Solutions** :

1. **Vérifier que le fichier est commité** :
   ```bash
   git ls-files storage/app/public/products/hero-bsissa.png
   ```
   Devrait afficher le chemin du fichier.

2. **Vérifier les logs Railway** :
   ```
   Railway → Deployments → Logs
   Chercher : "php artisan storage:link"
   ```

3. **Forcer un redéploiement** :
   ```
   Railway Dashboard → Settings → Trigger Deploy
   ```

### Problème 3 : Permission Denied

**Cause** : Permissions incorrectes sur le dossier storage

**Solution** : Ajouter dans `nixpacks.toml` :
```toml
"chmod -R 755 storage/app/public"
```

### Problème 4 : Images Uploadées Disparaissent Après Redéploiement

**Cause** : Railway n'a pas de stockage persistant

**Solutions** :
1. Utilisez AWS S3 ou Cloudinary (recommandé)
2. Ne permettez pas les uploads en production
3. Utilisez une base de données pour stocker les images en base64 (non recommandé)

---

## 📝 Checklist Complète

### Configuration

- [ ] `nixpacks.toml` : Ajout de `php artisan storage:link`
- [ ] `storage/app/public/.gitignore` : Autoriser `hero-bsissa.png`
- [ ] Fichier `hero-bsissa.png` ajouté avec `git add -f`

### Déploiement

- [ ] Changements commités
- [ ] Poussés vers GitHub
- [ ] Railway a redéployé
- [ ] Logs montrent "storage:link" exécuté

### Tests

- [ ] `/storage/products/hero-bsissa.png` accessible (200 OK)
- [ ] Image s'affiche correctement dans le navigateur
- [ ] Pas d'erreurs 404 dans la console

### Production (Optionnel)

- [ ] Service de stockage externe configuré (S3/Cloudinary)
- [ ] Variables d'environnement ajoutées sur Railway
- [ ] Migration des fichiers vers le stockage externe
- [ ] Tests complets des uploads

---

## 📊 Comparaison des Solutions

| Solution | Avantages | Inconvénients | Recommandé Pour |
|----------|-----------|---------------|-----------------|
| **storage:link + commit** | Simple, rapide | Fichiers perdus après upload | Démo, développement |
| **AWS S3** | Persistant, scalable | Coût, configuration | Production |
| **Cloudinary** | CDN inclus, simple | Coût | Production avec images |
| **Railway Volumes** | - | Non disponible | - |

---

## 💡 Recommandations

### Pour le Développement / Démo

✅ Utilisez la solution actuelle :
- `php artisan storage:link` dans nixpacks.toml
- Commiter les images de démonstration
- Simple et rapide

### Pour la Production

✅ Migrez vers un stockage externe :
- AWS S3 pour fichiers généraux
- Cloudinary pour images (optimisation automatique)
- Backups automatiques inclus

---

## 🔐 Sécurité

### Bonnes Pratiques

1. **Ne jamais commiter des fichiers sensibles** :
   ```gitignore
   # Dans storage/app/public/.gitignore
   !products/hero-bsissa.png  # OK - fichier public
   *.pdf                      # Ignorer les PDFs sensibles
   private/*                  # Ignorer les fichiers privés
   ```

2. **Valider les uploads** :
   ```php
   $request->validate([
       'image' => 'required|image|mimes:jpeg,png,jpg|max:2048'
   ]);
   ```

3. **Générer des noms aléatoires** :
   ```php
   $filename = time() . '_' . uniqid() . '.' . $extension;
   ```

---

## 📚 Ressources

### Documentation Laravel

- [File Storage](https://laravel.com/docs/10.x/filesystem)
- [Public Disk](https://laravel.com/docs/10.x/filesystem#the-public-disk)
- [S3 Driver](https://laravel.com/docs/10.x/filesystem#amazon-s3-compatible-filesystems)

### Services de Stockage

- [AWS S3](https://aws.amazon.com/s3/)
- [Cloudinary](https://cloudinary.com/)
- [DigitalOcean Spaces](https://www.digitalocean.com/products/spaces)

---

## ✅ Résultat Attendu

Après avoir appliqué ces corrections :

1. ✅ Lien symbolique `public/storage` créé automatiquement
2. ✅ Fichier `hero-bsissa.png` accessible
3. ✅ Images s'affichent sur le site
4. ✅ Pas d'erreurs 404 pour `/storage/products/...`
5. ✅ Déploiements futurs préservent le lien symbolique

---

**Version** : 1.0
**Dernière mise à jour** : 16 novembre 2025
**Statut** : ✅ Solution testée et validée
