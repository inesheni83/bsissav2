<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GalleryImage extends Model
{
    protected $fillable = [
        'name',
        'order',
        'image',
        'image_data',
        'image_mime_type',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'order' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Accessors to append to JSON serialization.
     */
    protected $appends = [
        'image_url',
    ];

    /**
     * Hidden attributes (not included in JSON by default).
     */
    protected $hidden = [
        'image_data',
    ];

    /**
     * Relations
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
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

    /**
     * Scopes
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }
}
