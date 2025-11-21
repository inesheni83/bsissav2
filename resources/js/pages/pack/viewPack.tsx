import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Package, Edit, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

type Product = {
    id: number;
    name: string;
    slug: string;
    image_url: string | null;
    pivot: {
        quantity: number;
    };
    weight_variants?: Array<{
        id: number;
        weight: number;
        unit: string;
        price: number;
    }>;
};

type User = {
    id: number;
    name: string;
};

type Pack = {
    id: number;
    name: string;
    slug: string;
    description: string;
    main_image_url: string | null;
    gallery_images: Array<{
        path: string;
        url: string;
        base64: string;
        mime_type: string;
    }> | null;
    price: number;
    reference_price: number | null;
    savings: number | null;
    savings_percentage: number | null;
    is_active: boolean;
    stock_quantity: number;
    products: Product[];
    creator: User | null;
    updater: User | null;
    created_at: string;
    updated_at: string;
};

type PageProps = {
    pack: Pack;
};

export default function ViewPack({ pack }: PageProps) {
    return (
        <AppLayout>
            <Head title={pack.name} />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50">
                <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="mb-4">
                            <Link href={route('packs.index')}>
                                <Button variant="ghost" size="sm">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Retour à la liste
                                </Button>
                            </Link>
                        </div>

                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-3 shadow-lg">
                                    <Package className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900">
                                        {pack.name}
                                    </h1>
                                    <p className="text-sm text-slate-600">{pack.slug}</p>
                                </div>
                            </div>

                            <Link href={route('packs.edit', pack.id)}>
                                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Modifier
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Left Column - Images and Description */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Main Image */}
                            {pack.main_image_url && (
                                <Card>
                                    <CardContent className="p-6">
                                        <img
                                            src={pack.main_image_url}
                                            alt={pack.name}
                                            className="w-full rounded-lg object-cover"
                                            style={{ maxHeight: '400px' }}
                                        />
                                    </CardContent>
                                </Card>
                            )}

                            {/* Gallery Images */}
                            {pack.gallery_images && pack.gallery_images.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Galerie d'images</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                                            {pack.gallery_images.map((image, index) => (
                                                <img
                                                    key={index}
                                                    src={image.url}
                                                    alt={`${pack.name} - ${index + 1}`}
                                                    className="h-32 w-full rounded-lg object-cover"
                                                />
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Description */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Description</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="whitespace-pre-wrap text-slate-700">
                                        {pack.description}
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Products */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Produits inclus</CardTitle>
                                    <CardDescription>
                                        {pack.products.length} produit
                                        {pack.products.length > 1 ? 's' : ''} dans ce pack
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {pack.products.map((product) => (
                                            <div
                                                key={product.id}
                                                className="flex items-center gap-4 rounded-lg border bg-white p-3"
                                            >
                                                {product.image_url ? (
                                                    <img
                                                        src={product.image_url}
                                                        alt={product.name}
                                                        className="h-16 w-16 rounded-lg object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-slate-100">
                                                        <ShoppingBag className="h-8 w-8 text-slate-400" />
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <p className="font-medium text-slate-900">
                                                        {product.name}
                                                    </p>
                                                    <p className="text-sm text-slate-500">
                                                        {product.slug}
                                                    </p>
                                                </div>
                                                <Badge variant="secondary">
                                                    Qté: {product.pivot.quantity}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column - Pack Info */}
                        <div className="space-y-6">
                            {/* Price and Status */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Informations</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <p className="text-sm text-slate-600">Prix du pack</p>
                                        <div className="mt-1 flex items-baseline gap-2">
                                            <span className="text-3xl font-bold text-emerald-600">
                                                {Number(pack.price).toFixed(2)} DT
                                            </span>
                                        </div>
                                        {pack.reference_price && (
                                            <p className="mt-1 text-sm text-slate-400 line-through">
                                                {Number(pack.reference_price).toFixed(2)} DT
                                            </p>
                                        )}
                                    </div>

                                    {pack.savings && pack.savings_percentage && (
                                        <>
                                            <Separator />
                                            <div className="rounded-lg bg-orange-50 p-3 border border-orange-200">
                                                <p className="text-sm font-medium text-slate-700 mb-2">
                                                    Économie réalisée
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <Badge className="bg-orange-100 text-orange-700">
                                                        -{pack.savings_percentage}%
                                                    </Badge>
                                                    <span className="text-lg font-bold text-orange-700">
                                                        {Number(pack.savings).toFixed(2)} DT
                                                    </span>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <Separator />

                                    <div>
                                        <p className="text-sm text-slate-600">Stock disponible</p>
                                        <p className="mt-1 text-2xl font-semibold text-slate-900">
                                            {pack.stock_quantity}
                                        </p>
                                    </div>

                                    <Separator />

                                    <div>
                                        <p className="text-sm text-slate-600">Statut</p>
                                        {pack.is_active ? (
                                            <Badge className="mt-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                                                Actif
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary" className="mt-2">
                                                Inactif
                                            </Badge>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Metadata */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Métadonnées</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                    {pack.creator && (
                                        <div>
                                            <p className="text-slate-600">Créé par</p>
                                            <p className="mt-1 font-medium text-slate-900">
                                                {pack.creator.name}
                                            </p>
                                        </div>
                                    )}

                                    <div>
                                        <p className="text-slate-600">Date de création</p>
                                        <p className="mt-1 font-medium text-slate-900">
                                            {new Date(pack.created_at).toLocaleDateString('fr-FR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>

                                    {pack.updater && (
                                        <>
                                            <Separator />
                                            <div>
                                                <p className="text-slate-600">Dernière modification par</p>
                                                <p className="mt-1 font-medium text-slate-900">
                                                    {pack.updater.name}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-slate-600">
                                                    Date de dernière modification
                                                </p>
                                                <p className="mt-1 font-medium text-slate-900">
                                                    {new Date(pack.updated_at).toLocaleDateString(
                                                        'fr-FR',
                                                        {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        }
                                                    )}
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
