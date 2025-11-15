<?php

namespace App\Http\Controllers;

use App\Http\Requests\Cart\AddCartItemRequest;
use App\Http\Requests\Cart\UpdateCartItemRequest;
use App\Models\CartItem;
use App\Models\DeliveryFee;
use App\Models\Product;
use App\Services\CartService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function __construct(private CartService $cartService)
    {
    }

    public function index(): Response
    {
        $items = $this->cartService->getCartItems();
        $summary = $this->cartService->getSummary();

        // Récupérer les frais de livraison actifs
        $activeDeliveryFee = DeliveryFee::where('is_active', true)->first();
        $deliveryFee = $activeDeliveryFee ? (float) $activeDeliveryFee->amount : 0;

        // Formater les données des items avec les informations de poids
        $items->getCollection()->transform(function ($item) {
            return [
                'id' => $item->id,
                'quantity' => $item->quantity,
                'unit_price' => $item->unit_price,
                'total_price' => $item->total_price,
                'product' => [
                    'id' => $item->product->id,
                    'name' => $item->product->name,
                    'image' => $item->product->image,
                    'price' => $item->product->price,
                ],
                'weight_variant' => $item->weightVariant ? [
                    'id' => $item->weightVariant->id,
                    'weight_value' => $item->weightVariant->weight_value,
                    'weight_unit' => $item->weightVariant->weight_unit,
                    'price' => (float) $item->weightVariant->price,
                    'promotional_price' => $item->weightVariant->promotional_price ? (float) $item->weightVariant->promotional_price : null,
                ] : null,
            ];
        });

        return Inertia::render('cart/index', [
            'items' => $items,
            'summary' => $summary,
            'deliveryFee' => $deliveryFee,
            'savedNote' => '',
        ]);
    }

    public function store(AddCartItemRequest $request): RedirectResponse
    {
        $product = Product::findOrFail($request->validated('product_id'));
        $quantity = (int) $request->validated('quantity');
        $variantId = (int) $request->validated('variant_id');

        $this->cartService->addItem($product, $quantity, $variantId);

        return back()->with('success', 'Produit ajoute au panier.');
    }

    public function update(UpdateCartItemRequest $request, CartItem $cartItem): RedirectResponse
    {
        $this->ensureOwnership($cartItem);

        $this->cartService->updateItem(
            $cartItem,
            (int) $request->validated('quantity')
        );

        return back()->with('success', 'Panier mis a jour.');
    }

    public function destroy(CartItem $cartItem): RedirectResponse
    {
        $this->ensureOwnership($cartItem);

        $this->cartService->removeItem($cartItem);

        if ($this->cartService->getSummary()['items_count'] === 0) {
            session()->forget('checkout.delivery');
        }

        return back()->with('success', 'Produit retire du panier.');
    }

    public function clear(): RedirectResponse
    {
        $this->cartService->clear();

        return back()->with('success', 'Panier vide.');
    }

    private function ensureOwnership(CartItem $cartItem): void
    {
        $owner = $this->cartService->getOwner();

        $matchesUser = $owner['user_id'] && $cartItem->user_id === $owner['user_id'];
        $matchesSession = !$owner['user_id'] && $cartItem->session_id === $owner['session_id'];

        abort_unless($matchesUser || $matchesSession, 403);
    }
}
