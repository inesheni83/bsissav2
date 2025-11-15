<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Product;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SellerDashboardService
{
    /**
     * Get dashboard statistics for seller.
     */
    public function getDashboardStats(): array
    {
        $today = Carbon::today();
        $startOfWeek = Carbon::now()->startOfWeek();
        $startOfMonth = Carbon::now()->startOfMonth();

        return [
            // Statistiques des commandes
            'orders_today' => Order::whereDate('created_at', $today)->count(),
            'orders_this_week' => Order::where('created_at', '>=', $startOfWeek)->count(),
            'orders_this_month' => Order::where('created_at', '>=', $startOfMonth)->count(),
            'total_orders' => Order::count(),

            // Revenus (subtotal uniquement, les frais de livraison sont dans une relation)
            'revenue_today' => Order::whereDate('created_at', $today)
                ->where('status', '!=', 'cancelled')
                ->sum('subtotal'),
            'revenue_this_week' => Order::where('created_at', '>=', $startOfWeek)
                ->where('status', '!=', 'cancelled')
                ->sum('subtotal'),
            'revenue_this_month' => Order::where('created_at', '>=', $startOfMonth)
                ->where('status', '!=', 'cancelled')
                ->sum('subtotal'),
            'revenue_total' => Order::where('status', '!=', 'cancelled')->sum('subtotal'),

            // Taux de conversion (commandes livrées / total commandes)
            'conversion_rate' => $this->getConversionRate(),

            // Produits les plus vendus
            'top_products' => $this->getTopSellingProducts(),

            // Produits avec stock faible
            'low_stock_products' => $this->getLowStockProducts(),

            // Graphiques d'évolution des ventes (30 derniers jours)
            'sales_chart_data' => $this->getSalesChartData(),

            // Commandes récentes
            'recent_orders' => $this->getRecentOrders(),

            // Statut des commandes
            'orders_by_status' => $this->getOrdersByStatus(),
        ];
    }

    /**
     * Calculate conversion rate.
     */
    private function getConversionRate(): float
    {
        $totalOrders = Order::count();
        if ($totalOrders === 0) {
            return 0;
        }

        $completedOrders = Order::where('status', 'delivered')->count();
        return round(($completedOrders / $totalOrders) * 100, 2);
    }

    /**
     * Get top selling products.
     */
    private function getTopSellingProducts(int $limit = 5): array
    {
        // Récupérer toutes les commandes non annulées avec leurs items
        $orders = Order::where('status', '!=', 'cancelled')
            ->get();

        // Calculer les ventes par produit depuis le JSON items
        $productSales = [];

        foreach ($orders as $order) {
            if (is_array($order->items)) {
                foreach ($order->items as $item) {
                    $productId = $item['product_id'] ?? null;
                    if ($productId) {
                        if (!isset($productSales[$productId])) {
                            $productSales[$productId] = 0;
                        }
                        $productSales[$productId] += $item['quantity'] ?? 0;
                    }
                }
            }
        }

        // Trier par quantité vendue
        arsort($productSales);

        // Récupérer les N premiers produits
        $topProductIds = array_slice(array_keys($productSales), 0, $limit, true);

        // Charger les informations des produits avec leurs variantes
        $products = Product::with('weightVariants')
            ->whereIn('id', $topProductIds)
            ->get()
            ->keyBy('id');

        // Construire le résultat
        $result = [];
        foreach ($topProductIds as $productId) {
            $product = $products->get($productId);
            if ($product) {
                $result[] = [
                    'id' => $product->id,
                    'name' => $product->name,
                    'image' => $product->image,
                    'total_sold' => $productSales[$productId],
                    'price' => (float) $product->min_price ?? 0,
                ];
            }
        }

        return $result;
    }

    /**
     * Get products with low stock.
     */
    private function getLowStockProducts(int $threshold = 10): array
    {
        // Récupérer tous les produits avec leurs variantes de poids
        $products = Product::with('weightVariants')
            ->get()
            ->map(function ($product) {
                // Calculer le stock total des variantes
                $totalStock = $product->weightVariants->sum('stock_quantity');
                return [
                    'product' => $product,
                    'total_stock' => $totalStock,
                ];
            })
            ->filter(function ($item) use ($threshold) {
                // Garder uniquement les produits avec stock faible
                return $item['total_stock'] > 0 && $item['total_stock'] <= $threshold;
            })
            ->sortBy('total_stock')
            ->take(10)
            ->map(function ($item) {
                $product = $item['product'];
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'image' => $product->image,
                    'stock_quantity' => $item['total_stock'],
                    'price' => (float) $product->min_price ?? 0,
                ];
            })
            ->values()
            ->toArray();

        return $products;
    }

    /**
     * Get sales chart data for the last 30 days.
     */
    private function getSalesChartData(): array
    {
        $days = 30;
        $data = [];

        for ($i = $days - 1; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->format('Y-m-d');
            $revenue = Order::whereDate('created_at', $date)
                ->where('status', '!=', 'cancelled')
                ->sum('subtotal');

            $ordersCount = Order::whereDate('created_at', $date)->count();

            $data[] = [
                'date' => Carbon::parse($date)->format('d/m'),
                'revenue' => (float) $revenue,
                'orders' => $ordersCount,
            ];
        }

        return $data;
    }

    /**
     * Get recent orders.
     */
    private function getRecentOrders(int $limit = 10): array
    {
        return Order::with('user')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'reference' => $order->reference,
                    'customer_name' => $order->user->name ?? ($order->first_name . ' ' . $order->last_name),
                    'customer_email' => $order->user->email ?? 'N/A',
                    'total_amount' => (float) $order->subtotal,
                    'status' => $order->status,
                    'created_at' => $order->created_at->format('d/m/Y H:i'),
                    'items_count' => $order->items_count,
                ];
            })
            ->toArray();
    }

    /**
     * Get orders grouped by status.
     */
    private function getOrdersByStatus(): array
    {
        $statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        $result = [];

        foreach ($statuses as $status) {
            $result[$status] = Order::where('status', $status)->count();
        }

        return $result;
    }
}
