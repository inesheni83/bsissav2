import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    Search,
    Filter,
    Download,
    Users,
    UserPlus,
    UserCheck,
    Repeat,
    ChevronLeft,
    ChevronRight,
    X,
} from 'lucide-react';

type Customer = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    role: string;
    created_at: string;
    created_at_human: string;
    orders_count: number;
    total_spent: number;
};

type Pagination = {
    data: Customer[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
};

type Filters = {
    search?: string;
    role?: string;
    date_from?: string;
    date_to?: string;
    min_orders?: string;
};

type Stats = {
    total_customers: number;
    new_this_month: number;
    active_customers: number;
    repeat_customers: number;
};

type PageProps = {
    customers: Pagination;
    filters: Filters;
    stats: Stats;
};

export default function CustomersIndex({ customers, filters: initialFilters, stats }: PageProps) {
    const [filters, setFilters] = useState<Filters>(initialFilters || {});
    const [showFilters, setShowFilters] = useState(false);

    const handleFilterChange = (key: keyof Filters, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        router.get(route('admin.customers.index'), filters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const resetFilters = () => {
        setFilters({});
        router.get(route('admin.customers.index'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const filterByStats = (filterType: 'all' | 'new_this_month' | 'active' | 'repeat') => {
        let newFilters: Filters = {};

        switch (filterType) {
            case 'new_this_month':
                const now = new Date();
                const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                newFilters = {
                    date_from: firstDayOfMonth.toISOString().split('T')[0],
                    date_to: lastDayOfMonth.toISOString().split('T')[0],
                };
                break;
            case 'active':
                newFilters = { min_orders: '1' };
                break;
            case 'repeat':
                newFilters = { min_orders: '2' };
                break;
            case 'all':
            default:
                newFilters = {};
                break;
        }

        setFilters(newFilters);
        router.get(route('admin.customers.index'), newFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const exportCustomers = () => {
        window.location.href = route('admin.customers.export', filters);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-TN', {
            style: 'currency',
            currency: 'TND',
        }).format(amount);
    };

    return (
        <AppLayout>
            <Head title="Gestion des clients" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50">
                <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Gestion des clients</h1>
                                <p className="text-sm text-slate-600">
                                    {customers.total} client{customers.total > 1 ? 's' : ''} enregistré{customers.total > 1 ? 's' : ''}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="gap-2"
                                >
                                    <Filter className="h-4 w-4" />
                                    Filtres
                                </Button>
                                <Button onClick={exportCustomers} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                                    <Download className="h-4 w-4" />
                                    Exporter CSV
                                </Button>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Statistics Cards */}
                    <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <Card
                            className="cursor-pointer border-l-4 border-l-blue-500 transition-all hover:shadow-md hover:scale-105"
                            onClick={() => filterByStats('all')}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-600">Total clients</p>
                                        <p className="text-3xl font-bold text-slate-900">{stats.total_customers}</p>
                                    </div>
                                    <Users className="h-12 w-12 text-blue-500 opacity-20" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card
                            className="cursor-pointer border-l-4 border-l-green-500 transition-all hover:shadow-md hover:scale-105"
                            onClick={() => filterByStats('new_this_month')}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-600">Nouveaux ce mois</p>
                                        <p className="text-3xl font-bold text-slate-900">{stats.new_this_month}</p>
                                    </div>
                                    <UserPlus className="h-12 w-12 text-green-500 opacity-20" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card
                            className="cursor-pointer border-l-4 border-l-emerald-500 transition-all hover:shadow-md hover:scale-105"
                            onClick={() => filterByStats('active')}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-600">Clients actifs</p>
                                        <p className="text-3xl font-bold text-slate-900">{stats.active_customers}</p>
                                    </div>
                                    <UserCheck className="h-12 w-12 text-emerald-500 opacity-20" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card
                            className="cursor-pointer border-l-4 border-l-amber-500 transition-all hover:shadow-md hover:scale-105"
                            onClick={() => filterByStats('repeat')}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-600">Clients récurrents</p>
                                        <p className="text-3xl font-bold text-slate-900">{stats.repeat_customers}</p>
                                    </div>
                                    <Repeat className="h-12 w-12 text-amber-500 opacity-20" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filters Panel */}
                    {showFilters && (
                        <Card className="mb-6">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Filter className="h-5 w-5" />
                                    Filtres
                                </CardTitle>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowFilters(false)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="search">Rechercher</Label>
                                        <Input
                                            id="search"
                                            placeholder="Nom, email, téléphone..."
                                            value={filters.search || ''}
                                            onChange={(e) => handleFilterChange('search', e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="date_from">Date début</Label>
                                        <Input
                                            id="date_from"
                                            type="date"
                                            value={filters.date_from || ''}
                                            onChange={(e) => handleFilterChange('date_from', e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="date_to">Date fin</Label>
                                        <Input
                                            id="date_to"
                                            type="date"
                                            value={filters.date_to || ''}
                                            onChange={(e) => handleFilterChange('date_to', e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="min_orders">Commandes min.</Label>
                                        <Input
                                            id="min_orders"
                                            type="number"
                                            min="0"
                                            placeholder="0"
                                            value={filters.min_orders || ''}
                                            onChange={(e) => handleFilterChange('min_orders', e.target.value)}
                                        />
                                    </div>

                                    <div className="flex items-end gap-2">
                                        <Button onClick={applyFilters} className="flex-1">
                                            Appliquer
                                        </Button>
                                        <Button variant="outline" onClick={resetFilters}>
                                            Réinitialiser
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Customers Table */}
                    <Card>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="border-b bg-slate-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900">Nom</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900">Téléphone</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900">Date d'inscription</th>
                                            <th className="px-6 py-3 text-center text-xs font-semibold text-slate-900">Commandes</th>
                                            <th className="px-6 py-3 text-right text-xs font-semibold text-slate-900">Total dépensé</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {customers.data.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-12 text-center text-slate-600">
                                                    <Users className="mx-auto h-12 w-12 text-slate-400 mb-3" />
                                                    <p className="text-lg font-medium">Aucun client trouvé</p>
                                                    <p className="text-sm">Essayez de modifier vos filtres</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            customers.data.map((customer) => (
                                                <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-6 py-3">
                                                        <div className="font-medium text-xs text-slate-900">{customer.name}</div>
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        <span className="text-xs text-slate-900">{customer.email}</span>
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        <span className="text-xs text-slate-900">{customer.phone || 'N/A'}</span>
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        <div className="text-xs">
                                                            <div className="text-slate-900">{customer.created_at}</div>
                                                            <div className="text-slate-500">{customer.created_at_human}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-3 text-center">
                                                        {customer.orders_count > 0 ? (
                                                            <button
                                                                onClick={() => router.get(route('admin.orders.index', { search: customer.email }))}
                                                                className="inline-flex cursor-pointer transition-transform hover:scale-105"
                                                            >
                                                                <Badge variant="default" className="hover:bg-emerald-700">
                                                                    {customer.orders_count} commande{customer.orders_count > 1 ? 's' : ''}
                                                                </Badge>
                                                            </button>
                                                        ) : (
                                                            <Badge variant="secondary">
                                                                0 commande
                                                            </Badge>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-3 text-right">
                                                        <span className="text-xs font-semibold text-slate-900">
                                                            {formatCurrency(customer.total_spent)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {customers.last_page > 1 && (
                                <div className="flex items-center justify-between border-t bg-slate-50 px-6 py-3">
                                    <div className="text-sm text-slate-600">
                                        Affichage de {customers.from} à {customers.to} sur {customers.total} résultats
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={customers.current_page === 1}
                                            onClick={() =>
                                                router.get(route('admin.customers.index', { ...filters, page: customers.current_page - 1 }))
                                            }
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <span className="text-sm text-slate-600">
                                            Page {customers.current_page} sur {customers.last_page}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={customers.current_page === customers.last_page}
                                            onClick={() =>
                                                router.get(route('admin.customers.index', { ...filters, page: customers.current_page + 1 }))
                                            }
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
