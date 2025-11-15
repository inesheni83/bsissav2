<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Models\Category;
use App\Services\ProductService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class AddProductController extends Controller
{
    public function __construct(
        private ProductService $productService
    ) {}

    /**
     * Display the product creation form.
     */
    public function create(): Response
    {
        $categories = Category::orderBy('name')->get(['id', 'name']);

        return Inertia::render('product/addProduct', [
            'categories' => $categories
        ]);
    }

    /**
     * Handle product creation.
     */
    public function store(StoreProductRequest $request): RedirectResponse
    {
        try {
            // Préparer les données pour la création
            $data = $request->validated();
            if (Schema::hasColumn('products', 'created_by')) {
                $data['created_by'] = Auth::id();
            }
            if (Schema::hasColumn('products', 'updated_by')) {
                $data['updated_by'] = Auth::id();
            }

            // Créer le produit via le service
            $product = $this->productService->createProduct(
                $data,
                $request->hasFile('image') ? $request->file('image') : null
            );

            return redirect()->route('products.index')
                ->with('success', 'Produit créé avec succès.');

        } catch (\Exception $e) {
            // Logger l'erreur pour le débogage
            \Log::error('Erreur lors de la création du produit: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->back()
                ->with('error', 'Erreur lors de la création du produit: ' . $e->getMessage())
                ->withInput();
        }
    }
}
