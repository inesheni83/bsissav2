<?php

namespace App\Support;

final class TunisiaRegions
{
    private const DEFAULT_REGIONS = [
        'Ariana',
        'Béja',
        'Ben Arous',
        'Bizerte',
        'Gabès',
        'Gafsa',
        'Jendouba',
        'Kairouan',
        'Kasserine',
        'Kébili',
        'Le Kef',
        'Mahdia',
        'La Manouba',
        'Médenine',
        'Monastir',
        'Nabeul',
        'Sfax',
        'Sidi Bouzid',
        'Siliana',
        'Sousse',
        'Tataouine',
        'Tozeur',
        'Tunis',
        'Zaghouan',
    ];

    public static function all(): array
    {
        $regions = config('checkout.tunisia_regions');

        if (is_array($regions) && !empty($regions)) {
            return $regions;
        }

        return self::DEFAULT_REGIONS;
    }
}
