<?php

namespace App\Http\Controllers;

use App\Services\ProductService;
use App\Services\SiteSettingsService;
use App\Models\Category;
use App\Http\Requests\HomeFilterRequest;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __construct(
        private ProductService $productService,
        private SiteSettingsService $siteSettingsService
    ) {
    }

    public function index(HomeFilterRequest $request): Response
    {
        $filters = $request->validated();

        // Forcer l'affichage uniquement des produits en vedette sur la page d'accueil
        // SAUF si une recherche est effectuée, dans ce cas afficher tous les produits correspondants
        if (empty($filters['search'])) {
            $filters['featured'] = '1';
        }

        $productsQuery = $this->productService->getFilteredProducts($filters);
        $products = $productsQuery->paginate(12)->withQueryString();

        // Formater les données des produits avec les weight variants
        $products->getCollection()->transform(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'image' => $product->image,
                'image_url' => $product->image_url,
                'price' => (float) $product->price,
                'promotional_price' => $product->promotional_price ? (float) $product->promotional_price : null,
                'category' => $product->category?->only(['id', 'name']),
                'is_featured' => $product->is_featured,
                'stock_quantity' => $product->stock_quantity,
                'weight_variants' => $product->weightVariants->map(fn($variant) => [
                    'id' => $variant->id,
                    'weight_value' => $variant->weight_value,
                    'weight_unit' => $variant->weight_unit,
                    'price' => (float) $variant->price,
                    'promotional_price' => $variant->promotional_price ? (float) $variant->promotional_price : null,
                    'stock_quantity' => $variant->stock_quantity,
                    'is_available' => $variant->is_available,
                ]),
            ];
        });

        $categories = Cache::remember('home_categories_list', 60, function () {
            return Category::orderBy('name')->get(['id', 'name']);
        });

        $siteSettings = $this->siteSettingsService->getSettings();

        return Inertia::render('homepage', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $filters,
            'siteSettings' => [
                'site_name' => $siteSettings->site_name,
                'contact_email' => $siteSettings->contact_email,
                'contact_phone' => $siteSettings->contact_phone,
                'physical_address' => $siteSettings->physical_address,
                'facebook_url' => $siteSettings->facebook_url,
                'instagram_url' => $siteSettings->instagram_url,
                'twitter_url' => $siteSettings->twitter_url,
                'linkedin_url' => $siteSettings->linkedin_url,
                'youtube_url' => $siteSettings->youtube_url,
            ],
        ]);
    }
}
