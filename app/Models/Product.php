<?php

namespace App\Models;

use App\Traits\HasSlug;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory, HasSlug;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'detailed_description',
        'image',
        'image_data',         // Base64 encoded image
        'image_mime_type',    // Image MIME type
        'category_id',
        'is_featured',

        // Détails complémentaires
        'ingredients',
        'marketing_tags',

        // Valeurs nutritionnelles
        'calories_kcal',
        'protein_g',
        'carbs_g',
        'fat_g',
        'fiber_g',

        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'is_featured' => 'boolean',

        // Valeurs nutritionnelles
        'calories_kcal' => 'decimal:1',
        'protein_g' => 'decimal:1',
        'carbs_g' => 'decimal:1',
        'fat_g' => 'decimal:1',
        'fiber_g' => 'decimal:1',

        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $attributes = [
        'is_featured' => false,
    ];

    /**
     * Accessors to append to JSON serialization.
     */
    protected $appends = [
        'image_url',
    ];

    /**
     * Hidden attributes (not included in JSON by default).
     * image_data is heavy, only use image_url accessor instead.
     */
    protected $hidden = [
        'image_data',
    ];

    /**
     * Relations
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function weightVariants(): HasMany
    {
        return $this->hasMany(ProductWeightVariant::class);
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
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeInStock($query)
    {
        return $query->whereHas('weightVariants', function ($q) {
            $q->where('stock_quantity', '>', 0)->where('is_available', true);
        });
    }

    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    /**
     * Méthodes utilitaires
     */
    public function isInStock(): bool
    {
        return $this->weightVariants()->where('stock_quantity', '>', 0)->where('is_available', true)->exists();
    }

    public function hasVariants(): bool
    {
        return $this->variants()->exists();
    }

    public function hasWeightVariants(): bool
    {
        return $this->weightVariants()->exists();
    }

    public function getTotalWeightVariantStockAttribute(): int
    {
        return $this->weightVariants()->sum('stock_quantity');
    }

    public function getMinPriceAttribute(): ?float
    {
        return $this->weightVariants()->min('price');
    }

    public function getMaxPriceAttribute(): ?float
    {
        return $this->weightVariants()->max('price');
    }

    /**
     * Get the image URL from the physical file path.
     * No more base64 - images are stored on disk only for better performance.
     */
    public function getImageUrlAttribute(): ?string
    {
        // Use file path if available
        if ($this->image) {
            $normalizedPath = ltrim($this->image, '/');

            // Return the public asset URL
            return asset('storage/' . $normalizedPath);
        }

        return null;
    }
}
