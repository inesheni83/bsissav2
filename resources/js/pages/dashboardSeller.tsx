import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ShoppingCart,
    DollarSign,
    Package,
    TrendingUp,
    AlertTriangle,
    Calendar,
    Eye,
    ArrowUp,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type Product = {
    id: number;
    name: string;
    image: string | null;
    total_sold: number;
    stock_quantity?: number;
    price: number;
};

type Order = {
    id: number;
    reference: string;
    customer_name: string;
    customer_email: string;
    total_amount: number;
    status: string;
    created_at: string;
    items_count: number;
};

type ChartData = {
    date: string;
    revenue: number;
    orders: number;
};

type DashboardStats = {
    orders_today: number;
    orders_this_week: number;
    orders_this_month: number;
    total_orders: number;
    revenue_today: number;
    revenue_this_week: number;
    revenue_this_month: number;
    revenue_total: number;
    conversion_rate: number;
    top_products: Product[];
    low_stock_products: Product[];
    sales_chart_data: ChartData[];
    recent_orders: Order[];
    orders_by_status: {
        pending: number;
        processing: number;
        shipped: number;
        delivered: number;
        cancelled: number;
    };
};

type DashboardSellerProps = {
    stats: DashboardStats;
};

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    processing: 'bg-blue-100 text-blue-800 border-blue-200',
    shipped: 'bg-purple-100 text-purple-800 border-purple-200',
    delivered: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
};

const statusLabels: Record<string, string> = {
    pending: 'En attente',
    processing: 'En traitement',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    cancelled: 'Annulée',
};

export default function DashboardSeller({ stats }: DashboardSellerProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-TN', {
            style: 'currency',
            currency: 'TND',
        }).format(amount);
    };

    return (
        <>
            <Head title="Dashboard Vendeur" />
            <AppLayout>
                <div className="space-y-6 pt-6 px-4 sm:px-6 lg:px-8">
                    {/* Statistiques des commandes */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="border-l-4 border-l-blue-500">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-medium text-gray-600">Aujourd'hui</CardTitle>
                                    <ShoppingCart className="h-5 w-5 text-blue-500" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-gray-900">{stats.orders_today}</div>
                                <p className="mt-1 text-xs text-gray-500">commandes</p>
                                <div className="mt-2 text-sm font-medium text-blue-600">{formatCurrency(stats.revenue_today)}</div>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-green-500">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-medium text-gray-600">Cette semaine</CardTitle>
                                    <TrendingUp className="h-5 w-5 text-green-500" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-gray-900">{stats.orders_this_week}</div>
                                <p className="mt-1 text-xs text-gray-500">commandes</p>
                                <div className="mt-2 text-sm font-medium text-green-600">{formatCurrency(stats.revenue_this_week)}</div>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-purple-500">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-medium text-gray-600">Ce mois</CardTitle>
                                    <DollarSign className="h-5 w-5 text-purple-500" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-gray-900">{stats.orders_this_month}</div>
                                <p className="mt-1 text-xs text-gray-500">commandes</p>
                                <div className="mt-2 text-sm font-medium text-purple-600">{formatCurrency(stats.revenue_this_month)}</div>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-amber-500">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-medium text-gray-600">Taux de conversion</CardTitle>
                                    <TrendingUp className="h-5 w-5 text-amber-500" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-gray-900">{stats.conversion_rate}%</div>
                                <p className="mt-1 text-xs text-gray-500">commandes livrées</p>
                                <div className="mt-2 text-sm text-gray-600">Total: {stats.total_orders} commandes</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Graphiques d'évolution */}
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Graphique des revenus */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <DollarSign className="h-5 w-5 text-green-600" />
                                    Évolution des revenus (30 derniers jours)
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={stats.sales_chart_data}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                                        <Legend />
                                        <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenu (TND)" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Graphique des commandes */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ShoppingCart className="h-5 w-5 text-blue-600" />
                                    Évolution des commandes (30 derniers jours)
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={stats.sales_chart_data}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="orders" fill="#3b82f6" name="Commandes" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Statut des commandes */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5" />
                                Statut des commandes
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                                {Object.entries(stats.orders_by_status).map(([status, count]) => (
                                    <div key={status} className="rounded-lg border bg-gray-50 p-4">
                                        <div className="text-sm font-medium text-gray-600">{statusLabels[status]}</div>
                                        <div className="mt-2 text-2xl font-bold text-gray-900">{count}</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Produits les plus vendus */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-green-600" />
                                    Produits les plus vendus
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {stats.top_products.length > 0 ? (
                                    <div className="space-y-4">
                                        {stats.top_products.map((product, index) => (
                                            <div key={product.id} className="flex items-center gap-4 rounded-lg border bg-gray-50 p-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                                                    #{index + 1}
                                                </div>
                                                {product.image_url ? (
                                                    <img
                                                        src={`product.image_url_url`}
                                                        alt={product.name}
                                                        className="h-12 w-12 rounded-lg object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-200">
                                                        <Package className="h-6 w-6 text-gray-400" />
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <Link href={`/products/${product.id}`} className="font-medium text-gray-900 hover:text-emerald-600">
                                                        {product.name}
                                                    </Link>
                                                    <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                                                        <span>{product.total_sold} vendus</span>
                                                        <span>•</span>
                                                        <span className="font-medium text-emerald-600">{formatCurrency(product.price)}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 text-green-600">
                                                    <ArrowUp className="h-4 w-4" />
                                                    <span className="text-sm font-medium">{product.total_sold}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-8 text-center text-gray-500">Aucune vente pour le moment</div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Stock faible */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-red-600" />
                                    Alertes stock faible
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {stats.low_stock_products.length > 0 ? (
                                    <div className="space-y-4">
                                        {stats.low_stock_products.map((product) => (
                                            <div key={product.id} className="flex items-center gap-4 rounded-lg border border-red-200 bg-red-50 p-3">
                                                {product.image_url ? (
                                                    <img
                                                        src={`product.image_url_url`}
                                                        alt={product.name}
                                                        className="h-12 w-12 rounded-lg object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-200">
                                                        <Package className="h-6 w-6 text-gray-400" />
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <Link href={`/products/${product.id}/edit`} className="font-medium text-gray-900 hover:text-red-600">
                                                        {product.name}
                                                    </Link>
                                                    <div className="mt-1 text-xs text-gray-500">{formatCurrency(product.price)}</div>
                                                </div>
                                                <Badge variant="destructive" className="flex items-center gap-1">
                                                    <AlertTriangle className="h-3 w-3" />
                                                    {product.stock_quantity} restants
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-8 text-center text-gray-500">Aucune alerte stock</div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Commandes récentes */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <ShoppingCart className="h-5 w-5" />
                                    Commandes récentes
                                </CardTitle>
                                <Link
                                    href="/admin/orders"
                                    className="text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
                                >
                                    Voir tout
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {stats.recent_orders.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b text-left text-sm font-medium text-gray-600">
                                                <th className="pb-3">Référence</th>
                                                <th className="pb-3">Client</th>
                                                <th className="pb-3">Montant</th>
                                                <th className="pb-3">Articles</th>
                                                <th className="pb-3">Statut</th>
                                                <th className="pb-3">Date</th>
                                                <th className="pb-3">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {stats.recent_orders.map((order) => (
                                                <tr key={order.id} className="text-sm">
                                                    <td className="py-3 font-medium text-gray-900">{order.reference}</td>
                                                    <td className="py-3">
                                                        <div className="font-medium text-gray-900">{order.customer_name}</div>
                                                        <div className="text-xs text-gray-500">{order.customer_email}</div>
                                                    </td>
                                                    <td className="py-3 font-semibold text-emerald-600">{formatCurrency(order.total_amount)}</td>
                                                    <td className="py-3 text-gray-600">{order.items_count}</td>
                                                    <td className="py-3">
                                                        <Badge className={statusColors[order.status]}>{statusLabels[order.status]}</Badge>
                                                    </td>
                                                    <td className="py-3 text-gray-600">{order.created_at}</td>
                                                    <td className="py-3">
                                                        <Link
                                                            href={`/admin/orders/${order.id}`}
                                                            className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                            Voir
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="py-8 text-center text-gray-500">Aucune commande récente</div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Espace en bas de page */}
                    <div className="pb-6"></div>
                </div>
            </AppLayout>
        </>
    );
}
