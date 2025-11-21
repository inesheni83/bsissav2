import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Package, Edit, Trash2, Eye, Copy, Search, Filter, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Card, CardContent } from '@/components/ui/card';
import { useState, useMemo } from 'react';

type Pack = {
    id: number;
    name: string;
    slug: string;
    description: string;
    main_image_url: string | null;
    price: number;
    reference_price: number | null;
    savings: number | null;
    savings_percentage: number | null;
    is_active: boolean;
    stock_quantity: number;
    products_count: number;
    products?: Array<{
        id: number;
        name: string;
        pivot: {
            quantity: number;
        };
    }>;
    creator: {
        id: number;
        name: string;
    } | null;
    created_at: string;
};

type PageProps = {
    packs: {
        data: Pack[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
};

export default function PackList({ packs }: PageProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'out_of_stock'>('all');
    const [priceRangeFilter, setPriceRangeFilter] = useState<'all' | '0-50' | '50-100' | '100+'>('all');
    const [sortBy, setSortBy] = useState<'name' | 'price' | 'created_at' | 'stock'>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [showFilters, setShowFilters] = useState(false);

    // Filter and sort packs
    const filteredAndSortedPacks = useMemo(() => {
        let filtered = [...packs.data];

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter((pack) =>
                pack.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter((pack) =>
                statusFilter === 'active' ? pack.is_active : !pack.is_active
            );
        }

        // Apply stock filter
        if (stockFilter !== 'all') {
            filtered = filtered.filter((pack) =>
                stockFilter === 'in_stock' ? pack.stock_quantity > 0 : pack.stock_quantity === 0
            );
        }

        // Apply price range filter
        if (priceRangeFilter !== 'all') {
            filtered = filtered.filter((pack) => {
                if (priceRangeFilter === '0-50') return pack.price <= 50;
                if (priceRangeFilter === '50-100') return pack.price > 50 && pack.price <= 100;
                if (priceRangeFilter === '100+') return pack.price > 100;
                return true;
            });
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let compareValue = 0;

            switch (sortBy) {
                case 'name':
                    compareValue = a.name.localeCompare(b.name);
                    break;
                case 'price':
                    compareValue = a.price - b.price;
                    break;
                case 'stock':
                    compareValue = a.stock_quantity - b.stock_quantity;
                    break;
                case 'created_at':
                    compareValue = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                    break;
            }

            return sortOrder === 'asc' ? compareValue : -compareValue;
        });

        return filtered;
    }, [packs.data, searchQuery, statusFilter, stockFilter, priceRangeFilter, sortBy, sortOrder]);

    const handleDelete = (packId: number) => {
        router.delete(route('packs.destroy', packId), {
            preserveScroll: true,
            onSuccess: () => {
                console.log('Pack supprimé avec succès');
            },
        });
    };

    const handleDuplicate = (packId: number) => {
        router.post(
            route('packs.duplicate', packId),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    console.log('Pack dupliqué avec succès');
                },
            }
        );
    };

    const toggleSort = (field: 'name' | 'price' | 'created_at' | 'stock') => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    const resetFilters = () => {
        setSearchQuery('');
        setStatusFilter('all');
        setStockFilter('all');
        setPriceRangeFilter('all');
        setSortBy('created_at');
        setSortOrder('desc');
    };

    const hasActiveFilters =
        searchQuery ||
        statusFilter !== 'all' ||
        stockFilter !== 'all' ||
        priceRangeFilter !== 'all';

    return (
        <AppLayout>
            <Head title="Gestion des Packs" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-3 shadow-lg">
                                <Package className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">
                                    Gestion des Packs
                                </h1>
                                <p className="text-sm text-slate-600">
                                    {filteredAndSortedPacks.length} pack
                                    {filteredAndSortedPacks.length > 1 ? 's' : ''}{' '}
                                    {hasActiveFilters && `sur ${packs.total} au total`}
                                </p>
                            </div>
                        </div>

                        <Link href={route('packs.create')}>
                            <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                                <Plus className="mr-2 h-4 w-4" />
                                Nouveau Pack
                            </Button>
                        </Link>
                    </div>

                    {/* Search and Filters */}
                    <Card className="mb-6">
                        <CardContent className="p-4">
                            <div className="space-y-4">
                                {/* Search Bar */}
                                <div className="flex items-center gap-3">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <Input
                                            placeholder="Rechercher un pack par nom..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowFilters(!showFilters)}
                                    >
                                        <Filter className="mr-2 h-4 w-4" />
                                        Filtres
                                        {hasActiveFilters && (
                                            <Badge variant="default" className="ml-2">
                                                {[
                                                    statusFilter !== 'all',
                                                    stockFilter !== 'all',
                                                    priceRangeFilter !== 'all',
                                                ].filter(Boolean).length}
                                            </Badge>
                                        )}
                                    </Button>
                                    {hasActiveFilters && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={resetFilters}
                                        >
                                            Réinitialiser
                                        </Button>
                                    )}
                                </div>

                                {/* Filters */}
                                {showFilters && (
                                    <div className="grid gap-4 sm:grid-cols-3 pt-4 border-t">
                                        <div>
                                            <Label htmlFor="status-filter">Statut</Label>
                                            <Select
                                                value={statusFilter}
                                                onValueChange={(value: any) =>
                                                    setStatusFilter(value)
                                                }
                                            >
                                                <SelectTrigger id="status-filter">
                                                    <SelectValue placeholder="Tous les statuts" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">
                                                        Tous les statuts
                                                    </SelectItem>
                                                    <SelectItem value="active">Actif</SelectItem>
                                                    <SelectItem value="inactive">
                                                        Inactif
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="stock-filter">Disponibilité</Label>
                                            <Select
                                                value={stockFilter}
                                                onValueChange={(value: any) => setStockFilter(value)}
                                            >
                                                <SelectTrigger id="stock-filter">
                                                    <SelectValue placeholder="Tous les stocks" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">
                                                        Tous les stocks
                                                    </SelectItem>
                                                    <SelectItem value="in_stock">
                                                        En stock
                                                    </SelectItem>
                                                    <SelectItem value="out_of_stock">
                                                        Rupture de stock
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="price-filter">Fourchette de prix</Label>
                                            <Select
                                                value={priceRangeFilter}
                                                onValueChange={(value: any) =>
                                                    setPriceRangeFilter(value)
                                                }
                                            >
                                                <SelectTrigger id="price-filter">
                                                    <SelectValue placeholder="Tous les prix" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Tous les prix</SelectItem>
                                                    <SelectItem value="0-50">0 - 50 DT</SelectItem>
                                                    <SelectItem value="50-100">
                                                        50 - 100 DT
                                                    </SelectItem>
                                                    <SelectItem value="100+">100+ DT</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Table */}
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50">
                                    <TableHead className="font-semibold">
                                        <button
                                            onClick={() => toggleSort('name')}
                                            className="flex items-center gap-1 hover:text-slate-900"
                                        >
                                            Pack
                                            {sortBy === 'name' && (
                                                <ArrowUpDown className="h-4 w-4" />
                                            )}
                                        </button>
                                    </TableHead>
                                    <TableHead className="font-semibold">
                                        <button
                                            onClick={() => toggleSort('price')}
                                            className="flex items-center gap-1 hover:text-slate-900"
                                        >
                                            Prix
                                            {sortBy === 'price' && (
                                                <ArrowUpDown className="h-4 w-4" />
                                            )}
                                        </button>
                                    </TableHead>
                                    <TableHead className="font-semibold">Économie</TableHead>
                                    <TableHead className="font-semibold">Produits</TableHead>
                                    <TableHead className="font-semibold">
                                        <button
                                            onClick={() => toggleSort('stock')}
                                            className="flex items-center gap-1 hover:text-slate-900"
                                        >
                                            Stock
                                            {sortBy === 'stock' && (
                                                <ArrowUpDown className="h-4 w-4" />
                                            )}
                                        </button>
                                    </TableHead>
                                    <TableHead className="font-semibold">Statut</TableHead>
                                    <TableHead className="font-semibold">
                                        <button
                                            onClick={() => toggleSort('created_at')}
                                            className="flex items-center gap-1 hover:text-slate-900"
                                        >
                                            Date de création
                                            {sortBy === 'created_at' && (
                                                <ArrowUpDown className="h-4 w-4" />
                                            )}
                                        </button>
                                    </TableHead>
                                    <TableHead className="text-right font-semibold">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredAndSortedPacks.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="h-32 text-center">
                                            <div className="flex flex-col items-center justify-center gap-2 text-slate-500">
                                                <Package className="h-12 w-12 opacity-20" />
                                                <p className="text-sm">
                                                    {hasActiveFilters
                                                        ? 'Aucun pack ne correspond aux filtres'
                                                        : 'Aucun pack trouvé'}
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredAndSortedPacks.map((pack) => (
                                        <TableRow key={pack.id} className="hover:bg-slate-50">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    {pack.main_image_url ? (
                                                        <img
                                                            src={pack.main_image_url}
                                                            alt={pack.name}
                                                            className="h-12 w-12 rounded-lg object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100">
                                                            <Package className="h-6 w-6 text-slate-400" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-slate-900">
                                                            {pack.name}
                                                        </p>
                                                        <p className="text-sm text-slate-500">
                                                            {pack.slug}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-emerald-600">
                                                        {Number(pack.price).toFixed(2)} DT
                                                    </span>
                                                    {pack.reference_price && (
                                                        <span className="text-xs text-slate-400 line-through">
                                                            {Number(pack.reference_price).toFixed(2)} DT
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {pack.savings && pack.savings_percentage ? (
                                                    <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200">
                                                        -{pack.savings_percentage}%
                                                    </Badge>
                                                ) : (
                                                    <span className="text-sm text-slate-400">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm text-slate-600">
                                                    {pack.products_count} produit
                                                    {pack.products_count > 1 ? 's' : ''}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        pack.stock_quantity > 0
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {pack.stock_quantity}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {pack.is_active ? (
                                                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                                                        Actif
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary">Inactif</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm text-slate-600">
                                                    {new Date(pack.created_at).toLocaleDateString(
                                                        'fr-FR',
                                                        {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        }
                                                    )}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link href={route('packs.show', pack.id)}>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0"
                                                            title="Voir"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link href={route('packs.edit', pack.id)}>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
                                                            title="Modifier"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-purple-600 hover:text-purple-700"
                                                        onClick={() => handleDuplicate(pack.id)}
                                                        title="Dupliquer"
                                                    >
                                                        <Copy className="h-4 w-4" />
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                                                title="Supprimer"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>
                                                                    Confirmer la suppression
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Êtes-vous sûr de vouloir supprimer le
                                                                    pack "{pack.name}" ? Cette action est
                                                                    irréversible.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>
                                                                    Annuler
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() =>
                                                                        handleDelete(pack.id)
                                                                    }
                                                                    className="bg-red-600 hover:bg-red-700"
                                                                >
                                                                    Supprimer
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {packs.last_page > 1 && (
                        <div className="mt-6 flex items-center justify-center gap-2">
                            {Array.from({ length: packs.last_page }, (_, i) => i + 1).map(
                                (page) => (
                                    <Link
                                        key={page}
                                        href={route('packs.index', { page })}
                                        preserveScroll
                                    >
                                        <Button
                                            variant={
                                                page === packs.current_page
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            size="sm"
                                        >
                                            {page}
                                        </Button>
                                    </Link>
                                ),
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
