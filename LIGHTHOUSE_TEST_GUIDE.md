# 📊 Guide de Test Lighthouse - Page Accueil

## 🎯 Objectif
Atteindre un score minimum de **80/100** dans toutes les catégories Lighthouse.

---

## 📋 PRÉ-REQUIS

### 1. Environnement de test
- [ ] Serveur Laravel en cours d'exécution (`php artisan serve` ou Valet/Herd)
- [ ] Assets compilés en production (`npm run build`)
- [ ] Cache vidé (`php artisan cache:clear`)
- [ ] Base de données avec au moins 12 produits en vedette
- [ ] Images de produits présentes dans `storage/app/public/products/`

### 2. Chrome DevTools
- [ ] Google Chrome installé (version 100+)
- [ ] Mode navigation privée (pour éviter les extensions)
- [ ] Connexion internet stable

---

## 🚀 PROCÉDURE DE TEST

### Méthode 1 : Chrome DevTools (Recommandé)

1. **Ouvrir la page d'accueil**
   ```
   http://localhost:8000
   ```

2. **Ouvrir DevTools**
   - Appuyez sur `F12` ou `Ctrl+Shift+I` (Windows/Linux)
   - Ou `Cmd+Option+I` (Mac)

3. **Accéder à Lighthouse**
   - Cliquez sur l'onglet **"Lighthouse"**
   - Si absent, cliquez sur `>>` puis sélectionnez "Lighthouse"

4. **Configurer le test**
   - **Mode** : `Navigation (Default)`
   - **Device** : `Desktop` (pour commencer)
   - **Categories** : Cocher les 4 :
     - ✅ Performance
     - ✅ Accessibility
     - ✅ Best Practices
     - ✅ SEO
   - **Throttling** : `Simulated throttling (default)`

5. **Lancer l'analyse**
   - Cliquez sur **"Analyze page load"**
   - Attendez 30-60 secondes
   - Ne pas interagir avec la page pendant le test

6. **Sauvegarder le rapport**
   - Cliquez sur ⚙️ (Settings) > "Save as HTML"
   - Nommer : `lighthouse-report-desktop-YYYY-MM-DD.html`

7. **Répéter pour Mobile**
   - **Device** : `Mobile`
   - Sauvegarder : `lighthouse-report-mobile-YYYY-MM-DD.html`

---

### Méthode 2 : Lighthouse CI (Ligne de commande)

```bash
# Installer Lighthouse CLI
npm install -g @lhci/cli lighthouse

# Lancer le test Desktop
lighthouse http://localhost:8000 --output html --output-path ./lighthouse-desktop.html --preset=desktop --view

# Lancer le test Mobile
lighthouse http://localhost:8000 --output html --output-path ./lighthouse-mobile.html --view
```

---

## 📊 SCORES ATTENDUS (Après toutes les optimisations)

### Desktop

| Catégorie | Score Minimum | Score Cible | Score Excellent |
|-----------|--------------|-------------|-----------------|
| 🟢 Performance | 65+ | 75-85 | 90+ |
| 🟢 Accessibility | 85+ | 90-95 | 100 |
| 🟢 Best Practices | 80+ | 85-95 | 100 |
| 🟢 SEO | 90+ | 95-100 | 100 |

### Mobile

| Catégorie | Score Minimum | Score Cible | Score Excellent |
|-----------|--------------|-------------|-----------------|
| 🟡 Performance | 55+ | 65-75 | 85+ |
| 🟢 Accessibility | 85+ | 90-95 | 100 |
| 🟢 Best Practices | 80+ | 85-95 | 100 |
| 🟢 SEO | 90+ | 95-100 | 100 |

---

## 🔍 MÉTRIQUES CORE WEB VITALS

### Performance - Métriques clés

| Métrique | Bon | À améliorer | Mauvais | Notre Cible |
|----------|-----|-------------|---------|-------------|
| **LCP** (Largest Contentful Paint) | < 2.5s | 2.5-4s | > 4s | **< 2.5s** |
| **FID** (First Input Delay) | < 100ms | 100-300ms | > 300ms | **< 100ms** |
| **CLS** (Cumulative Layout Shift) | < 0.1 | 0.1-0.25 | > 0.25 | **< 0.1** |
| **FCP** (First Contentful Paint) | < 1.8s | 1.8-3s | > 3s | **< 1.8s** |
| **TBT** (Total Blocking Time) | < 200ms | 200-600ms | > 600ms | **< 300ms** |
| **SI** (Speed Index) | < 3.4s | 3.4-5.8s | > 5.8s | **< 3.4s** |

---

## ✅ CHECKLIST POST-TEST

### Si Performance < 65 (Desktop) ou < 55 (Mobile)

- [ ] **Vérifier les images**
  - Les images sont-elles optimisées (WebP, compression) ?
  - Y a-t-il du base64 dans le HTML ?
  - Les dimensions width/height sont-elles présentes ?
  - Le lazy loading est-il actif ?

- [ ] **Vérifier LCP**
  - Quelle est l'image LCP ? (Hero carousel)
  - Est-elle préchargée avec `<link rel="preload">` ?
  - Taille de l'image < 500KB ?

- [ ] **Vérifier JavaScript**
  - Bundle trop lourd ? (`npm run build` a été exécuté ?)
  - Trop de code non utilisé ?

- [ ] **Vérifier le cache**
  - Les catégories/galerie sont-elles cachées (3600s) ?
  - Le cache fonctionne-t-il ? (vérifier Redis/File)

### Si Accessibility < 85

- [ ] **Vérifier les contrastes**
  - Ratio minimum 4.5:1 pour le texte normal
  - Ratio minimum 3:1 pour le texte large (18px+)
  - Outil : https://webaim.org/resources/contrastchecker/

- [ ] **Vérifier les labels ARIA**
  - Tous les boutons ont un `aria-label` ?
  - Les groupes de boutons ont un `role="group"` ?
  - Les images ont un `alt` descriptif ?

- [ ] **Vérifier la navigation clavier**
  - Le skip link apparaît au focus (Tab) ?
  - Les modals se ferment avec ESC ?
  - L'ordre de tabulation est logique ?

- [ ] **Vérifier la sémantique HTML**
  - `<main>` avec `role="main"` présent ?
  - Hiérarchie des headings correcte (H1 unique) ?

### Si SEO < 90

- [ ] **Meta tags présents**
  - Title unique et descriptif ?
  - Meta description < 160 caractères ?
  - Canonical URL présent ?

- [ ] **Open Graph et Twitter Cards**
  - `og:image` pointe vers une vraie image ?
  - `og:title` et `og:description` remplis ?
  - Twitter card type = `summary_large_image` ?

- [ ] **Schema.org JSON-LD**
  - Scripts WebSite et Organization présents ?
  - Pas d'erreur de syntaxe JSON ?

- [ ] **Robots et sitemap**
  - `robots.txt` accessible ?
  - Meta robots = `index, follow` ?

### Si Best Practices < 80

- [ ] **Erreurs console**
  - Aucune erreur JavaScript ?
  - Aucune image 404 ?

- [ ] **HTTPS**
  - Tous les assets en HTTPS ?
  - Pas de mixed content ?

- [ ] **Bibliothèques à jour**
  - Aucune vulnérabilité connue ?

---

## 🐛 PROBLÈMES COURANTS ET SOLUTIONS

### Problème 1 : Performance faible (< 50)
**Cause** : Images base64 encore présentes
**Solution** :
```bash
# Vérifier dans le HTML source
# Chercher : data:image
# Si présent → problème avec la migration des images
```

### Problème 2 : CLS élevé (> 0.1)
**Cause** : Dimensions manquantes sur les images
**Solution** : Vérifier que toutes les `<img>` ont `width` et `height`

### Problème 3 : LCP lent (> 3s)
**Cause** : Image hero non préchargée
**Solution** : Vérifier le `<link rel="preload">` dans le `<Head>`

### Problème 4 : Accessibility - Contraste
**Cause** : Texte `text-emerald-100/60` sur fond sombre
**Solution** : Déjà corrigé → `text-emerald-100/90`

### Problème 5 : SEO - Missing canonical
**Cause** : `window` undefined côté serveur
**Solution** : Utiliser `typeof window !== 'undefined'` (déjà fait)

---

## 📸 SCREENSHOTS ATTENDUS

Après le test, vous devriez voir :

### ✅ Bon résultat (exemple)
```
Performance:     75-85 🟢
Accessibility:   90-100 🟢
Best Practices:  85-95 🟢
SEO:             95-100 🟢
```

### ⚠️ Résultat moyen (à améliorer)
```
Performance:     55-65 🟡
Accessibility:   80-85 🟡
Best Practices:  75-80 🟡
SEO:             85-90 🟡
```

### 🔴 Mauvais résultat (action requise)
```
Performance:     < 50 🔴
Accessibility:   < 80 🔴
Best Practices:  < 75 🔴
SEO:             < 85 🔴
```

---

## 📤 PARTAGER LES RÉSULTATS

1. Sauvegarder les rapports HTML
2. Créer un dossier `lighthouse-reports/`
3. Comparer avec les tests précédents
4. Documenter les améliorations

```bash
# Structure recommandée
lighthouse-reports/
├── 2025-12-06-before-optimization/
│   ├── desktop.html
│   └── mobile.html
└── 2025-12-06-after-optimization/
    ├── desktop.html
    └── mobile.html
```

---

## 🎯 PROCHAINES ÉTAPES SI SCORES < CIBLE

### Performance < 75 (Desktop)
1. Optimiser les images (compression, WebP)
2. Activer la compression Gzip/Brotli
3. Mettre en place un CDN
4. Lazy load des composants React

### Accessibility < 90
1. Audit manuel avec lecteur d'écran
2. Corriger tous les contrastes < 4.5:1
3. Ajouter focus visible sur tous les éléments interactifs

### SEO < 95
1. Ajouter Schema.org Product pour chaque produit
2. Créer un sitemap.xml
3. Ajouter breadcrumbs

### Best Practices < 85
1. Configurer les headers de sécurité
2. Activer HSTS
3. Vérifier les dépendances npm

---

## 📞 SUPPORT

Si les scores sont très bas :
1. Vérifier que `npm run build` a réussi
2. Vider le cache navigateur (Ctrl+Shift+Del)
3. Tester en navigation privée
4. Vérifier les logs Laravel pour erreurs

---

**Bonne chance pour vos tests ! 🚀**
