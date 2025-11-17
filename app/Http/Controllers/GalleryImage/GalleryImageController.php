<?php

namespace App\Http\Controllers\GalleryImage;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreGalleryImageRequest;
use App\Http\Requests\UpdateGalleryImageRequest;
use App\Models\GalleryImage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class GalleryImageController extends Controller
{
    /**
     * Display a listing of gallery images.
     */
    public function index(): Response
    {
        $this->authorize('viewAny', GalleryImage::class);

        $images = GalleryImage::ordered()
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('galleryImage/galleryImageList', [
            'images' => $images,
        ]);
    }

    /**
     * Show the form for creating a new gallery image.
     */
    public function create(): Response
    {
        $this->authorize('create', GalleryImage::class);

        return Inertia::render('galleryImage/addGalleryImage');
    }

    /**
     * Store a newly created gallery image in storage.
     */
    public function store(StoreGalleryImageRequest $request): RedirectResponse
    {
        try {
            $data = $request->validated();
            $data['created_by'] = Auth::id();
            $data['updated_by'] = Auth::id();

            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageData = $this->convertImageToBase64($image);
                $data['image'] = $this->handleImageUpload($image);
                $data['image_data'] = $imageData['base64'];
                $data['image_mime_type'] = $imageData['mime_type'];
            }

            GalleryImage::create($data);

            return redirect()->route('gallery-images.index')
                ->with('success', 'Image ajoutée avec succès.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Erreur lors de l\'ajout de l\'image. Veuillez réessayer.');
        }
    }

    /**
     * Show the form for editing the specified gallery image.
     */
    public function edit(GalleryImage $galleryImage): Response
    {
        $this->authorize('update', $galleryImage);

        return Inertia::render('galleryImage/editGalleryImage', [
            'galleryImage' => $galleryImage,
        ]);
    }

    /**
     * Update the specified gallery image in storage.
     */
    public function update(UpdateGalleryImageRequest $request, GalleryImage $galleryImage): RedirectResponse
    {
        try {
            $data = $request->validated();
            $data['updated_by'] = Auth::id();

            if ($request->hasFile('image')) {
                // Delete old image file if exists
                if ($galleryImage->image && Storage::disk('public')->exists($galleryImage->image)) {
                    Storage::disk('public')->delete($galleryImage->image);
                }

                // Save new image to database as base64
                $image = $request->file('image');
                $imageData = $this->convertImageToBase64($image);
                $data['image'] = $this->handleImageUpload($image);
                $data['image_data'] = $imageData['base64'];
                $data['image_mime_type'] = $imageData['mime_type'];
            }

            $galleryImage->update($data);

            return redirect()->route('gallery-images.index')
                ->with('success', 'Image mise à jour avec succès.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Erreur lors de la mise à jour de l\'image. Veuillez réessayer.');
        }
    }

    /**
     * Remove the specified gallery image from storage.
     */
    public function destroy(GalleryImage $galleryImage): RedirectResponse
    {
        $this->authorize('delete', $galleryImage);

        try {
            // Delete image file if exists
            if ($galleryImage->image && Storage::disk('public')->exists($galleryImage->image)) {
                Storage::disk('public')->delete($galleryImage->image);
            }

            $galleryImage->delete();

            return redirect()->route('gallery-images.index')
                ->with('success', 'Image supprimée avec succès.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Erreur lors de la suppression de l\'image. Veuillez réessayer.');
        }
    }

    /**
     * Store an uploaded image and return its path.
     */
    private function handleImageUpload(UploadedFile $image): string
    {
        $filename = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
        return $image->storeAs('gallery', $filename, 'public');
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
}
