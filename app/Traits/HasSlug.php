<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait HasSlug
{
    /**
     * Génère un slug unique pour le modèle
     *
     * @param string $value
     * @param string $column
     * @return string
     */
    protected function generateUniqueSlug(string $value, string $column = 'slug'): string
    {
        $slug = Str::slug($value);
        $originalSlug = $slug;
        $counter = 1;

        // Vérifie l'unicité du slug
        while (static::where($column, $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    /**
     * Boot the trait
     */
    protected static function bootHasSlug()
    {
        static::creating(function ($model) {
            if (empty($model->slug) && !empty($model->getSlugSource())) {
                $model->slug = $model->generateUniqueSlug($model->getSlugSource());
            }
        });

        static::updating(function ($model) {
            if ($model->isDirty($model->getSlugSourceColumn()) && empty($model->slug)) {
                $model->slug = $model->generateUniqueSlug($model->getSlugSource());
            }
        });
    }

    /**
     * Retourne la colonne source pour générer le slug
     * À surcharger dans le modèle si nécessaire
     *
     * @return string
     */
    protected function getSlugSourceColumn(): string
    {
        return 'name';
    }

    /**
     * Retourne la valeur source pour générer le slug
     *
     * @return string|null
     */
    protected function getSlugSource(): ?string
    {
        return $this->{$this->getSlugSourceColumn()};
    }
}
