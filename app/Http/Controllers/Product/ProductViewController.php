<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class ProductViewController extends Controller
{
    public function show(Product $product): Response
    {
        $product->load(['category', 'weightVariants']);

        // Récupérer les produits de la même catégorie (3 produits maximum, excluant le produit actuel)
        $relatedProducts = Product::where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->with(['weightVariants'])
            ->limit(3)
            ->get()
            ->map(fn($relatedProduct) => [
                'id' => $relatedProduct->id,
                'name' => $relatedProduct->name,
                'slug' => $relatedProduct->slug,
                'description' => $relatedProduct->description,
                'image' => $relatedProduct->image,
                'is_featured' => $relatedProduct->is_featured,
                'weight_variants' => $relatedProduct->weightVariants->map(fn($variant) => [
                    'id' => $variant->id,
                    'weight_value' => $variant->weight_value,
                    'weight_unit' => $variant->weight_unit,
                    'price' => (float) $variant->price,
                    'promotional_price' => $variant->promotional_price ? (float) $variant->promotional_price : null,
                    'stock_quantity' => $variant->stock_quantity,
                    'is_available' => $variant->is_available,
                ]),
            ]);

        return Inertia::render('product/productShow', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'detailed_description' => $product->detailed_description,
                'ingredients' => $product->ingredients,
                'image' => $product->image,
                'category' => $product->category?->only(['id', 'name']),
                'is_featured' => $product->is_featured,
                'weight_variants' => $product->weightVariants->map(fn($variant) => [
                    'id' => $variant->id,
                    'weight_value' => $variant->weight_value,
                    'weight_unit' => $variant->weight_unit,
                    'price' => (float) $variant->price,
                    'promotional_price' => $variant->promotional_price ? (float) $variant->promotional_price : null,
                    'stock_quantity' => $variant->stock_quantity,
                    'is_available' => $variant->is_available,
                ]),
            ],
            'relatedProducts' => $relatedProducts,
        ]);
    }
}

