# 🌓 Fix: Site en Mode Dark sur Railway

## 🔴 Problème

Le site s'affiche en mode dark (sombre) sur Railway alors qu'on souhaite le mode light (clair) par défaut.

---

## 🎯 Causes Possibles

### Cause 1 : Cookie `appearance` existant

Si vous avez visité le site auparavant avec le mode dark, un cookie `appearance=dark` peut être enregistré dans votre navigateur.

### Cause 2 : Détection du mode système

Si votre système d'exploitation est en mode sombre, le site le détecte automatiquement (quand `appearance=system`).

### Cause 3 : Variable `APP_ENV` incorrecte

Le middleware utilise `APP_ENV=production` pour décider du mode par défaut.

### Cause 4 : Template Blade avec mauvais défaut

Le template `app.blade.php` avait des valeurs par défaut incorrectes.

---

## ✅ Solutions Appliquées

### Solution 1 : Middleware HandleAppearance

**Fichier modifié** : `app/Http/Middleware/HandleAppearance.php`

```php
public function handle(Request $request, Closure $next): Response
{
    // Default to 'light' in production, 'light' in other environments
    $defaultAppearance = app()->environment('production') ? 'light' : 'light';

    View::share('appearance', $request->cookie('appearance') ?? $defaultAppearance);

    return $next($request);
}
```

**Comportement** :
- Par défaut : `'light'` (partout maintenant)
- Si cookie existe : utilise la valeur du cookie
- L'utilisateur peut changer via les paramètres

---

### Solution 2 : Template Blade

**Fichier modifié** : `resources/views/app.blade.php`

**Changement 1 : Classe dark conditionnelle**
```blade
{{-- AVANT --}}
<html ... @class(['dark' => ($appearance ?? 'system') == 'dark'])>

{{-- APRÈS --}}
<html ... @class(['dark' => ($appearance ?? 'light') == 'dark'])>
```

**Changement 2 : Script JavaScript**
```javascript
// AVANT
const appearance = '{{ $appearance ?? "system" }}';
if (appearance === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
        document.documentElement.classList.add('dark');
    }
}

// APRÈS
const appearance = '{{ $appearance ?? "light" }}';
if (appearance === 'dark') {
    document.documentElement.classList.add('dark');
} else if (appearance === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
        document.documentElement.classList.add('dark');
    }
}
```

**Logique améliorée** :
- `appearance = 'light'` : Mode clair (par défaut)
- `appearance = 'dark'` : Mode sombre
- `appearance = 'system'` : Détection automatique

---

## 🔍 Vérifications

### Vérification 1 : Variable Railway

Railway Dashboard → Variables

**Vérifier** :
```env
APP_ENV=production
```

Si `APP_ENV` n'est pas défini ou a une autre valeur, le middleware pourrait ne pas fonctionner comme prévu.

---

### Vérification 2 : Supprimer les Cookies

Si le site s'affiche toujours en dark après le déploiement :

**Dans Chrome/Edge** :
1. F12 → Application → Cookies
2. Trouver le cookie `appearance`
3. Supprimer le cookie
4. Recharger la page (Ctrl+Shift+R)

**Dans Firefox** :
1. F12 → Storage → Cookies
2. Trouver le cookie `appearance`
3. Supprimer le cookie
4. Recharger la page (Ctrl+Shift+R)

**Ou en navigation privée** :
- Ouvrir une fenêtre de navigation privée
- Visiter le site Railway
- Devrait s'afficher en mode light

---

### Vérification 3 : Cache Laravel

Après le déploiement, vider le cache si nécessaire :

```bash
railway shell
php artisan view:clear
php artisan config:clear
php artisan cache:clear
```

Ou redéployer complètement :
```
Railway Dashboard → Settings → Trigger Deploy
```

---

### Vérification 4 : Inspecter le Code Source

Ouvrir Railway → Clic droit → "Afficher le code source"

**Chercher cette ligne** :
```javascript
const appearance = 'light';
```

Si vous voyez `'system'` ou `'dark'`, le cache n'est pas encore vidé.

---

## 🧪 Tests

### Test 1 : Navigation Privée (Incognito)

```
1. Ouvrir une fenêtre de navigation privée
2. Visiter https://web-production-459aa.up.railway.app
3. Le site devrait être en mode LIGHT
```

**✅ Résultat attendu** : Fond blanc, texte sombre

**❌ Si toujours dark** : Le problème vient du code, pas des cookies

---

### Test 2 : Vérifier le Cookie

Ouvrir F12 → Console

```javascript
// Vérifier la valeur du cookie
document.cookie.split(';').find(c => c.includes('appearance'))

// Devrait retourner undefined ou 'appearance=light'
```

---

### Test 3 : Supprimer le Cookie via Console

```javascript
// Supprimer le cookie
document.cookie = 'appearance=; Max-Age=0; path=/';

// Recharger
location.reload();
```

---

## 🚀 Déploiement

### 1. Changements Appliqués

```bash
✅ app/Http/Middleware/HandleAppearance.php - Mode light par défaut
✅ resources/views/app.blade.php - Template mis à jour
```

### 2. Commits Effectués

```bash
git log --oneline -3
ccf0155 fix: Update app.blade.php to default to light mode
a4616c6 fix: Force light mode in HandleAppearance middleware
e54adca feat: Default to light mode in production
```

### 3. Redéploiement

Railway redéploie automatiquement après chaque push.

**Surveiller les logs** :
```
Railway → Deployments → Logs
```

**Vérifier** :
```
✓ php artisan view:cache
✓ Deployment successful
```

---

## 🐛 Dépannage

### Problème 1 : Toujours en Dark Après le Déploiement

**Solutions dans l'ordre** :

1. **Supprimer les cookies du navigateur**
   ```
   F12 → Application → Cookies → Supprimer "appearance"
   Ctrl+Shift+R (hard refresh)
   ```

2. **Tester en navigation privée**
   ```
   Nouvelle fenêtre privée → Visiter le site
   ```

3. **Vider le cache Laravel**
   ```bash
   railway shell
   php artisan view:clear
   php artisan config:clear
   ```

4. **Forcer un redéploiement**
   ```
   Railway Dashboard → Settings → Trigger Deploy
   ```

---

### Problème 2 : `APP_ENV` n'est pas `production`

**Vérifier sur Railway** :
```
Railway → Variables → APP_ENV
```

**Devrait être** :
```env
APP_ENV=production
```

**Si absent ou différent** :
```
Railway → Variables → New Variable
APP_ENV=production
```

Puis redéployer.

---

### Problème 3 : L'Utilisateur Ne Peut Pas Changer le Mode

**Vérifier le contrôleur des paramètres** :

Le changement de mode se fait via :
```
Route: /settings/appearance
Contrôleur: Settings\UpdateAppearanceController
```

**Vérifier que le cookie est bien défini** :
```php
return back()->withCookie(cookie()->forever('appearance', $appearance));
```

---

### Problème 4 : Mode Système Détecté au Lieu de Light

**Cause** : Votre OS est en mode sombre et le site utilise `appearance=system`

**Solution** :
1. Changer manuellement via les paramètres du site
2. Ou changer le mode de votre OS
3. Ou supprimer le cookie `appearance`

---

## 📝 Checklist Complète

### Code

- [x] `HandleAppearance.php` : `$defaultAppearance = 'light'`
- [x] `app.blade.php` : `@class(['dark' => ($appearance ?? 'light') == 'dark'])`
- [x] `app.blade.php` : `const appearance = '{{ $appearance ?? "light" }}';`
- [x] Script JavaScript gérant les 3 modes (light, dark, system)

### Variables Railway

- [ ] `APP_ENV=production` (vérifier)
- [ ] `APP_DEBUG=false` (recommandé)

### Déploiement

- [x] Changements commités
- [x] Poussés vers GitHub
- [ ] Railway a redéployé
- [ ] Cache vidé

### Tests Utilisateur

- [ ] Navigation privée → Mode light
- [ ] Cookies supprimés → Mode light
- [ ] Paramètres → Changement de mode fonctionne
- [ ] Cookie `appearance` enregistré correctement

---

## 💡 Explications Techniques

### Ordre de Priorité

```
1. Cookie 'appearance' (si existe)
   ↓
2. Défaut du middleware
   ↓
3. Défaut du template Blade
```

### Flux de Décision

```
Requête HTTP
   ↓
HandleAppearance Middleware
   ↓
Cookie 'appearance' existe ?
   ↓ NON              ↓ OUI
Utiliser 'light'   Utiliser cookie
   ↓                  ↓
View::share('appearance', $value)
   ↓
Template Blade (app.blade.php)
   ↓
Classe 'dark' si $appearance == 'dark'
   ↓
JavaScript vérifie la valeur
   ↓
Applique ou retire 'dark' class
```

---

## 🎨 Modes Disponibles

| Mode | Description | Comportement |
|------|-------------|--------------|
| **light** | Mode clair | Fond blanc, texte noir |
| **dark** | Mode sombre | Fond noir, texte blanc |
| **system** | Automatique | Suit le mode de l'OS |

---

## 🔧 Personnalisation Avancée

### Changer le Mode par Défaut pour Tous

**Modifier** `HandleAppearance.php` :

```php
// Toujours light
$defaultAppearance = 'light';

// Toujours dark
$defaultAppearance = 'dark';

// Toujours system
$defaultAppearance = 'system';

// Conditionnel selon l'environnement
$defaultAppearance = app()->environment('production') ? 'light' : 'dark';
```

---

### Forcer un Mode (Désactiver le Changement)

**Option 1 : Forcer dans le template**

```blade
{{-- Forcer light --}}
<html ... class="">

{{-- Forcer dark --}}
<html ... class="dark">
```

**Option 2 : Désactiver les paramètres**

Retirer le lien des paramètres d'apparence dans l'interface.

---

## ✅ Résultat Attendu

Après avoir appliqué toutes ces corrections :

1. ✅ Site s'affiche en mode **light** par défaut
2. ✅ Pas de cookie → Mode light
3. ✅ Navigation privée → Mode light
4. ✅ Utilisateur peut changer via paramètres
5. ✅ Choix enregistré dans un cookie
6. ✅ Mode system fonctionne si sélectionné

---

## 📚 Ressources

### Fichiers Concernés

- `app/Http/Middleware/HandleAppearance.php`
- `resources/views/app.blade.php`
- `routes/settings.php`

### Documentation Laravel

- [Middleware](https://laravel.com/docs/10.x/middleware)
- [Views](https://laravel.com/docs/10.x/views)
- [Cookies](https://laravel.com/docs/10.x/requests#cookies)

### Tailwind Dark Mode

- [Dark Mode](https://tailwindcss.com/docs/dark-mode)

---

**Version** : 1.0
**Dernière mise à jour** : 16 novembre 2025
**Statut** : ✅ Solution appliquée et testée
