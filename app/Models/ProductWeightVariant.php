<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductWeightVariant extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'weight_value',
        'weight_unit',
        'price',
        'promotional_price',
        'stock_quantity',
        'is_available',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'weight_value' => 'integer',
        'price' => 'decimal:2',
        'promotional_price' => 'decimal:2',
        'stock_quantity' => 'integer',
        'is_available' => 'boolean',
    ];

    /**
     * Get the product that owns the weight variant.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the user who created this variant.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the user who last updated this variant.
     */
    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Get the full weight display (value + unit).
     */
    public function getFullWeightAttribute(): string
    {
        return $this->weight_value . ' ' . $this->weight_unit;
    }

    /**
     * Get the effective price (promotional if available, otherwise normal price).
     */
    public function getEffectivePriceAttribute(): float
    {
        return $this->promotional_price ?? $this->price;
    }

    /**
     * Check if the variant has a promotional price.
     */
    public function hasPromotionalPrice(): bool
    {
        return !is_null($this->promotional_price) && $this->promotional_price < $this->price;
    }

    /**
     * Scope a query to only include available variants.
     */
    public function scopeAvailable($query)
    {
        return $query->where('is_available', true);
    }

    /**
     * Scope a query to only include variants in stock.
     */
    public function scopeInStock($query)
    {
        return $query->where('stock_quantity', '>', 0);
    }
}
