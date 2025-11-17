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
     * Get the image URL. Returns base64 data URI if image_data exists,
     * otherwise returns the file path (only if file exists).
     */
    public function getImageUrlAttribute(): ?string
    {
        // Priority 1: Use base64 image from database if available
        if ($this->image_data && $this->image_mime_type) {
            return 'data:' . $this->image_mime_type . ';base64,' . $this->image_data;
        }

        // Priority 2: Use file path if available AND file exists
        if ($this->image && \Storage::disk('public')->exists($this->image)) {
            return asset('storage/' . $this->image);
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
