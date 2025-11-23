<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeliveryFee extends Model
{
    use HasFactory;

    protected $fillable = [
        'delivery_person_name',
        'delivery_person_phone',
        'amount',
        'free_shipping_threshold',
        'is_active',
        'notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'free_shipping_threshold' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    /**
     * Boot method to handle is_active logic
     */
    protected static function booted(): void
    {
        static::saving(function (DeliveryFee $deliveryFee) {
            if ($deliveryFee->is_active && $deliveryFee->isDirty('is_active')) {
                // Désactiver tous les autres livreurs
                self::where('id', '!=', $deliveryFee->id)
                    ->where('is_active', true)
                    ->update(['is_active' => false]);
            }
        });
    }
}
