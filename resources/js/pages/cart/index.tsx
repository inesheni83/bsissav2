import { Head, Link, router, usePage } from '@inertiajs/react';
import { Trash2, ArrowLeft, Package, MessageSquare, AlertCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import PublicLayout from '@/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { SharedData } from '@/types';

type Product = {
    id: number;
    name: string;
    image?: string | null;
    price: string | number;
};

type Pack = {
    id: number;
    name: string;
    slug: string;
    main_image_url: string | null;
    price: number;
    products_count: number;
    stock_quantity: number;
};

type WeightVariant = {
    id: number;
    weight_value: number;
    weight_unit: 'g' | 'kg';
    price: number;
    promotional_price?: number | null;
    stock_quantity: number;
};

type CartItem = {
    id: number;
    quantity: number;
    unit_price: string | number;
    total_price: string | number;
    product?: Product;
    pack?: Pack;
    weight_variant?: WeightVariant | null;
};

type Paginator<T> = {
    data: T[];
};

type CartSummary = {
    subtotal: number;
    items_count: number;
};

type CartPageProps = {
    items: Paginator<CartItem>;
    summary: CartSummary;
    deliveryFee: number;
    savedNote: string;
};

export default function CartPage({ items, summary, deliveryFee, savedNote }: CartPageProps) {
    const { flash } = usePage<SharedData>().props;
    const initialState = useMemo(
        () =>
            items.data.reduce<Record<number, { quantity: number }>>((acc, item) => {
                acc[item.id] = { quantity: item.quantity };
                return acc;
            }, {}),
        [items.data],
    );

    const [formState, setFormState] = useState(initialState);
    const [cartNote, setCartNote] = useState(savedNote);

    useEffect(() => {
        setFormState(initialState);
    }, [initialState]);

    // Recalcul automatique du total en temps réel
    const calculatedSummary = useMemo(() => {
        let subtotal = 0;
        let itemsCount = 0;

        items.data.forEach((item) => {
            const quantity = formState[item.id]?.quantity ?? item.quantity;
            subtotal += quantity * Number(item.unit_price);
            itemsCount += quantity;
        });

        return {
            subtotal,
            itemsCount,
        };
    }, [formState, items.data]);

    const handleQuantityChange = (itemId: number, quantity: number) => {
        setFormState((prev) => ({
            ...prev,
            [itemId]: { ...prev[itemId], quantity },
        }));

        // Mettre à jour automatiquement
        router.patch(
            `/cart/items/${itemId}`,
            {
                quantity,
            },
            { preserveScroll: true },
        );
    };

    const removeItem = (itemId: number) => {
        router.delete(`/cart/items/${itemId}`, { preserveScroll: true });
    };

    const clearCart = () => {
        router.delete('/cart', { preserveScroll: true });
    };

    const proceedToCheckout = () => {
        // Sauvegarder la note dans la session
        if (cartNote) {
            sessionStorage.setItem('cart_note', cartNote);
        }
        router.visit('/checkout');
    };

    return (
        <PublicLayout>
            <Head title="Panier" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col gap-6">
                    {flash?.success && (
                        <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {flash.error}
                        </div>
                    )}

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg font-semibold">
                                🛒
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-emerald-900">Panier</h1>
                                <p className="text-sm text-emerald-900/70">Vous avez {calculatedSummary.itemsCount} article(s) dans votre panier.</p>
                            </div>
                        </div>
                        <Link href="/" className="inline-flex items-center gap-2 text-sm text-emerald-700 hover:text-emerald-900">
                            <ArrowLeft className="w-4 h-4" /> Poursuivre vos achats
                        </Link>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-[2fr_1fr] items-start">
                        <div className="space-y-6">
                            {items.data.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-emerald-200 bg-white p-10 text-center">
                                    <p className="text-lg font-semibold text-emerald-800">Votre panier est vide</p>
                                    <p className="text-sm text-emerald-900/70 mt-2">Ajoutez des produits pour continuer vos achats.</p>
                                    <div className="mt-6">
                                        <Link href="/">
                                            <Button className="bg-emerald-700 hover:bg-emerald-800 text-white">Découvrir la boutique</Button>
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                items.data.map((item) => {
                                    const quantity = formState[item.id]?.quantity ?? item.quantity;
                                    const lineTotal = quantity * Number(item.unit_price);
                                    const isPack = !!item.pack;

                                    // Determine image, name, additional info, and stock
                                    let imageUrl: string | null = null;
                                    let name = '';
                                    let additionalInfo: string | null = null;
                                    let stockQuantity = 0;
                                    let hasStockIssue = false;

                                    if (isPack && item.pack) {
                                        imageUrl = item.pack.main_image_url;
                                        name = item.pack.name;
                                        additionalInfo = `Pack de ${item.pack.products_count} produit${item.pack.products_count > 1 ? 's' : ''}`;
                                        stockQuantity = item.pack.stock_quantity;
                                        hasStockIssue = quantity > stockQuantity;
                                    } else if (item.product) {
                                        imageUrl = item.product.image ?? null;
                                        name = item.product.name;
                                        if (item.weight_variant) {
                                            additionalInfo = `Poids: ${item.weight_variant.weight_value} ${item.weight_variant.weight_unit}`;
                                            stockQuantity = item.weight_variant.stock_quantity;
                                            hasStockIssue = quantity > stockQuantity;
                                        }
                                    }

                                    return (
                                        <div
                                            key={item.id}
                                            className={`rounded-2xl border ${isPack ? 'border-amber-200 bg-gradient-to-br from-amber-50/50 to-white' : 'border-emerald-100 bg-white'} shadow-[0_25px_45px_-25px_rgba(37,99,45,0.25)]`}
                                        >
                                            {isPack && (
                                                <div className="px-6 pt-4 pb-2">
                                                    <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-xs font-semibold text-white">
                                                        <Package className="h-3 w-3" />
                                                        PACK
                                                    </div>
                                                </div>
                                            )}
                                            <div className="grid grid-cols-[auto_1fr_auto] gap-4 p-6 pt-3">
                                                <div>
                                                    {imageUrl ? (
                                                        <img
                                                            src={imageUrl}
                                                            alt={name}
                                                            className={`h-24 w-24 rounded-xl object-cover ${isPack ? 'ring-2 ring-amber-400' : ''}`}
                                                        />
                                                    ) : (
                                                        <div className={`h-24 w-24 rounded-xl ${isPack ? 'bg-amber-100 text-amber-600' : 'bg-emerald-50 text-emerald-400'} flex items-center justify-center`}>
                                                            <Package className="w-8 h-8" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <div>
                                                        <p className={`text-lg font-semibold ${isPack ? 'text-amber-900' : 'text-emerald-900'}`} style={{ fontFamily: '"Playfair Display", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>
                                                            {name}
                                                        </p>
                                                        {additionalInfo && (
                                                            <p className={`text-sm font-medium ${isPack ? 'text-amber-700' : 'text-emerald-700'}`}>
                                                                {additionalInfo}
                                                            </p>
                                                        )}
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            Prix unitaire: {Number(item.unit_price).toFixed(2)} TND
                                                        </p>
                                                        {hasStockIssue && (
                                                            <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-red-50 px-2 py-1.5 text-xs text-red-700 border border-red-200">
                                                                <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                                                                <span className="font-medium">
                                                                    Stock insuffisant ! Seulement {stockQuantity} disponible{stockQuantity > 1 ? 's' : ''}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-4">
                                                        <div>
                                                            <label htmlFor={`quantity-${item.id}`} className={`text-xs uppercase ${isPack ? 'text-amber-900/60' : 'text-emerald-900/60'} tracking-widest`}>
                                                                Quantité
                                                            </label>
                                                            <Input
                                                                id={`quantity-${item.id}`}
                                                                type="number"
                                                                min={1}
                                                                max={stockQuantity}
                                                                value={quantity}
                                                                onChange={(event) => {
                                                                    const newQuantity = Number(event.target.value);
                                                                    handleQuantityChange(item.id, Math.min(newQuantity, stockQuantity));
                                                                }}
                                                                className={`mt-1 h-10 w-20 rounded-full text-center ${hasStockIssue ? 'border-red-300 focus:ring-red-400' : isPack ? 'border-amber-300 focus:ring-amber-400' : 'border-emerald-200 focus:ring-emerald-400'}`}
                                                            />
                                                        </div>

                                                        <div className="ml-auto text-right">
                                                            <p className={`text-xs uppercase ${isPack ? 'text-amber-900/60' : 'text-emerald-900/60'} tracking-widest`}>Total</p>
                                                            <p className={`text-lg font-semibold ${isPack ? 'text-amber-800' : 'text-emerald-800'}`}>{lineTotal.toFixed(2)} TND</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-end justify-between">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-red-500 hover:text-red-600 transition-colors"
                                                        aria-label="Retirer l'article"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        <aside className="space-y-6">
                            <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-[0_25px_45px_-25px_rgba(37,99,45,0.25)]">
                                <h2 className="text-lg font-semibold text-emerald-900">Récapitulatif</h2>
                                {calculatedSummary.itemsCount > 0 ? (
                                    <div className="mt-4 space-y-2 text-sm text-emerald-900/70">
                                        <div className="flex items-center justify-between">
                                            <span>Sous-total</span>
                                            <span className="font-semibold text-emerald-800">{calculatedSummary.subtotal.toFixed(2)} TND</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Frais de livraison</span>
                                            <span className="font-semibold text-emerald-800">{deliveryFee.toFixed(2)} TND</span>
                                        </div>
                                        <div className="flex items-center justify-between border-t border-emerald-100 pt-2 text-base">
                                            <span className="font-semibold text-emerald-900">Total</span>
                                            <span className="font-bold text-emerald-800">{(calculatedSummary.subtotal + deliveryFee).toFixed(2)} TND</span>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="mt-4 text-sm text-emerald-900/60">Votre panier est vide.</p>
                                )}

                                <Button
                                    type="button"
                                    onClick={proceedToCheckout}
                                    className="mt-6 w-full rounded-full bg-emerald-700 hover:bg-emerald-800 text-white py-3"
                                    disabled={calculatedSummary.itemsCount === 0}
                                >
                                    Passer à la livraison
                                </Button>

                                {calculatedSummary.itemsCount > 0 && (
                                    <button
                                        type="button"
                                        onClick={clearCart}
                                        className="mt-4 text-sm text-red-500 hover:text-red-600"
                                    >
                                        Vider le panier
                                    </button>
                                )}
                            </div>

                            <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-[0_25px_45px_-25px_rgba(37,99,45,0.25)]">
                                <label htmlFor="cart-note" className="flex items-center gap-2 text-sm font-medium text-emerald-900">
                                    <MessageSquare className="h-4 w-4" />
                                    Note pour votre commande
                                </label>
                                <textarea
                                    id="cart-note"
                                    value={cartNote}
                                    onChange={(e) => setCartNote(e.target.value)}
                                    placeholder="Ajoutez des instructions spéciales pour votre commande..."
                                    maxLength={255}
                                    className="mt-2 min-h-[100px] w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm text-emerald-900 placeholder:text-emerald-900/40 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                />
                                <p className="mt-1 text-xs text-emerald-900/60">{cartNote.length}/255 caractères</p>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}








