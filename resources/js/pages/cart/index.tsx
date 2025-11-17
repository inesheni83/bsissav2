import { Head, Link, router, usePage } from '@inertiajs/react';
import { Trash2, ArrowLeft, Package, MessageSquare } from 'lucide-react';
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

type WeightVariant = {
    id: number;
    weight_value: number;
    weight_unit: 'g' | 'kg';
    price: number;
    promotional_price?: number | null;
};

type CartItem = {
    id: number;
    quantity: number;
    unit_price: string | number;
    total_price: string | number;
    product: Product;
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
                                <p className="text-sm text-emerald-900/70">Vous avez {summary.items_count} article(s) dans votre panier.</p>
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

                                    return (
                                        <div key={item.id} className="rounded-2xl border border-emerald-100 bg-white shadow-[0_25px_45px_-25px_rgba(37,99,45,0.25)]">
                                            <div className="grid grid-cols-[auto_1fr_auto] gap-4 p-6">
                                                <div>
                                                    {item.product.image_url_url ? (
                                                        <img
                                                            src={`/storage/${item.product.image_url_url}`}
                                                            alt={item.product.name}
                                                            className="h-24 w-24 rounded-xl object-cover"
                                                        />
                                                    ) : (
                                                        <div className="h-24 w-24 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-400">
                                                            <Package className="w-8 h-8" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <div>
                                                        <p className="text-lg font-semibold text-emerald-900" style={{ fontFamily: '"Playfair Display", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>
                                                            {item.product.name}
                                                        </p>
                                                        {item.weight_variant && (
                                                            <p className="text-sm font-medium text-emerald-700">
                                                                Poids: {item.weight_variant.weight_value} {item.weight_variant.weight_unit}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-4">
                                                        <div>
                                                            <label htmlFor={`quantity-${item.id}`} className="text-xs uppercase text-emerald-900/60 tracking-widest">
                                                                Quantité
                                                            </label>
                                                            <Input
                                                                id={`quantity-${item.id}`}
                                                                type="number"
                                                                min={1}
                                                                value={quantity}
                                                                onChange={(event) => handleQuantityChange(item.id, Number(event.target.value))}
                                                                className="mt-1 h-10 w-20 rounded-full border-emerald-200 text-center"
                                                            />
                                                        </div>

                                                        <div className="ml-auto text-right">
                                                            <p className="text-xs uppercase text-emerald-900/60 tracking-widest">Total</p>
                                                            <p className="text-lg font-semibold text-emerald-800">{lineTotal.toFixed(2)} TND</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-end justify-between">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-red-500 hover:text-red-600"
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
                                {summary.items_count > 0 ? (
                                    <div className="mt-4 space-y-2 text-sm text-emerald-900/70">
                                        <div className="flex items-center justify-between">
                                            <span>Sous-total</span>
                                            <span className="font-semibold text-emerald-800">{summary.subtotal.toFixed(2)} TND</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Frais de livraison</span>
                                            <span className="font-semibold text-emerald-800">{deliveryFee.toFixed(2)} TND</span>
                                        </div>
                                        <div className="flex items-center justify-between border-t border-emerald-100 pt-2 text-base">
                                            <span className="font-semibold text-emerald-900">Total</span>
                                            <span className="font-bold text-emerald-800">{(summary.subtotal + deliveryFee).toFixed(2)} TND</span>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="mt-4 text-sm text-emerald-900/60">Votre panier est vide.</p>
                                )}

                                <Button
                                    type="button"
                                    onClick={proceedToCheckout}
                                    className="mt-6 w-full rounded-full bg-emerald-700 hover:bg-emerald-800 text-white py-3"
                                    disabled={summary.items_count === 0}
                                >
                                    Passer à la livraison
                                </Button>

                                {summary.items_count > 0 && (
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








