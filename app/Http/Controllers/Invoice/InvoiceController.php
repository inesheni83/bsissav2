<?php

namespace App\Http\Controllers\Invoice;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Order;
use App\Services\InvoiceService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Inertia\Inertia;
use Inertia\Response;
use Barryvdh\DomPDF\Facade\Pdf;

class InvoiceController extends Controller
{
    public function __construct(
        private InvoiceService $invoiceService
    ) {}

    /**
     * Display all invoices.
     */
    public function index(Request $request): Response
    {
        $filters = $request->only(['invoice_number', 'order_reference', 'client_name', 'status', 'payment_status', 'date_from', 'date_to']);

        $invoices = $this->invoiceService->getFilteredInvoices($filters)
            ->paginate(10)
            ->withQueryString()
            ->through(function (Invoice $invoice) {
                return [
                    'id' => $invoice->id,
                    'invoice_number' => $invoice->invoice_number,
                    'client_name' => $invoice->client_name,
                    'client_email' => $invoice->client_email,
                    'total_ttc' => (float) $invoice->total_ttc,
                    'status' => $invoice->status,
                    'payment_status' => $invoice->payment_status,
                    'invoice_date' => $invoice->invoice_date->format('d/m/Y'),
                    'order_reference' => $invoice->order->reference ?? 'N/A',
                    'order_id' => $invoice->order_id,
                ];
            });

        return Inertia::render('admin/invoices/invoiceList', [
            'invoices' => $invoices,
            'filters' => $filters,
            'stats' => $this->invoiceService->getInvoiceStats(),
        ]);
    }

    /**
     * Generate and download invoice PDF.
     */
    public function download(Invoice $invoice): HttpResponse
    {
        $order = $invoice->order()->with('user')->first();

        $data = [
            'invoice' => $invoice,
            'order' => $order,
            'items' => is_array($order->items) ? $order->items : json_decode($order->items, true),
        ];

        $pdf = Pdf::loadView('invoices.pdf', $data);

        return $pdf->download($invoice->invoice_number . '.pdf');
    }

    /**
     * Create invoice for an order.
     */
    public function createFromOrder(Order $order): Response
    {
        $invoice = $this->invoiceService->createInvoiceFromOrder($order);

        return redirect()
            ->route('admin.invoices.index')
            ->with('success', 'Facture ' . $invoice->invoice_number . ' créée avec succès.');
    }

    /**
     * Update invoice status.
     */
    public function updateStatus(Request $request, Invoice $invoice): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|string|in:draft,sent,paid,cancelled',
            'payment_status' => 'required|string|in:pending,paid,overdue',
        ]);

        // Ensure coherence between status and payment_status
        $status = $validated['status'];
        $paymentStatus = $validated['payment_status'];

        // If invoice status is "paid", payment_status must be "paid"
        if ($status === 'paid' && $paymentStatus !== 'paid') {
            $paymentStatus = 'paid';
        }

        // If payment_status is "paid", invoice status should be at least "sent"
        if ($paymentStatus === 'paid' && $status === 'draft') {
            return redirect()
                ->back()
                ->withErrors(['status' => 'Une facture en brouillon ne peut pas être marquée comme payée.']);
        }

        // If invoice is cancelled, payment should be pending (unless already paid and needs refund)
        if ($status === 'cancelled' && $paymentStatus === 'overdue') {
            $paymentStatus = 'pending';
        }

        $invoice->update([
            'status' => $status,
            'payment_status' => $paymentStatus,
        ]);

        return redirect()
            ->back()
            ->with('success', 'Statut de la facture mis à jour avec succès.');
    }

    /**
     * Update invoice payment status.
     */
    public function updatePaymentStatus(Request $request, Invoice $invoice): RedirectResponse
    {
        $validated = $request->validate([
            'payment_status' => 'required|string|in:pending,paid,overdue',
        ]);

        $paymentStatus = $validated['payment_status'];

        // If payment is marked as paid, ensure invoice is not in draft
        if ($paymentStatus === 'paid' && $invoice->status === 'draft') {
            return redirect()
                ->back()
                ->withErrors(['payment_status' => 'Une facture en brouillon ne peut pas être marquée comme payée.']);
        }

        // If payment is marked as paid, update invoice status to "paid" if it's "sent"
        if ($paymentStatus === 'paid' && $invoice->status === 'sent') {
            $invoice->update([
                'status' => 'paid',
                'payment_status' => $paymentStatus,
            ]);
        } else {
            $invoice->update([
                'payment_status' => $paymentStatus,
            ]);
        }

        return redirect()
            ->back()
            ->with('success', 'Statut de paiement mis à jour avec succès.');
    }
}
