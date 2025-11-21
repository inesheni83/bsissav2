import GuestLayout from '@/layouts/guest-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Package, ShoppingCart, Tag, Filter, X, Star, SlidersHorizontal, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useState, useMemo } from 'react';

type Pack = {
    id: number;
    name: string;
    slug: string;
    description: string;
    main_image_url: string | null;
    price: number;
    reference_price: number | null;
    savings: number | null;
    savings_percentage: number | null;
    stock_quantity: number;
    products_count: number;
};

type PageProps = {
    packs: {
        data: Pack[];
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
    totalPacks: number;
    filters: {
        price_range?: string;
        product_count?: string;
        sort_by: string;
    };
};

export default function PackPublicIndex({ packs, totalPacks, filters }: PageProps) {
    const [showFilters, setShowFilters] = useState(false);

    const handleFilterChange = (filterType: string, value: string) => {
        const params = new URLSearchParams(window.location.search);

        if (value === 'all' || value === '') {
            params.delete(filterType);
        } else {
            params.set(filterType, value);
        }

        router.get(`/packs?${params.toString()}`, {}, { preserveState: true });
    };

    const clearFilters = () => {
        router.get('/packs', {}, { preserveState: true });
    };

    const hasActiveFilters = filters.price_range || filters.product_count || filters.sort_by !== 'newest';

    // Formulaire de filtres réutilisable
    const filtersForm = useMemo(
        () => (
            <div className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="price_range">Gamme de prix</Label>
                    <Select
                        value={filters.price_range || 'all'}
                        onValueChange={(value) => handleFilterChange('price_range', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Tous les prix" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous les prix</SelectItem>
                            <SelectItem value="0-50">0 - 50 DT</SelectItem>
                            <SelectItem value="50-100">50 - 100 DT</SelectItem>
                            <SelectItem value="100-150">100 - 150 DT</SelectItem>
                            <SelectItem value="150+">150 DT et plus</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="product_count">Nombre de produits</Label>
                    <Select
                        value={filters.product_count || 'all'}
                        onValueChange={(value) => handleFilterChange('product_count', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Tous les packs" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous les packs</SelectItem>
                            <SelectItem value="2-3">2-3 produits</SelectItem>
                            <SelectItem value="4-5">4-5 produits</SelectItem>
                            <SelectItem value="6+">6 produits et plus</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="sort_by">Trier par</Label>
                    <Select
                        value={filters.sort_by}
                        onValueChange={(value) => handleFilterChange('sort_by', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Trier par" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Nouveautés</SelectItem>
                            <SelectItem value="popular">Popularité</SelectItem>
                            <SelectItem value="price_asc">Prix croissant</SelectItem>
                            <SelectItem value="price_desc">Prix décroissant</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {hasActiveFilters && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={clearFilters}
                        className="w-full"
                    >
                        Réinitialiser les filtres
                    </Button>
                )}
            </div>
        ),
        [filters.price_range, filters.product_count, filters.sort_by, hasActiveFilters],
    );

    return (
        <GuestLayout>
            <Head title="Nos Packs" />

            <div className="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">
                {/* Bouton flottant de filtres */}
                <Button
                    type="button"
                    onClick={() => setShowFilters((open) => !open)}
                    aria-expanded={showFilters}
                    aria-controls="pack-filters-desktop pack-filters-mobile"
                    className={`group fixed right-4 bottom-6 z-60 w-[calc(100%-2.5rem)] max-w-sm overflow-hidden rounded-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-amber-500 px-6 py-3 font-semibold text-white shadow-xl transition-all duration-300 focus-visible:ring-4 focus-visible:ring-emerald-200 sm:right-8 sm:top-24 sm:bottom-auto sm:w-auto sm:max-w-[18rem] sm:py-3.5 ${
                        showFilters ? 'ring-2 ring-emerald-200/70 shadow-emerald-200/60' : ''
                    }`}
                >
                    <span
                        aria-hidden="true"
                        className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                    <span className="relative inline-flex items-center justify-center gap-2">
                        <SlidersHorizontal className={`h-5 w-5 transition-transform duration-300 ${showFilters ? 'rotate-90' : ''}`} />
                        Filtrer et Trier
                    </span>
                </Button>

                <div className="mt-8 grid gap-8 lg:grid-cols-4">
                    {/* Panneau de filtres desktop */}
                    <aside id="pack-filters-desktop" className={`${showFilters ? 'lg:block' : 'lg:hidden'} hidden lg:col-span-1`}>
                        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm lg:sticky lg:top-24">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Search className="w-5 h-5" />
                                    Filtrer les packs
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {filtersForm}
                            </CardContent>
                        </Card>
                    </aside>

                    {/* Section des packs */}
                    <section className={`transition-all duration-300 ${showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}`}>

                {/* Packs Grid */}
                {packs.data.length > 0 ? (
                    <>
                        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
                            {packs.data.map((pack) => (
                                <article
                                    key={pack.id}
                                    className="flex flex-col rounded-[28px] overflow-hidden shadow-[0_35px_65px_-30px_rgba(40,40,40,0.45)] bg-white transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-[0_45px_80px_-40px_rgba(40,40,40,0.5)]"
                                >
                                    <Link href={`/pack/${pack.slug}`} className="relative block bg-[#8C4B1F]">
                                        {pack.main_image_url ? (
                                            <img
                                                src={pack.main_image_url}
                                                alt={pack.name}
                                                className="w-full h-64 object-cover transition-transform duration-500 hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-64 flex items-center justify-center">
                                                <Package className="w-12 h-12 text-[#F9E7CF]" />
                                            </div>
                                        )}

                                        {/* Badge Pack en haut à gauche */}
                                        <div className="absolute top-3 left-3">
                                            <span className="inline-flex items-center rounded-full bg-[#8C4B1F] text-white px-4 py-1 text-xs font-semibold shadow-lg">
                                                Pack
                                            </span>
                                        </div>

                                        {/* Badge Stock en haut à droite */}
                                        <div className="absolute top-3 right-3">
                                            <span className="inline-flex items-center rounded-full border border-emerald-200 bg-white/90 px-3 py-1 text-xs font-semibold text-emerald-900 shadow-sm">
                                                Stock {pack.stock_quantity > 0 ? `${pack.stock_quantity}` : 'Rupture'}
                                            </span>
                                        </div>

                                        {/* Out of Stock Overlay */}
                                        {pack.stock_quantity === 0 && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                                <span className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-lg">
                                                    Épuisé
                                                </span>
                                            </div>
                                        )}
                                    </Link>

                                    <div className="flex-1 bg-white px-7 py-7 space-y-6">
                                        <div>
                                            <Link href={`/pack/${pack.slug}`}>
                                                <h3
                                                    className="text-[#2F5A24] text-2xl md:text-3xl font-semibold hover:text-[#1f3b17] transition-colors"
                                                    style={{ fontFamily: '"Playfair Display", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
                                                >
                                                    {pack.name}
                                                </h3>
                                            </Link>
                                            {pack.description && (
                                                <p className="mt-2 text-[#4A4A4A] text-sm md:text-base leading-relaxed line-clamp-2">
                                                    {pack.description}
                                                </p>
                                            )}
                                        </div>

                                        {/* Product Count */}
                                        <div className="flex items-center gap-2 text-sm text-[#4A4A4A]">
                                            <Package className="h-4 w-4 text-[#8C4B1F]" />
                                            <span>
                                                {pack.products_count} produit{pack.products_count > 1 ? 's' : ''} inclus
                                            </span>
                                        </div>

                                        {/* Pricing */}
                                        <div className="flex flex-col gap-1">
                                            {pack.reference_price ? (
                                                <>
                                                    <div className="text-2xl font-extrabold text-red-600">
                                                        {Number(pack.price).toFixed(2)} TND
                                                    </div>
                                                    <div className="text-sm font-medium text-slate-400 line-through">
                                                        {Number(pack.reference_price).toFixed(2)} TND
                                                    </div>
                                                    {pack.savings_percentage && (
                                                        <div className="mt-1">
                                                            <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                                                                <Tag className="mr-1 h-3 w-3" />
                                                                -{pack.savings_percentage}% · Économisez {Number(pack.savings).toFixed(2)} DT
                                                            </span>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="text-2xl font-extrabold text-[#2F5A24]">
                                                    {Number(pack.price).toFixed(2)} TND
                                                </div>
                                            )}
                                        </div>

                                        {/* CTA Button */}
                                        <Button
                                            type="button"
                                            asChild
                                            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#7A3E12] px-5 py-2.5 text-white transition-all duration-300 hover:bg-[#5f2f0d] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={pack.stock_quantity === 0}
                                        >
                                            <Link href={`/pack/${pack.slug}`}>
                                                <ShoppingCart className="w-4 h-4" />
                                                Voir les détails
                                            </Link>
                                        </Button>

                                        {/* Rating */}
                                        <div className="flex items-center gap-2 pt-1">
                                            <div className="flex">
                                                {Array.from({ length: 5 }).map((_, index) => (
                                                    <Star key={index} className="w-4 h-4 text-[#F5B301] fill-[#F5B301]" />
                                                ))}
                                            </div>
                                            <span className="text-sm text-[#5C5C5C]">5.0/5</span>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {/* Pagination */}
                        {packs.last_page > 1 && (
                            <div className="mt-8 flex justify-center">
                                <div className="flex gap-2">
                                    {packs.links.map((link, index) => (
                                        <Button
                                            key={index}
                                            variant={link.active ? 'default' : 'outline'}
                                            size="sm"
                                            disabled={!link.url}
                                            onClick={() => link.url && router.get(link.url)}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={link.active ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="py-12 text-center">
                        <Package className="mx-auto mb-4 h-16 w-16 text-slate-300" />
                        <h3 className="mb-2 text-xl font-semibold text-slate-900">
                            Aucun pack trouvé
                        </h3>
                        <p className="text-slate-600">
                            Essayez de modifier vos filtres pour voir plus de résultats.
                        </p>
                        {hasActiveFilters && (
                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={clearFilters}
                            >
                                Réinitialiser les filtres
                            </Button>
                        )}
                    </div>
                )}
                    </section>
                </div>
            </div>

            {/* Panneau de filtres mobile */}
            <div
                className={`lg:hidden fixed inset-0 z-40 bg-neutral-950/40 backdrop-blur-sm transition-opacity duration-300 ${
                    showFilters ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setShowFilters(false)}
                aria-hidden="true"
            />
            <div
                id="pack-filters-mobile"
                role="dialog"
                aria-modal="true"
                className={`lg:hidden fixed inset-x-4 top-20 bottom-28 z-50 transition-all duration-500 ease-out ${
                    showFilters ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-6 opacity-0 pointer-events-none'
                }`}
            >
                <Card className="flex h-full flex-col overflow-hidden border-0 bg-white/95 shadow-2xl backdrop-blur">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="flex items-center gap-2">
                            <Search className="w-5 h-5" />
                            Filtrer les packs
                        </CardTitle>
                        <button
                            type="button"
                            onClick={() => setShowFilters(false)}
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
        </GuestLayout>
    );
}
