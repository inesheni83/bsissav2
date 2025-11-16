# 💾 Sauvegarder les Images dans la Base de Données

## 📌 Pourquoi Sauvegarder les Images en DB?

### ✅ Avantages pour Railway

- **Persistance garantie** - La base de données MySQL est persistante sur Railway
- **Pas de perte de données** - Les images survivent aux redéploiements
- **Pas besoin de S3/Cloudinary** - Solution gratuite
- **Backups inclus** - Les images sont sauvegardées avec la DB
- **Simplicité** - Pas de configuration externe

### ❌ Inconvénients

- **Taille de la DB** - Augmente rapidement avec les images
- **Performance** - Plus lent que le stockage fichier
- **Coût** - Railway facture selon la taille de la DB
- **Pas de CDN** - Pas d'optimisation de chargement

---

## 🚀 Implémentation

### ✅ Modifications Appliquées

#### 1. Migration: `add_image_data_to_products_table.php`

Ajoute deux colonnes à la table `products`:

```php
Schema::table('products', function (Blueprint $table) {
    // LONGTEXT pour stocker l'image en base64 (jusqu'à 4GB)
    $table->longText('image_data')->nullable()->after('image');

    // Type MIME de l'image (image/png, image/jpeg, etc.)
    $table->string('image_mime_type')->nullable()->after('image_data');
});
```

**Colonnes ajoutées:**
- `image_data` (LONGTEXT) - Image encodée en base64
- `image_mime_type` (VARCHAR) - Type MIME (image/png, image/jpeg)

---

#### 2. Modèle: `app/Models/Product.php`

**Ajout dans `$fillable`:**
```php
protected $fillable = [
    // ...
    'image',
    'image_data',         // Base64 encoded image
    'image_mime_type',    // Image MIME type
    // ...
];
```

**Accessor `image_url`:**
```php
public function getImageUrlAttribute(): ?string
{
    // Priority 1: Use base64 image from database if available
    if ($this->image_data && $this->image_mime_type) {
        return 'data:' . $this->image_mime_type . ';base64,' . $this->image_data;
    }

    // Priority 2: Use file path if available
    if ($this->image) {
        return asset('storage/' . $this->image);
    }

    return null;
}
```

**Usage dans les vues:**
```php
// Au lieu de:
<img src="{{ asset('storage/' . $product->image) }}" />

// Utilisez:
<img src="{{ $product->image_url }}" />
```

---

#### 3. Service: `app/Services/ProductService.php`

**Méthode de conversion base64:**
```php
private function convertImageToBase64(UploadedFile $image): array
{
    $imageContent = file_get_contents($image->getRealPath());
    $base64 = base64_encode($imageContent);
    $mimeType = $image->getMimeType();

    return [
        'base64' => $base64,
        'mime_type' => $mimeType,
    ];
}
```

**Modifications dans `createProduct`:**
```php
if ($image) {
    // Save image to database as base64
    $imageData = $this->convertImageToBase64($image);
    $data['image'] = $this->handleImageUpload($image); // Keep path for backwards compatibility
    $data['image_data'] = $imageData['base64'];
    $data['image_mime_type'] = $imageData['mime_type'];
}
```

**Modifications dans `updateProduct`:**
```php
if ($image instanceof UploadedFile) {
    // Delete old image file if exists
    if ($product->image && Storage::disk('public')->exists($product->image)) {
        Storage::disk('public')->delete($product->image);
    }

    // Save new image to database as base64
    $imageData = $this->convertImageToBase64($image);
    $data['image'] = $image->store('products', 'public'); // Keep path
    $data['image_data'] = $imageData['base64'];
    $data['image_mime_type'] = $imageData['mime_type'];
}
```

---

## 📦 Migration et Déploiement

### Étape 1: Exécuter la Migration Localement

```bash
php artisan migrate
```

**Résultat attendu:**
```
Migration table created successfully.
Migrating: 2025_11_16_223247_add_image_data_to_products_table
Migrated:  2025_11_16_223247_add_image_data_to_products_table (123ms)
```

---

### Étape 2: Ajouter la Migration au Build Railway

**Modifier `nixpacks.toml`:**
```toml
[phases.build]
cmds = [
  # ... commandes existantes

  # Clear all caches first
  "php artisan config:clear",
  "php artisan route:clear",
  "php artisan view:clear",
  "php artisan cache:clear",

  # Run migrations
  "php artisan migrate --force",

  # Rebuild caches
  "php artisan config:cache",
  "php artisan route:cache",
  "php artisan view:cache"
]
```

---

### Étape 3: Commit et Push

```bash
git add database/migrations/2025_11_16_223247_add_image_data_to_products_table.php
git add app/Services/ProductService.php
git add app/Models/Product.php
git add nixpacks.toml
git commit -m "feat: Store images in database as base64"
git push
```

---

### Étape 4: Vérifier sur Railway

**Railway redéploie automatiquement.**

**Vérifier dans les logs:**
```
✓ php artisan migrate --force
Migrating: 2025_11_16_223247_add_image_data_to_products_table
Migrated:  2025_11_16_223247_add_image_data_to_products_table
```

---

## 🔄 Migrer les Images Existantes

### Script de Migration des Fichiers vers DB

Créez `database/seeders/MigrateImagesToDatabase.php`:

```php
<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class MigrateImagesToDatabase extends Seeder
{
    public function run(): void
    {
        $products = Product::whereNotNull('image')
            ->whereNull('image_data')
            ->get();

        $this->command->info("Migrating {$products->count()} product images to database...");

        foreach ($products as $product) {
            $path = storage_path('app/public/' . $product->image);

            if (!file_exists($path)) {
                $this->command->warn("Image not found: {$product->image}");
                continue;
            }

            try {
                $imageContent = file_get_contents($path);
                $base64 = base64_encode($imageContent);
                $mimeType = mime_content_type($path);

                $product->update([
                    'image_data' => $base64,
                    'image_mime_type' => $mimeType,
                ]);

                $this->command->info("Migrated: {$product->name}");

            } catch (\Exception $e) {
                $this->command->error("Failed to migrate {$product->name}: " . $e->getMessage());
            }
        }

        $this->command->info("Migration completed!");
    }
}
```

**Exécuter:**
```bash
php artisan db:seed --class=MigrateImagesToDatabase
```

---

## 📊 Usage dans les Vues

### Blade (Laravel)

```blade
{{-- Avec l'accessor image_url --}}
<img src="{{ $product->image_url }}" alt="{{ $product->name }}" />

{{-- Vérifier si l'image existe --}}
@if($product->image_url)
    <img src="{{ $product->image_url }}" alt="{{ $product->name }}" />
@else
    <img src="{{ asset('images/placeholder.png') }}" alt="Pas d'image" />
@endif
```

### React/Inertia

```tsx
// Le produit inclut automatiquement image_url via l'accessor
<img
    src={product.image_url}
    alt={product.name}
    className="w-full h-48 object-cover"
/>

// Avec fallback
<img
    src={product.image_url || '/images/placeholder.png'}
    alt={product.name}
/>
```

---

## 🔍 Comparaison des Méthodes de Stockage

| Méthode | Persistance | Performance | Coût | Complexité |
|---------|-------------|-------------|------|------------|
| **Base de Données** | ✅ Oui | ⚠️ Moyen | 💰 DB size | 🟢 Simple |
| **Fichiers (Railway)** | ❌ Non | ✅ Rapide | 🟢 Gratuit | 🟢 Simple |
| **AWS S3** | ✅ Oui | ✅ Rapide | 💰 $0.023/GB | 🔴 Complexe |
| **Cloudinary** | ✅ Oui | ✅ Très rapide | 💰 $0.20/GB | 🟡 Moyen |

---

## ⚖️ Limitations et Considérations

### Taille Maximale d'Image

**LONGTEXT**: Jusqu'à 4 GB théorique
**Pratique**: Limiter à 5-10 MB par image

**Calculer la taille base64:**
```
Taille base64 ≈ Taille fichier × 1.37
```

**Exemples:**
- Image 100 KB → ~137 KB en base64
- Image 1 MB → ~1.37 MB en base64
- Image 5 MB → ~6.85 MB en base64

### Limites MySQL Railway

Vérifier les limites de votre plan Railway:
- Free Plan: 1 GB
- Developer Plan: 8 GB
- Team Plan: 32 GB+

**Calcul rapide:**
```
Nombre max d'images = (Taille DB disponible) / (Taille moyenne image × 1.37)

Exemple: 1 GB / (500 KB × 1.37) ≈ 1,450 images
```

---

## 🎯 Recommandations

### Pour une Petite Application (<100 produits)

✅ **Base de Données**
- Simple à mettre en place
- Pas de coût supplémentaire
- Suffit largement pour 100-200 produits

### Pour une Application Moyenne (100-1000 produits)

⚠️ **Base de Données + Optimisation**
- Limiter la taille des images (max 500 KB)
- Compresser les images avant upload
- Monitorer la taille de la DB

### Pour une Grande Application (>1000 produits)

❌ **Migrer vers S3/Cloudinary**
- Meilleure performance
- CDN inclus
- Pas de limite de stockage
- Coût prévisible

---

## 🛠️ Optimisations

### 1. Compresser les Images Avant Stockage

**Installer Intervention Image:**
```bash
composer require intervention/image
```

**Modifier `convertImageToBase64`:**
```php
use Intervention\Image\Facades\Image;

private function convertImageToBase64(UploadedFile $image): array
{
    // Resize and compress
    $img = Image::make($image->getRealPath())
        ->resize(800, null, function ($constraint) {
            $constraint->aspectRatio();
            $constraint->upsize();
        })
        ->encode('jpg', 75);

    $base64 = base64_encode($img->__toString());

    return [
        'base64' => $base64,
        'mime_type' => 'image/jpeg',
    ];
}
```

---

### 2. Lazy Loading des Images

**Dans le modèle:**
```php
// Ne pas charger image_data par défaut
protected $hidden = ['image_data'];
```

**Charger seulement quand nécessaire:**
```php
$product = Product::find(1); // Sans image_data
$product = Product::with('image_data')->find(1); // Avec image_data
```

---

### 3. Cache des Images

**Utiliser le cache Laravel:**
```php
public function getImageUrlAttribute(): ?string
{
    if ($this->image_data && $this->image_mime_type) {
        return Cache::remember(
            "product_image_{$this->id}",
            3600, // 1 heure
            fn() => 'data:' . $this->image_mime_type . ';base64,' . $this->image_data
        );
    }

    // ...
}
```

---

## 📈 Monitoring

### Vérifier la Taille de la DB

**Query SQL:**
```sql
-- Taille totale de la table products
SELECT
    table_name AS 'Table',
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES
WHERE table_schema = 'railway'
AND table_name = 'products';

-- Taille moyenne des images
SELECT
    AVG(LENGTH(image_data)) / 1024 AS 'Avg Image Size (KB)',
    COUNT(*) AS 'Total Products',
    SUM(LENGTH(image_data)) / 1024 / 1024 AS 'Total Images Size (MB)'
FROM products
WHERE image_data IS NOT NULL;
```

---

## 🔄 Rollback (Retour aux Fichiers)

Si vous voulez revenir au stockage fichier:

```bash
php artisan migrate:rollback --step=1
```

Ou manuellement:
```sql
ALTER TABLE products
DROP COLUMN image_data,
DROP COLUMN image_mime_type;
```

---

## ✅ Checklist Déploiement

- [ ] Migration créée et testée localement
- [ ] ProductService modifié pour convertir en base64
- [ ] Modèle Product avec accessor `image_url`
- [ ] nixpacks.toml avec `php artisan migrate --force`
- [ ] Commit et push vers GitHub
- [ ] Railway redéploie automatiquement
- [ ] Vérifier logs: migration exécutée
- [ ] Tester upload d'une nouvelle image
- [ ] Vérifier que l'image s'affiche
- [ ] Monitorer la taille de la DB

---

**Version** : 1.0
**Dernière mise à jour** : 16 novembre 2025
**Statut** : ✅ Prêt pour le déploiement
