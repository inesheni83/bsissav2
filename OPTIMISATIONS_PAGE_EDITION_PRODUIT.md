# 🎯 Plan d'Optimisation - Page Édition de Produit

## 📊 Audit Initial selon Lighthouse Google

### État Actuel de la Page
**Fichier** : `resources/js/pages/product/editProduct.tsx`
**Route** : `/products/{product}/edit`
**Type** : Page d'administration (protégée)

---

## 🔴 PROBLÈMES IDENTIFIÉS

### 1. **PERFORMANCE**

#### A. Problèmes Critiques ❌

##### 1.1 Chargement de l'éditeur WYSIWYG lourd
**Ligne** : `editProduct.tsx:15`
```tsx
import { WysiwygEditor } from '@/components/ui/wysiwyg-editor';
```
**Impact** :
- Bundle JS très lourd (~372 KB selon le build)
- Bloque le rendu initial
- TBT (Total Blocking Time) élevé

**Solution** :
```tsx
// Lazy loading de l'éditeur
const WysiwygEditor = lazy(() => import('@/components/ui/wysiwyg-editor'));

// Dans le composant
<Suspense fallback={<EditorSkeleton />}>
    <WysiwygEditor ... />
</Suspense>
```

##### 1.2 Pas de debounce sur le slug auto-généré
**Ligne** : `editProduct.tsx:166-168`
```tsx
if (field === 'name' && autoSlug) {
    setData('slug', slugify(String(value || '')));
}
```
**Impact** :
- Re-render à chaque frappe
- Performance dégradée sur mobile
- Expérience utilisateur saccadée

**Solution** :
```tsx
import { useDebouncedCallback } from 'use-debounce';

const debouncedSlugUpdate = useDebouncedCallback((name: string) => {
    if (autoSlug) {
        setData('slug', slugify(name));
    }
}, 300);

const handleFieldChange = (field, value) => {
    setData(field, value);
    if (field === 'name') {
        debouncedSlugUpdate(String(value || ''));
    }
};
```

##### 1.3 Blob URLs non révoquées (memory leak potentiel)
**Lignes** : `editProduct.tsx:176-180, 186-189`
```tsx
if (imagePreview && imagePreview.startsWith('blob:')) {
    URL.revokeObjectURL(imagePreview);
}
```
**Problème** : Révocation manuelle, risque d'oubli

**Solution** :
```tsx
// Hook personnalisé pour gérer automatiquement
const useBlobUrl = (file: File | null) => {
    const [blobUrl, setBlobUrl] = useState<string | null>(null);

    useEffect(() => {
        if (file) {
            const url = URL.createObjectURL(file);
            setBlobUrl(url);
            return () => URL.revokeObjectURL(url); // Auto cleanup
        }
        setBlobUrl(null);
    }, [file]);

    return blobUrl;
};
```

##### 1.4 Pas de compression/redimensionnement d'image côté client
**Impact** :
- Upload d'images énormes (plusieurs MB)
- Temps de soumission très long
- Surcharge serveur

**Solution** :
```tsx
import imageCompression from 'browser-image-compression';

const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
        // Compresser l'image côté client
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);

        setData('image', compressedFile);
        setImagePreview(URL.createObjectURL(compressedFile));
    } catch (error) {
        console.error('Compression failed:', error);
        // Fallback vers fichier original
        setData('image', file);
    }
};
```

#### B. Problèmes Moyens ⚠️

##### 1.5 Re-renders inutiles avec useCallback/useMemo
**Impact** : Composant se re-rend trop souvent

**Solution** :
```tsx
// Mémoïser les handlers
const handleFieldChange = useCallback((field, value) => {
    setData(field, value);
    if (field === 'name' && autoSlug) {
        setData('slug', slugify(String(value || '')));
    }
}, [autoSlug, setData, slugify]);

const handleSubmit = useCallback((event) => {
    submitForm(event, route('products.update', product.id), 'put');
}, [submitForm, product.id]);
```

---

### 2. **ACCESSIBILITÉ**

#### A. Problèmes Critiques ❌

##### 2.1 Formulaire sans labels explicites
**Problème** : Certains champs manquent de labels visibles ou ARIA

**Solution** :
```tsx
// Avant
<Input value={data.name} onChange={...} />

// Après
<div className="space-y-2">
    <Label htmlFor="product-name" className="required">
        Nom du produit
        <span className="text-red-500 ml-1" aria-hidden="true">*</span>
    </Label>
    <Input
        id="product-name"
        value={data.name}
        onChange={...}
        aria-required="true"
        aria-invalid={!!errors.name}
        aria-describedby={errors.name ? "name-error" : undefined}
    />
    {errors.name && (
        <p id="name-error" className="text-sm text-red-600" role="alert">
            {errors.name}
        </p>
    )}
</div>
```

##### 2.2 Messages d'erreur non annoncés aux lecteurs d'écran
**Solution** :
```tsx
// Ajouter une live region pour les erreurs globales
<div
    role="alert"
    aria-live="polite"
    className="sr-only"
>
    {Object.keys(errors).length > 0 && (
        `${Object.keys(errors).length} erreur(s) dans le formulaire`
    )}
</div>
```

##### 2.3 Drag & Drop sans alternative clavier
**Ligne** : `editProduct.tsx:198-221`
**Problème** : Impossible d'uploader une image au clavier

**Solution** :
```tsx
<div className="space-y-2">
    <Label htmlFor="image-upload">Image du produit</Label>

    {/* Zone drag & drop visible */}
    <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn("border-2 border-dashed rounded-lg p-6", ...)}
    >
        <div className="text-center">
            <Upload className="mx-auto h-12 w-12" />
            <p>Glissez-déposez une image ou</p>

            {/* Input file caché mais accessible */}
            <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageChange}
                className="sr-only"
            />
            <Button
                asChild
                variant="outline"
                className="mt-2"
            >
                <label htmlFor="image-upload" className="cursor-pointer">
                    Parcourir les fichiers
                </label>
            </Button>
        </div>
    </div>
</div>
```

##### 2.4 État de chargement non accessible
**Ligne** : `editProduct.tsx:247-250`

**Solution** :
```tsx
{processing && (
    <div
        className="flex items-center gap-2 text-sm text-emerald-600"
        role="status"
        aria-live="polite"
    >
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        <span>Enregistrement en cours...</span>
    </div>
)}
```

#### B. Problèmes Moyens ⚠️

##### 2.5 Focus trap manquant sur modal/overlay

**Solution** :
```tsx
import { FocusTrap } from '@/components/ui/focus-trap';

// Si dialog/modal présent
<FocusTrap>
    <Dialog>...</Dialog>
</FocusTrap>
```

##### 2.6 Contraste insuffisant sur certains textes

**Vérifier** :
```tsx
// Texte secondaire : text-slate-500
// Ratio minimum requis : 4.5:1
// Remplacer par text-slate-600 si nécessaire
```

---

### 3. **SEO** (Non applicable - Page Admin)

La page d'édition étant protégée par authentification, les critères SEO classiques ne s'appliquent pas. Cependant :

#### Bonnes pratiques à maintenir :
```tsx
// ✅ Titre de page descriptif
<Head title={`Édition - ${product.name}`} />

// ✅ Meta robots (déjà géré par middleware auth)
// Pas d'indexation nécessaire
```

---

### 4. **BEST PRACTICES**

#### A. Problèmes Critiques ❌

##### 4.1 Gestion d'erreur insuffisante
**Ligne** : `ProductController.php:71-75`

**Solution** :
```php
try {
    $this->productService->updateProduct(...);

    return redirect()->route('products.index')
        ->with('success', 'Produit mis à jour avec succès.');

} catch (ValidationException $e) {
    // Erreurs de validation
    return redirect()->back()
        ->withErrors($e->errors())
        ->withInput();

} catch (FileNotFoundException $e) {
    // Erreur upload fichier
    return redirect()->back()
        ->with('error', 'Image introuvable. Veuillez réessayer.')
        ->withInput();

} catch (\Exception $e) {
    // Log l'erreur pour debug
    \Log::error('Product update failed', [
        'product_id' => $product->id,
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ]);

    return redirect()->back()
        ->with('error', 'Une erreur est survenue. Veuillez réessayer.')
        ->withInput();
}
```

##### 4.2 Validation côté client manquante
**Impact** : Submit inutiles, mauvaise UX

**Solution** :
```tsx
const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!data.name.trim()) {
        newErrors.name = 'Le nom est requis';
    }

    if (!data.slug.trim()) {
        newErrors.slug = 'Le slug est requis';
    }

    if (data.weight_variants.some(v => !v.price || parseFloat(v.price) <= 0)) {
        newErrors.weight_variants = 'Prix invalide pour une variante';
    }

    setClientErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};

const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
        // Afficher toast d'erreur
        toast.error('Veuillez corriger les erreurs du formulaire');
        return;
    }
    submitForm(e, route('products.update', product.id), 'put');
};
```

##### 4.3 Pas de confirmation avant suppression d'image

**Solution** :
```tsx
const removeImage = () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) {
        return;
    }

    setData('image', null);
    if (imagePreview?.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
};
```

#### B. Sécurité 🔒

##### 4.4 Validation côté serveur robuste
**Déjà en place** ✅ : `UpdateProductRequest`

**Amélioration** :
```php
// UpdateProductRequest.php
public function rules(): array
{
    return [
        'name' => ['required', 'string', 'max:255'],
        'slug' => ['required', 'string', 'max:255', Rule::unique('products')->ignore($this->product)],
        'description' => ['nullable', 'string', 'max:5000'],
        'image' => [
            'nullable',
            'file',
            'image',
            'max:5120', // 5MB max
            'mimes:jpeg,png,jpg,webp',
            'dimensions:min_width=200,min_height=200,max_width=4000,max_height=4000'
        ],
        'weight_variants.*.price' => ['required', 'numeric', 'min:0', 'max:999999.99'],
        'weight_variants.*.stock_quantity' => ['required', 'integer', 'min:0', 'max:999999'],
    ];
}

public function messages(): array
{
    return [
        'image.max' => 'L\'image ne doit pas dépasser 5 MB.',
        'image.dimensions' => 'L\'image doit faire au moins 200x200 pixels et au maximum 4000x4000 pixels.',
    ];
}
```

##### 4.5 CSRF Token
**Déjà géré** ✅ par Laravel/Inertia

##### 4.6 Rate Limiting sur les uploads

**Ajouter** dans `routes/web.php` :
```php
Route::middleware(['auth', 'throttle:uploads'])->group(function () {
    Route::put('/products/{product}', [ProductController::class, 'update']);
});
```

**Configurer** dans `app/Providers/RouteServiceProvider.php` :
```php
RateLimiter::for('uploads', function (Request $request) {
    return Limit::perMinute(10)->by($request->user()?->id ?: $request->ip());
});
```

---

## ✅ PLAN D'IMPLÉMENTATION PAR PRIORITÉ

### 🔴 **PRIORITÉ 1 - Impact Majeur (1-2 jours)**

#### Task 1.1 : Lazy Loading de l'éditeur WYSIWYG
```tsx
// editProduct.tsx
import { lazy, Suspense } from 'react';

const WysiwygEditor = lazy(() => import('@/components/ui/wysiwyg-editor'));

const EditorSkeleton = () => (
    <div className="border rounded-lg p-4 h-64 animate-pulse bg-gray-100">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-300 rounded w-full mb-2" />
        <div className="h-4 bg-gray-300 rounded w-5/6" />
    </div>
);

// Dans le formulaire
<Suspense fallback={<EditorSkeleton />}>
    <WysiwygEditor
        value={data.detailed_description}
        onChange={(value) => handleFieldChange('detailed_description', value)}
    />
</Suspense>
```
**Impact** : -100KB bundle initial, LCP -0.5s

#### Task 1.2 : Compression d'image côté client
```bash
npm install browser-image-compression
```

```tsx
// Créer hooks/useImageCompression.ts
import imageCompression from 'browser-image-compression';

export const useImageCompression = () => {
    const compressImage = async (file: File) => {
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
            fileType: 'image/webp', // Convertir en WebP
        };

        try {
            return await imageCompression(file, options);
        } catch (error) {
            console.error('Compression failed:', error);
            return file; // Fallback
        }
    };

    return { compressImage };
};
```
**Impact** : Upload 70% plus rapide, moins de charge serveur

#### Task 1.3 : Labels ARIA et accessibilité formulaire
**Fichier** : Créer `components/form/AccessibleFormField.tsx`

```tsx
type AccessibleFormFieldProps = {
    label: string;
    id: string;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
    description?: string;
};

export const AccessibleFormField = ({
    label,
    id,
    required,
    error,
    children,
    description
}: AccessibleFormFieldProps) => {
    const errorId = `${id}-error`;
    const descId = `${id}-description`;

    return (
        <div className="space-y-2">
            <Label htmlFor={id} className={required ? 'required' : ''}>
                {label}
                {required && (
                    <span className="text-red-500 ml-1" aria-hidden="true">*</span>
                )}
            </Label>

            {description && (
                <p id={descId} className="text-sm text-gray-600">
                    {description}
                </p>
            )}

            {React.cloneElement(children as React.ReactElement, {
                id,
                'aria-required': required,
                'aria-invalid': !!error,
                'aria-describedby': [
                    error ? errorId : null,
                    description ? descId : null
                ].filter(Boolean).join(' ') || undefined,
            })}

            {error && (
                <p id={errorId} className="text-sm text-red-600" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
};
```

**Utilisation** :
```tsx
<AccessibleFormField
    label="Nom du produit"
    id="product-name"
    required
    error={errors.name}
>
    <Input
        value={data.name}
        onChange={(e) => handleFieldChange('name', e.target.value)}
    />
</AccessibleFormField>
```
**Impact** : Accessibilité 85+ → 95+

---

### 🟡 **PRIORITÉ 2 - Améliorations UX (2-3 jours)**

#### Task 2.1 : Debounce sur génération de slug
```bash
npm install use-debounce
```

```tsx
import { useDebouncedCallback } from 'use-debounce';

const debouncedSlugUpdate = useDebouncedCallback((name: string) => {
    if (autoSlug) {
        setData('slug', slugify(name));
    }
}, 300);
```

#### Task 2.2 : Validation temps réel
```tsx
const [validationErrors, setValidationErrors] = useState({});

const validateField = (field: string, value: any) => {
    const errors = { ...validationErrors };

    switch (field) {
        case 'name':
            if (!value.trim()) {
                errors.name = 'Le nom est requis';
            } else if (value.length > 255) {
                errors.name = 'Maximum 255 caractères';
            } else {
                delete errors.name;
            }
            break;
        // Autres champs...
    }

    setValidationErrors(errors);
};

// Dans handleFieldChange
const handleFieldChange = (field, value) => {
    setData(field, value);
    validateField(field, value);
};
```

#### Task 2.3 : Indicateur de progression upload
```tsx
const [uploadProgress, setUploadProgress] = useState(0);

// Dans submitForm, utiliser axios avec onUploadProgress
axios.post(url, formData, {
    onUploadProgress: (progressEvent) => {
        const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(progress);
    }
});

// Affichage
{processing && (
    <div className="space-y-2">
        <div className="flex items-center gap-2">
            <Loader2 className="animate-spin" />
            <span>Upload en cours... {uploadProgress}%</span>
        </div>
        <progress value={uploadProgress} max="100" className="w-full" />
    </div>
)}
```

#### Task 2.4 : Prévisualisation image optimisée
```tsx
// Afficher les dimensions et taille
{imagePreview && (
    <div className="space-y-2">
        <img
            src={imagePreview}
            alt="Aperçu"
            className="max-h-64 rounded-lg"
            onLoad={(e) => {
                const img = e.target as HTMLImageElement;
                console.log(`Dimensions: ${img.naturalWidth}x${img.naturalHeight}`);
            }}
        />
        {selectedImageFile && (
            <p className="text-sm text-gray-600">
                Taille: {(selectedImageFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
        )}
    </div>
)}
```

---

### 🟢 **PRIORITÉ 3 - Polish & Performance (3-5 jours)**

#### Task 3.1 : Code splitting par route
**Vite config** :
```js
// vite.config.js
export default {
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'wysiwyg': ['@/components/ui/wysiwyg-editor'],
                    'product-form': ['@/pages/product/editProduct'],
                }
            }
        }
    }
}
```

#### Task 3.2 : Memoization avancée
```tsx
const memoizedCategories = useMemo(() =>
    categories.map(c => ({ value: String(c.id), label: c.name })),
    [categories]
);

const memoizedWeightVariants = useMemo(() =>
    data.weight_variants,
    [data.weight_variants]
);
```

#### Task 3.3 : Service Worker pour cache
```tsx
// Cacher les catégories en local
if ('cacheStorage' in window) {
    caches.open('product-form-v1').then(cache => {
        cache.add('/api/categories');
    });
}
```

---

## 📊 RÉSULTATS ATTENDUS

### Scores Lighthouse (Page Admin - Desktop)

| Métrique | Avant | Après P1 | Après P2 | Après P3 |
|----------|-------|----------|----------|----------|
| **Performance** | 45-55 | 65-75 | 75-85 | 85-92 |
| **Accessibility** | 70-80 | 90-95 | 95-100 | 100 |
| **Best Practices** | 75-85 | 85-90 | 90-95 | 95-100 |

### Métriques Core Web Vitals

| Métrique | Avant | Objectif |
|----------|-------|----------|
| **LCP** | 3.5-4.5s | < 2.5s |
| **FID** | 200-400ms | < 100ms |
| **CLS** | 0.15-0.25 | < 0.1 |
| **TBT** | 600-900ms | < 300ms |

---

## 🔧 CHECKLIST D'IMPLÉMENTATION

### Phase 1 (Semaine 1)
- [ ] Lazy load WysiwygEditor
- [ ] Compression images client
- [ ] Labels ARIA complets
- [ ] Validation formulaire client
- [ ] Gestion erreurs robuste

### Phase 2 (Semaine 2)
- [ ] Debounce slug
- [ ] Validation temps réel
- [ ] Progress bar upload
- [ ] Prévisualisation optimisée
- [ ] Focus management

### Phase 3 (Semaine 3)
- [ ] Code splitting
- [ ] Memoization avancée
- [ ] Service Worker
- [ ] Tests E2E
- [ ] Documentation

---

## 📝 TESTS À EFFECTUER

### Lighthouse
```bash
# Desktop
lighthouse https://app.test/products/1/edit --preset=desktop --view

# Mobile
lighthouse https://app.test/products/1/edit --view
```

### Accessibilité
```bash
# axe-core CLI
npm install -g @axe-core/cli
axe https://app.test/products/1/edit --save results.json
```

### Performance
```bash
# WebPageTest
https://www.webpagetest.org/
```

---

**Date de création** : 2025-12-06
**Dernière mise à jour** : 2025-12-06
**Auteur** : Équipe Dev
