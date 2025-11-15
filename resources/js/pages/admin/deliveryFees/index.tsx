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
    Search,
    Filter,
    Plus,
    Pencil,
    Trash2,
    Truck,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

type DeliveryFee = {
    id: number;
    delivery_person_name: string;
    delivery_person_phone: string;
    amount: number;
    is_active: boolean;
    created_at: string;
};

type Pagination = {
    data: DeliveryFee[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
};

type Filters = {
    is_active?: string;
    search?: string;
    date_from?: string;
    date_to?: string;
};

type PageProps = {
    deliveryFees: Pagination;
    filters: Filters;
};

export default function DeliveryFeesIndex() {
    const { props } = usePage<PageProps>();
    const { deliveryFees, filters: initialFilters } = props;

    const [filters, setFilters] = useState<Filters>(initialFilters || {});
    const [showFilters, setShowFilters] = useState(false);

    const handleFilterChange = (key: keyof Filters, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        router.get(route('admin.delivery-fees.index'), filters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const resetFilters = () => {
        setFilters({});
        router.get(route('admin.delivery-fees.index'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const deleteDeliveryFee = (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ces frais de livraison ?')) {
            router.delete(route('admin.delivery-fees.destroy', id));
        }
    };

    return (
        <AppLayout>
            <Head title="Gestion des frais de livraison" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50">
                <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Gestion des frais de livraison</h1>
                                <p className="text-sm text-slate-600">Gérez les frais de livraison</p>
                            </div>
                            <Link href={route('admin.delivery-fees.create')}>
                                <Button className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Nouveau frais
                                </Button>
                            </Link>
                        </div>
                    </div>
                </header>

                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="search">Rechercher</Label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                            <Input
                                                id="search"
                                                placeholder="Nom, téléphone..."
                                                value={filters.search || ''}
                                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="is_active">Livreur actif</Label>
                                        <Select
                                            value={filters.is_active || 'all'}
                                            onValueChange={(value) => handleFilterChange('is_active', value === 'all' ? '' : value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Tous" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Tous</SelectItem>
                                                <SelectItem value="true">Actif</SelectItem>
                                                <SelectItem value="false">Inactif</SelectItem>
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

                    <Card>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="border-b bg-slate-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Livreur</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Montant</th>
                                            <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">Actif</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Date de création</th>
                                            <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {deliveryFees.data.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-12 text-center text-slate-600">
                                                    <Truck className="mx-auto mb-3 h-12 w-12 text-slate-400" />
                                                    <p className="text-lg font-medium">Aucun frais de livraison trouvé</p>
                                                    <p className="text-sm">Essayez de modifier vos filtres</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            deliveryFees.data.map((fee) => (
                                                <tr key={fee.id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm">
                                                            <div className="font-medium text-slate-900">{fee.delivery_person_name}</div>
                                                            <div className="text-slate-500">{fee.delivery_person_phone}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm font-semibold text-slate-900">
                                                            {fee.amount.toFixed(2)} TND
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        {fee.is_active ? (
                                                            <Badge className="bg-green-100 text-green-800">
                                                                Actif
                                                            </Badge>
                                                        ) : (
                                                            <Badge className="bg-gray-100 text-gray-600">
                                                                Inactif
                                                            </Badge>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm text-slate-500">{fee.created_at}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Link href={route('admin.delivery-fees.edit', fee.id)}>
                                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                                                    <Pencil className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => deleteDeliveryFee(fee.id)}
                                                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {deliveryFees.last_page > 1 && (
                                <div className="flex items-center justify-between border-t bg-slate-50 px-6 py-4">
                                    <div className="text-sm text-slate-600">
                                        Affichage de {deliveryFees.from} à {deliveryFees.to} sur {deliveryFees.total} résultats
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={deliveryFees.current_page === 1}
                                            onClick={() =>
                                                router.get(
                                                    route('admin.delivery-fees.index', {
                                                        ...filters,
                                                        page: deliveryFees.current_page - 1,
                                                    })
                                                )
                                            }
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={deliveryFees.current_page === deliveryFees.last_page}
                                            onClick={() =>
                                                router.get(
                                                    route('admin.delivery-fees.index', {
                                                        ...filters,
                                                        page: deliveryFees.current_page + 1,
                                                    })
                                                )
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
