import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Search,
    Filter,
    Download,
    FileText,
    TrendingUp,
    Clock,
    CheckCircle,
    XCircle,
    ChevronLeft,
    ChevronRight,
    DollarSign,
    Edit
} from 'lucide-react';

type Invoice = {
    id: number;
    invoice_number: string;
    client_name: string;
    client_email: string;
    total_ttc: number;
    status: string;
    payment_status: string;
    invoice_date: string;
    order_reference: string;
    order_id: number;
};

type Pagination = {
    data: Invoice[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
};

type Stats = {
    total_invoices: number;
    sent_invoices: number;
    paid_invoices: number;
    pending_invoices: number;
    overdue_invoices: number;
    total_amount: number;
    paid_amount: number;
    pending_amount: number;
};

type Filters = {
    invoice_number?: string;
    order_reference?: string;
    client_name?: string;
    status?: string;
    payment_status?: string;
    date_from?: string;
    date_to?: string;
};

type PageProps = {
    invoices: Pagination;
    filters: Filters;
    stats: Stats;
};

export default function InvoiceList() {
    const { props } = usePage<PageProps>();
    const { invoices, filters: initialFilters, stats } = props;

    const [filters, setFilters] = useState<Filters>(initialFilters || {});
    const [showFilters, setShowFilters] = useState(false);
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [newStatus, setNewStatus] = useState<string>('');
    const [newPaymentStatus, setNewPaymentStatus] = useState<string>('');

    const handleFilterChange = (key: keyof Filters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        router.get(route('admin.invoices.index'), filters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const resetFilters = () => {
        setFilters({});
        router.get(route('admin.invoices.index'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const filterByPaymentStatus = (paymentStatus?: string) => {
        const newFilters = paymentStatus ? { payment_status: paymentStatus } : {};
        setFilters(newFilters);
        router.get(route('admin.invoices.index'), newFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const downloadInvoice = (invoiceId: number) => {
        window.location.href = route('admin.invoices.download', invoiceId);
    };

    const openStatusDialog = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setNewStatus(invoice.status);
        setNewPaymentStatus(invoice.payment_status);
        setStatusDialogOpen(true);
    };

    const handleStatusUpdate = () => {
        if (!selectedInvoice) return;

        router.patch(
            route('admin.invoices.updateStatus', selectedInvoice.id),
            {
                status: newStatus,
                payment_status: newPaymentStatus
            },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setStatusDialogOpen(false);
                    setSelectedInvoice(null);
                },
            }
        );
    };

    const getStatusBadgeClass = (status: string): string => {
        const mapping: Record<string, string> = {
            'draft': 'bg-slate-100 text-slate-800',
            'sent': 'bg-sky-100 text-sky-800',
            'paid': 'bg-emerald-100 text-emerald-800',
            'cancelled': 'bg-rose-100 text-rose-800',
        };
        return mapping[status] || 'bg-slate-100 text-slate-800';
    };

    const getPaymentStatusBadgeClass = (status: string): string => {
        const mapping: Record<string, string> = {
            'pending': 'bg-amber-100 text-amber-800',
            'paid': 'bg-emerald-100 text-emerald-800',
            'overdue': 'bg-rose-100 text-rose-800',
        };
        return mapping[status] || 'bg-slate-100 text-slate-800';
    };

    const getStatusLabel = (status: string): string => {
        const mapping: Record<string, string> = {
            'draft': 'Brouillon',
            'sent': 'Envoyée',
            'paid': 'Payée',
            'cancelled': 'Annulée',
        };
        return mapping[status] || status;
    };

    const getPaymentStatusLabel = (status: string): string => {
        const mapping: Record<string, string> = {
            'pending': 'En attente',
            'paid': 'Payée',
            'overdue': 'En retard',
        };
        return mapping[status] || status;
    };

    return (
        <AppLayout>
            <Head title="Gestion des factures" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50">
                {/* Header */}
                <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Gestion des factures</h1>
                                <p className="text-sm text-slate-600">Gérez toutes les factures clients</p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Stats Cards */}
                    <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                        <Card
                            className="cursor-pointer transition-all hover:shadow-md hover:scale-105"
                            onClick={() => filterByPaymentStatus()}
                        >
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="rounded-full bg-blue-100 p-3">
                                    <FileText className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">Total factures</p>
                                    <p className="text-2xl font-bold text-slate-900">{stats.total_invoices}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card
                            className="cursor-pointer transition-all hover:shadow-md hover:scale-105"
                            onClick={() => filterByPaymentStatus('paid')}
                        >
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="rounded-full bg-emerald-100 p-3">
                                    <CheckCircle className="h-6 w-6 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">Payées</p>
                                    <p className="text-2xl font-bold text-slate-900">{stats.paid_invoices}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card
                            className="cursor-pointer transition-all hover:shadow-md hover:scale-105"
                            onClick={() => filterByPaymentStatus('overdue')}
                        >
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="rounded-full bg-rose-100 p-3">
                                    <XCircle className="h-6 w-6 text-rose-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">En retard</p>
                                    <p className="text-2xl font-bold text-slate-900">{stats.overdue_invoices || 0}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card
                            className="cursor-pointer transition-all hover:shadow-md hover:scale-105"
                            onClick={() => filterByPaymentStatus('pending')}
                        >
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="rounded-full bg-amber-100 p-3">
                                    <Clock className="h-6 w-6 text-amber-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">En attente</p>
                                    <p className="text-2xl font-bold text-slate-900">{stats.pending_invoices}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="rounded-full bg-green-100 p-3">
                                    <DollarSign className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">Montant total</p>
                                    <p className="text-2xl font-bold text-slate-900">{Number(stats.total_amount).toFixed(2)} TND</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filters */}
                    <Card className="mb-6">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Filtres</CardTitle>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="gap-2"
                                >
                                    <Filter className="h-4 w-4" />
                                    {showFilters ? 'Masquer' : 'Afficher'}
                                </Button>
                            </div>
                        </CardHeader>
                        {showFilters && (
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="invoice_number">Numéro de facture</Label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                            <Input
                                                id="invoice_number"
                                                placeholder="INV-2025-000001"
                                                value={filters.invoice_number || ''}
                                                onChange={(e) => handleFilterChange('invoice_number', e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="order_reference">Référence commande</Label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                            <Input
                                                id="order_reference"
                                                placeholder="CMD-2025-000001"
                                                value={filters.order_reference || ''}
                                                onChange={(e) => handleFilterChange('order_reference', e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="client_name">Nom du client</Label>
                                        <Input
                                            id="client_name"
                                            placeholder="Nom du client..."
                                            value={filters.client_name || ''}
                                            onChange={(e) => handleFilterChange('client_name', e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="status">Statut</Label>
                                        <Select
                                            value={filters.status || 'all'}
                                            onValueChange={(value) => handleFilterChange('status', value === 'all' ? '' : value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Tous les statuts" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Tous les statuts</SelectItem>
                                                <SelectItem value="draft">Brouillon</SelectItem>
                                                <SelectItem value="sent">Envoyée</SelectItem>
                                                <SelectItem value="paid">Payée</SelectItem>
                                                <SelectItem value="cancelled">Annulée</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="date_from">Date de début</Label>
                                        <Input
                                            id="date_from"
                                            type="date"
                                            value={filters.date_from || ''}
                                            onChange={(e) => handleFilterChange('date_from', e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="date_to">Date de fin</Label>
                                        <Input
                                            id="date_to"
                                            type="date"
                                            value={filters.date_to || ''}
                                            onChange={(e) => handleFilterChange('date_to', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Button onClick={applyFilters} className="gap-2">
                                        <Filter className="h-4 w-4" />
                                        Appliquer les filtres
                                    </Button>
                                    <Button onClick={resetFilters} variant="outline">
                                        Réinitialiser
                                    </Button>
                                </div>
                            </CardContent>
                        )}
                    </Card>

                    {/* Invoices Table */}
                    <Card>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="border-b bg-slate-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">N° Facture</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Date</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Client</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Commande</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Montant TTC</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Statut</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Paiement</th>
                                            <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {invoices.data.length === 0 ? (
                                            <tr>
                                                <td colSpan={8} className="px-6 py-12 text-center text-slate-600">
                                                    <XCircle className="mx-auto h-12 w-12 text-slate-400 mb-3" />
                                                    <p className="text-lg font-medium">Aucune facture trouvée</p>
                                                    <p className="text-sm">Essayez de modifier vos filtres</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            invoices.data.map((invoice) => (
                                                <tr key={invoice.id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <span className="font-medium text-slate-900">{invoice.invoice_number}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm text-slate-900">{invoice.invoice_date}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm">
                                                            <div className="font-medium text-slate-900">{invoice.client_name}</div>
                                                            <div className="text-slate-500">{invoice.client_email}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Link
                                                            href={route('admin.orders.show', invoice.order_id)}
                                                            className="text-sm text-emerald-600 hover:text-emerald-800 hover:underline font-medium"
                                                        >
                                                            {invoice.order_reference}
                                                        </Link>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm font-semibold text-slate-900">{invoice.total_ttc.toFixed(2)} TND</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Badge className={getStatusBadgeClass(invoice.status)}>
                                                            {getStatusLabel(invoice.status)}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Badge className={getPaymentStatusBadgeClass(invoice.payment_status)}>
                                                            {getPaymentStatusLabel(invoice.payment_status)}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => openStatusDialog(invoice)}
                                                                title="Modifier le statut"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => downloadInvoice(invoice.id)}
                                                                title="Télécharger"
                                                            >
                                                                <Download className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {invoices.last_page > 1 && (
                                <div className="flex items-center justify-between border-t bg-slate-50 px-6 py-4">
                                    <div className="text-sm text-slate-600">
                                        Affichage de {invoices.from} à {invoices.to} sur {invoices.total} résultats
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={invoices.current_page === 1}
                                            onClick={() => router.get(route('admin.invoices.index', { ...filters, page: invoices.current_page - 1 }))}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <div className="flex items-center gap-2">
                                            {Array.from({ length: invoices.last_page }, (_, i) => i + 1).map((page) => (
                                                <Button
                                                    key={page}
                                                    variant={page === invoices.current_page ? 'default' : 'outline'}
                                                    size="sm"
                                                    onClick={() => router.get(route('admin.invoices.index', { ...filters, page }))}
                                                >
                                                    {page}
                                                </Button>
                                            ))}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={invoices.current_page === invoices.last_page}
                                            onClick={() => router.get(route('admin.invoices.index', { ...filters, page: invoices.current_page + 1 }))}
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Status Update Dialog */}
            <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Modifier le statut de la facture</DialogTitle>
                        <DialogDescription>
                            Facture: {selectedInvoice?.invoice_number}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="status">Statut de la facture</Label>
                            <Select value={newStatus} onValueChange={setNewStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez un statut" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Brouillon</SelectItem>
                                    <SelectItem value="sent">Envoyée</SelectItem>
                                    <SelectItem value="paid">Payée</SelectItem>
                                    <SelectItem value="cancelled">Annulée</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="payment_status">Statut de paiement</Label>
                            <Select value={newPaymentStatus} onValueChange={setNewPaymentStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez un statut de paiement" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">En attente</SelectItem>
                                    <SelectItem value="paid">Payée</SelectItem>
                                    <SelectItem value="overdue">En retard</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {newStatus === 'paid' && newPaymentStatus !== 'paid' && (
                            <div className="rounded-md bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
                                <strong>Note:</strong> Si le statut est "Payée", le paiement sera automatiquement marqué comme "Payée".
                            </div>
                        )}
                        {newPaymentStatus === 'paid' && newStatus === 'draft' && (
                            <div className="rounded-md bg-rose-50 border border-rose-200 p-3 text-sm text-rose-800">
                                <strong>Attention:</strong> Une facture en brouillon ne peut pas être marquée comme payée.
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
                            Annuler
                        </Button>
                        <Button onClick={handleStatusUpdate}>
                            Mettre à jour
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
