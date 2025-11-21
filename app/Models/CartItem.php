<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CartItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'pack_id',
        'weight_variant_id',
        'user_id',
        'session_id',
        'quantity',
        'unit_price',
        'total_price',
    ];

    protected $casts = [
        'unit_price' => 'decimal:2',
        'total_price' => 'decimal:2',
        'quantity' => 'integer',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function pack(): BelongsTo
    {
        return $this->belongsTo(Pack::class);
    }

    public function weightVariant(): BelongsTo
    {
        return $this->belongsTo(ProductWeightVariant::class, 'weight_variant_id');
    }

    public function scopeForOwner(Builder $query, ?int $userId, ?string $sessionId): Builder
    {
        return $query->where(function (Builder $builder) use ($userId, $sessionId) {
            if ($userId) {
                $builder->where('user_id', $userId);
            } else {
                $builder->whereNull('user_id')->where('session_id', $sessionId);
            }
        });
    }
}

