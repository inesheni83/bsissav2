import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { useState, useMemo } from 'react';
import PublicLayout from '@/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type ProductCategory = {
    id: number;
    name: string;
} | null;

type WeightVariant = {
    id: number;
    weight_value: number;
    weight_unit: 'g' | 'kg';
    price: number;
    promotional_price?: number | null;
    stock_quantity: number;
    is_available: boolean;
};

type Product = {
    id: number;
    name: string;
    slug?: string;
    description: string;
    detailed_description?: string | null;
    ingredients?: string | null;
    image: string | null;
    is_featured: boolean;
    category: ProductCategory;
    weight_variants: WeightVariant[];
};

type ProductShowProps = {
    product: Product;
    relatedProducts: Product[];
};

export default function ProductShow({ product, relatedProducts }: ProductShowProps) {
    const [quantity, setQuantity] = useState<number>(1);
    const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);

    // Trier les variantes par poids (du plus petit au plus grand)
    const sortedVariants = useMemo(() => {
        if (!product.weight_variants || product.weight_variants.length === 0) return [];
        return [...product.weight_variants].sort((a, b) => {
            const aWeightInGrams = a.weight_unit === 'kg' ? a.weight_value * 1000 : a.weight_value;
            const bWeightInGrams = b.weight_unit === 'kg' ? b.weight_value * 1000 : b.weight_value;
            return aWeightInGrams - bWeightInGrams;
        });
    }, [product.weight_variants]);

    // Sélectionner la première variante par défaut
    const selectedVariant = selectedVariantId
        ? sortedVariants.find(v => v.id === selectedVariantId) || sortedVariants[0]
        : sortedVariants[0];

    const addToCart = () => {
        if (!selectedVariant) return;

        router.post(
            '/cart/items',
            {
                product_id: product.id,
                variant_id: selectedVariant.id,
                quantity,
            },
            { preserveScroll: true },
        );
    };

    return (
        <PublicLayout>
            <Head title={product.name} />

            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
                <div className="flex items-center justify-between">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm text-emerald-700 hover:text-emerald-900">
                        <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
                    </Link>
                    {product.category && (
                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                            {product.category.name}
                        </span>
                    )}
                </div>

                <div className="grid gap-8 lg:grid-cols-2 items-start">
                    <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-[0_25px_45px_-25px_rgba(37,99,45,0.25)]">
                        {product.image ? (
                            <img src={`/storage/${product.image}`} alt={product.name} className="h-[420px] w-full object-cover" />
                        ) : (
                            <div className="flex h-[420px] w-full items-center justify-center bg-emerald-50 text-emerald-300 text-6xl">🛍️</div>
                        )}

                        {/* Étiquette Stock */}
                        {selectedVariant && (
                            <div className="absolute top-4 left-4">
                                <span className="inline-flex items-center rounded-full border border-emerald-200 bg-white/90 px-3 py-1 text-xs font-semibold text-emerald-900 shadow-sm">
                                    Stock {selectedVariant.is_available && selectedVariant.stock_quantity > 0 ? `${selectedVariant.stock_quantity}` : 'Rupture'}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-3">
                            <h1 className="text-3xl font-bold text-emerald-900" style={{ fontFamily: '"Playfair Display", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>
                                {product.name}
                            </h1>
                            <p className="text-sm text-emerald-900/70 leading-relaxed">{product.description || "Aucune description n'est disponible pour ce produit pour le moment."}</p>
                        </div>

                        <div className="space-y-4 rounded-2xl border border-emerald-100 bg-white p-6 shadow-[0_25px_45px_-25px_rgba(37,99,45,0.25)]">
                            {sortedVariants.length > 0 ? (
                                <>
                                    {/* Boutons de sélection des poids */}
                                    <div className="flex flex-wrap gap-2">
                                        {sortedVariants.map((variant) => (
                                            <button
                                                key={variant.id}
                                                type="button"
                                                onClick={() => setSelectedVariantId(variant.id)}
                                                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                                                    selectedVariant?.id === variant.id
                                                        ? 'border-emerald-600 bg-emerald-600 text-white shadow-md'
                                                        : 'border-emerald-200 bg-white text-emerald-700 hover:border-emerald-400 hover:bg-emerald-50'
                                                }`}
                                            >
                                                {variant.weight_value} {variant.weight_unit}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Affichage des détails de la variante sélectionnée */}
                                    {selectedVariant && (
                                        <>
                                            {/* Prix */}
                                            <div className="flex items-baseline gap-2">
                                                {selectedVariant.promotional_price && selectedVariant.promotional_price > 0 ? (
                                                    <>
                                                        <p className="text-3xl font-extrabold text-red-600" style={{ fontFamily: '"Playfair Display", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>
                                                            {selectedVariant.promotional_price.toFixed(2)} TND
                                                        </p>
                                                        <p className="text-lg text-slate-400 line-through">{selectedVariant.price.toFixed(2)} TND</p>
                                                    </>
                                                ) : (
                                                    <p className="text-3xl font-extrabold text-emerald-800" style={{ fontFamily: '"Playfair Display", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>
                                                        {selectedVariant.price.toFixed(2)} TND
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <label htmlFor="quantity" className="text-xs uppercase text-emerald-900/60 tracking-widest">
                                                        Quantité
                                                    </label>
                                                    <Input
                                                        id="quantity"
                                                        type="number"
                                                        min={1}
                                                        max={selectedVariant.stock_quantity}
                                                        step={1}
                                                        value={quantity}
                                                        onChange={(event) => {
                                                            const value = parseInt(event.target.value) || 1;
                                                            setQuantity(Math.max(1, Math.min(selectedVariant.stock_quantity, value)));
                                                        }}
                                                        onBlur={(event) => {
                                                            // S'assurer que la valeur est un entier valide au blur
                                                            const value = parseInt(event.target.value) || 1;
                                                            setQuantity(Math.max(1, Math.min(selectedVariant.stock_quantity, value)));
                                                        }}
                                                        className="mt-1 h-10 w-24 rounded-full border-emerald-200 text-center"
                                                        disabled={!selectedVariant.is_available || selectedVariant.stock_quantity === 0}
                                                    />
                                                </div>
                                                <Button
                                                    onClick={addToCart}
                                                    className="ml-auto inline-flex items-center gap-2 rounded-full bg-emerald-700 px-6 py-3 text-white hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    disabled={!selectedVariant.is_available || selectedVariant.stock_quantity === 0}
                                                >
                                                    <ShoppingCart className="w-4 h-4" /> Ajouter au panier
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </>
                            ) : (
                                <p className="text-sm text-emerald-900/60">Aucune déclinaison de poids disponible</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Description détaillée */}
                {product.detailed_description && (
                    <div className="mt-12">
                        <div className="rounded-3xl border border-emerald-100 bg-white p-8 shadow-[0_25px_45px_-25px_rgba(37,99,45,0.25)]">
                            <h2 className="mb-6 text-2xl font-bold text-emerald-900" style={{ fontFamily: '"Playfair Display", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>
                                Description détaillée
                            </h2>
                            <div
                                className="prose prose-emerald prose-sm max-w-none text-emerald-900/80"
                                dangerouslySetInnerHTML={{ __html: product.detailed_description }}
                            />
                        </div>
                    </div>
                )}

                {/* Ingrédients */}
                {product.ingredients && (
                    <div className="mt-12">
                        <div className="rounded-3xl border border-emerald-100 bg-white p-8 shadow-[0_25px_45px_-25px_rgba(37,99,45,0.25)]">
                            <h2 className="mb-6 text-2xl font-bold text-emerald-900" style={{ fontFamily: '"Playfair Display", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>
                                Ingrédients
                            </h2>
                            <p className="text-emerald-900/80 leading-relaxed">
                                {product.ingredients}
                            </p>
                        </div>
                    </div>
                )}

                {/* Produits de la même catégorie */}
                {relatedProducts && relatedProducts.length > 0 && (
                    <div className="mt-12">
                        <h2 className="mb-6 text-2xl font-bold text-emerald-900" style={{ fontFamily: '"Playfair Display", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>
                            Produits similaires
                        </h2>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {relatedProducts.map((relatedProduct) => {
                                const minPrice = relatedProduct.weight_variants.reduce((min, variant) => {
                                    const price = variant.promotional_price && variant.promotional_price > 0 ? variant.promotional_price : variant.price;
                                    return price < min ? price : min;
                                }, Infinity);

                                return (
                                    <Link
                                        key={relatedProduct.id}
                                        href={`/products/${relatedProduct.id}`}
                                        className="group overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-[0_25px_45px_-25px_rgba(37,99,45,0.25)] transition-all hover:shadow-[0_35px_60px_-15px_rgba(37,99,45,0.35)]"
                                    >
                                        <div className="relative h-64 overflow-hidden bg-emerald-50">
                                            {relatedProduct.image ? (
                                                <img
                                                    src={`/storage/${relatedProduct.image}`}
                                                    alt={relatedProduct.name}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-6xl text-emerald-300">
                                                    🛍️
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6">
                                            <h3 className="mb-2 text-lg font-bold text-emerald-900 line-clamp-2" style={{ fontFamily: '"Playfair Display", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>
                                                {relatedProduct.name}
                                            </h3>
                                            {relatedProduct.description && (
                                                <p className="mb-4 text-sm text-emerald-900/70 line-clamp-2">
                                                    {relatedProduct.description}
                                                </p>
                                            )}
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm text-emerald-800">
                                                    <span className="font-normal">À partir de </span>
                                                    <span className="font-bold" style={{ fontFamily: '"Playfair Display", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>
                                                        {minPrice.toFixed(2)} TND
                                                    </span>
                                                </p>
                                                <span className="text-sm text-emerald-700 group-hover:underline">
                                                    Voir →
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}

