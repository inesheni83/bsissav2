# 🚂 Railway Deployment - Guide Complet

## 📚 Documentation Disponible

Ce dossier contient toute la documentation nécessaire pour déployer et maintenir l'application Bsissa sur Railway.

---

## 🚀 Ordre de Lecture Recommandé

### 1️⃣ Première Fois (Déploiement Initial)

1. **[RAILWAY_DEPLOYMENT_GUIDE.md](RAILWAY_DEPLOYMENT_GUIDE.md)**
   - Guide complet de déploiement initial
   - Configuration GitHub → Railway
   - Ajout du service MySQL
   - Configuration de base

2. **[RAILWAY_ENV_SETUP.md](RAILWAY_ENV_SETUP.md)**
   - ⚠️ **IMPORTANT** : Variables d'environnement obligatoires
   - Différence entre APP_KEY et API_KEY
   - Template complet des variables
   - Génération de APP_KEY

3. **[DATABASE_SCHEMA_DOCUMENTATION.md](DATABASE_SCHEMA_DOCUMENTATION.md)**
   - Documentation complète du schéma de base de données
   - 18 tables, relations, indexes
   - Scripts SQL pour création manuelle

---

### 2️⃣ Après Déploiement (Vérification)

4. **[RAILWAY_POST_DEPLOY_CHECKLIST.md](RAILWAY_POST_DEPLOY_CHECKLIST.md)**
   - ✅ Checklist complète de vérification
   - Tests à effectuer
   - Vérification des logs
   - Validation du site

---

### 3️⃣ En Cas de Problème

5. **[RAILWAY_ASSETS_FIX.md](RAILWAY_ASSETS_FIX.md)**
   - 🔴 Site affiché en noir / CSS-JS en 404
   - Assets Vite non chargés
   - Solutions et dépannage

6. **[API_KEY_GUIDE.md](API_KEY_GUIDE.md)**
   - Génération de clés API personnalisées
   - Différents types de clés
   - Scripts de génération

---

## 🎯 Guide Rapide

### Problème Fréquent 1 : "No application encryption key"

**Solution** :
```bash
# 1. Générer localement
php artisan key:generate --show

# 2. Copier le résultat (exemple)
base64:dDBZm4V1HM3DKTUrq8e/x4XVh1P5GBv3SpfAR9Fb9no=

# 3. Ajouter sur Railway
Railway → Variables → New Variable
APP_KEY=base64:dDBZm4V1HM3DKTUrq8e/x4XVh1P5GBv3SpfAR9Fb9no=
```

**Voir** : [RAILWAY_ENV_SETUP.md](RAILWAY_ENV_SETUP.md)

---

### Problème Fréquent 2 : Site noir, CSS/JS en rouge (404)

**Solution** :
```bash
# Vérifier que nixpacks.toml contient :
npm ci --include=dev  # <- Important!
npm run build
```

**Ajouter sur Railway** :
```env
ASSET_URL=https://votre-app.up.railway.app
```

**Voir** : [RAILWAY_ASSETS_FIX.md](RAILWAY_ASSETS_FIX.md)

---

### Problème Fréquent 3 : Base de données vide

**Solution** :
```bash
# SSH Railway (si disponible)
php artisan migrate --force

# Ou utiliser les scripts SQL
mysql -u root -p < database/schema.sql
```

**Voir** : [DATABASE_SCHEMA_DOCUMENTATION.md](DATABASE_SCHEMA_DOCUMENTATION.md)

---

## 📋 Checklist Déploiement

### Avant de Commencer

- [ ] Repository GitHub connecté à Railway
- [ ] Service MySQL ajouté sur Railway
- [ ] Variables Railway configurées (voir RAILWAY_ENV_SETUP.md)
- [ ] `APP_KEY` généré et ajouté
- [ ] `ASSET_URL` ajouté

### Configuration Fichiers

- [ ] `nixpacks.toml` contient `npm ci --include=dev`
- [ ] `.gitignore` ne contient PAS `/resources/js/routes`
- [ ] `.gitignore` ne contient PAS `/resources/js/actions`
- [ ] `.gitignore` ne contient PAS `/resources/js/wayfinder`
- [ ] Fichiers Wayfinder commités dans git

### Variables d'Environnement Minimales

```env
# Application
APP_NAME=Bsissa
APP_ENV=production
APP_KEY=base64:VotreClé=
APP_DEBUG=false
APP_URL=https://votre-app.up.railway.app

# Assets (CRITIQUE!)
ASSET_URL=https://votre-app.up.railway.app

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
```

### Après Déploiement

- [ ] Logs montrent "npm ci --include=dev"
- [ ] Logs montrent "npm run build" réussi
- [ ] Logs montrent "built in XXs"
- [ ] Aucune erreur dans les logs
- [ ] `https://votre-app.up.railway.app/build/manifest.json` accessible (200 OK)
- [ ] Site s'affiche correctement
- [ ] Pas d'erreurs 404 dans la console navigateur

---

## 🔧 Commandes Utiles

### Logs Railway

```bash
# Via CLI
railway logs --follow

# Via Dashboard
Railway → Deployments → View Logs
```

### Redéployer

```bash
# Via Dashboard
Railway → Settings → Trigger Deploy

# Via Git
git commit --allow-empty -m "Trigger redeploy"
git push

# Via CLI
railway up
```

### Vérifier Variables

```bash
# Via CLI
railway variables

# Via Dashboard
Railway → Variables
```

---

## 📞 Support

### Documentation Laravel

- [Laravel Deployment](https://laravel.com/docs/10.x/deployment)
- [Laravel Configuration](https://laravel.com/docs/10.x/configuration)

### Documentation Railway

- [Railway Docs](https://docs.railway.app)
- [Nixpacks](https://nixpacks.com)
- [Railway Discord](https://discord.gg/railway)

### Fichiers du Projet

- Configuration Build : `nixpacks.toml`
- Configuration Vite : `vite.config.ts`
- Migrations : `database/migrations/`
- Schema SQL : `database/schema.sql`

---

## 🎉 État Actuel

**Version** : 1.0
**Dernière mise à jour** : 16 novembre 2025
**Statut** : ✅ Configuration complète

### Corrections Appliquées

1. ✅ Module resolution Vite (alias + extensions)
2. ✅ Wayfinder files commités (routes, actions)
3. ✅ nixpacks.toml corrigé (`npm ci --include=dev`)
4. ✅ Documentation complète créée
5. ✅ Scripts de base de données créés
6. ✅ Guide API_KEY vs APP_KEY

### Prochaines Étapes

1. **Ajouter ASSET_URL** sur Railway (si pas encore fait)
2. **Vérifier le déploiement** avec la checklist
3. **Tester le site**
4. **Configurer un domaine custom** (optionnel)
5. **Activer les backups MySQL** (recommandé)

---

## 📁 Structure Documentation

```
/
├── RAILWAY_README.md (ce fichier)
│
├── Déploiement Initial
│   ├── RAILWAY_DEPLOYMENT_GUIDE.md
│   ├── RAILWAY_ENV_SETUP.md
│   └── DATABASE_SCHEMA_DOCUMENTATION.md
│
├── Post-Déploiement
│   └── RAILWAY_POST_DEPLOY_CHECKLIST.md
│
├── Dépannage
│   ├── RAILWAY_ASSETS_FIX.md
│   └── API_KEY_GUIDE.md
│
└── Scripts
    ├── database/schema.sql
    ├── database/setup-database.sh
    ├── database/setup-database.bat
    ├── generate-api-key.php
    └── generate-api-key.sh
```

---

## ⚡ TL;DR - Démarrage Rapide

```bash
# 1. Générer APP_KEY
php artisan key:generate --show

# 2. Ajouter sur Railway (Variables)
APP_KEY=base64:votreClé=
ASSET_URL=https://votre-app.up.railway.app
APP_URL=https://votre-app.up.railway.app
DB_HOST=${MYSQLHOST}
DB_PORT=${MYSQLPORT}
DB_DATABASE=${MYSQLDATABASE}
DB_USERNAME=${MYSQLUSER}
DB_PASSWORD=${MYSQLPASSWORD}
DEBUGBAR_ENABLED=false

# 3. Vérifier nixpacks.toml contient
npm ci --include=dev

# 4. Push
git push

# 5. Surveiller
railway logs --follow

# 6. Vérifier
https://votre-app.up.railway.app
```

✅ **Fait? Consultez** [RAILWAY_POST_DEPLOY_CHECKLIST.md](RAILWAY_POST_DEPLOY_CHECKLIST.md)

---

**Bonne chance! 🚀**
