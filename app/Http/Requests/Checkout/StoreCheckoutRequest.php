<?php

namespace App\Http\Requests\Checkout;

use App\Support\TunisiaRegions;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCheckoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $regions = TunisiaRegions::all();

        return [
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:255'],
            'address' => ['required', 'string', 'max:255'],
            'country' => ['required', 'string', 'max:120', Rule::in(['Tunisie'])],
            'region' => ['required', 'string', 'max:120', Rule::in($regions)],
            'city' => ['required', 'string', 'max:120'],
            'postal_code' => ['required', 'digits:4'],
            'phone' => ['required', 'string', 'max:20', 'regex:/^(?:\\+216\\s?)?\\d{8}$/'],
            'note' => ['nullable', 'string', 'max:255'],
        ];
    }
}
