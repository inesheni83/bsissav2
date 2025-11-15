<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductVariant extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'name',
        'price',
        'stock_quantity',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'stock_quantity' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $attributes = [
        'stock_quantity' => 0,
    ];

    /**
     * Relations
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Scopes
     */
    public function scopeInStock($query)
    {
        return $query->where('stock_quantity', '>', 0);
    }

    /**
     * Mutateurs et Accessors
     */
    public function setPriceAttribute($value)
    {
        $this->attributes['price'] = $value !== null ? abs($value) : null;
    }

    public function setStockQuantityAttribute($value)
    {
        $this->attributes['stock_quantity'] = $value !== null ? max(0, (int) $value) : 0;
    }

    /**
     * Méthodes utilitaires
     */
    public function isInStock(): bool
    {
        return $this->stock_quantity > 0;
    }
}
