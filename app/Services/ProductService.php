<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class ProductService
{
    protected ProductWeightVariantService $weightVariantService;

    public function __construct(ProductWeightVariantService $weightVariantService)
    {
        $this->weightVariantService = $weightVariantService;
    }

    /**
     * Create a product with optional image upload and weight variants.
     */
    public function createProduct(array $data, ?UploadedFile $image = null): Product
    {
        return DB::transaction(function () use ($data, $image) {
            if ($image) {
                // Save image to database as base64
                $imageData = $this->convertImageToBase64($image);
                $data['image'] = $this->handleImageUpload($image); // Keep path for backwards compatibility
                $data['image_data'] = $imageData['base64'];
                $data['image_mime_type'] = $imageData['mime_type'];
            }

            // Extract weight variants data before creating product
            $weightVariants = $data['weight_variants'] ?? [];
            unset($data['weight_variants']);

            $product = Product::create($data);

            // Sync weight variants if provided
            if (!empty($weightVariants)) {
                $this->weightVariantService->syncVariants($product, $weightVariants, auth()->id());
            }

            return $product->load(['category', 'weightVariants']);
        });
    }

    /**
     * Update an existing product and replace its image if a new one is provided.
     */
    public function updateProduct(Product $product, array $data, ?UploadedFile $image = null): Product
    {
        return DB::transaction(function () use ($product, $data, $image) {
            if ($image instanceof UploadedFile) {
                // Delete old image file if exists
                if ($product->image && Storage::disk('public')->exists($product->image)) {
                    Storage::disk('public')->delete($product->image);
                }

                // Save new image to database as base64
                $imageData = $this->convertImageToBase64($image);
                $data['image'] = $image->store('products', 'public'); // Keep path for backwards compatibility
                $data['image_data'] = $imageData['base64'];
                $data['image_mime_type'] = $imageData['mime_type'];
            } else {
                unset($data['image']);
                unset($data['image_data']);
                unset($data['image_mime_type']);
            }

            // Extract weight variants data before updating product
            $weightVariants = $data['weight_variants'] ?? null;
            unset($data['weight_variants']);

            $product->update($data);

            // Sync weight variants if provided
            if ($weightVariants !== null) {
                $this->weightVariantService->syncVariants($product, $weightVariants, auth()->id());
            }

            return $product->fresh(['category', 'weightVariants']);
        });
    }

    /**
     * Delete a product and its stored image.
     */
    public function deleteProduct(Product $product): bool
    {
        return DB::transaction(function () use ($product) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }

            return $product->delete();
        });
    }

    /**
     * Toggle the featured flag of a product.
     */
    public function toggleFeatured(Product $product): Product
    {
        return DB::transaction(function () use ($product) {
            // Récupérer le produit avec un verrou pour éviter les conflits de concurrence
            $latestProduct = Product::lockForUpdate()->findOrFail($product->id);

            // Inverser le statut is_featured directement
            $latestProduct->is_featured = !$latestProduct->is_featured;
            $latestProduct->updated_by = auth()->id();
            $latestProduct->save();

            return $latestProduct->fresh(['category', 'weightVariants']);
        });
    }

    /**
     * Store an uploaded product image and return its path.
     */
    private function handleImageUpload(UploadedFile $image): string
    {
        $filename = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();

        return $image->storeAs('products', $filename, 'public');
    }

    /**
     * Convert an uploaded image to base64 for database storage.
     */
    private function convertImageToBase64(UploadedFile $image): array
    {
        $imageContent = file_get_contents($image->getRealPath());
        $base64 = base64_encode($imageContent);
        $mimeType = $image->getMimeType();

        return [
            'base64' => $base64,
            'mime_type' => $mimeType,
        ];
    }

    /**
     * Build a filtered product query.
     */
    public function getFilteredProducts(array $filters = [])
    {
        $query = Product::with(['category', 'weightVariants'])->latest();

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (!empty($filters['featured'])) {
            $query->where('is_featured', true);
        }

        if (($filters['stock_status'] ?? null) === 'in_stock') {
            $query->inStock();
        } elseif (($filters['stock_status'] ?? null) === 'out_of_stock') {
            $query->whereDoesntHave('weightVariants', function ($q) {
                $q->where('stock_quantity', '>', 0)->where('is_available', true);
            });
        } elseif (!empty($filters['in_stock'])) {
            $query->inStock();
        }

        return $query;
    }

    /**
     * Gather simple product statistics.
     */
    public function getProductStats(): array
    {
        return [
            'total_products' => Product::count(),
            'featured_products' => Product::where('is_featured', true)->count(),
            'in_stock_products' => Product::inStock()->count(),
            'out_of_stock_products' => Product::whereDoesntHave('weightVariants', function ($q) {
                $q->where('stock_quantity', '>', 0)->where('is_available', true);
            })->count(),
            'total_categories' => Category::count(),
        ];
    }
}
