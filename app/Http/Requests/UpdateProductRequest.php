<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'alpha_dash'],
            'description' => ['nullable', 'string', 'max:2000'],
            'detailed_description' => ['nullable', 'string'],
            'image' => [
                'nullable',
                'file',
                'image',
                'max:5120', // 5MB max
                'mimes:jpeg,png,jpg,gif,webp',
                'dimensions:min_width=100,min_height=100,max_width=2000,max_height=2000'
            ],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'is_featured' => ['boolean'],

            // Détails complémentaires
            'ingredients' => ['nullable', 'string', 'max:1000'],
            'marketing_tags' => ['nullable', 'string', 'max:500'],

            // Valeurs nutritionnelles
            'calories_kcal' => ['nullable', 'numeric', 'min:0', 'max:9999.9'],
            'protein_g' => ['nullable', 'numeric', 'min:0', 'max:999.9'],
            'carbs_g' => ['nullable', 'numeric', 'min:0', 'max:999.9'],
            'fat_g' => ['nullable', 'numeric', 'min:0', 'max:999.9'],
            'fiber_g' => ['nullable', 'numeric', 'min:0', 'max:999.9'],

            // Weight variants
            'weight_variants' => ['required', 'array', 'min:1'],
            'weight_variants.*.id' => ['nullable', 'integer', 'exists:product_weight_variants,id'],
            'weight_variants.*.weight_value' => ['required', 'integer', 'min:1', 'max:9999'],
            'weight_variants.*.weight_unit' => ['required', 'string', 'in:g,kg'],
            'weight_variants.*.price' => ['required', 'numeric', 'min:0', 'max:999999.99'],
            'weight_variants.*.promotional_price' => ['nullable', 'numeric', 'min:0', 'max:999999.99'],
            'weight_variants.*.stock_quantity' => ['nullable', 'integer', 'min:0', 'max:999999'],
            'weight_variants.*.is_available' => ['boolean'],
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Validate unique weight combinations
            $variants = $this->input('weight_variants', []);
            $weights = [];

            foreach ($variants as $index => $variant) {
                if (!isset($variant['weight_value']) || !isset($variant['weight_unit'])) {
                    continue;
                }

                $key = $variant['weight_value'] . '_' . $variant['weight_unit'];
                if (in_array($key, $weights)) {
                    $validator->errors()->add(
                        "weight_variants.{$index}.weight_value",
                        "Cette combinaison de poids et d'unité existe déjà pour ce produit."
                    );
                } else {
                    $weights[] = $key;
                }
            }
        });
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Le nom du produit est obligatoire.',
            'image.max' => 'L\'image ne doit pas dépasser 5MB.',
            'image.dimensions' => 'L\'image doit faire au moins 100x100px et au maximum 2000x2000px.',
            'category_id.required' => 'La catégorie est obligatoire.',
            'category_id.integer' => 'La catégorie sélectionnée est invalide.',
            'weight_variants.required' => 'Au moins une déclinaison de poids est obligatoire.',
            'weight_variants.min' => 'Au moins une déclinaison de poids est obligatoire.',
            'weight_variants.*.weight_value.required' => 'La valeur du poids est obligatoire.',
            'weight_variants.*.weight_unit.required' => 'L\'unité du poids est obligatoire.',
            'weight_variants.*.weight_unit.in' => 'L\'unité doit être g ou kg.',
            'weight_variants.*.price.required' => 'Le prix est obligatoire.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'name' => 'nom du produit',
            'category_id' => 'catégorie',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Nettoyer et préparer les données avant validation
        $this->merge([
            'is_featured' => $this->boolean('is_featured', false),
            'category_id' => $this->filled('category_id') ? (int) $this->input('category_id') : null,
        ]);
    }
}
