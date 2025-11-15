import { Head, Link } from '@inertiajs/react';
import { ArrowRight, CheckCircle2, Package } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { home } from '@/routes/index';

interface OrderItem {
    product_id: number | null;
    name: string;
    image?: string | null;
    quantity: number;
    unit_price: number;
    total_price: number;
    note?: string | null;
}

interface DeliveryDetails {
    first_name: string;
    last_name: string;
    address: string;
    country: string;
    region: string;
    city: string;
    postal_code: string;
    phone: string;
}

interface StatusMeta {
    label: string;
    badge: string;
    description?: string;
}

interface OrderDetailProps {
    order: {
        id: number;
        reference: string;
        status: string;
        status_meta?: StatusMeta;
        subtotal: number;
        delivery_fee: number;
        total: number;
        items_count: number;
        created_at: string | null;
        items: OrderItem[];
        delivery: DeliveryDetails;
    };
    statusMeta?: Record<string, StatusMeta>;
}

const currency = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'TND',
});

export default function OrderShowPage({ order, statusMeta }: OrderDetailProps) {
    const delivery = order.delivery;
    const hasItems = order.items.length > 0;
    const meta = order.status_meta ?? (statusMeta ? statusMeta[order.status] : undefined);

    return (
        <PublicLayout>
            <Head title={`Commande ${order.reference}`} />

            <div className="mx-auto max-w-4xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
                <div className="rounded-3xl border border-emerald-100 bg-white p-8 text-center shadow-[0_25px_45px_-25px_rgba(37,99,45,0.25)]">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                        <CheckCircle2 className="h-9 w-9" />
                    </div>
                    <h1 className="mt-4 text-3xl font-semibold text-emerald-900">Merci pour votre commande !</h1>
                    <p className="mt-2 text-sm text-emerald-900/70">
                        Commande <span className="font-semibold">#{order.reference}</span> enregistree
                        {order.created_at && (
                            <>
                                {' '}le{' '}
                                {new Date(order.created_at).toLocaleDateString('fr-FR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                })}
                            </>
                        )}
                        .
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                        <Button variant="outline" asChild className="rounded-full border-emerald-200 text-emerald-800 hover:bg-emerald-50">
                            <Link href="/orders">
                                Historique
                            </Link>
                        </Button>
                        <Button variant="ghost" asChild className="rounded-full text-emerald-700 hover:bg-emerald-50">
                            <Link href={home().url}>
                                Accueil <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="space-y-6">
                    <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-[0_25px_45px_-25px_rgba(37,99,45,0.15)]">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-semibold text-emerald-900">Resume de commande</h2>
                                <p className="text-sm text-emerald-900/70">Les informations principales de cette commande.</p>
                            </div>
                            {meta && (
                                <Badge className={`rounded-full px-3 py-1 text-xs font-semibold ${meta.badge}`}>
                                    {meta.label}
                                </Badge>
                            )}
                        </div>
                        <dl className="mt-4 grid gap-4 text-sm text-emerald-900/80 sm:grid-cols-2">
                            <div>
                                <dt className="font-medium text-emerald-900">Reference</dt>
                                <dd>#{order.reference}</dd>
                            </div>
                            <div>
                                <dt className="font-medium text-emerald-900">Nombre d&apos;articles</dt>
                                <dd>{order.items_count}</dd>
                            </div>
                            <div>
                                <dt className="font-medium text-emerald-900">Sous-total</dt>
                                <dd>{currency.format(order.subtotal)}</dd>
                            </div>
                            <div>
                                <dt className="font-medium text-emerald-900">Frais de livraison</dt>
                                <dd>{currency.format(order.delivery_fee)}</dd>
                            </div>
                            <div className="sm:col-span-2">
                                <dt className="font-semibold text-emerald-900">Montant total</dt>
                                <dd className="text-base font-bold text-emerald-800">{currency.format(order.total)}</dd>
                            </div>
                            {meta?.description && <div className="sm:col-span-2 text-emerald-900/70">{meta.description}</div>}
                        </dl>
                    </section>

                    <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-[0_25px_45px_-25px_rgba(37,99,45,0.15)]">
                        <h2 className="text-lg font-semibold text-emerald-900">Adresse de livraison</h2>
                        <div className="mt-4 text-sm text-emerald-900/80">
                            <p className="font-medium text-emerald-900">
                                {delivery.first_name} {delivery.last_name}
                            </p>
                            <p>{delivery.address}</p>
                            <p>
                                {delivery.postal_code} {delivery.city}
                            </p>
                            <p>
                                {delivery.region}, {delivery.country}
                            </p>
                            <p className="mt-2 text-emerald-900/70">Telephone : {delivery.phone}</p>
                        </div>
                    </section>

                    <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-[0_25px_45px_-25px_rgba(37,99,45,0.15)]">
                        <h2 className="text-lg font-semibold text-emerald-900">Articles commandes</h2>
                        <div className="mt-4 space-y-4">
                            {hasItems ? (
                                order.items.map((item, index) => (
                                    <div
                                        key={`${item.product_id ?? 'item'}-${index}`}
                                        className="flex flex-col gap-3 rounded-2xl border border-emerald-100 p-4 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div className="flex flex-1 items-center gap-3">
                                            <div className="hidden h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 sm:flex">
                                                <Package className="h-5 w-5 text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-emerald-900">{item.name}</p>
                                                <p className="text-xs text-emerald-900/60">
                                                    Quantite : {item.quantity} &bull; Prix unitaire : {currency.format(item.unit_price)}
                                                </p>
                                                {item.note && <p className="mt-1 text-xs text-emerald-900/60">Note : {item.note}</p>}
                                            </div>
                                        </div>
                                        <div className="text-sm font-semibold text-emerald-900">{currency.format(item.total_price)}</div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-emerald-900/70">Aucun article n&apos;est associe a cette commande.</p>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </PublicLayout>
    );
}

