# ✅ Checklist Post-Déploiement Railway

## 🎯 À Faire Immédiatement Après le Déploiement

### 1. Ajouter la Variable ASSET_URL

Railway Dashboard → Variables → New Variable

```env
Variable: ASSET_URL
Valeur: https://votre-app.up.railway.app
```

⚠️ **Important** : Remplacez par votre vraie URL Railway

### 2. Vérifier Toutes les Variables Obligatoires

```env
# Application (OBLIGATOIRE)
APP_NAME=Bsissa
APP_ENV=production
APP_KEY=base64:VotreCléGénérée=
APP_DEBUG=false
APP_URL=https://votre-app.up.railway.app
APP_TIMEZONE=Africa/Tunis

# Assets (CRITIQUE POUR LE PROBLÈME CSS/JS)
ASSET_URL=https://votre-app.up.railway.app

# Database (OBLIGATOIRE)
DB_CONNECTION=mysql
DB_HOST=${MYSQLHOST}
DB_PORT=${MYSQLPORT}
DB_DATABASE=${MYSQLDATABASE}
DB_USERNAME=${MYSQLUSER}
DB_PASSWORD=${MYSQLPASSWORD}

# Cache & Sessions
CACHE_STORE=database
SESSION_DRIVER=database
QUEUE_CONNECTION=database

# Sécurité (IMPORTANT)
DEBUGBAR_ENABLED=false
SESSION_SECURE_COOKIE=true
LOG_LEVEL=error

# Locale
APP_LOCALE=fr
APP_FALLBACK_LOCALE=fr
```

---

## 🔍 Vérifications Après Redéploiement

### Étape 1 : Surveiller les Logs de Build

Railway → Deployments → Logs

**Vérifier que ces lignes apparaissent :**

```bash
✓ npm ci --include=dev
✓ npm run build
✓ vite v7.1.5 building for production...
✓ transforming...
✓ ✓ 3391 modules transformed
✓ rendering chunks...
✓ computing gzip size...
✓ ✓ built in 16.53s
✓ chmod -R 755 public/build
✓ php artisan config:cache
✓ Configuration cache cleared successfully
✓ Configuration cached successfully
```

**🚨 Si vous voyez des erreurs :**

```bash
❌ npm: command not found
→ Problème avec nixpacks.toml

❌ vite: command not found
→ devDependencies non installées
→ Vérifier: npm ci --include=dev

❌ ENOENT: no such file or directory
→ Problème de permissions
→ Vérifier: chmod commands
```

### Étape 2 : Vérifier le Déploiement Réussi

Railway → Deployments

État attendu : **✅ Deployed**

### Étape 3 : Tester l'Accès au Site

Ouvrir votre URL Railway dans le navigateur :
```
https://votre-app.up.railway.app
```

**✅ Site Fonctionnel :**
- Page s'affiche avec les styles
- Couleurs visibles
- Navigation fonctionne
- Pas d'écran noir

**❌ Problèmes Possibles :**

| Symptôme | Cause | Solution |
|----------|-------|----------|
| Écran blanc | Erreur PHP | Vérifier logs Railway |
| Écran noir | CSS non chargé | Vérifier manifest.json |
| 500 Error | APP_KEY manquante | Ajouter APP_KEY |
| 404 Error | Routes non trouvées | Vérifier APP_URL |

### Étape 4 : Console Navigateur (F12)

Ouvrir la console développeur (F12) → Onglet Console

**✅ Succès :**
```
(Aucune erreur rouge)
```

**❌ Échec :**
```
❌ Failed to load resource: 404 /build/manifest.json
❌ Failed to load resource: 404 /build/assets/app-xxxxx.css
❌ Failed to load resource: 404 /build/assets/app-xxxxx.js
```

→ Si ces erreurs apparaissent, voir section "Dépannage" ci-dessous

### Étape 5 : Vérifier manifest.json

Accéder directement :
```
https://votre-app.up.railway.app/build/manifest.json
```

**✅ Réponse attendue :**
```json
{
  "resources/css/app.css": {
    "file": "assets/app-xxxxx.css",
    "src": "resources/css/app.css"
  },
  "resources/js/app.tsx": {
    "file": "assets/app-xxxxx.js",
    "src": "resources/js/app.tsx"
  }
}
```

**❌ Erreur 404 :**
→ Le build n'a pas été exécuté correctement

### Étape 6 : Vérifier les Assets CSS/JS

Accéder directement aux fichiers (URL depuis manifest.json) :
```
https://votre-app.up.railway.app/build/assets/app-xxxxx.css
https://votre-app.up.railway.app/build/assets/app-xxxxx.js
```

**✅ Doit afficher le contenu des fichiers**

**❌ 404 :**
→ Problème de permissions ou build incomplet

### Étape 7 : Code Source HTML

Clic droit sur la page → "Afficher le code source"

**✅ Vérifier la présence de :**
```html
<link rel="stylesheet" href="https://votre-app.up.railway.app/build/assets/app-xxxxx.css">
<script type="module" src="https://votre-app.up.railway.app/build/assets/app-xxxxx.js"></script>
```

**❌ Si les URLs sont incorrectes :**
→ Vérifier ASSET_URL et APP_URL

---

## 🐛 Dépannage

### Problème 1 : CSS/JS Toujours en 404

**Solutions dans l'ordre :**

1. **Forcer un Redéploiement**
   ```
   Railway Dashboard → Settings → Trigger Deploy
   ```

2. **Vérifier les Variables**
   ```
   Railway → Variables

   Vérifier:
   ✓ ASSET_URL existe et est correct
   ✓ APP_URL existe et est correct
   ✓ APP_KEY existe (avec base64:)
   ```

3. **Vérifier les Logs de Build**
   ```
   Railway → Deployments → Logs

   Chercher:
   ✓ "npm ci --include=dev" exécuté
   ✓ "npm run build" réussi
   ✓ "built in XXs" visible
   ```

4. **Nettoyer le Cache Railway**
   ```
   Railway Dashboard → Settings →
   Advanced → Clear Build Cache

   Puis: Trigger Deploy
   ```

### Problème 2 : Erreur "vite not found"

**Cause :** devDependencies non installées

**Solution :**
```bash
# Vérifier nixpacks.toml
cat nixpacks.toml

# Doit contenir:
[phases.build]
cmds = [
  "npm ci --include=dev",  # <-- Important!
  "npm run build"
]
```

Si incorrect :
```bash
git pull  # Récupérer les derniers changements
git push  # Redéclencher le déploiement
```

### Problème 3 : Site Fonctionne Mais Lent

**Optimisations :**

1. **Activer le Cache Opcache**

   Ajouter variable Railway :
   ```env
   PHP_OPCACHE_ENABLE=1
   ```

2. **Optimiser Composer**

   Déjà dans nixpacks.toml :
   ```bash
   composer install --optimize-autoloader
   ```

3. **Compression Gzip**

   Railway l'active automatiquement

### Problème 4 : "Class not found"

**Cause :** Autoload non optimisé

**Solution :**
```bash
# Ajouter dans nixpacks.toml [phases.build]
"composer dump-autoload --optimize --classmap-authoritative"
```

### Problème 5 : Sessions Ne Persistent Pas

**Cause :** SESSION_DRIVER incorrect

**Solution :**
```env
# Railway Variables
SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_SECURE_COOKIE=true
```

Et exécuter la migration :
```bash
php artisan session:table
php artisan migrate
```

---

## 📊 Tests de Performance

### Test 1 : Temps de Chargement

Utiliser Chrome DevTools (F12) → Network

**Cibles :**
- ✅ DOMContentLoaded : < 2s
- ✅ Load : < 4s
- ✅ First Paint : < 1s

### Test 2 : Taille des Assets

```bash
# Vérifier la taille compressée
curl -H "Accept-Encoding: gzip" -I https://votre-app.up.railway.app/build/assets/app-xxxxx.css

# Header attendu:
Content-Encoding: gzip
Content-Length: ~27000  # ~27KB pour CSS
```

### Test 3 : Cache Headers

```bash
curl -I https://votre-app.up.railway.app/build/assets/app-xxxxx.css

# Headers attendus:
Cache-Control: public, max-age=31536000, immutable
```

---

## 🔄 Commandes Utiles

### Voir les Logs en Temps Réel

```bash
# Si Railway CLI installé
railway logs --follow

# Ou via Dashboard
Railway → Deployments → View Logs
```

### Redéployer

```bash
# Via CLI
railway up

# Ou
git commit --allow-empty -m "Trigger redeploy"
git push
```

### Accéder au Shell (Si Disponible)

```bash
railway shell

# Vérifier les fichiers
ls -la public/build/
cat public/build/manifest.json
```

### Vérifier les Variables d'Environnement

```bash
railway variables

# Ou via Dashboard
Railway → Variables
```

---

## 📝 Checklist Finale

Avant de considérer le déploiement comme réussi :

### Variables d'Environnement
- [ ] APP_KEY ajouté (avec base64:)
- [ ] APP_URL correct
- [ ] ASSET_URL ajouté et correct
- [ ] DB_HOST utilise ${MYSQLHOST}
- [ ] DEBUGBAR_ENABLED=false
- [ ] APP_DEBUG=false
- [ ] APP_ENV=production

### Build
- [ ] Logs montrent "npm ci --include=dev"
- [ ] Logs montrent "npm run build" réussi
- [ ] Logs montrent "built in XXs"
- [ ] Pas d'erreurs dans les logs

### Assets
- [ ] manifest.json accessible (200 OK)
- [ ] CSS accessible (200 OK)
- [ ] JS accessible (200 OK)
- [ ] Taille CSS ~200KB (non compressé)
- [ ] Taille JS ~350KB (non compressé)

### Site Web
- [ ] Page s'affiche correctement
- [ ] Styles Tailwind visibles
- [ ] Navigation fonctionne
- [ ] Pas d'erreurs dans la console
- [ ] Images chargent
- [ ] Formulaires fonctionnent

### Performance
- [ ] Temps de chargement < 4s
- [ ] First Paint < 1s
- [ ] Assets compressés (gzip)
- [ ] Cache headers présents

### Sécurité
- [ ] HTTPS activé (Railway le fait automatiquement)
- [ ] SESSION_SECURE_COOKIE=true
- [ ] APP_DEBUG=false
- [ ] DEBUGBAR_ENABLED=false
- [ ] Logs ne contiennent pas d'informations sensibles

---

## 🎉 Tout Fonctionne !

Si toutes les vérifications passent :

1. ✅ **Le site est en ligne**
2. ✅ **Les assets sont chargés**
3. ✅ **Les performances sont bonnes**
4. ✅ **La sécurité est configurée**

### Prochaines Étapes

1. **Configurer un Domaine Custom** (Optionnel)
   ```
   Railway → Settings → Domains → Add Domain
   ```

2. **Configurer les Migrations Automatiques**
   ```toml
   # nixpacks.toml
   [phases.build]
   cmds = [
     # ... existing commands
     "php artisan migrate --force"
   ]
   ```

3. **Configurer les Backups MySQL**
   ```
   Railway MySQL → Backups → Enable
   ```

4. **Monitoring**
   - Ajouter Sentry pour le monitoring d'erreurs
   - Configurer Laravel Telescope (dev only)
   - Mettre en place des alertes

5. **CI/CD**
   - Les déploiements sont déjà automatiques via GitHub
   - Considérer l'ajout de tests automatisés

---

## 📞 Support

### Documentation
- [Railway Assets Fix](RAILWAY_ASSETS_FIX.md)
- [Railway Env Setup](RAILWAY_ENV_SETUP.md)
- [API Key Guide](API_KEY_GUIDE.md)

### Logs
```bash
# Vérifier les logs Laravel
Railway → Shell → cat storage/logs/laravel.log

# Ou télécharger les logs
railway logs > railway-logs.txt
```

### Aide Railway
- Documentation: https://docs.railway.app
- Discord: https://discord.gg/railway
- Support: https://railway.app/help

---

**Version** : 1.0
**Dernière mise à jour** : 16 novembre 2025
**Statut** : ✅ Prêt pour la production
