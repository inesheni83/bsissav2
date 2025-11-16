# 🚀 Guide de Démarrage Rapide - Base de Données

## En 3 étapes simples

### ⚡ Méthode 1 : Ultra-Rapide (Ligne de Commande)

```bash
# 1️⃣ Créer la base de données et importer le schéma
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS bsissa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p bsissa < database/schema.sql

# 2️⃣ Configurer Laravel (.env)
# Mettez à jour ces lignes dans votre fichier .env :
DB_DATABASE=bsissa
DB_USERNAME=root
DB_PASSWORD=votre_mot_de_passe

# 3️⃣ Vérifier que tout fonctionne
php artisan migrate:status
```

### 🖱️ Méthode 2 : Script Automatique

**Windows :**
```cmd
database\setup-database.bat bsissa root votre_mot_de_passe
```

**Linux/macOS :**
```bash
chmod +x database/setup-database.sh
./database/setup-database.sh bsissa root votre_mot_de_passe
```

### 🌐 Méthode 3 : phpMyAdmin (Interface Graphique)

1. Ouvrez **phpMyAdmin** : http://localhost/phpmyadmin
2. Cliquez sur **"Nouvelle base de données"**
3. Nom : `bsissa` | Interclassement : `utf8mb4_unicode_ci`
4. Sélectionnez la base → Onglet **"Importer"**
5. Choisissez `database/schema.sql` → **"Exécuter"**

---

## 📊 Résultat Attendu

Après l'exécution, vous devriez avoir **18 tables** :

```
✅ users                    ✅ orders
✅ categories              ✅ order_status_history
✅ products                ✅ cart_items
✅ product_variants        ✅ delivery_fees
✅ product_weight_variants ✅ invoices
✅ notifications           ✅ site_settings
✅ sessions                ✅ cache
✅ password_reset_tokens   ✅ cache_locks
✅ jobs                    ✅ job_batches
✅ failed_jobs
```

---

## ✅ Vérification

```bash
# Compter les tables (doit afficher 18)
mysql -u root -p bsissa -e "SHOW TABLES;" | wc -l

# Lister toutes les tables
mysql -u root -p bsissa -e "SHOW TABLES;"

# Tester avec Laravel
php artisan tinker
>>> \DB::table('users')->count()
```

---

## 🆘 Problèmes Courants

| Erreur | Solution |
|--------|----------|
| `Access denied` | Vérifiez username/password MySQL |
| `Database exists` | C'est OK! Le script utilise `IF NOT EXISTS` |
| `Can't connect` | Démarrez MySQL : `sudo service mysql start` |
| `Command not found` | Ajoutez MySQL au PATH ou utilisez le chemin complet |

---

## 📚 Documentation Complète

- **Guide détaillé** : [database/README.md](database/README.md)
- **Schéma complet** : [DATABASE_SCHEMA_DOCUMENTATION.md](DATABASE_SCHEMA_DOCUMENTATION.md)
- **Script SQL** : [database/schema.sql](database/schema.sql)

---

**Besoin d'aide ?** Consultez la section Dépannage dans `database/README.md`
