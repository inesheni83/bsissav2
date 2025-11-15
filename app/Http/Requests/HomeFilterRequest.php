<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class HomeFilterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'search' => ['sometimes', 'nullable', 'string', 'max:100'],
            'category_id' => ['sometimes', 'nullable', 'integer', 'exists:categories,id'],
            'featured' => ['sometimes', 'nullable', 'in:1'],
            'in_stock' => ['sometimes', 'nullable', 'in:1'],
        ];
    }
}

