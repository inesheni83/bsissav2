import { Head, Link, router, usePage } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { SharedData } from '@/types';

interface StatusMeta {
    label: string;
    badge: string;
    description?: string;
}

interface OrderSummary {
    id: number;
    reference: string;
    status: string;
    status_meta?: StatusMeta;
    subtotal: number;
    delivery_fee: number;
    total: number;
    items_count: number;
    created_at: string | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface OrdersIndexProps {
    orders: {
        data: OrderSummary[];
        links: PaginationLink[];
    };
    statusMeta: Record<string, StatusMeta>;
}

const currency = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'TND',
});

export default function OrdersIndexPage({ orders, statusMeta }: OrdersIndexProps) {
    const { flash } = usePage<SharedData>().props;
    const data = orders?.data ?? [];

    const handleRowClick = (order: OrderSummary) => {
        router.visit(route('orders.show', order.id));
    };

    const resolveStatus = (order: OrderSummary) => {
        return order.status_meta ?? statusMeta[order.status] ?? {
            label: order.status,
            badge: 'bg-slate-100 text-slate-800',
        };
    };

    return (
        <PublicLayout>
            <Head title="Mes commandes" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold text-emerald-900">Historique des commandes</h1>
                        <p className="mt-1 text-sm text-emerald-900/70">
                            Retrouvez l&apos;ensemble de vos commandes en ligne et suivez leur progression.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild className="rounded-full border-emerald-200 text-emerald-800 hover:bg-emerald-50">
                            <Link href="/">
                                Accueil
                            </Link>
                        </Button>
                    </div>
                </div>

                {flash?.success && (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                        {flash.success}
                    </div>
                )}

                <div className="rounded-3xl border border-emerald-100 bg-white shadow-[0_25px_45px_-25px_rgba(37,99,45,0.25)]">
                    <div className="border-b border-emerald-50 px-6 py-4">
                        <h2 className="text-lg font-semibold text-emerald-900">Vos commandes</h2>
                        <p className="text-sm text-emerald-900/70">Cliquez sur une commande pour afficher ses details.</p>
                    </div>

                    {data.length === 0 ? (
                        <div className="px-6 py-12 text-center text-sm text-emerald-900/70">
                            Vous n&apos;avez pas encore passe de commande.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="text-left text-xs font-semibold uppercase tracking-wide text-emerald-900/60">
                                        <th className="px-6 py-3">Reference</th>
                                        <th className="px-6 py-3">Date</th>
                                        <th className="px-6 py-3">Articles</th>
                                        <th className="px-6 py-3">Montant</th>
                                        <th className="px-6 py-3">Statut</th>
                                        <th className="px-6 py-3">
                                            <span className="sr-only">Voir</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-emerald-50">
                                    {data.map((order) => {
                                        const status = resolveStatus(order);
                                        return (
                                            <tr
                                                key={order.id}
                                                onClick={() => handleRowClick(order)}
                                                className="cursor-pointer transition-colors hover:bg-emerald-50/60"
                                            >
                                                <td className="px-6 py-4 text-sm font-medium text-emerald-900">{order.reference}</td>
                                                <td className="px-6 py-4 text-sm text-emerald-900/70">
                                                    {order.created_at
                                                        ? new Date(order.created_at).toLocaleDateString('fr-FR', {
                                                              day: '2-digit',
                                                              month: '2-digit',
                                                              year: 'numeric',
                                                          })
                                                        : '-'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-emerald-900/70">{order.items_count}</td>
                                                <td className="px-6 py-4 text-sm font-semibold text-emerald-900">
                                                    {currency.format(order.total)}
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <Badge className={`rounded-full px-3 py-1 text-xs font-semibold ${status.badge}`}>
                                                        {status.label}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-right text-xs font-semibold text-emerald-800">
                                                    Voir
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {orders.links && orders.links.length > 0 && (
                        <div className="flex items-center justify-between border-t border-emerald-50 px-6 py-4 text-sm text-emerald-900/70">
                            <div>
                                {orders.links.map((link) => {
                                    if (!link.url) {
                                        return (
                                            <span key={link.label} className="mx-1 inline-flex items-center justify-center rounded-full px-3 py-1 text-xs text-emerald-900/40">
                                                {formatPaginationLabel(link.label)}
                                            </span>
                                        );
                                    }

                                    return (
                                        <Link
                                            key={link.label}
                                            href={link.url}
                                            className={`mx-1 inline-flex items-center justify-center rounded-full px-3 py-1 text-xs transition ${
                                                link.active
                                                    ? 'bg-emerald-700 text-white'
                                                    : 'border border-emerald-200 text-emerald-800 hover:bg-emerald-50'
                                            }`}
                                        >
                                            {formatPaginationLabel(link.label)}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}

function formatPaginationLabel(label: string): string {
    const entityMap: Record<string, string> = {
        '&laquo;': '<<',
        '&raquo;': '>>',
        '&lsaquo;': '<',
        '&rsaquo;': '>',
        '&nbsp;': ' ',
    };

    return label
        .replace(/&[a-zA-Z]+;/g, (entity) => entityMap[entity] ?? entity)
        .replace(/<[^>]*>?/gm, '');
}
