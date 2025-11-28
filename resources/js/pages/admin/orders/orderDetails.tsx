import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    ArrowLeft,
    Package,
    User,
    MapPin,
    Phone,
    Mail,
    Calendar,
    CreditCard,
    Printer,
    FileText,
    XCircle,
    CheckCircle,
    Clock,
    Edit,
    Download
} from 'lucide-react';

type StatusMeta = {
    label: string;
    badge: string;
    description: string;
};

type OrderItem = {
    product_id: number;
    name: string;
    image: string | null;
    quantity: number;
    unit_price: number;
    total_price: number;
    note: string | null;
};

type Delivery = {
    first_name: string;
    last_name: string;
    address: string;
    country: string;
    region: string;
    city: string;
    postal_code: string;
    phone: string;
    note?: string | null;
};

type Order = {
    id: number;
    reference: string;
    status: string;
    status_meta: StatusMeta;
    subtotal: number;
    delivery_fee: number;
    total: number;
    items_count: number;
    items: OrderItem[];
    delivery: Delivery;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    created_at: string;
};

type StatusHistoryItem = {
    id: number;
    old_status: string | null;
    old_status_meta: StatusMeta | null;
    new_status: string;
    new_status_meta: StatusMeta;
    changed_by: string;
    note: string | null;
    created_at: string;
    created_at_human: string;
};

type PageProps = {
    order: Order;
    statusMeta: Record<string, StatusMeta>;
    statusHistory: StatusHistoryItem[];
};

export default function OrderDetails() {
    const { props} = usePage<PageProps>();
    const { order, statusMeta, statusHistory } = props;

    const [selectedStatus, setSelectedStatus] = useState(order.status);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    const handleStatusUpdate = () => {
        if (selectedStatus === order.status) {
            return;
        }

        setIsUpdatingStatus(true);

        router.patch(
            route('admin.orders.updateStatus', order.id),
            { status: selectedStatus },
            {
                onSuccess: () => {
                },
                onError: () => {
                    setSelectedStatus(order.status);
                },
                onFinish: () => {
                    setIsUpdatingStatus(false);
                },
            }
        );
    };

    const handlePrint = () => {
        window.print();
    };

    const handleGenerateInvoice = () => {
        window.open(route('admin.orders.generateInvoice', order.id), '_blank');
    };

    const handleCancelOrder = () => {
        if (confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
            setSelectedStatus('cancelled');
            setTimeout(() => {
                handleStatusUpdate();
            }, 100);
        }
    };

    const handleContactCustomer = () => {
        window.location.href = `mailto:${order.customer_email}`;
    };

    const getStatusBadgeClass = (badgeClass: string): string => {
        const mapping: Record<string, string> = {
            'bg-amber-100 text-amber-800': 'bg-amber-100 text-amber-800',
            'bg-sky-100 text-sky-800': 'bg-sky-100 text-sky-800',
            'bg-indigo-100 text-indigo-800': 'bg-indigo-100 text-indigo-800',
            'bg-emerald-100 text-emerald-800': 'bg-emerald-100 text-emerald-800',
            'bg-rose-100 text-rose-800': 'bg-rose-100 text-rose-800',
        };
        return mapping[badgeClass] || 'bg-slate-100 text-slate-800';
    };

    return (
        <AppLayout>
            <Head title={`Commande ${order.reference}`}>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
                <link href="https://fonts.bunny.net/css?family=playfair-display:400,600,700,800" rel="stylesheet" />
            </Head>

            <div className="min-h-screen bg-white print:bg-white">
                {/* Header */}
                <header className="sticky top-0 z-10 border-b border-slate-200 bg-white print:static print:border-none print:bg-white">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => router.visit(route('admin.orders.index'))}
                                    className="gap-2 print:hidden"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Retour
                                </Button>
                                <div className="h-6 w-px bg-slate-200 print:hidden" />
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900">Commande {order.reference}</h1>
                                    <p className="text-sm text-slate-600">
                                        Passée le {new Date(order.created_at).toLocaleDateString('fr-FR', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                            <Badge className={getStatusBadgeClass(order.status_meta.badge)}>
                                {order.status_meta.label}
                            </Badge>
                        </div>
                    </div>
                </header>

                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Order Items */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <Package className="h-5 w-5" />
                                        Produits commandés ({order.items_count})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {order.items.map((item, index) => (
                                            <div key={index} className="flex gap-3 border-b pb-3 last:border-b-0 last:pb-0">
                                                {item.image ? (
                                                    <img
                                                        src={`/storage/${item.image}`}
                                                        alt={item.name}
                                                        className="h-16 w-16 rounded-lg object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-slate-100">
                                                        <Package className="h-6 w-6 text-slate-400" />
                                                    </div>
                                                )}
                                                <div className="flex flex-1 flex-col">
                                                    <h4 className="text-sm font-medium text-slate-900">{item.name}</h4>
                                                    <p className="text-xs text-slate-600">
                                                        Qté: {item.quantity} × {item.unit_price.toFixed(2)} TND
                                                    </p>
                                                    {item.note && (
                                                        <p className="mt-1 text-xs italic text-slate-500">Note: {item.note}</p>
                                                    )}
                                                    <p className="mt-1 text-sm font-semibold text-slate-900">{item.total_price.toFixed(2)} TND</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Delivery Address */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <MapPin className="h-5 w-5" />
                                        Adresse de livraison
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <p className="font-medium text-slate-900">
                                            {order.delivery.first_name} {order.delivery.last_name}
                                        </p>
                                        <p className="text-sm text-slate-700">{order.delivery.address}</p>
                                        <p className="text-sm text-slate-700">
                                            {order.delivery.postal_code} {order.delivery.city}
                                        </p>
                                        <p className="text-sm text-slate-700">
                                            {order.delivery.region}, {order.delivery.country}
                                        </p>
                                        <div className="mt-4 flex items-center gap-2 text-slate-600">
                                            <Phone className="h-4 w-4" />
                                            <a href={`tel:${order.delivery.phone}`} className="text-sm hover:text-emerald-600">
                                                {order.delivery.phone}
                                            </a>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Order Summary */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <CreditCard className="h-5 w-5" />
                                        Résumé de la commande
                                    </CardTitle>
                                    {order.delivery.note && (
                                        <p className="mt-2 text-sm text-slate-600 italic">
                                            Note : {order.delivery.note}
                                        </p>
                                    )}
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-600">Sous-total</span>
                                        <span className="font-medium">{order.subtotal.toFixed(2)} TND</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-600">Frais de livraison</span>
                                        <span className="font-medium">{order.delivery_fee.toFixed(2)} TND</span>
                                    </div>
                                    <div className="border-t pt-2">
                                        <div className="flex justify-between text-lg font-semibold">
                                            <span>Total</span>
                                            <span className="text-emerald-600">{order.total.toFixed(2)} TND</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Customer Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <User className="h-5 w-5" />
                                        Informations client
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <p className="text-sm text-slate-600">Nom</p>
                                        <p className="font-medium text-slate-900">{order.customer_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-600">Email</p>
                                        <a
                                            href={`mailto:${order.customer_email}`}
                                            className="font-medium text-emerald-600 hover:underline"
                                        >
                                            {order.customer_email}
                                        </a>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-600">Téléphone</p>
                                        <a
                                            href={`tel:${order.customer_phone}`}
                                            className="font-medium text-emerald-600 hover:underline"
                                        >
                                            {order.customer_phone}
                                        </a>
                                    </div>
                                    <Button
                                        onClick={handleContactCustomer}
                                        variant="outline"
                                        className="w-full gap-2 print:hidden"
                                    >
                                        <Mail className="h-4 w-4" />
                                        Contacter le client
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Order Status */}
                            <Card className="print:hidden">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <Edit className="h-5 w-5" />
                                        Modifier le statut
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner un statut" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(statusMeta).map(([key, meta]) => (
                                                <SelectItem key={key} value={key}>
                                                    {meta.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Button
                                        onClick={handleStatusUpdate}
                                        disabled={selectedStatus === order.status || isUpdatingStatus}
                                        className="w-full gap-2"
                                    >
                                        {isUpdatingStatus ? (
                                            <>Mise à jour...</>
                                        ) : (
                                            <>
                                                <CheckCircle className="h-4 w-4" />
                                                Mettre à jour le statut
                                            </>
                                        )}
                                    </Button>

                                    <p className="text-xs text-slate-600">
                                        Statut actuel: <strong>{order.status_meta.label}</strong>
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            <Card className="print:hidden">
                                <CardHeader>
                                    <CardTitle className="text-base">Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Button onClick={handleGenerateInvoice} variant="outline" className="w-full gap-2">
                                        <FileText className="h-4 w-4" />
                                        Générer facture
                                    </Button>
                                    <Button
                                        onClick={handleCancelOrder}
                                        variant="destructive"
                                        className="w-full gap-2"
                                        disabled={order.status === 'cancelled'}
                                    >
                                        <XCircle className="h-4 w-4" />
                                        Annuler la commande
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Status History */}
                        {statusHistory && statusHistory.length > 0 && (
                            <Card className="print:hidden">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <Clock className="h-5 w-5" />
                                        Historique des changements de statut
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {statusHistory.map((history) => (
                                            <div key={history.id} className="flex gap-4 border-b pb-4 last:border-b-0 last:pb-0">
                                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-100">
                                                    <Clock className="h-5 w-5 text-slate-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        {history.old_status_meta && (
                                                            <>
                                                                <Badge className={getStatusBadgeClass(history.old_status_meta.badge)}>
                                                                    {history.old_status_meta.label}
                                                                </Badge>
                                                                <span className="text-slate-400">→</span>
                                                            </>
                                                        )}
                                                        <Badge className={getStatusBadgeClass(history.new_status_meta.badge)}>
                                                            {history.new_status_meta.label}
                                                        </Badge>
                                                    </div>
                                                    <p className="mt-1 text-sm text-slate-600">
                                                        Par <strong>{history.changed_by}</strong> • {history.created_at_human}
                                                    </p>
                                                    {history.note && (
                                                        <p className="mt-1 text-sm italic text-slate-500">
                                                            Note: {history.note}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
