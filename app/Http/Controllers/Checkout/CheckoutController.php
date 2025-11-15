<?php

namespace App\Http\Controllers\Checkout;

use App\Http\Controllers\Controller;
use App\Http\Requests\Checkout\StoreCheckoutRequest;
use App\Models\DeliveryFee;
use App\Models\Order;
use App\Services\CartService;
use App\Support\OrderPresenter;
use App\Support\TunisiaRegions;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function __construct(private CartService $cartService)
    {
    }

    public function show(): Response|RedirectResponse
    {
        $summary = $this->cartService->getSummary();

        if ($summary['items_count'] === 0) {
            return redirect()
                ->route('cart.index')
                ->with('error', 'Votre panier est vide, ajoutez des articles avant de continuer.');
        }

        $items = $this->cartService->getItems();

        // Récupérer les frais de livraison actifs
        $activeDeliveryFee = DeliveryFee::where('is_active', true)->first();
        $deliveryFee = $activeDeliveryFee ? (float) $activeDeliveryFee->amount : 0;

        // Préparer les données du client connecté pour pré-remplir le formulaire
        $user = Auth::user();
        $userInfo = null;

        if ($user) {
            $userInfo = [
                'name' => $user->name,
                'phone' => $user->phone,
                'address_line1' => $user->address_line1,
                'address_line2' => $user->address_line2,
                'city' => $user->city,
                'state' => $user->state,
                'postal_code' => $user->postal_code,
                'country' => $user->country,
            ];
        }

        return Inertia::render('checkout/index', [
            'items' => $items,
            'summary' => $summary,
            'deliveryFee' => $deliveryFee,
            'delivery' => session('checkout.delivery'),
            'regions' => TunisiaRegions::all(),
            'userInfo' => $userInfo,
        ]);
    }

    public function store(StoreCheckoutRequest $request): RedirectResponse
    {
        $summary = $this->cartService->getSummary();

        if ($summary['items_count'] === 0) {
            return redirect()
                ->route('cart.index')
                ->with('error', 'Votre panier est vide, ajoutez des articles avant de continuer.');
        }

        $data = $request->validated();

        session()->put('checkout.delivery', $data);

        $order = $this->cartService->finalizeCheckout($data);

        if (Auth::check() && $order->user_id) {
            return redirect()
                ->route('orders.show', $order)
                ->with('success', 'Votre commande a ete confirmee.');
        }

        return redirect()
            ->route('checkout.confirmation', $order)
            ->with('success', 'Votre commande a ete confirmee.');
    }

    public function confirmation(Order $order): Response
    {
        $owner = $this->cartService->getOwner();

        $matchesUser = $owner['user_id'] && $order->user_id === $owner['user_id'];
        $matchesSession = !$owner['user_id'] && $order->session_id === $owner['session_id'];

        abort_unless($matchesUser || $matchesSession, 403);

        return Inertia::render('orders/show', [
            'order' => OrderPresenter::detail($order),
            'statusMeta' => Order::STATUS_META,
        ]);
    }
}
