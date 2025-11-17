<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateGalleryImageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $galleryImage = $this->route('gallery_image');
        return $this->user()->can('update', $galleryImage);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $galleryImageId = $this->route('gallery_image')->id;

        return [
            'name' => ['required', 'string', 'max:255', Rule::unique('gallery_images')->ignore($galleryImageId)],
            'order' => ['required', 'integer', 'min:0'],
            'image' => ['nullable', 'image', 'mimes:jpeg,jpg,png,gif,webp', 'max:5120'], // 5MB max
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Le nom de l\'image est requis.',
            'name.unique' => 'Une image avec ce nom existe déjà.',
            'order.required' => 'L\'ordre est requis.',
            'order.integer' => 'L\'ordre doit être un nombre entier.',
            'order.min' => 'L\'ordre doit être supérieur ou égal à 0.',
            'image.image' => 'Le fichier doit être une image.',
            'image.mimes' => 'L\'image doit être au format JPEG, PNG, GIF ou WebP.',
            'image.max' => 'L\'image ne doit pas dépasser 5 Mo.',
        ];
    }
}
