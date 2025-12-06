<?php

namespace App\Http\Controllers;

use App\Services\ProductService;
use App\Services\SiteSettingsService;
use App\Services\DeliveryFeeService;
use App\Services\CartService;
use App\Models\Category;
use App\Models\GalleryImage;
use App\Http\Requests\HomeFilterRequest;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __construct(
        private ProductService $productService,
        private SiteSettingsService $siteSettingsService,
        private DeliveryFeeService $deliveryFeeService,
        private CartService $cartService
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

        // Récupérer les produits avec select explicite pour exclure les champs lourds
        $productsQuery = $this->productService->getFilteredProducts($filters);

        // Exclure les champs image_data et image_mime_type qui ne sont plus utilisés
        $productsQuery->select([
            'id', 'name', 'slug', 'description', 'image', 'category_id',
            'is_featured', 'created_at', 'updated_at'
        ]);

        $products = $productsQuery->paginate(12)->withQueryString();

        // Formater les données des produits avec les weight variants
        // Plus de base64 - les images sont sur disque, donc cache possible
        $products->getCollection()->transform(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'image' => $product->image,
                'image_url' => $product->image_url,
                'category' => $product->category?->only(['id', 'name']),
                'is_featured' => $product->is_featured,
                'weight_variants' => $product->weightVariants
                    ->sortBy(function ($variant) {
                        // Pré-trier les variantes par poids côté serveur
                        return $variant->weight_unit === 'kg'
                            ? $variant->weight_value * 1000
                            : $variant->weight_value;
                    })
                    ->values()
                    ->map(fn($variant) => [
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

        $categories = Cache::remember('home_categories_list', 3600, function () {
            return Category::orderBy('name')->get(['id', 'name']);
        });

        // Récupérer les images de la galerie pour le carrousel hero
        $galleryImages = Cache::remember('home_gallery_images', 3600, function () {
            return GalleryImage::ordered()
                ->get()
                ->map(function ($image) {
                    return [
                        'id' => $image->id,
                        'name' => $image->name,
                        'image_url' => $image->image_url,
                    ];
                });
        });

        $siteSettings = $this->siteSettingsService->getSettings();

        // Calculer les frais de livraison uniquement si le panier contient des items
        // Cela évite des requêtes inutiles pour les utilisateurs sans panier
        $deliveryInfo = null;
        if (session()->has('cart_items_count') && session('cart_items_count') > 0) {
            $summary = $this->cartService->getSummary();
            $deliveryInfo = $this->deliveryFeeService->calculateDeliveryFee($summary['subtotal']);
        }

        return Inertia::render('homepage', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $filters,
            'galleryImages' => $galleryImages,
            'deliveryInfo' => $deliveryInfo,
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
