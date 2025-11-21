import { Head, Link, useForm, router } from '@inertiajs/react';
import { ArrowRight, Package, Search, ShoppingCart, SlidersHorizontal, Star, X, Leaf, Sparkles, Heart, Users } from 'lucide-react';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { home } from '@/routes';
import PublicLayout from '@/layouts/public-layout';
import HeroCarousel from '@/components/hero-carousel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

type Category = { id: number; name: string };

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
    description: string;
    image: string | null;
    image_url?: string | null;
    price: number | string;
    promotional_price?: number | string | null;
    category?: Category | null;
    is_featured?: boolean;
    stock_quantity?: number;
    weight_variants: WeightVariant[];
};

type Paginator<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
};

type GalleryImage = {
    id: number;
    name: string;
    image_url: string | null;
};

type HomePageProps = {
    products: Paginator<Product>;
    categories: Category[];
    galleryImages: GalleryImage[];
    filters: { search?: string; category_id?: string | number; featured?: string; in_stock?: string };
};

export default function Homepage({ products, categories, galleryImages, filters }: HomePageProps) {
    const [quantities, setQuantities] = useState<Record<number, number>>(() =>
        products.data.reduce<Record<number, number>>((acc, product) => {
            acc[product.id] = 1;
            return acc;
        }, {}),
    );
    const [selectedVariants, setSelectedVariants] = useState<Record<number, number>>({});
    const [toast, setToast] = useState<{ id: number; message: string } | null>(null);
    const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    // Controls visibility of the advanced product filters panel.
    const [filtersOpen, setFiltersOpen] = useState(false);

    useEffect(() => {
        setQuantities((prev) => {
            const next: Record<number, number> = {};
            products.data.forEach((product) => {
                next[product.id] = prev[product.id] ?? 1;
            });
            return next;
        });
    }, [products.data]);

    const { data, setData, get } = useForm({
        search: filters.search || '',
        category_id: filters.category_id ? String(filters.category_id) : '',
        featured: filters.featured || '',
        in_stock: filters.in_stock || '',
    });

    const submitFilters = (event: FormEvent) => {
        event.preventDefault();
        get(home({ query: data }).url, { preserveState: true, preserveScroll: true });
    };

    const clearFilters = () => {
        setData({ search: '', category_id: '', featured: '', in_stock: '' });
        get(home().url, { preserveState: true, preserveScroll: true });
    };

    const updateQuantity = (productId: number, value: number) => {
        setQuantities((prev) => ({
            ...prev,
            [productId]: Math.max(1, value),
        }));
    };

    const showToast = (message: string) => {
        if (toastTimerRef.current) {
            clearTimeout(toastTimerRef.current);
        }

        const id = Date.now();
        setToast({ id, message });
        toastTimerRef.current = setTimeout(() => setToast(null), 3000);
    };

    const addToCart = (product: Product, variantId: number) => {
        const quantity = quantities[product.id] ?? 1;

        router.post(
            route('cart.items.store'),
            {
                product_id: product.id,
                variant_id: variantId,
                quantity,
            },
            {
                preserveScroll: true,
                onSuccess: () => showToast(`${product.name} ajoute au panier`),
                onError: () => showToast(`Impossible d'ajouter ${product.name} au panier`),
            },
        );
    };

    // Shared filter form markup reused for desktop and mobile panels.
    const filtersForm = useMemo(
        () => (
            <form onSubmit={submitFilters} className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="search">Rechercher</Label>
                    <Input id="search" value={data.search} onChange={(event) => setData('search', event.target.value)} placeholder="Nom ou description..." />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="category_id">Categorie</Label>
                    <Select value={data.category_id || undefined} onValueChange={(value) => setData('category_id', value || '')}>
                        <SelectTrigger>
                            <SelectValue placeholder="Toutes les categories" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((category) => (
                                <SelectItem key={category.id} value={String(category.id)}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2">
                    <Checkbox id="in_stock" checked={data.in_stock === '1'} onCheckedChange={(checked) => setData('in_stock', checked ? '1' : '')} />
                    <Label htmlFor="in_stock" className="text-sm text-gray-600 font-normal cursor-pointer">En stock</Label>
                </div>

                <div className="flex gap-3">
                    <Button type="submit" className="w-full shadow hover:shadow-lg">
                        <Search className="w-4 h-4 mr-2" /> Rechercher
                    </Button>
                    <Button type="button" variant="outline" onClick={clearFilters} className="w-full hover:shadow">
                        Effacer
                    </Button>
                </div>
            </form>
        ),
        [data.search, data.category_id, data.in_stock, categories, submitFilters, clearFilters, setData],
    );

    return (
        <>
            <Head title="Accueil">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
                <link href="https://fonts.bunny.net/css?family=playfair-display:400,600,700,800" rel="stylesheet" />
                <meta name="description" content="Decouvrez nos produits et nos meilleures recettes." />
                <style>{`
                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                `}</style>
            </Head>
            <PublicLayout>
                {toast && (
                    <div
                        key={toast.id}
                        className="fixed right-6 top-24 z-[60] flex items-center gap-3 rounded-xl bg-emerald-600 px-4 py-3 text-white shadow-lg"
                        role="status"
                        aria-live="polite"
                    >
                        <ShoppingCart className="h-5 w-5" />
                        <span className="text-sm font-medium">{toast.message}</span>
                    </div>
                )}

                <div className="max-w-none">
                    <section className="relative isolate min-h-[70vh] md:min-h-[80vh]">
                        <div className="absolute inset-0 -z-10">
                            <HeroCarousel
                                images={galleryImages}
                                autoPlayInterval={5000}
                                className="h-full"
                            />
                            <div className="absolute inset-0 bg-neutral-950/60" />
                        </div>

                        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center text-white">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 ring-1 ring-white/20">
                                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                <span className="text-xs md:text-sm tracking-wider uppercase text-white/90">Recette ancestrale - 3000 ans</span>
                            </div>

                            <h1
                                className="mt-5 font-extrabold tracking-tight text-4xl md:text-6xl leading-tight"
                                style={{ fontFamily: '"Playfair Display", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
                            >
                                Bsissa
                                <br className="hidden md:block" />
                                Tresors du Terroir
                            </h1>

                            <p className="mt-4 text-white/90 text-sm md:text-base">100% Naturel - 100% Vegan - 100% Fait Maison</p>

                            <p className="mt-4 mx-auto max-w-3xl text-white/80 text-sm md:text-base">
                                Decouvrez la Bsissa, un superaliment tunisien traditionnel qui nourrit votre corps et eveille vos sens. Une poudre magique pour un petit dejeuner sain et savoureux.
                            </p>

                            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/products">
                                    <Button className="bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 hover:shadow-xl inline-flex items-center gap-2">
                                        Acheter en ligne
                                        <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </Link>
                                <Link href="#benefits">
                                    <Button
                                        variant="outline"
                                        className="bg-white text-amber-700 hover:bg-amber-50 border-transparent font-semibold py-3 px-8 rounded-xl transition-colors focus-visible:ring-amber-200"
                                    >
                                        Decouvrir les bienfaits
                                    </Button>
                                </Link>
                            </div>

                            <div className="mt-10 grid grid-cols-3 gap-6 max-w-xl mx-auto">
                                <div className="text-center">
                                    <div className="text-2xl md:text-3xl font-bold">100%</div>
                                    <div className="text-xs md:text-sm text-white/80">Naturel</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl md:text-3xl font-bold">3000</div>
                                    <div className="text-xs md:text-sm text-white/80">Ans d'histoire</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl md:text-3xl font-bold">0%</div>
                                    <div className="text-xs md:text-sm text-white/80">Additifs</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="mx-auto mt-12 max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex-1 text-center sm:text-left">
                                <h2
                                    className="text-3xl md:text-4xl font-extrabold text-emerald-800"
                                    style={{ fontFamily: '"Playfair Display", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
                                >
                                    Notre Gamme
                                </h2>
                                <p className="mt-2 text-emerald-900/70">
                                    Decouvrez nos differentes varietes de Bsissa, chacune adaptee a vos besoins et gouts.
                                </p>
                            </div>

                        </div>

                        <Button
                            type="button"
                            onClick={() => setFiltersOpen((open) => !open)}
                            aria-expanded={filtersOpen}
                            aria-controls="product-filters-desktop product-filters-mobile"
                            className={`group fixed right-4 bottom-6 z-60 w-[calc(100%-2.5rem)] max-w-sm overflow-hidden rounded-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-amber-500 px-6 py-3 font-semibold text-white shadow-xl transition-all duration-300 focus-visible:ring-4 focus-visible:ring-emerald-200 sm:right-8 sm:top-24 sm:bottom-auto sm:w-auto sm:max-w-[18rem] sm:py-3.5 ${
                                filtersOpen ? 'ring-2 ring-emerald-200/70 shadow-emerald-200/60' : ''
                            }`}
                        >
                            <span
                                aria-hidden="true"
                                className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                            />
                            <span className="relative inline-flex items-center justify-center gap-2">
                                <SlidersHorizontal className={`h-5 w-5 transition-transform duration-300 ${filtersOpen ? 'rotate-90' : ''}`} />
                                Filtrer et Trier
                            </span>
                        </Button>

                        <div className="mt-8 grid gap-8 lg:grid-cols-4">
                            <aside id="product-filters-desktop" className={`${filtersOpen ? 'lg:block' : 'lg:hidden'} hidden lg:col-span-1`}>
                                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm lg:sticky lg:top-24">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Search className="w-5 h-5" />
                                            Filtrer les produits
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {filtersForm}
                                    </CardContent>
                                </Card>
                            </aside>

                            <section className={`transition-all duration-300 ${filtersOpen ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
                                {products.data.length > 0 ? (
                                    <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
                                        {products.data.map((product) => {
                                            const description = product.description || 'Delicieuse Bsissa artisanale, ideale pour bien demarrer la journee.';
                                            const quantity = quantities[product.id] ?? 1;

                                            // Trier les variantes par poids (du plus petit au plus grand)
                                            const sortedVariants = !product.weight_variants || product.weight_variants.length === 0
                                                ? []
                                                : [...product.weight_variants].sort((a, b) => {
                                                    const aWeightInGrams = a.weight_unit === 'kg' ? a.weight_value * 1000 : a.weight_value;
                                                    const bWeightInGrams = b.weight_unit === 'kg' ? b.weight_value * 1000 : b.weight_value;
                                                    return aWeightInGrams - bWeightInGrams;
                                                });

                                            // Sélectionner la première variante par défaut
                                            const selectedVariantId = selectedVariants[product.id] ?? sortedVariants[0]?.id;
                                            const selectedVariant = sortedVariants.find(v => v.id === selectedVariantId) || sortedVariants[0];

                                            return (
                                                <article
                                                    key={product.id}
                                                    className="flex flex-col rounded-[28px] overflow-hidden shadow-[0_35px_65px_-30px_rgba(40,40,40,0.45)] bg-white transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-[0_45px_80px_-40px_rgba(40,40,40,0.5)]"
                                                >
                                                    <Link href={`/product/${product.id}`} className="relative block bg-[#8C4B1F]">
                                                        {product.image_url ? (
                                                            <img
                                                                src={product.image_url}
                                                                alt={product.name}
                                                                className="w-full h-64 object-cover transition-transform duration-500 hover:scale-105"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-64 flex items-center justify-center">
                                                                <Package className="w-12 h-12 text-[#F9E7CF]" />
                                                            </div>
                                                        )}

                                                        <div className="absolute top-3 left-3">
                                                            <span className="inline-flex items-center rounded-full bg-[#8C4B1F] text-white px-4 py-1 text-xs font-semibold shadow-lg">
                                                                {product.category?.name || 'Classique'}
                                                            </span>
                                                        </div>

                                                        {/* Étiquette Stock */}
                                                        {selectedVariant && (
                                                            <div className="absolute top-3 right-3">
                                                                <span className="inline-flex items-center rounded-full border border-emerald-200 bg-white/90 px-3 py-1 text-xs font-semibold text-emerald-900 shadow-sm">
                                                                    Stock {selectedVariant.is_available && selectedVariant.stock_quantity > 0 ? `${selectedVariant.stock_quantity}` : 'Rupture'}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </Link>

                                                    <div className="flex-1 bg-white px-7 py-7 space-y-6">
                                                        <div>
                                                            <Link href={`/product/${product.id}`}>
                                                                <h3
                                                                    className="text-[#2F5A24] text-2xl md:text-3xl font-semibold hover:text-[#1f3b17] transition-colors"
                                                                    style={{ fontFamily: '"Playfair Display", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
                                                                >
                                                                    {product.name}
                                                                </h3>
                                                            </Link>
                                                            <p className="mt-2 text-[#4A4A4A] text-sm md:text-base leading-relaxed">{description}</p>
                                                        </div>

                                                        {/* Boutons de sélection des poids */}
                                                        {sortedVariants.length > 0 && (
                                                            <div className="flex flex-wrap gap-2">
                                                                {sortedVariants.map((variant) => (
                                                                    <button
                                                                        key={variant.id}
                                                                        type="button"
                                                                        onClick={() => setSelectedVariants(prev => ({ ...prev, [product.id]: variant.id }))}
                                                                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                                                                            selectedVariant?.id === variant.id
                                                                                ? 'border-emerald-600 bg-emerald-600 text-white shadow-md'
                                                                                : 'border-emerald-200 bg-white text-emerald-700 hover:border-emerald-400 hover:bg-emerald-50'
                                                                        }`}
                                                                    >
                                                                        {variant.weight_value} {variant.weight_unit}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {/* Affichage du prix de la variante sélectionnée */}
                                                        {selectedVariant && (
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex flex-col gap-1">
                                                                    {selectedVariant.promotional_price && selectedVariant.promotional_price > 0 ? (
                                                                        <>
                                                                            <div className="text-2xl font-extrabold text-red-600">{selectedVariant.promotional_price.toFixed(2)} TND</div>
                                                                            <div className="text-sm font-medium text-slate-400 line-through">{selectedVariant.price.toFixed(2)} TND</div>
                                                                        </>
                                                                    ) : (
                                                                        <div className="text-2xl font-extrabold text-[#2F5A24]">{selectedVariant.price.toFixed(2)} TND</div>
                                                                    )}
                                                                </div>
                                                                <Input
                                                                    type="number"
                                                                    min={1}
                                                                    max={selectedVariant.stock_quantity}
                                                                    value={quantity}
                                                                    onChange={(event) => updateQuantity(product.id, Number(event.target.value))}
                                                                    className="h-12 w-20 rounded-full border border-[#C7DDB7] bg-white text-center text-sm focus:outline-none focus:ring-2 focus:ring-[#8FB96C]"
                                                                    aria-label="Quantite"
                                                                    disabled={!selectedVariant.is_available || selectedVariant.stock_quantity === 0}
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    onClick={() => addToCart(product, selectedVariant.id)}
                                                                    className="ml-auto inline-flex items-center gap-2 rounded-full bg-[#7A3E12] px-5 py-2.5 text-white transition-all duration-300 hover:bg-[#5f2f0d] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                                                    disabled={!selectedVariant.is_available || selectedVariant.stock_quantity === 0}
                                                                >
                                                                    <ShoppingCart className="w-4 h-4" />
                                                                    Ajouter
                                                                </Button>
                                                            </div>
                                                        )}

                                                        <div className="flex items-center gap-2 pt-1">
                                                            <div className="flex">
                                                                {Array.from({ length: 5 }).map((_, index) => (
                                                                    <Star key={index} className="w-4 h-4 text-[#F5B301] fill-[#F5B301]" />
                                                                ))}
                                                            </div>
                                                            <span className="text-sm text-[#5C5C5C]">4.9/5 | 127 avis</span>
                                                        </div>
                                                    </div>
                                                </article>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                                        <CardContent className="p-12 text-center">
                                            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun produit trouve</h3>
                                            <p className="text-gray-600 mb-6">Aucun produit ne correspond a vos criteres de recherche.</p>
                                            <Link href="/products">
                                                <Button>Voir tous les produits</Button>
                                            </Link>
                                        </CardContent>
                                    </Card>
                                )}

                                {products.last_page > 1 && (
                                    <div className="flex items-center justify-center gap-2 mt-8">
                                        {products.links.map((link, index) => (
                                            <Link key={index} href={link.url || '#'}>
                                                <Button variant={link.active ? 'default' : 'outline'} size="sm" disabled={!link.url}>
                                                    {link.label.replace('&laquo;', '<').replace('&raquo;', '>')}
                                                </Button>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </section>
                        </div>
                    </div>

                    {/* Section des Valeurs - Les Quatre Piliers */}
                    <section className="px-4 py-16 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-7xl rounded-[40px] bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-950 px-6 py-20 text-white shadow-2xl sm:px-12 lg:px-16">
                            <div className="text-center">
                                <h2
                                    className="text-3xl font-bold sm:text-4xl"
                                    style={{ fontFamily: '"Playfair Display", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
                                >
                                    Les Valeurs qui Nous Animent
                                </h2>
                                <p className="mx-auto mt-4 max-w-2xl text-emerald-100/80">
                                    Quatre piliers fondamentaux guident chacune de nos décisions, de la sélection des ingrédients à la livraison chez vous.
                                </p>
                            </div>

                            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                                {[
                                    {
                                        icon: Leaf,
                                        title: 'Authenticité',
                                        description: 'Recettes ancestrales respectées, méthodes artisanales préservées, aucun compromis sur la tradition.',
                                    },
                                    {
                                        icon: Sparkles,
                                        title: 'Qualité Premium',
                                        description: 'Sélection rigoureuse des matières premières, contrôles qualité stricts, traçabilité totale.',
                                    },
                                    {
                                        icon: Heart,
                                        title: 'Passion',
                                        description: 'Amour du métier, respect des producteurs locaux, engagement envers nos clients fidèles.',
                                    },
                                    {
                                        icon: Users,
                                        title: 'Communauté',
                                        description: 'Soutien aux agriculteurs tunisiens, partage de recettes, création de liens authentiques.',
                                    },
                                ].map((value, index) => (
                                    <div
                                        key={value.title}
                                        className="group rounded-3xl bg-white/5 p-6 backdrop-blur transition-all duration-500 hover:bg-white/10 hover:scale-105 hover:shadow-2xl"
                                        style={{
                                            animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                                        }}
                                    >
                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-300 transition-all duration-500 group-hover:bg-amber-500/30 group-hover:scale-110 group-hover:rotate-12">
                                            <value.icon className="h-7 w-7" />
                                        </div>
                                        <h3 className="mt-5 text-xl font-bold text-white transition-colors duration-300 group-hover:text-amber-300">{value.title}</h3>
                                        <p className="mt-3 text-sm leading-relaxed text-emerald-100/75">{value.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Espace blanc en dessous */}
                    <div className="h-16"></div>
                </div>

                {/* Mobile filter overlay */}
                <div
                    className={`lg:hidden fixed inset-0 z-40 bg-neutral-950/40 backdrop-blur-sm transition-opacity duration-300 ${
                        filtersOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                    onClick={() => setFiltersOpen(false)}
                    aria-hidden="true"
                />
                <div
                    id="product-filters-mobile"
                    role="dialog"
                    aria-modal="true"
                    className={`lg:hidden fixed inset-x-4 top-20 bottom-28 z-50 transition-all duration-500 ease-out ${
                        filtersOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-6 opacity-0 pointer-events-none'
                    }`}
                >
                    <Card className="flex h-full flex-col overflow-hidden border-0 bg-white/95 shadow-2xl backdrop-blur">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="flex items-center gap-2">
                                <Search className="w-5 h-5" />
                                Filtrer les produits
                            </CardTitle>
                            <button
                                type="button"
                                onClick={() => setFiltersOpen(false)}
                                className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
                                aria-label="Fermer les filtres"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto pb-6">
                            {filtersForm}
                        </CardContent>
                    </Card>
                </div>
            </PublicLayout>
        </>
    );
}
