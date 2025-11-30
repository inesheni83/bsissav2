<?php

namespace App\Http\Controllers\Pack;

use App\Http\Controllers\Controller;
use App\Models\Pack;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PackViewController extends Controller
{
    /**
     * Display a listing of active packs for public view.
     */
    public function index(Request $request): Response
    {
        // Exclure les colonnes de données binaires volumineuses (base64)
        $query = Pack::query()
            ->select(['id', 'name', 'slug', 'description', 'main_image', 'price', 'reference_price', 'is_active', 'stock_quantity', 'created_at'])
            ->where('is_active', true)
            ->where('stock_quantity', '>', 0)
            ->withCount('products');

        // Filter by price range
        if ($request->filled('price_range')) {
            $priceRange = $request->price_range;

            switch ($priceRange) {
                case '0-50':
                    $query->where('price', '>=', 0)->where('price', '<=', 50);
                    break;
                case '50-100':
                    $query->where('price', '>', 50)->where('price', '<=', 100);
                    break;
                case '100-150':
                    $query->where('price', '>', 100)->where('price', '<=', 150);
                    break;
                case '150+':
                    $query->where('price', '>', 150);
                    break;
            }
        }

        // Filter by product count
        if ($request->filled('product_count')) {
            $productCount = $request->product_count;

            switch ($productCount) {
                case '2-3':
                    $query->has('products', '>=', 2)->has('products', '<=', 3);
                    break;
                case '4-5':
                    $query->has('products', '>=', 4)->has('products', '<=', 5);
                    break;
                case '6+':
                    $query->has('products', '>=', 6);
                    break;
            }
        }

        // Sorting
        if ($request->filled('sort_by')) {
            $sortBy = $request->sort_by;

            switch ($sortBy) {
                case 'price_asc':
                    $query->orderByRaw('CAST(price AS DECIMAL(10,2)) ASC');
                    break;
                case 'price_desc':
                    $query->orderByRaw('CAST(price AS DECIMAL(10,2)) DESC');
                    break;
                case 'newest':
                    $query->orderBy('created_at', 'desc');
                    break;
                case 'popular':
                    // For now, order by stock (assuming popular = more stock)
                    // Later you can add a popularity score or order count
                    $query->orderBy('stock_quantity', 'desc');
                    break;
                default:
                    $query->orderBy('created_at', 'desc');
            }
        } else {
            // Default sorting if no sort_by parameter
            $query->orderBy('created_at', 'desc');
        }

        $packs = $query->paginate(12)->withQueryString();

        // Get total count for display
        $totalPacks = Pack::where('is_active', true)
            ->where('stock_quantity', '>', 0)
            ->count();

        return Inertia::render('pack/public/index', [
            'packs' => $packs,
            'totalPacks' => $totalPacks,
            'filters' => [
                'price_range' => $request->price_range,
                'product_count' => $request->product_count,
                'sort_by' => $request->sort_by ?? 'newest',
            ],
        ]);
    }

    /**
     * Display the specified pack details.
     */
    public function show(Pack $pack): Response
    {
        abort_unless($pack->is_active, 404);

        $pack->load(['products.weightVariants', 'products.category']);

        // Get similar packs (same price range, active, in stock, excluding current pack)
        $priceMin = $pack->price * 0.8; // -20%
        $priceMax = $pack->price * 1.2; // +20%

        $similarPacks = Pack::select(['id', 'name', 'slug', 'description', 'main_image', 'price', 'reference_price', 'is_active', 'stock_quantity', 'created_at'])
            ->where('is_active', true)
            ->where('stock_quantity', '>', 0)
            ->where('id', '!=', $pack->id)
            ->whereBetween('price', [$priceMin, $priceMax])
            ->withCount('products')
            ->limit(3)
            ->get();

        return Inertia::render('pack/public/show', [
            'pack' => $pack,
            'similarPacks' => $similarPacks,
        ]);
    }
}
