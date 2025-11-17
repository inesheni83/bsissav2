import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { FormEvent, useMemo, useState } from 'react';
import { ArrowRight, BarChart3, Filter, Layers, Package, Pencil, Plus, Search, ShoppingCart, Star, Trash2, Eye, EyeOff, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Category = {
    id: number;
    name: string;
    slug: string;
};

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
    slug: string;
    description: string;
    image: string | null;
    image_url?: string | null;
    category_id: number | null;
    is_featured: boolean;
    created_at: string;
    updated_at: string;
    category?: Category;
    weight_variants: WeightVariant[];
};

type ProductListProps = {
    products: {
        data: Product[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    categories: Category[];
    filters: {
        search?: string;
        category_id?: string | number;
        featured?: string;
        stock_status?: string;
    };
};

// Fonction utilitaire pour obtenir la variante avec le poids le plus petit
const getSmallestWeightVariant = (product: Product): WeightVariant | null => {
    if (!product.weight_variants || product.weight_variants.length === 0) return null;

    return product.weight_variants.reduce((smallest, variant) => {
        // Convertir en grammes pour comparer uniformément
        const variantWeightInGrams = variant.weight_unit === 'kg' ? variant.weight_value * 1000 : variant.weight_value;
        const smallestWeightInGrams = smallest.weight_unit === 'kg' ? smallest.weight_value * 1000 : smallest.weight_value;

        return variantWeightInGrams < smallestWeightInGrams ? variant : smallest;
    });
};

// Fonction pour obtenir le stock total d'un produit (somme de toutes les variantes disponibles)
const getTotalStock = (product: Product): number => {
    if (!product.weight_variants || product.weight_variants.length === 0) return 0;
    return product.weight_variants.reduce((total, variant) => {
        return total + (variant.is_available ? variant.stock_quantity : 0);
    }, 0);
};

export default function ProductList({ products, categories, filters }: ProductListProps) {
    const { data, setData, get } = useForm({
        search: filters.search || '',
        category_id: filters.category_id ? String(filters.category_id) : '',
        featured: filters.featured || '',
        stock_status: filters.stock_status || '',
    });

    const applyStockFilter = (status: 'all' | 'in_stock' | 'out_of_stock') => {
        const value = status === 'all' ? '' : status;
        const nextData = { ...data, stock_status: value };
        const query = Object.fromEntries(
            Object.entries(nextData).filter(([, val]) => val !== '' && val !== null && val !== undefined),
        );

        setData(nextData);

        router.get(route('products.index'), query, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const submitFilters = (event: FormEvent) => {
        event.preventDefault();
        const query = Object.fromEntries(
            Object.entries(data).filter(([, value]) => value !== '' && value !== null && value !== undefined),
        );

        get(route('products.index'), {
            data: query,
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        const reset = { search: '', category_id: '', featured: '', stock_status: '' };
        setData(reset);
        get(route('products.index'), {
            data: {},
            preserveState: true,
            preserveScroll: true,
        });
    };

    const toggleFeatured = (productId: number) => {
        router.patch(route('products.toggle-featured', productId), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (productId: number, productName: string) => {
        if (confirm(`Etes-vous sur de vouloir supprimer le produit "${productName}" ? Cette action est definitive.`)) {
            router.delete(route('products.destroy', productId));
        }
    };

    const totalProducts = products.total;
    const inStockCount = useMemo(() => products.data.filter((product) => getTotalStock(product) > 0).length, [products.data]);
    const outOfStockCount = useMemo(() => products.data.filter((product) => getTotalStock(product) <= 0).length, [products.data]);
    const currentStockStatus = data.stock_status || 'all';

    return (
        <AppLayout>
            <Head title="Mes produits" />

            <div className="relative min-h-full bg-gradient-to-br from-amber-50 via-emerald-50/40 to-white text-emerald-900">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.6),_transparent_55%)]" aria-hidden="true" />

                <div className="relative mx-auto max-w-7xl space-y-10 px-4 py-14 sm:px-6 lg:px-8">
                    <header className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
                        <div className="space-y-5">
                            <div className="inline-flex items-center gap-3 rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700 shadow-sm">
                                <ShoppingCart className="h-4 w-4 text-amber-500" />
                                Mes produits
                            </div>
                            <h1 className="text-4xl font-semibold tracking-tight text-emerald-900 sm:text-5xl">Organisez votre vitrine en un clin d&apos;oeil</h1>
                            <p className="max-w-2xl text-sm text-emerald-800/80 sm:text-base">
                                Visualisez vos references, ajustez vos stocks et mettez vos produits en avant avec une interface concue pour rester alignee sur l&apos;experience
                                publique.
                            </p>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <StatCard
                                    icon={BarChart3}
                                    label="Total produits"
                                    value={totalProducts}
                                    tone="emerald"
                                    onClick={() => applyStockFilter('all')}
                                    active={currentStockStatus === 'all'}
                                />
                                <StatCard
                                    icon={Layers}
                                    label="En stock"
                                    value={inStockCount}
                                    tone="amber"
                                    onClick={() => applyStockFilter('in_stock')}
                                    active={currentStockStatus === 'in_stock'}
                                />
                                <StatCard
                                    icon={Package}
                                    label="En rupture"
                                    value={outOfStockCount}
                                    tone="rose"
                                    onClick={() => applyStockFilter('out_of_stock')}
                                    active={currentStockStatus === 'out_of_stock'}
                                />
                            </div>
                        </div>
                        <Link href={route('product.add')} className="self-start">
                            <Button className="group inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-emerald-500 px-8 font-semibold text-emerald-950 shadow-lg shadow-emerald-200/60 transition hover:from-amber-300 hover:via-amber-400 hover:to-emerald-400">
                                <Plus className="h-5 w-5" />
                                Ajouter un produit
                                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                            </Button>
                        </Link>
                    </header>

                    <section className="rounded-[28px] border border-emerald-100 bg-white/85 p-6 shadow-[0_24px_55px_-32px_rgba(14,116,144,0.32)] backdrop-blur lg:p-8">
                        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,2fr)] lg:items-start">
                            <div className="space-y-2">
                                <div className="inline-flex items-center gap-2 text-[0.78rem] font-semibold uppercase tracking-[0.22em] text-emerald-600">
                                    <Filter className="h-4 w-4 text-amber-500" />
                                    Filtres intelligents
                                </div>
                                <p className="text-xs leading-relaxed text-emerald-700/70">
                                    Combinez recherche, categories et statuts pour affiner votre selection.
                                </p>
                            </div>

                            <form
                                onSubmit={submitFilters}
                                className="grid w-full gap-5 md:grid-cols-2 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)] xl:items-start"
                            >
                                <div className="space-y-3 md:col-span-2 xl:col-span-1">
                                    <Label htmlFor="search" className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-600">
                                        Recherche globale
                                    </Label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-emerald-400">
                                            <Search className="h-4 w-4" />
                                        </div>
                                        <Input
                                            id="search"
                                            value={data.search}
                                            onChange={(event) => setData('search', event.target.value)}
                                            placeholder="Nom, reference ou mot cle"
                                            className="h-10 w-full rounded-full border border-emerald-100 bg-emerald-50/60 pl-11 text-sm font-medium text-emerald-900 placeholder:text-emerald-400 transition focus:border-emerald-300 focus-visible:ring-emerald-200 focus-visible:ring-offset-2"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="category_id" className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-600">
                                        Categorie
                                    </Label>
                                    <Select
                                        value={data.category_id === '' ? '__all__' : data.category_id}
                                        onValueChange={(value) => setData('category_id', value === '__all__' ? '' : value)}
                                    >
                                        <SelectTrigger
                                            id="category_id"
                                            className="h-10 w-full rounded-full border border-emerald-100 bg-white/70 text-sm font-medium text-emerald-900 transition focus:border-emerald-300 focus:ring-emerald-200 focus:ring-offset-2"
                                        >
                                            <SelectValue placeholder="Toutes les categories" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="__all__">Toutes les categories</SelectItem>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={String(category.id)}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="featured" className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-600">
                                        En vedette
                                    </Label>
                                    <div className="flex h-10 w-full items-center gap-3 rounded-full border border-emerald-100 bg-white/75 px-4 shadow-sm">
                                        <Checkbox id="featured" checked={data.featured === '1'} onCheckedChange={(checked) => setData('featured', checked ? '1' : '')} />
                                        <label htmlFor="featured" className="text-sm font-medium leading-snug text-emerald-700">
                                            En vitrine
                                        </label>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3 md:col-span-2 xl:col-span-1 md:flex-row xl:flex-col xl:items-end">
                                    <Button
                                        type="submit"
                                        className="h-10 w-full rounded-full bg-gradient-to-r from-emerald-500 via-emerald-500/90 to-emerald-600 text-sm font-semibold tracking-wide text-white shadow-sm shadow-emerald-200/60 transition focus-visible:ring-2 focus-visible:ring-emerald-200 focus-visible:ring-offset-2 hover:from-emerald-500 hover:to-emerald-600"
                                    >
                                        Appliquer
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={clearFilters}
                                        className="h-10 w-full rounded-full border-emerald-200 bg-white/90 text-sm font-semibold text-emerald-600 shadow-sm transition hover:bg-emerald-50 focus-visible:ring-2 focus-visible:ring-emerald-200 focus-visible:ring-offset-2"
                                    >
                                        Reinitialiser
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </section>

                    {products.data.length > 0 ? (
                        <section className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
                            {products.data.map((product) => <ProductCard key={product.id} product={product} toggleFeatured={toggleFeatured} handleDelete={handleDelete} />)}
                        </section>
                    ) : (
                        <Card className="border border-emerald-100 bg-white p-10 text-center shadow-[0_35px_70px_-45px_rgba(15,118,110,0.35)]">
                            <CardContent className="space-y-6">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-600">
                                    <Package className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-semibold text-emerald-900">Aucun produit trouve</h3>
                                <p className="text-sm text-emerald-700/70">
                                    {filters.search || filters.category_id || filters.featured || filters.stock_status
                                        ? 'Aucun produit ne correspond a vos criteres. Essayez de modifier vos filtres.'
                                        : 'Vous pouvez creer un premier produit en quelques clics.'}
                                </p>
                                <Link href={route('product.add')}>
                                    <Button className="rounded-full bg-gradient-to-r from-emerald-500 to-amber-400 px-6 py-3 font-semibold text-emerald-950 shadow-lg shadow-emerald-200/50 hover:from-emerald-400 hover:to-amber-300">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Creer un produit
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )}

                    {products.last_page > 1 && (
                        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
                            {products.links.map((link, index) => {
                                const label = formatPaginationLabel(link.label);
                                return link.url ? (
                                    <Link key={index} href={link.url}>
                                        <Button
                                            variant={link.active ? 'default' : 'outline'}
                                            size="sm"
                                            className={`rounded-full px-4 ${
                                                link.active
                                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-300/40 hover:bg-emerald-500'
                                                    : 'border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50'
                                            }`}
                                        >
                                            {label}
                                        </Button>
                                    </Link>
                                ) : (
                                    <Button key={index} variant="ghost" size="sm" disabled className="rounded-full border border-transparent px-4 text-emerald-300">
                                        {label}
                                    </Button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

type ProductCardProps = {
    product: Product;
    toggleFeatured: (productId: number) => void;
    handleDelete: (productId: number, productName: string) => void;
};

function ProductCard({ product, toggleFeatured, handleDelete }: ProductCardProps) {
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

    // Calculer le stock à afficher (stock de la variante sélectionnée ou stock total)
    const displayStock = selectedVariant
        ? (selectedVariant.is_available ? selectedVariant.stock_quantity : 0)
        : getTotalStock(product);

    return (
        <article className="group relative flex flex-col overflow-hidden rounded-[28px] border border-emerald-100 bg-white text-emerald-950 shadow-[0_35px_80px_-45px_rgba(15,118,110,0.45)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_45px_95px_-55px_rgba(15,118,110,0.55)]">
            <div className="relative bg-gradient-to-br from-emerald-100 via-emerald-50 to-white">
                {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="h-48 w-full object-cover transition duration-500 group-hover:scale-105" />
                ) : (
                    <div className="flex h-48 w-full items-center justify-center bg-emerald-50">
                        <Package className="h-12 w-12 text-emerald-400/70" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 via-white/0 to-transparent opacity-100 transition group-hover:opacity-100" />

                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {product.is_featured && (
                        <Badge className="rounded-full bg-amber-500/90 px-3 py-1 text-xs font-semibold text-emerald-950 shadow-sm">En vitrine</Badge>
                    )}
                    <Badge className="rounded-full border border-emerald-200 bg-white/90 text-xs font-semibold text-emerald-900 shadow-sm">
                        Stock {displayStock > 0 ? `${displayStock}` : 'Rupture'}
                    </Badge>
                </div>

                <div className="absolute top-4 right-4 flex gap-2 opacity-0 transition-all duration-200 group-hover:opacity-100">
                    <Link href={`/products/${product.id}`} className="rounded-full border border-emerald-100 bg-white/90 p-2 text-emerald-700 shadow-sm hover:bg-white">
                        <Eye className="h-4 w-4" />
                    </Link>
                    <Link href={`/products/${product.id}/edit`} className="rounded-full border border-emerald-100 bg-white/90 p-2 text-emerald-700 shadow-sm hover:bg-white">
                        <Pencil className="h-4 w-4" />
                    </Link>
                </div>
            </div>

            <div className="flex flex-1 flex-col gap-4 px-7 py-6">
                <div className="space-y-2">
                    <h3
                        className="text-xl font-semibold tracking-tight text-emerald-950 line-clamp-2"
                        style={{ fontFamily: '"Playfair Display", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
                    >
                        {product.name}
                    </h3>
                    <p className="line-clamp-3 text-sm leading-relaxed text-emerald-900/70">{product.description || 'Aucune description disponible.'}</p>
                </div>

                {sortedVariants.length > 0 ? (
                    <>
                        {/* Boutons de sélection des poids */}
                        <div className="flex flex-wrap gap-2">
                            {sortedVariants.map((variant) => (
                                <button
                                    key={variant.id}
                                    type="button"
                                    onClick={() => setSelectedVariantId(variant.id)}
                                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                                        selectedVariant?.id === variant.id
                                            ? 'border-emerald-500 bg-emerald-500 text-white shadow-sm'
                                            : 'border-emerald-200 bg-white text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50'
                                    }`}
                                >
                                    {variant.weight_value} {variant.weight_unit}
                                </button>
                            ))}
                        </div>

                        {/* Affichage du prix de la variante sélectionnée */}
                        {selectedVariant && (
                            <div
                                className="flex items-baseline gap-2 text-emerald-900"
                                style={{ fontFamily: '"Playfair Display", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
                            >
                                {selectedVariant.promotional_price && selectedVariant.promotional_price > 0 ? (
                                    <>
                                        <span className="text-xl font-semibold text-red-600">{Number(selectedVariant.promotional_price).toFixed(2)}</span>
                                        <span className="text-sm font-medium text-red-600">TND</span>
                                        <span className="text-sm font-medium text-slate-400 line-through">{Number(selectedVariant.price).toFixed(2)} TND</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-xl font-semibold">{Number(selectedVariant.price).toFixed(2)}</span>
                                        <span className="text-sm font-medium">TND</span>
                                    </>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-sm text-emerald-600/70">Aucune déclinaison disponible</div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-600">
                    <span className="uppercase tracking-[0.18em]">
                        Modifie le{' '}
                        {new Date(product.updated_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </span>
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            onClick={() => toggleFeatured(product.id)}
                            variant="outline"
                            className={`h-10 w-10 rounded-full border-emerald-200 p-0 text-emerald-600 transition hover:bg-emerald-50 ${
                                product.is_featured ? 'bg-emerald-500 text-white hover:bg-emerald-600 border-transparent' : ''
                            }`}
                            title={product.is_featured ? 'Retirer de la vitrine' : 'Mettre en vitrine'}
                        >
                            {product.is_featured ? <EyeOff className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            className="h-10 w-10 rounded-full border border-transparent bg-rose-100/80 p-0 text-rose-600 shadow-sm transition hover:bg-rose-200"
                            onClick={() => handleDelete(product.id, product.name)}
                            title="Supprimer le produit"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </article>
    );
}

type StatCardProps = {
    icon: typeof BarChart3;
    label: string;
    value: number;
    tone: 'emerald' | 'amber' | 'rose';
    onClick?: () => void;
    active?: boolean;
};

function StatCard({ icon: Icon, label, value, tone, onClick, active = false }: StatCardProps) {
    const palette = {
        emerald: {
            background: 'from-emerald-200/50 via-emerald-100/40 to-transparent',
            icon: 'text-emerald-600',
            ring: 'ring-emerald-200/60',
        },
        amber: {
            background: 'from-amber-200/50 via-amber-100/40 to-transparent',
            icon: 'text-amber-600',
            ring: 'ring-amber-200/60',
        },
        rose: {
            background: 'from-rose-200/50 via-rose-100/40 to-transparent',
            icon: 'text-rose-600',
            ring: 'ring-rose-200/60',
        },
    }[tone];

    const baseClasses =
        'relative overflow-hidden rounded-3xl border border-emerald-100 bg-white px-6 py-5 text-left shadow-[0_20px_45px_-35px_rgba(15,118,110,0.35)]';
    const interactiveClasses = onClick
        ? 'transition hover:-translate-y-0.5 hover:shadow-[0_28px_65px_-40px_rgba(15,118,110,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white cursor-pointer'
        : 'cursor-default';
    const activeClasses = active ? 'ring-2 ring-emerald-300 ring-offset-2 ring-offset-white' : '';

    const content = (
        <>
            <div className={`absolute inset-0 bg-gradient-to-br ${palette.background}`} aria-hidden="true" />
            <div className="relative flex items-center gap-4 text-emerald-900">
                <span className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-white ${palette.ring}`}>
                    <Icon className={`h-5 w-5 ${palette.icon}`} />
                </span>
                <div>
                    <p className="text-sm font-medium text-emerald-700/80">{label}</p>
                    <p className="text-2xl font-semibold text-emerald-900">{value}</p>
                </div>
            </div>
        </>
    );

    if (onClick) {
        return (
            <button type="button" onClick={onClick} className={`${baseClasses} ${interactiveClasses} ${activeClasses}`} aria-pressed={active}>
                {content}
            </button>
        );
    }

    return <div className={`${baseClasses} ${interactiveClasses}`}>{content}</div>;
}

function formatPaginationLabel(label: string): string {
    const entityMap: Record<string, string> = {
        '&laquo;': '\u00AB',
        '&raquo;': '\u00BB',
        '&lsaquo;': '\u2039',
        '&rsaquo;': '\u203A',
        '&nbsp;': ' ',
    };

    return label
        .replace(/&[a-zA-Z]+;/g, (entity) => entityMap[entity] ?? entity)
        .replace(/<[^>]*>?/gm, '');
}



