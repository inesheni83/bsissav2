<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_number',
        'order_id',
        'user_id',
        'seller_name',
        'seller_address',
        'seller_registration',
        'seller_vat_number',
        'client_name',
        'client_email',
        'client_phone',
        'client_address',
        'subtotal_ht',
        'vat_rate',
        'vat_amount',
        'total_ttc',
        'payment_method',
        'payment_status',
        'invoice_date',
        'due_date',
        'notes',
        'status',
    ];

    protected $casts = [
        'subtotal_ht' => 'decimal:2',
        'vat_rate' => 'decimal:2',
        'vat_amount' => 'decimal:2',
        'total_ttc' => 'decimal:2',
        'invoice_date' => 'date',
        'due_date' => 'date',
    ];

    /**
     * Get the order that owns the invoice.
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Get the user that owns the invoice.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Generate a unique invoice number.
     */
    public static function generateInvoiceNumber(): string
    {
        $year = date('Y');
        $lastInvoice = self::whereYear('created_at', $year)
            ->orderBy('id', 'desc')
            ->first();

        $nextNumber = $lastInvoice ? (int)substr($lastInvoice->invoice_number, -6) + 1 : 1;

        return 'INV-' . $year . '-' . str_pad($nextNumber, 6, '0', STR_PAD_LEFT);
    }
}
