<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

class CustomerService
{
    /**
     * Get customers filtered by the provided options.
     *
     * @param  array<string, mixed>  $filters
     */
    public function getFilteredCustomers(array $filters = []): Builder
    {
        $query = User::query()
            ->withCount('orders')
            ->with('orders')
            ->orderByDesc('created_at');

        // Search by name or email
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(fn (Builder $builder) => $builder
                ->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhere('phone', 'like', "%{$search}%"));
        }

        // Filter by role (only customers, exclude admin/vendeur)
        if (!empty($filters['role'])) {
            $query->where('role', $filters['role']);
        } else {
            // By default, show only customers
            $query->where('role', 'client');
        }

        // Filter by date range
        if (!empty($filters['date_from'])) {
            $query->whereDate('created_at', '>=', $filters['date_from']);
        }

        if (!empty($filters['date_to'])) {
            $query->whereDate('created_at', '<=', $filters['date_to']);
        }

        // Filter by minimum orders count
        if (!empty($filters['min_orders'])) {
            $query->has('orders', '>=', (int) $filters['min_orders']);
        }

        return $query;
    }

    /**
     * Get customer statistics.
     */
    public function getCustomerStats(): array
    {
        $totalCustomers = User::where('role', 'client')->count();
        $newCustomersThisMonth = User::where('role', 'client')
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        $activeCustomers = User::where('role', 'client')
            ->has('orders')
            ->count();

        $customersWithMultipleOrders = User::where('role', 'client')
            ->has('orders', '>=', 2)
            ->count();

        return [
            'total_customers' => $totalCustomers,
            'new_this_month' => $newCustomersThisMonth,
            'active_customers' => $activeCustomers,
            'repeat_customers' => $customersWithMultipleOrders,
        ];
    }
}
