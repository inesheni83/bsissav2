<?php

namespace App\Models;

use App\Traits\HasSlug;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    use HasFactory, HasSlug;

    protected $fillable = [
        'name',
        'slug',
        'description',
    ];

    /**
     * Relations
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Scopes
     */
    public function scopeWithProductCount($query)
    {
        return $query->withCount('products');
    }

    public function scopeActive($query)
    {
        return $query->whereHas('products');
    }

    /**
     * Méthodes utilitaires
     */
    public function getProductCountAttribute(): int
    {
        return $this->products()->count();
    }

    public function hasProducts(): bool
    {
        return $this->products()->exists();
    }
}
