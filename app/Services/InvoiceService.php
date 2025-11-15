<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\Order;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class InvoiceService
{
    /**
     * Company/Seller information
     */
    private const SELLER_INFO = [
        'name' => 'BSISSA ZED MLOUK',
        'address' => "Produits Naturels et Traditionnels\nTunisie",
        'registration' => null, // À définir
        'vat_number' => null, // À définir
    ];

    /**
     * Default VAT rate (19% for Tunisia)
     */
    private const VAT_RATE = 19.00;

    /**
     * Create invoice from order.
     */
    public function createInvoiceFromOrder(Order $order): Invoice
    {
        return DB::transaction(function () use ($order) {
            // Calculate financial details
            $subtotalHT = $order->subtotal;
            $vatAmount = $subtotalHT * (self::VAT_RATE / 100);
            $totalTTC = $subtotalHT + $vatAmount;

            // Create invoice
            $invoice = Invoice::create([
                'invoice_number' => Invoice::generateInvoiceNumber(),
                'order_id' => $order->id,
                'user_id' => $order->user_id,

                // Seller information
                'seller_name' => self::SELLER_INFO['name'],
                'seller_address' => self::SELLER_INFO['address'],
                'seller_registration' => self::SELLER_INFO['registration'],
                'seller_vat_number' => self::SELLER_INFO['vat_number'],

                // Client information
                'client_name' => $order->first_name . ' ' . $order->last_name,
                'client_email' => $order->user?->email ?? 'N/A',
                'client_phone' => $order->phone,
                'client_address' => implode("\n", [
                    $order->address,
                    $order->postal_code . ' ' . $order->city,
                    $order->region . ', ' . $order->country,
                ]),

                // Financial information
                'subtotal_ht' => $subtotalHT,
                'vat_rate' => self::VAT_RATE,
                'vat_amount' => $vatAmount,
                'total_ttc' => $totalTTC,

                // Payment information
                'payment_method' => 'Paiement à la livraison',
                'payment_status' => 'pending',

                // Invoice metadata
                'invoice_date' => now(),
                'due_date' => now()->addDays(30),
                'status' => 'sent',
            ]);

            return $invoice;
        });
    }

    /**
     * Get filtered invoices query.
     */
    public function getFilteredInvoices(array $filters = []): Builder
    {
        $query = Invoice::query()
            ->with(['order', 'user'])
            ->orderByDesc('created_at');

        // Filter by invoice number
        if (!empty($filters['invoice_number'])) {
            $query->where('invoice_number', 'like', "%{$filters['invoice_number']}%");
        }

        // Filter by client name
        if (!empty($filters['client_name'])) {
            $query->where('client_name', 'like', "%{$filters['client_name']}%");
        }

        // Filter by status
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        // Filter by payment status
        if (!empty($filters['payment_status'])) {
            $query->where('payment_status', $filters['payment_status']);
        }

        // Filter by date range
        if (!empty($filters['date_from'])) {
            $query->whereDate('invoice_date', '>=', $filters['date_from']);
        }

        if (!empty($filters['date_to'])) {
            $query->whereDate('invoice_date', '<=', $filters['date_to']);
        }

        return $query;
    }

    /**
     * Get invoice statistics.
     */
    public function getInvoiceStats(): array
    {
        return [
            'total_invoices' => Invoice::count(),
            'sent_invoices' => Invoice::where('status', 'sent')->count(),
            'paid_invoices' => Invoice::where('payment_status', 'paid')->count(),
            'pending_invoices' => Invoice::where('payment_status', 'pending')->count(),
            'overdue_invoices' => Invoice::where('payment_status', 'overdue')->count(),
            'total_amount' => Invoice::sum('total_ttc'),
            'paid_amount' => Invoice::where('payment_status', 'paid')->sum('total_ttc'),
            'pending_amount' => Invoice::where('payment_status', 'pending')->sum('total_ttc'),
        ];
    }
}
