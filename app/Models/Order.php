<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    public const STATUS_META = [
        'pending' => [
            'label' => 'En attente',
            'badge' => 'bg-amber-100 text-amber-800',
            'description' => 'La commande est en attente de traitement.',
        ],
        'processing' => [
            'label' => 'En preparation',
            'badge' => 'bg-sky-100 text-sky-800',
            'description' => 'La commande est en cours de preparation.',
        ],
        'shipped' => [
            'label' => 'Expediee',
            'badge' => 'bg-indigo-100 text-indigo-800',
            'description' => 'La commande a quitte notre entrepot.',
        ],
        'delivered' => [
            'label' => 'Livree',
            'badge' => 'bg-emerald-100 text-emerald-800',
            'description' => 'La commande a ete livree.',
        ],
        'cancelled' => [
            'label' => 'Annulee',
            'badge' => 'bg-rose-100 text-rose-800',
            'description' => 'La commande a ete annulee.',
        ],
    ];

    protected $fillable = [
        'user_id',
        'session_id',
        'reference',
        'first_name',
        'last_name',
        'address',
        'country',
        'region',
        'city',
        'postal_code',
        'phone',
        'note',
        'subtotal',
        'delivery_fees_id',
        'items_count',
        'items',
        'status',
    ];

    protected $casts = [
        'items' => 'array',
        'subtotal' => 'float',
        'items_count' => 'integer',
    ];

    /**
     * Get the user that owns the order.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the delivery fee associated with the order.
     */
    public function deliveryFee()
    {
        return $this->belongsTo(DeliveryFee::class, 'delivery_fees_id');
    }

    /**
     * Get the status history for the order.
     */
    public function statusHistory()
    {
        return $this->hasMany(OrderStatusHistory::class)->orderBy('created_at', 'desc');
    }

    /**
     * Get the invoice for the order.
     */
    public function invoice()
    {
        return $this->hasOne(Invoice::class);
    }

    public static function statusMeta(string $status): array
    {
        return self::STATUS_META[$status] ?? [
            'label' => ucfirst($status),
            'badge' => 'bg-slate-100 text-slate-800',
            'description' => 'Statut a jour.',
        ];
    }
}
