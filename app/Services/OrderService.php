<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\Order;
use App\Models\OrderStatusHistory;
use App\Models\ProductWeightVariant;
use App\Notifications\OrderStatusChanged;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class OrderService
{
    /**
     * Get filtered orders query for admin.
     */
    public function getFilteredOrders(array $filters = []): Builder
    {
        $query = Order::query()
            ->with('user:id,name,email');

        // Filter by status
        if (!empty($filters['status']) && $filters['status'] !== 'all') {
            $query->where('status', $filters['status']);
        }

        // Filter by search (reference, customer name, email)
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('reference', 'like', "%{$search}%")
                  ->orWhere('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($userQuery) use ($search) {
                      $userQuery->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        // Filter by date range
        if (!empty($filters['date_from'])) {
            $query->whereDate('created_at', '>=', $filters['date_from']);
        }

        if (!empty($filters['date_to'])) {
            $query->whereDate('created_at', '<=', $filters['date_to']);
        }

        // Filter by amount range
        if (!empty($filters['amount_min'])) {
            $query->where('subtotal', '>=', floatval($filters['amount_min']));
        }

        if (!empty($filters['amount_max'])) {
            $query->where('subtotal', '<=', floatval($filters['amount_max']));
        }

        // Filter by orders with notes
        if (!empty($filters['has_note']) && $filters['has_note'] === '1') {
            $query->whereNotNull('note')->where('note', '!=', '');
        }

        // Apply sorting
        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortOrder = $filters['sort_order'] ?? 'desc';

        switch ($sortBy) {
            case 'status':
                $query->orderBy('status', $sortOrder);
                break;
            case 'created_at':
                $query->orderBy('created_at', $sortOrder);
                break;
            case 'subtotal':
                $query->orderBy('subtotal', $sortOrder);
                break;
            default:
                $query->orderByDesc('created_at');
        }

        return $query;
    }

    /**
     * Get order statistics.
     */
    public function getOrderStats(): array
    {
        return [
            'total_orders' => Order::count(),
            'pending_orders' => Order::where('status', 'pending')->count(),
            'processing_orders' => Order::where('status', 'processing')->count(),
            'shipped_orders' => Order::where('status', 'shipped')->count(),
            'delivered_orders' => Order::where('status', 'delivered')->count(),
            'cancelled_orders' => Order::where('status', 'cancelled')->count(),
            'total_revenue' => Order::whereIn('status', ['delivered', 'shipped', 'processing'])->sum('subtotal'),
            'pending_revenue' => Order::where('status', 'pending')->sum('subtotal'),
        ];
    }

    /**
     * Update order status with history tracking and notification.
     */
    public function updateOrderStatus(Order $order, string $newStatus, ?string $note = null): Order
    {
        $validStatuses = array_keys(Order::STATUS_META);

        if (!in_array($newStatus, $validStatuses)) {
            throw new \InvalidArgumentException("Invalid status: {$newStatus}");
        }

        $oldStatus = $order->status;

        // Don't proceed if status hasn't changed
        if ($oldStatus === $newStatus) {
            return $order;
        }

        return DB::transaction(function () use ($order, $oldStatus, $newStatus, $note) {
            // Restaurer le stock si la commande passe à 'cancelled' ou 'failed'
            if (in_array($newStatus, ['cancelled', 'failed']) && in_array($oldStatus, ['pending', 'processing', 'shipped'])) {
                $this->restoreStock($order);
            }

            // Update order status
            $order->update(['status' => $newStatus]);

            // Create status history entry
            OrderStatusHistory::create([
                'order_id' => $order->id,
                'old_status' => $oldStatus,
                'new_status' => $newStatus,
                'changed_by' => Auth::id(),
                'note' => $note,
            ]);

            // Send notification to customer if they have a user account
            if ($order->user) {
                $order->user->notify(new OrderStatusChanged($order, $oldStatus, $newStatus));
            }

            // Generate invoice automatically when order is marked as delivered
            if ($newStatus === 'delivered') {
                $this->generateAndSaveInvoice($order);
            }

            return $order->fresh();
        });
    }

    /**
     * Get status history for an order.
     */
    public function getOrderStatusHistory(Order $order): array
    {
        return $order->statusHistory()
            ->with('changedBy:id,name')
            ->get()
            ->map(function ($history) {
                return [
                    'id' => $history->id,
                    'old_status' => $history->old_status,
                    'old_status_meta' => $history->old_status ? Order::statusMeta($history->old_status) : null,
                    'new_status' => $history->new_status,
                    'new_status_meta' => Order::statusMeta($history->new_status),
                    'changed_by' => $history->changedBy?->name ?? 'Système',
                    'note' => $history->note,
                    'created_at' => $history->created_at->format('d/m/Y H:i'),
                    'created_at_human' => $history->created_at->diffForHumans(),
                ];
            })
            ->toArray();
    }

    /**
     * Generate and save invoice for an order.
     */
    private function generateAndSaveInvoice(Order $order): void
    {
        try {
            // Check if invoice already exists
            if ($order->invoice) {
                \Log::info("Invoice already exists for order {$order->reference}");
                return;
            }

            // Load necessary relationships
            $order->load(['user:id,name,email', 'deliveryFee']);

            // Calculate financial details
            $deliveryFee = $order->deliveryFee?->amount ?? 0;

            // TVA is calculated only on the order subtotal (excluding delivery fees)
            $vatRate = 19.00;
            $subtotalHT = $order->subtotal / (1 + ($vatRate / 100));
            $vatAmount = $order->subtotal - $subtotalHT;
            $totalTTC = $order->subtotal + $deliveryFee;

            // Create invoice number
            $invoiceNumber = Invoice::generateInvoiceNumber();

            // Create invoice record
            $invoice = Invoice::create([
                'invoice_number' => $invoiceNumber,
                'order_id' => $order->id,
                'user_id' => $order->user_id,

                // Seller information
                'seller_name' => 'BSISSA ZED ELMOULOUK',
                'seller_address' => 'Tunisie',
                'seller_registration' => null,
                'seller_vat_number' => null,

                // Client information
                'client_name' => $order->first_name . ' ' . $order->last_name,
                'client_email' => $order->user?->email ?? 'N/A',
                'client_phone' => $order->phone,
                'client_address' => $order->address . ', ' . $order->postal_code . ' ' . $order->city . ', ' . $order->region . ', ' . $order->country,

                // Financial information
                'subtotal_ht' => $subtotalHT,
                'vat_rate' => $vatRate,
                'vat_amount' => $vatAmount,
                'total_ttc' => $totalTTC,

                // Payment information
                'payment_method' => 'cash_on_delivery',
                'payment_status' => 'pending',

                // Invoice metadata
                'invoice_date' => now(),
                'due_date' => now()->addDays(30),
                'notes' => $order->note,
                'status' => 'sent',
            ]);

            // Prepare data for PDF
            $data = [
                'order' => $order,
                'invoice' => $invoice,
                'customer_name' => $order->first_name . ' ' . $order->last_name,
                'customer_email' => $order->user?->email ?? 'N/A',
                'customer_phone' => $order->phone,
                'delivery' => [
                    'first_name' => $order->first_name,
                    'last_name' => $order->last_name,
                    'address' => $order->address,
                    'country' => $order->country,
                    'region' => $order->region,
                    'city' => $order->city,
                    'postal_code' => $order->postal_code,
                    'phone' => $order->phone,
                ],
                'items' => is_array($order->items) ? $order->items : json_decode($order->items, true),
                'status_meta' => Order::statusMeta($order->status),
                'delivery_fee' => $deliveryFee,
                'subtotal' => $order->subtotal,
                'total' => $totalTTC,
            ];

            // Generate PDF
            $pdf = Pdf::loadView('orders.invoice', $data);

            // Save PDF to storage
            $fileName = 'facture-' . $invoiceNumber . '.pdf';
            $filePath = 'invoices/' . $fileName;

            Storage::disk('public')->put($filePath, $pdf->output());

            // Log the generation
            \Log::info("Invoice {$invoiceNumber} generated automatically for order {$order->reference}");
        } catch (\Exception $e) {
            // Log error but don't throw exception to avoid breaking the status update
            \Log::error("Failed to generate invoice for order {$order->reference}: " . $e->getMessage());
        }
    }

    /**
     * Restore stock for cancelled or failed orders.
     */
    private function restoreStock(Order $order): void
    {
        $items = $order->items ?? [];

        foreach ($items as $item) {
            if (isset($item['weight_variant_id']) && $item['weight_variant_id']) {
                $weightVariant = ProductWeightVariant::find($item['weight_variant_id']);
                if ($weightVariant) {
                    $weightVariant->increment('stock_quantity', $item['quantity']);
                    \Log::info("Stock restored: {$item['quantity']} units for weight variant ID {$item['weight_variant_id']} (Order: {$order->reference})");
                }
            }
        }
    }
}
