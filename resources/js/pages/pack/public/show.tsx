import GuestLayout from '@/layouts/guest-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Package, ShoppingCart, Tag, ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

type PageProps = {
    pack: Pack;
};

export default function PackPublicShow({ pack }: PageProps) {
    const [selectedImage, setSelectedImage] = useState<string>(pack.main_image_url || '');
    const [quantity, setQuantity] = useState(1);

    const allImages = [
        pack.main_image_url,
        ...(pack.gallery_images?.map((img) => img.url) || []),
    ].filter((img): img is string => img !== null);

    const handleAddToCart = () => {
        // TODO: Implement add to cart for packs
        router.post('/cart/packs', {
            pack_id: pack.id,
            quantity: quantity,
        });
    };

    const totalProducts = pack.products.reduce((sum, product) => sum + product.pivot.quantity, 0);

    return (
        <GuestLayout>
            <Head title={pack.name} />

            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Link
                        href="/packs"
                        className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Retour aux packs
                    </Link>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                            {selectedImage ? (
                                <img
                                    src={selectedImage}
                                    alt={pack.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                    <Package className="h-32 w-32 text-slate-300" />
                                </div>
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
                                                ? 'border-emerald-500'
                                                : 'border-slate-200 hover:border-emerald-300'
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

                    {/* Pack Details */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="mb-3 text-3xl font-bold text-slate-900">
                                {pack.name}
                            </h1>

                            {pack.description && (
                                <p className="text-lg text-slate-600">{pack.description}</p>
                            )}
                        </div>

                        {/* Pricing */}
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
                            <div className="mb-3 flex items-baseline gap-3">
                                <span className="text-4xl font-bold text-emerald-600">
                                    {Number(pack.price).toFixed(2)} DT
                                </span>
                                {pack.reference_price && (
                                    <span className="text-xl text-slate-400 line-through">
                                        {Number(pack.reference_price).toFixed(2)} DT
                                    </span>
                                )}
                            </div>

                            {pack.savings && pack.savings_percentage && (
                                <div className="flex flex-col gap-2">
                                    <Badge className="w-fit bg-orange-500 text-white hover:bg-orange-600">
                                        <Tag className="mr-1 h-4 w-4" />
                                        Économisez {Number(pack.savings).toFixed(2)} DT ({pack.savings_percentage}%)
                                    </Badge>
                                </div>
                            )}
                        </div>

                        {/* Stock Info */}
                        <div className="flex items-center gap-2 text-sm">
                            {pack.stock_quantity > 0 ? (
                                <>
                                    <Check className="h-5 w-5 text-emerald-600" />
                                    <span className="text-slate-700">
                                        En stock ({pack.stock_quantity} disponible{pack.stock_quantity > 1 ? 's' : ''})
                                    </span>
                                </>
                            ) : (
                                <span className="text-red-600">Rupture de stock</span>
                            )}
                        </div>

                        {/* Quantity Selector */}
                        {pack.stock_quantity > 0 && (
                            <div className="flex items-center gap-4">
                                <label className="text-sm font-medium text-slate-700">
                                    Quantité:
                                </label>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={quantity <= 1}
                                    >
                                        -
                                    </Button>
                                    <span className="w-12 text-center font-medium">{quantity}</span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setQuantity(Math.min(pack.stock_quantity, quantity + 1))}
                                        disabled={quantity >= pack.stock_quantity}
                                    >
                                        +
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Add to Cart Button */}
                        <Button
                            className="w-full gap-2 bg-emerald-600 py-6 text-lg hover:bg-emerald-700"
                            disabled={pack.stock_quantity === 0}
                            onClick={handleAddToCart}
                        >
                            <ShoppingCart className="h-5 w-5" />
                            Ajouter au panier
                        </Button>

                        {/* Product Count Info */}
                        <div className="rounded-lg bg-slate-50 p-4">
                            <div className="flex items-center gap-2 text-slate-700">
                                <Package className="h-5 w-5 text-emerald-600" />
                                <span className="font-medium">
                                    Ce pack contient {totalProducts} article{totalProducts > 1 ? 's' : ''} ({pack.products.length} produit{pack.products.length > 1 ? 's' : ''} différent{pack.products.length > 1 ? 's' : ''})
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed Description */}
                {pack.detailed_description && (
                    <Card className="mt-8">
                        <CardHeader>
                            <CardTitle>Description détaillée</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div
                                className="prose max-w-none text-slate-700"
                                dangerouslySetInnerHTML={{ __html: pack.detailed_description }}
                            />
                        </CardContent>
                    </Card>
                )}

                {/* Products in Pack */}
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Produits inclus dans ce pack</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {pack.products.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/product/${product.slug}`}
                                    className="group flex gap-4 rounded-lg border border-slate-200 p-4 transition-all hover:border-emerald-300 hover:shadow-md"
                                >
                                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                                        {product.image_url ? (
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <Package className="h-8 w-8 text-slate-300" />
                                            </div>
                                        )}
                                        <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                                            {product.pivot.quantity}
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <h4 className="mb-1 font-semibold text-slate-900 group-hover:text-emerald-600 line-clamp-2">
                                            {product.name}
                                        </h4>
                                        {product.category && (
                                            <p className="text-xs text-slate-500">
                                                {product.category.name}
                                            </p>
                                        )}
                                        <p className="mt-1 text-sm text-slate-600">
                                            Quantité: {product.pivot.quantity}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </GuestLayout>
    );
}
