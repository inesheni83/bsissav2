# 📋 Aide-Mémoire des Commandes - Base de Données Bsissa

## 🚀 Installation

### Méthode Automatique

```bash
# Linux/macOS/WSL
chmod +x database/setup-database.sh database/verify-database.sh
./database/setup-database.sh bsissa root mot_de_passe

# Windows
database\setup-database.bat bsissa root mot_de_passe
```

### Méthode Manuelle MySQL

```bash
# Créer et importer en une commande
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS bsissa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p bsissa < database/schema.sql

# Ou interactivement
mysql -u root -p
CREATE DATABASE bsissa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bsissa;
SOURCE database/schema.sql;
SHOW TABLES;
EXIT;
```

---

## ✅ Vérification

```bash
# Script de vérification automatique
./database/verify-database.sh bsissa root mot_de_passe

# Compter les tables (doit retourner 18)
mysql -u root -p bsissa -e "SHOW TABLES;" | wc -l

# Lister toutes les tables
mysql -u root -p bsissa -e "SHOW TABLES;"

# Voir la structure d'une table
mysql -u root -p bsissa -e "DESCRIBE users;"

# Compter les enregistrements d'une table
mysql -u root -p bsissa -e "SELECT COUNT(*) FROM products;"
```

---

## 🔧 Configuration Laravel

```bash
# Copier l'exemple de configuration
cp database/.env.database.example .env.local

# Vérifier la connexion Laravel
php artisan config:clear
php artisan tinker
>>> DB::connection()->getPdo();
>>> DB::table('users')->count();

# Vérifier le statut des migrations
php artisan migrate:status

# Lancer les migrations Laravel (si nécessaire)
php artisan migrate

# Populer avec des données de test
php artisan db:seed
```

---

## 🗃️ Opérations de Base

### Connexion MySQL

```bash
# Connexion locale
mysql -u root -p

# Connexion à une base spécifique
mysql -u root -p bsissa

# Connexion distante
mysql -h host.example.com -u username -p database_name

# Connexion avec commande inline
mysql -u root -p -e "SHOW DATABASES;"
```

### Gestion de Base de Données

```bash
# Créer une base de données
mysql -u root -p -e "CREATE DATABASE bsissa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Supprimer une base de données (ATTENTION!)
mysql -u root -p -e "DROP DATABASE IF EXISTS bsissa;"

# Lister toutes les bases de données
mysql -u root -p -e "SHOW DATABASES;"

# Voir la taille des bases de données
mysql -u root -p -e "SELECT table_schema AS 'Database', ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)' FROM information_schema.tables GROUP BY table_schema;"
```

---

## 💾 Sauvegarde & Restauration

### Sauvegarde

```bash
# Sauvegarde complète
mysqldump -u root -p bsissa > backup_$(date +%Y%m%d_%H%M%S).sql

# Sauvegarde avec compression
mysqldump -u root -p bsissa | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz

# Sauvegarde d'une seule table
mysqldump -u root -p bsissa users > backup_users_$(date +%Y%m%d).sql

# Sauvegarde de la structure seulement (sans données)
mysqldump -u root -p --no-data bsissa > schema_only.sql

# Sauvegarde des données seulement (sans structure)
mysqldump -u root -p --no-create-info bsissa > data_only.sql

# Sauvegarde avec routines et triggers
mysqldump -u root -p --routines --triggers bsissa > full_backup.sql
```

### Restauration

```bash
# Restauration complète
mysql -u root -p bsissa < backup_20251116_120000.sql

# Restauration depuis fichier compressé
gunzip < backup_20251116_120000.sql.gz | mysql -u root -p bsissa

# Restauration d'une table spécifique
mysql -u root -p bsissa < backup_users_20251116.sql

# Restauration avec création de DB
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS bsissa;"
mysql -u root -p bsissa < backup.sql
```

---

## 🔍 Requêtes Utiles

### Informations sur la Base

```bash
# Version MySQL
mysql -u root -p -e "SELECT VERSION();"

# Variables de configuration
mysql -u root -p -e "SHOW VARIABLES LIKE '%version%';"

# Statut du serveur
mysql -u root -p -e "SHOW STATUS;"

# Taille de chaque table
mysql -u root -p bsissa -e "SELECT table_name AS 'Table', ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)' FROM information_schema.TABLES WHERE table_schema = 'bsissa' ORDER BY (data_length + index_length) DESC;"

# Nombre d'enregistrements par table
mysql -u root -p bsissa -e "SELECT table_name, table_rows FROM information_schema.tables WHERE table_schema = 'bsissa' ORDER BY table_rows DESC;"
```

### Structure et Contraintes

```bash
# Lister toutes les clés étrangères
mysql -u root -p bsissa -e "SELECT TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE REFERENCED_TABLE_SCHEMA = 'bsissa';"

# Lister tous les index
mysql -u root -p bsissa -e "SELECT TABLE_NAME, INDEX_NAME, GROUP_CONCAT(COLUMN_NAME ORDER BY SEQ_IN_INDEX) AS COLUMNS FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = 'bsissa' GROUP BY TABLE_NAME, INDEX_NAME;"

# Voir les contraintes d'une table
mysql -u root -p bsissa -e "SHOW CREATE TABLE users\G"
```

---

## 👥 Gestion des Utilisateurs

```bash
# Créer un utilisateur MySQL dédié
mysql -u root -p << EOF
CREATE USER 'bsissa_user'@'localhost' IDENTIFIED BY 'mot_de_passe_fort';
GRANT ALL PRIVILEGES ON bsissa.* TO 'bsissa_user'@'localhost';
FLUSH PRIVILEGES;
EOF

# Voir les utilisateurs existants
mysql -u root -p -e "SELECT User, Host FROM mysql.user;"

# Voir les privilèges d'un utilisateur
mysql -u root -p -e "SHOW GRANTS FOR 'bsissa_user'@'localhost';"

# Révoquer les privilèges
mysql -u root -p -e "REVOKE ALL PRIVILEGES ON bsissa.* FROM 'bsissa_user'@'localhost';"

# Supprimer un utilisateur
mysql -u root -p -e "DROP USER 'bsissa_user'@'localhost';"
```

---

## 🧹 Maintenance

```bash
# Optimiser toutes les tables
mysql -u root -p bsissa -e "SELECT CONCAT('OPTIMIZE TABLE ', table_name, ';') FROM information_schema.tables WHERE table_schema = 'bsissa';" | mysql -u root -p bsissa

# Réparer une table
mysql -u root -p bsissa -e "REPAIR TABLE users;"

# Analyser une table
mysql -u root -p bsissa -e "ANALYZE TABLE products;"

# Vérifier l'intégrité
mysql -u root -p bsissa -e "CHECK TABLE orders;"

# Vider une table (ATTENTION!)
mysql -u root -p bsissa -e "TRUNCATE TABLE cart_items;"
```

---

## 🔄 Réinitialisation

```bash
# Réinitialisation complète
mysql -u root -p << EOF
DROP DATABASE IF EXISTS bsissa;
CREATE DATABASE bsissa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bsissa;
SOURCE database/schema.sql;
EOF

# Avec script
./database/setup-database.sh bsissa root mot_de_passe
./database/verify-database.sh bsissa root mot_de_passe

# Via Laravel (migrations)
php artisan migrate:fresh
php artisan db:seed
```

---

## 🐛 Debugging

```bash
# Voir les erreurs MySQL
mysql -u root -p -e "SHOW ERRORS;"

# Voir les warnings
mysql -u root -p -e "SHOW WARNINGS;"

# Activer le logging des requêtes
mysql -u root -p -e "SET GLOBAL general_log = 'ON';"
mysql -u root -p -e "SET GLOBAL general_log_file = '/tmp/mysql.log';"

# Voir les processus en cours
mysql -u root -p -e "SHOW PROCESSLIST;"

# Tuer un processus
mysql -u root -p -e "KILL [process_id];"

# Voir les variables de configuration
mysql -u root -p -e "SHOW VARIABLES;"
```

---

## 📊 Performance

```bash
# Voir le cache de requêtes
mysql -u root -p -e "SHOW STATUS LIKE 'Qcache%';"

# Statistiques des tables
mysql -u root -p bsissa -e "SHOW TABLE STATUS\G"

# Analyser une requête
mysql -u root -p bsissa -e "EXPLAIN SELECT * FROM products WHERE category_id = 1;"

# Voir les index utilisés
mysql -u root -p bsissa -e "SHOW INDEX FROM products;"
```

---

## 🔐 Sécurité

```bash
# Changer le mot de passe root
mysql -u root -p -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'nouveau_mot_de_passe';"

# Voir les connexions actives
mysql -u root -p -e "SELECT user, host, db, command FROM information_schema.processlist;"

# Limiter les connexions par utilisateur
mysql -u root -p -e "ALTER USER 'bsissa_user'@'localhost' WITH MAX_CONNECTIONS_PER_HOUR 100;"
```

---

## 📱 Railway/Production

```bash
# Se connecter à Railway MySQL
mysql -h ${MYSQLHOST} -u ${MYSQLUSER} -p${MYSQLPASSWORD} ${MYSQLDATABASE}

# Importer sur Railway
mysql -h ${MYSQLHOST} -u ${MYSQLUSER} -p${MYSQLPASSWORD} ${MYSQLDATABASE} < database/schema.sql

# Vérifier sur Railway
mysql -h ${MYSQLHOST} -u ${MYSQLUSER} -p${MYSQLPASSWORD} ${MYSQLDATABASE} -e "SHOW TABLES;"
```

---

## 💡 Astuces

```bash
# Exécuter plusieurs commandes
mysql -u root -p bsissa << EOF
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM products;
SELECT COUNT(*) FROM orders;
EOF

# Exporter en CSV
mysql -u root -p bsissa -e "SELECT * FROM products;" | sed 's/\t/,/g' > products.csv

# Importer CSV
mysql -u root -p bsissa -e "LOAD DATA LOCAL INFILE 'products.csv' INTO TABLE products FIELDS TERMINATED BY ',' LINES TERMINATED BY '\n';"

# Batch insert
mysql -u root -p bsissa -e "INSERT INTO users (name, email, password) VALUES ('John', 'john@example.com', 'hash'), ('Jane', 'jane@example.com', 'hash');"
```

---

**💾 Sauvegardez ce fichier comme référence rapide!**
