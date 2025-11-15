import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Search,
    Filter,
    Eye,
    Package,
    TrendingUp,
    Clock,
    CheckCircle,
    XCircle,
    ChevronLeft,
    ChevronRight,
    MessageSquare,
    ArrowUpDown,
    ArrowUp,
    ArrowDown
} from 'lucide-react';

type StatusMeta = {
    label: string;
    badge: string;
    description: string;
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
    customer_name: string;
    customer_email: string;
    created_at: string;
    created_at_human: string;
};

type Pagination = {
    data: Order[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
};

type Stats = {
    total_orders: number;
    pending_orders: number;
    processing_orders: number;
    delivered_orders: number;
    total_revenue: number;
    pending_revenue: number;
};

type Filters = {
    status?: string;
    search?: string;
    date_from?: string;
    date_to?: string;
    amount_min?: string;
    amount_max?: string;
    has_note?: string;
    sort_by?: string;
    sort_order?: string;
};

type PageProps = {
    orders: Pagination;
    filters: Filters;
    stats: Stats;
    statusMeta: Record<string, StatusMeta>;
};

export default function OrderList() {
    const { props } = usePage<PageProps>();
    const { orders, filters: initialFilters, stats, statusMeta } = props;

    const [filters, setFilters] = useState<Filters>(initialFilters || {});
    const [showFilters, setShowFilters] = useState(false);

    const handleFilterChange = (key: keyof Filters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        router.get(route('admin.orders.index'), filters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const resetFilters = () => {
        setFilters({});
        router.get(route('admin.orders.index'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const filterByStatus = (status?: string) => {
        const newFilters = status ? { status } : {};
        setFilters(newFilters);
        router.get(route('admin.orders.index'), newFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const viewOrder = (orderId: number) => {
        router.visit(route('admin.orders.show', orderId));
    };

    const handleSort = (column: string) => {
        const currentSortBy = filters.sort_by || 'created_at';
        const currentSortOrder = filters.sort_order || 'desc';

        let newSortOrder = 'desc';
        if (currentSortBy === column) {
            newSortOrder = currentSortOrder === 'desc' ? 'asc' : 'desc';
        }

        const newFilters = { ...filters, sort_by: column, sort_order: newSortOrder };
        setFilters(newFilters);
        router.get(route('admin.orders.index'), newFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const getSortIcon = (column: string) => {
        const currentSortBy = filters.sort_by || 'created_at';
        const currentSortOrder = filters.sort_order || 'desc';

        if (currentSortBy !== column) {
            return <ArrowUpDown className="h-4 w-4 ml-1" />;
        }

        return currentSortOrder === 'asc'
            ? <ArrowUp className="h-4 w-4 ml-1" />
            : <ArrowDown className="h-4 w-4 ml-1" />;
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
            <Head title="Gestion des commandes" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50">
                {/* Header */}
                <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Gestion des commandes</h1>
                                <p className="text-sm text-slate-600">Gérez toutes les commandes clients</p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Stats Cards */}
                    <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <Card
                            className="cursor-pointer transition-all hover:shadow-md hover:scale-105"
                            onClick={() => filterByStatus()}
                        >
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="rounded-full bg-blue-100 p-3">
                                    <Package className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">Total commandes</p>
                                    <p className="text-2xl font-bold text-slate-900">{stats.total_orders}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card
                            className="cursor-pointer transition-all hover:shadow-md hover:scale-105"
                            onClick={() => filterByStatus('pending')}
                        >
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="rounded-full bg-amber-100 p-3">
                                    <Clock className="h-6 w-6 text-amber-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">En attente</p>
                                    <p className="text-2xl font-bold text-slate-900">{stats.pending_orders}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card
                            className="cursor-pointer transition-all hover:shadow-md hover:scale-105"
                            onClick={() => filterByStatus('delivered')}
                        >
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="rounded-full bg-emerald-100 p-3">
                                    <CheckCircle className="h-6 w-6 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">Livrées</p>
                                    <p className="text-2xl font-bold text-slate-900">{stats.delivered_orders}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="rounded-full bg-green-100 p-3">
                                    <TrendingUp className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">Revenu total</p>
                                    <p className="text-2xl font-bold text-slate-900">{Number(stats.total_revenue).toFixed(2)} TND</p>
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
                                        <Label htmlFor="search">Rechercher</Label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                            <Input
                                                id="search"
                                                placeholder="Référence, client..."
                                                value={filters.search || ''}
                                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
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
                                                {Object.entries(statusMeta).map(([key, meta]) => (
                                                    <SelectItem key={key} value={key}>
                                                        {meta.label}
                                                    </SelectItem>
                                                ))}
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

                                    <div className="space-y-2">
                                        <Label htmlFor="amount_min">Montant minimum</Label>
                                        <Input
                                            id="amount_min"
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={filters.amount_min || ''}
                                            onChange={(e) => handleFilterChange('amount_min', e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="amount_max">Montant maximum</Label>
                                        <Input
                                            id="amount_max"
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={filters.amount_max || ''}
                                            onChange={(e) => handleFilterChange('amount_max', e.target.value)}
                                        />
                                    </div>

                                    <div className="flex items-center space-x-2 pt-8">
                                        <Checkbox
                                            id="has_note"
                                            checked={filters.has_note === '1'}
                                            onCheckedChange={(checked) => handleFilterChange('has_note', checked ? '1' : '')}
                                        />
                                        <Label
                                            htmlFor="has_note"
                                            className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                        >
                                            <MessageSquare className="h-4 w-4" />
                                            Avec note uniquement
                                        </Label>
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

                    {/* Orders Table */}
                    <Card>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="border-b bg-slate-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900">Référence</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900">
                                                <button
                                                    onClick={() => handleSort('created_at')}
                                                    className="flex items-center hover:text-slate-700 transition-colors"
                                                >
                                                    Date
                                                    {getSortIcon('created_at')}
                                                </button>
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900">Client</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900">Articles</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900">
                                                <button
                                                    onClick={() => handleSort('subtotal')}
                                                    className="flex items-center hover:text-slate-700 transition-colors"
                                                >
                                                    Montant
                                                    {getSortIcon('subtotal')}
                                                </button>
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900">
                                                <button
                                                    onClick={() => handleSort('status')}
                                                    className="flex items-center hover:text-slate-700 transition-colors"
                                                >
                                                    Statut
                                                    {getSortIcon('status')}
                                                </button>
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-semibold text-slate-900">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {orders.data.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-12 text-center text-slate-600">
                                                    <XCircle className="mx-auto h-12 w-12 text-slate-400 mb-3" />
                                                    <p className="text-lg font-medium">Aucune commande trouvée</p>
                                                    <p className="text-sm">Essayez de modifier vos filtres</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            orders.data.map((order) => (
                                                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-6 py-3">
                                                        <span className="text-xs font-medium text-slate-900">{order.reference}</span>
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        <div className="text-xs">
                                                            <div className="text-slate-900">{order.created_at}</div>
                                                            <div className="text-slate-500">{order.created_at_human}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        <div className="text-xs">
                                                            <div className="font-medium text-slate-900">{order.customer_name}</div>
                                                            <div className="text-slate-500">{order.customer_email}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        <span className="text-xs text-slate-900">{order.items_count} article(s)</span>
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        <span className="text-xs font-semibold text-slate-900">{order.total.toFixed(2)} TND</span>
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        <Badge className={`text-xs ${getStatusBadgeClass(order.status_meta.badge)}`}>
                                                            {order.status_meta.label}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-3 text-right">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => viewOrder(order.id)}
                                                            className="gap-2 text-xs"
                                                        >
                                                            <Eye className="h-3 w-3" />
                                                            Voir
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {orders.last_page > 1 && (
                                <div className="flex items-center justify-between border-t bg-slate-50 px-6 py-4">
                                    <div className="text-sm text-slate-600">
                                        Affichage de {orders.from} à {orders.to} sur {orders.total} résultats
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={orders.current_page === 1}
                                            onClick={() => router.get(route('admin.orders.index', { ...filters, page: orders.current_page - 1 }))}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <div className="flex items-center gap-2">
                                            {Array.from({ length: orders.last_page }, (_, i) => i + 1).map((page) => (
                                                <Button
                                                    key={page}
                                                    variant={page === orders.current_page ? 'default' : 'outline'}
                                                    size="sm"
                                                    onClick={() => router.get(route('admin.orders.index', { ...filters, page }))}
                                                >
                                                    {page}
                                                </Button>
                                            ))}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={orders.current_page === orders.last_page}
                                            onClick={() => router.get(route('admin.orders.index', { ...filters, page: orders.current_page + 1 }))}
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
        </AppLayout>
    );
}
