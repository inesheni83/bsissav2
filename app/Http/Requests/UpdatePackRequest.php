<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePackRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $packId = $this->route('pack')?->id ?? $this->route('pack');

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:packs,slug,' . $packId],
            'description' => ['required', 'string'],
            'main_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:5120'],
            'gallery_images.*' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:5120'],
            'price' => ['required', 'numeric', 'min:0'],
            'reference_price' => ['nullable', 'numeric', 'min:0', 'gt:price'],
            'is_active' => ['boolean'],
            'stock_quantity' => ['required', 'integer', 'min:0'],
            'products' => ['required', 'array', 'min:1'],
            'products.*.product_id' => ['required', 'exists:products,id'],
            'products.*.quantity' => ['required', 'integer', 'min:1'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Le nom du pack est obligatoire.',
            'description.required' => 'La description du pack est obligatoire.',
            'main_image.image' => 'Le fichier doit être une image.',
            'main_image.mimes' => 'L\'image doit être au format JPG ou PNG.',
            'main_image.max' => 'L\'image ne doit pas dépasser 5MB.',
            'gallery_images.*.image' => 'Chaque fichier de la galerie doit être une image.',
            'gallery_images.*.mimes' => 'Les images de la galerie doivent être au format JPG ou PNG.',
            'gallery_images.*.max' => 'Les images de la galerie ne doivent pas dépasser 5MB chacune.',
            'price.required' => 'Le prix est obligatoire.',
            'price.numeric' => 'Le prix doit être un nombre.',
            'price.min' => 'Le prix ne peut pas être négatif.',
            'reference_price.gt' => 'Le prix de référence doit être supérieur au prix du pack.',
            'stock_quantity.required' => 'La quantité en stock est obligatoire.',
            'products.required' => 'Au moins un produit doit être ajouté au pack.',
            'products.min' => 'Au moins un produit doit être ajouté au pack.',
            'products.*.product_id.required' => 'L\'identifiant du produit est requis.',
            'products.*.product_id.exists' => 'Le produit sélectionné n\'existe pas.',
            'products.*.quantity.required' => 'La quantité est requise pour chaque produit.',
            'products.*.quantity.min' => 'La quantité doit être au moins 1.',
        ];
    }
}
