# Bsissa Database Setup Guide

Ce répertoire contient tous les scripts nécessaires pour créer et configurer la base de données MySQL de l'application Bsissa.

## 📁 Fichiers Disponibles

- **`schema.sql`** - Script SQL complet pour créer toutes les tables (19 KB)
- **`setup-database.sh`** - Script d'installation automatique (Linux/macOS)
- **`setup-database.bat`** - Script d'installation automatique (Windows)
- **`README.md`** - Ce guide d'utilisation

## 🗄️ Structure de la Base de Données

La base de données contient **18 tables** organisées en 6 catégories :

### 1. Authentification & Sessions (4 tables)
- `users` - Comptes utilisateurs avec rôles (admin, vendeur, client)
- `password_reset_tokens` - Tokens de réinitialisation de mot de passe
- `sessions` - Gestion des sessions utilisateur
- `cache` & `cache_locks` - Système de cache Laravel

### 2. Gestion des Produits (4 tables)
- `products` - Catalogue de produits avec informations nutritionnelles
- `categories` - Catégories de produits
- `product_variants` - Variantes de couleur/taille
- `product_weight_variants` - Variantes de poids (prix et stock)

### 3. Shopping & Commandes (4 tables)
- `cart_items` - Paniers d'achat (invités et utilisateurs)
- `orders` - Gestion complète des commandes
- `delivery_fees` - Configuration des frais de livraison
- `order_status_history` - Historique des changements de statut

### 4. Financier (2 tables)
- `invoices` - Génération de factures avec TVA (19% par défaut pour la Tunisie)
- `notifications` - Système de notifications polymorphes

### 5. Traitement en Arrière-plan (3 tables)
- `jobs`, `job_batches`, `failed_jobs` - Système de queue Laravel

### 6. Configuration (1 table)
- `site_settings` - Paramètres du site (branding, réseaux sociaux)

## 🚀 Installation Rapide

### Option 1 : Script Automatique (Linux/macOS)

```bash
# Rendre le script exécutable
chmod +x database/setup-database.sh

# Exécution avec valeurs par défaut
./database/setup-database.sh

# Ou avec paramètres personnalisés
./database/setup-database.sh nom_db utilisateur mot_de_passe localhost
```

### Option 2 : Script Automatique (Windows)

```cmd
# Double-cliquez sur le fichier ou exécutez dans CMD
database\setup-database.bat

# Avec paramètres personnalisés
database\setup-database.bat nom_db utilisateur mot_de_passe localhost
```

### Option 3 : Installation Manuelle (MySQL CLI)

```bash
# 1. Se connecter à MySQL
mysql -u root -p

# 2. Créer la base de données
CREATE DATABASE bsissa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 3. Sélectionner la base de données
USE bsissa;

# 4. Importer le schéma
SOURCE database/schema.sql;

# 5. Vérifier les tables
SHOW TABLES;
```

### Option 4 : Importation directe

```bash
# En une seule commande
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS bsissa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p bsissa < database/schema.sql
```

### Option 5 : Via phpMyAdmin

1. Ouvrir phpMyAdmin dans votre navigateur
2. Créer une nouvelle base de données nommée `bsissa`
3. Sélectionner l'onglet "Importer"
4. Choisir le fichier `database/schema.sql`
5. Cliquer sur "Exécuter"

## ⚙️ Configuration Laravel

Après l'installation de la base de données, configurez votre fichier `.env` :

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=bsissa
DB_USERNAME=root
DB_PASSWORD=votre_mot_de_passe
```

Vérifiez ensuite que Laravel peut se connecter :

```bash
# Vérifier le statut des migrations
php artisan migrate:status

# Tester la connexion
php artisan tinker
>>> DB::connection()->getPdo();
```

## 🌱 Données de Test (Optionnel)

Si vous souhaitez peupler la base avec des données de test :

```bash
# Exécuter les seeders
php artisan db:seed

# Ou seeders spécifiques
php artisan db:seed --class=UserSeeder
php artisan db:seed --class=ProductSeeder
```

## 📊 Informations Techniques

### Caractéristiques Principales

- **Moteur** : InnoDB
- **Charset** : utf8mb4
- **Collation** : utf8mb4_unicode_ci
- **Total Colonnes** : 200+
- **Clés Étrangères** : 30+
- **Index** : 40+ (pour optimisation des performances)

### Contraintes d'Intégrité

Le schéma inclut :
- ✅ Clés étrangères avec CASCADE/SET NULL
- ✅ Contraintes UNIQUE pour éviter les doublons
- ✅ Valeurs par défaut appropriées
- ✅ Timestamps automatiques
- ✅ Champs JSON pour données complexes
- ✅ Types ENUM pour les statuts

### Index de Performance

Des index ont été créés pour optimiser :
- 🔍 Recherche de produits par nom/catégorie
- 📱 Recherche d'utilisateurs par email/téléphone
- 📦 Filtrage de commandes par statut/utilisateur
- 🏷️ Requêtes sur les variantes de poids
- 📊 Rapports et analytics

## 🔧 Maintenance

### Sauvegarder la Base de Données

```bash
# Sauvegarde complète
mysqldump -u root -p bsissa > backup_$(date +%Y%m%d).sql

# Sauvegarde avec compression
mysqldump -u root -p bsissa | gzip > backup_$(date +%Y%m%d).sql.gz
```

### Restaurer depuis une Sauvegarde

```bash
# Restauration simple
mysql -u root -p bsissa < backup_20251116.sql

# Restauration depuis fichier compressé
gunzip < backup_20251116.sql.gz | mysql -u root -p bsissa
```

### Réinitialiser la Base de Données

```bash
# Via Laravel (recommandé)
php artisan migrate:fresh

# Ou manuellement
mysql -u root -p -e "DROP DATABASE IF EXISTS bsissa;"
mysql -u root -p -e "CREATE DATABASE bsissa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p bsissa < database/schema.sql
```

## 🐛 Dépannage

### Erreur : "Access denied for user"
```bash
# Vérifiez vos identifiants MySQL
mysql -u root -p
```

### Erreur : "Unknown database"
```bash
# Créez d'abord la base de données
mysql -u root -p -e "CREATE DATABASE bsissa;"
```

### Erreur : "Table already exists"
```bash
# Le script utilise IF NOT EXISTS, mais vous pouvez forcer :
mysql -u root -p -e "DROP DATABASE IF EXISTS bsissa; CREATE DATABASE bsissa;"
mysql -u root -p bsissa < database/schema.sql
```

### Erreur : Foreign Key Constraint
```bash
# Le script désactive temporairement les vérifications
# Si problème persiste, vérifiez l'ordre des tables
```

## 📝 Notes Importantes

1. **Environnement de Production** : Utilisez des identifiants MySQL sécurisés
2. **Sauvegardes** : Configurez des sauvegardes automatiques régulières
3. **Permissions** : L'utilisateur MySQL doit avoir les privilèges CREATE, INSERT, ALTER
4. **Version MySQL** : Le script est compatible avec MySQL 5.7+ et MariaDB 10.2+

## 🔗 Ressources Supplémentaires

- [Documentation complète du schéma](../DATABASE_SCHEMA_DOCUMENTATION.md)
- [Documentation Laravel Migrations](https://laravel.com/docs/migrations)
- [Documentation MySQL](https://dev.mysql.com/doc/)

## 📞 Support

Pour toute question ou problème :
1. Consultez la documentation complète dans `DATABASE_SCHEMA_DOCUMENTATION.md`
2. Vérifiez les logs Laravel : `storage/logs/laravel.log`
3. Contactez l'équipe de développement

---

**Version** : 1.0
**Dernière mise à jour** : 16 novembre 2025
**Compatibilité** : MySQL 5.7+, MariaDB 10.2+
