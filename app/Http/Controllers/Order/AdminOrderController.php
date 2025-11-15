<?php

namespace App\Http\Controllers\Order;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\OrderService;
use App\Support\OrderPresenter;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Response as HttpResponse;
use Inertia\Inertia;
use Inertia\Response;
use Barryvdh\DomPDF\Facade\Pdf;

class AdminOrderController extends Controller
{
    public function __construct(
        private OrderService $orderService
    ) {}

    /**
     * Display the orders list for admin.
     */
    public function index(Request $request): Response
    {
        // Get filters from request
        $filters = $request->only(['status', 'search', 'date_from', 'date_to', 'amount_min', 'amount_max', 'has_note', 'sort_by', 'sort_order']);

        // Get filtered orders
        $ordersQuery = $this->orderService->getFilteredOrders($filters);

        $orders = $ordersQuery->with('deliveryFee')->paginate(10)->withQueryString()->through(function (Order $order) {
            $deliveryFee = $order->deliveryFee?->amount ?? 0;
            $total = $order->subtotal + $deliveryFee;

            return [
                'id' => $order->id,
                'reference' => $order->reference,
                'status' => $order->status,
                'status_meta' => Order::statusMeta($order->status),
                'subtotal' => (float) $order->subtotal,
                'delivery_fee' => (float) $deliveryFee,
                'total' => (float) $total,
                'items_count' => (int) $order->items_count,
                'customer_name' => $order->first_name . ' ' . $order->last_name,
                'customer_email' => $order->user?->email ?? 'N/A',
                'created_at' => optional($order->created_at)->format('d/m/Y H:i'),
                'created_at_human' => optional($order->created_at)->diffForHumans(),
            ];
        });

        return Inertia::render('admin/orders/orderList', [
            'orders' => $orders,
            'filters' => $filters,
            'stats' => $this->orderService->getOrderStats(),
            'statusMeta' => Order::STATUS_META,
        ]);
    }

    /**
     * Display order details for admin.
     */
    public function show(Order $order): Response
    {
        $order->load(['user:id,name,email', 'deliveryFee']);

        return Inertia::render('admin/orders/orderDetails', [
            'order' => array_merge(OrderPresenter::detail($order), [
                'customer_name' => $order->first_name . ' ' . $order->last_name,
                'customer_email' => $order->user?->email ?? 'N/A',
                'customer_phone' => $order->phone,
            ]),
            'statusMeta' => Order::STATUS_META,
            'statusHistory' => $this->orderService->getOrderStatusHistory($order),
        ]);
    }

    /**
     * Update order status.
     */
    public function updateStatus(Request $request, Order $order): RedirectResponse
    {
        $request->validate([
            'status' => ['required', 'string', 'in:' . implode(',', array_keys(Order::STATUS_META))],
        ]);

        try {
            $this->orderService->updateOrderStatus($order, $request->input('status'));

            return redirect()->back()->with('success', 'Statut de la commande mis à jour avec succès.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Erreur lors de la mise à jour du statut: ' . $e->getMessage());
        }
    }

    /**
     * Generate invoice PDF for an order.
     */
    public function generateInvoice(Order $order): HttpResponse
    {
        $order->load(['user:id,name,email', 'deliveryFee', 'invoice']);

        $deliveryFee = $order->deliveryFee?->amount ?? 0;

        $data = [
            'order' => $order,
            'invoice' => $order->invoice,
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
            'total' => $order->subtotal + $deliveryFee,
        ];

        $pdf = Pdf::loadView('orders.invoice', $data);

        $fileName = $order->invoice ? 'facture-' . $order->invoice->invoice_number . '.pdf' : 'facture-' . $order->reference . '.pdf';

        return $pdf->download($fileName);
    }
}
