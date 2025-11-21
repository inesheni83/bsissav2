<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

class Pack extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'main_image',
        'main_image_data',
        'main_image_mime_type',
        'gallery_images',
        'price',
        'reference_price',
        'is_active',
        'stock_quantity',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'gallery_images' => 'array',
        'price' => 'decimal:2',
        'reference_price' => 'decimal:2',
        'is_active' => 'boolean',
        'stock_quantity' => 'integer',
    ];

    protected $appends = ['main_image_url', 'savings', 'savings_percentage'];

    protected $hidden = ['main_image_data'];

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * Accessor pour l'URL de l'image principale
     */
    public function getMainImageUrlAttribute(): ?string
    {
        if ($this->main_image_data && $this->main_image_mime_type) {
            return 'data:' . $this->main_image_mime_type . ';base64,' . $this->main_image_data;
        }

        if ($this->main_image && \Storage::disk('public')->exists($this->main_image)) {
            return asset('storage/' . $this->main_image);
        }

        return null;
    }

    /**
     * Accessor pour calculer l'économie réalisée
     */
    public function getSavingsAttribute(): ?float
    {
        if ($this->reference_price && $this->reference_price > $this->price) {
            return round($this->reference_price - $this->price, 2);
        }

        return null;
    }

    /**
     * Accessor pour calculer le pourcentage d'économie
     */
    public function getSavingsPercentageAttribute(): ?int
    {
        if ($this->reference_price && $this->reference_price > 0 && $this->reference_price > $this->price) {
            return (int) round((($this->reference_price - $this->price) / $this->reference_price) * 100);
        }

        return null;
    }

    /**
     * Relation avec les produits (many-to-many avec pivot quantity)
     */
    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'pack_product')
            ->withPivot('quantity')
            ->withTimestamps();
    }

    /**
     * Relation avec le créateur
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Relation avec le dernier éditeur
     */
    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Scope pour les packs actifs uniquement
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope pour les packs en stock
     */
    public function scopeInStock($query)
    {
        return $query->where('stock_quantity', '>', 0);
    }

    /**
     * Boot method pour générer automatiquement le slug
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($pack) {
            if (empty($pack->slug)) {
                $pack->slug = Str::slug($pack->name);

                // Assurer l'unicité du slug
                $originalSlug = $pack->slug;
                $count = 1;
                while (static::where('slug', $pack->slug)->exists()) {
                    $pack->slug = $originalSlug . '-' . $count++;
                }
            }
        });
    }
}
