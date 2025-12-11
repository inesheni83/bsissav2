<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use App\Models\Category;
use App\Services\ProductService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function __construct(
        private ProductService $productService
    ) {}

    /**
     * Display the specified product for editing.
     */
    public function edit(Product $product): Response
    {
        // Vérifier l'autorisation
        $this->authorize('update', $product);

        // Mettre en cache la liste des catégories pour améliorer les performances.
        // Le cache est invalidé toutes les 60 minutes ou si une catégorie est modifiée.
        $categories = Cache::remember('categories_list', 3600, function () {
            return Category::orderBy('name')->get(['id', 'name']);
        });

        // Charger les relations et s'assurer que tous les champs sont présents
        $product->load(['category', 'weightVariants']);

        return Inertia::render('product/editProduct', [
            'product' => $product,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified product in storage.
     */
    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        // Vérifier l'autorisation
        $this->authorize('update', $product);

        try {
            // Préparer les données pour la mise à jour
            $data = $request->validated();
            if (Schema::hasColumn('products', 'updated_by')) {
                $data['updated_by'] = Auth::id();
            }

            // Mettre à jour le produit via le service
            $this->productService->updateProduct(
                $product,
                $data,
                $request->hasFile('image') ? $request->file('image') : null
            );

            return redirect()->route('products.index')
                ->with('success', 'Produit mis à jour avec succès.');

        } catch (\Illuminate\Database\QueryException $e) {
            \Log::error('Database error updating product: ' . $e->getMessage(), [
                'product_id' => $product->id,
                'user_id' => Auth::id(),
            ]);

            return redirect()->back()
                ->withInput()
                ->with('error', 'Erreur de base de données lors de la mise à jour. Veuillez réessayer.');

        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()
                ->withInput()
                ->withErrors($e->errors())
                ->with('error', 'Les données fournies ne sont pas valides.');

        } catch (\Exception $e) {
            \Log::error('Error updating product: ' . $e->getMessage(), [
                'product_id' => $product->id,
                'user_id' => Auth::id(),
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()->back()
                ->withInput()
                ->with('error', 'Erreur lors de la mise à jour du produit. Veuillez réessayer.');
        }
    }

    /**
     * Remove the specified product from storage.
     */
    public function destroy(Product $product): RedirectResponse
    {
        // Vérifier l'autorisation
        $this->authorize('delete', $product);

        try {
            $this->productService->deleteProduct($product);

            return redirect()->route('products.index')
                ->with('success', 'Produit supprimé avec succès.');

        } catch (\Illuminate\Database\QueryException $e) {
            \Log::error('Database error deleting product: ' . $e->getMessage(), [
                'product_id' => $product->id,
                'user_id' => Auth::id(),
            ]);

            return redirect()->back()
                ->with('error', 'Impossible de supprimer ce produit. Il est peut-être utilisé dans des commandes.');

        } catch (\Exception $e) {
            \Log::error('Error deleting product: ' . $e->getMessage(), [
                'product_id' => $product->id,
                'user_id' => Auth::id(),
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()->back()
                ->with('error', 'Erreur lors de la suppression du produit. Veuillez réessayer.');
        }
    }

    /**
     * Toggle featured status of a product.
     */
    public function toggleFeatured(Product $product): RedirectResponse
    {
        // Vérifier l'autorisation
        $this->authorize('toggleFeatured', $product);

        try {
            $updatedProduct = $this->productService->toggleFeatured($product);

            $message = $updatedProduct->is_featured
                ? 'Produit mis en vedette avec succès.'
                : 'Produit retiré de la vedette avec succès.';

            return redirect()->route('products.index')->with('success', $message);

        } catch (\Illuminate\Database\QueryException $e) {
            \Log::error('Database error toggling featured status: ' . $e->getMessage(), [
                'product_id' => $product->id,
                'user_id' => Auth::id(),
            ]);

            return redirect()->back()
                ->with('error', 'Erreur de base de données lors de la modification du statut.');

        } catch (\Exception $e) {
            \Log::error('Error toggling featured status: ' . $e->getMessage(), [
                'product_id' => $product->id,
                'user_id' => Auth::id(),
            ]);

            return redirect()->back()
                ->with('error', 'Erreur lors de la modification du statut du produit.');
        }
    }
}
