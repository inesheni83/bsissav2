<?php

namespace App\Http\Controllers\DeliveryFee;

use App\Http\Controllers\Controller;
use App\Models\DeliveryFee;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DeliveryFeeController extends Controller
{
    public function index(Request $request): Response
    {
        $query = DeliveryFee::query();

        // Filtres
        if ($request->filled('is_active')) {
            $query->where('is_active', $request->is_active === 'true');
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('delivery_person_name', 'like', "%{$search}%")
                  ->orWhere('delivery_person_phone', 'like', "%{$search}%");
            });
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $deliveryFees = $query->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (DeliveryFee $fee) => [
                'id' => $fee->id,
                'delivery_person_name' => $fee->delivery_person_name,
                'delivery_person_phone' => $fee->delivery_person_phone,
                'amount' => (float) $fee->amount,
                'is_active' => $fee->is_active,
                'created_at' => $fee->created_at->format('d/m/Y H:i'),
            ]);

        return Inertia::render('admin/deliveryFees/index', [
            'deliveryFees' => $deliveryFees,
            'filters' => $request->only(['is_active', 'search', 'date_from', 'date_to']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/deliveryFees/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'delivery_person_name' => ['required', 'string', 'max:100'],
            'delivery_person_phone' => ['required', 'string', 'max:20'],
            'amount' => ['required', 'numeric', 'min:0'],
            'is_active' => ['boolean'],
            'notes' => ['nullable', 'string'],
        ]);

        DeliveryFee::create($validated);

        return redirect()
            ->route('admin.delivery-fees.index')
            ->with('success', 'Frais de livraison ajouté avec succès.');
    }

    public function edit(DeliveryFee $deliveryFee): Response
    {
        return Inertia::render('admin/deliveryFees/edit', [
            'deliveryFee' => [
                'id' => $deliveryFee->id,
                'delivery_person_name' => $deliveryFee->delivery_person_name,
                'delivery_person_phone' => $deliveryFee->delivery_person_phone,
                'amount' => (float) $deliveryFee->amount,
                'is_active' => $deliveryFee->is_active,
                'notes' => $deliveryFee->notes,
            ],
        ]);
    }

    public function update(Request $request, DeliveryFee $deliveryFee): RedirectResponse
    {
        $validated = $request->validate([
            'delivery_person_name' => ['required', 'string', 'max:100'],
            'delivery_person_phone' => ['required', 'string', 'max:20'],
            'amount' => ['required', 'numeric', 'min:0'],
            'is_active' => ['boolean'],
            'notes' => ['nullable', 'string'],
        ]);

        $deliveryFee->update($validated);

        return redirect()
            ->route('admin.delivery-fees.index')
            ->with('success', 'Frais de livraison modifié avec succès.');
    }

    public function destroy(DeliveryFee $deliveryFee): RedirectResponse
    {
        $deliveryFee->delete();

        return redirect()
            ->route('admin.delivery-fees.index')
            ->with('success', 'Frais de livraison supprimé avec succès.');
    }
}
