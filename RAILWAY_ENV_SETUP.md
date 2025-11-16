# 🚂 Configuration des Variables d'Environnement Railway

## ⚠️ Problème : "No application encryption key has been specified"

Cette erreur signifie que Laravel ne trouve pas la variable `APP_KEY` qui est **obligatoire** pour le chiffrement des données.

---

## 🔑 Variables Obligatoires

### 1. APP_KEY (CRITIQUE - Laravel)

**C'est différent de API_KEY!**

```bash
# Générer localement
php artisan key:generate --show
```

Résultat (exemple) :
```
base64:dDBZm4V1HM3DKTUrq8e/x4XVh1P5GBv3SpfAR9Fb9no=
```

**Sur Railway, ajoutez :**
```
APP_KEY=base64:dDBZm4V1HM3DKTUrq8e/x4XVh1P5GBv3SpfAR9Fb9no=
```

⚠️ **Important** : Incluez bien le préfixe `base64:`

---

## 📋 Liste Complète des Variables pour Railway

### Configuration Application

```env
# Application
APP_NAME=Bsissa
APP_ENV=production
APP_KEY=base64:VotreCléGénéréeIci=
APP_DEBUG=false
APP_TIMEZONE=Africa/Tunis
APP_URL=https://votre-app.up.railway.app

# Locale
APP_LOCALE=fr
APP_FALLBACK_LOCALE=fr
APP_FAKER_LOCALE=fr_FR
```

### Base de Données MySQL

Railway fournit automatiquement ces variables. **Ne les modifiez pas manuellement** :

```env
# MySQL (Automatiques sur Railway)
MYSQL_HOST=${MYSQLHOST}
MYSQL_PORT=${MYSQLPORT}
MYSQL_DATABASE=${MYSQLDATABASE}
MYSQL_USER=${MYSQLUSER}
MYSQL_PASSWORD=${MYSQLPASSWORD}

# Laravel DB Config (À configurer)
DB_CONNECTION=mysql
DB_HOST=${MYSQLHOST}
DB_PORT=${MYSQLPORT}
DB_DATABASE=${MYSQLDATABASE}
DB_USERNAME=${MYSQLUSER}
DB_PASSWORD=${MYSQLPASSWORD}
```

### Cache & Sessions

```env
# Cache
CACHE_STORE=database
CACHE_PREFIX=bsissa_cache

# Session
SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null
SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE=lax

# Queue
QUEUE_CONNECTION=database
```

### Mail (Optionnel)

```env
# Mailtrap (Dev)
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=votre_username
MAIL_PASSWORD=votre_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@bsissa.tn
MAIL_FROM_NAME="Bsissa"

# Ou Gmail (Production)
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=votre@gmail.com
MAIL_PASSWORD=votre_app_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=contact@bsissa.tn
MAIL_FROM_NAME="Bsissa"
```

### API Keys (Optionnel)

```env
# Votre API personnalisée (si vous en avez besoin)
API_KEY=f8c10a4ab43468e6ea4ba904959f4f6765f4c6f2f718f8a1d9a347a92f625dc7
```

### Debugbar (Important pour Production)

```env
# DÉSACTIVER en production!
DEBUGBAR_ENABLED=false
```

### Vite/Assets

```env
# Vite
VITE_APP_NAME="${APP_NAME}"
```

---

## 🚀 Procédure d'Installation sur Railway

### Étape 1 : Générer APP_KEY Localement

```bash
# Dans votre projet local
php artisan key:generate --show
```

Copiez le résultat (avec `base64:`)

### Étape 2 : Ajouter sur Railway

1. Aller sur Railway Dashboard
2. Sélectionner votre projet
3. Onglet **"Variables"**
4. Cliquer **"New Variable"**
5. Ajouter chaque variable

**Variables Minimales Obligatoires :**

```env
APP_NAME=Bsissa
APP_ENV=production
APP_KEY=base64:VotreCléIci=
APP_DEBUG=false
APP_URL=https://votre-app.up.railway.app

DB_CONNECTION=mysql
DB_HOST=${MYSQLHOST}
DB_PORT=${MYSQLPORT}
DB_DATABASE=${MYSQLDATABASE}
DB_USERNAME=${MYSQLUSER}
DB_PASSWORD=${MYSQLPASSWORD}

CACHE_STORE=database
SESSION_DRIVER=database
QUEUE_CONNECTION=database

DEBUGBAR_ENABLED=false
```

### Étape 3 : Redéployer

Railway va automatiquement redéployer après l'ajout des variables.

---

## 🔍 Vérification

### Sur Railway (Logs)

Surveillez les logs dans Railway :
```
✓ Application key found
✓ Database connection established
✓ Migrations run successfully
```

### Via Artisan (SSH si disponible)

```bash
# Tester la connexion DB
php artisan tinker
>>> DB::connection()->getPdo()

# Vérifier APP_KEY
php artisan tinker
>>> config('app.key')
```

---

## 🐛 Dépannage

### Erreur : "No application encryption key has been specified"

**Cause** : Variable `APP_KEY` manquante ou invalide

**Solution** :
```bash
# 1. Générer localement
php artisan key:generate --show

# 2. Copier le résultat complet (avec base64:)
# 3. L'ajouter sur Railway comme APP_KEY
# 4. Redéployer
```

### Erreur : "SQLSTATE[HY000] [2002] Connection refused"

**Cause** : Variables de base de données incorrectes

**Solution** :
```env
# Vérifiez que vous utilisez bien les variables Railway
DB_HOST=${MYSQLHOST}
DB_PORT=${MYSQLPORT}
DB_DATABASE=${MYSQLDATABASE}
DB_USERNAME=${MYSQLUSER}
DB_PASSWORD=${MYSQLPASSWORD}
```

### Erreur : "The stream or file could not be opened"

**Cause** : Permissions sur storage/

**Solution** : Ajoutez dans `railway.toml` ou Nixpacks config :
```bash
chmod -R 775 storage bootstrap/cache
```

### Build réussit mais site ne s'affiche pas

**Vérifications** :
1. `APP_DEBUG=false` en production
2. `APP_ENV=production`
3. `APP_URL` correspond à votre URL Railway
4. Assets buildés : `npm run build`

---

## 📝 Template Complet Railway

Copiez ce template et remplacez les valeurs :

```env
# ============================================================================
# BSISSA - Configuration Railway Production
# ============================================================================

# Application
APP_NAME=Bsissa
APP_ENV=production
APP_KEY=base64:GENERER_AVEC_php_artisan_key_generate_show
APP_DEBUG=false
APP_TIMEZONE=Africa/Tunis
APP_URL=https://votre-projet.up.railway.app

# Locale
APP_LOCALE=fr
APP_FALLBACK_LOCALE=fr
APP_FAKER_LOCALE=fr_FR

# Database (Utilise les variables Railway)
DB_CONNECTION=mysql
DB_HOST=${MYSQLHOST}
DB_PORT=${MYSQLPORT}
DB_DATABASE=${MYSQLDATABASE}
DB_USERNAME=${MYSQLUSER}
DB_PASSWORD=${MYSQLPASSWORD}

# Cache & Sessions
CACHE_STORE=database
CACHE_PREFIX=bsissa_cache
SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_SECURE_COOKIE=true
QUEUE_CONNECTION=database

# Mail (Optionnel - Configurer selon votre service)
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=votre@email.com
MAIL_PASSWORD=votre_mot_de_passe_app
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=contact@bsissa.tn
MAIL_FROM_NAME="Bsissa"

# Debug (DÉSACTIVER en production!)
DEBUGBAR_ENABLED=false
LOG_CHANNEL=stack
LOG_LEVEL=error

# Vite
VITE_APP_NAME="${APP_NAME}"

# API Key personnalisée (Optionnel)
API_KEY=f8c10a4ab43468e6ea4ba904959f4f6765f4c6f2f718f8a1d9a347a92f625dc7
```

---

## 🔐 Sécurité

### ✅ À FAIRE

- ✓ Générer une nouvelle `APP_KEY` unique pour production
- ✓ Utiliser `APP_DEBUG=false` en production
- ✓ Activer `SESSION_SECURE_COOKIE=true`
- ✓ Désactiver `DEBUGBAR_ENABLED=false`
- ✓ Utiliser HTTPS uniquement (`APP_URL` avec https://)

### ❌ À NE PAS FAIRE

- ❌ Réutiliser la même `APP_KEY` que dev
- ❌ Activer `APP_DEBUG=true` en production
- ❌ Committer les variables dans git
- ❌ Partager les clés publiquement

---

## 📞 Commandes Utiles

### Générer APP_KEY

```bash
# Afficher sans modifier .env
php artisan key:generate --show

# Générer et mettre à jour .env (local uniquement)
php artisan key:generate
```

### Vérifier Configuration

```bash
# Afficher toute la config
php artisan config:show

# Config spécifique
php artisan config:show app
php artisan config:show database
```

### Clear Cache (si besoin)

```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
```

---

**✅ Checklist Finale**

- [ ] `APP_KEY` généré avec `php artisan key:generate --show`
- [ ] `APP_KEY` ajouté sur Railway (avec `base64:`)
- [ ] `APP_DEBUG=false`
- [ ] `APP_ENV=production`
- [ ] Variables DB utilisant `${MYSQLHOST}`, etc.
- [ ] `DEBUGBAR_ENABLED=false`
- [ ] Application redéployée
- [ ] Logs vérifiés (pas d'erreur)
- [ ] Site accessible

---

**Version** : 1.0
**Dernière mise à jour** : 16 novembre 2025
