import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { DragEvent, FormEvent, lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ImagePlus, Loader2, Sparkles, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { useProductForm } from '@/hooks/useProductForm';
import type { Category, ProductFormData, ProductWeightVariant } from '@/types/product';
import WeightVariantManager from '@/components/product/weight-variant-manager';
import imageCompression from 'browser-image-compression';

// Lazy load the WYSIWYG editor to reduce initial bundle size (~372KB)
const WysiwygEditor = lazy(() => import('@/components/ui/wysiwyg-editor').then(module => ({ default: module.WysiwygEditor })));

type Product = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    detailed_description?: string | null;
    ingredients?: string | null;
    marketing_tags?: string | null;
    image: string | null;
    image_url?: string | null;
    price: number | string;
    promotional_price?: number | string | null;
    weight_kg?: number | string | null;
    category_id: number | null;
    is_featured: boolean;
    stock_quantity: number | string | null;
    calories_kcal?: number | string | null;
    protein_g?: number | string | null;
    carbs_g?: number | string | null;
    fat_g?: number | string | null;
    fiber_g?: number | string | null;
    updated_at?: string | null;
    category?: Category | null;
    weight_variants?: Array<{
        id?: number;
        weight_value: number | string;
        weight_unit: 'g' | 'kg';
        price: number | string;
        promotional_price?: number | string | null;
        stock_quantity: number | string;
        is_available: boolean;
    }>;
};

type PageProps = {
    categories?: Category[];
    product: Product;
};

export default function EditProduct() {
    const { props } = usePage<PageProps>();
    const categories = props.categories ?? [];
    const product = props.product;
    const pageErrors = props.errors || {};

    const resolvedCategoryId = useMemo(
        () => product?.category_id ?? product?.category?.id ?? null,
        [product]
    );

    const {
        data,
        setData,
        processing,
        errors: formErrors,
        autoSlug,
        setAutoSlug,
        imagePreview,
        setImagePreview,
        resetForm,
        submitForm,
        slugify,
    } = useProductForm();

    // Combine all errors: page errors, form errors, and client validation errors
    const errors = useMemo(() => {
        if (Object.keys(pageErrors).length > 0) return pageErrors;
        if (Object.keys(validationErrors).length > 0) return validationErrors;
        return formErrors;
    }, [pageErrors, validationErrors, formErrors]);

    const [isDragging, setIsDragging] = useState(false);
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
    const [isCompressing, setIsCompressing] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    const toStringOrEmpty = useCallback((value: unknown) => (value !== null && value !== undefined ? String(value) : ''), []);

    const hydrateFromProduct = useCallback(() => {
        if (!product) return;

        setAutoSlug(false);

        const prefilled: ProductFormData = {
            name: product.name ?? '',
            slug: product.slug ?? '',
            description: product.description ?? '',
            detailed_description: product.detailed_description ?? '',
            ingredients: product.ingredients ?? '',
            marketing_tags: product.marketing_tags ?? '',
            image: selectedImageFile, // Préserver l'image sélectionnée
            category_id: resolvedCategoryId !== null ? String(resolvedCategoryId) : '',
            is_featured: Boolean(product.is_featured),
            calories_kcal: toStringOrEmpty(product.calories_kcal),
            protein_g: toStringOrEmpty(product.protein_g),
            carbs_g: toStringOrEmpty(product.carbs_g),
            fat_g: toStringOrEmpty(product.fat_g),
            fiber_g: toStringOrEmpty(product.fiber_g),
            weight_variants: product.weight_variants && product.weight_variants.length > 0
                ? product.weight_variants.map(v => ({
                    id: v.id,
                    weight_value: toStringOrEmpty(v.weight_value),
                    weight_unit: v.weight_unit,
                    price: toStringOrEmpty(v.price),
                    promotional_price: toStringOrEmpty(v.promotional_price),
                    stock_quantity: toStringOrEmpty(v.stock_quantity),
                    is_available: Boolean(v.is_available),
                }))
                : [{
                    weight_value: '',
                    weight_unit: 'g' as const,
                    price: '',
                    promotional_price: '',
                    stock_quantity: '0',
                    is_available: true,
                }],
        };

        setData(prefilled);

        // Ne changer l'aperçu que si aucune nouvelle image n'a été sélectionnée
        if (!selectedImageFile) {
            const rawImage = product.image_url ?? product.image ?? null;

            if (typeof rawImage === 'string' && rawImage.trim() !== '') {
                if (/^https?:\/\//i.test(rawImage) || rawImage.startsWith('/') || rawImage.startsWith('data:')) {
                    setImagePreview(rawImage);
                } else {
                    setImagePreview(`/storage/${rawImage}`);
                }
            } else {
                setImagePreview(null);
            }
        }
    }, [product, resolvedCategoryId, setAutoSlug, setData, setImagePreview, toStringOrEmpty, selectedImageFile]);

    useEffect(() => {
        hydrateFromProduct();
    }, [hydrateFromProduct]);

    useEffect(() => {
        if (!data.category_id && resolvedCategoryId !== null) {
            setData('category_id', String(resolvedCategoryId));
        }
    }, [data.category_id, resolvedCategoryId, setData]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Validate required fields
        if (!data.name || data.name.trim() === '') {
            newErrors.name = 'Le nom du produit est requis';
        }

        if (!data.category_id || data.category_id === '') {
            newErrors.category_id = 'La catégorie est requise';
        }

        // Validate weight variants
        if (!data.weight_variants || data.weight_variants.length === 0) {
            newErrors.weight_variants = 'Au moins une déclinaison de poids est requise';
        } else {
            data.weight_variants.forEach((variant, index) => {
                if (!variant.weight_value || variant.weight_value === '') {
                    newErrors[`weight_variants.${index}.weight_value`] = 'Le poids est requis';
                }
                if (!variant.price || variant.price === '') {
                    newErrors[`weight_variants.${index}.price`] = 'Le prix est requis';
                }
                if (parseFloat(String(variant.price)) <= 0) {
                    newErrors[`weight_variants.${index}.price`] = 'Le prix doit être supérieur à 0';
                }
            });
        }

        // Validate image size if present
        if (selectedImageFile && selectedImageFile.size > 5 * 1024 * 1024) {
            newErrors.image = 'L\'image ne doit pas dépasser 5MB';
        }

        setValidationErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Clear previous validation errors
        setValidationErrors({});

        // Validate form before submission
        if (!validateForm()) {
            // Scroll to first error
            const firstError = document.querySelector('[aria-invalid="true"]');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                (firstError as HTMLElement).focus();
            }
            return;
        }

        // Submit if validation passes
        submitForm(event, route('products.update', product.id), 'put');
    };

    const handleFieldChange = (field: keyof ProductFormData, value: string | boolean | File | null) => {
        // Using `as any` to handle the generic nature of the event handler.
        // This is a trade-off for having a single handler function.
        setData(field, value as any);

        if (field === 'name' && autoSlug) {
            setData('slug', slugify(String(value || '')));
        }

        // Clear validation error for this field when user types
        if (validationErrors[field]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const compressImage = async (file: File): Promise<File> => {
        // Only compress if file is larger than 500KB
        if (file.size <= 500 * 1024) {
            return file;
        }

        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
            fileType: file.type as 'image/jpeg' | 'image/png' | 'image/webp',
        };

        try {
            setIsCompressing(true);
            const compressedFile = await imageCompression(file, options);
            console.log(`Image compressed: ${(file.size / 1024).toFixed(2)}KB → ${(compressedFile.size / 1024).toFixed(2)}KB`);
            return compressedFile;
        } catch (error) {
            console.error('Error compressing image:', error);
            return file; // Return original if compression fails
        } finally {
            setIsCompressing(false);
        }
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;

        if (!file) {
            setData('image', null);
            setSelectedImageFile(null);
            setImagePreview(null);
            return;
        }

        // Compress the image before setting it
        const compressedFile = await compressImage(file);

        setData('image', compressedFile);
        setSelectedImageFile(compressedFile);

        if (imagePreview && imagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(imagePreview);
        }

        setImagePreview(URL.createObjectURL(compressedFile));
    };

    const removeImage = () => {
        setData('image', null);
        setSelectedImageFile(null);
        if (imagePreview && imagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(imagePreview);
        }
        setImagePreview(null);
    };

    const handleReset = () => {
        resetForm();
        setSelectedImageFile(null);
        hydrateFromProduct();
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            // Compress the image before setting it
            const compressedFile = await compressImage(file);

            setData('image', compressedFile);
            setSelectedImageFile(compressedFile);
            if (imagePreview && imagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }
            setImagePreview(URL.createObjectURL(compressedFile));
        }
    };

    return (
        <AppLayout>
            <Head title={`Édition - ${product.name}`} />

            <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-50 via-white to-slate-100/50" />

            <div className="min-h-screen pb-20">
                {/* Header */}
                <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
                    <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Button asChild variant="ghost" size="sm" className="gap-2">
                                    <a href={route('products.index')}>
                                        <ArrowLeft className="h-4 w-4" />
                                        Retour
                                    </a>
                                </Button>
                                <div className="h-6 w-px bg-slate-200" />
                                <div>
                                    <h1 className="text-xl font-semibold text-slate-900">Modifier {product.name}</h1>
                                    <p className="text-sm text-slate-500">Mettez à jour les informations du produit</p>
                                </div>
                            </div>
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
                        </div>
                    </div>
                </header>

                {/* Form */}
                <form onSubmit={handleSubmit} className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="space-y-6">
                        {/* Afficher les erreurs globales s'il y en a */}
                        {Object.keys(errors).length > 0 && (
                            <div
                                className="rounded-lg border-2 border-red-300 bg-red-50 p-4 shadow-sm"
                                role="alert"
                                aria-live="assertive"
                                aria-atomic="true"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0" aria-hidden="true">
                                        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-base font-semibold text-red-900 mb-2" id="form-errors-heading">
                                            Veuillez corriger les erreurs suivantes :
                                        </h3>
                                        <ul className="space-y-1 text-sm text-red-800" aria-labelledby="form-errors-heading">
                                            {Object.entries(errors).map(([field, error]) => (
                                                <li key={field} className="flex items-start gap-2">
                                                    <span className="text-red-600 mt-0.5" aria-hidden="true">•</span>
                                                    <span><strong className="font-medium">{field}:</strong> {error}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Basic Information */}
                        <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
                            <CardHeader className="bg-slate-50/50">
                                <CardTitle className="text-base font-medium text-slate-900">Informations de base</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 p-6">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                                            Nom du produit <span className="text-red-500" aria-label="requis">*</span>
                                        </Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={data.name}
                                            onChange={(e) => handleFieldChange('name', e.target.value)}
                                            placeholder="Ex: Bsissa artisanale premium"
                                            className="border-slate-300"
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

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="slug" className="text-sm font-medium text-slate-700">
                                                Slug URL
                                            </Label>
                                            <div className="flex items-center gap-2">
                                                <Checkbox
                                                    id="auto_slug"
                                                    checked={autoSlug}
                                                    onCheckedChange={(checked) => setAutoSlug(Boolean(checked))}
                                                    aria-label="Générer automatiquement le slug à partir du nom du produit"
                                                />
                                                <Label htmlFor="auto_slug" className="text-xs text-slate-600">
                                                    Auto
                                                </Label>
                                            </div>
                                        </div>
                                        <Input
                                            id="slug"
                                            name="slug"
                                            value={data.slug}
                                            onChange={(e) => handleFieldChange('slug', e.target.value)}
                                            placeholder="bsissa-artisanale-premium"
                                            disabled={autoSlug}
                                            className="border-slate-300 disabled:bg-slate-50"
                                            aria-invalid={!!errors.slug}
                                            aria-describedby={errors.slug ? "slug-error" : autoSlug ? "slug-help" : undefined}
                                        />
                                        {autoSlug && (
                                            <p id="slug-help" className="text-xs text-slate-500">
                                                Le slug est généré automatiquement à partir du nom
                                            </p>
                                        )}
                                        {errors.slug && (
                                            <p id="slug-error" className="text-sm text-red-600" role="alert">
                                                {errors.slug}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category_id" className="text-sm font-medium text-slate-700">
                                        Catégorie <span className="text-red-500" aria-label="requis">*</span>
                                    </Label>
                                    <Select
                                        value={data.category_id || undefined}
                                        defaultValue={resolvedCategoryId !== null ? String(resolvedCategoryId) : undefined}
                                        onValueChange={(value) => handleFieldChange('category_id', value)}
                                    >
                                        <SelectTrigger
                                            className="border-slate-300"
                                            aria-required="true"
                                            aria-invalid={!!errors.category_id}
                                            aria-describedby={errors.category_id ? "category-error" : undefined}
                                        >
                                            <SelectValue placeholder="Sélectionnez une catégorie" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={String(category.id)}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.category_id && (
                                        <p id="category-error" className="text-sm text-red-600" role="alert">
                                            {errors.category_id}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-sm font-medium text-slate-700">
                                        Description courte
                                    </Label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={data.description}
                                        onChange={(e) => handleFieldChange('description', e.target.value)}
                                        placeholder="Décrivez votre produit en bref..."
                                        rows={3}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                        aria-invalid={!!errors.description}
                                        aria-describedby={errors.description ? "description-error" : undefined}
                                    />
                                    {errors.description && (
                                        <p id="description-error" className="text-sm text-red-600" role="alert">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="detailed_description" className="text-sm font-medium text-slate-700">
                                        Description détaillée
                                    </Label>
                                    <Suspense fallback={
                                        <div className="border border-slate-300 rounded-lg overflow-hidden bg-white">
                                            <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 p-2">
                                                <div className="h-8 w-24 bg-slate-200 rounded animate-pulse" />
                                                <div className="h-8 w-24 bg-slate-200 rounded animate-pulse" />
                                                <div className="h-8 w-24 bg-slate-200 rounded animate-pulse" />
                                            </div>
                                            <div className="min-h-[200px] px-3 py-2">
                                                <div className="space-y-2">
                                                    <div className="h-4 bg-slate-100 rounded animate-pulse w-3/4" />
                                                    <div className="h-4 bg-slate-100 rounded animate-pulse w-full" />
                                                    <div className="h-4 bg-slate-100 rounded animate-pulse w-5/6" />
                                                </div>
                                            </div>
                                        </div>
                                    }>
                                        <WysiwygEditor
                                            value={data.detailed_description || ''}
                                            onChange={(value) => handleFieldChange('detailed_description', value)}
                                            placeholder="Décrivez votre produit en détail avec mise en forme..."
                                        />
                                    </Suspense>
                                    {errors.detailed_description && <p className="text-sm text-red-600">{errors.detailed_description}</p>}
                                </div>

                                <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/50 p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-emerald-100 p-2" aria-hidden="true">
                                            <Sparkles className="h-4 w-4 text-emerald-600" />
                                        </div>
                                        <div>
                                            <Label htmlFor="is_featured" className="text-sm font-medium text-slate-900 cursor-pointer">
                                                Produit en vedette
                                            </Label>
                                            <p id="is_featured-description" className="text-xs text-slate-600">
                                                Afficher ce produit sur la page d'accueil
                                            </p>
                                        </div>
                                    </div>
                                    <Checkbox
                                        id="is_featured"
                                        checked={data.is_featured}
                                        onCheckedChange={(checked) => handleFieldChange('is_featured', Boolean(checked))}
                                        aria-describedby="is_featured-description"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Weight Variants */}
                        <Card className="border-slate-200 bg-white shadow-sm">
                            <CardHeader className="bg-slate-50/50">
                                <CardTitle className="text-base font-medium text-slate-900">Déclinaisons de poids</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <WeightVariantManager
                                    variants={data.weight_variants}
                                    onChange={(variants) => setData('weight_variants', variants)}
                                    errors={errors as Record<string, string>}
                                />
                            </CardContent>
                        </Card>

                        {/* Optional Details */}
                        <Card className="border-slate-200 bg-white shadow-sm">
                            <CardHeader className="bg-slate-50/50">
                                <CardTitle className="text-base font-medium text-slate-900">Détails complémentaires (optionnel)</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 p-6">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="ingredients" className="text-sm font-medium text-slate-700">
                                            Ingrédients
                                        </Label>
                                        <Input
                                            id="ingredients"
                                            value={data.ingredients}
                                            onChange={(e) => handleFieldChange('ingredients', e.target.value)}
                                            placeholder="Farine d'orge, épices..."
                                            className="border-slate-300"
                                        />
                                        {errors.ingredients && <p className="text-sm text-red-600">{errors.ingredients}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="marketing_tags" className="text-sm font-medium text-slate-700">
                                            Tags marketing
                                        </Label>
                                        <Input
                                            id="marketing_tags"
                                            value={data.marketing_tags}
                                            onChange={(e) => handleFieldChange('marketing_tags', e.target.value)}
                                            placeholder="Bio, Sans gluten..."
                                            className="border-slate-300"
                                        />
                                        {errors.marketing_tags && <p className="text-sm text-red-600">{errors.marketing_tags}</p>}
                                    </div>
                                </div>

                                {/* Nutritional Information */}
                                <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50/30 p-4">
                                    <h3 className="text-sm font-medium text-slate-900">Valeurs nutritionnelles (pour 100g)</h3>
                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                                        <div className="space-y-2">
                                            <Label htmlFor="calories_kcal" className="text-xs text-slate-600">
                                                Calories (kcal)
                                            </Label>
                                            <Input
                                                id="calories_kcal"
                                                type="number"
                                                min="0"
                                                step="0.1"
                                                value={data.calories_kcal}
                                                onChange={(e) => handleFieldChange('calories_kcal', e.target.value)}
                                                placeholder="0"
                                                className="border-slate-300"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="protein_g" className="text-xs text-slate-600">
                                                Protéines (g)
                                            </Label>
                                            <Input
                                                id="protein_g"
                                                type="number"
                                                min="0"
                                                step="0.1"
                                                value={data.protein_g}
                                                onChange={(e) => handleFieldChange('protein_g', e.target.value)}
                                                placeholder="0"
                                                className="border-slate-300"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="carbs_g" className="text-xs text-slate-600">
                                                Glucides (g)
                                            </Label>
                                            <Input
                                                id="carbs_g"
                                                type="number"
                                                min="0"
                                                step="0.1"
                                                value={data.carbs_g}
                                                onChange={(e) => handleFieldChange('carbs_g', e.target.value)}
                                                placeholder="0"
                                                className="border-slate-300"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="fat_g" className="text-xs text-slate-600">
                                                Lipides (g)
                                            </Label>
                                            <Input
                                                id="fat_g"
                                                type="number"
                                                min="0"
                                                step="0.1"
                                                value={data.fat_g}
                                                onChange={(e) => handleFieldChange('fat_g', e.target.value)}
                                                placeholder="0"
                                                className="border-slate-300"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="fiber_g" className="text-xs text-slate-600">
                                                Fibres (g)
                                            </Label>
                                            <Input
                                                id="fiber_g"
                                                type="number"
                                                min="0"
                                                step="0.1"
                                                value={data.fiber_g}
                                                onChange={(e) => handleFieldChange('fiber_g', e.target.value)}
                                                placeholder="0"
                                                className="border-slate-300"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Image Upload - Moved to End */}
                        <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
                            <CardHeader className="bg-slate-50/50">
                                <CardTitle className="text-base font-medium text-slate-900">Image du produit</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                {isCompressing && (
                                    <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Compression de l'image en cours...
                                    </div>
                                )}
                                {!imagePreview ? (
                                    <div
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        className={cn(
                                            "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-all",
                                            isDragging
                                                ? "border-emerald-500 bg-emerald-50/50"
                                                : "border-slate-300 bg-slate-50/30 hover:border-emerald-400 hover:bg-emerald-50/30",
                                            isCompressing && "pointer-events-none opacity-50"
                                        )}
                                    >
                                        <input
                                            id="product-image"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                            disabled={isCompressing}
                                            aria-label="Sélectionner une image pour le produit"
                                            aria-describedby={errors.image ? "image-error" : "image-help"}
                                        />
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="rounded-full bg-emerald-100 p-4">
                                                <Upload className="h-8 w-8 text-emerald-600" />
                                            </div>
                                            <div className="text-center">
                                                <label htmlFor="product-image" className="cursor-pointer">
                                                    <span className="text-base font-medium text-slate-900 hover:text-emerald-600">
                                                        Cliquez pour télécharger
                                                    </span>
                                                    <span className="text-slate-600"> ou glissez-déposez</span>
                                                </label>
                                                <p id="image-help" className="mt-1 text-sm text-slate-500">PNG, JPG ou WEBP (max. 5MB)</p>
                                                <p className="mt-1 text-xs text-slate-400">Les images {'>'}  500KB seront automatiquement compressées</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative overflow-hidden rounded-xl">
                                        <img
                                            src={imagePreview}
                                            alt={`Aperçu de l'image du produit ${data.name || 'sélectionnée'}`}
                                            className="h-64 w-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="sm"
                                            onClick={removeImage}
                                            className="absolute top-3 right-3 gap-2 bg-white/90 hover:bg-white"
                                            aria-label="Supprimer l'image du produit"
                                        >
                                            <X className="h-4 w-4" aria-hidden="true" />
                                            Supprimer
                                        </Button>
                                        <label htmlFor="product-image" className="absolute bottom-3 right-3">
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                size="sm"
                                                className="gap-2 bg-white/90 hover:bg-white"
                                                asChild
                                            >
                                                <span>
                                                    <ImagePlus className="h-4 w-4" />
                                                    Changer
                                                </span>
                                            </Button>
                                        </label>
                                        <input
                                            id="product-image"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                            aria-label="Changer l'image du produit"
                                        />
                                    </div>
                                )}
                                {errors.image && (
                                    <p id="image-error" className="mt-2 text-sm text-red-600" role="alert">
                                        {errors.image}
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        <div
                            className="sticky bottom-0 z-10 flex items-center justify-end gap-3 rounded-lg border border-slate-200 bg-white px-6 py-4 shadow-lg"
                            role="group"
                            aria-label="Actions du formulaire"
                        >
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleReset}
                                disabled={processing}
                                aria-label="Réinitialiser le formulaire aux valeurs d'origine"
                            >
                                Réinitialiser
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                                aria-label={processing ? "Enregistrement du produit en cours" : "Enregistrer les modifications du produit"}
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                                        Enregistrement...
                                    </>
                                ) : (
                                    'Mettre à jour le produit'
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
