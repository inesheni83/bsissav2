import GuestLayout from '@/layouts/guest-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Package, ShoppingCart, Tag, Check, ChevronLeft, ChevronRight, X, AlertCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

type Product = {
    id: number;
    name: string;
    slug: string;
    description: string;
    image_url: string | null;
    category: {
        id: number;
        name: string;
    };
    pivot: {
        quantity: number;
    };
    weight_variants: Array<{
        id: number;
        weight_value: string;
        weight_unit: string;
        price: number;
        stock_quantity: number;
        is_available: boolean;
    }>;
};

type Pack = {
    id: number;
    name: string;
    slug: string;
    description: string;
    detailed_description: string | null;
    main_image_url: string | null;
    gallery_images: Array<{
        url: string;
        path: string;
    }> | null;
    price: number;
    reference_price: number | null;
    savings: number | null;
    savings_percentage: number | null;
    stock_quantity: number;
    products: Product[];
};

type SimilarPack = {
    id: number;
    name: string;
    slug: string;
    main_image_url: string | null;
    price: number;
    reference_price: number | null;
    savings_percentage: number | null;
    stock_quantity: number;
    products_count: number;
};

type PageProps = {
    pack: Pack;
    similarPacks: SimilarPack[];
};

export default function PackPublicShow({ pack, similarPacks }: PageProps) {
    const [selectedImage, setSelectedImage] = useState<string>(pack.main_image_url || '');
    const [quantity, setQuantity] = useState(1);
    const [showImageModal, setShowImageModal] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    const allImages = [
        pack.main_image_url,
        ...(pack.gallery_images?.map((img) => img.url) || []),
    ].filter((img): img is string => img !== null);

    const currentImageIndex = allImages.indexOf(selectedImage);

    const nextImage = () => {
        const nextIndex = (currentImageIndex + 1) % allImages.length;
        setSelectedImage(allImages[nextIndex]);
    };

    const prevImage = () => {
        const nextIndex = (currentImageIndex - 1 + allImages.length) % allImages.length;
        setSelectedImage(allImages[nextIndex]);
    };

    const handleAddToCart = () => {
        router.post('/cart/packs', {
            pack_id: pack.id,
            quantity: quantity,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setToast('Pack ajouté au panier avec succès!');
                setTimeout(() => setToast(null), 3000);
            },
            onError: () => {
                setToast('Impossible d\'ajouter le pack au panier');
                setTimeout(() => setToast(null), 3000);
            },
        });
    };

    return (
        <GuestLayout>
            <Head title={pack.name} />

            {/* Toast Notification */}
            {toast && (
                <div className="fixed right-6 top-24 z-[60] flex items-center gap-3 rounded-xl bg-emerald-600 px-4 py-3 text-white shadow-lg animate-in slide-in-from-top">
                    <ShoppingCart className="h-5 w-5" />
                    <span className="text-sm font-medium">{toast}</span>
                </div>
            )}

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="mb-6 flex items-center gap-2 text-sm text-slate-600">
                    <Link href="/" className="hover:text-emerald-600 transition-colors flex items-center gap-1">
                        <Home className="h-4 w-4" />
                        Accueil
                    </Link>
                    <ChevronRight className="h-4 w-4" />
                    <Link href="/packs" className="hover:text-emerald-600 transition-colors">
                        Packs
                    </Link>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-slate-900 font-medium">{pack.name}</span>
                </nav>

                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Image Gallery Section */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div
                            className="relative aspect-square overflow-hidden rounded-[28px] border border-slate-200 bg-[#8C4B1F] cursor-zoom-in"
                            onClick={() => setShowImageModal(true)}
                        >
                            {selectedImage ? (
                                <img
                                    src={selectedImage}
                                    alt={pack.name}
                                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                    <Package className="h-32 w-32 text-[#F9E7CF]" />
                                </div>
                            )}

                            {/* Navigation arrows for gallery */}
                            {allImages.length > 1 && (
                                <>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition hover:bg-white"
                                    >
                                        <ChevronLeft className="h-6 w-6 text-slate-900" />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition hover:bg-white"
                                    >
                                        <ChevronRight className="h-6 w-6 text-slate-900" />
                                    </button>
                                </>
                            )}

                            {/* Out of Stock Overlay */}
                            {pack.stock_quantity === 0 && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                    <Badge className="bg-red-600 text-lg text-white">
                                        Épuisé
                                    </Badge>
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Gallery */}
                        {allImages.length > 1 && (
                            <div className="grid grid-cols-5 gap-2">
                                {allImages.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(image)}
                                        className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                                            selectedImage === image
                                                ? 'border-[#8C4B1F] ring-2 ring-[#8C4B1F]/30'
                                                : 'border-slate-200 hover:border-[#8C4B1F]/50'
                                        }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${pack.name} - ${index + 1}`}
                                            className="h-full w-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Pack Details Section */}
                    <div className="space-y-6">
                        <div>
                            <h1
                                className="mb-3 text-4xl font-bold text-[#2F5A24]"
                                style={{ fontFamily: '"Playfair Display", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
                            >
                                {pack.name}
                            </h1>

                            {pack.description && (
                                <p className="text-lg text-[#4A4A4A]">{pack.description}</p>
                            )}
                        </div>

                        {/* Pricing & Purchase Section */}
                        <div className="space-y-4 rounded-2xl border border-emerald-100 bg-white p-6 shadow-[0_25px_45px_-25px_rgba(37,99,45,0.25)]">
                            {/* Prix */}
                            <div className="flex items-baseline gap-3">
                                <span className="text-3xl font-extrabold text-emerald-800" style={{ fontFamily: '"Playfair Display", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>
                                    {Number(pack.price).toFixed(2)} TND
                                </span>
                                {pack.reference_price && (
                                    <span className="text-lg text-slate-400 line-through">
                                        {Number(pack.reference_price).toFixed(2)} TND
                                    </span>
                                )}
                            </div>

                            {/* Étiquette d'économie en orange */}
                            {pack.savings && pack.savings_percentage && (
                                <div>
                                    <Badge className="bg-orange-500 text-white hover:bg-orange-600 text-sm px-3 py-1">
                                        <Tag className="mr-1 h-3 w-3" />
                                        Économisez {Number(pack.savings).toFixed(2)} TND ({pack.savings_percentage}%)
                                    </Badge>
                                </div>
                            )}

                            {/* Stock Info */}
                            {pack.stock_quantity > 0 ? (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-emerald-600" />
                                        <span className="text-slate-700 font-medium">
                                            En stock ({pack.stock_quantity} disponible{pack.stock_quantity > 1 ? 's' : ''})
                                        </span>
                                    </div>
                                    {pack.stock_quantity < 10 && (
                                        <div className="flex items-center gap-2 text-orange-600">
                                            <AlertCircle className="h-5 w-5" />
                                            <span className="font-medium">Plus que {pack.stock_quantity} en stock !</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-red-600">
                                    <AlertCircle className="h-5 w-5" />
                                    <span className="font-medium">Rupture de stock</span>
                                </div>
                            )}

                            {/* Quantity Selector & Add to Cart */}
                            {pack.stock_quantity > 0 ? (
                                <>
                                    <div>
                                        <label htmlFor="quantity" className="text-xs uppercase text-emerald-900/60 tracking-widest block mb-2">
                                            Quantité
                                        </label>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input
                                            id="quantity"
                                            type="number"
                                            min={1}
                                            max={pack.stock_quantity}
                                            value={quantity}
                                            onChange={(e) => setQuantity(Math.max(1, Math.min(pack.stock_quantity, Number(e.target.value))))}
                                            className="h-10 w-24 rounded-full border border-emerald-200 bg-white text-center text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                            aria-label="Quantité"
                                        />
                                        <Button
                                            type="button"
                                            onClick={handleAddToCart}
                                            className="ml-auto inline-flex items-center gap-2 rounded-full bg-emerald-700 px-6 py-3 text-white hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ShoppingCart className="w-4 h-4" />
                                            Ajouter au panier
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <Button
                                    className="w-full gap-2 rounded-full bg-emerald-700 py-3 text-white hover:bg-emerald-800 disabled:opacity-50"
                                    disabled={true}
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                    Rupture de stock
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Detailed Description */}
                {pack.detailed_description && (
                    <div className="mt-12">
                        <div className="rounded-3xl border border-emerald-100 bg-white p-8 shadow-[0_25px_45px_-25px_rgba(37,99,45,0.25)]">
                            <h2 className="mb-6 text-2xl font-bold text-emerald-900" style={{ fontFamily: '"Playfair Display", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>
                                Description détaillée
                            </h2>
                            <div
                                className="prose prose-emerald prose-sm max-w-none text-emerald-900/80"
                                dangerouslySetInnerHTML={{ __html: pack.detailed_description }}
                            />
                        </div>
                    </div>
                )}

                {/* Products in Pack */}
                <div className="mt-12">
                    <div className="rounded-3xl border border-emerald-100 bg-white p-8 shadow-[0_25px_45px_-25px_rgba(37,99,45,0.25)]">
                        <h2 className="mb-6 text-2xl font-bold text-emerald-900" style={{ fontFamily: '"Playfair Display", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>
                            Composition du pack
                        </h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {pack.products.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/product/${product.slug}`}
                                    className="group flex gap-4 rounded-[28px] border border-slate-200 p-4 transition-all hover:border-[#8C4B1F] hover:shadow-lg"
                                >
                                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-[#8C4B1F]">
                                        {product.image_url ? (
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <Package className="h-8 w-8 text-[#F9E7CF]" />
                                            </div>
                                        )}
                                        <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#7A3E12] text-xs font-bold text-white">
                                            ×{product.pivot.quantity}
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <h4 className="mb-1 font-semibold text-[#2F5A24] group-hover:text-[#1f3b17] transition-colors line-clamp-2">
                                            {product.name}
                                        </h4>
                                        {product.category && (
                                            <p className="text-xs text-slate-500 mb-1">
                                                {product.category.name}
                                            </p>
                                        )}
                                        <p className="text-sm font-medium text-[#8C4B1F]">
                                            Quantité: {product.pivot.quantity}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Similar Packs Section */}
                {similarPacks.length > 0 && (
                    <div className="mt-12">
                        <h2
                            className="mb-6 text-3xl font-bold text-[#2F5A24]"
                            style={{ fontFamily: '"Playfair Display", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
                        >
                            Packs similaires
                        </h2>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {similarPacks.map((similarPack) => (
                                <Link
                                    key={similarPack.id}
                                    href={`/pack/${similarPack.slug}`}
                                    className="group flex flex-col rounded-[28px] overflow-hidden shadow-[0_35px_65px_-30px_rgba(40,40,40,0.45)] bg-white transition-transform duration-300 hover:-translate-y-1.5"
                                >
                                    <div className="relative aspect-square bg-[#8C4B1F]">
                                        {similarPack.main_image_url ? (
                                            <img
                                                src={similarPack.main_image_url}
                                                alt={similarPack.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <Package className="h-16 w-16 text-[#F9E7CF]" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6 space-y-3">
                                        <h3 className="text-xl font-semibold text-[#2F5A24] line-clamp-2 group-hover:text-[#1f3b17] transition-colors">
                                            {similarPack.name}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-[#4A4A4A]">
                                            <Package className="h-4 w-4 text-[#8C4B1F]" />
                                            <span>{similarPack.products_count} produits</span>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl font-bold text-[#2F5A24]">
                                                {Number(similarPack.price).toFixed(2)} TND
                                            </span>
                                            {similarPack.reference_price && (
                                                <span className="text-sm text-slate-400 line-through">
                                                    {Number(similarPack.reference_price).toFixed(2)} TND
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Image Zoom Modal */}
            {showImageModal && (
                <div
                    className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4"
                    onClick={() => setShowImageModal(false)}
                >
                    <button
                        onClick={() => setShowImageModal(false)}
                        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
                    >
                        <X className="h-6 w-6" />
                    </button>
                    <img
                        src={selectedImage}
                        alt={pack.name}
                        className="max-h-[90vh] max-w-[90vw] object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />
                    {allImages.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-lg transition hover:bg-white"
                            >
                                <ChevronLeft className="h-8 w-8 text-slate-900" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-lg transition hover:bg-white"
                            >
                                <ChevronRight className="h-8 w-8 text-slate-900" />
                            </button>
                        </>
                    )}
                </div>
            )}
        </GuestLayout>
    );
}
