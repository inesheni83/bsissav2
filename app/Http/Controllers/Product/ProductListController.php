<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Services\ProductService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProductListController extends Controller
{
    public function __construct(
        private ProductService $productService
    ) {}

    /**
     * Display the product list.
     */
    public function index(Request $request): Response
    {
        // Récupérer les filtres nettoyés
        $filters = $request->only(['search', 'category_id', 'featured', 'in_stock', 'stock_status']);

        // Utiliser le service pour récupérer les produits filtrés
        $productsQuery = $this->productService->getFilteredProducts($filters);

        $products = $productsQuery->paginate(12)->withQueryString();
        $categories = Category::orderBy('name')->get(['id', 'name']);

        return Inertia::render('product/productList', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $filters,
            'stats' => $this->productService->getProductStats()
        ]);
    }

    /**
     * Show a specific product.
     */
    public function show(Product $product): Response
    {
        $product->load(['category', 'variants', 'creator']);

        return Inertia::render('product/productShow', [
            'product' => $product
        ]);
    }

    /**
     * Get products by category.
     */
    public function byCategory(Category $category): Response
    {
        $products = Product::where('category_id', $category->id)
            ->with('category')
            ->latest()
            ->paginate(12);

        $categories = Category::orderBy('name')->get(['id', 'name']);

        return Inertia::render('product/productList', [
            'products' => $products,
            'categories' => $categories,
            'currentCategory' => $category,
            'filters' => ['category_id' => $category->id]
        ]);
    }
}
