import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, Package } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import type { SharedData } from '@/types';
import { Button } from '@/components/ui/button';

interface CheckoutProduct {
    id: number;
    name: string;
    image?: string | null;
    price: string | number;
}

interface CheckoutItem {
    id: number;
    quantity: number;
    unit_price: string | number;
    total_price: string | number;
    note?: string | null;
    product: CheckoutProduct;
}

interface CheckoutDelivery {
    first_name: string;
    last_name: string;
    address: string;
    country: string;
    region: string;
    city: string;
    postal_code: string;
    phone: string;
    note?: string | null;
}

interface UserInfo {
    name: string;
    phone?: string | null;
    address_line1?: string | null;
    address_line2?: string | null;
    city?: string | null;
    state?: string | null;
    postal_code?: string | null;
    country?: string | null;
}

interface CheckoutProps {
    items: CheckoutItem[];
    summary: {
        subtotal: number;
        items_count: number;
    };
    deliveryFee: number;
    delivery?: CheckoutDelivery | null;
    regions: string[];
    userInfo?: UserInfo | null;
}

type CheckoutFormData = {
    first_name: string;
    last_name: string;
    address: string;
    country: string;
    region: string;
    city: string;
    postal_code: string;
    phone: string;
    note?: string;
};

const DEFAULT_COUNTRY = 'Tunisie';

export default function CheckoutPage({ items, summary, deliveryFee, delivery, regions, userInfo }: CheckoutProps) {
    const { flash } = usePage<SharedData>().props;
    const availableRegions = regions.length > 0 ? regions : [
        'Ariana',
        'Beja',
        'Ben Arous',
        'Bizerte',
        'Gabes',
        'Gafsa',
        'Jendouba',
        'Kairouan',
        'Kasserine',
        'Kebili',
        'Le Kef',
        'Mahdia',
        'La Manouba',
        'Medenine',
        'Monastir',
        'Nabeul',
        'Sfax',
        'Sidi Bouzid',
        'Siliana',
        'Sousse',
        'Tataouine',
        'Tozeur',
        'Tunis',
        'Zaghouan',
    ];

    // Récupérer la note du sessionStorage
    const cartNote = typeof window !== 'undefined' ? sessionStorage.getItem('cart_note') : null;

    // Séparer le nom complet en prénom et nom si disponible
    const splitName = (fullName: string) => {
        const parts = fullName.trim().split(' ');
        if (parts.length === 1) {
            return { firstName: parts[0], lastName: '' };
        }
        const firstName = parts[0];
        const lastName = parts.slice(1).join(' ');
        return { firstName, lastName };
    };

    const { firstName, lastName } = userInfo?.name ? splitName(userInfo.name) : { firstName: '', lastName: '' };

    // Construire l'adresse à partir de address_line1 et address_line2
    const buildAddress = () => {
        if (!userInfo) return '';
        const parts = [userInfo.address_line1, userInfo.address_line2].filter(Boolean);
        return parts.join(', ');
    };

    const { data, setData, post, processing, errors } = useForm<CheckoutFormData>({
        first_name: delivery?.first_name ?? firstName,
        last_name: delivery?.last_name ?? lastName,
        address: delivery?.address ?? buildAddress(),
        country: delivery?.country ?? userInfo?.country ?? DEFAULT_COUNTRY,
        region: delivery?.region ?? userInfo?.state ?? '',
        city: delivery?.city ?? userInfo?.city ?? '',
        postal_code: delivery?.postal_code ?? userInfo?.postal_code ?? '',
        phone: delivery?.phone ?? userInfo?.phone ?? '',
        note: delivery?.note ?? cartNote ?? '',
    });

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post('/checkout', {
            preserveScroll: true,
            onSuccess: () => {
                // Nettoyer le sessionStorage après succès
                if (typeof window !== 'undefined') {
                    sessionStorage.removeItem('cart_note');
                }
            },
        });
    };

    return (
        <PublicLayout>
            <Head title="Livraison" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1
                            className="text-3xl font-bold text-emerald-900"
                            style={{ fontFamily: '"Playfair Display", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
                        >
                            Livraison
                        </h1>
                        <p className="text-sm text-emerald-900/70">
                            Verifiez votre commande avant de renseigner vos informations de livraison.
                        </p>
                    </div>
                    <Link href="/cart" className="inline-flex items-center gap-2 text-sm text-emerald-700 hover:text-emerald-900">
                        <ArrowLeft className="w-4 h-4" /> Retour au panier
                    </Link>
                </div>

                {flash?.error && (
                    <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {flash.error}
                    </div>
                )}
                {flash?.success && (
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                        {flash.success}
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-[2fr_1fr] items-start">
                    <div className="space-y-6">
                        <div className="rounded-2xl border border-emerald-100 bg-white shadow-[0_25px_45px_-25px_rgba(37,99,45,0.25)] divide-y">
                            {items.map((item) => (
                                <div key={item.id} className="grid gap-4 p-6 sm:grid-cols-[auto_1fr_auto]">
                                    <div className="h-20 w-20 overflow-hidden rounded-xl bg-emerald-50">
                                        {item.product.image_url_url ? (
                                            <img src={`/storage/${item.product.image_url_url}`} alt={item.product.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-emerald-300">
                                                <Package className="w-8 h-8" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-lg font-semibold text-emerald-900">{item.product.name}</p>
                                        <p className="text-sm text-emerald-900/70">Quantite : {item.quantity}</p>
                                        {item.note && <p className="text-xs text-emerald-900/60">Note : {item.note}</p>}
                                    </div>
                                    <div className="text-right text-lg font-semibold text-emerald-800">{Number(item.total_price).toFixed(2)} TND</div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 rounded-2xl border border-emerald-100 bg-white p-6 shadow-[0_25px_45px_-25px_rgba(37,99,45,0.25)]">
                            <h2 className="text-lg font-semibold text-emerald-900">Informations de livraison</h2>
                            <form className="space-y-4" onSubmit={submit}>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-emerald-900" htmlFor="first-name">
                                    Prenom
                                </label>
                                <input
                                    id="first-name"
                                    name="first_name"
                                    type="text"
                                    autoComplete="given-name"
                                    value={data.first_name}
                                    onChange={(event) => setData('first_name', event.target.value)}
                                    className="w-full rounded-2xl border border-emerald-200 px-3 py-2 text-sm text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                    required
                                />
                                {errors.first_name && <p className="text-sm text-red-600">{errors.first_name}</p>}
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-emerald-900" htmlFor="last-name">
                                    Nom
                                </label>
                                <input
                                    id="last-name"
                                    name="last_name"
                                    type="text"
                                    autoComplete="family-name"
                                    value={data.last_name}
                                    onChange={(event) => setData('last_name', event.target.value)}
                                    className="w-full rounded-2xl border border-emerald-200 px-3 py-2 text-sm text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                    required
                                />
                                {errors.last_name && <p className="text-sm text-red-600">{errors.last_name}</p>}
                            </div>
                        </div>

                        <div className="grid gap-2 sm:grid-cols-[120px_1fr] sm:items-start sm:gap-4">
                            <label className="text-sm font-medium text-emerald-900 sm:pt-2" htmlFor="address-line">
                                Adresse
                            </label>
                            <div className="space-y-1">
                                <textarea
                                    id="address-line"
                                    name="address"
                                    required
                                    autoComplete="street-address"
                                    value={data.address}
                                    onChange={(event) => setData('address', event.target.value)}
                                    placeholder="Rue et numero..."
                                    className="min-h-[90px] w-full rounded-2xl border border-emerald-200 px-3 py-2 text-sm text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                />
                                {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-emerald-900" htmlFor="city">
                                    Ville
                                </label>
                                <input
                                    id="city"
                                    name="city"
                                    type="text"
                                    autoComplete="address-level2"
                                    value={data.city}
                                    onChange={(event) => setData('city', event.target.value)}
                                    className="w-full rounded-2xl border border-emerald-200 px-3 py-2 text-sm text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                    required
                                />
                                {errors.city && <p className="text-sm text-red-600">{errors.city}</p>}
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-emerald-900" htmlFor="postal-code">
                                    Code postal
                                </label>
                                <input
                                    id="postal-code"
                                    name="postal_code"
                                    type="text"
                                    inputMode="numeric"
                                    autoComplete="postal-code"
                                    value={data.postal_code}
                                    onChange={(event) => setData('postal_code', event.target.value)}
                                    className="w-full rounded-2xl border border-emerald-200 px-3 py-2 text-sm text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                    required
                                />
                                {errors.postal_code && <p className="text-sm text-red-600">{errors.postal_code}</p>}
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-emerald-900" htmlFor="country">
                                    Pays
                                </label>
                                <input
                                    id="country"
                                    name="country"
                                    type="text"
                                    autoComplete="country-name"
                                    value={data.country}
                                    onChange={(event) => setData('country', event.target.value)}
                                    className="w-full rounded-2xl border border-emerald-200 px-3 py-2 text-sm text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                    required
                                />
                                {errors.country && <p className="text-sm text-red-600">{errors.country}</p>}
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-emerald-900" htmlFor="region">
                                    Region
                                </label>
                                <select
                                    id="region"
                                    name="region"
                                    autoComplete="address-level1"
                                    value={data.region}
                                    onChange={(event) => setData('region', event.target.value)}
                                    className="w-full rounded-2xl border border-emerald-200 bg-white px-3 py-2 text-sm text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                    required
                                >
                                    <option value="" disabled>
                                        Selectionnez une region
                                    </option>
                                    {availableRegions.map((regionOption) => (
                                        <option key={regionOption} value={regionOption}>
                                            {regionOption}
                                        </option>
                                    ))}
                                </select>
                                {errors.region && <p className="text-sm text-red-600">{errors.region}</p>}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-emerald-900" htmlFor="phone">
                                Numero de telephone
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                autoComplete="tel"
                                value={data.phone}
                                onChange={(event) => setData('phone', event.target.value)}
                                placeholder="+216 12345678"
                                className="w-full rounded-2xl border border-emerald-200 px-3 py-2 text-sm text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                required
                            />
                            {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-emerald-900" htmlFor="note">
                                Note (optionnelle)
                            </label>
                            <textarea
                                id="note"
                                name="note"
                                value={data.note}
                                onChange={(event) => setData('note', event.target.value)}
                                placeholder="Ajouter une note pour votre commande..."
                                className="min-h-[90px] w-full rounded-2xl border border-emerald-200 px-3 py-2 text-sm text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            />
                            {errors.note && <p className="text-sm text-red-600">{errors.note}</p>}
                        </div>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-full bg-emerald-700 py-3 text-white hover:bg-emerald-800 disabled:opacity-70"
                                >
                                    <CheckCircle2 className="w-5 h-5" /> Confirmer la livraison
                                </Button>
                            </form>
                        </div>
                    </div>

                    <aside className="space-y-6">
                        <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-[0_25px_45px_-25px_rgba(37,99,45,0.25)]">
                            <h2 className="text-lg font-semibold text-emerald-900">Récapitulatif</h2>
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
                        </div>

                        <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-[0_25px_45px_-25px_rgba(37,99,45,0.25)]">
                            <h2 className="text-lg font-semibold text-emerald-900">Méthode de paiement</h2>
                            <div className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                                    💵
                                </div>
                                <div>
                                    <p className="font-medium text-emerald-900">Paiement à la livraison</p>
                                    <p className="text-xs text-emerald-700">Payez en espèces lors de la réception</p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </PublicLayout>
    );
}



