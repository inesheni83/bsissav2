<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductWeightVariant;
use Illuminate\Support\Facades\DB;

class ProductWeightVariantService
{
    /**
     * Sync weight variants for a product.
     * Creates, updates, or deletes variants based on the provided data.
     *
     * @param Product $product
     * @param array $variantsData Array of variant data with keys: weight_value, weight_unit, price, promotional_price, stock_quantity, is_available
     * @param int $userId The ID of the user performing the operation
     * @return void
     */
    public function syncVariants(Product $product, array $variantsData, int $userId): void
    {
        DB::transaction(function () use ($product, $variantsData, $userId) {
            $existingVariantIds = [];

            foreach ($variantsData as $variantData) {
                // If id is provided, update existing variant
                if (isset($variantData['id']) && $variantData['id']) {
                    $variant = ProductWeightVariant::where('id', $variantData['id'])
                        ->where('product_id', $product->id)
                        ->first();

                    if ($variant) {
                        $variant->update([
                            'weight_value' => $variantData['weight_value'],
                            'weight_unit' => $variantData['weight_unit'],
                            'price' => $variantData['price'],
                            'promotional_price' => $variantData['promotional_price'] ?? null,
                            'stock_quantity' => $variantData['stock_quantity'] ?? 0,
                            'is_available' => $variantData['is_available'] ?? true,
                            'updated_by' => $userId,
                        ]);
                        $existingVariantIds[] = $variant->id;
                    }
                } else {
                    // Create new variant
                    $variant = ProductWeightVariant::create([
                        'product_id' => $product->id,
                        'weight_value' => $variantData['weight_value'],
                        'weight_unit' => $variantData['weight_unit'],
                        'price' => $variantData['price'],
                        'promotional_price' => $variantData['promotional_price'] ?? null,
                        'stock_quantity' => $variantData['stock_quantity'] ?? 0,
                        'is_available' => $variantData['is_available'] ?? true,
                        'created_by' => $userId,
                        'updated_by' => $userId,
                    ]);
                    $existingVariantIds[] = $variant->id;
                }
            }

            // Delete variants that are not in the provided data
            ProductWeightVariant::where('product_id', $product->id)
                ->whereNotIn('id', $existingVariantIds)
                ->delete();
        });
    }

    /**
     * Create a single weight variant for a product.
     *
     * @param Product $product
     * @param array $variantData
     * @param int $userId
     * @return ProductWeightVariant
     */
    public function createVariant(Product $product, array $variantData, int $userId): ProductWeightVariant
    {
        return ProductWeightVariant::create([
            'product_id' => $product->id,
            'weight_value' => $variantData['weight_value'],
            'weight_unit' => $variantData['weight_unit'],
            'price' => $variantData['price'],
            'promotional_price' => $variantData['promotional_price'] ?? null,
            'stock_quantity' => $variantData['stock_quantity'] ?? 0,
            'is_available' => $variantData['is_available'] ?? true,
            'created_by' => $userId,
            'updated_by' => $userId,
        ]);
    }

    /**
     * Update a weight variant.
     *
     * @param ProductWeightVariant $variant
     * @param array $variantData
     * @param int $userId
     * @return ProductWeightVariant
     */
    public function updateVariant(ProductWeightVariant $variant, array $variantData, int $userId): ProductWeightVariant
    {
        $variant->update([
            'weight_value' => $variantData['weight_value'] ?? $variant->weight_value,
            'weight_unit' => $variantData['weight_unit'] ?? $variant->weight_unit,
            'price' => $variantData['price'] ?? $variant->price,
            'promotional_price' => $variantData['promotional_price'] ?? $variant->promotional_price,
            'stock_quantity' => $variantData['stock_quantity'] ?? $variant->stock_quantity,
            'is_available' => $variantData['is_available'] ?? $variant->is_available,
            'updated_by' => $userId,
        ]);

        return $variant->fresh();
    }

    /**
     * Delete a weight variant.
     *
     * @param ProductWeightVariant $variant
     * @return bool
     */
    public function deleteVariant(ProductWeightVariant $variant): bool
    {
        return $variant->delete();
    }

    /**
     * Get all variants for a product.
     *
     * @param Product $product
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getProductVariants(Product $product)
    {
        return $product->weightVariants()
            ->orderBy('weight_value')
            ->orderBy('weight_unit')
            ->get();
    }

    /**
     * Validate that at least one variant exists or is being created.
     *
     * @param array $variantsData
     * @return bool
     */
    public function validateMinimumVariants(array $variantsData): bool
    {
        return count($variantsData) > 0;
    }

    /**
     * Validate that weight/unit combinations are unique within the product.
     *
     * @param array $variantsData
     * @return bool
     */
    public function validateUniqueWeights(array $variantsData): bool
    {
        $weights = [];

        foreach ($variantsData as $variant) {
            $key = $variant['weight_value'] . '_' . $variant['weight_unit'];
            if (in_array($key, $weights)) {
                return false;
            }
            $weights[] = $key;
        }

        return true;
    }

    /**
     * Update stock quantity for a variant.
     *
     * @param ProductWeightVariant $variant
     * @param int $quantity
     * @return ProductWeightVariant
     */
    public function updateStock(ProductWeightVariant $variant, int $quantity): ProductWeightVariant
    {
        $variant->update([
            'stock_quantity' => max(0, $quantity),
        ]);

        return $variant->fresh();
    }

    /**
     * Toggle variant availability.
     *
     * @param ProductWeightVariant $variant
     * @return ProductWeightVariant
     */
    public function toggleAvailability(ProductWeightVariant $variant): ProductWeightVariant
    {
        $variant->update([
            'is_available' => !$variant->is_available,
        ]);

        return $variant->fresh();
    }
}
