<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Services\CustomerService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class CustomerController extends Controller
{
    public function __construct(
        private CustomerService $customerService
    ) {}

    /**
     * Display a listing of customers.
     */
    public function index(Request $request): InertiaResponse
    {
        $filters = $request->only(['search', 'role', 'date_from', 'date_to', 'min_orders']);

        $customers = $this->customerService->getFilteredCustomers($filters)
            ->paginate(10)
            ->withQueryString()
            ->through(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'role' => $user->role,
                    'created_at' => $user->created_at->format('d/m/Y'),
                    'created_at_human' => $user->created_at->diffForHumans(),
                    'orders_count' => $user->orders_count,
                    'total_spent' => $user->orders->sum('subtotal'),
                ];
            });

        $stats = $this->customerService->getCustomerStats();

        return Inertia::render('admin/customers/index', [
            'customers' => $customers,
            'filters' => $filters,
            'stats' => $stats,
        ]);
    }

    /**
     * Export customers data as CSV.
     */
    public function export(Request $request): Response
    {
        $filters = $request->only(['search', 'role', 'date_from', 'date_to', 'min_orders']);

        $customers = $this->customerService->getFilteredCustomers($filters)->get();

        $filename = 'clients_' . now()->format('Y-m-d_His') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        $callback = function () use ($customers) {
            $file = fopen('php://output', 'w');

            // Add BOM for Excel UTF-8 support
            fprintf($file, chr(0xEF) . chr(0xBB) . chr(0xBF));

            // Headers
            fputcsv($file, ['ID', 'Nom', 'Email', 'Téléphone', 'Rôle', 'Date d\'inscription', 'Nombre de commandes', 'Total dépensé (TND)'], ';');

            // Data
            foreach ($customers as $customer) {
                fputcsv($file, [
                    $customer->id,
                    $customer->name,
                    $customer->email,
                    $customer->phone ?? 'N/A',
                    $customer->role,
                    $customer->created_at->format('d/m/Y H:i'),
                    $customer->orders_count,
                    number_format($customer->orders->sum('subtotal'), 2, ',', ' '),
                ], ';');
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
