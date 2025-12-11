<?php

namespace App\Http\Controllers\Pack;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePackRequest;
use App\Http\Requests\UpdatePackRequest;
use App\Models\Pack;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PackController extends Controller
{
    /**
     * Display a listing of the packs.
     */
    public function index(): Response
    {
        $this->authorize('viewAny', Pack::class);

        $packs = Pack::select([
                'id', 'name', 'slug', 'description', 'main_image',
                'price', 'reference_price', 'is_active', 'stock_quantity',
                'created_by', 'updated_by', 'created_at', 'updated_at'
            ])
            ->withCount('products')
            ->with('creator:id,name')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('pack/packList', [
            'packs' => $packs,
        ]);
    }

    /**
     * Show the form for creating a new pack.
     */
    public function create(): Response
    {
        $this->authorize('create', Pack::class);

        // Récupérer les produits disponibles pour le vendeur ou admin avec optimisation
        // Exclure les champs base64 qui ne sont plus utilisés
        $user = Auth::user();
        $productsQuery = Product::select(['id', 'name', 'slug', 'image', 'category_id'])
            ->with([
                'category:id,name',
                'weightVariants' => function ($query) {
                    $query->select(['id', 'product_id', 'weight_value', 'weight_unit', 'price', 'stock_quantity'])
                        ->orderBy('weight_value');
                }
            ]);

        if ($user->role === 'vendeur') {
            $productsQuery->where('created_by', $user->id);
        }

        $products = $productsQuery->orderBy('name')->get();

        return Inertia::render('pack/addPack', [
            'products' => $products,
        ]);
    }

    /**
     * Store a newly created pack in storage.
     */
    public function store(StorePackRequest $request): RedirectResponse
    {
        $this->authorize('create', Pack::class);

        try {
            DB::beginTransaction();

            $data = $request->validated();
            $data['created_by'] = Auth::id();
            $data['updated_by'] = Auth::id();

            // Gérer l'image principale
            if ($request->hasFile('main_image')) {
                $imageData = $this->processMainImage($request->file('main_image'));
                $data['main_image'] = $imageData['path'];
                $data['main_image_data'] = $imageData['base64'];
                $data['main_image_mime_type'] = $imageData['mime_type'];
            }

            // Gérer la galerie d'images (jusqu'à 5)
            if ($request->hasFile('gallery_images')) {
                $galleryImages = $this->processGalleryImages($request->file('gallery_images'));
                $data['gallery_images'] = $galleryImages;
            }

            // Extraire les produits avant de créer le pack
            $products = $data['products'];
            unset($data['products']);

            // Créer le pack
            $pack = Pack::create($data);

            // Attacher les produits avec leurs quantités
            $this->syncPackProducts($pack, $products);

            DB::commit();

            return redirect()->route('packs.index')
                ->with('success', 'Pack créé avec succès.');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->withInput()
                ->with('error', 'Erreur lors de la création du pack: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified pack.
     */
    public function show(Pack $pack): Response
    {
        $this->authorize('view', $pack);

        $pack->load(['products.weightVariants', 'creator', 'updater']);

        return Inertia::render('pack/viewPack', [
            'pack' => $pack,
        ]);
    }

    /**
     * Show the form for editing the specified pack.
     */
    public function edit(Pack $pack): Response
    {
        $this->authorize('update', $pack);

        // Charger les produits du pack avec leurs images (exclure base64)
        $pack->load(['products' => function ($query) {
            $query->select(['products.id', 'products.name', 'products.slug', 'products.image'])
                ->withPivot('quantity');
        }]);

        // Récupérer les produits disponibles avec optimisation (exclure base64)
        $user = Auth::user();
        $productsQuery = Product::select(['id', 'name', 'slug', 'image', 'category_id'])
            ->with([
                'category:id,name',
                'weightVariants' => function ($query) {
                    $query->select(['id', 'product_id', 'weight_value', 'weight_unit', 'price', 'stock_quantity'])
                        ->orderBy('weight_value');
                }
            ]);

        if ($user->role === 'vendeur') {
            $productsQuery->where('created_by', $user->id);
        }

        $products = $productsQuery->orderBy('name')->get();

        return Inertia::render('pack/editPack', [
            'pack' => $pack,
            'products' => $products,
        ]);
    }

    /**
     * Update the specified pack in storage.
     */
    public function update(UpdatePackRequest $request, Pack $pack): RedirectResponse
    {
        $this->authorize('update', $pack);

        try {
            DB::beginTransaction();

            $data = $request->validated();
            $data['updated_by'] = Auth::id();

            // Gérer l'image principale si une nouvelle est uploadée
            if ($request->hasFile('main_image')) {
                // Supprimer l'ancienne image si elle existe
                if ($pack->main_image && Storage::disk('public')->exists($pack->main_image)) {
                    Storage::disk('public')->delete($pack->main_image);
                }

                $imageData = $this->processMainImage($request->file('main_image'));
                $data['main_image'] = $imageData['path'];
                $data['main_image_data'] = $imageData['base64'];
                $data['main_image_mime_type'] = $imageData['mime_type'];
            }

            // Gérer la galerie d'images si de nouvelles sont uploadées
            if ($request->hasFile('gallery_images')) {
                // Supprimer les anciennes images de la galerie
                if ($pack->gallery_images && is_array($pack->gallery_images)) {
                    foreach ($pack->gallery_images as $oldImage) {
                        if (isset($oldImage['path']) && Storage::disk('public')->exists($oldImage['path'])) {
                            Storage::disk('public')->delete($oldImage['path']);
                        }
                    }
                }

                $galleryImages = $this->processGalleryImages($request->file('gallery_images'));
                $data['gallery_images'] = $galleryImages;
            }

            // Extraire les produits
            $products = $data['products'];
            unset($data['products']);

            // Mettre à jour le pack
            $pack->update($data);

            // Synchroniser les produits
            $this->syncPackProducts($pack, $products);

            DB::commit();

            return redirect()->route('packs.index')
                ->with('success', 'Pack mis à jour avec succès.');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->withInput()
                ->with('error', 'Erreur lors de la mise à jour du pack: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified pack from storage.
     */
    public function destroy(Pack $pack): RedirectResponse
    {
        $this->authorize('delete', $pack);

        try {
            DB::beginTransaction();

            // Supprimer l'image principale si elle existe
            if ($pack->main_image && Storage::disk('public')->exists($pack->main_image)) {
                Storage::disk('public')->delete($pack->main_image);
            }

            // Supprimer les images de la galerie si elles existent
            if ($pack->gallery_images && is_array($pack->gallery_images)) {
                foreach ($pack->gallery_images as $image) {
                    if (isset($image['path']) && Storage::disk('public')->exists($image['path'])) {
                        Storage::disk('public')->delete($image['path']);
                    }
                }
            }

            $pack->delete();

            DB::commit();

            return redirect()->route('packs.index')
                ->with('success', 'Pack supprimé avec succès.');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Erreur lors de la suppression du pack: ' . $e->getMessage());
        }
    }

    /**
     * Duplicate the specified pack.
     */
    public function duplicate(Pack $pack): RedirectResponse
    {
        $this->authorize('create', Pack::class);

        try {
            DB::beginTransaction();

            // Créer une copie du pack
            $newPack = $pack->replicate();
            $newPack->name = $pack->name . ' (Copie)';
            $newPack->slug = ''; // Sera généré automatiquement
            $newPack->created_by = Auth::id();
            $newPack->updated_by = Auth::id();
            $newPack->save();

            // Copier les produits associés (sans charger toutes les données)
            $products = $pack->products()->select('products.id')->get();
            foreach ($products as $product) {
                $newPack->products()->attach($product->id, [
                    'quantity' => $product->pivot->quantity
                ]);
            }

            DB::commit();

            return redirect()->route('packs.index')
                ->with('success', 'Pack dupliqué avec succès.');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Erreur lors de la duplication du pack: ' . $e->getMessage());
        }
    }

    /**
     * Traiter l'image principale - sauvegarde sur disque uniquement (plus de base64)
     */
    private function processMainImage(UploadedFile $image): array
    {
        // Utiliser le chemin configurable depuis .env
        $path = config('app.pack_image_path', 'packs');
        $filename = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();

        // Sauvegarder l'image sur disque uniquement
        $storedPath = $image->storeAs($path, $filename, 'public');

        return [
            'path' => $storedPath,
            'base64' => null,
            'mime_type' => null,
        ];
    }

    /**
     * Traiter les images de la galerie (max 5) - sauvegarde sur disque uniquement
     */
    private function processGalleryImages(array $images): array
    {
        $galleryData = [];
        $count = 0;

        $basePath = config('app.pack_image_path', 'packs') . '/gallery';

        foreach ($images as $image) {
            if ($count >= 5) break; // Limite de 5 images

            $filename = time() . '_' . uniqid() . '_' . $count . '.' . $image->getClientOriginalExtension();
            $storedPath = $image->storeAs($basePath, $filename, 'public');

            $galleryData[] = [
                'path' => $storedPath,
                'url' => asset('storage/' . $storedPath),
            ];

            $count++;
        }

        return $galleryData;
    }

    /**
     * Synchroniser les produits du pack avec leurs quantités
     */
    private function syncPackProducts(Pack $pack, array $products): void
    {
        $syncData = [];

        foreach ($products as $product) {
            $syncData[$product['product_id']] = [
                'quantity' => $product['quantity']
            ];
        }

        $pack->products()->sync($syncData);
    }
}
