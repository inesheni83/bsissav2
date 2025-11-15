# Guide de Déploiement Railway - BSISSA

## 📋 Prérequis

- [ ] Compte GitHub (gratuit)
- [ ] Compte Railway (gratuit - railway.app)
- [ ] Git installé sur votre machine
- [ ] Code pushé sur GitHub

---

## 🚀 Étape 1 : Préparation du Projet

### 1.1 Initialiser Git (si pas déjà fait)

```bash
git init
git add .
git commit -m "Initial commit"
```

### 1.2 Créer un dépôt GitHub

1. Allez sur github.com
2. Cliquez sur "New repository"
3. Nommez votre dépôt (ex: `bsissa`)
4. Ne cochez PAS "Initialize with README"
5. Cliquez "Create repository"

### 1.3 Pusher votre code

```bash
git remote add origin https://github.com/VOTRE-USERNAME/bsissa.git
git branch -M main
git push -u origin main
```

---

## 🛤️ Étape 2 : Configuration Railway

### 2.1 Créer un compte Railway

1. Allez sur [railway.app](https://railway.app)
2. Cliquez "Login" puis "Login with GitHub"
3. Autorisez Railway à accéder à votre GitHub

### 2.2 Créer un nouveau projet

1. Cliquez "New Project"
2. Sélectionnez "Deploy from GitHub repo"
3. Autorisez l'accès à vos repos si demandé
4. Sélectionnez le repo `bsissa`

---

## 🗄️ Étape 3 : Ajouter une Base de Données

### 3.1 Ajouter PostgreSQL

1. Dans votre projet Railway, cliquez "New" → "Database" → "Add PostgreSQL"
2. Railway va automatiquement créer une base de données
3. Les variables d'environnement seront auto-configurées

---

## ⚙️ Étape 4 : Configuration des Variables d'Environnement

### 4.1 Accéder aux variables

1. Cliquez sur votre service (bsissa)
2. Allez dans l'onglet "Variables"

### 4.2 Ajouter les variables essentielles

Cliquez "Raw Editor" et collez :

```env
APP_NAME=BSISSA
APP_ENV=production
APP_DEBUG=false
APP_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}

LOG_CHANNEL=stack
LOG_LEVEL=error

DB_CONNECTION=pgsql
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_DATABASE=${{Postgres.PGDATABASE}}
DB_USERNAME=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}

SESSION_DRIVER=database
SESSION_LIFETIME=120
BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local
QUEUE_CONNECTION=database
CACHE_STORE=database

MAIL_MAILER=log
VITE_APP_NAME="${APP_NAME}"
```

### 4.3 Générer APP_KEY

1. Dans les variables, ajoutez manuellement :
2. Variable : `APP_KEY`
3. Valeur : Vous allez la générer dans l'étape suivante

---

## 🔧 Étape 5 : Premier Déploiement

### 5.1 Railway va automatiquement :

- ✅ Détecter votre projet Laravel
- ✅ Installer les dépendances PHP (composer)
- ✅ Installer les dépendances Node (npm)
- ✅ Construire les assets (npm run build)
- ✅ Lancer les migrations

### 5.2 Surveiller le déploiement

1. Allez dans l'onglet "Deployments"
2. Cliquez sur le déploiement en cours
3. Regardez les logs en temps réel

---

## 🔑 Étape 6 : Générer APP_KEY

### 6.1 Une fois le premier déploiement terminé :

1. Allez dans l'onglet "Settings"
2. Descendez jusqu'à "Environment"
3. Cliquez "Add Shell"
4. Dans le terminal qui s'ouvre, tapez :

```bash
php artisan key:generate --show
```

5. Copiez la clé générée (ex: `base64:xxxxxxxxxxxxx`)
6. Retournez dans "Variables"
7. Modifiez `APP_KEY` avec cette valeur
8. Le service va redémarrer automatiquement

---

## 🌐 Étape 7 : Générer le Domaine Public

### 7.1 Activer le domaine

1. Allez dans l'onglet "Settings"
2. Section "Networking"
3. Cliquez "Generate Domain"
4. Railway va créer une URL du type : `bsissa-production.up.railway.app`

### 7.2 Mettre à jour APP_URL

1. Retournez dans "Variables"
2. Modifiez `APP_URL` avec votre nouveau domaine :
   ```
   APP_URL=https://bsissa-production.up.railway.app
   ```

---

## ✅ Étape 8 : Vérification

### 8.1 Tester votre site

1. Ouvrez l'URL générée dans votre navigateur
2. Vérifiez que le site fonctionne

### 8.2 Vérifier les migrations

Dans le shell Railway :

```bash
php artisan migrate:status
```

### 8.3 Vérifier les logs

```bash
php artisan log:tail
```

---

## 🔄 Déploiements Futurs

### Déploiement automatique

Chaque fois que vous poussez du code sur GitHub :

```bash
git add .
git commit -m "Description des changements"
git push
```

Railway va automatiquement :
1. Détecter le nouveau commit
2. Redéployer votre application
3. Exécuter les migrations

---

## 🛠️ Commandes Utiles Railway

### Accéder au shell

1. Settings → Environment → Add Shell

### Commandes Laravel utiles :

```bash
# Vider le cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Exécuter des migrations
php artisan migrate --force

# Créer un utilisateur admin (si vous avez un seeder)
php artisan db:seed --class=AdminSeeder

# Vérifier l'état de l'app
php artisan about
```

---

## 📊 Monitoring et Logs

### Voir les logs en temps réel

1. Onglet "Deployments"
2. Cliquez sur un déploiement
3. Onglet "Logs"

### Métriques

- Onglet "Metrics" pour voir :
  - Utilisation CPU
  - Utilisation mémoire
  - Requêtes réseau

---

## ⚠️ Troubleshooting

### Erreur 500

1. Vérifiez que `APP_KEY` est bien configuré
2. Vérifiez les logs dans Railway
3. Assurez-vous que `APP_DEBUG=false` en production

### Erreur de connexion DB

1. Vérifiez que PostgreSQL est bien ajouté
2. Vérifiez les variables `DB_*`
3. Utilisez les références : `${{Postgres.PGHOST}}`

### Assets non chargés

1. Vérifiez que `npm run build` s'est exécuté
2. Vérifiez `APP_URL` dans les variables
3. Exécutez : `php artisan storage:link`

### Migration échoue

Dans le shell Railway :
```bash
php artisan migrate:fresh --force --seed
```

---

## 💡 Astuces

### 1. Domaine personnalisé (gratuit)

Railway vous permet d'utiliser votre propre domaine :
1. Settings → Networking → Custom Domain
2. Ajoutez votre domaine
3. Configurez le DNS chez votre registrar

### 2. Sauvegardes de la base de données

Installez Railway CLI :
```bash
npm i -g @railway/cli
railway login
railway run pg_dump > backup.sql
```

### 3. Variables d'environnement par service

- Créez des variables spécifiques pour production
- Utilisez les références Railway : `${{SERVICE.VARIABLE}}`

### 4. Optimisation

Dans le shell Railway :
```bash
php artisan optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## 📞 Support

- **Documentation Railway** : docs.railway.app
- **Discord Railway** : discord.gg/railway
- **Logs** : Toujours dans l'onglet "Deployments"

---

## 🎉 Félicitations !

Votre application Laravel est maintenant déployée sur Railway !

**URL de votre site** : https://[votre-domaine].up.railway.app

**Prochaines étapes** :
- [ ] Configurer un domaine personnalisé
- [ ] Ajouter un service de mail (Mailtrap, SendGrid)
- [ ] Configurer le stockage de fichiers (S3, Cloudinary)
- [ ] Mettre en place des sauvegardes automatiques
