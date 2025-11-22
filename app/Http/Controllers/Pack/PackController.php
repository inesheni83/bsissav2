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

        $packs = Pack::withCount('products')
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
        $user = Auth::user();
        $productsQuery = Product::select(['id', 'name', 'slug', 'image', 'image_data', 'image_mime_type', 'category_id'])
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

        $pack->load('products:id,name');

        // Récupérer les produits disponibles avec optimisation
        $user = Auth::user();
        $productsQuery = Product::select(['id', 'name', 'slug', 'image', 'image_data', 'image_mime_type', 'category_id'])
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
                $imageData = $this->processMainImage($request->file('main_image'));
                $data['main_image'] = $imageData['path'];
                $data['main_image_data'] = $imageData['base64'];
                $data['main_image_mime_type'] = $imageData['mime_type'];
            }

            // Gérer la galerie d'images si de nouvelles sont uploadées
            if ($request->hasFile('gallery_images')) {
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
            $pack->delete();

            return redirect()->route('packs.index')
                ->with('success', 'Pack supprimé avec succès.');

        } catch (\Exception $e) {
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
     * Traiter l'image principale et la convertir en base64
     */
    private function processMainImage(UploadedFile $image): array
    {
        // Sauvegarder l'image
        $path = $image->store('packs', 'public');

        // Convertir en base64
        $imageContent = file_get_contents($image->getRealPath());
        $base64 = base64_encode($imageContent);
        $mimeType = $image->getMimeType();

        return [
            'path' => $path,
            'base64' => $base64,
            'mime_type' => $mimeType,
        ];
    }

    /**
     * Traiter les images de la galerie (max 5)
     */
    private function processGalleryImages(array $images): array
    {
        $galleryData = [];
        $count = 0;

        foreach ($images as $image) {
            if ($count >= 5) break; // Limite de 5 images

            $path = $image->store('packs/gallery', 'public');
            $imageContent = file_get_contents($image->getRealPath());
            $base64 = base64_encode($imageContent);
            $mimeType = $image->getMimeType();

            $galleryData[] = [
                'path' => $path,
                'base64' => $base64,
                'mime_type' => $mimeType,
                'url' => 'data:' . $mimeType . ';base64,' . $base64,
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
